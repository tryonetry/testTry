<!-- 单位立户 -->
<template>
  <div class="outer departContainer" style="overflow-y:auto;">
    <TableFromSearch :formDataArr="departInfoArr"  ref="accountInfoForm">
      <a-row slot="otherForm">
        <a-col :span='24' align="middle">
          <a-button class="btnMargin" type="primary" @click="submitInfoBtn">保存</a-button>
          <a-button @click="resetFormBtn">重置</a-button>
        </a-col>
      </a-row>
      
    </TableFromSearch>
  </div>
</template>

<script>
import TableFromSearch from "../../../components/tableFormSearch";
import moment from 'moment';
export default {
  name: "DepartInfoOperate",
  //import引入的组件需要注入到对象中才能使用
  components: {
    TableFromSearch
  },
  props: [""],

  data() {
    return {
      departInfoArr: {
        formInputs: [
          {
            title: "委托存档单位名称",
            type: "text",
            required: true,
            placeholder: "请输入委托存档单位名称",
            key: "departName",
            name: "departName",
            val: void 0,
            postname: "",
            maxlength: 20,
            minlength: 0,
            reg: '',
            tip: '* 请输入委托存档单位名称',
            status: '',
          },
          {
            title: "委托存档单位编号",
            type: "text",
            required: true,
            placeholder: "请输入单位名称",
            key: "departName",
            name: "departName",
            val: void 0,
            postname: "",
            maxlength: 20,
            minlength: 0,
            reg: '',
            tip: '* 请输入委托存档单位编号',
            status: '',
          },
          {
            title: "经营范围",
            otherType: "searchSelect",
            required: true,
            placeholder: "请选择经营范围",
            name: "businessRange",
            key: "businessRange",
            val: void 0,
            postname: "",
            tip: '* 请选择经营范围',
            children: []
          },
          {
            title: "单位性质",
            otherType: "searchSelect",
            required: true,
            placeholder: "请选择单位性质",
            key: "unitNature",
            name: "unitNature",
            val: void 0,
            postname: "",
            tip: '* 请选择单位性质',
            children: []
          },
          {
            title: "单位经济类型",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择单位经济类型",
            key: "economicType",
            name: "economicType",
            val: void 0,
            postname: "",
            tip: '* 请选择单位经济类型',
            children: []
          },
          {
            title: "单位归属地",
            otherType: "addressSelect",
            required: true,
            placeholder: "请选择单位归属地",
            key: "departAddress",
            name: "departAddress",
            val: void 0,
            postname: "",
            tip: '* 请选择单位归属地',
            children: []
          },
          {
            title: "单位地址",
            type: "text",
            required: true,
            placeholder: "请输入单位地址",
            key: "address",
            name: "address",
            val: void 0,
            postname: "",
            maxlength: 100,
            minlength: 0,
            reg: '',
            tip: '* 请输入单位地址',
            status: '',
          },
          {
            title: "注册资本(万元)",
            type: "text",
            required: false,
            placeholder: "请输入注册资本(万元)",
            key: "asset",
            name: "asset",
            val: void 0,
            postname: "",
            maxlength: 20,
            minlength: 0,
            reg: ""
          },
          {
            title: "法定代表人",
            type: "text",
            required: true,
            placeholder: "请输入法定代表人",
            key: "legalPerson",
            name: "legalPerson",
            val: void 0,
            postname: "",
            maxlength: 40,
            minlength: 2,
            reg: '',
            tip: '* 请输入法定代表人',
            status: '',
          },
          {
            title: '成立日期',
            otherType:'date',
            required: true,
            key: 'buildDate',
            name: 'buildDate',
            val: void 0,
            postname: '',
            tip: '* 请选择成立日期',
            status: ''
          },
          {
            title: '立户日期',
            otherType:'date',
            required: false,
            key: 'accountDate',
            name: 'accountDate',
            val: moment(new Date()),
            postname: '',
            disabled:true,
            tip: '* 请选择立户日期',
            status: ''
          },
          {
            title: "单位联系人",
            type: "text",
            required: true,
            placeholder: "请输入单位联系人",
            key: "unitContact",
            name: "unitContact",
            val: void 0,
            postname: "",
            maxlength: 40,
            minlength: 2,
            reg: '',
            tip: '* 请输入单位联系人',
            status: '',
          },
          {
            title: "联系人电话",
            type: "text",
            required: true,
            placeholder: "请输入联系人电话",
            key: "contactPhone",
            name: "contactPhone",
            val: void 0,
            postname: "",
            maxlength: 11,
            minlength: 11,
            reg: '',
            tip: '* 请输入联系人电话',
            status: '',
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
            maxlength: 40,
            minlength: 0,
            reg: '',
            tip: '* 请输入电子邮箱',
            status: '',
          },
          {
            title: "邮编编码",
            type: "text",
            required: false,
            placeholder: "请输入邮编编码",
            key: "postalCode",
            name: "postalCode",
            val: void 0,
            postname: "",
            maxlength: 6,
            minlength: 6,
            reg: '',
            tip: '* 请输入邮编编码',
            status: '',
          },
          {
            title: "传真号码",
            type: "text",
            required: false,
            placeholder: "请输入传真号码",
            key: "faxNumber",
            name: "faxNumber",
            val: void 0,
            postname: "",
            maxlength: 40,
            minlength: 0,
            reg: '',
            tip: '* 请输入传真号码',
            status: '',
          },
          {
            title: "统一社会信用代码",
            type: "text",
            required: true,
            placeholder: "请输入统一社会信用代码",
            key: "creditCode",
            name: "creditCode",
            val: void 0,
            postname: "",
            maxlength: 40,
            minlength: 0,
            reg: '',
            tip: '* 请输入统一社会信用代码',
            status: '',
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
            maxlength: 200,
            minlength: 0,
            reg: '',
            tip: '* 请输入备注内容',
            status: '',
          },
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
    moment,
    submitInfoBtn(){
      /**
       * 功能：表单保存按钮功能
       */
      let temp ={}, 
      currValDataArr = this.$refs.accountInfoForm.getFormData();
      currValDataArr.forEach(el => {
         temp[el.name] = el.val;
      });
      console.log(temp);
    },
    resetFormBtn(){
      /***
       * 功能：表单重置
       */
      this.$refs.accountInfoForm.resetForm();   //调用子组件上的重置方法
    },
    acceptEditParams(){
      /***
       * 功能：编辑按钮：接收参数，并且把参数对应的 formInput里的val 修改
       */
      console.log(this.$route.params.data);
      let paramsData = this.$route.params.data;
      if(paramsData){
        for(let key in paramsData){
          this.departInfoArr.formInputs.forEach(element => {
            if(element.name == key){
              if(key == 'accountDate' || key =="buildDate"){   //如果key为日期：转化完把值赋值给对应的val
                 element.val = this.moment(paramsData[key]);
              } else{
                element.val = paramsData[key];
              }
            }
          });
        }
      }
     
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.acceptEditParams();
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
.departContainer {
  padding: 20px;
}

.btnMargin{
  margin-right: 20px;
}

</style>