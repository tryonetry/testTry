<!-- 单位立户或单位信息变更 -->
<template>
  <div class="outer" style="overflow-y:auto;padding-right:20px;">
    <TableFromSearch :formDataArr="departInfoArr"  ref="accountInfoForm">
      <a-row slot="otherForm" class="btnRow">
        <a-col :span='24' align="middle">
          <a-button class="btnMargin" type="primary" @click="submitInfoBtn" :loading="saveLoading" >{{btnTitle}}</a-button>
          <a-button @click="resetFormBtn">重置</a-button>
        </a-col>
      </a-row>
      
    </TableFromSearch>
  </div>
</template>

<script>
import TableFromSearch from "@/components/tableFormSearch";
import moment from 'moment';
import { setTimeout } from 'timers';

export default {
  name: "EnterpriceSignOrChange",
  components: {
    TableFromSearch
  },
  props: ["random","currentEnterprice","handleCancel","reGetData"],

  data() {
    return {
      departInfoArr: {
        formInputs: [
          {
            title: "委托存档单位编号",
            type: "text",
            required: true,
            placeholder: "请输入委托存档单位编号",
            key: "companyNumber",
            name: "companyNumber",
            val: void 0,
            postname: "companyNumber",
            maxlength: 20,
            minlength: 0,
            reg: 'testNumAndChar',
            tip: '* 请输入正确的委托存档单位编号',
            status: '',
          },
          {
            title: "委托存档单位名称",
            type: "text",
            required: true,
            placeholder: "请输入委托存档单位名称",
            key: "companyName",
            name: "companyName",
            val: void 0,
            postname: "companyName",
            maxlength: 40,
            minlength: 0,
            reg: '',
            tip: '* 请输入委托存档单位名称',
            status: '',
          },
          {
            title: "委托存档单位所属行业",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择委托存档单位所属行业",
            name: "industryNature",
            key: "industryNature",
            val: void 0,
            postname: "industryNature",
            tip: '* 请选择委托存档单位所属行业',
            children: [],
            status: '',
          },
          {
            title: "委托存档单位机构类型",
            otherType: "searchSelect",
            required: true,
            placeholder: "请选择委托存档单位机构类型",
            key: "companyNature",
            name: "companyNature",
            val: void 0,
            postname: "companyNature",
            tip: '* 请选择委托存档单位机构类型',
            children: [],
            status: '',
          },
          {
            title: "委托存档单位经济类型",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择委托存档单位经济类型",
            key: "economicType",
            name: "economicType",
            val: void 0,
            postname: "economicType",
            tip: '* 请选择委托存档单位经济类型',
            children: [],
            status: '',
          },
          {
            title: "经营范围",
            type: "text",
            required: false,
            placeholder: "请输入经营范围",
            key: "companyManagementRange",
            name: "companyManagementRange",
            val: '',
            postname: "companyManagementRange",
            maxlength: 40,
            minlength: 0,
            tip: '* 请输入经营范围',
            // reg: "testOnlyNum",
            status: '',
          },
          
          {
            title: "单位地址",
            type: "text",
            required: true,
            placeholder: "请输入单位地址",
            key: "companyPostalAddress",
            name: "companyPostalAddress",
            val: '',
            postname: "companyPostalAddress",
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
            placeholder: "请输入阿拉伯数字(单位/万元)",
            key: "companyRegisteredCapital",
            name: "companyRegisteredCapital",
            val: '',
            postname: "companyRegisteredCapital",
            maxlength: 20,
            minlength: 0,
            tip: '* 请输入阿拉伯数字(单位/万元)',
            reg: "testOnlyNum",
            status: '',
          },
          {
            title: "法定代表人",
            type: "text",
            required: true,
            placeholder: "请输入法定代表人",
            key: "enterpriseLegalPerson",
            name: "enterpriseLegalPerson",
            val: "",
            postname: "enterpriseLegalPerson",
            maxlength: 40,
            minlength: 2,
            reg: '',
            tip: '* 请输入法定代表人',
            status: '',
          },
          {
            title: "委托存档单位行政区划",
            otherType: "addressSelect",
            required: true,
            placeholder: "请选择委托存档单位行政区划",
            key: "areaCode",
            name: "areaCode",
            val: void 0,
            postname: "areaCode",
            tip: '* 请选择委托存档单位行政区划',
            children: [],
            status: '',
          },
          {
            title: '成立日期',
            otherType:'date',
            required: false,
            key: 'registrationDate',
            name: 'registrationDate',
            val: void 0,
            postname: '',
            tip: '* 请选择成立日期',
            status: ''
          },
          {
            title: '立户日期',
            otherType:'date',
            required: false,
            key: 'tatsudoDate',
            name: 'tatsudoDate',
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
            key: "companyContact",
            name: "companyContact",
            val: "",
            postname: "companyContact",
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
            val: '',
            postname: "contactPhone",
            maxlength: 11,
            minlength: 11,
            reg: 'testMobile',
            tip: '* 请输入正确的联系人电话',
            status: '',
          },
          {
            title: "电子邮箱",
            type: "text",
            required: false,
            placeholder: "请输入电子邮箱",
            key: "contactEmail",
            name: "contactEmail",
            val: '',
            postname: "contactEmail",
            maxlength: 40,
            minlength: 0,
            reg: 'testEmail',
            tip: '* 请输入正确的电子邮箱',
            status: '',
          },
          {
            title: "邮编编码",
            type: "text",
            required: false,
            placeholder: "请输入邮编编码",
            key: "companyPostCodes",
            name: "companyPostCodes",
            val: "",
            postname: "companyPostCodes",
            maxlength: 6,
            minlength: 6,
            reg: 'testZipCode',
            tip: '* 请输入正确的邮编编码',
            status: '',
          },
          {
            title: "传真号码",
            type: "text",
            required: false,
            placeholder: "请输入传真号码",
            key: "contactFax",
            name: "contactFax",
            val: '',
            postname: "contactFax",
            maxlength: 40,
            minlength: 0,
            reg: 'testFaxNum',
            tip: '* 请输入正确的传真号码',
            status: '',
          },
          {
            title: "委托存档单位统一社会信用代码",
            type: "text",
            required: true,
            placeholder: "请输入以数字开头的18位数字或数字与大写字母组合",
            key: "businessLicense",
            name: "businessLicense",
            val: "",
            postname: "businessLicense",
            maxlength: 40,
            minlength: 0,
            reg: 'testNumAndChar',
            tip: '* 请输入委托存档单位统一社会信用代码',
            status: '',
          },
          {
            title: "备注",
            otherType: "textarea",
            required: false,
            placeholder: "请输入备注",
            key: "remarks",
            name: "remarks",
            val: '',
            postname: "remarks",
            maxlength: 200,
            minlength: 0,
            reg: '',
            tip: '* 请输入备注内容',
            status: '',
          },
        ]
      },
      saveLoading:false,
      btnTitle:'提交',
      tempEnterPriceData:{},
      hasEnterPriceData:false,
    };
  },

  //监听属性 类似于data概念
  computed: {
    // 获取字典数据
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
    // 处理字典数据
    directoryData:{
      // 改变数据
      handler:function(newVal,oldVal){
        this.splitDirectoryData(newVal)
      },
      deep:true,//深度监听
    },

    random:{
      handler:function(val){
        this.acceptEditParams(this.currentEnterprice);
        this.tempEnterPriceData = {...this.currentEnterprice};
      }
    }
  },

  //方法集合
  methods: {
    moment,
    submitInfoBtn(){
      const _this = this;
      /**
       * 功能：表单保存按钮功能
       */
      let temp ={}, 
      currValDataArr = this.$refs.accountInfoForm.getFormData();
      if(currValDataArr.isRight){
        // if(!this.hasEnterPriceData){

        // }
        // 验证单位 / 单位编号 / 统一社会信用代码是否正确
        this.$http.fetchPost('companyInfo@checkCompanyAccount.action',{
          companyName : currValDataArr.postObj.companyName,
          transferCompanyNum : currValDataArr.postObj.companyNumber,
          businessLicense : currValDataArr.postObj.businessLicense,
          id:this.currentEnterprice && this.currentEnterprice.id  //当传进来有数据的时候
        })
        .then(res => {
          if(Number(res.code === 0)){

            // 验证成功,继续提交
            if(!this.hasEnterPriceData){
              _this.saveLoading = true;
              _this.$http.fetchPost('companyInfo@insertCompanyInfo.action',{...currValDataArr.postObj})
              .then(res => {
                if(Number(res.code) === 0){
                  _this.$message.success('提交成功');
                  _this.resetFormBtn();
                }else{
                  _this.$message.error('提交失败,请稍后重试');
                }
              })
              .catch(err => {
                _this.$message.error('抱歉,服务器异常,请重试');
              })
              .finally(end => {
                _this.saveLoading = false;
              });
            }else{
              _this.saveLoading = true;
              _this.$http.fetchPost('companyInfo@editCompanyInfo.action',{
                id:this.currentEnterprice.id,
                ...currValDataArr.postObj
              })
              .then(res => {
                if(Number(res.code) === 0){
                  _this.$message.success('保存成功');
                  _this.resetFormBtn();
                  setTimeout(function(){
                    _this.reGetData();
                    _this.handleCancel();
                  },1000)
                }else{
                  _this.$message.error('保存失败,请稍后重试');
                }
              })
              .catch(err => {
                _this.$message.error('抱歉,服务器异常,请重试');
              })
              .finally(end => {
                _this.saveLoading = false;
              });
            }

          }else if(Number(res.code === 1)){
            // 服务器错误
            _this.$message.error('抱歉,服务器异常,请重试');
          }else if(Number(res.code === 3)){
            // 单位名称重复
            _this.$message.warning(res.msg);
            _this.departInfoArr.formInputs[0].status = 'warning'; 
          }else if(Number(res.code === 2)){
            // 单位编号重复
            _this.$message.warning(res.msg);
            _this.departInfoArr.formInputs[1].status = 'warning';
          }else if(Number(res.code === 4)){
            // 统一社会信用代码重复
            _this.$message.warning(res.msg);
            _this.departInfoArr.formInputs[16].status = 'warning'; 
          }
        })
        .catch(err => {
          _this.$message.error('抱歉,服务器异常,请重试');
        })
      }
    },
    
    resetFormBtn(){
      this.$refs.accountInfoForm.resetForm();  //调用子组件上的重置方法
      this.acceptEditParams(this.tempEnterPriceData);
    },

    acceptEditParams(currentEnterprice){

      // 初始化数据
      this.departInfoArr.formInputs.forEach(item => {
        //  除开立户日期
        if(item.name === 'tatsudoDate'){
          Object.assign(item,{
            val:this.moment(new Date()),
          })
        }else{
          Object.assign(item,{
            val:void 0,
            status:void 0,
            disabled:false,
          })
        }
      });

      this.btnTitle = '提交';
      // 回填数据
      if(currentEnterprice){
        let dataMatch = false;
        this.hasEnterPriceData = false;
        this.departInfoArr.formInputs.forEach(item => {
          if(item.name === 'businessLicense'){
            Object.assign(item,{
              disabled:true
            })
          }
          if(item.otherType === 'addressSelect'){
            Object.assign(item,{
              val:currentEnterprice[item.name] ? currentEnterprice[item.name].split('.') : void 0
            })
          }else if(currentEnterprice[item.name]){
            dataMatch = true;
            Object.assign(item,{
              val:currentEnterprice[item.name] ? (item.otherType === 'date' ? this.moment(currentEnterprice[item.name]) : currentEnterprice[item.name]) : void 0,
            })
          }
        });
        if(dataMatch){
          this.hasEnterPriceData = true;
          this.btnTitle = '保存';
        }
      }
    },

    // 拆分字典
    splitDirectoryData(Data){
      if(!Data) return;
      this.departInfoArr.formInputs.forEach((item,index)=>{
          // 经营范围
          if(item.name === 'companyManagementRange') item.children = Data.belongIndustryList;
          // 单位性质
          if(item.name === 'companyNature') item.children = Data.organizationTypeList;
          // 单位经济类型
          if(item.name === 'economicType') item.children = Data.economicTypeList;
      })
    },

  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // console.log(this.currentEnterprice)
    this.acceptEditParams(this.currentEnterprice);
    this.tempEnterPriceData = {...this.currentEnterprice};
  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    // this.acceptEditParams();
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
.outer{
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
}
.btnMargin{
  margin-right: 20px;
}
.btnRow{
  padding-top: 40px;
}
</style>