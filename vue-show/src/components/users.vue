<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>用户管理</a-breadcrumb-item>
      <a-breadcrumb-item>用户列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <!-- 添加用户 start-->
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

              <a-col :span="8">
                <a-button type="primary" size="large"> 添加用户 </a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
      <!-- 添加用户 end-->
      <!-- 表格 start -->
      <a-table :columns="tablecolumns" :data-source="tableData" bordered>
        <template #mg_state="{ text }">
          <a-switch :checked="text.mg_state" />
        </template>
        <!-- 三个小按钮 -->
        <template #operation>
          <a-button type="primary">
            <template #icon><EditOutlined /> </template>
          </a-button>
          <a-button type="danger" style="margin: 0 10px">
            <template #icon><DeleteOutlined /> </template>
          </a-button>
          <a-button style="background-color: #e8a23b; color: #fff">
            <template #icon><SettingOutlined /> </template>
          </a-button>
        </template>
      </a-table>

      <!-- 表格 end -->
    </div>
  </div>
</template>

<script>
import { httpGet } from "../utils/http";
// 引入请求路径
import { user } from "../api";
import {
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";

export default {
  components: {
    EditOutlined,
    DeleteOutlined,
    SettingOutlined,
  },
  data() {
    return {
      // 获取的数据
      tableData: [],
      tablecolumns: [
        { title: "#", dataIndex: "index", key: "index" },
        { title: "姓名", dataIndex: "username", key: "username" },
        { title: "邮箱", dataIndex: "email", key: "email" },
        { title: "电话", dataIndex: "create_time", key: "create_time" },
        { title: "角色", dataIndex: "role_name", key: "role_name" },
        { title: "状态", key: "mg_state", slots: { customRender: "mg_state" } },
        { title: "操作", key: "age", slots: { customRender: "operation" } },
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
            // console.log(this.tableData);
            this.tableData.forEach((element, index) => {
              element.index = index + 1;
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
.l {
  margin: 0 10px;
  background-color: #e8a23b;
  color: #fff;
}
</style>
