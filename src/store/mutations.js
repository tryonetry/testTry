// import { stat } from "fs";
// 更改store中的状态函数
export default {
    _increment(state, num) {
        //变更状态
        state.count += num;
    },
    _getinfoPollTreeData(state, data){
        state.infoPollTreeData = data;
    },
    _getinfoTableCheckData(state, data){
        state.infoTableCheckData = data;
    },
    _updateCompanyData(state,data){
        state.companyData = data;
    },
    _getDirectoryData(state,data){
        state.directoryData = data;
    },
    _getNavData(state,data){
        state.navData = data;
    },
    _changeLoginState(state,data){
        state.loginData = data;
    }
    
}