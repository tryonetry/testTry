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
                @change="searchConditionChange"
            ></a-input>
        </p>
        <p>
            <span>存档编号:</span>
            <a-input
                type="text"
                class="aInput"
                placeholder="请输入完整的存档编号"
                v-model="saveRecordNum"
                @change="searchConditionChange"
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
    <FormHeader :formTitle='isInner ? "调转信息" : "转出信息"'></FormHeader>
    <div class="detailContent">
        <TableFromSearch 
            :formDataArr='isInner ? formDataInner : ( !isEnterprice ? formDataNotInner : formDataEnterprice) '>
        </TableFromSearch>
    </div>

</div>
</template>

<script>

// 委托单位名称 To 委托单位编号
function companyNameToNum(codeVal){
  // console.log(codeVal)
  if(codeVal){
    return [
      {name:'val',data:codeVal},
      {name:'disabled',data:true}
    ]
  }
  return [{name:'val',data:''},{name:'disabled',data:false}]
}

// 委托单位编号 To 委托单位名称
function companyNumToName(numVal){
  if(numVal || String(numVal) === '0'){
    return [
      {name:'val',data:numVal},
      {name:'disabled',data:true},
      {name:'tip',data:'* 抱歉,尚未找到对应编号的公司'}
    ]
  }else{
    return [
      {name:'val',data:''},
      {name:'disabled',data:false},
      {name:'tip',data:'* 请选择委托存档单位名称'},
      {name:'status',data:void 0},
    ]
  }
}

import FormHeader from "../formHeader";
import ShowBasicInfo from '../showBasicInfo';
import TableFromSearch from "../tableFormSearch";
import moment from "moment";

