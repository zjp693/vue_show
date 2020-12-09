<template>
  <a-layout>
    <!-- 面包屑导航 -->
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item
        ><router-link to="/home" style="font-weight: bold; color: #000"
          >首页</router-link
        ></a-breadcrumb-item
      >
      <a-breadcrumb-item>商品管理</a-breadcrumb-item>
      <a-breadcrumb-item>添加商品</a-breadcrumb-item>
    </a-breadcrumb>
    <!-- 表格 -->
    <a-card>
      <!-- 提示信息 -->
      <a-alert message="添加商品信息" type="info" show-icon />
      <!-- 步骤条 -->
      <a-row>
        <a-col :span="20" :offset="2">
          <a-steps
            :current="Number(activeKey)"
            size="small"
            direction="horizontal"
            labelPlacement="vertical"
            style="margin-top: 24px"
          >
            <a-step title="基本信息" />
            <a-step title="商品参数" />
            <a-step title="商品属性" />
            <a-step title="商品图片" />
            <a-step title="商品内容" />
            <a-step title="完成" />
          </a-steps>
        </a-col>
      </a-row>
      <!-- tab标签页 -->
      <a-form
        layout="vertical"
        :model="addGoodsModel"
        :rules="addGoodsRules"
        ref="addGoodsRef"
      >
        <a-tabs
          style="margin-top: 24px"
          tab-position="left"
          :activeKey="activeKey"
          @change="handleTabsChange"
        >
          <!-- 基本信息 -->
          <a-tab-pane key="0" tab="基本信息">
            <a-form-item required label="商品名称" name="goods_name">
              <a-input v-model:value="addGoodsModel.goods_name" />
            </a-form-item>

            <a-form-item required label="商品价格" name="goods_price">
              <a-input v-model:value="addGoodsModel.goods_price" />
            </a-form-item>

            <a-form-item required label="商品重量" name="goods_weight">
              <a-input v-model:value="addGoodsModel.goods_weight" />
            </a-form-item>

            <a-form-item required label="商品数量" name="goods_number">
              <a-input v-model:value="addGoodsModel.goods_number" />
            </a-form-item>

            <a-form-item required label="商品分类" name="goods_cat">
              <a-cascader
                v-model:value="addGoodsModel.goods_cat"
                :options="options"
                :fieldNames="{
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children',
                }"
                @change="handleCascaderChange"
                placeholder="请选择"
              />
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="1" tab="商品参数">
            <a-form-item
              required
              :label="item.attr_name"
              :key="item.attr_id"
              v-for="item in manyData"
              name="goods_number"
            >
              <a-checkbox-group
                v-model:value="item.attr_vals"
                :options="item.attr_vals"
              />
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="2" tab="商品属性">
            <a-form-item
              required
              :label="item.attr_name"
              :key="item.attr_id"
              v-for="item in onlyData"
              name="goods_number"
            >
              <a-input v-model:value="item.attr_vals" />
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="3" tab="商品图片">
            <a-upload
              accept="image/*"
              action="http://www.wanlum.com:8888/api/private/v1/upload"
              :headers="headerObj"
              listType="picture"
              @change="hanleUploadchang"
              @preview="hanleUploadPrewview"
              :remove="handleUploadRemove"
            >
              <a-button type="primary"> <upload-outlined /> 上传图片 </a-button>
            </a-upload>
          </a-tab-pane>
          <a-tab-pane key="4" tab="商品内容">
            <ckeditor
              :editor="editor"
              v-model="addGoodsModel.goods_introduce"
              @blur="onEditorBlur"
            ></ckeditor>
            <!-- 添加商品按钮 -->
            <a-button type="primary" @click="handleAddGoods">添加商品</a-button>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-card>
    <!-- 预览图片弹出框 -->
    <a-modal
      title="图片预览"
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel"
    >
      <img alt="example" style="width: 100%" :src="prewviewPath" />
    </a-modal>
  </a-layout>
</template>
<script>
// 导入请求地址
import { goods } from "@/api";

