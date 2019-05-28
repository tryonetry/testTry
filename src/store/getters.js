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
    getInfoPollTreeData(state){
        return state.infoPollTreeData
    },
    getinfoTableCheckData(state){
        return state.infoTableCheckData
    },
    getCompanyData(state){
        return state.companyData
    }
}

export default getters;