<!-- template -->
<template>
  <!-- 档案信息组件 -->
  <div class="recordInfo">
    <TableFromSearch :formDataArr="formData" ref="childForm"></TableFromSearch>
    <slot name="operationAction"></slot>
  </div>
</template>

<script>
// 关联函数

// 存档性质到委托单位名称和委托单位编号的显示
function UnitNatureToCompanyShow(val){
  // 单位:01 
  if(val === '01'){
    return [
      {name:'isHide',data:false},
      {name: 'required', data: true},
      {name: 'disabled', data: false}
    ]
  }else{
    return [{name:'isHide',data:true}]
  }
} 

// 身份证号到出生日期
function idcardToBirthday(idNum){
  if(!idNum || idNum.length <= 0){
    return  [{name: 'val', data: '' }];
  }
  if(idNum.length === 18){
    return [{name: 'val', data: idNum =='111111111111111111' ||  idNum =='222222222222222222'? moment(new Date()).format('YYYY-MM-DD') : idNum.substr(6,8) }];
  }else if(idNum.length === 15){
    // console.log('19'+idNum.substr(6,6))
    return [{name: 'val', data: idNum =='111111111111111' || idNum =='222222222222222' ? moment(new Date()).format('YYYY-MM-DD') : '19'+idNum.substr(6,6) }];
  }
  return  [{name: 'val', data: '' }];
}

// 身份证号到性别
function idcardTotoGender(idNum){
  if(!idNum || idNum.length <= 0){
    return  [{name: 'val', data: '' }];
  }
  if(idNum.length === 18){
    return [{name: 'val', data: Number(idNum[16])%2 === 0 ? "2":"1" }];
  }else if(idNum.length === 15){
    return [{name: 'val', data: Number(idNum[14])%2 === 0 ? "2":"1" }];
  }
  return  [{name: 'val', data: '' }];
}

// 身份证号到户籍行政区划
function idCardToAddress(idNum){
  if(!idNum || idNum.length <= 0){
    return  [{name: 'val', data: '' }];
  }
  // 18位或15位身份证号时
  if(idNum.length === 18 || idNum.length === 15){
    let provinceCode = idNum.substr(0,2);
    let cityCode = idNum.substr(2,2);
    let areaCode = idNum.substr(4,2);
    // 612525199508144314
    return [{name: 'val', data: [ provinceCode, provinceCode+cityCode, provinceCode+cityCode+areaCode ]}];
  }
  return  [{name: 'val', data: '' }];
}

// 身份证号对应本身
// function idCardToSelf(idNum){
//   if(!idNum || idNum.length <= 0){
//     return  [{name: 'val', data: '' }];
//   }else{
//     return [{name:"val",data:idNum, operate:'recordInfoIdCard'}]
//   }
// }
function idCardToSelf(idNum){
  return new Promise(function(resolve, reject){
    if(!idNum || idNum.length <= 0){
      resolve([
        {name: 'val', data: '' }
      ])  
    } else{
      if(regs.testid(idNum) === 1){
        window.isWithdrawFileFun(idNum, ['a0107','a0104','a0111D','a0184']);
      } else{
        reject("请填写正确的身份证号码！");
      }
    }
  })
}

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

//来档方式  To 邮寄编号
function sourceToConfNumber(wayVal){
   if(String(wayVal) === '1' || String(wayVal) === '2'){
     return [
       {name:'disabled',data:false},
       {name: 'required', data: true}
     ]
   } else{
     return [
       {name:'disabled',data:true},
       {name: 'val', data: void 0},
       {name: 'required', data: false},
       {name:'status',data:void 0},
     ]
   }
}

//学历 To  学位
function schoolToDegree(val){
  // console.log(val);
  if(String(val) === '11' || String(val) === '14' || String(val) === '21'){
    return [
      {name:'disabled',data:false}
    ]
  } else{
     return [
      {name:'disabled',data:true},
      {name: 'val', data: void 0},
      {name:'status',data:void 0},
    ]
  }
}

//学历 To 最高学历毕业日期， 最高学历毕业院校
function schoolToGraduate(val){
  if(String(val) === '90'){
    return [{name: 'required', data: false}, {name: 'status', data: ''}]
  } else{
    return [{name: 'required', data: true}]
  }
}


