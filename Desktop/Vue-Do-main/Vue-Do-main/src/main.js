import Vue from "vue";
import App from "./App.vue";
import { todoStore } from "./store/todoStore";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;

new Vue({
  store: todoStore,
  render: (h) => h(App),
}).$mount("#app");

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)