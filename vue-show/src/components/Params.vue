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
    <!--  -->
    <a-card>
      <!-- 提示框 -->
      <a-alert
        message="注意：只允许为第三级分类设置"
        type="warning"
        show-icon
      />
      <!-- 级连选择框 -->
      <a-row>
        <a-col :span="8">
          <span>请选择商品分类：</span>
          <a-cascader
            v-model:value="cascader.selectedKey"
            :options="cascader.data"
            :fieldNames="cascader.config"
            placeholder="请选择"
            style="margin: 24px 0"
            @change="handleReadParamsList"
          />
        </a-col>
      </a-row>
      <!-- 标签页 -->
      <a-tabs v-model:activeKey="tabs.activeKey" @change="handleTabsChange">
        <a-tab-pane key="many" tab="动态参数">
          <a-button type="primary" :disabled="isDisabled" @click="showAddParams"
            >添加参数</a-button
          >
          <!-- 表格 -->
          <a-table
            style="margin-top: 24px"
            :row-key="(record) => record.attr_id"
            :columns="table.cols"
            :data-source="table.manyData"
            bordered
            :pagination="false"
          >
            <template #index="{ index }">
              {{ index + 1 }}
            </template>
            <!-- 展开后的标签 -->
            <template #expandedRowRender="{ record }">
              <a-tag
                color="blue"
                closable
                @close="handleClose($event, record, index)"
                v-for="(item, index) in record.attr_vals"
                :key="item"
              >
                {{ item }}
              </a-tag>

              <a-input
                v-if="record.inputVisible"
                type="text"
                size="small"
                ref="input"
                :style="{ width: '78px' }"
                v-model:value="record.inputValue"
                @blur="handleInputConfirm(record)"
              />
              <a-tag
                v-else
                @click="showInput(record)"
                style="background: #fff; borderstyle: dashed"
              >
                <plus-outlined /> New Tag
              </a-tag>
            </template>

            <template #operation>
              <!-- 编辑 -->
              <a-button type="primary">
                <EditOutlined />
              </a-button>
              <!-- 删除 -->
              <a-button type="danger" style="margin: 0 10px">
                <DeleteOutlined
              /></a-button>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="only" tab="静态属性" force-render>
          <a-button type="primary" :disabled="isDisabled" @click="showAddParams"
            >添加参数</a-button
          >
          <!-- 表格 -->
          <a-table
            style="margin-top: 24px"
            :row-key="(record) => record.attr_id"
            :columns="table.cols"
            :data-source="table.onlyData"
            bordered
            :pagination="false"
          >
            <template #index="{ index }">
              {{ index + 1 }}
            </template>

            <template #expandedRowRender="{ record }">
              {{ record }}
            </template>

            <template #operation>
              <!-- 编辑 -->
              <a-button type="primary">
                <EditOutlined />
              </a-button>
              <!-- 删除 -->
              <a-button type="danger" style="margin: 0 10px">
                <DeleteOutlined
              /></a-button>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <!-- 添加参数模态框  -->
    <a-modal
      :title="'添加' + titleText"
      v-model:visible="AddParams.visible"
      @ok="handleAddParams"
    >
      <a-form
        :model="AddParams.Model"
        :rules="AddParams.Rules"
        ref="AddParamsRef"
      >
        <a-form-item required :label="titleText" name="attr_name">
          <a-input v-model:value="AddParams.Model.attr_name" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script>
import { httpGet, httpPost, httpPut } from "../utils/http";
import { goods } from "../api";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
export default {
  data() {
    return {
      cascader: {
        selectedKey: [],
        data: [],
        config: { label: "cat_name", value: "cat_id", children: "children" },
      },
      //  表格数据
      tabs: {
        activeKey: "many",
      },
      table: {
        cols: [
          {
            title: "#",
            key: "index",
            slots: { customRender: "index" },
          },
          {
            title: "属性名称",
            dataIndex: "attr_name",
          },
          {
            title: "操作",
            key: "operation",
            slots: { customRender: "operation" },
          },
        ],
        manyData: [],
        onlyData: [],
      },
      // 添加参数 模态框
      AddParams: {
        visible: false,
        Model: {
          attr_name: "",
        },
        Rules: {
          attr_name: [
            { required: true, message: "请填写参数", trigger: "blur" },
          ],
        },
      },
    };
  },
  created() {
    this.hanleReadCateList();
  },
  methods: {
    //   层级列表
    hanleReadCateList() {
      httpGet(goods.GetCategories)
        .then((res) => {
          //   console.log(ers);
          let { data, meta } = res;
          if (meta.status == 200) {
            this.cascader.data = data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 参数列表
    handleReadParamsList() {
      console.log(this.tabs.activeKey);
      httpGet(`categories/${this.cateId}/attributes`, {
        sel: this.tabs.activeKey,
      })
        .then((response) => {
          console.log(response);
          let { meta, data } = response;

          if (meta.status == 200) {
            if (this.tabs.activeKey == "many") {
              // 在many的时候才需要处理成数组
              data.forEach((ele) => {
                // console.log(ele);
                ele.attr_vals =
                  ele.attr_vals.length == 0 ? [] : ele.attr_vals.split(" ");

                ele.inputVisible = false;
              });
              this.table.manyData = data;
            } else {
              this.table.onlyData = data;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 监听tabs切换
    handleTabsChange() {
      this.handleReadParamsList();
    },
    // 显示模态框
    showAddParams() {
      this.AddParams.visible = true;
    },
    // 添加参数
    handleAddParams() {
      httpPost(`categories/${this.cateId}/attributes`, {
        attr_name: this.AddParams.Model.attr_name,
        attr_sel: this.tabs.activeKey,
      })
        .then((resonse) => {
          // console.log(resonse);
          let { meta } = resonse;
          if (meta.status == 201) {
            message.success(meta.msg);
            this.AddParams.visible = false;
            this.handleReadParamsList();
            this.$refs.AddParamsRef.resetFields();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 删除标签
    handleClose(e, r, i) {
      r.attr_vals.splice(i, 1);
      httpPut(`categories/${this.cateId}/attributes/${r.attr_id}`, {
        // 新属性的名字
        attr_name: r.attr_name,
        // 属性的类型
        attr_sel: r.attr_sel,
        // 参数的属性值
        attr_vals: r.attr_vals.join(" "),
      })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showInput(record) {
      // console.log(record);
      record.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    handleInputConfirm(record) {
      record.attr_vals.push(record.inputValue);
      console.log(record);
    },
  },
  computed: {
    // 控制  添加参数 按钮 禁用与否
    isDisabled() {
      return this.cascader.selectedKey.length !== 3;
    },
    cateId() {
      if (this.cascader.selectedKey.length == 3) {
        return this.cascader.selectedKey[this.cascader.selectedKey.length - 1];
      }
      return null;
    },
    titleText() {
      if (this.tabs.activeKey == "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  components: {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
  },
};
</script>

<style></style>
