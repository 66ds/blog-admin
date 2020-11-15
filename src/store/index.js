import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: ''
    },
    getters: {
        getToken(state) {
            return state.token;
        }
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
        }
    },
    //异步调用
    //context.commit
    //this.$store.dispatch
    actions: {}
    ,
    modules: {},
    plugins: [createPersistedState({
        storage: window.localStorage
    })]
});
