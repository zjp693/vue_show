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
        <a-col :spam="24">
          <!-- 添加角色 -->
          <a-button type="primary"> 添加角色 </a-button>
        </a-col>
      </a-row>
      <a-table
        :columns="rolesColumns"
        :data-source="rolesData"
        :row-key="(record) => record.id"
        bordered
        :pagination="false"
      >
        <template #index="{ index }">
          {{ index + 1 }}
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
import { httpGet } from "../utils/http";
// 引入请求路径
import { role } from "../api";
import {
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
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
    };
  },
  created() {
    this.handelGetRoles();
  },
  methods: {
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
  },
  components: {
    EditOutlined,
    DeleteOutlined,
    SettingOutlined,
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