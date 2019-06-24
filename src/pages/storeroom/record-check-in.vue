<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" :loading="tableLoading" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
        <a-button class="buttonOperate" @click="operateFun(null, 1)">位置调整</a-button>
        <a-button class="buttonOperate" @click="operateFun(null, 2)">批量分配档案位置</a-button>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          v-if="slotPropsData.currRowdata.archiveStatus != 1"
          class="primaryBtnColor"
          href="javascript:;"
          @click="operateFun(currentData=slotPropsData.currRowdata, 3)"
          data-type="档案入库"
        >档案入库</a>
      </div>
    </TableView>

    <!-- 模态框 -->
    <div class="addModal">
      <a-modal
        centered
        :title="operateStatus==1 ? '调整档案位置': '选择分配区域'"
        :visible="visible"
        :confirmLoading="confirmLoading"
        width="80%"
        @cancel="handleCancel"
        :maskClosable="false"
        style="height:85%;overflow: hidden;"
      >
        <div style="height:100%;overflow:auto;">
          <TableFromSearch :formDataArr="RecordCheckInForm" ref="recordCheckInForm" :getCapacityDataFun='getCapacityData'>
            <div class="capacityDiv" slot='otherForm'>
              空闲容量:{{freeCapacity}}， 总容量:{{totalCapacity}}
            </div>
          </TableFromSearch>
        </div>
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

function whIdTowhdAreaFun(whId){
  /***
   * 功能：通过库房查分区
   * 参数：whId:当前选择的库房的itemCode(即whId)值
   *  */
  if(whId){
    return [{name: 'children', data: whId, operate: 'whIdTowhdArea'}]
  } else{
    return [{name: 'children', data: []}]
  }
}

function whdAreaTowhdCodeFun(whdArea){
  /**
   * 功能：通过分区查密集架
   * 参数：whdArea：当前选择的分区itemCode值
   */
  if(whdArea){
    return [{name: 'children', data: whdArea,operate: 'whdAreaTowhdCode'}]
  } else{
    return [{name: 'children', data: []}]
  }
}

function whdCodeTowanCodeFun(whdCode){
  /**
   * 功能：通过密集架找列号和层号
   * 参数：whdCode：当前选择的密集架itemCode
   */
  if(whdCode){
    return [{name: 'children', data: whdCode, operate: 'whdCodeTowanCode'}]
  } else{
    return [{name: 'children', data: []}]
  }
}

