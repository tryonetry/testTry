<!-- template -->
<template>
    <div class="bigDataAnalysis">
        <div class="data_header"></div>
        <div class="data_conteiner">
            <div class="left_con"></div>
            <div class="center_map">
                <el-amap vid="map_container" class="map_container"></el-amap>
            </div>
            <div class="right_con">
                <div class="right_chartDiv" style="height:50%;">
                    <div class="charts_div_title">
                        <img class="title_left_icon" src="../../assets/image/bigData/title_icon.png" alt="">
                        省内流动人口
                        <img class="title_right_icon" src="../../assets/image/bigData/title_icon2.png" alt="">
                    </div>
                    <div class="charts_div" ref="charts_div"></div>
                </div>
                <div class="right_chartDiv" style="height:calc(100% - 50% - 6%);">
                    <div class="charts_div_title">
                        <img class="title_left_icon" src="../../assets/image/bigData/title_icon.png" alt="">
                        各行业人口占比
                        <img class="title_right_icon" src="../../assets/image/bigData/title_icon2.png" alt="">
                    </div>
                    <div class="charts_div" ref="charts_div_pie"></div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import { lazyAMapApiLoaderInstance } from 'vue-amap';
import VueAMap from 'vue-amap';   //导入Amap

VueAMap.initAMapApiLoader({
  key: '8f40cdac432e42756a9d45dbd66b94cd',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType'],
  v: '1.4.4'
});

export default {
    name:"Analysis",
    //import引入的组件需要注入到对象中才能使用
    components: {
        
    },
    props:[""],

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
       drawMapFun(){
           //绘制地图
           lazyAMapApiLoaderInstance.load().then(() => {
                this.map = new AMap.Map('map_container', {
                    center: new AMap.LngLat(108.93, 34.27),
                    mapStyle: 'amap://styles/d48e7e521cd1c10e5ae643adc75440a6'
                });
            })
       },
       drawcolumnar(){
            this.$nextTick(() => {
                let columnarChart = this.$echarts.init(this.$refs.charts_div);
                columnarChart.clear();
                columnarChart.resize();
                columnarChart.setOption({
                    color: ['#2291e3'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '5%',
                        right: '4%',
                        bottom: '5%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisLine:{
                                lineStyle:{
                                    color: '#2291e3'
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel:{
                                color: '#ffffff'
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLine:{
                                lineStyle:{
                                    color: '#598ca6'
                                }
                            },
                            axisTick:{
                                show: false
                            },
                            axisLabel:{
                                show:true,
                                color: '#ffffff'
                            },
                            splitLine: {
                                show: false
                            }
                        }
                    ],
                    series : [
                        {
                            name:'直接访问',
                            type:'bar',
                            barWidth: '60%',
                            data:[10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                });
            })
       },
       drawPie(){
         this.$nextTick(() => {
            let pieChart = this.$echarts.init(this.$refs.charts_div_pie);
            pieChart.clear();
            pieChart.resize();
            pieChart.setOption({ 
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
                    top: '8%',
                    icon: 'circle',
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle:{
                        color: '#ffffff'
                    },
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '18',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:335, name:'直接访问'},
                            {value:310, name:'邮件营销'},
                            {value:234, name:'联盟广告'},
                            {value:135, name:'视频广告'},
                            {value:1548, name:'搜索引擎'}
                        ],
                        color: ['#1d5b98', '#ff7326', '#32e9b8', '#91e3f7', '#32b7e9']
                    }
                ]
            })
         })
       },
    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },

    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.drawMapFun();
        this.drawcolumnar();
        this.drawPie();
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
.bigDataAnalysis{
    width: 100%;
    height: 100%;
    background: url('../../assets/image/bigData/data_bg.png') no-repeat;
    background-size: 100% 100%;
}

.data_header{
    width: 100%;
    height: 58px;
    background: url('../../assets/image/bigData/header_bg_01.png') no-repeat;
    background-size: 100% 100%;
}

.data_conteiner{
    width: calc(100% - 20px);
    height: calc(100% - 58px - 20px - 10px);
    padding: 30px 20px;
    display: flex;
    justify-content: center;
    margin: 20px 10px 10px 10px;
    background: url('../../assets/image/bigData/con_bg.png') no-repeat;
    background-size: 100% 100%;

}

.left_con, .center_map, .right_con{
    height: 100%;
}

.center_map{
    margin: 0 10px;
}

.left_con{
    order: 1;
    width: 468px;
}

.center_map{
    order: 2;
    width: calc(100% - 468px - 468px - 20px);
}

.right_con{
    order: 3;
    width: 468px;
}

.map_container{
    width: 100%;
    height: 100%;
}

.right_chartDiv{
    width: 100%; 
    border:1px solid #5aceff; 
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
}

.right_chartDiv:last-child{
    margin-bottom: 0;
}

.charts_div_title{
    width: 100%;
    height: 30px;
    font-family: Arial, Helvetica, sans-serif;
	font-size: 17px;
    line-height: 30px;
	font-weight: bold;
	font-stretch: normal;
	letter-spacing: 0px;
	color: #ffffff;
    position: relative;
}

.charts_div_title .title_left_icon{
    width: 27px;
    height: 27px;
    vertical-align: middle;
    margin-right: 8px;
}

.title_right_icon{
    width: 50%;
    height: 14px;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto auto;
}

.charts_div{
    width: 100%;
    height: calc(100% - 30px);
}

</style>