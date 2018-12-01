import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import VueSmartRoute from '..'

Vue.use(VueRouter);
Vue.use(VueSmartRoute);

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      name: 'home',
      path: '/',
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
      component: () => import('./About.vue'),
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
      component: () => import('./Search.vue'),
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
      component: () => import('./SendMail.vue'),
      smart: {
        matcher: {
          search: [
            /(?<email>[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)/i,
            /(?<email>[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)\s+(?<subject>\w+)/i
          ],
          title ({ email, subject }) {
            if (subject) {
              return `Send email to *${email}* with subject *${subject}*`
            }
            return `Send email to *${email}*`
          }
        },
        handler(route, next) {
          if (route.query.subject) {
            location.href = `mailto:${route.query.email}?subject=${route.query.subject}`
            next(route)
            return
          }
          location.href = `mailto:${route.query.email}`
          next(route)
        }
      }
    }
  ]
});

new Vue({
  el: '#app',
  router,
  render(createElement) {
    return createElement(App)
  }
});
