<!-- template -->
<template>
    <div class="tipContainer">
        <!-- 操作提示 -->
        <a-alert :message="msgTip" type="success" showIcon closable v-if='successStatus' :afterClose="closeAllTip"/>
        <a-alert :message="msgTip" type="info" showIcon closable v-if='infoStatus' :afterClose="closeAllTip" />
        <a-alert :message="msgTip" type="warning" showIcon closable v-if='warningStatus' :afterClose="closeAllTip" />
        <a-alert :message="msgTip" type="error" showIcon closable v-if='errorStatus' :afterClose="closeAllTip" />
    </div>
</template>

<script>

export default {
    name:"MsgTip",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    // 弹出提示信息 index:[0-success,1-info,2-warning,3-err]
    props:["msgTip","msgIndex","watcherState","closeState"],

    data() {
        return {
            aWatcher:false,
            successStatus:false,
            infoStatus:false,
            warningStatus:false,
            errorStatus:false,
        };
    },

    //监听属性 类似于data概念
    computed: {},

    //监控data中的数据变化
    watch: {
        watcherState:{
            handler:function(newVal){
                // console.log(newVal)
                let timer =  null;
                const _this = this;
                const statusStrOfThis = ['successStatus','infoStatus','warningStatus','errorStatus'];

                // 状态切换
                _this.closeAllTip();

                if(this.closeState){
                    clearTimeout(timer);
                }

                // 如果不关闭
                if(!this.closeState){
                    clearTimeout(timer);
                    timer = null;
                    this[statusStrOfThis[this.msgIndex]] = true;
                    // 关闭提示
                    timer = setTimeout(()=>{
                        _this.closeAllTip();
                        clearTimeout(timer);
                        timer = null;
                    },5000);

                }
                
            },
            deep:true,//深度监听

        },
    },

    //方法集合
    methods: {
        // 卸载状态提示
        closeAllTip(){
            const _this = this;
            const statusStrOfThis = ['successStatus','infoStatus','warningStatus','errorStatus'];
            statusStrOfThis.forEach((item)=>{_this[item] = false});
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
.tipContainer{
    width: 100%;
}
</style>