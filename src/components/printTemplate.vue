<!-- template -->
<template>
  <div class="print_template" id="printPage">
    <div class="print_templateContent">
      <a-row>
        <!-- 大标题 -->
        <a-col :span="24" class="card_title">{{printDataObj.cardTitle}}</a-col>
        <!-- 小标题 -->
        <a-col :span="24" class="sub_title">{{printDataObj.subTitle}}</a-col>
        <!-- 右侧Number -->
        <a-col
          :span="24"
          :class="printDataObj.rightContent.className"
          v-if="printDataObj.isRightNum"
        >{{printDataObj.rightContent.title}} {{printDataObj.rightContent.value}}</a-col>
      </a-row>
      <!-- 中间内容 -->
      <div class="content" v-for="(item, index) in printDataObj.content" :key="index">
        <!-- table -->
        <div
          class="table"
          v-if="item.type === 'table' && item.data.columnsArr && item.data.tableDataArr"
        >
          <a-table
            :columns="item.data.columnsArr"
            :dataSource="item.data.tableDataArr"
            :pagination="false"
            bordered
          ></a-table>
        </div>
      </div>
      <!-- 日期及其他内容 -->
      <div class="otherContent">
        <div class="otherInnerContent">
           <div v-for="(item, index) in printDataObj.otherContent" :key="index" class="otherInnerRow">
               {{item.title}}：
               {{item.type ? (item.value ? item.value : moment(new Date()).format('YYYY年MM月DD日')) : item.value}}
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "PrintTemplate",
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: ["printDataObj"],

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
    moment,
    printFun() {
      /***
       * 功能:打印功能
       */
      let subOutputRankPrint = document.getElementById("printPage");
      let newContent = subOutputRankPrint.innerHTML;
      let oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
      return false;
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},

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
.print_template {
  width: 100%;
  height: 100%;
  padding: 0 150px;
  background: #fff;
  font-family: "宋体";
  color: #000;
}

.print_templateContent {
  width: 100%;
  height: 100%;
}

.card_title,
.sub_title {
  text-align: center;
  font-weight: bold;
}
.card_title {
  font-size: 35px;
}
.sub_title {
  font-size: 30px;
}

.rightNumber {
  display: flex;
  justify-content: flex-end;
  font-size: 17px;
  font-family: "仿宋";
}

.rightNumberRed {
  color: #ff0000;
}

.content {
  margin: 20px 0;
}

.otherContent {
  font-family: "仿宋";
  font-size: 17px;
  display: flex;
  justify-content: flex-end;
  margin-top: 60px;
}

.otherInnerContent{
    display: flex;
    flex-direction: column;
}

.otherCon_name {
  text-align: right;
}

.otherInnerRow{
    margin-bottom:10px; 
}
</style>