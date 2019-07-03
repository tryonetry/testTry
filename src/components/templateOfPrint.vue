<!-- template -->
<template>
<div class="printOuter">
    <div id="printPage" ref="printSection">

        <div class="fileNumContainer">
            <p>NO: {{fileNum}}</p>
        </div>
        <div class="bigTitle">
            <h1>{{firstTitle}}</h1>
            <h2>{{secondTitle}}</h2>
        </div>
        <slot name="printContent"></slot>
        
    </div>
</div>
</template>

<script>
const commonStyleUrl = '../assets/print.css';
// fileNum 文件号 /  firstTitle 一级标题  / secondTitle 二级标题
export default {
    name:"TemplateOfPrint",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    props:["fileNum","firstTitle","secondTitle"],

    data() {
        return {
            
        }
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
        printFun() {
            this.$print(this.$refs.printSection)
            // let newContent = subOutputRankPrint.innerHTML;
            // let oldContent = document.body.innerHTML;
            // document.body.innerHTML = newContent;
            // window.print();
            // window.location.reload();
            // document.body.innerHTML = oldContent;
            // return false;
        },
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
.printOuter{
    height: 100%;
    margin: 10px 0;
    overflow-y: auto;
    font-family: "宋体" !important;
    box-sizing: border-box;
    padding: 0 125px;
    /* border: 1px solid #eeeeee; */
}
#printPage{
    padding: 20px 30px;
    box-sizing: border-box;
    /* background: #fafafa;
    border: 1px solid #bbbbbb; */
}
/* 文件号 */
.fileNumContainer{
    overflow: hidden;
}
.fileNumContainer > p{
    float: right;
    color: red;
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 40px;
}
/* 一级标题 和  二级标题 */
.bigTitle{
    margin-bottom: 40px;
}
.bigTitle>h1,.bigTitle>h2{
    text-align: center;
    /* font-weight: bold; */
}
.bigTitle>h1{
    font-size: 34px;
    margin-bottom: 10px;
}
.bigTitle>h2{
    font-size: 30px;
}

</style>