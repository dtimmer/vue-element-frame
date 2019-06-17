const state = {
  includeNameList: [] // 不被缓存项
};
const mutations = {
  // 增加缓存的路由
  addInclude(state, name) {
    const theNmae = state.includeNameList.findIndex(el => el == name);
    if (theNmae < 0) {
      state.includeNameList.push(name);
    }
  },
  // 删除缓存的路由
  delInclude(state, name) {
    const index = state.includeNameList.findIndex(el => el == name);
    if (index >= 0) {
      state.includeNameList.splice(index, 1);
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
