// 引入vuex
import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import getters from './getters';


Vue.use(Vuex);

// 此处存放初始化的全局的 state
const state = {
    count: 1,
    testArr:[1,2,3],
    menu:null,
    infoPollTreeData: [],  //人才信息总库左侧树data
    infoTableCheckData:[],   //人才信息总库table选择的数据
    companyData:[], // 公司数据
    directoryData:null, // 字典数据
}

export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
})