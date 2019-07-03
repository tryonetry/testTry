<!-- template -->
<template>
  <div class="chartsContainer" ref="chartsContainer">
    <div class="chartHeader">
      <span class="chartTitle">{{chartsData && chartsData.cardTitle}}</span>
      <span v-if="chartsData && chartsData.isSelectType">
        选择类型：
        <a-select
          defaultValue="bar"
          style="width: 120px"
          @change="changeChartType($event,chartsData)"
        >
          <a-select-option v-for="item in selectTypeArr" :key="item.value">{{item.name}}</a-select-option>
        </a-select>
      </span>
    </div>
    <div class="chartCon">
      <div ref="chart_div" id="charts" class="charts "></div>
      <div class="noData"  v-if="!chartsData || !chartsData.data || chartsData.data.length <= 0 ">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { setTimeout } from "timers";
export default {
  name: "RecordAnalysis",
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: ["chartsData"],

  data() {
    return {
      selectTypeVal: "bar",
      selectTypeArr: [
        //图表类型
        { value: "bar", name: "柱状图" },
        { value: "line", name: "折线图" },
        { value: "radar", name: "雷达图" },
        { value: "pie", name: "饼图" }
      ],
      tempChartsData: {},  //临时chartsData
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
    chartsData: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal && newVal.data && newVal.data.length > 0) {
          this.getChartsData(newVal, newVal.chartsType);
        }
      }
    }
  },

  //方法集合
  methods: {
    changeChartType(val, dataArr) {
      /***
       * 功能:chart图表类型选择，切换不同的图表
       */
      this.selectTypeVal = val;
      this.getChartsData(dataArr, val);
    },

    returnChangeSelect() {
      return this.selectTypeVal;
    },

    getChartsData(currData, chartType) {
      /***
       * 功能：图表根据type类型数据重组
       * 参数：columnarData:当前数据; chartType:图表类型(bar-柱状图， line-折线图， radar-雷达图， pie-饼图)
       */
      let indicatorArr = [],
        valueArr = [],
        columnarXData = [],
        columnarYData = [],
        pieData = [];
      if (currData && currData.data && currData.data.length > 0) {
        if (chartType === "radar") {
          //雷达图
          currData.data.forEach(el => {
            for (let key in el) {
              if (key !== "value") {
                indicatorArr.push({
                  name: el[key],
                  max: Number(el.value) + 10
                });
              }
            }
            valueArr.push(el.value);
          });
          this.radarChart(indicatorArr, valueArr, currData.title);
        } else if (chartType === "pie") {
          //饼图
          currData.data.forEach(el => {
            pieData.push({
              value: el.value,
              name: el.name
            });
          });
          this.pieChart(pieData, currData.title);
        } else {
          //折线图或柱状图
          currData.data.forEach(el => {
            columnarXData.push(el.name);
            columnarYData.push(el.value);
          });
          if (chartType === "bar") {
            //柱状图
            this.columnarChart(columnarXData, columnarYData, currData.title);
          } else {
            //折线图
            this.lineChart(columnarXData, columnarYData);
          }
        }
      }
    },
    radarChart(indicatorArr, valueArr, title) {
      /***
       * 功能：渲染出雷达图
       * 参数：indicatorArr:[]格式，x轴的值及最大值； valueArr：数据； title: 标题
       */
      this.$nextTick(() => {
        if (document.readyState === "complete") {
          this.$refs.chart_div.style.height =
            this.$refs.chartsContainer.clientHeight - 32 + "px";
        } else {
          this.$refs.chart_div.style.height =
            this.$refs.chartsContainer.clientHeight + 68 + "px";
        }
        let radarChart = this.$echarts.init(this.$refs.chart_div);
        radarChart.clear();
        radarChart.resize();
        radarChart.setOption({
          tooltip: {},
          legend: {
            show: false
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {}
            }
          },
          radar: {
            //   shape: "circle",
            center: ["50%", "50%"], //中心坐标
            radius: 80, //半径
            startAngle: 90, //开始角度， 默认：90
            name: {
              textStyle: {
                color: "#72ACD1",
                fontSize: 12
              }
            },
            nameGap: 10, //指示器名称和指示器轴的距离 default: 15
            splitNumber: 3, //(这里是圆的环数)指示器轴的分割段数：默认:5
            axisLine: {
              // (圆内的几条直线)坐标轴轴线相关设置
              lineStyle: {
                color: "#ddd", // 坐标轴线线的颜色。
                width: 1, // 坐标轴线线宽。
                type: "solid" // 坐标轴线线的类型。
              }
            },
            splitLine: {
              // (这里是指所有圆环)坐标轴在 grid 区域中的分隔线。
              lineStyle: {
                color: "#ddd", // 分隔线颜色
                width: 1 // 分隔线线宽
              }
            },
            splitArea: {
              // 坐标轴在 grid 区域中的分隔区域，默认不显示。
              show: true,
              areaStyle: {
                // 分隔区域的样式设置。
                color: ["rgba(255, 255, 255,0.3)", "rgba(255, 255, 255,0.3)"] // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
              }
            },
            indicator: indicatorArr
          },
          series: [
            {
              type: "radar",
              data: [
                {
                  value: valueArr,
                  name: title,
                  lineStyle: {
                    normal: {
                      color: "#5eaaef"
                    }
                  },
                  areaStyle: {
                    normal: {
                      color: "rgba(64, 169, 255, 0.5)"
                    }
                  }
                }
              ]
            }
          ]
        });
      })
    },
    columnarChart(xData, yData, title) {
      /***
       * 功能：根据数据绘制柱状图
       * 参数：xData: x轴数据; yData:y轴数据
       */
      //判断当前页面是否加载完成：
      //readyState:complete(加载完成)/loading(正在加载，此处不考虑)/interactive(可交互，此时由于在dom渲染时，先把左侧菜单栏都没加载出来，占200px； 导致加载完获取得dom高度少了100，故当前dom增加100占满整个div；)
      this.$nextTick(() => {
        if (document.readyState === "complete") {
          this.$refs.chart_div.style.height = this.$refs.chartsContainer.clientHeight - 32 + "px";
        } else {
          this.$refs.chart_div.style.height = this.$refs.chartsContainer.clientHeight + 68 + "px";
        }
        let columnarChart = this.$echarts.init(this.$refs.chart_div);
        columnarChart.clear();
        columnarChart.resize();
        columnarChart.setOption({
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "line" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: "5%",
            right: "5%",
            top: "5%",
            bottom: "8%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: xData,
              axisTick: {
                //x轴刻度
                show: false
              },
              axisLabel: {
                //x轴文字显示
                interval: 0,
                rotate: xData.length > 5 ?  30 : 0
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              axisTick: {
                //刻度线
                show: false
              },
              axisLine: {
                //y轴轴线
                show: false
              },
              splitLine: {
                //网格线
                show: true,
                lineStyle: {
                  color: "#ddd",
                  type: "dashed"
                }
              }
            }
          ],
          series: [
            {
              name: title,
              type: "bar",
              barWidth: "30%", //bar宽度
              data: yData
            }
          ],
          color: ["#6eb5f5"]
        });
      })
    },
    lineChart(xData, yData) {
      /***
       * 功能：绘制折线图
       */
      this.$nextTick(() => {
        if (document.readyState === "complete") {
          this.$refs.chart_div.style.height =
            this.$refs.chartsContainer.clientHeight - 32 + "px";
        } else {
          this.$refs.chart_div.style.height =
            this.$refs.chartsContainer.clientHeight + 68 + "px";
        }
        let lineChart = this.$echarts.init(this.$refs.chart_div);
        lineChart.clear();
        lineChart.resize();
        lineChart.setOption({
          tooltip: {
            trigger: "axis"
          },
          grid: {
            left: "5%",
            right: "5%",
            top: "5%",
            bottom: "8%",
            containLabel: true
          },
          xAxis: {
            type: "category",
            data: xData,
            axisTick: {
              show: false
            },
            axisLabel: {
              //x轴文字显示
              interval: 0,
              rotate: xData.length > 5 ?  30 : 0
            }
          },
          yAxis: {
            type: "value",
            axisTick: {
              show: false
            },
            axisLine: {
              //y轴轴线
              show: true
            },
            splitLine: {
              //网格线
              show: true,
              lineStyle: {
                color: "#ddd",
                type: "dashed"
              }
            }
          },
          series: [
            {
              data: yData,
              type: "line",
              smooth: false //是否平滑
            }
          ],
          color: ["#6eb5f5"]
        });
      })
    },
    pieChart(pieData, title) {
      /***
       * 功能：绘制饼图
       */
      this.$nextTick(() => {
        if (document.readyState === "complete") {
          this.$refs.chart_div.style.height =
            this.$refs.chartsContainer.clientHeight - 32 + "px";
        } else {
          this.$refs.chart_div.style.height =
            this.$refs.chartsContainer.clientHeight + 68 + "px";
        }

        let pieChart = this.$echarts.init(this.$refs.chart_div);
        pieChart.clear();
        pieChart.resize();
        pieChart.setOption({
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            show: false
          },
          series: [
            {
              name: title,
              type: "pie",
              radius: ["50%", "70%"], //半径大小
              avoidLabelOverlap: false,
              center: ["50%", "50%"], //饼图位置
              label: {
                normal: {
                  show: false,
                  position: "center"
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "15",
                    fontWeight: "500"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: pieData
            }
          ],
          color: [
            "#99CC33",
            "#99CCFF",
            "#0099CC",
            "#FFCC99",
            "#CCCCFF",
            "#006699"
          ]
        });
      })
    },

    resizeChartsFun() {
      /**
       * 当窗口变化时：echarts重绘
       */
      const _this = this;
      if (
        _this.chartsData &&
        _this.chartsData.data &&
        _this.chartsData.data.length > 0
      ) {
        _this.$nextTick(() => {
          if (document.readyState === "complete") {
            _this.$refs.chart_div.style.height =
              _this.$refs.chartsContainer.clientHeight - 32 + "px";
          } else {
            _this.$refs.chart_div.style.height =
              _this.$refs.chartsContainer.clientHeight + 68 + "px";
          }
        });
        _this.getChartsData(_this.chartsData, _this.chartsData.chartsType);
      }
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
  },

  beforeCreate() {}, //生命周期 - 创建之前

  beforeMount() {}, //生命周期 - 挂载之前

  beforeUpdate() {}, //生命周期 - 更新之前

  updated() {
    // const _this = this;
  }, //生命周期 - 更新之后

  beforeDestroy() {}, //生命周期 - 销毁之前

  destroyed() {}, //生命周期 - 销毁完成

  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style scoped>
.chartHeader {
  display: flex;
  justify-content: space-between;
  line-height: 32px;
}

.chartTitle {
  font-size: 14px;
}

.chartsContainer {
  width: 100%;
  height: 100%;
}
.chartCon {
  width: 100%;
  height: calc(100% - 32px);
  overflow: hidden;
  position: relative;
}
.chartCon>div{
  position: absolute;
  width: 100%;
  height: 100%;
}
.charts {
  width: 100%;
  /* height: 100%; */
}

.noData{
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>