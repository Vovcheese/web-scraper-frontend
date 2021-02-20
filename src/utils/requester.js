import axios from 'axios';
import _ from 'lodash';
import qs from 'qs';
import Notify from '@/utils/Notify';
import { TOKEN_KEY } from '@/utils/Constants';

const instance = axios.create({
  baseURL: 'http://localhost:4040/api/v1',
  paramsSerializer: (params) => qs.stringify(params, {
    arrayFormat: 'repeat',
  }),
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token != null) {
    // eslint-disable-next-line no-param-reassign
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
}, (err) => Promise.reject(err));

instance.interceptors.response.use((r) => r, (err) => {
  if (axios.isCancel(err)) {
    return Promise.reject(err);
  }

  // eslint-disable-next-line no-prototype-builtins
  if (err.config && err.config.hasOwnProperty('errorHandle') && err.config.errorHandle === false) {
    return Promise.reject(err);
  }

  const errorStatus = _.get(err, 'response.status');
  const errorType = _.get(err, 'response.data.error.type');

  let title = 'Ошибка';
  let message = '–';
  const opts = {};

  if (errorType === 'token_expired') {
    title = 'Ошибка';
    message = 'Сессия истекла';
  }

  // if (errorStatus === 401) {
  //   if (window.location.pathname !== '/login') {
  //     const redirect = String(window.location.pathname);

  //     router.push({
  //       path: '/logout',
  //       query: {
  //         redirect,
  //       },
  //     });
  //   }
  // }

  if (errorStatus === 403) {
    title = 'Ошибка';
    message = 'У вас нет доступа';

    window.location.replace('/login');
  }

  Notify.error({
    title,
    message,
    ...opts,
  });

  return Promise.reject(err);
});

window.axios = instance;

export default instance;
