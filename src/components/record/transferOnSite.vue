<!-- 现场转出页面 -->
<template>
<div class="outerContainer">

    <!-- 查询条件 -->
    <FormHeader :formTitle='"查询条件"'></FormHeader>
    <div class="detailContent searchCoditions">
        <!-- 查询条件 -->
        <p>
            <span>身份证号/社保卡号:</span>
            <a-input
                type="text"
                class="aInput"
                placeholder="请输入完整的身份证号/社保卡号"
                v-model="idCardNum"
            ></a-input>
        </p>
        <p>
            <span>存档编号:</span>
            <a-input
                type="text"
                class="aInput"
                placeholder="请输入完整的存档编号"
                v-model="saveRecordNum"
            ></a-input>
        </p>
        <!-- 查询按钮 -->
        <a-button 
            type="primary"
            class="searchBtn"
            @click="fetchData"
        >查询</a-button>
    </div>

    <!-- 基本信息 -->
    <FormHeader :formTitle='"存档人员基本信息"'></FormHeader>
    <div class="detailContent">
        <ShowBasicInfo :baseData="baseData" :cardTitle="cardTitle"></ShowBasicInfo>
    </div>

    <!-- 调转信息 -->
    <FormHeader :formTitle='"调转信息"'></FormHeader>
    <div class="detailContent">
        
    </div>

</div>
</template>

<script>

import FormHeader from "../formHeader";
import ShowBasicInfo from '../showBasicInfo';
import TableFromSearch from "../tableFormSearch";

export default {
    name:"TransferOnSite",
    //import引入的组件需要注入到对象中才能使用
    components: { FormHeader, ShowBasicInfo },
    props:["isInner"],

    data() {
        return {
            idCardNum:void 0,
            saveRecordNum:void 0,
            notInnerData:[
                { label:"姓名", val:void 0 ,name:'a0101'},
                { label:"性别", val:void 0 ,name:'a0104'},
                { label:"身份证号/社保卡号", val:void 0 ,name:'a0184'},
                { label:"曾用名", val:void 0 ,name:'a0139'},
                { label:"出生日期", val:void 0 ,name:'a0107'},
                { label:"政治面貌", val:void 0 ,name:'a0141'},
                { label:"最高学历", val:void 0 ,name:'a0834'},
                { label:"存档性质", val:void 0 ,name:'personType'},
                { label:"存档日期", val:void 0 ,name:'uCreateDate'},
                { label:"存档状态", val:void 0 ,name:'isInware'},
                { label:"联系电话", val:void 0 ,name:'a3707C'},
                { label:"现居住地址", val:void 0 ,name:'a3711'},
                { label:"委托存档单位名称", val:void 0 ,name:'companyId'},
                { label:"委托存档单位编号", val:void 0 ,name:'companyNum'},
                { label:"缺少材料", val:void 0 ,name:'lackMaterials'},
            ],
            innerData:[
                { label:"姓名", val:void 0 ,name:'a0101'},
                { label:"性别", val:void 0 ,name:'a0104'},
                { label:"身份证号/社保卡号", val:void 0 ,name:'a0184'},
                { label:"曾用名", val:void 0 ,name:'a0139'},
                { label:"出生日期", val:void 0 ,name:'a0107'},
                { label:"政治面貌", val:void 0 ,name:'a0141'},
                { label:"民族", val:void 0 ,name:'a0117'},
                { label:"婚姻状况", val:void 0 ,name:'a0131'},
                { label:"健康状况", val:void 0 ,name:'a0127'},
                { label:"联系电话", val:void 0 ,name:'a3707C'},
                { label:"电子邮箱", val:void 0 ,name:'a3708'},
                { label:"紧急联系人", val:void 0 ,name:'partyDuties'},
                { label:"紧急联系人电话", val:void 0 ,name:'emergencyPhone'},
                { label:"参加工作日期", val:void 0 ,name:'a0134'},
                { label:"籍贯", val:void 0 ,name:'a0111'},
                { label:"户籍所在地", val:void 0 ,name:'a0181'},
                { label:"现居住地址", val:void 0 ,name:'a3711'},
                { label:"最高学历", val:void 0 ,name:'a0834'},
                { label:"最高学位", val:void 0 ,name:'a0914'},
                { label:"最高学历毕业院校", val:void 0 ,name:'a0888'},
                { label:"最高学历毕业日期", val:void 0 ,name:'a0807'},
                { label:"存档编号", val:void 0 ,name:'a0100A'},
                { label:"委托存档单位", val:void 0 ,name:'companyId'},
                { label:"委托存档编号", val:void 0 ,name:'companyNum'},
            ],
            cardTitle:'',
            baseData:null,
        };
    },

    //监听属性 类似于data概念
    computed: {},

    //监控data中的数据变化
    watch: {
        //obj:{
        //    handler:function(val,oldval){
        //        
        //    },
        //    deep:true,//深度监听
        //}
    },

    //方法集合
    methods: {
        // 获取数据
        fetchData(){
            const _this = this;
            let fetchUrl = this.isInner ? 'personalArch@getPersonalArchByIdNumAndName.action':'archTransferOut@getPersonalArchByNumAndName.action';
            this.$http.fetchPost(fetchUrl,{
                a0184:_this.idCardNum,
                a0100A:_this.saveRecordNum,
            }).then(res => {
                if(Number(res.code) === 0 && res.data){
                    //数据处理
                    if(!_this.isInner){
                        _this.handleData('notInnerData',res.data);
                    }else{
                        _this.handleData('innerData',res.data);
                    }
                }else{
                    _this.$message.error('查询失败或档案信息不存在!')
                }
            }).catch(err => {
                _this.$message.error('抱歉,网络异常,请稍后重试')
            });
        },

        // 处理数据
        handleData(dataName,getedData){
            console.log(getedData)
            this[dataName].forEach((item) => {
                Object.assign(item,{val:getedData[item.name]});
            });
            this.baseData = this[dataName];
        }

    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        if(!this.isInner){
            this.baseData = this.notInnerData;
        }else{
            this.baseData = this.innerData;
        }
    },

    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },

    beforeCreate() {}, //生命周期 - 创建之前

    beforeMount() {}, //生命周期 - 挂载之前

    beforeUpdate() {}, //生命周期 - 更新之前

    updated() {}, //生命周期 - 更新之后

    beforeDestroy() {}, //生命周期 - 销毁之前

    destroyed() {}, //生命周期 - 销毁完成

    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发

}

</script>

<style scoped>
    .outerContainer{
        height: 100%;
        overflow: auto;
    }
    .searchCoditions{
        display: flex;
    }
    .searchCoditions>p{
        margin-right: 20px;
    }
    .searchCoditions>p>span{
        margin-right: 10px;
    }
    .searchCoditions>input{
        width: 200px;
    }
    .detailContent{
        padding-left: 20px;
        padding-bottom: 20px;
        box-sizing: border-box;
    }
    .searchBtn{
        margin-left: 20px;
    }
    .aInput{
        width: 250px;
    }

</style>