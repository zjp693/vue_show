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
        name: "users",
        path: "/users",
        component: () => import("../components/users")
      },
      {
        name: "rights",
        path: "/rights",
        component: () => import("../components/rights")
      },
      {
        name: "roles",
        path: "/roles",
        component: () => import("../components/roles")
      },
      {
        name: "orders",
        path: "/orders",
        component: () => import("../components/orders")
      },
      {
        name: "reports",
        path: "/reports",
        component: () => import("../components/Reports")
      },
      // goods组件
      {
        name: "goods",
        path: "/goods",
        component: () => import("../components/Goods")
      },
      //categories 组件
      {
        name: "categories",
        path: "/categories",
        component: () => import("../components/Categories")
      },
      // Params 组件
      {
        name: "GoodsAdd",
        path: "/Goods/Add",
        component: () => import("../components/GoodsAdd")
      },
      // Params 组件
      {
        name: "Params",
        path: "/params",
        component: () => import("../components/Params")
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
