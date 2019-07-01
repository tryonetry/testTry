<!-- template -->
<template>
    <div class="outer">
    <div class="searchForm">
      <a-form :form="form" class="formInputsContainer ant-row">
        <a-col style="line-height:39.9999px;">查询日期：</a-col>
        <a-col :xl="6" :xxl="4" :xs="12" style="margin-left: 15px;">
          <a-form-item>
            <a-range-picker class="formSearchDate" format='YYYY-MM-DD' v-model="currDate"/>
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
      <div class="tableAnalysis" style="position:relative;">
        <TableView
          :initArrData="initArr"
          :totalCount="tableTotalNum"
          :loading="tableLoading"
          @searchTable="getTableData"
        >
          <span slot="formAction">
            <JsonExcel :data="initArr.tabledataArr" :fields="exportFiledsJson" :name='fieldsName'>
              <a-button type="primary">导出</a-button>
            </JsonExcel>
            
          </span>
        </TableView>
      </div>
    </div>
  </div>
</template>

<script>
import RecordAnalysis from "@/components/recordAnalysis";
import TableView from "@/components/tableView";
import moment from "moment";
import JsonExcel from 'vue-json-excel'
export default {
    name:"AgentUnitStatistical",
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
      dateRangeMode: ["month", "month"],
      firstChartData: null, //第一个图表渲染数据
      personInfoData: [
        {
          type: 1,
          isSelectType: true,
          cardTitle: '档案转出统计分析(单位:次)',
          title: "档案转出统计分析",
          data: []
        }
      ],
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
        columnsArr: [
          { title: "公司名称", key: "companyName", dataIndex: "companyName", width: 350 },
          { title: "立户日期", key: "tatsudoDate", dataIndex: "tatsudoDate", width: 250 },
          { title: "单位性质", key: "companyNature", dataIndex: "companyNature", width: 200 },
          { title: "代理人数", key: "companyEmployeesNumber", dataIndex: "companyEmployeesNumber" },
        ],
        tabledataArr: []
      },
      chartTypeArr: ["bar", "line", "radar", "pie"], //chart图表类型
      currDate: [moment(moment().subtract(1, 'year'), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],   //默认查询日期
      exportFiledsJson: {
        "公司名称": "companyName",
        "立户日期": "tatsudoDate",
        "单位性质": "companyNature",
        "代理人数": "companyEmployeesNumber"
      },
      fieldsName: '代理单位统计' + this.moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
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
    getChartData(condition) {
      /**
       * 功能：获取图表数据
       */
       this.$http.fetchPost('statisticsAnalysis@companyStatistics.action',{
          startTime: (!condition || !condition.startDate) ? this.moment().subtract(1, 'year').format('YYYY-MM-DD')  : condition.startDate,
          endTime: (!condition || !condition.endDate) ? this.moment(new Date()).format('YYYY-MM-DD') : condition.endDate
       }).then(res => {
        if(Number(res.code) === 0){
          let tempResData = res.data.companyStatistics;
          this.personInfoData[0].data = [];
          tempResData.forEach(element => {
           this.personInfoData[0].data.push({
             name: element.name,
             value: element.value
           })            
          }); 
          this.firstChartData = {...this.personInfoData[0]};
          this.firstChartData.chartsType = this.chartTypeArr[0];
        } else{
          this.$message.error('抱歉，获取数据失败，请刷新后重试！')
        }
       }).catch(error => {
         this.$message.error('抱歉，网络异常！');
       })
    },
    getTableData(condition, pageNum, limitNum){
      /**
       * 功能：获取table数据
       */
      this.tableLoading = true;
      this.$http.fetchPost('statisticsAnalysis@companyStatisticsViews.action',{
        page: pageNum,
        limt: limitNum,
        startTime:(!condition || !condition.startDate) ? this.moment().subtract(1, 'year').format('YYYY-MM-DD') : condition.startDate,
        endTime: (!condition || !condition.endDate) ? this.moment(new Date()).format('YYYY-MM-DD') : condition.endDate
      }).then(res => {
        if(Number(res.code) === 0){
          this.tableTotalNum = res.count;
          this.initArr.tabledataArr = [];
          let tempTableData = res.data;
          tempTableData.forEach((element, index) => {
            this.initArr.tabledataArr.push({
              key: element.id,
              companyName: element.companyName,
              companyNature: element.companyNature,
              companyEmployeesNumber: element.companyEmployeesNumber,
              tatsudoDate: element.tatsudoDate
            })
          });
        } else{
          this.$message.error('抱歉，获取数据失败，请刷新后重试！');
        }
      }).catch(error => {
        this.$message.error('抱歉，网络异常！');
      }).finally(end => {
        this.tableLoading = false;
      })
    },
    handleSubmit(e) {
      /**
       * 功能：选择完时间：查询按钮功能
       */
      e.preventDefault();
      let tempSearch = {};
      if (this.currDate.length > 0) {
        tempSearch.startDate = this.currDate[0]
          ? this.moment(this.currDate[0]._d).format("YYYY-MM-DD")
          : '';
        tempSearch.endDate = this.currDate[1]
          ? this.moment(this.currDate[1]._d).format("YYYY-MM-DD")
          : '';
      }
      this.getChartData(tempSearch);
      this.getTableData(tempSearch, 1, 10);
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getChartData(null);   //获取图表数据
    this.getTableData(null, 1, 10);   //获取表格数据
  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    const _this = this;
    window.onresize = function(){
      _this.$nextTick(() => {
        _this.$refs.charts.resizeChartsFun();
      })
      
    }
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
  height: calc(100% - 78px - 20px);
  border: none;
}
</style>