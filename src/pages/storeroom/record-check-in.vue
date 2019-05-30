<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
        <a-button class="buttonOperate" @click="operateFun(1)">位置调整</a-button>
        <a-button class="buttonOperate" @click="operateFun(2)">批量分配档案位置</a-button>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <!-- <div slot="tableAction" slot-scope="slotPropsData"></div> -->
    </TableView>

    <!-- 模态框 -->
    <div class="addModal">
      <a-modal
        centered
        :title="operateStatus==1 ? '调整档案位置': '选择分配区域'"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :width="1600"
        @cancel="handleCancel"
        style="height:85%;overflow: hidden;"
      >
        <TableFromSearch :formDataArr="RecordCheckInForm"></TableFromSearch>
        <template slot="footer">
          <a-button key="cancel" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="handleOk">提交</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import TableFromSearch from "../../components/tableFormSearch";
import utils from "../../utils/util.js";
import * as http from '@/http';

function whIdTowhdAreaFun(whId){
  /***
   * 功能：通过库房查分区
   * 参数：whId:当前选择的库房的itemCode(即whId)值
   *  */
  if(whId){
    let resultArr = [];
    http.fetchPost('wareHouse@getWareHouseList.action', {
      page: 1,
      limit: 10,
    }).then(res => {
      if(Number(res.code) === 0){
        res.data.forEach(item => {
          if(item.whId == whId){
            for(let i = item.whAreaStartNum; i <= item.whAreaNum; i++){
              resultArr.push({
                'itemCode': i,
                'itemName': '第' + i + '区'
              })
            }
          }
        });
      }
    })
    console.log(resultArr);
    return { name: 'children', data: resultArr}
  } else{
    return { name: 'children', data: []}
  }
  
}

