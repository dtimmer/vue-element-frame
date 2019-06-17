import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login";
import store from "@/store";
import app from "@/plugins/common";

Vue.use(Router);

const router = new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/",
      redirect: "login"
    },
    {
      path: "/page",
      component: () => import("./views/Pages/Page"),
      children: [
        {
          path: "404",
          name: "404",
          component: () => import("./views/Pages/404")
        },
        {
          path: "backlog",
          name: "backlog",
          component: () => import("./views/Pages/backlog")
        },
        {
          path: "testPage",
          name: "testPage",
          component: () => import("./views/Pages/testPage")
        }
      ]
    }
  ]
});

/**
 * 匹配菜单权限，如果找不到权限则导航至404
 * @param {Array} menus 用户菜单权限
 * @param {String} menu 用户正在跳转的菜单
 */
function findMenu(menus, menu) {
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].targetUri === menu) {
      return true;
    }
    if (menus[i].child && menus[i].child) {
      if (findMenu(menus[i].child, menu)) {
        return true;
      }
    }
  }
  return false;
}

router.beforeEach((to, from, next) => {
  // 除开登录页面，可能还有404等，其他页面都需要权限验证
  if (to.name === "login") {
    next();
  } else if (!store.getters.menus.length) {
    setTimeout(() => {
      store.dispatch("getMenus").then(res => {
        if (!res || !res.length) {
          app.$message({
            type: "warning",
            message: "没有此用户的功能,请重新登录",
            showClose: true
          });
          return false;
        }
        if (findMenu(res, to.name)) {
          next();
        } else {
          next({ name: "404" });
        }
      });
    }, 0);
  } else if (to.name === "404") {
    next();
  } else if (findMenu(store.getters.menus, to.name)) {
    next();
  } else {
    next({ name: "404" });
  }
});

export default router;
