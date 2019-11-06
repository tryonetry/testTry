<!-- template -->
<template>
  <div class="outer">
    <div class="searchForm">
      <a-form :form="form" class="formInputsContainer ant-row">
        <a-col :xs="{ span: 12 }" :xl="{span: 8}" :xxl="{span: 5}">
          <a-form-item
            label="查询月份"
            :label-col="defaultLayout.labelCon"
            :wrapper-col="defaultLayout.wrapperCol"
          >
            <a-range-picker class="formSearchDate" format="YYYY-MM" v-model="currDate"/>
          </a-form-item>
        </a-col>
        <a-form-item  :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="handleSubmit">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="analysisOne">
      <div class="leftAnalysis" ref="leftContainer">
        <div class="charts" id="charts" ref="chart_div"></div>
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
            ></TableView>
          </a-tab-pane>
          <a-tab-pane tab="档案借出" key="2" forceRender>
            <TableView
              :initArrData="initArr"
              :totalCount="tableTotalNum"
              :loading="tableLoading"
            ></TableView>
          </a-tab-pane>
          <a-tab-pane tab="档案转出" key="3">
            <TableView
              :initArrData="initArr"
              :totalCount="tableTotalNum"
              :loading="tableLoading"
            ></TableView>
          </a-tab-pane>
          <a-tab-pane tab="材料接收" key="4">
            <TableView
              :initArrData="initArr"
              :totalCount="tableTotalNum"
              :loading="tableLoading"
            ></TableView>
          </a-tab-pane>
          <a-tab-pane tab="材料借出" key="5">
            <TableView
              :initArrData="initArr"
              :totalCount="tableTotalNum"
              :loading="tableLoading"
            ></TableView>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import moment from "moment";
