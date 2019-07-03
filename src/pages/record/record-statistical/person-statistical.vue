<!-- template -->
<template>
  <div class="outer">
    <div class="analysisOne">
      <div class="leftAnalysis">
        <RecordAnalysis :chartsData="firstChartData" ref="charts"></RecordAnalysis>
      </div>
      <div class="tableAnalysis">
        <TableView :initArrData="initArr" :totalCount="tableTotalNum" :loading="tableLoading" @searchTable="getTableData">
          <span slot="formAction">
            <JsonExcel :data="initArr.tabledataArr" :fields="exportFiledsJson" :name="fieldsName">
              <a-button type="primary" @click="exportFun">导出</a-button>
            </JsonExcel>
          </span>
        </TableView>
      </div>
    </div>
    <div class="analysisTwo">
      <div class="analysisTwoCon" v-for="(item, index) in otherChartsData" :key="index"  @click="changeClick(item.type,index , item.chartsType)">
        <RecordAnalysis :chartsData="item" ref="educharts"></RecordAnalysis>
      </div>
    </div>
  </div>
</template>

<script>
import RecordAnalysis from "@/components/recordAnalysis";
import TableView from "@/components/tableView";
import JsonExcel from "vue-json-excel";
import moment from "moment";
export default {
  name: "PersonStatistical",
  //import引入的组件需要注入到对象中才能使用
  components: {
    RecordAnalysis,
    TableView,
    JsonExcel
  },
  props: [""],

  data() {
    return {
      tableLoading: false, //table--loading
      tableTotalNum: 0,
      initArr:{
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check,
        bordered: true,  //table--边框
        superimposeWidth: true,
        formData:{
          formInputs:[],
          formBtns:[],
        },
        columnsArr:[],
        tabledataArr: [],
      },
      ageColumns: [
        //年龄段分析表头
        {
          title: "所属机构",
          dataIndex: "organ",
          key: "organ",
          fixed:'left',
          width: 200
        },
        {
          title: "18-25周岁",
          width: 200,
          children: [
            { title: "男", dataIndex: "mail1", key: "mail1", width: 100 },
            { title: "女", dataIndex: "femail1", key: "femail1", width: 100 }
          ]
        },
        {
          title: "26-35周岁",
          width: 200,
          children: [
            { title: "男", dataIndex: "mail2", key: "mail2", width: 100 },
            { title: "女", dataIndex: "femail2", key: "femail2", width: 100 }
          ]
        },
        {
          title: "36-45周岁",
          width: 200,
          children: [
            { title: "男", dataIndex: "mail3", key: "mail3", width: 100 },
            { title: "女", dataIndex: "femail3", key: "femail3", width: 100 }
          ]
        },
        {
          title: "46-60周岁",
          width: 200,
          children: [
            { title: "男", dataIndex: "mail4", key: "mail4", width: 100 },
            { title: "女", dataIndex: "femail4", key: "femail4", width: 100 }
          ]
        },
        {
          title: "60周岁以上",
          // width: 200,
          children: [
            { title: "男", dataIndex: "mail5", key: "mail5" },
            { title: "女", dataIndex: "femail5", key: "femail5" }
          ]
        },
        {
          title: "总计",
          dataIndex: "total",
          key: "total",
          fixed: 'right',
          width: 200
        }
      ],
      eduColumns: [
        //学历分析表头
        {
          title: "所属机构",
          dataIndex: "",
          key: "",
          // fixed: "left",
          // width: "10%"
        },
        {
          title: "博士研究生",
          children: [
            { title: "男", dataIndex: "doctorMale", key: "doctorMale"},
            { title: "女", dataIndex: "doctorFemale", key: "doctorFemale"}
          ]
        },
        {
          title: "硕士研究生",
          children: [
            { title: "男", dataIndex: "masterMale", key: "masterMale" },
            { title: "女", dataIndex: "masterFemale", key: "masterFemale"}
          ]
        },
        {
          title: "大学本科",
          children: [
            { title: "男", dataIndex: "universityMale", key: "universityMale" },
            {
              title: "女",
              dataIndex: "universityFemale",
              key: "universityFemale"
            }
          ]
        },
        {
          title: "大学专科",
          children: [
            { title: "男", dataIndex: "specializeMale", key: "specializeMale"},
            {
              title: "女",
              dataIndex: "specializeFemale",
              key: "specializeFemale"
            }
          ]
        },
        {
          title: "中等专科",
          children: [
            { title: "男", dataIndex: "middleSpeMale", key: "middleSpeMale"},
            {
              title: "女",
              dataIndex: "middleSpeFemale",
              key: "middleSpeFemale"
            }
          ]
        },
        {
          title: "职业高中",
          children: [
            { title: "男", dataIndex: "speHighMale", key: "speHighMale"},
            { title: "女", dataIndex: "speHighFemale", key: "speHighFemale"}
          ]
        },
        {
          title: "技工学校",
          children: [
            { title: "男", dataIndex: "mechanicMale", key: "mechanicMale"},
            { title: "女", dataIndex: "mechanicFemale", key: "mechanicFemale"}
          ]
        },
        {
          title: "普通高中",
          children: [
            { title: "男", dataIndex: "highMale", key: "highMale"},
            { title: "女", dataIndex: "highFemale", key: "highFemale"}
          ]
        },
        {
          title: "初中",
          children: [
            { title: "男", dataIndex: "juniorMale", key: "juniorMale" },
            { title: "女", dataIndex: "juniorFemale", key: "juniorFemale" }
          ]
        },
        {
          title: "小学",
          children: [
            { title: "男", dataIndex: "primaryMale", key: "primaryMale"},
            { title: "女", dataIndex: "primaryFemale", key: "primaryFemale"}
          ]
        },
        {
          title: "其他",
          children: [
            { title: "男", dataIndex: "otherMale", key: "otherMale"},
            { title: "女", dataIndex: "otherFemale", key: "otherFemale"}
          ]
        },
        { title: "总计", dataIndex: "total", key: "total"}
      ],
      professionColumns:[
        //专业技术资格分析
        {
          title: "所属机构",
          dataIndex: "organ",
          key: "organ",
          fixed: "left",
          width: "200"
        },
        {
          title: '高级',
          children: [
            { title: '男', dataIndex: 'highMale', key: 'highMale', width: 100},
            { title: '女', dataIndex: 'highFemale', key: 'highFemale', width: 100},
          ]
        },
        {
          title: '中级',
          children: [
            { title: '男', dataIndex: 'midMale', key: 'midMale', width: 100},
            { title: '女', dataIndex: 'midFemale', key: 'midFemale', width: 100},
          ]
        },
        {
          title: '初级',
          children: [
            { title: '男', dataIndex: 'primaryMale', key: 'primaryMale', width: 100},
            { title: '女', dataIndex: 'primaryFemale', key: 'primaryFemale', width: 100},
          ]
        },
        { title: "总计", dataIndex: "total", key: "total", fixed: 'right', width:150 }
      ],
      nationaColumns:[
        //民族分析
        { title: '民族', dataIndex: 'national', key: 'national'},
        { title: "总计", dataIndex: "total", key: "total" }
      ],
      politicalColumns:[
        //政治面貌分析
        {
          title: '中共党员',
          children:[
            { title: '男', dataIndex: 'partyMale', key: 'partyMale'},
            { title: '女', dataIndex: 'partyFemale', key: 'partyFemale'},
          ]
        },
        {
          title: '中共预备党员',
          children:[
            { title: '男', dataIndex: 'prepareMale', key: 'prepareMale'},
            { title: '女', dataIndex: 'prepareFemale', key: 'prepareFemale'},
          ]
        },
        {
          title: '共青团员',
          children:[
            { title: '男', dataIndex: 'leagueMale', key: 'leagueMale'},
            { title: '女', dataIndex: 'leagueFemale', key: 'leagueFemale'},
          ]
        },
        {
          title: '群众',
          children:[
            { title: '男', dataIndex: 'crowdMale', key: 'crowdMale'},
            { title: '女', dataIndex: 'crowdFemale', key: 'crowdFemale'},
          ]
        },
        {
          title: '其他',
          children:[
            { title: '男', dataIndex: 'otherMale', key: 'otherMale'},
            { title: '女', dataIndex: 'otherFemale', key: 'otherFemale'},
          ]
        },
        { title: "总计", dataIndex: "total", key: "total" }
      ],
      tableData: [], //table数据

      personInfoData: [
        {
          type: 1,
          isSelectType: true,
          cardTitle: '年龄段分析',
          title: "年龄段分析",
          data: [
            { name: "18-25周岁", value: "2" },
            { name: "26-35周岁", value: "23" },
            { name: "36-45周岁", value: "35" },
            { name: "46-60周岁", value: "12" },
            { name: "60周岁以上", value: "6" }
          ]
        },
        {
          type: 2,
          isSelectType: false,
          cardTitle: '学历分析',
          title: "学历分析",
          data: [
            { name: "博士研究生", value: "2" },
            { name: "硕士研究生", value: "1" },
            { name: "大学本科", value: "30" },
            { name: "大学专科", value: "2" },
            { name: "技工学校", value: "1" }
          ]
        },
        {
          type: 3,
          isSelectType: false,
          cardTitle: '专业做技术资格分析(按人次)',
          title: "专业做技术资格分析",
          data: [
            { name: "高级", value: "30" },
            { name: "中级", value: "7" },
            { name: "初级", value: "3" }
          ]
        },
        {
          type: 4,
          isSelectType: false,
          cardTitle: '民族分析',
          title: "民族分析",
          data: [
            { name: "汉族", value: "25" },
            { name: "傣族", value: "7" },
            { name: "蒙古族", value: "3" },
            { name: "维吾尔族", value: "13" },
            { name: "回族", value: "15" },
            { name: "满族", value: "8" },
            { name: "傣族", value: "1" }
          ]
        },
        {
          type: 5,
          cardTitle: '政治面貌分析',
          title: "政治面貌分析",
          isSelectType: false,
          data: [
            { name: "中共党员", value: "30" },
            { name: "中共预备党员", value: "7" },
            { name: "共青团员", value: "2" },
            { name: "群众", value: "13" },
            { name: "其他", value: "8" }
          ]
        }
      ],
      firstChartData: null, //第一个图表渲染数据
      otherChartsData: [], //其他图表
      chartTypeArr: ["bar", "line", "radar", "pie"], //chart图表类型
      selectChartType: 'bar',

      exportFiledsJson:{
      },
      fieldsName:"工作量统计分析" + moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),  //导出excel表名称
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
    getChartData(){
      /**
       * 获取渲染图表的数据
       */
      // this.$http.fetchPost('statisticsAnalysis@archInfoStatistics.action').then(res => {
      //   console.log(res);
      // }).catch(error => {
      //   this.$message.error('抱歉，网络异常！');
      // })
    },

    getTableData(typeVal){
      const _this = this;
      // _this.tableLoading = true;
      if(typeVal === 1){
        //年龄段分析
        _this.initArr.columnsArr = _this.ageColumns;
      } else if(typeVal === 2){
        //学历分析
        _this.initArr.columnsArr = _this.eduColumns;
      } else if(typeVal === 3){
        //专业做技术资格分析
        _this.initArr.columnsArr = _this.professionColumns;
      } else if(typeVal === 4){
        //民族分析
        _this.initArr.columnsArr = _this.nationaColumns;
      } else{
        //政治面貌分析
        _this.initArr.columnsArr = _this.politicalColumns;
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

    changeClick(currType,i, chartTypeVal) {
      /**
       * 功能：下面排列得点击函数， 点击：把当前点击在上面展示，原来在上面展示得在下面展示
       * 参数：currType:当前点击的统计分析类型; i:当前数据index; chartTypeVal:当前点击chart类型
       */
      let temp = this.firstChartData, 
      tempIndex = 0,
      clickType = '';
      temp.isSelectType = false;
      this.otherChartsData.forEach((el, index) => {
        if (el.type === currType) {
          el.isSelectType = true;
          this.firstChartData = Object.assign({ ...el},{chartsType:temp.chartsType});
          tempIndex = index;
          clickType = el.chartsType;
        }
      });
      this.otherChartsData.splice(tempIndex, 1, Object.assign({...temp},{chartsType:clickType}));
      // render
      
      this.$refs.charts.getChartsData(this.firstChartData, this.$refs.charts.returnChangeSelect());

      this.otherChartsData.forEach((item,index) => {
        if(index === i){
           this.$refs.educharts[index].getChartsData(item, item.chartsType);
        }
      });
      this.getTableData(currType);
    },
    exportFun(){
      //导出操作
      if (this.initArr.tabledataArr.length === 0) {
        this.$message.warning("暂无可导出的数据！");
      }
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getChartData();
    this.firstChartData = { ...this.personInfoData[0] };   //默认给的是年龄段
    this.firstChartData.chartsType = this.chartTypeArr[0];
    this.initArr.columnsArr = [...this.ageColumns];    //默认年龄段表头
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
    this.otherChartsDataFun(this.personInfoData)
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

</style>