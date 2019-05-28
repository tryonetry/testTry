<!-- template -->
<template>
  <!-- 档案信息组件 -->
  <div class="recordInfo">
    <div class="infoCard" v-for="(item, index) in infoData" :key="index">
      <FormHeader :formTitle="item.cardTitle"></FormHeader>
      <TableFromSearch :formDataArr="item.formData" ref="childForm"></TableFromSearch>
    </div>
    <slot name="operationAction"></slot>
  </div>
</template>

<script>
import FormHeader from "./formHeader";
import TableFromSearch from "./tableFormSearch";
export default {
  name: "RecordInfo",
  //import引入的组件需要注入到对象中才能使用
  components: {
    FormHeader,
    TableFromSearch
  },
  props: ["infoData"],

  data() {
    return {};
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