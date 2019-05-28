import Vue from 'vue';
import App from './App.vue';
import 'es6-promise/auto';
import "ant-design-vue/dist/antd.css";
import antd from 'ant-design-vue';

import './assets/index.css'

import store from './store';
import router from './router';
import * as http from '@/http';
import echarts from 'echarts'

Vue.prototype.$echarts = echarts;
Vue.prototype.$http = http;
Vue.prototype.$targetHost = 'http://192.168.1.215:8180/hasngcadrefile/'
Vue.use(antd);


Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
