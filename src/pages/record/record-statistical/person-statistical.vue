<!-- template -->
<template>
  <div class="outer">
    <div class="analysisOne">
      <div class="leftAnalysis">
        <RecordAnalysis :chartsData="firstChartData" ref="charts"></RecordAnalysis>
      </div>
      <div class="tableAnalysis">
        <TableView :initArrData="initArr" :totalCount="tableTotalNum" :loading="tableLoading" ref="infoStaticsTable">
          <span slot="formAction">
            <a :href="exportUrl" :download="exportFileName" data-type="下载" class="primaryBtnColor">导出</a>
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
const renderContent = (value, row, index, colSpan, data) => {
  //表格列--根据当前传的colspan值重新render；
  if(index === data.length - 1 && data.length > 1 ){
      return{
        children: value,
        attrs: {
          colSpan: colSpan,
        },
      }
  } else{
    return  value;
  }
};

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
        noPagination: true,  //table--无分页
        formData:{
          formInputs:[],
          formBtns:[],
        },
        columnsArr:[],
        tabledataArr: [],
      },
      ageColumns: [
        //年龄段分析表头
        { title: '序号', dataIndex: 'num', key: 'num', fixed: 'left' ,width: 100,
          customRender: (text, row, index) => {
            return renderContent(text, row, index, 2, this.initArr.tabledataArr);
          }
        },
        {
          title: "所属机构",
          dataIndex: "data1",
          key: "data1",
          fixed:'left',
          width: 200,
          customRender: (text, row, index) => {
            return renderContent(text, row, index, 0, this.initArr.tabledataArr);
          }
        },
        {
          title: "18-25周岁",
          width: 200,
          children: [
            { title: "男", dataIndex: "data2", key: "data2", width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: "女", dataIndex: "data3", key: "data3", width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ],
          
        },
        {
          title: "26-35周岁",
          width: 200,
          children: [
            { title: "男", dataIndex: "data4", key: "data4", width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: "女", dataIndex: "data5", key: "data5", width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ],
        },
        {
          title: "36-45周岁",
          width: 200,
          children: [
            { title: "男", dataIndex: "data6", key: "data6", width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: "女", dataIndex: "data7", key: "data7", width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ],
        },
        {
          title: "46-60周岁",
          width: 200,
          children: [
            { title: "男", dataIndex: "data8", key: "data8", width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: "女", dataIndex: "data9", key: "data9", width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ],
        },
        {
          title: "60周岁以上",
          children: [
            { title: "男", dataIndex: "data10", key: "data10",
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: "女", dataIndex: "data11", key: "data11",
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ],
        },
        {
          title: "总计",
          dataIndex: "sum1",
          key: "sum1",
          fixed: 'right',
          width: 150,
        }
      ],
      eduColumns: [
        //学历分析表头
        { title: '序号', dataIndex: 'num', key: 'num', fixed: 'left' ,width: 100,
          customRender: (text, row, index) => {
            return renderContent(text, row, index, 2, this.initArr.tabledataArr);
          }
        },
        {
          title: "所属机构",
          dataIndex: "data1",
          key: "data1",
          fixed: "left",
          width: 200,
          customRender: (text, row, index) => {
            return renderContent(text, row, index, 0, this.initArr.tabledataArr);
          }
        },
        {
          title: "博士研究生",
          width: 140,
          children: [
            { title: "男", dataIndex: "data2", key: "data2", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: "女", dataIndex: "data3", key: "data3", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ]
        },
        {
          title: "硕士研究生",
          width: 140,
          children: [
            { title: "男", dataIndex: "data4", key: "data4", width: 70, 
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: "女", dataIndex: "data5", key: "data5", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ]
        },
        {
          title: "大学本科",
          width: 140,
          children: [
            { title: "男", dataIndex: "data6", key: "data6", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            {
              title: "女",
              dataIndex: "data7",
              key: "data7", 
              width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ]
        },
        {
          title: "大学专科",
          width: 140,
          children: [
            { title: "男", dataIndex: "data8", key: "data8", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            {
              title: "女",
              dataIndex: "data9",
              key: "data9", 
              width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ]
        },
        {
          title: "中等专科",
          width: 140,
          children: [
            { title: "男", dataIndex: "data10", key: "data10", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            {
              title: "女",
              dataIndex: "data11",
              key: "data11", 
              width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ]
        },
        {
          title: "职业高中",
          width: 140,
          children: [
            { title: "男", dataIndex: "data12", key: "data12", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: "女", dataIndex: "data13", key: "data13", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ]
        },
        {
          title: "技工学校",
          width: 140,
          children: [
            { title: "男", dataIndex: "data14", key: "data14", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: "女", dataIndex: "data15", key: "data15", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ]
        },
        {
          title: "普通高中",
          width: 140,
          children: [
            { title: "男", dataIndex: "data16", key: "data16", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: "女", dataIndex: "data17", key: "data17", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ]
        },
        {
          title: "初中",
          width: 140,
          children: [
            { title: "男", dataIndex: "data18", key: "data18", width: 70, 
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: "女", dataIndex: "data19", key: "data19", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ]
        },
        {
          title: "小学",
          width: 140,
          children: [
            { title: "男", dataIndex: "data20", key: "data20", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: "女", dataIndex: "data21", key: "data21", width: 70,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ]
        },
        {
          title: "其他",
          children: [
            { title: "男", dataIndex: "data22", key: "data22",
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: "女", dataIndex: "data23", key: "data23",
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            }
          ]
        },
        { title: "总计", dataIndex: "sum14", key: "sum14", fixed: 'right', width: 150}
      ],
      professionColumns:[
        //专业技术资格分析
        { title: '序号', dataIndex: 'num', key: 'num', fixed: 'left' ,width: 100,
          customRender: (text, row, index) => {
            return renderContent(text, row, index, 2, this.initArr.tabledataArr);
          }
        },
        {
          title: "所属机构",
          dataIndex: "data7",
          key: "data7",
          fixed: "left",
          width: 200,
          customRender: (text, row, index) => {
            return renderContent(text, row, index, 0, this.initArr.tabledataArr);
          }
        },
        {
          title: '高级',
          width: 200,
          children: [
            { title: '男', dataIndex: 'data1', key: 'data1', width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: '女', dataIndex: 'data2', key: 'data2', width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            },
          ]
        },
        {
          title: '中级',
          width: 200,
          children: [
            { title: '男', dataIndex: 'data3', key: 'data3', width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: '女', dataIndex: 'data4', key: 'data4', width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            },
          ]
        },
        {
          title: '初级',
          children: [
            { title: '男', dataIndex: 'data5', key: 'data5',
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: '女', dataIndex: 'data6', key: 'data6',
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            },
          ]
        },
        { title: "总计", dataIndex: "sum14", key: "sum14", fixed: 'right', width:150 }
      ],
      nationaColumns:[
        //民族分析
        { title: '序号', dataIndex: 'num', key: 'num', width: 150,
          customRender: (text, row, index) => {
            return renderContent(text, row, index, 2, this.initArr.tabledataArr);
          }
        },
        { title: '民族', dataIndex: 'data1', key: 'data1', width: 300,
          customRender: (text, row, index) => {
            return renderContent(text, row, index, 0, this.initArr.tabledataArr);
          }
        },
        { title: "总计", dataIndex: "data2", key: "data2"}
      ],
      politicalColumns:[
        //政治面貌分析
        { title: '序号', dataIndex: 'num', key: 'num', fixed: 'left' ,width: 100},
        {
          title: '中共党员',
          width: 200,
          children:[
            { title: '男', dataIndex: 'data1', key: 'data1', width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: '女', dataIndex: 'data2', key: 'data2', width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            },
          ]
        },
        {
          title: '中共预备党员',
          width: 200,
          children:[
            { title: '男', dataIndex: 'data3', key: 'data3', width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: '女', dataIndex: 'data4', key: 'data4', width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            },
          ]
        },
        {
          title: '共青团员',
          width: 200,
          children:[
            { title: '男', dataIndex: 'data5', key: 'data5', width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: '女', dataIndex: 'data6', key: 'data6', width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            },
          ]
        },
        {
          title: '群众',
          width: 200,
          children:[
            { title: '男', dataIndex: 'data7', key: 'data7', width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: '女', dataIndex: 'data8', key: 'data8', width: 100,
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            },
          ]
        },
        {
          title: '其他',
          children:[
            { title: '男', dataIndex: 'data9', key: 'data9',
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 2, this.initArr.tabledataArr);
              }
            },
            { title: '女', dataIndex: 'data10', key: 'data10',
              customRender: (text, row, index) => {
                return renderContent(text, row, index, 0, this.initArr.tabledataArr);
              }
            },
          ]
        },
        { title: "总计", dataIndex: "sum0", key: "sum0", fixed:'right', width: 150 }
      ],
      tableData: [], //table数据

      personInfoData: [
        {
          type: 1,
          isSelectType: true,
          cardTitle: '年龄段分析(按人次)',
          title: "年龄段分析",
          data: []
        },
        {
          type: 2,
          isSelectType: false,
          cardTitle: '学历分析(按人次)',
          title: "学历分析",
          data: []
        },
        {
          type: 3,
          isSelectType: false,
          cardTitle: '专业做技术资格分析(按人次)',
          title: "专业做技术资格分析",
          data: []
        },
        {
          type: 4,
          isSelectType: false,
          cardTitle: '民族分析(按人次)',
          title: "民族分析",
          data: []
        },
        {
          type: 5,
          cardTitle: '政治面貌分析(按人次)',
          title: "政治面貌分析",
          isSelectType: false,
          data: []
        }
      ],
      firstChartData: null, //第一个图表渲染数据
      otherChartsData: [], //其他图表
      chartTypeArr: ["bar", "line", "radar", "pie"], //chart图表类型
      selectChartType: 'bar',

      exportUrl: '',
      exportFileName: ''
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
      this.$http.fetchPost('statisticsAnalysis@archInfoStatistics.action').then(res => {
        if(Number(res.code) === 0){
          let tempResData = res.data;
          this.personInfoData.forEach(element => {
            if(Number(element.type) === 1){
              //年龄段分析
              element.data = tempResData.ageChartData;
            } else if(Number(element.type) === 2){
              //学历分析
              element.data = tempResData.degreeChartData;
            } else if(Number(element.type) === 3){
              //专业做技术资格分析
              element.data = tempResData.titleChartData;
            } else if(Number(element.type) === 4){
              //民族分析
              element.data = tempResData.ethnicChartData;
            } else if(Number(element.type) === 5){
              //政治面貌分析
              element.data = tempResData.PoliticalStatusData;
            }
          });
          this.firstChartData = { ...this.personInfoData[0] };   //默认给的是年龄段
          this.firstChartData.chartsType = this.$refs.charts.returnChangeSelect();  //默认选择得图表--绘制类型bar
        } else{
          this.$message.error("抱歉，获取数据失败，请刷新后重试！");
        }
      }).catch(error => {
        this.$message.error('抱歉，网络异常！');
      })
    },

    getTableColumnData(typeVal){
      /**
       * 功能：根据当前点击得charts---判断table--表头
       * 参数：typeVal: 当前点击得charts--类型
       */
      const _this = this;
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
      _this.getTableData(typeVal);
    },

    getTableData(currVal){
      this.tableLoading = true;
      this.$http.fetchPost('statisticsAnalysis@getAnalysisdata.action', {
        cktype: this.returnTypeFun(currVal)
      }).then(res => {
        if(Number(res.code) === 0){
          this.initArr.tabledataArr =  this.UpdateTableDataFun(currVal, res);
          this.$refs.infoStaticsTable.tableBodyRize();
          this.exportFun(currVal);
        } else{
          this.$message.error("抱歉，获取数据失败，请刷新后重试！");
        }
      }).catch(error => {
        this.$message.error('抱歉，网络异常！');
      }).finally(end => {
        this.tableLoading = false;
      })
    },
    

    UpdateTableDataFun(currVal, responseObj){
      if(responseObj.data.length > 0){
        let resultTableDataArr = [],
          tempTableData = responseObj.data;
        if(Number(currVal) === 1){
          //年龄段分析
          let totalRowObj = {
            data1:0,
            data2: 0,
            data3: 0,
            data4: 0,
            data5: 0,
            data6: 0,
          };
          tempTableData.forEach((element, index) => {
            resultTableDataArr.push({
              key: index,
              num: index + 1,
              data1: element.data1 ? element.data1 : '',
              data2: element.data2 ? element.data2 : '',
              data3: element.data3 ? element.data3 : '',
              data4: element.data4 ? element.data4 : '',
              data5: element.data5 ? element.data5 : '',
              data6: element.data6 ? element.data6 : '',
              data7: element.data7 ? element.data7 : '',
              data8: element.data8 ? element.data8 : '',
              data9: element.data9 ? element.data9 : '',
              data10: element.data10 ? element.data10 : '',
              data11: element.data11 ? element.data11 : '',
              sum1: element.sum1 ? element.sum1 : ''
            })
            for(let i = 1; i <= 5; i++){
              totalRowObj['data' + i] += Number(element['data' + (i*2)]) + Number(element['data' + (i*2+1) ]);
            }
            totalRowObj.data6 += Number(element.sum1);
          });
          resultTableDataArr.push({
            key: resultTableDataArr.length,
            num: '合计',
            data1: '',
            data2: totalRowObj.data1,
            data3: '',
            data4:totalRowObj.data2,
            data5: '',
            data6: totalRowObj.data3,
            data7: '',
            data8: totalRowObj.data4,
            data9: '',
            data10: totalRowObj.data5 ,
            data11: '',
            sum1: totalRowObj.data6
          });
        } else if(Number(currVal) === 2){
          //学历分析
          let totalRowObj = {
            data1:0,
            data2: 0,
            data3: 0,
            data4: 0,
            data5: 0,
            data6: 0,
            data7: 0,
            data8: 0,
            data9: 0,
            data10: 0,
            data11: 0,
            data12: 0
          }
          tempTableData.forEach((element, index) => {
            resultTableDataArr.push({
              key: index,
              num: index + 1,
              data1: element.data1 ? element.data1 : '',
              data2: element.data2 ? element.data2 : '',
              data3: element.data3 ? element.data3 : '',
              data4: element.data4 ? element.data4 : '',
              data5: element.data5 ? element.data5 : '',
              data6: element.data6 ? element.data6 : '',
              data7: element.data7 ? element.data7 : '',
              data8: element.data8 ? element.data8 : '',
              data9: element.data9 ? element.data9 : '',
              data10: element.data10 ? element.data10 : '',
              data11: element.data11 ? element.data11 : '',
              data12: element.data12 ? element.data12 : '',
              data13: element.data13 ? element.data13 : '',
              data14: element.data14 ? element.data14 : '',
              data15: element.data15 ? element.data15 : '',
              data16: element.data16 ? element.data16 : '',
              data17: element.data17 ? element.data17 : '',
              data18: element.data18 ? element.data18 : '',
              data19: element.data19 ? element.data19 : '',
              data20: element.data20 ? element.data20 : '',
              data21: element.data21 ? element.data21 : '',
              data22: element.data22 ? element.data22 : '',
              data23: element.data23 ? element.data23 : '',
              sum14: element.sum14 ? element.sum14 : ''
            })
            for(let i = 1; i <= 11; i++){
              totalRowObj['data'+ i]  = Number(element['data' + (i * 2)]) + Number(element['data' + (i * 2 + 1)]);
            }
            totalRowObj.data12 += Number(element.sum14);
          });
          resultTableDataArr.push({
            key: resultTableDataArr.length,
            num: '合计',
            data1: '',
            data2: totalRowObj.data1,
            data3: '',
            data4: totalRowObj.data2,
            data5: '',
            data6: totalRowObj.data3,
            data7: '',
            data8: totalRowObj.data4,
            data9: '',
            data10: totalRowObj.data5,
            data11: '',
            data12: totalRowObj.data6,
            data13: '',
            data14: totalRowObj.data7,
            data15: '',
            data16: totalRowObj.data8,
            data17: '',
            data18: totalRowObj.data9,
            data19: '',
            data20: totalRowObj.data10,
            data21: '',
            data22: totalRowObj.data11,
            data23: '',
            sum14:totalRowObj.data12
          })
        } else if(Number(currVal) === 3){
          //专业做技术资格分析
          let totalRowObj ={
            data1: 0,
            data2: 0,
            data3: 0,
            data4: 0
          }
          tempTableData.forEach((element, index) => {
            resultTableDataArr.push({
              key: index,
              num: index + 1,
              data1: element.data1 ? element.data1 : '',
              data2: element.data2 ? element.data2 : '',
              data3: element.data3 ? element.data3 : '',
              data4: element.data4 ? element.data4 : '',
              data5: element.data5 ? element.data5 : '',
              data6: element.data6 ? element.data6 : '',
              data7: element.data7 ? element.data7 : '',
              sum14: element.sum14 ? element.sum14 : ''
            })
            for(let i = 1; i <= 3; i++){
              totalRowObj['data' + i] += Number(element['data' + (i*2 - 1)]) + Number(element['data' + (i * 2)]);
            }
            totalRowObj.data4 += Number(element.sum14);
          });
          resultTableDataArr.push({
            key: resultTableDataArr.length,
            num: '合计',
            data1: totalRowObj.data1,
            data2: '',
            data3: totalRowObj.data2,
            data4: '',
            data5: totalRowObj.data3,
            data6: '',
            data7: '',
            sum14: totalRowObj.data4
          })
        } 
        else if(Number(currVal) === 4){
          //民族分析
          let totalRowObj = {
            data1: 0
          }
          tempTableData.forEach((element, index) => {
            resultTableDataArr.push({
              key: index,
              num: index + 1,
              data1: element.data1 ? element.data1 : '',
              data2: element.data2 ? element.data2 : ''
            })
            totalRowObj.data1 += Number(element.data2);
          });
          resultTableDataArr.push({
            key: resultTableDataArr.length, 
            num: '合计',
            data1: '',
            data2: totalRowObj.data1
          })
        } else{
          //政治面貌分析
          let totalRowObj ={
            data1: 0,
            data2: 0,
            data3: 0,
            data4: 0,
            data5: 0,
            data6: 0
          }
          tempTableData.forEach((element, index) => {
            resultTableDataArr.push({
              key: index,
              num: index + 1,
              data1: element.data1 ? element.data1 : '',
              data2: element.data2 ? element.data2 : '',
              data3: element.data3 ? element.data3 : '',
              data4: element.data4 ? element.data4 : '',
              data5: element.data5 ? element.data5 : '',
              data6: element.data6 ? element.data6 : '',
              data7: element.data7 ? element.data7 : '',
              data8: element.data8 ? element.data8 : '',
              data9: element.data9 ? element.data9 : '',
              data10: element.data10 ? element.data10 : '',
              sum0: element.sum0 ? element.sum0 : ''
            })
            for(let i = 1; i <= 5; i++){
              totalRowObj['data' + i] += Number(element['data' + (i*2 - 1)]) + Number(element['data' + (i * 2)]);
            }
            totalRowObj.data6 += Number(element.sum0);
          });
          resultTableDataArr.push({
            key: resultTableDataArr.length,
            num: '合计',
            data1: totalRowObj.data1,
            data2: '',
            data3: totalRowObj.data2,
            data4: '',
            data5: totalRowObj.data3,
            data6: '',
            data7: totalRowObj.data4,
            data8: '',
            data9: totalRowObj.data5,
            data10: '',
            sum0: totalRowObj.data6
          })
        }
        return resultTableDataArr;
      } else{
        return [];
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
          this.firstChartData = Object.assign({ ...el},{chartsType: this.$refs.charts.returnChangeSelect()});
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
      this.getTableColumnData(currType);
    },
    
    // exportFiledsJsonFun(dataArr){
    //   /**
    //    * 功能：根据当前table表头重组：导出excel数据--表头
    //    * 参数：dataArr：当前table--Column
    //    */
    //   let resultObj = {};
    //   dataArr.forEach(element => {
    //     if(element.dataIndex){
    //       resultObj[element.title] = element.dataIndex;
    //     }else{
    //       element.children.forEach(item => {
    //         resultObj[element.title + item.title ] = item.dataIndex;
    //       });
    //     }
    //   });
    //   return resultObj;
    // },

    exportFun(currVal){
      //导出操作
      if (this.initArr.tabledataArr.length === 0) {
        this.$message.warning("暂无可导出的数据！");
      } else{
        this.$http.fetchPost('statisticsAnalysis@getAnalysisdata.action', {
          cktype: this.returnTypeFun(currVal),
          exportfile: this.returnTypeFun(currVal) + 'Excel'
        }).then(res => {
          if(Number(res.code) === 0){
            if(res.data.path){
              this.exportUrl = this.$targetHost + res.data.path.substr(3);
              this.exportFileName = res.data.path.substr(16);
            } 
          } else{
            this.$message.warning('抱歉，导出失败，请刷新后重试！');
          }
        }).catch(err => {
          this.$message.error('抱歉，网络异常！');
        })
      }
    },
    returnTypeFun(currVal){
      /**
       * 功能：根据传的type类型，返回对应type的name值
       * currVal: 当前type值
       */
      return Number(currVal) === 1 ? 'age' : (Number(currVal) === 2 ? 'degree' : (Number(currVal) === 3 ? 'major': (Number(currVal) === 4 ? 'ethnic': 'PoliticalStatus')))
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getChartData(); //图表数据
    this.getTableData(1); //table数据--默认为年龄
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