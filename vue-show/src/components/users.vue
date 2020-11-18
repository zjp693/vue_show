<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>用户管理</a-breadcrumb-item>
      <a-breadcrumb-item>用户列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <a-form>
        <a-row>
          <a-col :span="12">
            <a-row :gutter="18">
              <a-col :span="16">
                <a-form-item :wrapperCol="{ span: 24 }">
                  <!-- 搜索框 -->
                  <a-input-search size="large" placeholder="请输入内容" />
                </a-form-item>
              </a-col>
              <!-- 添加有用户 -->
              <a-col :span="8">
                <a-button type="primary" size="large"> 添加用户 </a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script>
import { httpGet } from "../utils/http";
// 引入请求路径
import { user } from "../api";
export default {
  data() {
    return {
      // 获取的数据
      tableData: [],
      tablecolumns: [
        { title: "#", dataIndex: "", key: "" },
        { title: "姓名", dataIndex: "username", key: "username" },
        { title: "邮箱", dataIndex: "email", key: "email" },
        { title: "电话", dataIndex: "create_time", key: "create_time" },
        { title: "角色", dataIndex: "role_name", key: "role_name" },
        { title: "状态", key: "mg_state" },
        { title: "操作", dataIndex: "age", key: "age" },
      ],
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      httpGet(user.GetUsers, {
        pagenum: 1,
        pagesize: 2,
      })
        .then((response) => {
          console.log(response);
          let { meta, data } = response;

          if (meta.status == 200) {
            this.tableData = data.users;
            console.log(this.tableData);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style></style>
