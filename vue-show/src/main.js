import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import App from "./App.vue";
import router from "./router";

import axios from "axios";
// axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
axios.defaults.baseURL = "http://www.wanlum.com:8888/api/private/v1/";

let app = createApp(App);
app.config.globalProperties.$axios = axios;
app
  // createApp(App)
  .use(Antd)
  .use(router)
  .mount("#app");
