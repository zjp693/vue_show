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
          <a-button type="primary"> 添加分类 </a-button>
          <a-form> </a-form>
        </a-col>
      </a-row>

      <!-- 表格 -->
      <a-table
        :columns="goodsColumns"
        :data-source="goodsData"
        :row-key="(record) => record.goods_id"
        bordered
        :pagination="false"
      >
        <template #index="{ index }">
          {{ index + 1 }}
        </template>
        <!-- 可展开 -->

        <template #operation>
          <!-- 编辑 -->
          <a-button size="small" type="primary">
            <EditOutlined />
          </a-button>
          <!-- 删除 -->
          <a-button size="small" type="danger" style="margin: 0 10px">
            <DeleteOutlined />
          </a-button>
        </template>
      </a-table>
      <a-pagination
        v-model:current="pagination.pagenum"
        v-model:pagesize="pagination.pagesize"
        :total="pagination.total"
        :show-total="(total) => `共 ${pagination.total} 条`"
        show-size-changer
        show-quick-jumper
        :page-size-options="pagination.pageSizeOptions"
        :defaultPageSize="10"
        @showSizeChange="onShowSizeChange"
        @change="onChange"
      >
      </a-pagination>
    </a-card>
  </a-layout>
</template>

<script>
import { httpGet } from "../utils/http";
// 引入请求路径
import { goods } from "../api";
// import { message } from "ant-design-vue";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";

export default {
  data() {
    return {
      goodsColumns: [
        { title: "#", slots: { customRender: "index" }, key: "index" },
        { title: "商品名称", dataIndex: "goods_name", key: "goods_name" },
        {
          title: "商品价格（元）",
          dataIndex: "goods_price",
          key: "goods_price",
        },
        { title: "商品重量", dataIndex: "goods_weight", key: "goods_weight" },
        { title: "创建时间", dataIndex: "add_time", key: "add_time" },

        {
          title: "操作",
          slots: { customRender: "operation" },
          key: "operation",
        },
      ],
      goodsData: [],
      pagination: {
        pagenum: 1,
        pagesize: 10,
        pageSizeOptions: ["5", "10", "15", "20"],
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
      httpGet(goods.GetGoods, {
        pagenum: this.pagination.pagenum,
        pagesize: this.pagination.pagesize,
      })
        .then((res) => {
          console.log(res);
          let { data, meta } = res;
          if (meta.status == 200) {
            this.goodsData = data.goods;
            this.pagination.total = data.total;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onShowSizeChange(current, pagesize) {
      // console.log(current, pageSize);
      this.pagination.pagenum = current;
      this.pagination.pagesize = pagesize;

      this.haneleGetGoods();
    },
    // 页码改变的回调，参数是改变后的页码以及条数
    onChange(page, pagesize) {
      this.pagination.pagenum = page;
      this.pagination.pagesize = pagesize;

      this.haneleGetGoods();
    },
  },
  components: {
    EditOutlined,
    DeleteOutlined,
  },
};
</script>

<style>
</style>
