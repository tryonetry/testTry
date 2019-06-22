<!-- 基本信息展示 item 中带 label 和 val -->
<template>
<div class="outerContainer">
    <a-card :title="cardTitle">
        <a-card-grid 
            v-for='(item,index) in baseDataArr' 
            :key='index' 
            :class="item.oneRow || item.isImg ? 'gridWidth1' : 'gridWidth'"
        >
            <p v-if="!item.oneRow && !item.isImg" class="textOverflow"><span class="titleName">{{item.label}}:</span>{{item.val}}</p>
            <div v-else class="oneRowContainer">
                <span :class="item.isImg ? 'rightBorder' : ''">{{item.label}}<span v-if="!item.isImg">:</span></span>
                <p v-if="!item.isImg" class="textOverflow">{{item.val}}</p>
                <div v-else class="imgContainer">
                    <img :src="item.val" :alt="item.label" :title="item.label" :width="item.imgWidth ? item.imgWidth : ''"/>
                    <div class="imgTools">
                        <a-tooltip placement="right" @click="plusOrMinusImgWidth(index,0)">
                            <template slot='title'>放 大</template>
                            <a-icon type="plus-circle" style="color:#666"/>
                        </a-tooltip>
                        <a-tooltip placement="right" @click="plusOrMinusImgWidth(index,1)">
                            <template slot='title'>缩 小</template>
                            <a-icon type="minus-circle" style="color:#666"/>
                        </a-tooltip>
                        <a-tooltip placement="right" @click="plusOrMinusImgWidth(index,2)">
                            <template slot='title'>重 置</template>
                            <a-icon type="redo" style="color:#666"/>
                        </a-tooltip>
                    </div>
                </div>
            </div>
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
            baseDataArr:null,
        };
    },

    //监听属性 类似于data概念
    computed: {

    },

    //监控data中的数据变化
    watch: {
        baseData:{
           handler:function(newVal){
               this.handleData(newVal);
           },
           deep:true,//深度监听
        }
    },

    //方法集合
    methods: {
        // 处理数据
        handleData(data){
            if(this.baseData && this.baseData.length > 0){
                this.baseDataArr = [...data];
                this.baseDataArr.forEach(item => {
                    if(item.isImg){
                        Object.assign(item,{imgWidth:'30%'});
                    }
                })
            }
        },
        plusOrMinusImgWidth(index,state){
            let width = this.baseDataArr[index].imgWidth;
            if(state === 0){
                if(parseFloat(width) > 95){
                    return ;
                }else{
                     this.baseDataArr[index].imgWidth = parseFloat(width) * 110 / 100 + '%';
                }
            }else if(state === 1){
                if(parseFloat(width) < 10){
                    return ;
                }else{
                    this.baseDataArr[index].imgWidth = parseFloat(width) * 100 / 110 + '%';
                }
            }else{
                this.baseDataArr[index].imgWidth = '30%';
            }
            this.baseDataArr = [...this.baseDataArr]
        },
    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.handleData(this.baseData);
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
    .textOverflow{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .gridWidth{
        width: 33.33333333%;
        text-align: center;
        cursor: pointer;
    }
    .gridWidth1{
        width: 100%;
        text-align: center;
        cursor: pointer;
    }
    .oneRowContainer{
        display: flex;
        align-items: center;
        overflow: hidden;
    }
    .oneRowContainer > span{
        width: 20%;
        color: #87b1df;
    }
    .oneRowContainer>p,.oneRowContainer>div{
        flex: 1;
    }
    .imgContainer{
        width: 100%;
        position: relative;
        border-left: 1px solid #e8e8e8;
        overflow: hidden;
    }
    .imgContainer:hover >.imgTools{
        display: flex;
    }
    .imgContainer > img{
        padding: 10px;
        border: 1px solid #e8e8e8;
        min-height: 250px;
    }
    .rightBorder{
        font-size: 20px;
    }
    .imgTools{
        display: none;
        position: absolute;
        right: 20px;
        bottom: 40px;
        flex-direction: column;
        transition: all 0.5s linear;
    }
    .imgTools i{
        font-size: 24px;
        padding: 5px;
    }
</style>