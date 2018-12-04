function flattenRoutes(routes = [], level = 0) {
  if (Array.isArray(routes)) {
    return routes.reduce(
      (accumulator, { name, path, smart, children = [] }) => {
        accumulator.push({ name, path, smart, children, level });
        if (children.length) {
          accumulator = accumulator.concat(flattenRoutes(children, level + 1));
        }
        return accumulator;
      },
      []
    );
  }
}

function splitMatch(path, query) {
  const matches = path.match(/(:[0-9a-z_\-]+)/gi);
  if (!matches) return { query };

  const params = matches.map(m => m.slice(1).trim());
  const splitted = { query: {}, params: {} };
  Object.keys(query).forEach(key => {
    splitted[params.includes(key) ? 'params' : 'query'][key] = query[key];
  });
  return splitted;
}

function findSmartRoutes(value, context) {
  const routes = context.$router.options.routes;
  const allRoutes = flattenRoutes(routes);

  // Find Smart Routes
  const smartRoutes = allRoutes
    .filter(route => route.smart)
    .map(({ name, path, smart }) => ({ name, path, smart }));

  // Find Matching Routes with thte Value
  const matchingRoutes = smartRoutes.map(({ name, path, smart }) => {
    if (!smart.matcher) {
      throw new Error('Smart routes must have matchers!');
    }

    const next = route => context.$router.push(route);
    if (!smart.handler) {
      smart.handler = next;
    }

    const matching = (typeof smart.matcher.search === 'function'
      ? smart.matcher.search(context)
      : smart.matcher.search
    )
      .map(matcher => value.toString().match(matcher))
      .filter(Boolean);

    return matching
      .map(match => {
        if (!match) return;
        const query = match.groups ? match.groups : match;
        const route = {
          name,
          path,
          ...splitMatch(path, match.groups)
        };
        return {
          title: smart.matcher
            .title(query, context)
            .replace(/\*([^*]+)\*/g, '<mark>$1</mark>'),
          ...route,
          handler: () => smart.handler(route, next, context)
        };
      })
      .filter(Boolean);
  });
  return [].concat(...matchingRoutes);
}

export default {
  install(Vue) {
    Vue.directive('smart-routes', {
      bind: function(el, binding, vnode) {
        var model = vnode.data.directives.filter(d => d.name === 'model');
        if (!model.length) {
          throw new Error(
            'An input with v-smart-routes directive must have v-model.'
          );
        }
        vnode.context.$watch(model[0].expression, function(value) {
          this[binding.expression] = findSmartRoutes(value, this);
        });
      }
    });
  }
};
