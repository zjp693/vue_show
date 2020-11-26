// 关于用户的接口
export const user = {
  LoginUser: "login", // 用户登录
  GetUsers: "users", // 获取所有用户
  AddUser: "users", //添加一个新的用户
  Delete: "users", //删除一个用户
  GetUser: "users", // 根据id查询某一个用户信息、
  updata: "users", //更新用户的信息
};

// 关于权限的接口
export const rights = {
  AsideMenus: "menus", // 获取左侧菜单权限
  GetRights: "rights/list",//获取所有角色的权限


};
//关于角色的接口
export const role = {
  GetRoule: "roles  " // 角色权限
};
