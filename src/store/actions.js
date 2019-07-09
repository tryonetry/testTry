// 提交mutation修改state状态

const actions = {
    // eg: 外部组件调用使用 this.$store.dispatch('increment',5)
    //自定义触发mutations里函数的方法，[context与store 实例具有相同方法和属性]
    increment(context,num) {  
        context.commit('_increment',num);
    },
    getinfoPollTreeData(context,data){
        context.commit('_getinfoPollTreeData', data);
    },
    getinfoTableCheckData(context, data){
        context.commit('_getinfoTableCheckData', data);
    },
    updateCompanyData(context,data){
        context.commit('_updateCompanyData',data);
    },
    getDirectoryData(context,data){
        context.commit('_getDirectoryData',data);
    },
    getNavData(context,data){
        context.commit('_getNavData',data);
    },
    changeLoginState(context,data){
        context.commit('_changeLoginState',data);
    }
};

export default actions;