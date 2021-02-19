import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import requester from '@/utils/requester';
import { TOKEN_KEY } from '@/utils/Constants';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem(TOKEN_KEY) || '',
    user: {},
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request');

        requester.post('auth/login', user).then((resp) => {
          const token = resp.data.accessToken;
          // eslint-disable-next-line no-shadow
          const { user } = resp.data;
          localStorage.setItem(TOKEN_KEY, token);
          axios.defaults.headers.common.Authorization = token;
          commit('auth_success', token, user);
          resolve(resp);
        })
          .catch((err) => {
            commit('auth_error');
            localStorage.removeItem(TOKEN_KEY);
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout');
        localStorage.removeItem(TOKEN_KEY);
        delete axios.defaults.headers.common.Authorization;
        resolve();
      });
    },
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, token, user) {
      state.status = 'success';
      state.token = token;
      state.user = user;
    },
    auth_error(state) {
      state.status = 'error';
    },
    logout(state) {
      state.status = '';
      state.token = '';
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
  },
});
