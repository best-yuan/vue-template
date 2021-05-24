import axios from "axios";
import store from "@/store";
import { Toast } from "vant";
import { api } from "@/config";
console.log(store);
import { stringifyParms } from "@/utils/core";
class Service {
  baseConfig = {
    baseURL: api.base_api,
    withCredentials: true, // send cookies when cross-domain requests
    headers: {},
    timeout: 8000
  };

  // axios实例
  instance = null;
  constructor() {
    const token = store.getters.token;
    if (token) {
      this.setHeader({
        Authorization: store.getters.tokenType + " " + token
      });
    } else {
      this.initInstance();
    }
  }

  // 设置请求头
  setHeader = headers => {
    this.baseConfig.headers = { ...this.baseConfig.headers, ...headers };
    this.initInstance();
  };

  // get请求
  get = (url, data = {}, config = {}) =>
    this.instance({ ...{ url, method: "get", params: data }, ...config });

  // post请求
  post = (url, data = {}, config = {}) =>
    this.instance({
      ...{ url, method: "post", data: stringifyParms(data) },
      ...config
    });

  // 不经过统一的axios实例的get请求
  postOnly = (url, data = {}, config = {}) =>
    axios({
      ...this.baseConfig,
      ...{ url, method: "post", data },
      ...config
    });

  // 不经过统一的axios实例的post请求
  getOnly = (url, data = {}, config = {}) =>
    axios({
      ...this.baseConfig,
      ...{ url, method: "get", params: data },
      ...config
    });

  // delete请求
  deleteBody = (url, data = {}, config = {}) =>
    this.instance({ ...{ url, method: "delete", data }, ...config });

  deleteParam = (url, data = {}, config = {}) =>
    this.instance({ ...{ url, method: "delete", params: data }, ...config });

  initInstance() {
    this.instance = axios.create(this.baseConfig);
    this.setReqInterceptors();
    this.setResnterceptors();
  }

  // 请求拦截器
  setReqInterceptors = () => {
    this.instance.interceptors.request.use(
      config => {
        // 不传递默认开启loading
        if (!config.hideloading) {
          // loading
          Toast.loading({
            forbidClick: true
          });
        }
        return config;
      },
      err => {
        Toast({
          message: "请求失败"
        });
        return Promise.reject(err);
      }
    );
  };

  // 响应拦截器
  setResnterceptors = () => {
    this.instance.interceptors.response.use(
      res => {
        Toast.clear();
        const { status, data, msg } = res.data;
        if (status === "0") {
          return data;
        } else {
          Toast({
            message: msg
          });
          // 登录超时,重新登录
          if (status === 401) {
            store.dispatch("user/fedLogOut").then(() => {
              location.reload();
            });
          }
          return Promise.reject(res || "error");
        }
      },
      err => {
        Toast.clear();
        Toast({
          message: "服务器响应失败"
        });
        return Promise.reject(err);
      }
    );
  };
}

export default new Service();
