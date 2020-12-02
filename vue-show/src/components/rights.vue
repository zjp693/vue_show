<template>
  <a-layout>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item
        ><router-link to="/home" style="font-weight: bold; color: #000"
          >首页</router-link
        ></a-breadcrumb-item
      >
      <a-breadcrumb-item>权限管理</a-breadcrumb-item>
      <a-breadcrumb-item>权限列表</a-breadcrumb-item>
    </a-breadcrumb>
    <a-table
      :columns="rightsColumns"
      :data-source="rightsData"
      :row-key="record => record.id"
      bordered
      :pagination="false"
    >
      <template #index="{ index }">
        <a>{{ index + 1 }}</a>
      </template>
      <template #level="{ text }">
        <!-- <a>{{ text }}</a> -->
        <a-tag color="blue" v-if="text.level == 0">一级</a-tag>
        <a-tag color="green" v-else-if="text.level == 1">二级</a-tag>
        <a-tag color="orange" v-else-if="text.level == 2">三级</a-tag>
      </template>
    </a-table>
  </a-layout>
</template>

<script>
import { httpGet } from "../utils/http";
import { rights } from "../api";
export default {
  data() {
    return {
      rightsColumns: [
        { title: "#", slots: { customRender: "index" }, key: "index" },
        { title: "权限名称", dataIndex: "authName", key: "" },
        { title: "路径", dataIndex: "path", key: "" },
        { title: "权限等级", slots: { customRender: "level" } }
      ],
      rightsData: []
    };
  },
  created() {
    this.handelGetRight();
  },
  methods: {
    handelGetRight() {
      httpGet(rights.GetRights)
        .then(res => {
          console.log(res);
          let { data, meta } = res;
          if (meta.status == 200) {
            this.rightsData = data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
.ant-tag {
  padding: 2px 14px;
  font-size: 14px;
}
</style>
