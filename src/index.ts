import type { App, AppConfig } from 'vue'
import { ref } from 'vue'
import {
  Query,
  SplitMatchResult,
  SmartRouteMetaOptions,
  SmartRouteRecord
} from './types'

function flattenRoutes(routes: SmartRouteRecord[] = [], level: number = 0): SmartRouteRecord[] {
  if (Array.isArray(routes)) {
    return routes.reduce(
      (accumulator: SmartRouteRecord[], { name, path, children = [], meta }) => {
        const newMeta = { ...meta, level }
        accumulator.push({ name, path, children, meta: newMeta });
        if (children && children.length) {
          accumulator = accumulator.concat(flattenRoutes(children, level + 1));
        }
        return accumulator;
      },
      []
    );
  }
  return [];
}

function splitMatch(path: string, query: Query): SplitMatchResult {
  const matches = path.match(/(:[0-9a-z_\-]+)/gi);
  if (!matches) return { query, params: {} };

  const params = matches.map(m => m.slice(1).trim());
  const splitted: SplitMatchResult = { query: {}, params: {} };
  Object.keys(query).forEach(key => {
    splitted[params.includes(key) ? 'params' : 'query'][key] = query[key];
  });
  return splitted;
}

function buildRoute(route: any, title: string, smart: SmartRouteMetaOptions, next: Function) {
  return {
    ...route,
    title: title.replace(/\*([^*]+)\*/g, '<mark>$1</mark>'),
    handler: () => smart.handler!(route, next)
  };
}

async function findSmartRoutes(value: string, config: AppConfig) {

  const routes: SmartRouteRecord[] = config.globalProperties.$router.getRoutes();

  const allRoutes = flattenRoutes(routes);

  // Find Smart Routes
  const smartRoutes = allRoutes
    .filter(route => route.meta?.smart)
    .map(({ name, path, meta }) => ({ name, path, meta }));
  
  // Find Matching Routes with the Value
  const matchingRoutes = smartRoutes.map(async ({ name, path, meta }) => {
    if (!meta?.smart || !meta?.smart.matcher) {
      throw new Error('Smart routes must have matchers!');
    }

    const next = (route: any) => config.globalProperties.$router.push(route);
    if (!meta?.smart.handler) {
      meta.smart.handler = next;
    }

    const matching = (typeof meta?.smart.matcher.search === 'function'
      ? meta?.smart.matcher.search(config.globalProperties)
      : meta?.smart.matcher.search
    )
      .map((matcher: any) => value.toString().match(matcher))
      .filter(Boolean);

    const routes = await Promise.all(
      matching.map(async (match: any) => {
        if (!match) return;
        const query = match.groups ? match.groups : match;
        const route = {
          name,
          path,
          ...splitMatch(path, match.groups)
        };

        if (typeof meta.smart?.matcher?.routes === 'function') {
          const routesToBuild = await meta?.smart.matcher.routes(query);
          return routesToBuild.map((r: any) => buildRoute(r, r.title, meta?.smart!, next));
        }

        const title = meta?.smart?.matcher?.title(query);
        return buildRoute(route, title!, meta?.smart!, next);
      })
    );
    return [].concat.apply([], routes).filter(Boolean);
  });
  const doneRoutes = await Promise.all(matchingRoutes);
  return [].concat(...doneRoutes);
}


export default {
  install(app: App) {
    const valueRef = ref('');
    app.directive('smart-routes', {
      async updated(el, binding, vnode: any, oldVnode: any) {
        if (valueRef.value != el.value) {
          valueRef.value = el.value;
          const smartRoutes = await findSmartRoutes(String(el.value), app.config);
          binding.value(smartRoutes)
        }
      }
    });
  }
}