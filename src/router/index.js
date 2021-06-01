import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
export const router = [
  {
    path: "/",
    name: "index",
    component: () => import("@/views/home/index"),
    meta: {
      keepAlive: false
    }
  },
  {
    path: "/404",
    name: "error",
    component: () => import("@/views/home/error"),
    meta: {
      keepAlive: false
    }
  }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // 如果你是 history模式 需要配置vue.config.js publicPath
    // base: '/app/',
    scrollBehavior(to, from, savedPosition) {
      // keep-alive 返回缓存页面后记录浏览位置
      if (savedPosition && to.meta.keepAlive) {
        return savedPosition;
      } // 异步滚动操作
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ x: 0, y: 1 });
        }, 0);
      });
    },
    routes: router
  });

export default createRouter();
