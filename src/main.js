//axios——设置请求
import axios from "axios";
import Vue from "vue";
import app from "./plugins/common";
import "./plugins/element.js";
app.$eventBus = new Vue();
const fn = Vue.prototype;
// 请求池
const requests = [];
let loadCount = 0; //http计数器
const http = axios.create({
  // baseURL: "/api/v2",
  baseURL: process.env.NODE_ENV === "production" ? "/vue-element-frame/testData" : "/testData",
  data: {},
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Accept: "application/json"
  }
});
let baseURL = "";
let baseOpenLink = "/api/v2/";
switch (process.env.NODE_ENV) {
  case "production": // 上线版本
    baseURL = "";
    break;
  case "development": // 开发版本
    baseURL = "/api/v2";
    break;
}
/**
 * get请求不需要loading则加入notLoading: true,
 * get请求需要缓存则加入cache: true
 */
let loading;
let canCloseLoading = true;

app.$nextTick(() => {
  app.$eventBus.$on("canCloseLoading", val => {
    if (val) {
      loading && loading.close();
      loading = null;
    }
    canCloseLoading = val;
  });
});
const CancelToken = axios.CancelToken;
const qs = require("querystring");
// 缓存
const cache = {};
// 请求前
http.interceptors.request.use(
  config => {
    loadCount++;
    if (!loading) {
      let notLoading = (config.params && config.params.notLoading) || (config.data && config.data.notLoading);
      if (!notLoading) {
        // 火狐下，loading未关闭，需这样处理
        if (app) {
          app.$nextTick(() => {
            loading = app.$loading({
              lock: true,
              text: "加载中...",
              spinner: "el-icon-loading",
              background: "rgba(255, 255, 255, 0.7)"
            });
          });
        }
      }
    }
    // 登录接口特别设置
    if (process.env.NODE_ENV != "development") {
      config.url = baseURL + config.url;
    }
    // 塞入请求池
    config.data = config.data || {};
    let cancelToken = config.data.cancelToken ? config.data.cancelToken : CancelToken.source();
    requests.push(cancelToken);
    config.data.cancelToken = cancelToken;
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
//请求后
http.interceptors.response.use(
  res => {
    loadCount--;
    if (!loadCount) {
      // ie9下，从登录页面进行登录后跳转，loading不消失，放在队列最后
      app.$nextTick(() => {
        if (canCloseLoading) {
          loading && loading.close();
          loading = null;
        }
      });
    }
    let isCache = res.config.params && res.config.params.cache;
    let url = res.config.url;
    let tempParams = Object.assign({}, res.config.params);
    delete tempParams.get_time;
    let params = url + qs.stringify(tempParams);
    let verify = data => {
      let code = res.data.code;
      if (res.data.code == "SUCCESS" && res.config.url == "/api/v2/event/pigherds/EndMonthPigherd") {
        return res.data;
      } else if (res.data.code == "SUCCESS") {
        // 缓存
        if (isCache) {
          cache[params].xhrData = app.$extend(data);
          if (cache[params].onSuccess && cache[params].onSuccess.length) {
            cache[params].onSuccess.forEach(func => {
              func && func(data);
            });
            cache[params].onSuccess.splice(0);
          }
        }
        return data;
      } else if (code == "USER_LOGIN_REQUIRED") {
        if (cache[params]) {
          cache[params].isLoad = false;
        }
        app.$message({
          //用户未登录
          message: "请重新登录",
          type: "warning",
          showClose: true
        });
        app.$router.push("/login");
        return Promise.reject();
      } else {
        if (cache[params]) {
          cache[params].isLoad = false;
        }
        app.$message({
          message: res.data.msg || "系统错误",
          type: "error",
          showClose: true,
          dangerouslyUseHTMLString: true
        });
        return Promise.reject(res.data);
      }
    };
    return verify(res.data.data);
  },
  err => {
    loadCount--;
    //正则判断超时
    let rg = /8000/g;
    if (!loadCount) {
      loading && loading.close();
      loading = null;
    }
    if (rg.test(err)) {
      app.$message({
        message: "您的网络不给力喔,请刷新重试",
        type: "warning",
        showClose: true
      });
    } else if (err.message && err.message == "cancel") {
      // ...手动关闭请求，不做任何操作
    } else {
      app.$message({
        message: "服务器错误,请联系运营人员",
        type: "warning",
        showClose: true
      });
    }
    return Promise.reject(err);
  }
);

// 接口缓存设置
class newHttp {
  constructor() {
    this.http = http;
  }
  get(url, params) {
    // 缓存
    let isCache = params && params.params && params.params.cache;
    if (isCache) {
      let cacheurl = baseOpenLink + (url.charAt(0) == "/" ? url.substr(1) : url);
      let cacheParams = cacheurl + qs.stringify(params.params);
      if (!cache[cacheParams]) {
        cache[cacheParams] = {
          xhrData: null,
          isLoad: false
        };
      }
      if (cache[cacheParams].isLoad) {
        if (cache[cacheParams].xhrData) {
          return new Promise(resolve => {
            resolve(cache[cacheParams].xhrData);
          });
        } else {
          // 多个一样的api同时请求，完成后遍历
          return new Promise(resolve => {
            if (!cache[cacheParams].onSuccess) {
              cache[cacheParams].onSuccess = [];
            }
            cache[cacheParams].onSuccess.push(data => {
              resolve(data);
            });
          });
        }
      } else {
        cache[cacheParams].isLoad = true;
        if (params) {
          if (params.params) {
            params.params.get_time = +Date.now();
          } else {
            params.params = { get_time: +Date.now() };
          }
        } else {
          params = { params: { get_time: +Date.now() } };
        }
        return this.http.get(url, params);
      }
    } else {
      if (params) {
        if (params.params) {
          params.params.get_time = +Date.now();
        } else {
          params.params = { get_time: +Date.now() };
        }
      } else {
        params = { params: { get_time: +Date.now() } };
      }
      return this.http.get(url, params);
    }
  }
  post(url, params) {
    return this.http.post(url, params);
  }
  put(url, params) {
    return this.http.put(url, params);
  }
  delete(url, params) {
    return this.http.delete(url, params);
  }
}
const utilHttp = new newHttp();
fn.$http = utilHttp;
export { utilHttp, baseURL, baseOpenLink, requests, cache };
