<template>
  <a-layout>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item
        ><router-link to="/home" style="font-weight: bold; color: #000"
          >首页</router-link
        ></a-breadcrumb-item
      >
      <a-breadcrumb-item>权限管理</a-breadcrumb-item>
      <a-breadcrumb-item>角色列表</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card>
      <a-row>
        <a-col :spam="24" style="margin-bottom: 24px">
          <!-- 添加角色 -->
          <a-button type="primary" @click="hanleAddRoles"> 添加角色 </a-button>
          <a-form>
            <!-- 添加角色模态框 -->
            <a-modal
              v-model:visible="addrolesvisible"
              title="添加角色"
              cancelText="取消"
              okText="确定"
              @ok="cancelAddRolesUser"
              @cancel="cancelAdRolesdUser"
            >
              <a-row>
                <a-col :span="24">
                  <a-form
                    :model="addRolesForm"
                    :rules="addRoles"
                    ref="addFormRef"
                  >
                    <a-form-item
                      has-feedback
                      label="角色名称"
                      required
                      name="roleName"
                      :wrapperCol="{ span: 18 }"
                    >
                      <a-input
                        type="text"
                        v-model:value="addRolesForm.roleName"
                      />
                    </a-form-item>
                    <a-form-item
                      has-feedback
                      label="角色描述"
                      required
                      name="roleDesc"
                      :wrapperCol="{ span: 18 }"
                    >
                      <a-input
                        type="text"
                        v-model:value="addRolesForm.roleDesc"
                      />
                    </a-form-item>
                  </a-form>
                </a-col>
              </a-row>
            </a-modal>
          </a-form>
        </a-col>
      </a-row>
      <a-table
        :columns="rolesColumns"
        :data-source="rolesData"
        :row-key="(record) => record.id"
        bordered
        :pagination="false"
        childrenColumnName="abc"
      >
        <template #index="{ index }">
          {{ index + 1 }}
        </template>
        <!-- 可展开 -->
        <template #expandedRowRender="{ record }">
          <a-row
            :class="['bdbottom vcenter', index1 == 0 ? 'bdtop' : '']"
            v-for="(item1, index1) in record.children"
            :key="item1.id"
            :index1="index1"
          >
            <!-- 一级渲染 -->
            <a-col :span="5">
              <span>
                <a-tag closable color="blue"> {{ item1.authName }} </a-tag
                ><CaretRightOutlined />
              </span>
            </a-col>
            <!-- 二三级渲染 -->
            <a-col :span="19">
              <a-row
                :class="['bdbottom vcenter']"
                v-for="item2 in item1.children"
                :key="item2.id"
              >
                <a-col :span="6">
                  <span>
                    <a-tag closable color="green"> {{ item2.authName }} </a-tag
                    ><CaretRightOutlined />
                  </span>
                </a-col>
                <a-col :span="18">
                  <span>
                    <a-tag
                      closable
                      color="orange"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }} </a-tag
                    ><CaretRightOutlined />
                  </span>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <!-- {{ record }} -->
        </template>
        <template #operation>
          <!-- 编辑 -->
          <a-button size="small" type="primary">
            <EditOutlined />编辑
          </a-button>
          <!-- 删除 -->
          <a-button size="small" type="danger" style="margin: 0 10px">
            <DeleteOutlined />删除
          </a-button>
          <!-- 角色 -->
          <a-button
            type="default"
            size="small"
            style="background-color: #e6a23c; color: #fff"
          >
            <SettingOutlined />分配权限</a-button
          >
        </template>
      </a-table>
    </a-card>
  </a-layout>
</template>

<script>
import { httpGet, httpPost } from "../utils/http";
// 引入请求路径
import { role } from "../api";
import { message } from "ant-design-vue";
import {
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  CaretRightOutlined,
} from "@ant-design/icons-vue";

export default {
  data() {
    return {
      rolesColumns: [
        { title: "#", slots: { customRender: "index" }, key: "index" },
        { title: "角色名称", dataIndex: "roleName", key: "roleName" },
        { title: "角色描述", dataIndex: "roleDesc", key: "roleDesc" },
        {
          title: "操作",
          slots: { customRender: "operation" },
          key: "inoperationdex",
        },
      ],
      rolesData: [],
      // 模态框
      addrolesvisible: false,
      // 添加角色模型
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      addRoles: {},
    };
  },
  created() {
    this.handelGetRoles();
  },
  methods: {
    // 获取角色权限
    handelGetRoles() {
      httpGet(role.GetRoule)
        .then((res) => {
          console.log(res);
          let { data, meta } = res;
          if (meta.status == 200) {
            this.rolesData = data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 添加角色
    hanleAddRoles() {
      this.addrolesvisible = true;
    },
    // 确定
    cancelAddRolesUser() {
      httpPost(role.AddRoule, this.addRolesForm)
        .then((res) => {
          console.log(res);
          let { meta } = res;
          if (meta.status == 201) {
            message.success(meta.msg);
            // this.cancelAddRolesUser();
            this.addrolesvisible = false;
          } 
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 取消
    cancelAdRolesdUser() {},
  },
  components: {
    EditOutlined,
    DeleteOutlined,
    SettingOutlined,
    CaretRightOutlined,
  },
};
</script>

<style>
.ant-tag {
  padding: 2px 14px;
  font-size: 14px;
}

.ant-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
.ant-btn-icon-only {
  width: 50px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
</style>