<!-- template -->
<template>
  <!-- 档案信息组件 -->
  <div class="recordInfo">
    <div class="infoCard" v-for="(item, index) in recordInfoData" :key="index">
      <FormHeader :formTitle="item.cardTitle"></FormHeader>
      <TableFromSearch :formDataArr="item.formData" ref="childForm"></TableFromSearch>
    </div>
    <slot name="operationAction"></slot>
  </div>
</template>

<script>
// 关联函数
// 身份证号到出生日期
function idcardToBirthdayFun(idNum){
  if(idNum.length === 18){
    return {name: 'val', data: idNum.substr(6,8) };
  }else if(idNum.length === 15){
    // console.log('19'+idNum.substr(6,6))
    return {name: 'val', data: '19'+idNum.substr(6,6) };
  }
  return  {name: 'val', data: '' };
  
}

// 身份证号到性别
function idcardTotoGender(idNum){
  if(idNum.length === 18){
    return {name: 'val', data: Number(idNum[16])%2 === 0 ? 2:1 };
  }else if(idNum.length === 15){
    return {name: 'val', data: Number(idNum[14])%2 === 0 ? 2:1 };
  }
  return {name: 'val', data: '' };
}

import FormHeader from "./formHeader";
import TableFromSearch from "./tableFormSearch";
export default {
  name: "RecordInfo",
  //import引入的组件需要注入到对象中才能使用
  components: {
    FormHeader,
    TableFromSearch
  },
  props: [],

  data() {
    return {
      recordInfoData: [
        {
          cardTitle: "存档信息",
          // forms
          formData: {
            // inputs
            formInputs: [
              {
                title: "存档性质",
                otherType: "searchSelect",
                required: true,
                placeholder: "请选择存档性质",
                name: "recordSaveType",
                key: "recordSaveType",
                val: void 0,
                postname: "",
                tip:'* 请选择存档性质',
                children: [
                  { itemCode: 1, itemName: "xxxxx", isdisabled: false },
                  { itemCode: 2, itemName: "yyyyy", isdisabled: false }
                ],
                status: ""
              },
              {
                title: "来档方式",
                otherType: "searchSelect",
                required: false,
                placeholder: "请选择来档方式",
                name: "recordWays",
                key: "recordWays",
                val: void 0,
                postname: "",
                children: [
                  { itemCode: 1, itemName: "xxxxx", isdisabled: false },
                  { itemCode: 2, itemName: "yyyyy", isdisabled: false }
                ],
                status: ""
              },
              {
                title: "存档编号",
                type: "text",
                required: true,
                placeholder: "请输入存档编号",
                key: "recordNumber",
                name: "recordNumber",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入请输入存档编号",
                status: ""
              }
            ]
          }
        },
        {
          cardTitle: "登记信息",
          // forms
          formData: {
            formInputs: [
              {
                title: "姓名",
                type: "text",
                required: true,
                placeholder: "请输入姓名",
                key: "name",
                name: "name",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入姓名",
                status: ""
              },
              {
                title: "身份证号",
                type: "text",
                required: true,
                placeholder: "请输入身份证号",
                key: "idCard",
                name: "idCard",
                val: void 0,
                postname: "",
                maxlength: 18,
                minlength: 15,
                reg: "testid",
                tip: "* 请输入正确的身份证号",
                connectTo:['birthday','gender'], //关联到日期和性别
                connectToFun:[idcardToBirthdayFun,idcardTotoGender], 
                status: ""
              },
              {
                title: "出生日期",
                otherType: "date",
                required: true,
                placeholder: "请选择出生日期",
                key: "birthday",
                name: "birthday",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请选择出生日期",
                disabled:true,
                status: ""
              },
              {
                title: "曾用名",
                type: "text",
                required: false,
                placeholder: "请输入曾用名",
                key: "usedName",
                name: "usedName",
                val: void 0,
                postname: "",
                maxlength: 20,
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
                key: "nativePlace",
                name: "nativePlace",
                val: void 0,
                postname: "",
                maxlength: 20,
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
                name: "gender",
                key: "gender",
                val: void 0,
                postname: "",
                disabled:true,
                children: [
                  { itemCode: 1, itemName: "男", isdisabled: false },
                  { itemCode: 2, itemName: "女", isdisabled: false }
                ]
              },
              {
                title: "民族",
                otherType: "searchSelect",
                required: true,
                placeholder: "请选择民族",
                name: "national",
                key: "national",
                val: void 0,
                postname: "",
                children: [
                  { itemCode: 1, itemName: "汉族", isdisabled: false },
                  { itemCode: 2, itemName: "蒙古族", isdisabled: false }
                ]
              },
              {
                title: "户籍行政区划",
                otherType: "addressSelect",
                required: false,
                placeholder: "请选择户籍行政区划",
                key: "hj",
                name: "hj",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请选择户籍行政区划",
                status: ""
              },
              {
                title: "婚姻状况",
                otherType: "searchSelect",
                required: false,
                placeholder: "请选择婚姻状况",
                name: "marriageStatus",
                key: "marriageStatus",
                val: void 0,
                postname: "",
                children: [
                  { itemCode: 1, itemName: "已婚", isdisabled: false },
                  { itemCode: 2, itemName: "未婚", isdisabled: false }
                ]
              },
              {
                title: "健康状况",
                otherType: "searchSelect",
                required: false,
                placeholder: "请选择健康状况",
                name: "healthStatus",
                key: "healthStatus",
                val: void 0,
                postname: "",
                children: [
                  { itemCode: 1, itemName: "健康或良好", isdisabled: false },
                  { itemCode: 2, itemName: "一般或较弱", isdisabled: false }
                ]
              },
              {
                title: "政治面貌",
                otherType: "searchSelect",
                required: true,
                placeholder: "请选择政治面貌",
                name: "politicsStatus",
                key: "politicsStatus",
                val: void 0,
                postname: "",
                children: [
                  { itemCode: 1, itemName: "中共党员", isdisabled: false },
                  { itemCode: 2, itemName: "中共预备党员", isdisabled: false }
                ],
                status: ""
              },
              {
                title: "参加工作年月",
                otherType: "date",
                required: false,
                placeholder: "请选择参加工作年月",
                key: "joinWorkDate",
                name: "joinWorkDate",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请选择参加工作年月",
                status: ""
              },
              {
                title: "人员身份",
                otherType: "searchSelect",
                required: true,
                placeholder: "请选择人员身份",
                name: "personStatus",
                key: "personStatus",
                val: void 0,
                postname: "",
                children: [
                  { itemCode: 1, itemName: "干部", isdisabled: false },
                  { itemCode: 2, itemName: "工人", isdisabled: false }
                ]
              },
              {
                title: "紧急联系人",
                type: "text",
                required: false,
                placeholder: "请输入紧急联系人",
                key: "emergency",
                name: "emergency",
                val: void 0,
                postname: "",
                maxlength: 20,
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
                key: "email",
                name: "email",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入电子邮箱",
                status: ""
              },
              {
                title: "户籍地址",
                type: "text",
                required: false,
                placeholder: "请输入户籍地址",
                key: "hjAddress",
                name: "hjAddress",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入户籍地址",
                status: ""
              },
              {
                title: "手机号码",
                type: "text",
                required: true,
                placeholder: "请输入手机号码",
                key: "phone",
                name: "phone",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入手机号码",
                status: ""
              },
              {
                title: "现住址",
                type: "text",
                required: true,
                placeholder: "请输入现住址",
                key: "nowAddress",
                name: "nowAddress",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入现住址",
                status: ""
              },
              {
                title: "备注",
                otherType: "textarea",
                required: false,
                placeholder: "请输入备注",
                key: "notes",
                name: "notes",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入备注",
                status: ""
              }
            ]
          }
        },
        {
          cardTitle: "学历信息",
          formData: {
            // inputs
            formInputs: [
              {
                title: "最高学位",
                otherType: "searchSelect",
                required: true,
                placeholder: "请选择最高学位",
                name: "degree",
                key: "degree",
                val: void 0,
                postname: "",
                children: [
                  { itemCode: 1, itemName: "名誉博士", isdisabled: false },
                  { itemCode: 2, itemName: "哲学学士学位", isdisabled: false }
                ]
              },
              {
                title: "最高学历",
                otherType: "searchSelect",
                required: true,
                placeholder: "请选择最高学历",
                name: "education",
                key: "education",
                val: void 0,
                postname: "",
                children: [
                  { itemCode: 1, itemName: "博士", isdisabled: false },
                  { itemCode: 2, itemName: "硕士", isdisabled: false }
                ]
              },
              {
                title: "最高学历毕业日期",
                otherType: "date",
                required: true,
                placeholder: "请选择最高学历毕业日期",
                key: "graduateDate",
                name: "graduateDate",
                val: void 0,
                postname: "",
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
                key: "graduateSchool",
                name: "graduateSchool",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入最高学历毕业院校",
                status: ""
              }
            ]
          }
        }
      ]
    };
  },

  //监听属性 类似于data概念
  computed: {
    directoryData:function(){
      return this.$store.getters.getDirectoryData
    }
  },

  //监控data中的数据变化
  watch: {
    directoryData:{
      handler:function(newVal,oldval){
        console.log(1)
      },
       deep:true,//深度监听
    }
  },

  //方法集合
  methods: {
     getFormSearchData(){
       let tempFormData = {}, len = this.$refs.childForm.length; 
       for(let i =0; i< len; i++){
         tempFormData[i] = this.$refs.childForm[i].getFormData();
       }
       return tempFormData;
     }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {

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
}
</style>