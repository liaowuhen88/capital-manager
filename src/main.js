import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router/router.js'
import qs from 'qs'
import store from './store'
import ElementUI from 'element-ui'
import Utils from './common/utils'
import 'element-ui/lib/theme-chalk/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import './mock.js'

Vue.config.productionTip = false;
Vue.use(ElementUI);

axios.defaults.baseURL = process.env.VUE_APP_BASE_API

Vue.prototype.$http = axios;
Vue.prototype.Utils = Utils;
Vue.prototype.$qs = qs;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
