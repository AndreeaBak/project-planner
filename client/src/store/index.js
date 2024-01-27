import { createStore } from 'vuex';
import axios from 'axios'

const store = createStore({
  state: {
    token: null, 
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    clearToken(state) {
      state.token = null;
    },
  },
  actions: {
    login({ commit }, token) {
      commit('setToken', token);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    logout({ commit }) {
      commit('clearToken');
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});

export default store;
