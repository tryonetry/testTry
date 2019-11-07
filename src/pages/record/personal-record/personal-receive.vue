<!-- template -->
<template>
  <!-- 档案接收 -->
  <div class="outer recordAccept" style="" >
    <RecordInfo ref="accountInfoForm">
      <a-row slot="operationAction">
        <a-col :span="24" align="middle">
          <a-button class="btnMargin" type="primary" @click="submitInfoBtn" :loading='confirmLoading'>立即提交</a-button>
        </a-col>
      </a-row>
    </RecordInfo>
  </div>
</template>

<script>


import RecordInfo from "@/components/record/record-info";
import moment from "moment";

export default {
  name: "PersonalReceived",
  //import引入的组件需要注入到对象中才能使用
  components: {
    RecordInfo
  },
  props: [""],

  data() {
    return {
      confirmLoading:false,
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
    submitInfoBtn() {

      const _this = this;
      let reultFormData = this.$refs.accountInfoForm.getFormSearchData(); 
      // console.log(reultFormData)
      if(reultFormData.isRight){
        this.confirmLoading = true;
        this.$http.fetchPost('personalArch@insertPersonalArch.action',{
          ...reultFormData.postObj,
        })
        .then(res => {
          if(Number(res.code) === 0){
            _this.$message.success('提交成功');
            _this.$refs.accountInfoForm.clearDataAndStatus();
          }else{
            _this.$message.warning('抱歉,提交失败,请重试');
          }
        })
        .catch(err => {
          _this.$message.error('抱歉,网络错误,请稍后重试');
        })
        .finally(end => {
          _this.confirmLoading = false;
        })
      }
    },
    acceptEditParams(){
      /***
       * 功能：编辑按钮：接收参数，并且把参数对应的 formInput里的val 修改
       */
      // console.log(this.$route.params.data);
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
.recordAccept{
  overflow-y:auto;
  padding-bottom: 40px;
}
</style>