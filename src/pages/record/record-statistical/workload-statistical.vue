<!-- template -->
<template>
  <div class="outer">
    <div class="searchForm">
      <a-form :form="form" class="formInputsContainer ant-row">
        <a-col :xs="{ span: 10}" :xl="{span: 8}" :xxl="{span: 5}">
          <a-form-item
            label="查询日期"
            :label-col="defaultLayout.labelCon"
            :wrapper-col="defaultLayout.wrapperCol"
          >
            <a-range-picker  v-model="currDate" class="formSearchDate" format="YYYY-MM-DD" @change="dateRangeChangeFun" />
          </a-form-item>
        </a-col>
        <a-col :xs="{ span: 10, offset: 1  }" :xl="{span: 8, offset: 1}" :xxl="{span: 5,offset: 1}">
          <a-form-item
            label="经办人"
            :label-col="defaultLayout.labelCon"
            :wrapper-col="defaultLayout.wrapperCol"
          >
            <a-select @change="selectChange" v-model="agentId">
              <a-select-option  v-for="item in optionList" :key="item.userId" >{{item.perName}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="handleSubmit">查询</a-button>
        </a-form-item>
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
            <JsonExcel :data="initArr.tabledataArr" :fields="exportFiledsJson" :name="fieldsName">
              <a-button type="primary" @click="exportFun">导出</a-button>
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
import JsonExcel from "vue-json-excel";
import moment from "moment";
import { setTimeout } from 'timers';
export default {
  name: "WorkloadStatistical",
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
      defaultLayout: {
        //查询layout
        labelCon: { sm: { span: 8 }, xl: { span: 6 }, xxl: { span: 5 } },
        wrapperCol: { sm: { span: 16 }, xl: { span: 18 }, xxl: { span: 19 } }
      },
      currDate: [
        //默认查询日期
        moment(moment().subtract(1, "year"), "YYYY-MM-DD"),
        moment(new Date(), "YYYY-MM-DD")
      ],
      rangeConfig: {
        rules: [{ type: 'array', required: false}],
      },
      optionList: [],  //经办人select
      agentId: '',  //选择的经办人id
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
        columnsArr: [
          { title: '序号', key: 'num', dataIndex: 'num', fixed: 'left', width: 80 },
          { title: "经办人姓名", key: "data2", dataIndex: "data2", width: 150 },
          { title: "档案接收", key: "data3", dataIndex: "data3", width: 150 },
          { title: "档案转出", key: "data4", dataIndex: "data4", width: 150 },
          { title: "档案借出", key: "data5", dataIndex: "data5", width: 150 },
          { title: "档案归还", key: "data6", dataIndex: "data6", width: 150 },
          { title: "证明出具", key: "data7", dataIndex: "data7", width: 150 },
          { title: "档案入库", key: "data8", dataIndex: "data8", width: 150 },
          { title: "材料接收", key: "data9", dataIndex: "data9", width: 150 },
          { title: "材料借出", key: "data10", dataIndex: "data10", width: 150 },
          { title: "材料归还", key: "data11", dataIndex: "data11", width: 150 },
          { title: "材料移交", key: "data12", dataIndex: "data12"}
        ],
        tabledataArr: []
      },

      firstChartData: null, //第一个图表渲染数据
      personInfoData: [
        //图表数据
        {
          type: 1,
          isSelectType: true,
          cardTitle: "工作量统计分析(单位:次)",
          title: "工作量统计分析",
          data: []
        }
      ],
      chartTypeArr: ["bar", "line", "radar", "pie"], //chart图表类型

      exportFiledsJson:{
        序号 : 'num',
        经办人姓名: 'data2',
        档案接收: 'data3',
        档案转出: 'data4',
        档案借出: 'data5',
        档案归还: 'data6',
        证明出具: 'data7',
        档案入库: 'data8',
        材料接收: 'data9',
        材料借出: 'data10',
        材料归还: 'data11',
        材料移交: 'data12'
      },
      fieldsName:"工作量统计分析" + this.moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),  //导出excel表名称
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
    getAgentFun(condition) {
      /**
       * 功能：获取经办人数据
       * 参数：condition:查询日期
       */
      this.$http.fetchPost("statisticsAnalysis@workPerson.action", {
          startTime: (!condition || !condition.startDate) ? '' : condition.startDate,
          endTime: (!condition || !condition.endDate) ? '' : condition.endDate
        }).then(res => {
          this.optionList = res.data;
          this.agentId = '';
        })
        .catch(error => {
          this.$message.error("抱歉，网络异常！");
        });
    },
    getChartData(condition){
      /**
       * 功能：获取图表数据
       */
      this.$http.fetchPost("statisticsAnalysis@workAnalyseStatistics.action", {
          startTime: (!condition || !condition.startDate) ? '' : condition.startDate,
          endTime: (!condition || !condition.endDate) ? '' : condition.endDate,
          personId: (!condition || !condition.personId) ? '' : condition.personId
        }).then(res => {
          if (Number(res.code) === 0) {
            
            let tempResData = res.data.workAnalyseStatistics;
            this.personInfoData[0].data = [];
            tempResData.forEach(element => {
              this.personInfoData[0].data.push({
                name: element.name,
                value: element.value
              });
            });
            this.firstChartData = { ...this.personInfoData[0] };
            this.firstChartData.chartsType = this.chartTypeArr[0];
          } else {
            this.$message.error("抱歉，获取数据失败，请刷新后重试！");
          }
        }).catch(error => {
          this.$message.error("抱歉，网络异常！");
        });
    },

    getTableData(condition, pageNum, limitNum) {
      /**
       * 功能：获取图表数据
       */
      let newCondition = {};
      if(condition){
        newCondition = condition;
      } else{
        newCondition = this.tempSearch;
      }
      this.tableLoading = true;
      this.$http.fetchPost('statisticsAnalysis@workAnalyseCheck.action',{
        Browse: 'Browse',
        startTime: (!newCondition || !newCondition.startDate) ? '' : newCondition.startDate,
        endTime: (!newCondition || !newCondition.endDate) ? '' : newCondition.endDate,
        personId: (!newCondition || !newCondition.personId) ? '' : newCondition.personId
      }).then(res => {
        if(Number(res.code) === 0){
          this.tableTotalNum = res.count;
          this.initArr.tabledataArr = [];
          let tempTableData = res.data;
          tempTableData.forEach((element,index) => {
            this.initArr.tabledataArr.push({
              key: index,
              num: (pageNum - 1) * limitNum + index + 1,
              data2: element.data2,
              data3: element.data3,
              data4: element.data4,
              data5: element.data5,
              data6: element.data6,
              data7: element.data7,
              data8: element.data8,
              data9: element.data9,
              data10: element.data10,
              data11: element.data11,
              data12: element.data12,
            })
          });
        } else{
          this.$message.error("抱歉，获取数据失败，请刷新后重试！");
        }
      }).catch(error => {
        this.$message.error("抱歉，网络异常！");
      }).finally(end => {
        this.tableLoading = false;
      })
    },
    
    dateRangeChangeFun(value){
      /**
       * 功能：监听时间变化；当时间变化，重新加载经办人select列表
       * 参数：value:时间范围
       */
      let tempSearch = {};
      tempSearch.startDate = value[0] ? this.moment(value[0]._d).format("YYYY-MM-DD") : "";
      tempSearch.endDate = value[1] ? this.moment(value[1]._d).format("YYYY-MM-DD") : "";
      this.getAgentFun(tempSearch);   //当时间变化，重新加载经办人select列表
    },

    selectChange(value){
      //经办人选择
      this.agentId = value;
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
        this.tempSearch.personId = this.agentId;
        this.getChartData(this.tempSearch);
        this.getTableData(this.tempSearch, 1, 10);
      } else{
        this.$message.error('查询日期不能为空！')
      }
    },
    exportFun() {
      //导出操作
      if (this.initArr.tabledataArr.length === 0) {
        this.$message.error("暂无可导出的数据！");
      }
    }
    
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // this.firstChartData = { ...this.personInfoData[0] };
    // this.firstChartData.chartsType = this.chartTypeArr[0];
    
  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    const _this = this;
    setTimeout(function(){
      _this.$nextTick(() => {
        _this.$refs.charts.resizeChartsFun();
      });
    },0)
    
    window.onresize = function() {
      _this.$nextTick(() => {
        _this.$refs.charts.resizeChartsFun();
      });
    };
    _this.getAgentFun(null); //查询经办人
    _this.getChartData(null);  //图表数据渲染
    _this.getTableData(null, 1, 10);
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