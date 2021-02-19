import Vue from 'vue';
import Axios from 'axios';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueMeta from 'vue-meta';
import { TOKEN_KEY } from '@/utils/Constants';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/app.scss';

Vue.prototype.$http = Axios;

Vue.use(VueMeta);
Vue.use(Element);

const token = localStorage.getItem(TOKEN_KEY);

if (token) {
  Vue.prototype.$http.defaults.headers.common.Authorization = token;
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