export default {
  name: "RecordCheckIn",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView, TableFromSearch },
  props: [""],

  data() {
    return {
      utils,
      tableTotalNum: 0, //总页数：默认为0
      // tableView传值方式
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: true, //table是否可以check
        // formInputs 传值方式
        formData: {
          //forminputs data
          formInputs: [
            //input
            {
              title: "存档编号",
              type: "text",
              required: false,
              placeholder: "请输入存档编号",
              key: "a0100A",
              name: "a0100A",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "a0100A",
              status: ""
            },
            {
              title: "档案状态",
              otherType: "select",
              required: false,
              placeholder: "请选择档案状态",
              key: "archiveStatus",
              name: "archiveStatus",
              val: void 0,
              children: [
                {
                  itemCode: "0",
                  itemName: "待入库"
                },
                {
                  itemCode: "1",
                  itemName: "已入库"
                },
                {
                  itemCode: "9",
                  itemName: "接收待入库"
                }
              ],
              status: ""
            },
            {
              title: "姓名",
              type: "text",
              required: false,
              placeholder: "请输入姓名",
              key: "a0101",
              name: "a0101",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "a0101",
              status: ""
            },
            {
              title: "身份证号/社保卡号",
              type: "text",
              required: false,
              placeholder: "请输入身份证号/社保卡号",
              key: "a0184",
              name: "a0184",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "a0184",
              status: ""
            },
            // select/searchSelect
            {
              title: "人员身份",
              otherType: "select",
              required: false,
              placeholder: "请选择人员身份",
              key: "archivesIdentity",
              name: "archivesIdentity",
              val: void 0,
              children: [
                {
                  itemCode: "1",
                  itemName: "干部"
                },
                {
                  itemCode: "2",
                  itemName: "工人"
                }
              ],
              status: ""
            },
            // date
            {
              title: "录入时间",
              otherType: "daterange",
              required: false,
              placeholder: "请选择录入时间",
              key: "startDate-endDate",
              name: "startDate-endDate",
              val: void 0,
              postname: "startDate-endDate",
              status: ""
              //   disabledDate: "disabledEndDate", //函数名：只能选今天和今天以前的
              //   disabledStartDate: "disabledStartDate" //函数名：只能选今天和今天以后的
            }
          ],
          // form btns
          formBtns: [
            { title: "查询", htmltype: "submit", operate: "searchForm" },
            { title: "重置", htmltype: "button", operate: "resetForm" }
          ]
        },
        //table的表头
        columnsArr: [
          {
            title: "序号",
            dataIndex: "num",
            key: "num",
            fixed: "left",
            width: 60,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "档案人姓名",
            dataIndex: "a0101",
            key: "a0101",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "性别",
            dataIndex: "a0104",
            key: "a0104",
            width: 60,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "身份证号",
            dataIndex: "a0184",
            key: "a0184",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "人员身份",
            dataIndex: "archivesIdentity",
            key: "archivesIdentity",
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "存档编号",
            dataIndex: "a0100A",
            key: "a0100A",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "库房位置",
            dataIndex: "shelvesNo",
            key: "shelvesNo",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "经办人",
            dataIndex: "inwareOperatorName",
            key: "inwareOperatorName",
            width: 120,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案交接人",
            dataIndex: "archHandover",
            key: "archHandover",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "入库时间",
            dataIndex: "inwareDate",
            key: "inwareDate",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "状态",
            dataIndex: "archiveStatusName",
            key: "archiveStatusName",
            width: 120,
            scopedSlots: { customRender: "cursorTitle" }
          }
        ],
        // table数据
        tabledataArr: []
      },
      operateStatus: null, //当前操作按钮： 1--位置调整； 2--批量分配档案位置
      visible: false, //模态框默认不显示
      confirmLoading: false, //确认加载状态 默认为false
      RecordCheckInForm: {},
      positionAdjustForm: {
        formInputs: [
          {
            title: "库房",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择库房",
            key: "whId",
            name: "whId",
            val: void 0,
            children: [],
            status: "",
            connectTo:['whdArea'], //关联到日期和性别
            connectToFun:[whIdTowhdAreaFun],
          },
          {
            title: "分区",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择分区",
            key: "whdArea",
            name: "whdArea",
            val: void 0,
            children:[],
            status: ""
          },
          {
            title: "密集架",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择密集架",
            key: "whdCode",
            name: "whdCode",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "列号",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择列号",
            key: "waColumnCode",
            name: "waColumnCode",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "层号",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择层号",
            key: "waLayerCode",
            name: "waLayerCode",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "顺序号",
            type: "text",
            required: false,
            placeholder: "请输入顺序号",
            key: "orderNo",
            name: "orderNo",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "orderNo",
            status: ""
          },
          {
            title: "档案盒数",
            type: "text",
            required: false,
            placeholder: "请输入档案盒数",
            key: "heNum",
            name: "heNum",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "heNum",
            status: ""
          },
          {
            title: "交接人",
            type: "text",
            required: false,
            placeholder: "请输入交接人",
            key: "archHandover",
            name: "archHandover",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "archHandover",
            status: ""
          }
        ]
      },
      batchAdjustFrom: {
        formInputs: [
          {
            title: "库房",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择库房",
            key: "",
            name: "",
            val: void 0,
            children: [
              {
                itemCode: "",
                itemName: ""
              }
            ],
            status: ""
          },
          {
            title: "分区",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择分区",
            key: "whdArea",
            name: "whdArea",
            val: void 0,
            children: [
              {
                itemCode: "",
                itemName: ""
              }
            ],
            status: ""
          },
          {
            title: "密集架",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择密集架",
            key: "whdCode",
            name: "whdCode",
            val: void 0,
            children: [
              {
                itemCode: "",
                itemName: ""
              }
            ],
            status: ""
          },
          {
            title: "交接人",
            type: "text",
            required: false,
            placeholder: "请输入交接人",
            key: "archHandover",
            name: "archHandover",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "archHandover",
            status: ""
          }
        ]
      },
      roomDataArr: [],   //库房信息
    };
  },

  //监听属性 类似于data概念
  computed: {
    checkTableData: function() {
      return this.$store.getters.getinfoTableCheckData;
    }
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
    getTableData(condition, pageNum, limitNum) {
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
       *         */

      this.$http
        .fetchPost("archDocument@getArchDocumentList.action", {
          page: pageNum,
          limit: limitNum,
          a0100a: (!condition || !condition.a0100a) ? "" : condition.a0100a,
          archiveStatus: (!condition || !condition.archiveStatus) ? "" : condition.archiveStatus,
          a0184: (!condition || !condition.a0184) ? "" : condition.a0184,
          a0101: (!condition || !condition.a0101) ? "" : condition.a0101,
          archivesIdentity: (!condition || !condition.archivesIdentity) ? "" : condition.archivesIdentity,
          startDate: (!condition || !condition.startDate) ? "" : condition.startDate,
          endDate: (!condition || !condition.endDate) ? "" : condition.endDate
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.tableTotalNum = res.count;
            let tempTableData = res.data;
            this.initArr.tabledataArr = [];
            tempTableData.forEach((element, index) => {
              this.initArr.tabledataArr.push({
                num: (pageNum - 1) * limitNum + index + 1,
                key: element.a01000,
                a0100a: element.a0100a,
                a0101: element.a0101,
                a0184: element.a0184,
                a0104: element.a0104 == "1" ? "男" : "女",
                archivesIdentity: element.archivesIdentity == "1" ? "干部" : "工人",
                shelvesNo: !element.shelvesNo ? "" : (element.shelvesNo.split("-")[0] + "区" + element.shelvesNo.split("-")[1] +  "排" + element.shelvesNo.split("-")[2] + "号"),
                inwareOperatorName: element.inwareOperatorName,
                inwareDate: element.inwareDate,
                archiveStatus: element.archiveStatus,
                archiveStatusName: element.archiveStatus == "0" ? "待入库" : (element.archiveStatus == "1" ? "已入库" : "接收待入库")
              });
            });
          }
        });
    },
    getOtherInfo(){
      //获取库房信息
      this.$http.fetchPost('wareHouse@getWareHouseList.action',{
        page: 1,
        limit: 10
      }).then(res => {
        if(Number(res.code) === 0){
          res.data.forEach(item => {
            this.roomDataArr.push({
              itemCode: item.whId,
              itemName: item.whName
            })
          })
        }
      })
    },
    operateFun(statusVal) {
      /***
       * 功能：调整位置：功能
       */
      this.operateStatus = statusVal;
      if (statusVal == 1) {
        //位置调整
        if (this.checkTableData.length === 1) {
          if (this.checkTableData[0].archiveStatus != "1") {
            this.$message.error("档案未入库无法进行位置调整操作	！");
          } else {
            this.getPositionForm(this.checkTableData[0].key);
          }
        } else {
          this.$message.error("请选择一条数据！");
        }
      } else {
        //批量分配档案位置
        if (this.checkTableData.length > 0) {
          let tempLen = this.isWaitInRoom(this.checkTableData);
          if (tempLen == this.checkTableData.length) {
            this.RecordCheckInForm = this.batchAdjustFrom;
            this.visible = true;
          } else {
            this.$message.error("请选择未入库的档案分配位置!");
          }
        } else {
          this.$message.error("请选择需要批量分配档案位置的记录!");
        }
      }
    },

    getPositionForm(currId){
      /**
       * 功能：根据选择的调整位置数据的id值查询数据然后填入到对应的tableformSearch里
       * 参数：currId:当前选择的table行的key(即id)值；
       */
      if(currId){
        this.$http.fetchPost('archDocument@getWareArchByArchiveId.action',{
          a01000: currId
        }).then(res => {
          if(Number(res.code) === 0){
            this.positionAdjustForm.formInputs.forEach(el => {
              if(el.key === 'whId'){
                 el.children = this.roomDataArr;
              }
            });
            
            this.RecordCheckInForm = this.utils.getNewFormSearch(res.data,this.positionAdjustForm);
            console.log(this.RecordCheckInForm);
            this.visible = true;
          }
        })
      }
    },
    isWaitInRoom(dataArr) {
      let templen = 0;
      dataArr.forEach(item => {
        if (item.archiveStatus != "1") {
          templen++;
        }
      });
      return templen;
    },

    handleCancel() {
      /***
       * 功能：模态框取消操作
       */
      this.visible = false;
    },
    handleOk() {
      /***
       * 功能：模态框提交操作
       */
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getTableData(null, 1, 10);
    this.getOtherInfo();
  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},

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