<template>
  <a-breadcrumb style="margin: 16px 0">
    <a-breadcrumb-item style="font-weight: bold; color: #000">
      <router-link to="/home">首页</router-link>
    </a-breadcrumb-item>
    <a-breadcrumb-item>用户管理</a-breadcrumb-item>
    <a-breadcrumb-item>用户列表</a-breadcrumb-item>
  </a-breadcrumb>
  <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
    Wellcome
  </div>
  
</template>

<script>
export default {};
</script>

<style>
.kkk {
  font-weight: bold;
  color: #000;
}
</style>
