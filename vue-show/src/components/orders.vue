<template>
  <a-layout>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item
        ><router-link to="/home" style="font-weight: bold; color: #000"
          >首页</router-link
        ></a-breadcrumb-item
      >
      <a-breadcrumb-item>订单管理</a-breadcrumb-item>
      <a-breadcrumb-item>订单列表</a-breadcrumb-item>
    </a-breadcrumb>
    <!-- 表格 -->
    <a-card>
      <!-- 搜索框 -->
      <a-row>
        <a-col :span="8">
          <a-input-search placeholder="请输入搜索内容" size="large" />
          <template #enterButton>
            <a-button> 搜索 </a-button>
          </template></a-col
        >
      </a-row>
      <!-- 表单 -->
      <a-table
        :row-key="(record) => record.order_id"
        :columns="table.Cols"
        :data-source="table.Data"
        :pagination="false"
        bordered
      >
        <template #index="{ index }">
          {{ index + 1 }}
        </template>
        <!-- 操作 -->
        <template #pay_status="{ record }">
          <!-- {{ record.pay_status }} -->
          <a-tag v-if="record.pay_status == 0" color="pink"> 未付款 </a-tag>
          <a-tag v-if="record.pay_status == 1" color="green">已付款 </a-tag>
        </template>
        <template #operation>
          <a-button
            type="primary"
            style="margin-right: 10px"
            @click="handleReadAddress"
          >
            <template #icon>
              <EditOutlined />
            </template>
          </a-button>
          <!-- 地址 -->
          <a-button class="ant-green">
            <template #icon>
              <EnvironmentOutlined />
            </template>
          </a-button>
        </template>
      </a-table>
      <!-- 分页  -->
      <a-pagination
        v-model:current="pagintion.pagenum"
        v-model:pagesize="pagintion.pagesize"
        :total="pagintion.total"
        :show-total="(total) => `共 ${pagintion.total} 条`"
        show-size-changer
        show-quick-jumper
        :page-size-options="pagintion.pageSizeOptions"
        :defaultPageSize="2"
        @showSizeChange="onShowSizeChange"
        @change="onChange"
      />
    </a-card>

    <!-- 修改地址弹出框 -->
    <a-modal
      title="修改地址"
      v-model:visible="address.visible"
      @ok="hanleAddressOk"
      :afterClose="hanleAddreeCol"
    >
      <a-form
        :model="address.FormModel"
        :rules="address.FormRules"
        ref="addreRef"
      >
        <a-form-item required label="省市区/县" name="province">
          <a-cascader
            :options="options"
            placeholder="请选择"
            v-model:value="address.FormModel.province"
          />
        </a-form-item>
        <a-form-item required label="详细地址" name="detail">
          <a-input v-model:value="address.FormModel.detail" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script>
// import { message } from "ant-design-vue";
import { httpGet } from "../utils/http";
import { order } from "../api";
import { EditOutlined, EnvironmentOutlined } from "@ant-design/icons-vue";
import citydata from "../api/citydata";
import { message } from "ant-design-vue";
export default {
  data() {
    return {
      // 分页数据
      pagintion: {
        pagesize: 2,
        pagenum: 1,
        total: 0,
        pageSizeOptions: ["2", "5", "8", "10"],
      },
      address: {
        visible: false,
        FormModel: { province: [], detail: "" },
        FormRules: {
          province: [
            {
              type: "array",
              required: true,
              message: "请选择省市地址",
              trigger: "blur",
            },
          ],
          detail: [
            { required: true, message: "请输入详细地址", trigger: "blur" },
          ],
        },
        options: [],
      },
      //   表格数据
      table: {
        Cols: [
          { title: "#", key: "index", slots: { customRender: "index" } },
          { title: "订单编号", dataIndex: "order_number", key: "" },
          { title: "订单价格", dataIndex: "order_price", key: "" },
          {
            title: "是否付款",

            key: "",
            slots: { customRender: "pay_status" },
          },
          { title: "是否发货", dataIndex: "is_send", key: "" },
          { title: "下单时间", dataIndex: "create_time", key: "" },
          {
            title: "操作",
            key: "operation",
            slots: { customRender: "operation" },
          },
        ],
        Data: [],
      },
    };
  },
  created() {
    this.hanleReadOrdes();
  },
  methods: {
    hanleReadOrdes() {
      // 城市信息
      this.options = citydata;
      // console.log();
      httpGet(order.GetOrders, {
        pagenum: this.pagintion.pagenum,
        pagesize: this.pagintion.pagesize,
      })
        .then((res) => {
          console.log(res);
          let { data, meta } = res;
          if (meta.status == 200) {
            this.pagintion.pagenum = Number(data.pagenum);
            this.pagintion.total = data.total;
            this.table.Data = data.goods;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    onShowSizeChange(current, pagesize) {
      // console.log(current, pageSize);
      this.pagintion.pagenum = current;
      this.pagintion.pagesize = pagesize;

      this.hanleReadOrdes();
    },
    // 页码改变的回调，参数是改变后的页码以及条数
    onChange(page, pagesize) {
      this.pagintion.pagenum = page;
      this.pagintion.pagesize = pagesize;

      this.hanleReadOrdes();
    },
    handleReadAddress() {
      this.address.visible = true;
    },
    hanleAddressOk() {
      this.$refs.addreRef
        .validate()
        .then((res) => {
          console.log(res);
          this.address.visible = false;
          message.success("修改地址成功");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    hanleAddreeCol() {
      this.$refs.addreRef.resetFields();
      // console.log(1);
    },
  },
  components: {
    EditOutlined,
    EnvironmentOutlined,
  },
};
</script>

<style>
.ant-green {
  background-color: #67c23a;
  color: #fff;
}

.ant-green:hover,
.ant-green:focus {
  background-color: #67c23a;
  color: #fff;
  border-color: transparent;
}
</style>
