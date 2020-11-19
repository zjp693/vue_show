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
                <a-button type="primary" size="large" @click="showModal">
                  添加用户
                </a-button>
                <a-modal
                  v-model:visible="visible"
                  :confirm-loading="confirmLoading"
                  title="添加用户"
                  cancelText="取消"
                  okText="确定"
                >
                  <a-row>
                    <a-col :span="24">
                      <a-form>
                        <a-form-item
                          required
                          has-feedback
                          label="用户名"
                          name="name"
                          :labelCol="{ span: 3 }"
                          :wrapperCol="{ span: 20 }"
                        >
                          <a-input type="name" />
                        </a-form-item>
                        <a-form-item
                          required
                          has-feedback
                          label="密码"
                          name="password"
                          :labelCol="{ span: 3 }"
                          :wrapperCol="{ span: 20 }"
                        >
                          <a-input-password type="password" />
                        </a-form-item>
                        <a-form-item
                          required
                          has-feedback
                          label="邮箱"
                          name="email"
                          :labelCol="{ span: 3 }"
                          :wrapperCol="{ span: 20 }"
                        >
                          <a-input type="email" />
                        </a-form-item>
                        <a-form-item
                          required
                          has-feedback
                          label="手机"
                          name="phone"
                          :labelCol="{ span: 3 }"
                          :wrapperCol="{ span: 20 }"
                        >
                          <a-input type="phone" />
                        </a-form-item>
                      </a-form>
                    </a-col>
                  </a-row>
                </a-modal>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
      <!-- 添加用户 end-->
      <!-- 表格 start -->
      <a-table
        :columns="tablecolumns"
        :data-source="tableData"
        bordered
        :pagination="false"
      >
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
      <!-- 分页 start -->
      <a-pagination
        v-model:current="current"
        :total="total"
        class="page"
        :show-total="(total) => `共 ${total} 条`"
        show-size-changer
        @showSizeChange="onShowSizeChange"
        :page-size-options="pageSizeOptions"
        :defaultPageSize="2"
        @change="onChange"
        show-quick-jumper
      />
      <!-- 分页 end -->
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
      // 表格列配置
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
      // 分页
      current: 1,
      total: 2,
      // 指定每页可以显示多少条
      pageSizeOptions: ["2", "5", "8", "10"],
      visible: false,

      confirmLoading: false,
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    getUsers(pagenum = 1, pagesize = 2) {
      httpGet(user.GetUsers, {
        pagenum: pagenum,
        pagesize: pagesize,
      })
        .then((response) => {
          console.log(response);
          let { meta, data } = response;

          if (meta.status == 200) {
            // 设置表格数据
            this.tableData = data.users;
            // 设置当前页码
            this.current = data.pagenum;
            // 设置数据总数
            this.total = data.total;
            // console.log(this.tableData);
            // 给每一条数据添加序号（index）属性
            this.tableData.forEach((element, index) => {
              element.index = index + 1;
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onShowSizeChange(current, pageSize) {
      // console.log(current, pageSize);
      this.getUsers(current, pageSize);
    },
    // 页码改变的回调，参数是改变后的页码以及条数
    onChange(page, pageSize) {
      this.getUsers(page, pageSize);
      console.log(1);
    },
    // 点击显示拟态框
    showModal() {
      this.visible = true;
    },
  },
};
</script>

<style>
.page {
  margin-top: 25px;
}
</style>
