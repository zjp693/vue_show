// 关于用户的接口
export const user = {
  LoginUser: "login", // 用户登录
  GetUsers: "users", // 获取所有用户
  AddUser: "users", //添加一个新的用户
  Delete: "users", //删除一个用户
  GetUser: "users", // 根据id查询某一个用户信息、
  updata: "users" //更新用户的信息
};

// 关于权限的接口
export const rights = {
  AsideMenus: "menus", // 获取左侧菜单权限
  GetRights: "rights/list", //获取所有角色的权限
  GetTreeRights: "rights/tree" //
};

//关于角色的接口
export const role = {
  GetRoule: "roles", // 角色权限
  AddRoule: "roles" //添加角色
};

// 关于订单的接口
export const order = {
  GetOrders: "orders" //订单的接口
};

// 关于商品的接口
export const goods = {
  GetGoods: "goods", //获取商品列表
  GetCategories: "categories", // 获取商品分类
  AddGoods: "goods"
};
