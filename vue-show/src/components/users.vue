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
                <a-button
                  type="primary"
                  size="large"
                  @click="showModal"
                  ref="addFormRef"
                >
                  添加用户
                </a-button>
                <!-- 添加用户模态框 -->
                <a-modal
                  v-model:visible="addvisible"
                  :confirm-loading="confirmLoading"
                  title="添加用户"
                  cancelText="取消"
                  okText="确定"
                  @ok="hanleAddUsers"
                  @cancel="cancelAddUser"
                >
                  <a-row>
                    <a-col :span="24">
                      <a-form
                        :model="addruleForm"
                        :rules="addrules"
                        ref="addFormRef"
                      >
                        <a-form-item
                          has-feedback
                          label="用户名"
                          required
                          name="username"
                          :labelCol="{ span: 3 }"
                          :wrapperCol="{ span: 20 }"
                        >
                          <a-input
                            type="text"
                            v-model:value="addruleForm.username"
                          />
                        </a-form-item>
                        <a-form-item
                          required
                          has-feedback
                          label="密码"
                          name="password"
                          :labelCol="{ span: 3 }"
                          :wrapperCol="{ span: 20 }"
                        >
                          <a-input-password
                            type="password"
                            v-model:value="addruleForm.password"
                          />
                        </a-form-item>
                        <a-form-item
                          required
                          has-feedback
                          label="邮箱"
                          name="email"
                          :labelCol="{ span: 3 }"
                          :wrapperCol="{ span: 20 }"
                        >
                          <a-input
                            type="email"
                            v-model:value="addruleForm.email"
                          />
                        </a-form-item>
                        <a-form-item
                          required
                          has-feedback
                          label="手机"
                          name="mobile"
                          :labelCol="{ span: 3 }"
                          :wrapperCol="{ span: 20 }"
                        >
                          <a-input
                            type="phone"
                            v-model:value="addruleForm.mobile"
                          />
                        </a-form-item>
                      </a-form>
                    </a-col>
                  </a-row>
                </a-modal>
                <!-- 模态框 -->
                <a-modal
                  v-model:visible="editvisible"
                  title="编辑用户"
                  cancelText="取消"
                  okText="确定"
                  @ok="hanleEditUsers"
                  @cancel="cancelEditUser"
                >
                  <a-row>
                    <a-col :span="24">
                      <a-form
                        :model="EditruleForm"
                        :rules="Editrules"
                        ref="EditFormRef"
                      >
                        <a-form-item
                          has-feedback
                          label="用户名"
                          required
                          name="username"
                          :labelCol="{ span: 3 }"
                          :wrapperCol="{ span: 20 }"
                        >
                          <a-input
                            disabled
                            type="text"
                            v-model:value="EditruleForm.username"
                          />
                        </a-form-item>

                        <a-form-item
                          required
                          has-feedback
                          label="邮箱"
                          name="email"
                          :labelCol="{ span: 3 }"
                          :wrapperCol="{ span: 20 }"
                        >
                          <a-input
                            type="email"
                            v-model:value="EditruleForm.email"
                          />
                        </a-form-item>
                        <a-form-item
                          required
                          has-feedback
                          label="手机"
                          name="mobile"
                          :labelCol="{ span: 3 }"
                          :wrapperCol="{ span: 20 }"
                        >
                          <a-input
                            type="phone"
                            v-model:value="EditruleForm.mobile"
                          />
                        </a-form-item>
                      </a-form>
                    </a-col>
                  </a-row>
                </a-modal>
                <!-- 分配角色弹出框 -->
                <a-modal
                  title="分配角色"
                  v-model:visible="Rolesvisible"
                  @ok="handleRolesOk"
                >
                  <p>当前的用户:{{ userInfo.username }}</p>
                  <p>当前的角色:{{ userInfo.role_name }}</p>
                  <p>
                    分配的新角色
                    <a-select
                      v-model:value="roleSelected"
                      placeholder="请选择"
                      @change="handleReadRole"
                      style="width: 120px"
                    >
                      <a-select-option
                        v-for="item in rolesList"
                        :key="item.id"
                        :value="item.id"
                      >
                        {{ item.roleName }}
                      </a-select-option>
                    </a-select>
                  </p>
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
          <a-switch
            v-model:checked="text.mg_state"
            :id="text.id"
            @change="hanleonChange"
          />
        </template>
        <!-- 三个小按钮 -->

        <template #operation="{ record }">
          <!-- 编辑 -->
          <a-button type="primary" @click="hanleruser(record.id)">
            <template #icon><EditOutlined /> </template>
          </a-button>
          <!-- 删除 -->
          <a-button
            type="danger"
            style="margin: 0 10px"
            @click="confirmremove(record.id)"
          >
            <template #icon><DeleteOutlined /> </template>
          </a-button>
          <!-- 角色 -->
          <a-button
            style="background-color: #e8a23b; color: #fff"
            @click="hanleRoles(record)"
          >
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
        :show-total="total => `共 ${total} 条`"
        show-size-changer
        @showSizeChange="onShowSizeChange"
        :page-size-options="pageSizeOptions"
        :defaultPageSize="2"
        @change="onChange"
        show-quick-jumper
        v-model:pagesize="pagesize"
      />
      <!-- 分页 end -->
    </div>
  </div>
</template>

