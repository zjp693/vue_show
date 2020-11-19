<template>
  <a-layout
    id="components-layout-demo-side"
    style="min-height: 100vh"
    class="home"
  >
    <!-- 侧边栏 stant -->
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">
        <router-link to="/home">
          <img src="../assets/logo.png" alt="" />
          <span class="">后台管理系统</span>
        </router-link>
      </div>
      <a-menu
        theme="dark"
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        :open-keys="openKeys"
        @openChange="onOpenChange"
      >
        <a-sub-menu :key="item.id" v-for="item in menulist">
          <!-- 一级目录 start-->
          <template #title v-if="item.path == 'users'">
            <span
              ><user-outlined /><span>{{ item.authName }}</span>
            </span>
          </template>
          <template #title v-else-if="item.path == 'rights'">
            <span
              ><CodeSandboxOutlined /><span>{{ item.authName }}</span>
            </span>
          </template>
          <template #title v-else-if="item.path == 'goods'">
            <span
              ><ShoppingOutlined /><span>{{ item.authName }}</span>
            </span>
          </template>
          <template #title v-else-if="item.path == 'orders'">
            <span
              ><ContainerOutlined /><span>{{ item.authName }}</span>
            </span>
          </template>
          <template #title v-else-if="item.path == 'reports'">
            <span
              ><AreaChartOutlined /><span>{{ item.authName }}</span>
            </span>
          </template>
          <!-- 一级目录 end -->
          <a-menu-item :key="subitem.id" v-for="subitem in item.children">
            <WindowsOutlined />
            <span
              ><router-link :to="subitem.path" class="span"
                ><span>{{ subitem.authName }}</span></router-link
              ></span
            >
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <!-- 侧边栏 end -->
    <!-- 内容区域 stant -->
    <a-layout class="content">
      <!-- 头部 -->
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <a-button class="button" @click="out">退出</a-button>
      </a-layout-header>

      <a-layout-content style="margin: 0 16px">
        <!-- 组件渲染 start -->
        <router-view></router-view>
        <!-- 组件渲染 -->
      </a-layout-content>
    </a-layout>
    <!-- 内容区域 ent -->
  </a-layout>
</template>

<script>
import {
  UserOutlined,
  WindowsOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CodeSandboxOutlined,
  ShoppingOutlined,
  ContainerOutlined,
  AreaChartOutlined,
} from "@ant-design/icons-vue";

// 引入请求方式httpGet
import { httpGet } from "../utils/http";
// 引入请求路径
import { rights } from "../api";

export default {
  created() {
    this.getMenuList();
  },
  components: {
    UserOutlined,
    WindowsOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    CodeSandboxOutlined,
    ShoppingOutlined,
    ContainerOutlined,
    AreaChartOutlined,
  },
  data() {
    return {
      collapsed: false,
      selectedKeys: ["1"],
      // 侧边栏菜单
      menulist: [],
      // 默认打开的哪一项
      openKeys: [],
      // 所有项
      rootSubmenuKeys: [],
    };
  },
  methods: {
    out() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    // 获取数据
    getMenuList() {
      httpGet(rights.AsideMenus)
        .then((response) => {
          // console.log(response);
          let { data, meta } = response;
          // 判断数据是否获取成功
          if (meta.status == 200) {
            this.menulist = data;
            // 保存一级菜单的id
            this.menulist.forEach((item) => {
              this.rootSubmenuKeys.push(item.id);
            });
            // console.log(this.rootSubmenuKeys);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 点击当前 关闭其他菜单
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        (key) => this.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
  },
};
</script>
<style scoped>
.ant-layout-header {
  margin-bottom: 0px;
}
#components-layout-demo-side .logo {
  height: 32px;
  /* background: rgba(255, 255, 255, 0.2); */
  margin: 16px;
  color: #ffffff;
  overflow: hidden;
}
#components-layout-demo-side .logo img {
  /* display: block; */
  width: 36px;
  height: 36px;
}
.logo span {
  margin-left: 15px;
  color: #ffffff;
}
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}
.ant-layout-sider-collapsed .logo span {
  display: none;
}
.content .button {
  float: right;
  margin: 16px 24px;
}
.ant-layout .span {
  color: #a6adb4;
}
.ant-layout .span :hover {
  color: #ffffff;
}
</style>
