import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import VueSmartRoute from '../src/vue-smart-route';

Vue.use(VueRouter);
Vue.use(VueSmartRoute);

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      name: 'users',
      path: '/users',
      component: () => import('./View.vue'),
      smart: {
        matcher: {
          search: [/user/],
          title: () => 'Go to users'
        }
      },
      children: [
        {
          name: 'newUser',
          path: 'new',
          component: () => import('./View.vue'),
          smart: {
            matcher: {
              search: [/user/, /new\suser(\s+(?<name>.*))?/],
              title: ({ name }) => {
                if (name) {
                  return `Create user with name *${name}*`;
                }
                return 'Create new user';
              }
            }
          }
        },
        {
          name: 'goToUser',
          path: '/user/:id',
          component: () => import('./View.vue')
        },
        {
          name: 'viewUser',
          path: 'view/:username',
          component: () => import('./View.vue'),
          smart: {
            matcher: {
              search: [
                /user\s*(?<id>\d+)/,
                /user\s*(?<username>[^\d\s]*)(\s(?<id>\d+))?/
              ],
              title: ({ username, id }) => {
                if (!username && id) {
                  return `View user with ID *${id}*`;
                }
                if (username && id) {
                  return `View user with username *${username}* and ID *${id}*`;
                }
                if (username) {
                  return `View user with username *${username}*`;
                }
                return 'View all users';
              }
            },
            handler(route, next) {
              if (!route.params.username && route.query.id) {
                next({ ...route, name: 'goToUser' });
                return;
              }
              if (!route.params.username && !route.query.id) {
                next({ name: 'users' });
                return;
              }
              next(route);
            }
          }
        }
      ]
    },
    {
      name: 'home',
      path: '/',
      component: () => import('./View.vue'),
      smart: {
        matcher: {
          search: [/home/],
          title: () => 'Go to homepage'
        }
      }
    },
    {
      name: 'about',
      path: '/about',
      component: () => import('./View.vue'),
      smart: {
        matcher: {
          search: [/about/],
          title: () => 'About us'
        }
      }
    },
    {
      name: 'search',
      path: '/search',
      component: () => import('./View.vue'),
      smart: {
        matcher: {
          search: [/^(search|q)\:?\s+(?<query>.+)/i],
          title: ({ query }) => `Search about *${query}*`
        }
      }
    },
    {
      name: 'sendMail',
      path: '/mail',
      component: () => import('./View.vue'),
      smart: {
        matcher: {
          search: [
            /(?<email>[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)/i,
            /(?<email>[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)\s+(?<subject>\w+)/i
          ],
          title({ email, subject }) {
            if (subject) {
              return `Send email to *${email}* with subject *${subject}*`;
            }
            return `Send email to *${email}*`;
          }
        }
        // handler(route, next) {
        //   if (route.params.subject) {
        //     location.href = `mailto:${route.params.email}?subject=${
        //       route.params.subject
        //     }`;
        //     next(route);
        //     return;
        //   }
        //   location.href = `mailto:${route.params.email}`;
        //   next(route);
        // }
      }
    }
  ]
});

new Vue({
  el: '#app',
  router,
  render(createElement) {
    return createElement(App);
  }
});