// 导入请求方式
import { httpGet, httpPost } from "@/utils/http";
import { message } from "ant-design-vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import _ from "lodash";
export default {
  data() {
    return {
      // 数据模型
      addGoodsModel: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: [],
        goods_introduce: "",
        pics: [],
        attrs: [],
      },
      // 数据校验规则
      addGoodsRules: {
        goods_name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "商品价格不能为空", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "商品重量不能为空", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "商品数量不能为空", trigger: "blur" },
        ],
        goods_cat: [
          {
            type: "array",
            required: true,
            message: "商品分类不能为空",
            trigger: "blur",
          },
        ],
      },
      options: [],
      activeKey: "0",
      cate_id: "",
      manyData: [],
      onlyData: [],
      headerObj: { Authorization: window.sessionStorage.getItem("token") },
      prewviewPath: "",
      previewVisible: false,
      editor: ClassicEditor,
    };
  },
  created() {
    this.handleReadCates();
  },
  methods: {
    handleReadCates() {
      httpGet(goods.GetCategories)
        .then((response) => {
          // console.log(response);
          let { meta, data } = response;
          if (meta.status == 200) {
            this.options = data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleTabsChange(activeKey) {
      // 如果activeKey不是1且addGoodsModel.goods_cat的长度不为三 那么就让activeKey为1,还要提示用户
      if (activeKey !== "0" && this.addGoodsModel.goods_cat.length !== 3) {
        message.error("请先选择商品分类");
        this.activeKey = "0";
      } else {
        this.activeKey = activeKey;
        // 商品参数
        if (activeKey == "1") {
          // console.log("商品参数");
          httpGet(`categories/${this.cate_id}/attributes`, { sel: "many" })
            .then((response) => {
              console.log(response);
              let { data, meta } = response;
              if (meta.status == 200) {
                data.forEach((ele) => {
                  ele.attr_vals =
                    ele.attr_vals.length == 0 ? [] : ele.attr_vals.split(" ");
                });
                this.manyData = data;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        // 商品属性
        if (activeKey == "2") {
          httpGet(`categories/${this.cate_id}/attributes`, { sel: "only" })
            .then((response) => {
              console.log(response);
              let { data, meta } = response;
              if (meta.status == 200) {
                this.onlyData = data;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    },
    handleCascaderChange(value) {
      if (value.length == 3) {
        this.cate_id = value[value.length - 1];
        // console.log(this.cate_id);
      }
    },
    hanleUploadchang(file) {
      // console.log(file);
      if (file.file.status == "done") {
        let { fileList } = file;
        let arr = [];
        fileList.forEach((item) => {
          arr.push({ pic: item.response.data.tmp_path });
        });
        this.addGoodsModel.pics = arr;
        console.log(this.addGoodsModel.pics);
      }
    },
    hanleUploadPrewview(file) {
      // console.log(file);
      // let Urpath = ;

      this.prewviewPath = file.response.data.url.replace(
        /127.0.0.1/,
        "www.wanlum.com"
      );
      this.previewVisible = true;
      // console.log(Urpath);
    },
    handleCancel() {
      this.previewVisible = false;
      // this.prewviewPath = "";
    },

    handleUploadRemove(file) {
      // 在pics中查找和即将删除的路径一样的图片的索引
      let index = this.addGoodsModel.pics.findIndex(
        (item) => item.pic == file.response.data.tmp_path
      );
      console.log(index);
      // 通过索引把图片的临时路径从数组中删除
      this.addGoodsModel.pics.splice(index, 1);
    },
    onEditorBlur() {
      console.log(this.addGoodsModel.goods_introduce);
    },
    // 添加商品
    handleAddGoods() {
      // console.log(this.addGoodsModel);
      // console.log(this.manyData);
      // console.log(this.onlyData);
      // 1.表单校验
      this.$refs.addGoodsRef
        .validate()
        .then(() => {
          let form = _.cloneDeep(this.addGoodsModel);
          // 2.收集分类数据 goods_cat
          form.goods_cat = form.goods_cat.join(",");
          console.log(form);
          // 3.收集动态参数(manyData);
          this.manyData.forEach((item) => {
            form.attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(" "),
            });
          });
          // 4.收集静态参数
          this.onlyData.forEach((item) => {
            form.attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            });
          });
          // 5.发请求
          // console.log(form)
          httpPost(goods.AddGoods, form)
            .then((response) => {
              console.log(response);
              let { meta } = response;
              if (meta.status == 201) {
                message.success(meta.msg);
                this.$router.push("/goods");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          message.error("您还有未填完的项");
          console.log(err);
        });
    },
  },
  components: {
    UploadOutlined,
  },
};
</script>

<style>
.ck-editor__editable {
  min-height: 400px;
}
</style>