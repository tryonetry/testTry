<!-- template -->
<template>
  <div class="portrait_con">
     <div class="left_detail" v-if="infoObj.position === 'left'">
       <span :class="'detail_left_icon' + ' ' +'iconfont' +' '+ 'icon-' +infoObj.icon"  :style="{color: infoObj.iconColor}"></span>
       <span class="name">{{infoObj.value}}</span>
     </div>
     <div class="right_detail" v-else>
        <span class="name">{{infoObj.value}}</span>
        <span :class="'detail_right_icon' + ' ' +'iconfont' +' '+ 'icon-' +infoObj.icon"  :style="{color: infoObj.iconColor}"></span>
     </div>
  </div>
</template>

<script>
export default {
  name: "Portrait",
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: ["infoObj"],

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
  methods: {},

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

.left_detail, 
.right_detail{
    display: flex;
    align-items: center;
}

.left_detail{
    padding: 5px 20px 5px 5px;
}
.right_detail{
    padding: 5px 5px 5px 20px;
}

.left_detail{
    border-radius: 50px;
    background: -webkit-linear-gradient(right, #dddddd, #ffffff); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #dddddd, #ffffff); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #dddddd, #ffffff); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #dddddd, #ffffff); /* 标准的语法 */
}

.right_detail{
    border-radius: 50px;
    background: -webkit-linear-gradient(left, #dddddd, #ffffff); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(left, #dddddd, #ffffff); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(left, #dddddd, #ffffff); /* Firefox 3.6 - 15 */
    background: linear-gradient(to left, #dddddd, #ffffff); /* 标准的语法 */
}

.detail_left_icon,
.detail_right_icon{
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    padding: 5px;
    border-radius: 100%;
    width: 50px;
    height: 50px;
    font-size: 30px;
}
.detail_left_icon{
  margin-right: 20px;
}
.detail_right_icon{
  margin-left: 20px;
}
</style>