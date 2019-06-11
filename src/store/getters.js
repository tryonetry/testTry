// 获取store内的状态

const getters = {
    // 外部组件调用使用 

    /*
    <span>{{globalCount}}</span>
    computed(){
        globalCount:function(){
            return this.$store.getters.getCount
        }
    }
    */
   
    //实时监听state值的变化(最新状态)
    getCount(state) {
        return state.count
    },
    // 人才信息总库的tree数据
    getInfoPollTreeData(state){
        return state.infoPollTreeData
    },
    // 
    getinfoTableCheckData(state){
        return state.infoTableCheckData
    },
    // 获取公司信息
    getCompanyData(state){
        return state.companyData
    },
    // 获取字典数据
    getDirectoryData(state){
        return state.directoryData
    },
    // 获取导航栏数据
    getNavData(state){
        return state.navData;
    }
}

export default getters;