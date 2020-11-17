import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login";

const routes = [
  { path: "/", redirect: "/login" },
  // 登陆页
  {
    name: "Login",
    path: "/login",
    component: Login
  },
  // 首页
  {
    path: "/home",
    component: () => import("../views/Home"),
    children: [
      { path: "/home", redirect: "/weclome" },
      {
        name: "weclome",
        path: "/weclome",
        component: () => import("../components/Weclome")
      },
      {
        name: "userlist",
        path: "/userlist",
        component: () => import("../components/Userlist")
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});
// 路由导航守卫
// to:去哪
// form：来自哪里
router.beforeEach((to, from, next) => {
  //获取token
  let isAuthenticated = window.sessionStorage.getItem("token");
  // 去的不是login且没有授权就强制跳转到login页面
  if (to.name !== "Login" && !isAuthenticated) next({ name: "Login" });
  else next();
});
export default router;