<!-- 基本信息展示 -->
<template>
<div class="outerContainer">
    <a-card :title="cardTitle">
        <a-card-grid 
            v-for='(item,index) in baseData' 
            :key='index' 
            style="width:33.3%;textAlign:'center'"
            v-if='!isAction || !item.hasDataNotShow'
        >
            <p><span class="titleName">{{item.label}}:</span>{{item.val}}</p>
        </a-card-grid>
    </a-card>
</div>
</template>

<script>
export default {
    name:"ShowBasicInfo",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    props:["cardTitle","baseData","isAction"],

    data() {
        return {
            
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

    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

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
        display: flex;
    }
    .titleName{
        margin-right: 10px;
        color: #87b1df;
    }
</style>