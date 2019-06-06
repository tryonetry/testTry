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
        <!-- 其他文本或编辑格式 -->
        <div class="otherFormat" v-else>
           <div class="otherFormatCon">
              <span v-for="(el, index) in item.data" :key="index">
                <span v-if="el.type && el.type =='input'" @click="inputClick">
                  <a-input  class="input_css" v-show="isShowInput" :placeholder="el.placeholder" v-model="el.value" style="width: 200px;"  @blur="inputBlurFun" />
                  <span v-show="!isShowInput" :class="el.className ? el.className : ''">{{el.value}}</span>
                </span>
                <span v-if="el.type && el.type =='date'" @click="dateClick">
                  <a-date-picker v-show="isShowDate" v-model="el.value" @change="dateChange" style="width: 200px;" />
                  <span v-show="!isShowDate" :class="el.className ? el.className : ''">{{moment(el.value).format('YYYY-MM-DD')}}</span>
                </span>
                <span v-if="!el.type" :class="el.className ? el.className : ''">{{el.value}}</span>
              </span>
           </div>
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
import { truncate } from 'fs';
export default {
  name: "PrintTemplate",
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: ["printDataObj"],

  data() {
    return {
      isShowInput: false,   //可编辑input：默认为true
      isShowDate: false,    //可编辑date: 默认为false
    };
  },

  //监听属性 类似于data概念
  computed: {},

  //监控data中的数据变化
  watch: {
    printDataObj:{
       immediate: true,
       deep:true,//深度监听
       handler:function(newVal){
          this.printDataObj = newVal;
       },
    }
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
    },
    inputClick(){
      //可编辑input部分：点击变成input
      this.isShowInput = true;
    },
    inputBlurFun(){
      //input的blur事件
      this.isShowInput = false;
    },
    dateClick(){
      //可选择date：点击变成可选择date
      this.isShowDate = true;
    },
    dateChange(){
      //date的change事件
      this.isShowDate = false;
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

.otherFormat{
  text-indent: 34px;
  font-size: 21px;
  font-family: '仿宋';
  line-height: 50px;
}

.otherFormatRed{
  font-family: '微软雅黑';
  color: red;
}

.input_css{
    font-size: 21px;
    border: none;
    border-radius: 0;
    text-align: center;
    border-bottom: 1px solid red;
}
</style>