import moment from "moment";
import TableFromSearch from "../tableFormSearch";
import { Promise } from 'q';
import regs from '../../utils/regexp';
export default {
  name: "RecordInfo",
  //import引入的组件需要注入到对象中才能使用
  components: {
    TableFromSearch
  },
  props: [
    "currentPersonData",
    "isStaff",
    "currentEnterprice",
    "disabledFlag"
  ],

  data() {
    return {
          formData: {
            // inputs
            formInputs: [
              // 分割标题
              {
                title: "存档信息",
                otherType: "segementTitle",
              },
              {
                title: "存档性质",
                otherType: "searchSelect",
                required: true,
                placeholder: "请选择存档性质",
                name: "personType",
                key: "personType",
                val: void 0,
                postname: "personType",
                tip:'* 请选择存档性质',
                children: [],
                status: "",
                disabled:false,
                connectTo:['companyId','companyNum'],
                connectToFun:[UnitNatureToCompanyShow,UnitNatureToCompanyShow],
              },
              {
                title: "来档方式",
                otherType: "searchSelect",
                required: true,
                placeholder: "请选择来档方式",
                name: "source",
                key: "source",
                val: void 0,
                postname: "source",
                tip:'* 请选择来档方式',
                children: [],
                status: "",
                connectTo:['confNumber'], //关联邮寄编号 --- 机要/快递：邮寄编号可填；其他不可填
                connectToFun:[sourceToConfNumber], 
              },
              {
                title: "邮寄编号",
                type: "text",
                required: false,
                placeholder: "请输入邮寄编号",
                key: "confNumber",
                name: "confNumber",
                val: void 0,
                postname: "confNumber",
                maxlength: 30,
                minlength: 0,
                reg: "",
                tip: "* 请输入邮寄编号",
                status: ""
              },
              { 
                title: "存档编号",
                type: "text",
                required: false,
                placeholder: "此项自动生成",
                key: "a0100A",
                name: "a0100A",
                val: void 0,
                postname: "a0100A",
                maxlength: 30,
                minlength: 0,
                reg: "",
                tip: "* 请输入存档编号",
                disabled:true,
                status: ""
              },
              {
                title: "启用库房",
                otherType: "select",
                required: true,
                placeholder: "请选择启用库房",
                name: "hasWare",
                key: "hasWare",
                val: void 0,
                postname: "hasWare",
                tip:'* 请选择启用库房',
                children: [
                  {itemCode: '1', itemName:'停用'},
                  {itemCode: '0', itemName:'启用'},
                ],
                status: "",
              },
              // 分割标题
              {
                title: "登记信息",
                otherType: "segementTitle",
              },
              {
                title: "姓名",
                type: "text",
                required: true,
                placeholder: "请输入姓名",
                key: "a0101",
                name: "a0101",
                val: void 0,
                postname: "a0101",
                maxlength: 40,
                minlength: 0,
                reg: "",
                tip: "* 请输入姓名",
                status: ""
              },
              {
                title: "公民身份号码",
                type: "text",
                required: false,
                placeholder: "请输入公民身份号码/社保卡号",
                key: "a0184",
                name: "a0184",
                val: void 0,
                postname: "a0184",
                maxlength: 18,
                minlength: 15,
                reg: "testid",
                tip: "* 请输入公民身份号码/社保卡号",
                connectTo:['a0107','a0104','a0111D','a0184'], //关联到日期和性别
                connectToFun:[idcardToBirthday,idcardTotoGender,idCardToAddress,idCardToSelf], 
                status: ""
              },
              {
                title: "出生日期",
                otherType: "date",
                required: false,
                placeholder: "请选择出生日期",
                key: "a0107",
                name: "a0107",
                val: void 0,
                postname: "a0107",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请选择出生日期",
                disabled:false,
                status: ""
              },
              {
                title: "曾用名",
                type: "text",
                required: false,
                placeholder: "请输入曾用名",
                key: "a0139",
                name: "a0139",
                val: void 0,
                postname: "a0139",
                maxlength: 30,
                minlength: 0,
                reg: "",
                tip: "* 请输入曾用名",
                status: ""
              },
              {
                title: "籍贯",
                type: "text",
                required: false,
                placeholder: "请输入籍贯",
                key: "a0111",
                name: "a0111",
                val: void 0,
                postname: "",
                maxlength: 100,
                minlength: 0,
                reg: "",
                tip: "* 请输入籍贯",
                status: ""
              },
              {
                title: "性别",
                otherType: "select",
                required: false,
                placeholder: "请选择性别",
                tip: "* 请选择性别",
                name: "a0104",
                key: "a0104",
                val: void 0,
                postname: "a0104",
                disabled:false,
                children: [],
                status: ""
              },
              {
                title: "民族",
                otherType: "searchSelect",
                required: true,
                placeholder: "请选择民族",
                tip:'* 请选择民族',
                name: "a0117",
                key: "a0117",
                val: void 0,
                postname: "a0117",
                children: [],
                status: ""
              },
              {
                title: "政治面貌",
                otherType: "searchSelect",
                required: true,
                placeholder: "请选择政治面貌",
                tip:'* 请选择政治面貌',
                name: "a0141",
                key: "a0141",
                val: void 0,
                postname: "a0141",
                children: [],
                status: ""
              },
              {
                title: "参加组织时间",
                otherType: "date",
                required: false,
                placeholder: "请选择参加组织时间",
                key: "joinPartyDate",
                name: "joinPartyDate",
                val: void 0,
                postname: "joinPartyDate",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请选择参加组织时间",
                disabled:false,
                status: ""
              },
              {
                title: "婚姻状况",
                otherType: "searchSelect",
                required: false,
                placeholder: "请选择婚姻状况",
                name: "a0131",
                key: "a0131",
                val: void 0,
                postname: "a0131",
                children: []
              },
              {
                title: "健康状况",
                otherType: "searchSelect",
                required: false,
                placeholder: "请选择健康状况",
                name: "a0127",
                key: "a0127",
                val: void 0,
                postname: "",
                children: []
              },
              {
                title: "参加工作日期",
                otherType: "date",
                required: false,
                placeholder: "请选择参加工作日期",
                key: "a0134",
                name: "a0134",
                val: void 0,
                postname: "a0134",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请选择参加工作日期",
                status: ""
              },
              {
                title: "人员身份",
                otherType: "searchSelect",
                required: true,
                placeholder: "请选择人员身份",
                tip:'* 请选择人员身份',
                name: "archivesIdentity",
                key: "archivesIdentity",
                val: void 0,
                postname: "archivesIdentity",
                children: [],
                status: ""
              },
              {
                title: "手机号码",
                type: "text",
                required: false,
                placeholder: "请输入手机号码",
                key: "a3707C",
                name: "a3707C",
                val: void 0,
                postname: "a3707C",
                maxlength: 11,
                minlength: 0,
                reg: "testMobile",
                tip: "* 请输入正确的手机号码",
                status: ""
              },
              {
                title: "紧急联系人",
                type: "text",
                required: false,
                placeholder: "请输入紧急联系人",
                key: "partyDuties",
                name: "partyDuties",
                val: void 0,
                postname: "partyDuties",
                maxlength: 40,
                minlength: 0,
                reg: "",
                tip: "* 请输入紧急联系人",
                status: ""
              },
              {
                title: "紧急联系人电话",
                type: "text",
                required: false,
                placeholder: "请输入紧急联系人电话",
                key: "emergencyTel",
                name: "emergencyTel",
                val: void 0,
                postname: "emergencyTel",
                maxlength: 11,
                minlength: 0,
                reg: "",
                tip: "* 请输入紧急联系人",
                status: ""
              },
              {
                title: "电子邮箱",
                type: "text",
                required: false,
                placeholder: "请输入电子邮箱",
                key: "a3708",
                name: "a3708",
                val: void 0,
                postname: "a3708",
                maxlength: 40,
                minlength: 0,
                reg: "testEmail",
                tip: "* 请输入电子邮箱",
                status: ""
              },
              {
                title: "现居住地址",
                type: "text",
                required: false,
                placeholder: "请输入现居住地址",
                key: "a3711",
                name: "a3711",
                val: void 0,
                postname: "a3711",
                maxlength: 100,
                minlength: 0,
                reg: "",
                tip: "* 请输入现居住地址",
                status: ""
              },
              {
                title: "户口所在地址",
                type: "text",
                required: false,
                placeholder: "请输入户口所在地址",
                key: "a0181",
                name: "a0181",
                val: void 0,
                postname: "a0181",
                maxlength: 100,
                minlength: 0,
                reg: "",
                tip: "* 请输入户口所在地址",
                status: ""
              },
              {
                title: "户籍行政区划",
                otherType: "addressSelect",
                required: false,
                placeholder: "请选择户籍行政区划",
                key: "a0111D",
                name: "a0111D",
                val: void 0,
                postname: "a0111D",
                maxlength: 100,
                minlength: 0,
                reg: "",
                tip: "* 请选择户籍行政区划",
                status: ""
              },
              {
                title: "工作单位名称",
                type: "text",
                required: false,
                placeholder: "请输入工作单位名称",
                key: "a0202A",
                name: "a0202A",
                val: void 0,
                postname: "a0202A",
                maxlength: 50,
                minlength: 0,
                reg: "",
                tip: "* 请输入工作单位名称",
                status: ""
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
                title: "委托存档单位名称",
                otherType: "searchSelect",
                required: false,
                placeholder: "请选择委托存档单位名称",
                key: "companyId",
                name: "companyId",
                val: void 0,
                postname: "companyId",
                maxlength: 50,
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
                title: "转入原因",
                otherType: "searchSelect",
                required: true,
                placeholder: "请选择转入原因",
                key: "inComeReason",
                name: "inComeReason",
                val: void 0,
                postname: "inComeReason",
                maxlength: 200,
                minlength: 0,
                reg: "",
                tip: "* 请选择转入原因",
                children:[],
              },
              {
                title: "最高职称名称",
                otherType: "searchSelect",
                required: false,
                placeholder: "请选择最高职称名称",
                key: "hightestTitle",
                name: "hightestTitle",
                val: void 0,
                postname: "hightestTitle",
                maxlength: 50,
                minlength: 0,
                reg: "",
                tip: "* 请选择最高职称名称",
                children:[],
                status: ""
              },
              {
                title: "取得最高职称日期",
                otherType: "date",
                required: false,
                placeholder: "请选择取得最高职称日期",
                key: "hightestTitleDate",
                name: "hightestTitleDate",
                val: void 0,
                postname: "hightestTitleDate",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请选择取得最高职称日期",
                status: ""
              },
              {
                title: "原存档单位名称",
                type:'text',
                required: true,
                placeholder: "请输入原存档单位名称",
                key: "oldArchiveUnit",
                name: "oldArchiveUnit",
                val: void 0,
                postname: "oldArchiveUnit",
                maxlength: 50,
                minlength: 0,
                reg: "",
                tip: "* 请输入原存档单位名称",
                status: ""
              },
              {
                title: "原存档单位行政区划",
                otherType: "addressSelect",
                required: true,
                placeholder: "请选择原存档单位行政区划",
                key: "oldArchiveUnitArea",
                name: "oldArchiveUnitArea",
                val: void 0,
                postname: "oldArchiveUnitArea",
                maxlength: 100,
                minlength: 0,
                reg: "",
                tip: "* 请选择原存档单位行政区划",
                status: ""
              },
              {
                title: "缺少材料",
                otherType: "textarea",
                required: false,
                placeholder: "请输入缺少材料",
                key: "lackMaterials",
                name: "lackMaterials",
                val: void 0,
                postname: "lackMaterials",
                maxlength: 200,
                minlength: 0,
                reg: "",
                tip: "* 请输入缺少材料",
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
              },

              // 分割标题
              {
                title: "学历信息",
                otherType: "segementTitle",
              },
              {
                title: "最高学历",
                otherType: "searchSelect",
                required: true,
                placeholder: "请选择最高学历",
                tip:'* 请选择最高学历',
                name: "a0834",
                key: "a0834",
                val: void 0,
                postname: "a0834",
                children: [],
                status: "",
                connectTo: ['a0914', 'a0807', 'a0888'],
                connectToFun: [schoolToDegree, schoolToGraduate, schoolToGraduate]
              },
              {
                title: "最高学位",
                otherType: "searchSelect",
                required: false,
                placeholder: "请选择最高学位",
                tip:'* 请选择最高学位',
                name: "a0914",
                key: "a0914",
                val: void 0,
                postname: "a0914",
                children: [],
                status: "",
                disabled: ''
              },
              {
                title: "最高学历毕业日期",
                otherType: "date",
                required: true,
                placeholder: "请选择最高学历毕业日期",
                key: "a0807",
                name: "a0807",
                val: void 0,
                postname: "a0807",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请选择最高学历毕业日期",
                status: ""
              },
              {
                title: "最高学历毕业院校",
                type: "text",
                required: true,
                placeholder: "请输入最高学历毕业院校",
                key: "a0888",
                name: "a0888",
                val: void 0,
                postname: "a0888",
                maxlength: 50,
                minlength: 0,
                reg: "",
                tip: "* 请输入最高学历毕业院校",
                status: ""
              },
              {
                title: "最高学历所学专业名称",
                type: "text",
                required: false,
                placeholder: "请输入最高学历所学专业名称",
                key: "a0824",
                name: "a0824",
                val: void 0,
                postname: "a0824",
                maxlength: 40,
                minlength: 0,
                reg: "",
                tip: "* 请输入最高学历所学专业名称",
                status: ""
              },
              {
                title: "最高学历所学专业类别",
                otherType: "searchSelect",
                required: false,
                placeholder: "请选择最高学历所学专业类别",
                tip:'* 请选择最高学历所学专业类别',
                name: "a0827",
                key: "a0827",
                val: void 0,
                postname: "a0827",
                children: [],
                status: ""
              },
            ],
          },
          companyList:null,
          //hasDataDisabledOptions: [], //disabled--禁止输入项
          personDisabledOptions:['a0101','a0184','confNumber','companyId','companyNum'],  //个人--信息变更--身份证号存在时--disabled项
          personDisabledNoIdcardOptions:['a0101','confNumber','companyId','companyNum'],  //个人--信息变更--身份证号不存在时--disabled项
          departWorkDisabled: ['personType', 'a0101', 'a0184', 'companyNum', 'companyId', 'confNumber', 'source'], //单位--信息变更--disabled项
          departWorkNoIdcardDisabled: ['personType', 'a0101', 'companyNum', 'companyId', 'confNumber', 'source'], //单位--信息变更--disabled项
          departWorkOperateDisabled: ['personType', 'a0100A' ], //单位---职工录入--disabled
    };
  },

  //监听属性 类似于data概念
  computed: {
    directoryData:function(){
      if(this.$store.getters.getDirectoryData){
        this.splitDirectoryData(this.$store.getters.getDirectoryData);
        return this.$store.getters.getDirectoryData;
      }else{
        return null;
      }
    }
  },

  //监控data中的数据变化
  watch: {
    directoryData:{
      // 改变数据
      handler:function(newVal,oldVal){
        this.splitDirectoryData(newVal)
      },
      deep:true,//深度监听
    },
    
    currentPersonData:{
      immediate: true,
      handler:function(newVal,oldVal){
        this.clearDataAndStatus();
        if(newVal && newVal.a01000){
          this.insertData(newVal,true)
          if(this.disabledFlag == '1'){
            if(newVal.a0184){
              this.disableSomeOption(this.personDisabledOptions);
            } else{
              this.disableSomeOption(this.personDisabledNoIdcardOptions);
            }
          } else if(this.disabledFlag == '2'){
            if(newVal.a0184){
              this.disableSomeOption(this.departWorkDisabled);
            } else{
              this.disableSomeOption(this.departWorkNoIdcardDisabled);
            }
          } else if(this.disabledFlag == '3'){
            this.disableSomeOption(this.departWorkOperateDisabled);
          }
          
        }
      },
    },

    currentEnterprice:{
      immediate: true,
      handler:function(newVal){
        if(newVal && newVal.id){
          this.clearDataAndStatus();
          this.insertData(newVal)
          // this.disableSomeOption(this.hasDataDisabledOptions);
          if(this.disabledFlag == '1'){
            this.disableSomeOption(this.personDisabledOptions);
          } else if(this.disabledFlag == '2'){
            this.disableSomeOption(this.departWorkDisabled);
          } else if(this.disabledFlag == '3'){
            this.disableSomeOption(this.departWorkOperateDisabled);
          }
          this.insertCompanyData();
        }
      }
    }
  },

  //方法集合
  methods: {

    // 获取tableformSearch中的数据
    getFormSearchData(){
      return this.$refs.childForm.getFormData();
    },

    // 拆分字典数据
    splitDirectoryData(Data){
      if(!Data) return;
      this.formData.formInputs.forEach((item,index)=>{
          // 存档性质
          if(item.name === 'personType'){
            item.children = Data.archiveTypeList;
            // console.log(item.children)
            if(this.isStaff){
              item.val = '01';
            }
          }
          // 来当方式
          if(item.name === 'source') item.children = Data.receiveWayList;
          // 性别
          if(item.name === 'a0104') item.children = Data.sexList;
          // 民族
          if(item.name === 'a0117') item.children = Data.ethnicList;
          // 婚姻状况
          if(item.name === 'a0131') item.children = Data.maritalList;
          // 健康状况
          if(item.name === 'a0127') item.children = Data.healList;
          // 政治面貌
          if(item.name === 'a0141') item.children = Data.politicalList;
          // 人员身份
          if(item.name === 'archivesIdentity') item.children = Data.personIdentityList;
          // 转入原因
          if(item.name === 'inComeReason') item.children = Data.inComeReasonList;
          // 最高职称
          if(item.name === 'hightestTitle') item.children = Data.hightestTitleList;
          // 最高学位
          if(item.name === 'a0914') item.children = Data.degreeList;
          // 最高学历
          if(item.name === 'a0834') item.children = Data.educationList;
          // 专业类别
          if(item.name === 'a0827') item.children = Data.MajorList;

          // 单位编号
          if(item.name === 'companyNum' && this.currentEnterprice && this.currentEnterprice.companyNumber){
            item.val = this.currentEnterprice.companyNumber;
            item.disabled = true;
          }
      });
      

    },
    
    // 清空数据及状态
    clearDataAndStatus(){
      this.formData.formInputs.forEach((item,index)=>{
        if(!item.disabled){
          Object.assign(item,{
            val:void 0,
            status:"",
            isHide:false,
            disabled:item.disabled,
          })
        }else{
          Object.assign(item,{
            status:"",
            disabled:item.disabled,
          })
        }
        
        if(item.name === 'hasWare'){
          //判断是否有库房
          if(JSON.parse(sessionStorage.getItem('loginData')).loginUser['hasWare'] === '0'){
            item.isHide = false;
            item.val = '0';
          } else{
            item.isHide = true;
          }
        }
      })
    },

    // 插入数据
    insertData(Data,isPersonData){
      if(!Data) return;
      this.formData.formInputs.forEach((item,index)=>{
        for(let key in Data){
          if(item.name === key){
            if(!Data[key]){
              item.val = void 0;
            }else if(item.otherType && (item.otherType === 'date' || item.otherType === 'month' || item.otherType === 'daterange')){
              // console.log(Data[key])
              item.val = moment(Data[key]);
            }else if(item.otherType && item.otherType === 'addressSelect'){
              item.val = Data[key].split('.')
            }else{
              item.val = Data[key]
            }
          }
        }

        // 如果存档性质不是单位存档,则隐藏 委托单位存档名称和编号
        if(isPersonData && item.name === "personType" && item.val !== "01"){
          this.formData.formInputs.forEach((item,index)=>{
            if(item.name === "companyId" || item.name === "companyNum"){
              this.$set(this.formData.formInputs[index],'isHide',true)
            }
          });
        }

      });
    },

    // 有数据时,使部分表单项不可填
    disableSomeOption(arr){
      const _this = this;
      this.formData.formInputs.forEach((item,index) => {
        arr.forEach(name=>{
          if(item.name === name){
            _this.$set(this.formData.formInputs[index],'disabled',true)
          }
        });
      });
    },

    // 插入company数据
    insertCompanyData(){
      this.formData.formInputs.forEach((item,index)=>{

        // console.log(tempCompanylist)
        if(item.name === 'companyId') {
          item.children = this.companyList
          if(this.currentEnterprice && this.currentEnterprice.id){
            item.val = this.currentEnterprice.id;
            item.disabled = true;
          }else if(this.currentPersonData && this.currentPersonData.companyId){
            item.val = this.currentPersonData.companyId;
            item.disabled = true;
          }
        }

      });
    },

    //退档操作
    isWithdrawFileFun(idNum, contactKeyArr){
      const _this = this;
      this.$http.fetchPost('personalArch@checkRepeat.action', {a0184: idNum}).then(res => {
          if(Number(res.code) === 0){
            //弹出确认退档操作   --判断personId
            if(res.personId){
                this.$confirm({
                  title: '是否进行退档操作 ?',
                  content: '由于您的档案已转出,点击确定可进行退档操作,进行退档操作后可前往信息变更页面修改信息.',
                  onOk() {
                    _this.$http.fetchPost('personalArch@sendBackArch.action',{personId:res.personId})
                      .then(res => {
                        if(Number(res.code) === 0){
                          _this.formData.formInputs.forEach(el => {
                            contactKeyArr.forEach(item => {
                              if(item === el.key){
                                el.val = void 0;
                                el.status = void 0;
                              }
                            });
                          });
                          _this.$message.success('退档操作成功,可前往信息变更页查询信息');
                        }else{
                          _this.$message.error('退档操作失败,请稍后重试');
                          return false;
                        }
                      })
                      .catch(err => {
                        _this.$message.error('抱歉,网络出错了,请稍后重试')
                      })
                  },
                  onCancel() {},
                })
            }
          } 
        })
    }
    
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    const {currentPersonData,personDisabledOptions, personDisabledNoIdcardOptions, departWorkDisabled, departWorkNoIdcardDisabled, departWorkOperateDisabled,disableSomeOption,insertData,currentEnterprice, disabledFlag} = this;

    if((currentPersonData && currentPersonData.a01000) || (currentEnterprice && currentEnterprice.id)){
      if(disabledFlag == '1'){
        if(currentPersonData.a0184){
          disableSomeOption(personDisabledOptions);
        } else{
          disableSomeOption(personDisabledNoIdcardOptions);
        }
      } else if(disabledFlag == '2'){
        if(currentPersonData.a0184){
          disableSomeOption(departWorkDisabled);
        } else{
          disableSomeOption(departWorkNoIdcardDisabled);
        }
      } else if(disabledFlag == '3'){
        disableSomeOption(departWorkOperateDisabled);
      }
      insertData(currentPersonData,true);
      insertData(currentEnterprice);
    }
    
    //政治面貌默认
    this.formData.formInputs.forEach(element => {
      if(element.name === 'a0141'){
        element.val = '13'
      }
    });

    // 获取公司名称
    this.$http.fetchGet('personalArch@getCompanyList.action',{})
      .then(res => {
        if(Number(res.code) === 0){
          // 委托存档单位名称
          let tempCompanylist = [];
          res.data.forEach( company => {
            // attention ! code - id
            tempCompanylist.push({itemName:company.itemName,itemCode: company.itemId,itemId:company.itemCode});
          });
          this.companyList = tempCompanylist;
          this.insertCompanyData();
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
    window.isWithdrawFileFun = this.isWithdrawFileFun;
  },

  beforeCreate() {}, //生命周期 - 创建之前

  beforeMount() {}, //生命周期 - 挂载之前

  beforeUpdate() {}, //生命周期 - 更新之前

  updated() {}, //生命周期 - 更新之后

  beforeDestroy() {}, //生命周期 - 销毁之前

  destroyed() {}, //生命周期 - 销毁完成

  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style scoped>
.recordInfo {
  width: 100%;
  height: 100%;
  background: #fff;
  padding-right: 20px;
}
</style>