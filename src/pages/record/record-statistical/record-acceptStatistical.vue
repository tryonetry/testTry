<!-- template -->
<template>
  <div class="outer">
    <div class="searchForm">
      <a-form :form="form" class="formInputsContainer ant-row">
        <a-col :xs="{ span: 8 }" :xl="{span: 4}" :xxl="{span: 3}">
          <a-form-item
            label="查询"
            :label-col="defaultLayout.labelCon"
            :wrapper-col="defaultLayout.wrapperCol"
          >
            <a-radio-group
              @change="changeDateType"
              v-model="dateSearchType"
              style="line-height:39.9999px;"
            >
              <a-radio-button value="date">日期</a-radio-button>
              <a-radio-button value="month">月份</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :xs="{ span: 8 }" :xl="{span: 6}" :xxl="{span: 4}">
          <a-form-item
            :label-col="{xs: {span: 0}, xl: {span: 0}, xxl: {span: 0}}"
            :wrapper-col="{xs: {span: 24}, xl: {span: 24}, xxl: {span: 24}}"
          >
            <a-range-picker class="formSearchDate" :format="dateRangeFormat" v-model="currDate"/>
          </a-form-item>
        </a-col>
        <a-form-item  :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="handleSubmit">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="analysisOne">
      <div class="leftAnalysis">
        <RecordAnalysis :chartsData="firstChartData" ref="charts"></RecordAnalysis>
      </div>
      <div class="tableAnalysis">
        <TableView
          :initArrData="initArr"
          :totalCount="tableTotalNum"
          :loading="tableLoading"
        >
          <span slot="formAction">
            <JsonExcel :data="initArr.tabledataArr" :fields="exportFiledsJson" :name="fieldsName">
              <a-button type="primary" @click="exportFun">导出</a-button>
            </JsonExcel>
          </span>
        </TableView>
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
import TableView from "@/components/tableView";
import moment from "moment";
import JsonExcel from "vue-json-excel";
export default {
  name: "RecordAcceptStatistical",
  //import引入的组件需要注入到对象中才能使用
  components: {
    RecordAnalysis,
    TableView,
    JsonExcel
  },
  props: [""],

  data() {
    return {
      form: this.$form.createForm(this),
      dateSearchType: "date", //默认选择--date类型时间
      defaultLayout: {  //查询layout
        labelCon: { sm: { span: 8 }, xl: { span: 6 }, xxl: { span: 5 } },
        wrapperCol: { sm: {span: 16}, xl: {span: 18}, xxl: {span: 19} }
      },
      dateRangeFormat: 'YYYY-MM-DD',  //日期格式
      currDate: [
        //默认查询日期
        moment(moment().subtract(7, "day"), "YYYY-MM-DD"),
        moment(new Date(), "YYYY-MM-DD")
      ],
      tempSearch: {},  //临时：当前查询条件
      tempTiemval:1,  //临时： 默认查询为：date格式
      
      tableTotalNum: 0, //table--总条数
      tableLoading: false, //table--loading
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check,
        bordered: true, //table--边框
        superimposeWidth: true,
        noPagination: true,  //table--无分页
        formData: {
          formInputs: [],
          formBtns: []
        },
        columnsArr: [
          { title: '序号', key: 'num', dataIndex: 'num', width: 100 },
          { title: "所属机构", dataIndex: "B0101", key: "B0101", width: 200 },
          {
            title: "接收时间",
            dataIndex: "U_CREATEDATE",
            key: "U_CREATEDATE",
            width: 150
          },
          {
            title: "转出单位",
            dataIndex: "COMPANYNAME",
            key: "COMPANYNAME",
            width: 200
          },
          {
            title: "单位归属地",
            dataIndex: "AREANAME",
            key: "AREANAME",
            width: 200
          }
        ],
        tabledataArr: []
      },

      firstChartData: null, //第一个图表渲染数据
      personInfoData: [
        {
          type: 1,
          isSelectType: true,
          cardTitle: '档案接收统计分析(单位:次)',
          title: "档案接收统计分析",
          data: []
        },
        {
          type: 2,
          isSelectType: false,
          cardTitle: '按经办人统计(最近一年)(单位:次)',
          title: "按经办人统计",
          data: []
        }
      ],
      otherChartsData: [], //其他图表
      chartTypeArr: ["bar", "line", "radar", "pie"], //chart图表类型
 
      exportFiledsJson: {
        //导出excel表：字段名对应
        序号: 'num',
        所属机构 : 'B0101',
        接收时间: 'U_CREATEDATE',
        转出单位 :'COMPANYNAME',
        单位归属地: 'AREANAME'
      },
      fieldsName:"档案接收统计" + this.moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),  //导出excel表名称

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
    moment,
    getChartsData(condition){
      /***
       * 功能：获取图表数据
       */
      this.$http.fetchPost("statisticsAnalysis@archReceiveStatistics.action", {
        tiemval: this.tempTiemval,
        startTime: (!condition || !condition.startDate) ? '' : condition.startDate,
        endTime: (!condition || !condition.endDate) ? '' : condition.endDate
      }).then(res => {
        if (Number(res.code) === 0) {
          //清空personInfoData--data数据
          this.personInfoData.forEach(element => {
            element.data = [];
          });
          //档案接收数据
          for(let i = 0; i < res.data.archChartData.length; i++){
            this.personInfoData[0].data.push({
              name: res.data.archReceive[i],
              value: res.data.archChartData[i].value
            });
          }
          //经办人
          this.personInfoData[1].data = res.data.creatorChartData;

          this.firstChartData = { ...this.personInfoData[0] };
          this.firstChartData.chartsType = this.$refs.charts.returnChangeSelect();
        } else {
          this.$message.error("抱歉，获取数据失败，请刷新后重试！");
        }
      }).catch(error => {
        this.$message.error("抱歉，网络异常！");
      });
    },
    getTableData(condition) {
      /**
       * 功能：获取数据
       */
      this.tableLoading = true;
      this.$http.fetchPost("statisticsAnalysis@archReceiveStatistics.action", {
        tiemval: this.tempTiemval,
        Browse: 'Browse',
        startTime: (!condition || !condition.startDate) ? '' : condition.startDate,
        endTime: (!condition || !condition.endDate) ? '' : condition.endDate
      }).then(res => {
        if (Number(res.code) === 0) {
          //table
          // console.log(res);
          this.tableTotalNum = res.data.archChartData[0].value;  //总数
          this.initArr.tabledataArr = [];
          let tempTableData = res.data.browseData;
          tempTableData.forEach((element, index) => {
            this.initArr.tabledataArr.push({
              key: index,
              num: index + 1,
              B0101: !element.B0101 ? '' : element.B0101,
              COMPANYNAME: !element.COMPANYNAME ? '' : element.COMPANYNAME,
              U_CREATEDATE: !element.U_CREATEDATE ? '' : element.U_CREATEDATE,
              AREANAME: !element.AREANAME ? '' : element.AREANAME
            });
          });
        } else {
          this.$message.error("抱歉，获取数据失败，请刷新后重试！");
        }
      }).catch(error => {
        this.$message.error("抱歉，网络异常！");
      }).finally(end => {
        this.tableLoading = false;
      });
    },
    changeDateType(e) {
      /**
       * 功能：更换日期类型
       * 参数：e：当前点击的类型
       */
      this.dateSearchType = e.target.value;
      if(e.target.value === 'date'){
        this.dateRangeFormat  = 'YYYY-MM-DD';
        this.tempTiemval = 1;
      } else{
        this.dateRangeFormat = 'YYYY-MM';
        this.tempTiemval = 2;
      }
    },
    handleSubmit(e) {
      /**
       * 功能：选择完时间：查询按钮功能
       */
      e.preventDefault();
      this.tempSearch = {};
      if (this.currDate.length > 0) {
        this.tempSearch.startDate = this.moment(this.currDate[0]._d).format("YYYY-MM-DD");
        this.tempSearch.endDate = this.moment(this.currDate[1]._d).format("YYYY-MM-DD");
        this.getChartsData(this.tempSearch);
        this.getTableData(this.tempSearch);
      } else{
        this.$message.error('查询日期不能为空！')
      }
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
            { chartsType: this.$refs.charts.returnChangeSelect() }  
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
        this.$refs.charts.returnChangeSelect()
      );
      this.otherChartsData.forEach((item, index) => {
        if (index === i) {
          this.$refs.educharts[index].getChartsData(item, item.chartsType);
        }
      });
      //   this.getTableData(currType);
    },
    exportFun(){
      //导出
      if (this.initArr.tabledataArr.length === 0) {
        this.$message.warning("暂无可导出的数据！");
      }
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    let iniSearch = {};
    iniSearch.startDate = this.moment(this.currDate[0]._d).format("YYYY-MM-DD");
    iniSearch.endDate = this.moment(this.currDate[1]._d).format("YYYY-MM-DD");
    this.getChartsData(iniSearch);
    this.getTableData(iniSearch);
  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.otherChartsDataFun(this.personInfoData);
    const _this = this;
    setTimeout(function(){
      _this.$nextTick(() => {
        _this.$refs.charts.resizeChartsFun();
        let educhartsList = _this.$refs.educharts, len = _this.$refs.educharts.length;
        for(let i = 0; i <len; i++){
          _this.$refs.educharts[i].resizeChartsFun();
        }
      });                                                                 
    },0)
    window.onresize = function() {
      _this.$nextTick(() => {
        _this.$refs.charts.resizeChartsFun();
        let educhartsList = _this.$refs.educharts, len = _this.$refs.educharts.length;
        for(let i = 0; i <len; i++){
          _this.$refs.educharts[i].resizeChartsFun();
        }
      });
    };
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
  height: 65%;
}
.analysisTwo {
  height: calc(100% - 65% - 78px - 15px);
}

.analysisTwoCon {
  width: calc(100% / 5);
}
</style>