function waLayerCodeToOrderNoFun(layerNum){
  /**
   * 功能:当选择层完后；根据选择的库房，分区，密集架，列号http获取顺序号
   * 参数：columnsNum：当前选择的列
   */
  if(layerNum){
    return [{name: 'val', data: layerNum, operate: 'waLayerCodeToOrderNo'}]
  } else{
    return [{name: 'val', data: void 0}, {name: 'disabled', data:true}]
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
      tableLoading: false,  //table loading
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
              children: [],
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
              val: [void 0, void 0],
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
            width: 80,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "存档编号",
            dataIndex: "a0100a",
            key: "a0100a",
            width: 150,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案人姓名",
            dataIndex: "a0101",
            key: "a0101",
            width: 120,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "性别",
            dataIndex: "a0104",
            key: "a0104",
            width: 80,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "身份证号/社保卡号",
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
            title: "库房位置",
            dataIndex: "shelvesNo",
            key: "shelvesNo",
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "经办人",
            dataIndex: "inwareOperatorName",
            key: "inwareOperatorName",
            width: 100,
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
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            fixed: "right",
            scopedSlots: { customRender: "action" }
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
            required: true,
            placeholder: "请选择库房",
            key: "whId",
            name: "whId",
            val: void 0,
            children: [],
            status: "",
            connectTo:['whdArea'], //关联到分区
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
            status: "",
            connectTo:['whdCode'], //关联到密集架
            connectToFun:[whdAreaTowhdCodeFun],
          },
          {
            title: "密集架",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择密集架",
            key: "whdCode",   //换对应：whdCode
            name: "whdCode",
            val: void 0,
            children: [],
            status: "",
            connectTo:['waColumnCode'], //关联到列号和层号
            connectToFun:[whdCodeTowanCodeFun],
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
            status: "",
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
            status: "",
            connectTo: ['orderNo'],  //关联到顺序号
            connectToFun: [waLayerCodeToOrderNoFun]
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
            status: "",
          },
          {
            title: "档案盒数",
            otherType: "select",
            required: false,
            placeholder: "请选择档案盒数",
            key: "heNum",
            name: "heNum",
            val: void 0,
            postname: "heNum",
            status: "",
            children:[
              {
                itemCode: '1',
                itemName: '1'
              }
            ]
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
            required: true,
            placeholder: "请选择库房",
            key: "whId",
            name: "whId",
            val: void 0,
            children: [],
            status: "",
            connectTo:['whdArea'], //关联到分区
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
            children: [],
            status: "",
            connectTo:['whdCode'], //关联到密集架
            connectToFun:[whdAreaTowhdCodeFun],
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
            status: "",
            connectTo:['waColumnCode'], //关联到列号和层号
            connectToFun:[whdCodeTowanCodeFun],
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
            status: "",
            isHide: true,
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
            status: "",
            isHide: true,
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
      tempWaId: '',  //库表名
      tempA01000: '',  //暂存：a01000
      tempCondition: {}, //临时查询条件
      batchDistributeIdStr: '',  //批量分配档案
      freeCapacity: 0, //空闲容量
      totalCapacity: 0, //总容量
    };
  },

  //监听属性 类似于data概念
  computed: {
    checkTableData: function() {
      return this.$store.getters.getinfoTableCheckData;
    },
    directoryData: function(){
      //字典数据
      return this.$store.getters.getDirectoryData
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
    directoryData: {
      //字典数据监听
      immediate: true,
      deep: true,
      handler: function(newVal){
        if(newVal && newVal['personIdentityList'].length > 0){
          this.initArr.formData.formInputs.forEach(item => {
            if(item.key === 'archivesIdentity'){
              item.children = this.directoryData['personIdentityList'];
            }
          });
        }
      }
    }
  },

  //方法集合
  methods: {
    getTableData(condition, pageNum, limitNum) {
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
       *         */
      this.tableLoading = true;
      this.tempCondition = condition;
      this.$http
        .fetchPost("archDocument@getArchDocumentList.action", {
          page: pageNum,
          limit: limitNum,
          a0100A: (!condition || !condition.a0100A) ? "" : condition.a0100A,
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
                key: element.a01000,    //唯一的id值； 现在由于垃圾数据影响会报错key值重复
                a0100a: element.a0100a,
                a0101: element.a0101,
                a0184: element.a0184,
                a0104: element.a0104 == "1" ? "男" : "女",
                archivesIdentity: element.archivesIdentity == "1" ? "干部" : "工人",
                shelvesNo: !element.shelvesNo ? "" : (element.shelvesNo.split("-")[0] + "区" + element.shelvesNo.split("-")[1] +  "排" + element.shelvesNo.split("-")[2] + "号"),
                inwareOperatorName: element.inwareOperatorName,
                inwareDate: element.inwareDate,
                archHandover:element.archHandover,
                archiveStatus: element.archiveStatus,
                archiveStatusName: element.archiveStatus == "0" ? "待入库" : (element.archiveStatus == "1" ? "已入库" : "接收待入库")
              });
            });
          } else {
            this.$message.error('抱歉，获取数据失败，请刷新后重试！');
          }
        }).catch(error => {
          this.$message.error('抱歉，网络异常！');
        }).finally(end => {
          this.tableLoading = false;
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
    operateFun(editDataObj ,statusVal) {
      /***
       * 功能：调整位置：功能
       */
      this.operateStatus = statusVal;
      if(editDataObj){
        //档案入库操作
        this.getPositionForm(editDataObj.key);
      } else{
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
              this.batchAdjustFrom.formInputs.forEach(element => {
                element.val = void 0;
                if(element.key === 'whId'){
                  element.children = this.roomDataArr;
                }
              });
              this.batchDistributeIdStr = this.getBatchDistributeIdStr(this.checkTableData, 'key');
              this.RecordCheckInForm = this.batchAdjustFrom;
              this.visible = true;
            } else {
              this.$message.error("请选择未入库的档案分配位置!");
            }
          } else {
            this.$message.error("请选择需要批量分配档案位置的记录!");
          }
        }
      }
    },

    getBatchDistributeIdStr(dataArr, dataKey){
      /**
       * 功能：获取批量分配数据的idStr
       * 参数：
       */
      if(dataArr.length > 0 && dataKey){
        let resultStr = '';
        dataArr.forEach(item => {
          resultStr += item[dataKey] + ','
        });
        return resultStr.substr(0, resultStr.length - 1);
      }
    },

    getPositionForm(currId){
      /**
       * 功能：根据选择的调整位置数据的id值查询数据然后填入到对应的tableformSearch里
       * 参数：currId:当前选择的table行的key(即id)值；
       */
      this.tempA01000 = currId;
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
             
            this.tempWaId = res.data.waId;
            if(res.data.whId && res.data.whdArea){
              this.getinitAreaData(res.data.whId, res.data.whdArea);
              if(res.data.whdId &&  res.data.waColumnCode && res.data.waLayerCode){
                this.getinitWhdData(res.data.whId, res.data.whdArea, res.data.whdId, res.data.waColumnCode, res.data.waLayerCode);
              }
            }
            
            this.RecordCheckInForm = this.utils.getNewFormSearch(res.data,this.positionAdjustForm);
            this.visible = true;
          }
        })
      }
    },
    getCapacityData(currObj){
      /**
       * 功能：当修改库房获取空闲容量和总容量
       * 参数：whId:当前whId
       */
      this.$http.fetchPost('archDocument@getDynamicCapacity.action', {
        whId: (!currObj || !currObj.whId) ? '' : currObj.whId,
        whdId: (!currObj || !currObj.whdId) ? '' : currObj.whdId,
        whdArea: (!currObj || !currObj.whdArea) ? '' : currObj.whdArea,
        whdCode: (!currObj || !currObj.whdCode) ? '' : currObj.whdCode,
        waColumnCode: (!currObj || !currObj.waColumnCode) ? '' : currObj.waColumnCode,
        waLayerCode: (!currObj || !currObj.waLayerCode) ? '' : currObj.waLayerCode
      }).then(res => {
        if(Number(res.code) === 0){
          this.freeCapacity = res.availableNum;   //空闲容量
          this.totalCapacity = res.totalNum;  //总容量
        } else{
          this.$message.error('抱歉，获取当前容量数据失败，请刷新后重试！');
        }
      }).catch(error => {
        this.$message.error('抱歉，网络异常！');
      })
    },
    getinitAreaData(currWhId, currWhdArea){
      /**
       * 功能：根据当前数据获取初始化的分区options；
       * 参数：currWhId:当前的库房id值； currWhdArea：当前的分区
       */
      let resultArr = [];
      this.$http.fetchPost('wareHouse@getWareHouseList.action', {
        page: 1,
        limit: 10,
      }).then(res => {
        if(Number(res.code) === 0){
          res.data.forEach(item => {
            if(item.whId == currWhId){
              for(let i = item.whAreaStartNum; i <= item.whAreaNum; i++){
                resultArr.push({
                  itemCode: '' + i,
                  itemName: '第' + i + '区'
                })
              }
              let currCapacity = Object.assign({}, currCapacity, {'whId': item.whId});
              this.getCapacityData(currCapacity);    //初始化当前库房的容量
            }
          });
          this.positionAdjustForm.formInputs.forEach(element => {
            if(element.key === 'whdArea'){
              element.children = resultArr;
              element.val = currWhdArea;
            }
          });
          
        } else{
          this.$message.error('抱歉，暂未获取到分区数据；请刷新后重试！')
        }
      }).catch(error => {
        this.$message.error('抱歉，网络异常！')
      })
    },
    getinitWhdData(currWhId, currWhdArea, currWhdId, currColumn, currLayer){
      /**
       * 功能：根据当前的数据获取初始化密集架options；
       * 参数: currWhId:当前的库房id值； currWhdArea：当前的分区
       */
      let tempResultArr = [], tempCloumnArr = [], tempLayerArr = [];
      this.$http.fetchPost('archDocument@getWhdList.action',{
        whId: currWhId,
        whdArea: currWhdArea
      }).then(res => {
        if(Number(res.code) === 0){
          res.data.forEach((element, index) => {   //密集架options数据
            tempResultArr.push({
              itemCode: element.whdId,
              itemName: '第' +  element.whdCode + '号密集架'
            })
            if(element.whdId === currWhdId){
              for(let i = 1; i<= element.whdColumnNum; i++){
                tempCloumnArr.push({
                  itemCode: '' + i,
                  itemName: '第' + i + '列'
                });
              }
              for(let j = 1; j <= element.whdLayerNum; j++){
                tempLayerArr.push({
                  itemCode: '' + j,
                  itemName: '第' + j + '层'
                })
              }
            }
          });
          this.positionAdjustForm.formInputs.forEach(element => {
            if(element.key === 'whdCode'){
              element.children = tempResultArr;
              element.val = currWhdId;
            } else if(element.key === 'waColumnCode'){
              element.children = tempCloumnArr;
              element.val = currColumn;
            } else if(element.key === 'waLayerCode'){
              element.children = tempLayerArr;
              element.val = currLayer;
            }
          });            
        } else{
          this.$message.error('抱歉，暂未获取到密集架数据；请刷新后重试！')
        }
      }).catch(error => {
        this.$message.error('抱歉，网络异常！')
      })
    },
    isWaitInRoom(dataArr) {
      //批量分配操作：判断当前选择的数据为待接收状态的长度
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
      let formDataObj = this.$refs.recordCheckInForm.getFormData();
      let currObjData = this.utils.transferFormToObj(
        formDataObj['resultData']
      );
      if(formDataObj['notRequiredHasDataRight'] && formDataObj['requiredFiledsRight']){
        if(this.operateStatus === 1){
          //位置调整
          currObjData = Object.assign({}, currObjData, {'a01000': this.tempA01000, 'waId': this.tempWaId})
          let newCurrDataObj = this.getWhdCodeFun(currObjData, formDataObj['resultData']);
          this.$http.fetchPost('archDocument@editShelvesInfo.action', newCurrDataObj).then(res => {
            if(Number(res.code) === 0){
              this.$message.success('位置调整成功!');
              this.getTableData(this.tempCondition, 1, 10);
              setTimeout(() => {
                this.visible = false;
                this.confirmLoading = false;
              }, 2000);
            } else{
              this.$message.error("抱歉，操作失败，请刷新后重试！");
            }
          }).catch(error => {
            this.$message.error("抱歉，网络异常！");
          })
        } else if(this.operateStatus === 3){
          //档案入库
          currObjData = Object.assign({}, currObjData, {'a01000': this.tempA01000})
          let newCurrDataObj = this.getWhdCodeFun(currObjData, formDataObj['resultData']);
          this.$http.fetchPost('archDocument@setShelvesInfo.action', newCurrDataObj).then(res => {
            if(Number(res.code) === 0){
              this.$message.success('档案入库成功！');
              this.getTableData(this.tempCondition, 1, 10);
              setTimeout(() => {
                this.visible = false;
                this.confirmLoading = false;
              }, 2000);
            } else{
              this.$message.error('抱歉，操作失败，请刷新后重试！')
            }
          }).catch(error => {
            this.$message.error("抱歉，网络异常！");
          })
        } else{
          //批量分配档案位置
          currObjData = Object.assign({}, currObjData, {'idsStr': this.batchDistributeIdStr, 'lableNu': ''});
          let newCurrDataObj = this.getWhdCodeFun(currObjData, formDataObj['resultData']);
          this.$http.fetchPost('archDocument@batchSetShelvesInfo.action', newCurrDataObj).then(res => {
            if(Number(res.code)=== 0){
              this.$message.success('批量分配档案操作成功！');
              this.getTableData(this.tempCondition, 1, 10);
              setTimeout(() => {
                this.visible = false;
                this.confirmLoading = false;
              }, 2000);
            } else{
              this.$message.error('抱歉,操作失败，请刷新后重试！');
            }
          }).catch(error => {
            this.$message.error('抱歉,网络异常');
          })
        }
      }
    },
    getWhdCodeFun(currObjData, formInputs){
      /**
       * 功能：currObjData里面whdCode值给了whdId; 根据currObjData里面的whdCode查询对应的name截取出来;赋值给whdCode;
       * 参数：currObjData:当前tableFormSearch提交的数据; formInputs:tableFormSearch的formInputs；
       */
      let tempWhdCode = '';
      let tempWhdId = currObjData.whdCode;
      formInputs.forEach(item => {
        if(item.key === "whdCode"){
          item.children.forEach(el => {
            if(el.itemCode === currObjData.whdCode){
               tempWhdCode = el.itemName;
            }
          });
        }
      });
      currObjData.whdCode = tempWhdCode.substr(tempWhdCode.indexOf('第') + 1, tempWhdCode.indexOf('号密集架') - 1);
      currObjData.whdId  = tempWhdId;
      return currObjData;
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
.capacityDiv{
  display: flex;
  justify-content: center;
}
</style>