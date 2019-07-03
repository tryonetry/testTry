<!-- template -->
<template>
    <div :class="hasLine ? 'lineContainer editOuter' : 'editOuter'" @click.stop="changeState" :style="'width:'+width+'px'">
        <input v-if="inEdit" v-model="modelData" class="dataInput"></input>
        <p v-else class="dataP">{{modelData}}</p>
    </div>
</template>

<script>
export default {
    name:"PrintEdit",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    props:["data","width","hasLine"],

    data() {
        return {
            inEdit:false,
            modelData:this.data
        };
    },

    //监听属性 类似于data概念
    computed: {

    },

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
        changeState(){
            this.inEdit = true;
        },
        closeEdit(){
            this.inEdit = false;
        }
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
    .editOuter{
        display: inline-flex;
        justify-content: center;
    }
    .lineContainer{
        border-bottom: 1px solid red;
    }
    .dataInput,.dataP{
        width: 100%;
        font-size: 16px;
        text-align: center;
        height: 30px;
        line-height: 30px;
    }
    .dataInput{
        border: none;
        outline: none;
    }
</style>