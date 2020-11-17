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
      <a-menu theme="dark" v-model:selectedKeys="selectedKeys" mode="inline">
        <a-sub-menu key="sub1">
          <template #title>
            <span><user-outlined /><span>用户管理</span></span>
          </template>
          <a-menu-item key="3">
            <WindowsOutlined />
            <span
              ><router-link to="/userlist"
                ><span>用户列表</span></router-link
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
} from "@ant-design/icons-vue";

export default {
  components: {
    UserOutlined,
    WindowsOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  },
  data() {
    return {
      collapsed: false,
      selectedKeys: ["1"],
    };
  },
  methods: {
    out() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
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
.ant-layout span {
  color: #ffffff;
}
</style>