export default {
    name:"TransferOnSite",
    //import引入的组件需要注入到对象中才能使用
    components: { FormHeader, ShowBasicInfo, TableFromSearch },
    props:["isInner","personData"],

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
            isEnterprice:false,
            // 非内部调转
            formDataNotInner: {
                // inputs
                formInputs: [
                    {
                        title: '申请人',
                        type: "text",
                        required: true,
                        placeholder: "请输入申请人姓名",
                        key: "name",
                        name: "name",
                        val: void 0,
                        postname: "",
                        maxlength: 20,
                        minlength: 0,
                        reg: '',
                        tip: '* 请输入正确的申请人姓名',
                        status: '',
                    },
                    {
                        title: '身份证号/社保卡号',
                        type: "text",
                        required: true,
                        placeholder: "请输入申请人身份证号/社保卡号",
                        key: "name",
                        name: "name",
                        val: void 0,
                        postname: "",
                        maxlength: 18,
                        minlength: 15,
                        reg: 'testid',
                        tip: '* 请输入正确的申请人身份证号/社保卡号',
                        status: '',
                    },
                    {
                        title: '申请人电话',
                        type: "text",
                        required: false,
                        placeholder: "请输入申请人电话号码",
                        key: "name",
                        name: "name",
                        val: void 0,
                        postname: "",
                        maxlength: 11,
                        minlength: 11,
                        reg: 'testMobile',
                        tip: '* 请输入正确的申请人电话号码',
                        status: '',
                    },
                    {
                        title: '邮政编码',
                        type: "text",
                        required: false,
                        placeholder: "请输入邮政编码",
                        key: "name",
                        name: "name",
                        val: void 0,
                        postname: "",
                        maxlength: 6,
                        minlength: 6,
                        reg: 'testZipCode',
                        tip: '* 请输入正确的邮政编码',
                        status: '',
                    },
                    {
                        title: "申请日期",
                        otherType: "date",
                        required: false,
                        placeholder: "请选择申请日期",
                        key: "a0107",
                        name: "a0107",
                        val: moment(new Date()),
                        postname: "a0107",
                        maxlength: 20,
                        minlength: 0,
                        reg: "",
                        tip: "* 请选择申请日期",
                        disabled:true,
                        status: ""
                    },
                    {
                        title: "转出原因",
                        otherType: "select",
                        required: true,
                        placeholder: "请选择转出方式",
                        name: "source",
                        key: "source",
                        val: void 0,
                        postname: "source",
                        tip:'* 请选择转出方式',
                        children: [],
                        status: ""
                    },
                    {
                        title: '原档案管理机构',
                        type: "text",
                        required: false,
                        placeholder: "请输入原档案管理机构",
                        key: "name",
                        name: "name",
                        val: void 0,
                        postname: "",
                        maxlength: 40,
                        minlength: 0,
                        reg: '',
                        tip: '* 请输入原档案管理机构',
                        status: '',
                    },
                    {
                        title: '转往单位名称',
                        type: "text",
                        required: true,
                        placeholder: "请输入转往单位名称",
                        key: "name",
                        name: "name",
                        val: void 0,
                        postname: "",
                        maxlength: 40,
                        minlength: 0,
                        reg: '',
                        tip: '* 请输入转往单位名称',
                        status: '',
                    },
                    {
                        title: '转往单位地址',
                        type: "text",
                        required: false,
                        placeholder: "请输入转往单位地址",
                        key: "name",
                        name: "name",
                        val: void 0,
                        postname: "",
                        maxlength: 40,
                        minlength: 0,
                        reg: '',
                        tip: '* 请输入转往单位地址',
                        status: '',
                    },
                    {
                        title: "转往单位行政区划",
                        otherType: "addressSelect",
                        required: true,
                        placeholder: "请选择转往单位行政区划",
                        key: "a0111D",
                        name: "a0111D",
                        val: void 0,
                        postname: "a0111D",
                        maxlength: 100,
                        minlength: 0,
                        reg: "",
                        tip: "* 请选择转往单位行政区划",
                        status: ""
                    },
                    {
                        title: "备注",
                        otherType: "textarea",
                        required: false,
                        placeholder: "请输入备注",
                        key: "remarks",
                        name: "remarks",
                        val: void 0,
                        postname: "remarks",
                        maxlength: 200,
                        minlength: 0,
                        reg: "",
                        tip: "* 请输入备注",
                        status: ""
                    }
                ],
            },

            formDataEnterprice:{
                formInputs: [
                    {
                        title: '调转日期',
                        otherType: "date",
                        required: false,
                        placeholder: "请选择调转日期",
                        key: "name",
                        name: "name",
                        val: moment(new Date()),
                        postname: "",
                        maxlength: 20,
                        minlength: 0,
                        reg: '',
                        tip: '* 请选择调转日期',
                        disabled:true,
                        status: '',
                    },
                    {
                        title: "调转方式",
                        otherType: "select",
                        required: true,
                        placeholder: "请选择调转方式",
                        name: "source",
                        key: "source",
                        val: void 0,
                        postname: "source",
                        tip:'* 请选择调转方式',
                        children: [
                            {itemCode:"01",itemName:"集体转集体"},
                            {itemCode:"02",itemName:"集体转个人"},
                            {itemCode:"03",itemName:"个人转集体"},
                        ],
                        disabled:false,
                        status: ""
                    },
                ]
            },

            formDataInner:{
                formInputs: [
                    {
                        title: '调转日期',
                        otherType: "date",
                        required: false,
                        placeholder: "请选择调转日期",
                        key: "name",
                        name: "name",
                        val: moment(new Date()),
                        postname: "",
                        maxlength: 20,
                        minlength: 0,
                        reg: '',
                        tip: '* 请选择调转日期',
                        disabled:true,
                        status: '',
                    },
                    {
                        title: "调转方式",
                        otherType: "select",
                        required: true,
                        placeholder: "请选择调转方式",
                        name: "source",
                        key: "source",
                        val: void 0,
                        postname: "source",
                        tip:'* 请选择调转方式',
                        children: [
                            {itemCode:"01",itemName:"集体转集体"},
                            {itemCode:"02",itemName:"集体转个人"},
                            {itemCode:"03",itemName:"个人转集体"},
                        ],
                        disabled:false,
                        status: ""
                    },
                    {
                        title: "委托存档单位名称",
                        otherType: "searchSelect",
                        required: false,
                        placeholder: "请选择委托存档单位名称",
                        key: "companyId",
                        name: "companyId",
                        val: void 0,
                        postname: "companyId",
                        maxlength: 40,
                        minlength: 0,
                        reg: "",
                        tip: "* 请选择委托存档单位名称",
                        children:[],
                        status: "",
                        connectTo:['companyNum'], //关联到委托单位编号
                        connectToFun:[companyNameToNum], 
                        disabled:false,
                    },
                    {
                        title: "委托存档单位编号",
                        type: "text",
                        required: false,
                        placeholder: "请输入委托存档单位编号",
                        key: "companyNum",
                        name: "companyNum",
                        val: void 0,
                        postname: "companyNum",
                        maxlength: 40,
                        minlength: 0,
                        reg: "",
                        tip: "* 请输入委托存档单位编号",
                        disabled:false,
                        status: "",
                        connectTo:['companyId'], //关联到委托单位名称
                        connectToFun:[companyNumToName],
                    },
                    {
                        title: "备注",
                        otherType: "textarea",
                        required: false,
                        placeholder: "请输入备注",
                        key: "remarks",
                        name: "remarks",
                        val: void 0,
                        postname: "remarks",
                        maxlength: 200,
                        minlength: 0,
                        reg: "",
                        tip: "* 请输入备注",
                        status: ""
                    }
                ]
            },
            
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
            if(getedData.personType.split('-')[1] === '01' && !this.isInner){
                this.isEnterprice = true;
            }
            this[dataName].forEach((item) => {
                Object.assign(item,{val:getedData[item.name]});
            });
            this.baseData = this[dataName];
        },

        // search condition bundle change
        searchConditionChange(){
            console.log(1)
        }

    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        if(!this.isInner){
            this.baseData = this.notInnerData;
        }else{
            this.baseData = this.innerData;
        }
        // 获取转出方式
        this.$http.fetchPost('archTransferOut@getSceneArchTransferOut.action',null)
            .then(res => {
                if(Number(res.code) === 0){
                    this.formDataNotInner.formInputs.forEach((item,index)=>{
                        // console.log(tempCompanylist)
                        if(item.name === 'companyId') item.children = res.transferTypeList;
                    })
                    
                }
            })
            .catch(err => {
                //....
            });

        // 获取调转方式
        // this.$http.fetchPost('ArchTransferOutAction@getSceneArchTransferOut.action',null)
        //     .then(res => {
        //         console.log(res);
        //     })
        //     .catch(err => {
        //         //....
        //     });

        // 获取公司名称
        this.$http.fetchGet('personalArch@getCompanyList.action',{})
            .then(res => {
                if(Number(res.code) === 0){
                this.companyList = res.data;
                // 委托存档单位名称
                let tempCompanylist = [];
                res.data.forEach( company => {
                    // attention ! code - id
                    tempCompanylist.push({itemName:company.itemName,itemCode: company.itemId,itemId:company.itemCode});
                });
                this.formDataInner.formInputs.forEach((item,index)=>{
                    // console.log(tempCompanylist)
                    if(item.name === 'companyId') item.children = tempCompanylist;
                })
                }else{
                //...
                }
            })
            .catch(err => {
                // ...
            });
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