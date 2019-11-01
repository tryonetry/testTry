import Vue from 'vue';
import App from './App.vue';
import 'es6-promise/auto';
import "ant-design-vue/dist/antd.css";
import antd from 'ant-design-vue';

import './assets/index.css'

import './assets/font/font_leapeszd49e/iconfont.css'

import store from './store';
import router from './router';
import * as http from '@/http';
import echarts from 'echarts'
import printJS from 'print-js'
import print from './utils/print';
import VueParticles from 'vue-particles';

import VueAMap from 'vue-amap';
import ApiUrl from '../public/config'

Vue.prototype.printJS = printJS;
Vue.prototype.$echarts = echarts;
Vue.prototype.$http = http;
// Vue.prototype.$targetHost = 'http://192.168.1.215:8181/'
Vue.prototype.$targetHost = ApiUrl.ApiUrl.targetHost;
Vue.prototype.$readHost = ApiUrl.ApiUrl.readAddress;

Vue.use(antd);
Vue.use(print);
Vue.use(VueParticles);
Vue.config.productionTip = false;
Vue.prototype.$message.config({
  maxCount: 1
});

Vue.use(VueAMap);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
