import { utilHttp } from "@/main";
import { resolve } from "path";
const state = {
  menus: [] // 菜单
};

const mutations = {
  setMenus(state, arr) {
    state.menus = arr;
  }
};

const actions = {
  getMenus({ commit }) {
    return new Promise(resolve => {
      utilHttp
        .get("/base/func.json")
        .then(({ functionModels }) => {
          commit("setMenus", functionModels || []);
          resolve(functionModels);
        })
        .catch(err => {
          console.error(err);
        });
    });
  }
};

const getters = {
  menus(state) {
    return state.menus;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