import JsonExcel from "vue-json-excel";
export default {
  name: "RecordUseStatistical",
  //import引入的组件需要注入到对象中才能使用
  components: {
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
        moment(moment().subtract(1, "month"), "YYYY-MM"),
        moment(new Date(), "YYYY-MM")
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
        noPagination: true,  //table--无分页
        formData: {
          formInputs: [],
          formBtns: []
        },
        columnsArr: [],
        tabledataArr: []
      },
      acceptColumnsArr: [
        //档案接收表头
        { title: '序号', dataIndex: 'num', key: 'num', width: 100},
        { title: "档案人名称", dataIndex: "A0101", key: "A0101", width: 150 },
        {
          title: "档案编号",
          dataIndex: "A0100A",
          key: "A0100A",
          width: 150
        },
        {
          title: "档案接收单位",
          dataIndex: "COMPANYNAME",
          key: "COMPANYNAME",
          width: 200
        },
        {
          title: "单位性质",
          dataIndex: "COMPANYNATURE",
          key: "COMPANYNATURE",
          width: 120
        },
        {
          title: "档案接收时间",
          dataIndex: "U_CREATEDATE",
          key: "U_CREATEDATE",
          width: 150
        },
        {
          title: "经办人",
          dataIndex: "USER_NAME",
          key: "USER_NAME"
        }
      ],
      lendColumnsArr: [
        //档案借出表头
        { title: '序号', dataIndex: 'num', key: 'num', width: 100},
        { title: "档案人名称", dataIndex: "CONSULT_PERSON_NAME", key: "CONSULT_PERSON_NAME", width: 150 },
        {
          title: "档案编号",
          dataIndex: "A0100A",
          key: "A0100A",
          width: 150
        },
        {
          title: "档案借阅单位",
          dataIndex: "COMPANY_ID",
          key: "COMPANY_ID",
          width: 200
        },
        {
          title: "单位性质",
          dataIndex: "COMPANY_NATURE",
          key: "COMPANY_NATURE",
          width: 120
        },
        {
          title: "档案借出时间",
          dataIndex: "BORROW_DATE",
          key: "BORROW_DATE",
          width: 150
        },
        {
          title: "经办人",
          dataIndex: "USER_NAME",
          key: "USER_NAME",
          width: 150
        }
      ],
      rolloutColumnsArr: [
        //档案转出表头
        { title: '序号', dataIndex: 'num', key: 'num', width: 100},
        { title: "档案人名称", dataIndex: "APPLY_NAME", key: "APPLY_NAME", width: 150 },
        {
          title: "档案编号",
          dataIndex: "RECORD_NUM",
          key: "RECORD_NUM",
          width: 150
        },
        {
          title: "档案转出单位",
          dataIndex: "COMPANYNAME",
          key: "COMPANYNAME",
          width: 200
        },
        {
          title: "单位性质",
          dataIndex: "COMPANYNATURE",
          key: "COMPANYNATURE",
          width: 120
        },
        {
          title: "档案转出时间",
          dataIndex: "TRANSFEROUT_DATE",
          key: "TRANSFEROUT_DATE",
          width: 150
        },
        {
          title: "经办人",
          dataIndex: "OPERATOR_NAME",
          key: "OPERATOR_NAME",
        }
      ],
      materialAcceptColumnsArr: [
        //材料接收表头
        { title: '序号', dataIndex: 'num', key: 'num', width: 100},
        { title: "材料人名称", dataIndex: "A0101", key: "A0101", width: 150 },
        { title: "档案编号", dataIndex: "A0100A", key: "A0100A", width: 200 },
        { title: "材料名称", dataIndex: "e0106", key: "e0106", width: 150 },
        { title: "材料接收单位", dataIndex: "COMPANYNAME", key: "COMPANYNAME", width: 200 },
        { title: "单位性质", dataIndex: "COMPANYNATURE", key: "COMPANYNATURE", width: 150 },
        { title: "材料接收时间", dataIndex: "uCreateDate", key: "uCreateDate", width: 150 },
        { title: "经办人", dataIndex: "uCreator", key: "uCreator" }
      ],
      materialLendColumnsArr: [
        //材料借出表头
        { title: '序号', dataIndex: 'num', key: 'num', width: 100},
        { title: "材料人名称", dataIndex: "APPLY_NAME", key: "APPLY_NAME", width: 150 },
        { title: "档案编号", dataIndex: "A0100A", key: "A0100A", width: 200 },
        { title: "材料名称", dataIndex: "e0106", key: "e0106", width: 150 },
        { title: "材料借阅单位", dataIndex: "COMPANYNAME", key: "COMPANYNAME", width: 200 },
        { title: "单位性质", dataIndex: "COMPANYNATURE", key: "COMPANYNATURE", width: 150 },
        { title: "材料借出时间", dataIndex: "BORROW_DATE", key: "BORROW_DATE", width: 150 },
        { title: "经办人", dataIndex: "BORROW_OPERATORNAME", key: "BORROW_OPERATORNAME"}
      ],
      tempBrowse: 'A',  //临时：查询表格数据为：档案接收

      
      exportFiledsJson: {
        //导出excel表：字段名对应
      },
      fieldsName:"档案利用统计分析" + this.moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),  //导出excel表名称,

      chartsDataObj:{
        xData: [],   //x轴
        arcAccept: [],  //档案接收
        arcRollOut: [],  //档案转出
        arcLend: [],    //档案借出
        mAccept:[],     //材料接收
        mLend: [],    //材料借出
      },

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
      const _this = this;
      _this.$http.fetchPost('statisticsAnalysis@archUseStatistics.action', {
        startTime: (!condition || !condition.startDate) ? '' : condition.startDate,
        endTime: (!condition || !condition.endDate) ? '' : condition.endDate
      }).then(res => {
        if(Number(res.code) === 0){
          let tempArctiveDataArr = [],
              tempMaterialArr = [];
          //清空图表数据
          for(let key in _this.chartsDataObj){
            _this.chartsDataObj[key] = [];
          }
          _this.chartsDataObj.xData = res.data.monthData;
          tempArctiveDataArr = res.data.monthBusinessChartData;
          //档案接收、借出、转出
          if(tempArctiveDataArr && tempArctiveDataArr.length > 0 ){
            tempArctiveDataArr.forEach(item => {
              if(item.name === '接收'){
                _this.chartsDataObj.arcAccept = item.data && item.data.length > 0 ? item.data : [];
              } else if(item.name === '借出'){
                _this.chartsDataObj.arcLend = item.data && item.data.length > 0 ? item.data : [];
              } else {
                _this.chartsDataObj.arcRollOut = item.data && item.data.length > 0 ? item.data : [];
              }
            });
          }

          //材料接收、借出
          tempMaterialArr = res.data.scatteredListChartData;
          if(tempMaterialArr && tempMaterialArr.length > 0 ){
            tempMaterialArr.forEach(item => {
              if(item.name === '接收'){
                _this.chartsDataObj.mAccept = item.data && item.data.length > 0 ? item.data : [];
              } else {
                _this.chartsDataObj.mLend = item.data && item.data.length > 0 ? item.data : [];
              }
            });
          }

          // console.log(_this.chartsDataObj)
          
          _this.drawChartFun(_this.chartsDataObj);
        } else{
          _this.$message.error("抱歉，获取数据失败，请刷新后重试！");
        }
      }).catch(error => {
        _this.$message.error("抱歉，网络异常！");
      });
    },
    getTableData(condition) {
      /**
       * 功能：获取数据
       */
      this.tableLoading = true;
      
      this.$http.fetchGet('statisticsAnalysis@archUseStatisticsView.action',{
        Browse: this.tempBrowse,
        startTime: (!condition || !condition.startDate) ? '' : condition.startDate,
        endTime: (!condition || !condition.endDate) ? '' : condition.endDate,
      }).then(res => {
        // console.log(res);
        if(Number(res.code) === 0){
          this.UpdateTableDataFun(this.tempBrowse, res);
        } else{
          this.$message.error("抱歉，获取数据失败，请刷新后重试！");
        }
      }).catch(error => {
        this.$message.error("抱歉，网络异常！");
      }).finally(end => {
        this.tableLoading = false;
      })
    },

    UpdateTableDataFun(tempBrowseVal, responseObj){
      /**
       * 功能：根据当前tab--类型匹配对应得数据
       */
      this.tableTotalNum = responseObj.count;
      this.initArr.tabledataArr = [];
      let tempTableData = responseObj.data;
      if(tempBrowseVal === 'A'){
        //档案接收
        tempTableData.forEach((element,index) => {
          this.initArr.tabledataArr.push({
            key: index,
            num: index + 1,
            A0101: element.A0101 ? element.A0101 : '',
            A0100A: element.A0100A ? element.A0100A : '',
            COMPANYNAME: element.COMPANYNAME ? element.COMPANYNAME : '',
            COMPANYNATURE: element.COMPANYNATURE ? element.COMPANYNATURE : '',
            U_CREATEDATE: element.U_CREATEDATE ? element.U_CREATEDATE : '',
            USER_NAME: element.USER_NAME ? element.USER_NAME : ''
          })
        });
      } else if(tempBrowseVal === 'B'){
        //档案借出
        tempTableData.forEach((element,index) => {
          this.initArr.tabledataArr.push({
            key: index,
            num: index + 1,
            CONSULT_PERSON_NAME: element.CONSULT_PERSON_NAME ? element.CONSULT_PERSON_NAME : '',
            A0100A: element.A0100A ? element.A0100A : '',
            COMPANY_ID: element.COMPANY_ID ? element.COMPANY_ID : '',
            COMPANY_NATURE: element.COMPANY_NATURE ? element.COMPANY_NATURE : '',
            BORROW_DATE: element.BORROW_DATE ? element.BORROW_DATE : '',
            USER_NAME: element.USER_NAME ? element.USER_NAME : ''
          })
        });
      } else if(tempBrowseVal === 'C'){
        //档案转出
        tempTableData.forEach((element,index) => {
          this.initArr.tabledataArr.push({
            key: index,
            num: index + 1,
            A0101: element.A0101 ? element.A0101 : '',
            A0100A: element.A0100A ? element.A0100A : '',
            e0106: element.e0106 ? element.e0106 : '',
            COMPANYNAME: element.COMPANYNAME ? element.COMPANYNAME : '',
            COMPANYNATURE: element.COMPANYNATURE ? element.COMPANYNATURE : '',
            uCreateDate: element.uCreateDate ? element.uCreateDate : '',
            uCreator: element.uCreator ? element.uCreator : ''
          })
        });
      } else if(tempBrowseVal === 'D'){
        //材料接收
        tempTableData.forEach((element,index) => {
          this.initArr.tabledataArr.push({
            key: index,
            num: index + 1,
            A0101: element.A0101 ? element.A0101 : '',
            A0100A: element.A0100A ? element.A0100A : '',
            e0106: element.e0106 ? element.e0106 : '',
            COMPANYNAME: element.COMPANYNAME ? element.COMPANYNAME : '',
            COMPANYNATURE: element.COMPANYNATURE ? element.COMPANYNATURE : '',
            uCreateDate : element.uCreateDate ? element.uCreateDate : '',
            uCreator: element.uCreator ? element.uCreator : ''
          })
        });
      } else if(tempBrowseVal === 'E'){
        //材料借出
        tempTableData.forEach((element,index) => {
          this.initArr.tabledataArr.push({
            key: index,
            num: index + 1,
            APPLY_NAME: element.APPLY_NAME ? element.APPLY_NAME : '',
            A0100A: element.A0100A ? element.A0100A : '',
            e0106: element.e0106 ? element.e0106 : '',
            COMPANYNAME: element.COMPANYNAME ? element.COMPANYNAME : '',
            COMPANYNATURE: element.COMPANYNATURE ? element.COMPANYNATURE : '',
            BORROW_DATE: element.BORROW_DATE ? element.BORROW_DATE : '',
            BORROW_OPERATORNAME: element.BORROW_OPERATORNAME ? element.BORROW_OPERATORNAME : ''
          })
        });
      }
      
    },
    
    handleSubmit(e) {
      /**
       * 功能：选择完时间：查询按钮功能
       */
      e.preventDefault();
      this.tempSearch = {};
      if (this.currDate.length > 0) {
        this.tempSearch.startDate = this.moment(this.currDate[0]._d).format("YYYY-MM");
        this.tempSearch.endDate = this.moment(this.currDate[1]._d).format("YYYY-MM");
        this.getChartData(this.tempSearch);
        this.getTableData(this.tempSearch);
      } else{
        this.$message.error('查询日期不能为空！')
      }
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
        _this.tempBrowse = 'A';
        _this.exportFiledsJson = _this.exportFiledsJsonFun(_this.acceptColumnsArr); 
        _this.fieldsName = "档案利用统计分析-档案接收" + this.moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
      } else if(currKey === '2'){
        //档案借出
        _this.initArr.columnsArr = _this.lendColumnsArr;
        _this.tempBrowse = 'B';
        _this.exportFiledsJson = _this.exportFiledsJsonFun(_this.lendColumnsArr); 
        _this.fieldsName = "档案利用统计分析-档案借出" + this.moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
      } else if(currKey === '3'){
        //档案转出
        _this.initArr.columnsArr = _this.rolloutColumnsArr;
        _this.tempBrowse = 'C';
        _this.exportFiledsJson = _this.exportFiledsJsonFun(_this.rolloutColumnsArr); 
        _this.fieldsName = "档案利用统计分析-档案转出" + this.moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
      } else if(currKey === '4'){
        //材料接收
        _this.initArr.columnsArr = _this.materialAcceptColumnsArr;
        _this.tempBrowse = 'D';
        _this.exportFiledsJson = _this.exportFiledsJsonFun(_this.materialAcceptColumnsArr); 
        _this.fieldsName = "档案利用统计分析-材料接收" + this.moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
      } else{
        //材料借出
        _this.initArr.columnsArr = _this.materialLendColumnsArr;
        _this.tempBrowse = 'E';
        _this.exportFiledsJson = _this.exportFiledsJsonFun(_this.materialLendColumnsArr); 
        _this.fieldsName = "档案利用统计分析-材料借出" + this.moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
      }
      _this.getTableData(_this.tempSearch);
    },
    exportFun() {
      //导出操作
      if (this.initArr.tabledataArr.length === 0) {
        this.$message.warning("暂无可导出的数据！");
      }
    },

    drawChartFun(chartsDataObj){
      /**
       * 功能：画图
       */
      this.$nextTick(() => {
        if (document.readyState === "complete") {
          this.$refs.chart_div.style.height =
            this.$refs.leftContainer.clientHeight - 32 + "px";
        } else {
          this.$refs.chart_div.style.height =
            this.$refs.leftContainer.clientHeight + 68 + "px";
        }
        let lineChart = this.$echarts.init(this.$refs.chart_div);
        lineChart.clear();
        lineChart.resize();
        lineChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            show:true,
          },
          grid: {
            left: "5%",
            right: "5%",
            top: '50',
            bottom: "3%",
            containLabel: true
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: chartsDataObj.xData,
              axisTick: {
                show: false
              },
              axisLabel: {
                //x轴文字显示
                interval: 0,
                rotate: chartsDataObj.xData && chartsDataObj.xData.length > 5 ? 30 : 0
              }
          },
          yAxis: {
              type: 'value',
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
                  name:'档案接收',
                  type:'line',
                  data:chartsDataObj.arcAccept,
                  smooth: true //是否平滑
              },
              {
                  name:'档案转出',
                  type:'line',
                  data:chartsDataObj.arcRollOut,
                  smooth: true //是否平滑
              },
              {
                  name:'档案借出',
                  type:'line',
                  data:chartsDataObj.arcLend,
                  smooth: true //是否平滑
              },
              {
                  name:'材料接收',
                  type:'line',
                  data:chartsDataObj.mAccept,
                  smooth: true //是否平滑
              },
              {
                  name:'材料借出',
                  type:'line',
                  data:chartsDataObj.mLend,
                  smooth: true //是否平滑
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
        })
      })
    },

    resizeChartsFun() {
      /**
       * 当窗口变化时：echarts重绘
       */
      const _this = this;
      _this.$nextTick(() => {
        if (document.readyState === "complete") {
          _this.$refs.chart_div.style.height =
            _this.$refs.leftContainer.clientHeight - 32 + "px";
        } else {
          _this.$refs.chart_div.style.height =
            _this.$refs.leftContainer.clientHeight + 68 + "px";
        }
      });
      _this.drawChartFun(_this.chartsDataObj);
    },
    exportFiledsJsonFun(dataArr){
    /**
     * 功能：根据当前table表头重组：导出excel数据--表头
     * 参数：dataArr：当前table--Column
     */
      let resultObj = {};
      dataArr.forEach(element => {
        resultObj[element.title] = element.dataIndex;
      });

      return resultObj;
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.initArr.columnsArr = this.acceptColumnsArr;
    this.exportFiledsJson = this.exportFiledsJsonFun(this.acceptColumnsArr); 

    this.tempSearch.startDate = this.moment(this.currDate[0]._d).format("YYYY-MM");
    this.tempSearch.endDate = this.moment(this.currDate[1]._d).format("YYYY-MM");
    this.getChartData(this.tempSearch); //初始化--获取图表数据
    this.getTableData(this.tempSearch); //初始化--获取表格数据

  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    const _this = this;
    setTimeout(function(){
      _this.$nextTick(() => {
        _this.resizeChartsFun();
      });                                                                 
    },0)
    window.onresize = function() {
      _this.$nextTick(() => {
        _this.resizeChartsFun();
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
  height: calc(100% - 78px - 20px);
  border: none;
}


.exportBtn {
  position: absolute;
  right: 34px;
  top: -20px;
}
</style>