<template>
  <a-layout>
    <!-- 头部 -->
    <a-layout-header></a-layout-header>
    <!-- 主体 -->
    <a-layout-content>
      <!-- 登陆    -->
      <a-row>
        <a-col :span="6" :offset="10">
          <!-- 表单 -->
          <a-form ref="ruleForm" :rules="rules" :model="form">
            <!-- 标题 -->
            <a-row class="login-title">
              <a-col :span="24">
                <div class="title">
                  <h1><img src="../assets/logo.png" alt="" /> Ant Design</h1>
                  <span>Ant Design 是西湖区最具影响力的 Web 设计规范</span>
                </div>
                <!-- 登陆方式  -->
                <a-row>
                  <a-col :span="24">
                    <a-tabs :tabBarStyle="{ textAlign: 'center' }">
                      <!--  手机号码登陆-->
                      <a-tab-pane key="1" tab="账号密码登陆">
                        <a-form-item :wrapperCol="{ span: 24 }" name="username">
                          <a-input
                            size="large"
                            placeholder="请输入账号"
                            v-model:value="form.username"
                          >
                            <template #prefix
                              ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
                            /></template>
                          </a-input>
                        </a-form-item>
                        <a-form-item :wrapperCol="{ span: 24 }" name="password">
                          <a-input-password
                            type="password"
                            size="large"
                            placeholder="请输入密码"
                            v-model:value="form.password"
                          >
                            <template #prefix
                              ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
                            /></template>
                          </a-input-password>
                        </a-form-item>
                      </a-tab-pane>
                      <!-- 账号密码登陆 -->
                      <a-tab-pane key="2" tab=" 手机号码登陆" force-render>
                        <a-form-item :wrapperCol="{ span: 24 }">
                          <a-input size="large" placeholder="请输入手机号">
                            <template #prefix
                              ><MobileOutlined
                                style="color: rgba(0, 0, 0, 0.25)"
                            /></template>
                          </a-input>
                        </a-form-item>

                        <!-- 验证码 -->
                        <a-row :gutter="16">
                          <a-col class="gutter-row" :span="16">
                            <a-form-item :wrapperCol="{ span: 24 }">
                              <a-input size="large" placeholder="请输入验证码">
                                <template #prefix
                                  ><MailOutlined
                                    style="color: rgba(0, 0, 0, 0.25)"
                                /></template>
                              </a-input>
                            </a-form-item>
                          </a-col>
                          <a-col size="large" class="gutter-row" :span="8">
                            <a-button size="large" style="padding: 0"
                              >获取验证码</a-button
                            >
                          </a-col>
                        </a-row>
                      </a-tab-pane>
                    </a-tabs>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <!-- 忘记密码 -->
            <a-row class="logo-forget">
              <a-col :span="24">
                <a-checkbox>自动登陆</a-checkbox>
                <router-link to="#" style="float: right">忘记密码</router-link>
              </a-col>
            </a-row>
            <!-- 确定按钮 -->
            <a-row style="margin: 24px 0">
              <a-col :span="24">
                <a-form-item :wrapperCol="{ span: 24 }">
                  <a-button block size="large" type="primary" @click="onSubmit"
                    >确定
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
            <!-- 其他方式 -->
            <a-row style="margin: 24px 0">
              <a-col :span="24">
                <a-form-item :wrapperCol="{ span: 24 }">
                  <span
                    >其他登陆方式
                    <AlipayCircleOutlined class="item-ico"/>
                    <TaobaoCircleOutlined class="item-ico"/>
                    <WeiboCircleOutlined class="item-ico"
                  /></span>
                  <router-link to="#" style="float: right"
                    >注册账号</router-link
                  >
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
    </a-layout-content>
    <a-layout-footer></a-layout-footer>
  </a-layout>
</template>

<script>
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined
} from "@ant-design/icons-vue";
// 引入http方法
import { httpPost } from "@/utils/http";
// 引入接口
import { user } from "@/api";
import { message } from "ant-design-vue";
export default {
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
      },
      rules: {
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
        ]
      }
    };
  },
  //引入小图标
  components: {
    UserOutlined,
    LockOutlined,
    MobileOutlined,
    MailOutlined,
    AlipayCircleOutlined,
    TaobaoCircleOutlined,
    WeiboCircleOutlined
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm
        .validate()
        .then(() => {
          // 2.引入请求地址
          let url = user.LoginUser;
          // console.log("values", this.form);
          // console.log(this);

          let params = {
            username: this.form.username,
            password: this.form.password
          };

          httpPost(url, params)
            .then(response => {
              // .post("/login", params)
              // console.log(response);
              let { meta, data } = response;
              // console.log(meta);
              // console.log(data);
              // 判断是否登陆成功
              if (meta.status == 400) {
                return message.error(meta.msg);
              }
              if (meta.status == 200) {
                // 提示登陆成功
                message.success(meta.msg);
                // 把后端的返回的token存储sessionStorage中
                window.sessionStorage.setItem("token", data.token);
                this.$router.push("/home");
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }
};
</script>

<style scoped>
.ant-layout {
  height: 100%;
  background-image: url(../assets/image/TVYTbAXWheQpRcWDaDMu.svg);
}

.ant-layout-header {
  background-color: transparent;
  margin-bottom: 32px;
}
.ant-form {
  width: 365px;
  height: 500px;
}
.login-title .title {
  text-align: center;
}
.ant-form h1 img {
  width: 44px;
  height: 44px;
}
.ant-form h1 {
  position: relative;
  top: 2px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  font-size: 35px;
  font-family: Avenir, helvetica neue, Arial, Helvetica, sans-serif;
}
.ant-form h1 span {
  margin-top: 12px;
  margin-bottom: 40px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 24px;
}
.item-ico {
  /* font-size: 24px;
  color: #848587;
  position: relative;
  top: 4px;
  margin: 0 5px; */
  font-size: 24px;
  color: #848587;
  position: relative;
  top: 4px;
  margin: 0 6px;
}
.item-ico:hover {
  color: #40a9ff;
}
</style>