<script>
import { httpGet, httpPost, httpDelete, httpPut } from "../utils/http";
// 引入请求路径
import { user, role } from "../api";
import {
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import { createVNode } from "vue";
export default {
  components: {
    EditOutlined,
    DeleteOutlined,
    SettingOutlined
  },
  data() {
    let checkEmail = async (rule, value) => {
      if (value === "") {
        return Promise.reject("请输入你的邮箱");
      } else if (
        !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value)
      ) {
        return Promise.reject("邮箱格式不正确");
      } else {
        return Promise.resolve();
      }
    };
    let checkmodel = async (rule, value) => {
      if (value === "") {
        return Promise.reject("请输入你的号码");
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        return Promise.reject("手机号码格式不正确");
      } else {
        return Promise.resolve();
      }
    };
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
        {
          title: "操作",
          key: "operation",
          slots: { customRender: "operation" }
        }
      ],
      // 分页
      current: 1,
      total: 2,
      pagesize: 2,
      // 指定每页可以显示多少条
      pageSizeOptions: ["2", "5", "8", "10"],
      addvisible: false,
      confirmLoading: false,

      // 添加用户模型
      addruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 规则
      addrules: {
        username: [
          {
            //   required必须的
            // trigger什么时候触发
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 4,
            max: 16,
            message: "长度在4-16个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          {
            //   required必须的
            // trigger什么时候触发
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 4,
            max: 16,
            message: "长度在4-16个字符之间",
            trigger: "blur"
          }
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkmodel, trigger: "blur" }]
      },
      // 编辑回显
      editvisible: false,
      EditruleForm: {},
      Editrules: {
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkmodel, trigger: "blur" }]
      },
      // 分配角色回显
      Rolesvisible: false,
      // 角色数据
      userInfo: {},
      rolesList: {},
      roleSelected: null
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    // 获取用户列表
    getUsers() {
      httpGet(user.GetUsers, {
        pagenum: this.current,
        pagesize: this.pagesize
      })
        .then(response => {
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
        .catch(err => {
          console.log(err);
        });
    },
    onShowSizeChange(current, pageSize) {
      // console.log(current, pageSize);
      this.current = current;
      this.getUsers(current, pageSize);
    },
    // 页码改变的回调，参数是改变后的页码以及条数
    onChange(page, pageSize) {
      this.getUsers(page, pageSize);
    },
    // 点击显示拟态框
    showModal() {
      this.addvisible = true;
    },
    // 添加用户
    hanleAddUsers() {
      // 表单校验拦截
      this.$refs.addFormRef.validate();
      // 获取请求参数
      let params = {
        username: this.addruleForm.username,
        password: this.addruleForm.password,
        email: this.addruleForm.email,
        mobile: this.addruleForm.mobile
      };
      httpPost(user.AddUser, params)
        .then(response => {
          // console.log(response);
          let { meta } = response;
          // console.log(data);
          // 让模态框消失
          // this.visible = false;
          if (meta.status == 201) {
            // 让模态框消失
            this.addvisible = false;
            // 清空表单中的输入框
            this.$refs.addFormRef.resetFields();
            message.success(meta.msg);

            this.getUsers();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 取消添加用户
    cancelAddUser() {
      this.$refs.addFormRef.resetFields();
    },
    // 删除用户
    confirmremove(userId) {
      var that = this;
      Modal.confirm({
        title: "提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: "我不管，老子就要删除他",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          httpDelete(user.Delete + `/${userId}`)
            .then(response => {
              // console.log(response);
              let { meta } = response;
              if (meta.status == 200) {
                message.success(meta.msg);
                that.getUsers();
              }
              if (meta.status == 400) {
                message.warning(meta.msg);
                that.getUsers();
              }
            })
            .catch(err => {
              console.log(err);
            });
        },

        onCancel() {
          message.error("就凭你还想删我");
        }
      });
    },
    // 回显
    hanleruser(userId) {
      this.editvisible = true;
      // console.log(userId);
      httpGet(user.GetUser + `/${userId}`)
        .then(response => {
          // console.log(response);
          let { meta, data } = response;
          // console.log(data);
          if (meta.status == 200) {
            this.EditruleForm = data;
            // console.log(this.EditruleForm);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 更新数据
    hanleEditUsers() {
      this.$refs.EditFormRef.validate()
        .then(() => {
          httpPut(user.updata + `/${this.EditruleForm.id}`)
            .then(response => {
              console.log(response);
              let { meta } = response;
              if (meta.status == 200) {
                this.editvisible = false;
                message.success(meta.msg);
                this.getUsers();
              }
              if (meta.status == 400) {
                this.editvisible = false;
                message.error(meta.msg);
                this.getUsers();
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 取消更新
    cancelEditUser() {},
    // 分配角色
    hanleRoles(user) {
      this.Rolesvisible = true;
      this.userInfo = user;
      // console.log(user);
      httpGet(role.GetRoule)
        .then(response => {
          // console.log(response);
          let { data, meta } = response;
          if (meta.status == 200) {
            this.rolesList = data;
            console.log(data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 下拉菜单的值
    handleReadRole(val) {
      console.log(val);
    },
    //
    // 确定分配角色
    handleRolesOk() {
      if (this.roleSelected == null) {
        message.error("请你选择一个角色");
        return;
      }
      httpPut(`users/${this.userInfo.id}/role`, {
        rid: this.roleSelected
      })
        .then(response => {
          // console.log(response);

          let { meta } = response;
          if (meta.status == 400) {
            message.error(meta.msg);
            return;
          }
          if (meta.status == 200) {
            message.success(meta.msg);
            this.getUsers();
            this.roleSelected = null;
            this.Rolesvisible = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 修改用户状态
    hanleonChange(checked, event) {
      // console.log(checked);
      // console.log(event.target.id);
      httpPut(`users/${checked}/state/${event.target.id}`)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style>
.page {
  margin-top: 25px;
}
</style>
