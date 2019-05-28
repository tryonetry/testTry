<!-- template -->
<template>
    <div class="pdfOuter">
        <!-- <pdf 
            :src="pdfSrc"
        ></pdf> -->
        
        <!-- <iframe src="http://192.168.1.215:8080/hasngcadrefile/pdf/2018-report.pdf" width="100%" height="100%"></iframe> -->
        <object 
            codebase="http://192.168.1.215:8080/hasngcadrefile/pdf/2018-report.pdf" 
            width="100%" 
            height="100%" 
            align="middle"
        >
            <embed 
                width="100%" 
                height="100%" 
                src="http://192.168.1.215:8080/hasngcadrefile/pdf/2018-report.pdf" 
                type="application/pdf"
                background-color="red"
            />
        </object>
    </div>
</template>

<script>

// import pdf from 'vue-pdf';
// let loadingTask = pdf.createLoadingTask({
//     url:'http://192.168.1.215:8080/hasngcadrefile/pdf/2018-report.pdf'
// });
export default {
    name:"Report",
    
    //import引入的组件需要注入到对象中才能使用
    components: {},
    props:[""],

    data() {
        return {
            // pdfSrc:loadingTask,
            // numPages: void 0,
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
        // this.pdfSrc.then(pdf => { this.numPages = pdf.numPages; });
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
.pdfOuter{
    height: 100%;
}
</style>