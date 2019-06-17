import Vue from "vue";
import Vuex from "vuex";
import baseData from "./baseData";
import tab from "./tab";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    baseData,
    tab
  }
});
