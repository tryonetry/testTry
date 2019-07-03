<!-- template -->
<template>
  <div class="outer">
    <div class="searchForm">
      <a-form :form="form" class="formInputsContainer ant-row">
        <a-col :xs="{ span: 12 }" :xl="{span: 8}" :xxl="{span: 5}">
          <a-form-item
            label="查询日期"
            :label-col="defaultLayout.labelCon"
            :wrapper-col="defaultLayout.wrapperCol"
          >
            <a-range-picker class="formSearchDate" format="YYYY-MM-DD" v-model="currDate"/>
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
      <div class="tableAnalysis" style="position:relative;">
        <JsonExcel :data="initArr.tabledataArr" :fields="exportFiledsJson" :name="fieldsName">
          <a-button type="primary" @click="exportFun" class="exportBtn">导出</a-button>
        </JsonExcel>
        <a-tabs defaultActiveKey="1" style="padding:10px;height:100%;" @change="tabChange">
          <a-tab-pane tab="档案接收" key="1">
            <TableView
              :initArrData="initArr"
              :totalCount="tableTotalNum"
              :loading="tableLoading"
              @searchTable="getTableData"
            ></TableView>
          </a-tab-pane>
          <a-tab-pane tab="档案借出" key="2" forceRender>
            <TableView
              :initArrData="initArr"
              :totalCount="tableTotalNum"
              :loading="tableLoading"
              @searchTable="getTableData"
            ></TableView>
          </a-tab-pane>
          <a-tab-pane tab="档案转出" key="3">
            <TableView
              :initArrData="initArr"
              :totalCount="tableTotalNum"
              :loading="tableLoading"
              @searchTable="getTableData"
            ></TableView>
          </a-tab-pane>
          <a-tab-pane tab="材料接收" key="4">
            <TableView
              :initArrData="initArr"
              :totalCount="tableTotalNum"
              :loading="tableLoading"
              @searchTable="getTableData"
            ></TableView>
          </a-tab-pane>
          <a-tab-pane tab="材料借出" key="5">
            <TableView
              :initArrData="initArr"
              :totalCount="tableTotalNum"
              :loading="tableLoading"
              @searchTable="getTableData"
            ></TableView>
          </a-tab-pane>
        </a-tabs>
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
  name: "RecordUseStatistical",
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
      defaultLayout: {  //查询layout
        labelCon: { sm: { span: 8 }, xl: { span: 6 }, xxl: { span: 5 } },
        wrapperCol: { sm: {span: 16}, xl: {span: 18}, xxl: {span: 19} }
      },
      currDate: [
        //默认查询日期
        moment(moment().subtract(1, "year"), "YYYY-MM-DD"),
        moment(new Date(), "YYYY-MM-DD")
      ],
      tempSearch: {},  //临时：当前查询条件

      tableTotalNum: 0, //档案接收--table--总条数
      tableLoading: false, //档案接收--table--loading
      initArr: {
        //档案接收--tableView数据
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check,
        bordered: true, //table--边框
        superimposeWidth: true,
        formData: {
          formInputs: [],
          formBtns: []
        },
        columnsArr: [],
        tabledataArr: []
      },
      acceptColumnsArr: [
        //档案接收表头
        { title: "档案人名称", dataIndex: "", key: "", width: 150 },
        {
          title: "档案编号",
          dataIndex: "",
          key: "",
          width: 150
        },
        {
          title: "档案接收单位",
          dataIndex: "",
          key: "",
          width: 200
        },
        {
          title: "单位性质",
          dataIndex: "",
          key: "",
          width: 120
        },
        {
          title: "档案接收时间",
          dataIndex: "",
          key: "",
          width: 150
        },
        {
          title: "经办人",
          dataIndex: "",
          key: "",
          width: 150
        }
      ],
      lendColumnsArr: [
        //档案借出表头
        { title: "档案人名称", dataIndex: "", key: "", width: 150 },
        {
          title: "档案编号",
          dataIndex: "",
          key: "",
          width: 150
        },
        {
          title: "档案借阅单位",
          dataIndex: "",
          key: "",
          width: 200
        },
        {
          title: "单位性质",
          dataIndex: "",
          key: "",
          width: 120
        },
        {
          title: "档案借出时间",
          dataIndex: "",
          key: "",
          width: 150
        },
        {
          title: "经办人",
          dataIndex: "",
          key: "",
          width: 150
        }
      ],
      rolloutColumnsArr: [
        //档案转出表头
        { title: "档案人名称", dataIndex: "", key: "", width: 150 },
        {
          title: "档案编号",
          dataIndex: "",
          key: "",
          width: 150
        },
        {
          title: "档案转出单位",
          dataIndex: "",
          key: "",
          width: 200
        },
        {
          title: "单位性质",
          dataIndex: "",
          key: "",
          width: 120
        },
        {
          title: "档案转出时间",
          dataIndex: "",
          key: "",
          width: 150
        },
        {
          title: "经办人",
          dataIndex: "",
          key: "",
          width: 150
        }
      ],
      materialAcceptColumnsArr: [
        //材料接收表头
        { title: "材料人名称", dataIndex: "", key: "", width: 150 },
        { title: "档案编号", dataIndex: "", key: "", width: 200 },
        { title: "材料名称", dataIndex: "", key: "", width: 150 },
        { title: "材料接收单位", dataIndex: "", key: "", width: 200 },
        { title: "单位性质", dataIndex: "", key: "", width: 150 },
        { title: "材料接收时间", dataIndex: "", key: "", width: 150 },
        { title: "经办人", dataIndex: "", key: "", width: 150 }
      ],
      materialLendColumnsArr: [
        //材料借出表头
        { title: "材料人名称", dataIndex: "", key: "", width: 150 },
        { title: "档案编号", dataIndex: "", key: "", width: 200 },
        { title: "材料名称", dataIndex: "", key: "", width: 150 },
        { title: "材料借阅单位", dataIndex: "", key: "", width: 200 },
        { title: "单位性质", dataIndex: "", key: "", width: 150 },
        { title: "材料借出时间", dataIndex: "", key: "", width: 150 },
        { title: "经办人", dataIndex: "", key: "", width: 150 }
      ],

      firstChartData: null, //第一个图表渲染数据
      personInfoData: [
        {
          type: 1,
          isSelectType: true,
          cardTitle: '档案转出统计分析(单位:次)',
          title: "档案转出统计分析",
          data: [{ name: "档案接收", value: "36" }]
        },
        {
          type: 2,
          isSelectType: false,
          cardTitle: '按经办人统计(最近一年)(单位:次)',
          title: "按经办人统计(最近一年)",
          data: [{ name: "XXXX", value: "123" }]
        }
      ],
      otherChartsData: [], //其他图表
      chartTypeArr: ["bar", "line", "radar", "pie"], //chart图表类型

      exportFiledsJson: {
        //导出excel表：字段名对应
      },
      fieldsName:"档案利用统计分析" + this.moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),  //导出excel表名称
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
    moment,
    getChartData(condition){

    },
    getTableData(condition, pageNum, limitNum) {
      /**
       * 功能：获取数据
       */
      let newCondition = {};
      if(condition){
        newCondition = condition;
      } else{
        newCondition = this.tempSearch;
      }
      this.tableLoading = true;
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
        // this.getChartData(this.tempSearch);
        // this.getTableData(this.tempSearch, 1, 10);
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
        this.$refs.charts.returnChangeSelect()
      );
      this.otherChartsData.forEach((item, index) => {
        if (index === i) {
          this.$refs.educharts[index].getChartsData(item, item.chartsType);
        }
      });
      //   this.getTableData(currType);
    },
    tabChange(currKey){
      /**
       * 功能：tab切换：实现表头和数据切换
       * 参数：currKey:当前tab的key值
       */
      const _this = this;
      if(currKey === '1'){
        //档案接收
        _this.initArr.columnsArr = _this.acceptColumnsArr;
      } else if(currKey === '2'){
        //档案借出
        _this.initArr.columnsArr = _this.lendColumnsArr;
      } else if(currKey === '3'){
        //档案转出
        _this.initArr.columnsArr = _this.rolloutColumnsArr;
      } else if(currKey === '4'){
        //材料接收
        _this.initArr.columnsArr = _this.materialAcceptColumnsArr;
      } else{
        //材料借出
        _this.initArr.columnsArr = _this.materialLendColumnsArr;
      }
    },
    exportFun() {
      //导出操作
      if (this.initArr.tabledataArr.length === 0) {
        this.$message.warning("暂无可导出的数据！");
      }
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.firstChartData = { ...this.personInfoData[0] };
    this.firstChartData.chartsType = this.chartTypeArr[0];
    this.initArr.columnsArr = this.acceptColumnsArr;

    this.getChartData(null); //获取图表数据
    this.getTableData(null, 1, 10); //获取表格数据

  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
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
  height: 65%;
}
.analysisTwo {
  height: calc(100% - 65% - 78px - 15px);
}

.analysisTwoCon {
  width: calc(100% / 5);
}

.exportBtn {
  position: absolute;
  right: 34px;
  top: -20px;
}
</style>