<!-- template -->
<template>
  <div class="outer">
    <div class="searchForm">
      <a-form :form="form" class="formInputsContainer ant-row">
        <a-col style="line-height:39.9999px;">查询日期：</a-col>
        <a-col>
          <a-radio-group
            @change="changeDateType"
            v-model="dateSearchType"
            style="line-height:39.9999px;"
          >
            <a-radio-button value="date">日期</a-radio-button>
            <a-radio-button value="month">月份</a-radio-button>
          </a-radio-group>
        </a-col>
        <a-col :xl="6" :xxl="4" :xs="12" style="margin-left: 15px;">
          <a-form-item v-if="dateSearchType === 'date'">
            <a-date-picker class="formSearchDate" placeholder="请选择日期" v-model="currDate"/>
          </a-form-item>
          <a-form-item v-else>
            <a-month-picker class="formSearchDate" placeholder="请选择月份" v-model="currDate"/>
          </a-form-item>
        </a-col>
        <a-col style="margin-left: 15px;line-height:39.9999px;">
          <a-button type="primary" @click="handleSubmit">查询</a-button>
        </a-col>
      </a-form>
    </div>
    <div class="analysisOne">
      <div class="leftAnalysis">
        <RecordAnalysis :chartsData="firstChartData" ref="charts"></RecordAnalysis>
      </div>
      <div class="tableAnalysis">
        <div class="tableTitle">
          <a-button type="primary" size="small" class="buttonOperate">导出</a-button>
        </div>
        <a-table :columns="chartsColumns" :dataSource="tableData" :scroll="{ x: '120%'}"></a-table>
      </div>
    </div>
    <div class="analysisTwo">
      <div
        class="analysisTwoCon"
        v-for="(item, index) in otherChartsData"
        :key="index"
        @click="changeClick(item.type,index , item.chartsType)"
      >
        <RecordAnalysis :chartsData="item" ref="educharts"></RecordAnalysis>
      </div>
    </div>
  </div>
</template>

<script>
import RecordAnalysis from "@/components/recordAnalysis";
export default {
  name: "RecordAcceptStatistical",
  //import引入的组件需要注入到对象中才能使用
  components: {
    RecordAnalysis
  },
  props: [""],

  data() {
    return {
      form: this.$form.createForm(this),
      dateSearchType: "date",
      firstChartData: null, //第一个图表渲染数据
      personInfoData: [
        {
          type: 1,
          isSelectType: true,
          title: "档案接收统计分析",
          data: [{ name: "档案接收", value: "36" }]
        },
        {
          type: 2,
          isSelectType: false,
          title: "按经办人统计",
          data: [{ name: "XXXX", value: "123" }]
        }
      ],
      chartsColumns: [
        { title: "所属机构", dataIndex: "organ", key: "organ" },
        { title: "接收时间", dataIndex: "acceptDate", key: "acceptDate" },
        { title: "转出单位", dataIndex: "rollOutUnit", key: "rollOutUnit" },
        { title: "单位性质", dataIndex: "unitNature", key: "unitNature" },
        { title: "单位归属地", dataIndex: "unitAddress", key: "unitAddress" }
      ],
      tableData: [],
      otherChartsData: [], //其他图表
      chartTypeArr: ["bar", "line", "radar", "pie"], //chart图表类型
      currDate: null
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
    changeDateType(e) {
      this.dateSearchType = e.target.value;
    },
    handleSubmit(e) {
      e.preventDefault();
      let tempSearch = {};
      if (this.dateSearchType === "date") {
        tempSearch.currDate = this.dateZhuan("yyyy-MM-dd", this.currDate._d);
      } else {
          tempSearch.currDate = this.dateZhuan("yyyy-MM", this.currDate._d);
      }
      console.log(tempSearch);
    },
    otherChartsDataFun(currData) {
      /**
       * 功能：去掉数组里第一个，其余为新数组
       */
      let len = currData.length;
      for (let i = 1; i < len; i++) {
        this.otherChartsData.push(currData[i]);
      }
      this.otherChartsData.forEach((el, index) => {
        el.chartsType = this.chartTypeArr[index % 4];
      });
    },
    changeClick(currType, i, chartTypeVal) {
      /**
       * 功能：下面排列得点击函数， 点击：把当前点击在上面展示，原来在上面展示得在下面展示
       * 参数：currType:当前点击的统计分析类型; i:当前数据index; chartTypeVal:当前点击chart类型
       */
      let temp = this.firstChartData,
        tempIndex = 0,
        clickType = "";
      temp.isSelectType = false;
      this.otherChartsData.forEach((el, index) => {
        if (el.type === currType) {
          el.isSelectType = true;
          this.firstChartData = Object.assign(
            { ...el },
            { chartsType: temp.chartsType }
          );
          tempIndex = index;
          clickType = el.chartsType;
        }
      });
      this.otherChartsData.splice(
        tempIndex,
        1,
        Object.assign({ ...temp }, { chartsType: clickType })
      );
      // render
      this.$refs.charts.getChartsData(
        this.firstChartData,
        this.firstChartData.chartsType
      );
      this.otherChartsData.forEach((item, index) => {
        if (index === i) {
          this.$refs.educharts[index].getChartsData(item, item.chartsType);
        }
      });
    //   this.getTableData(currType);
    },
    dateZhuan: function(fmt, date) {
      /***
       * 功能：标准日期格式转化
       * 参数：fmt:格式， date：日期
       */
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.firstChartData = { ...this.personInfoData[0] };
    this.firstChartData.chartsType = this.chartTypeArr[0];
  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.otherChartsDataFun(this.personInfoData);

    
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
.searchForm {
  padding: 15px 20px 0 20px;
}
.formInputsContainer {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
}
.analysisOne {
  padding: 0 20px;
  height: 50%;
}
.analysisTwo {
  height: calc(100% - 50% - 78px);
}

.analysisTwoCon {
  width: calc(100% / 3);
}
</style>