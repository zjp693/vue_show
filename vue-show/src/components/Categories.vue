<template>
  <a-layout>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item
        ><router-link to="/home" style="font-weight: bold; color: #000"
          >首页</router-link
        ></a-breadcrumb-item
      >
      <a-breadcrumb-item>商品管理</a-breadcrumb-item>
      <a-breadcrumb-item>商品列表</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card>
      <a-row>
        <a-col :spam="24" style="margin-bottom: 24px">
          <!-- 添加角色 -->
          <a-button type="primary"> 添加商品 </a-button>
          <a-form> </a-form>
        </a-col>
      </a-row>

      <!-- 表格 -->
      <a-table
        :columns="goodsColumns"
        :data-source="goodsData"
        :row-key="(record) => record.cat_id"
        bordered
        :pagination="false"
        :expandIconColumnIndex="1"
      >
        <!-- # -->
        <template #index="{ index }">
          {{ index + 1 }}
        </template>
        <!-- 是否有效 -->
        <template #isDeleted="{ record }">
          <CheckCircleTwoTone
            v-if="record.cat_deleted == false"
            twoToneColor="#52c41a"
          />
          <CloseCircleOutlined
            v-if="record.cat_deleted == true"
            twoToneColor="#eb2f96"
          />
        </template>
        <!-- 排序 -->
        <template #isLevel="{ record }">
          <a-tag v-if="record.cat_level == 0" color="blue"> 一级 </a-tag>
          <a-tag v-if="record.cat_level == 1" color="green"> 二级 </a-tag>
          <a-tag v-if="record.cat_level == 2" color="orange"> 三级 </a-tag>
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
        </template>
      </a-table>
    </a-card>
  </a-layout>
</template>

<script>
import { httpGet } from "../utils/http";
// 引入请求路径
import { goods } from "../api";

import {
  CheckCircleTwoTone,
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";

export default {
  data() {
    return {
      goodsColumns: [
        { title: "#", slots: { customRender: "index" }, key: "index" },
        { title: "分类名称", dataIndex: "cat_name", key: "cat_name" },
        {
          title: "是否有效",
          slots: { customRender: "isDeleted" },
          key: "cat_deleted",
        },
        {
          title: "排序",
          slots: { customRender: "isLevel" },
          key: "cat_level",
        },

        {
          title: "操作",
          slots: { customRender: "operation" },
          key: "operation",
        },
      ],
      goodsData: [],
      pagination: {
        pagenum: 1,
        pagesize: 5,
        total: 0,
      },
    };
  },
  created() {
    this.haneleGetGoods();
  },
  methods: {
    // 获取角色权限
    haneleGetGoods() {
      httpGet(goods.GetCategories, {
        type: [1, 2, 3],
        pagenum: this.pagination.pagenum,
        pagesize: this.pagination.pagesize,
      })
        .then((res) => {
          console.log(res);
          let { data, meta } = res;
          if (meta.status == 200) {
            this.goodsData = data.result;
            console.log(this.goodsData);
            this.pagination.total = data.total;
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
    CheckCircleTwoTone,
    CloseCircleOutlined,
  },
};
</script>

<style>
</style>
