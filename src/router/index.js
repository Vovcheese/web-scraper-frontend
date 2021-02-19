import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index';
// import Home from '../views/Home.vue';
import Sites from '../views/sites/Index.vue';
import Translations from '../views/translations/Index.vue';
import Login from '../components/Login.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/translations/:siteId',
      name: 'Translations',
      component: Translations,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/sites',
      name: 'Sites',
      component: Sites,
      meta: {
        requiresAuth: true,
      },
    },
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next('/login');
  } else {
    next();
  }
});

export default router;
