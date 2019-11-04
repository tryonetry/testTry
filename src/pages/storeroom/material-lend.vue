<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" :loading="tableLoading" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
        <a-button class="buttonOperate" @click="searchRecordFun">查阅记录</a-button>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          v-if="slotPropsData.currRowdata.isInware === '1'"
          href="javascript:;"
          data-type="已入库"
          class="successBtnColor"
        >已入库</a>
        <a
          v-if="slotPropsData.currRowdata.isInware === '2'"
          href="javascript:;"
          data-type="已转出"
          class="primaryBtnColor"
        >已转出</a>
        <a 
          v-if="slotPropsData.currRowdata.isInware === '0' || slotPropsData.currRowdata.borrowState==='1'"
          href="javascript:;"
          data-type="借出"
          class="warnBtnColor"
          @click="operateFun(slotPropsData.currRowdata, 'checkout')"
        >借出</a>
        <a 
          v-if="slotPropsData.currRowdata.isInware === '0' && slotPropsData.currRowdata.borrowState==='1'"
          href="javascript:;"
          data-type="归还"
          class="infoBtnColor"
          @click="operateFun(slotPropsData.currRowdata, 'return')"
        >归还</a>
        <a 
          v-if="slotPropsData.currRowdata.isInware === '0' && slotPropsData.currRowdata.borrowState==='1'"
          href="javascript:;"
          data-type="打印预览"
          @click="operateFun(slotPropsData.currRowdata, 'print')"
        >打印预览</a>
      </div>
    </TableView>

    <!-- 查阅记录、档案借出、归还modal -->
    <div class="addModal">
      <a-modal
        centered
        :visible="visible"
        :confirmLoading="confirmLoading"
        :width="tempOperateVal !== 'return' ? '80%' : '40%'"
        @cancel="handleCancel"
        :maskClosable="false"
        style="height:85%;overflow: hidden;"
        :footer="tempOperateVal==='checkRecord' ? null: void 0"
      >
        <div slot="title" class="roomModalTitleSlot">
          <p>{{tempOperateVal==='checkRecord' ? '档案材料借阅':(tempOperateVal === 'checkout'? '借阅登记表' : '档案材料归还')}}</p>
          <span>{{currentRowData && currentRowData.a0101}}</span>
        </div>
        
        <!-- 查阅记录 -->
        <div class="checkRecordTable" v-if="tempOperateVal==='checkRecord'">
          <TableView :initArrData="recordInitArr" :totalCount="recordTableTotalNum" :loading="recordTableLoading" @searchTable="getRecordTableData"></TableView>
        </div>
       
        <!-- 借阅登记表 -->
        <div class="modalOverFlowAuto" v-if="tempOperateVal==='checkout'">
          <TableFromSearch :formDataArr="borrowForm" :layout="borrowModal" ref="modalForm"></TableFromSearch>
        </div>

        <!-- 归还 -->
        <div class="modalOverFlowAuto" v-if="tempOperateVal==='return'">
          <TableFromSearch :formDataArr="returnForm" :layout="returnModal" ref="modalForm"></TableFromSearch>
        </div>

        <template slot="footer" v-if="tempOperateVal !== 'checkRecord'">
          <a-button key="cancel" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="handleOK" :loading="submitLoading">提交</a-button>
        </template>
      </a-modal>
    </div>

    <!-- 打印预览--modal -->
    <div class="addModal">
      <a-modal
        centered
        :visible="printVisible"
        :confirmLoading="printConfirmLoading"
        :width="modalWidth"
        @cancel="printCancel"
        style="height:85%;overflow: hidden;"
        :maskClosable="false"
      >
        <div slot="title" class="roomModalTitleSlot">
          <p>交接清单预览</p>
          <span>{{currentRowData && currentRowData.a0101}}</span>
        </div>

        <div class="modalInnerContainer">
            <TemplateOfPrint :fileNum="fileNum" :firstTitle="firstTitle" :secondTitle="secondTitle" ref="print">
              <div slot="printContent" class="printContent">
                <p class="indent">
                  今借到<span class="redSpan">{{currRow && currRow.a0101}}</span>同志（档案管理编号：<span class="noFontColorSpan">{{currRow && currRow.a0100a}}</span>)档案材料：<span class="redSpan">{{currRow && currRow.expectReturnDate}}</span>供<input type="text" v-model="printData.useName" style="width:150px;"/>使用。
                </p>
                <div class="bottom">
                  <div class="bottomRight">
                      <p>具借人:{{currRow && currRow.borrower}}</p>
                      <p>证件号:{{currRow && currRow.borrowerIdNum}}</p>
                      <p>联系电话:{{currRow && currRow.borrowerTelNum}}</p>
                      <p>日期：{{nowData}}</p>
                  </div>
                </div>
              </div>
          </TemplateOfPrint>
        </div>
        <template slot="footer">
            <a-button key="back" @click="handleCancel">取 消</a-button>
            <a-button key="submit" type="primary"  @click="print">打 印</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import TableFromSearch from '@/components/tableFormSearch';
import TemplateOfPrint from '@/components/templateOfPrint';
import utils from '../../utils/util';
import moment from "moment";

let tableDataArr = [];
let tempMaterialId = '';
function  expectReturnDateFun(value){
  /**
   * 功能：验证借阅材料名称是否重复
   * 参数：value：当前input输入的value
   */
  if(value){
    return [{name: 'val', data: value, operate: 'expectReturnDate', materialId: tempMaterialId}]
  } else{
    return [{name: 'val', data: void 0}]
  }
}

export default {
  name: "MaterialLend",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView, TableFromSearch, TemplateOfPrint },
  props: [""],

  data() {
    return {
      tableTotalNum: 0, //总页数：默认为0
      tableLoading: false,  //table loading
      // tableView传值方式
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check
        // formInputs 传值方式
        formData: {
          //forminputs data
          formInputs: [
            {
              title: "存档编号",
              type: "text",
              required: false,
              placeholder: "请输入存档编号",
              key: "a0100a",
              name: "a0100a",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "a0100a",
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
              title: "公民身份号码/社保卡号",
              type: "text",
              required: false,
              placeholder: "请输入公民身份号码/社保卡号",
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
              title: "材料状态",
              otherType: "select",
              required: false,
              placeholder: "请选择档案状态",
              key: "borrowState",
              name: "borrowState",
              val: void 0,
              children: [
                {
                  itemCode: "1",
                  itemName: "借出"
                }
              ],
              status: ""
            },
            {
              title: "借出日期",
              otherType: "daterange",
              required: false,
              placeholder: "请选择借出日期",
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
            width: 80,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "存档编号",
            dataIndex: "a0100a",
            key: "a0100a",
            fixed: "left",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "姓名",
            dataIndex: "a0101",
            key: "a0101",
            fixed: "left",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "公民身份号码/社保卡号",
            dataIndex: "a0184",
            key: "a0184",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案位置号",
            dataIndex: "shelvesNo",
            key: "shelvesNo",
            width:150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "材料名称",
            dataIndex: "expectReturnDate",
            key: "expectReturnDate",
            width:150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "借阅人姓名",
            dataIndex: "borrower",
            key: "borrower",
            width:150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "借阅人公民身份号码/社保卡号",
            dataIndex: "borrowerIdNum",
            key: "borrowerIdNum",
            width:300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "借阅人电话",
            dataIndex: "borrowerTelNum",
            key: "borrowerTelNum",
            width:150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "借阅日期",
            dataIndex: "borrowDate",
            key: "borrowDate",
            width:200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "借阅备注",
            dataIndex: "borrowReason",
            key: "borrowReason",
            width:200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "归还人",
            dataIndex: "returner",
            key: "returner",
            width:150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "归还日期",
            dataIndex: "returnDate",
            key: "returnDate",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            fixed: 'right',
            width: 300,
            scopedSlots: { customRender: "action" }
          }
        ],
        // table数据
        tabledataArr: []
      },
      tempCondition: {},  //临时查询条件
      visible:false,
      confirmLoading: false,
      recordTableTotalNum: 0,  //查阅记录table--totalnum
      recordTableLoading: false,  //查阅记录table---loading
      recordInitArr:{          //查阅记录tableView传值
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check
        // formInputs 传值方式
        formData: {
          //forminputs data
          formInputs: [
            {
              title: "存档编号",
              type: "text",
              required: false,
              placeholder: "请输入存档编号",
              key: "a0100a",
              name: "a0100a",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "a0100a",
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
              title: "公民身份号码/社保卡号",
              type: "text",
              required: false,
              placeholder: "请输入公民身份号码/社保卡号",
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
            {
              title: "借出日期",
              otherType: "daterange",
              required: false,
              placeholder: "请选择借出日期",
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
            width: 80,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "存档编号",
            dataIndex: "a0100a",
            key: "a0100a",
            fixed: "left",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "姓名",
            dataIndex: "a0101",
            key: "a0101",
            fixed: "left",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "公民身份号码/社保卡号",
            dataIndex: "a0184",
            key: "a0184",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案位置号",
            dataIndex: "shelvesNo",
            key: "shelvesNo",
            width:150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "材料名称",
            dataIndex: "expectReturnDate",
            key: "expectReturnDate",
            width:150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "借阅人姓名",
            dataIndex: "borrower",
            key: "borrower",
            width:150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "借阅人公民身份号码/社保卡号",
            dataIndex: "borrowerIdNum",
            key: "borrowerIdNum",
            width:300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "借阅人电话",
            dataIndex: "borrowerTelNum",
            key: "borrowerTelNum",
            width:150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "借阅日期",
            dataIndex: "borrowDate",
            key: "borrowDate",
            width:200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "借阅备注",
            dataIndex: "borrowReason",
            key: "borrowReason",
            width:200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "归还人",
            dataIndex: "returner",
            key: "returner",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "归还日期",
            dataIndex: "returnDate",
            key: "returnDate",
            fixed: 'right',
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          }
        ],
        // table数据
        tabledataArr: []
      },
      borrowForm:{
        formInputs:[
          {
            title: '材料人姓名',
            type: "text",
            required: true,
            placeholder: "请输入材料人姓名",
            key: "applyName",
            name: "applyName",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: '',
            tip: '请输入材料人姓名',
            postname:'applyName',
            status: '',
            colWidth: [12, 24],
            disabled: true,
          },
          {
            title: '材料人公民身份号码/社保卡号',
            type: "text",
            required: true,
            placeholder: "请输入材料人公民身份号码/社保卡号",
            key: "applyIdNum",
            name: "applyIdNum",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: '',
            tip: '请输入材料人公民身份号码/社保卡号',
            postname:'applyIdNum',
            status: '',
            colWidth: [12, 24],
            disabled: true,
          },
          {
            title: '借阅人姓名',
            type: "text",
            required: true,
            placeholder: "请输入借阅人姓名",
            key: "borrower",
            name: "borrower",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: '',
            tip: '请输入借阅人姓名',
            postname:'borrower',
            status: '',
            colWidth: [12, 24],
          },
          {
            title: '借阅人公民身份号码/社保卡号',
            type: "text",
            required: true,
            placeholder: "请输入借阅人公民身份号码/社保卡号",
            key: "borrowerIdNum",
            name: "borrowerIdNum",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: 'testid',
            tip: '请输入正确的借阅人公民身份号码/社保卡号',
            postname:'borrowerIdNum',
            status: '',
            colWidth: [12, 24],
          },
          {
            title: '借阅人联系电话',
            type: "text",
            required: true,
            placeholder: "请输入借阅人联系电话",
            key: "borrowerTelNum",
            name: "borrowerTelNum",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: 'testMobile',
            tip: '请输入借阅人联系电话',
            postname:'borrowerTelNum',
            status: '',
            colWidth: [12, 24],
          },
          {
            title: '借阅材料',
            type: "text",
            required: true,
            placeholder: "请输入借阅材料",
            key: "expectReturnDate",
            name: "expectReturnDate",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: '',
            tip: '请输入借阅材料',
            postname:'expectReturnDate',
            status: '',
            colWidth: [12, 24],
            connectTo:['expectReturnDate'], //关联到自己，验证自己是否重复
            connectToFun:[expectReturnDateFun],
          },
          {
            title: "借阅备注",
            otherType: "textarea",
            required: true,
            placeholder: "请输入借阅备注",
            key: "borrowReason",
            name: "borrowReason",
            val: void 0,
            postname: "borrowReason",
            maxlength: 400,
            minlength: 0,
            reg: "",
            tip: "* 请输入借阅备注",
            status: ""
          },
          {
              title: '借阅时间',
              otherType: 'date',  
              required: false,
              placeholder: '请选择借阅时间',
              key: "borrowDate",
              name: "borrowDate",
              disabled: true,
              val: void 0,
              postname: "borrowDate",
              status: '',
              colWidth: [12, 24],
          },
          {
            title: '经办人',
            type: "text",
            required: true,
            placeholder: "请输入经办人",
            key: "borrowOperatorName",
            name: "borrowOperatorName",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: '',
            tip: '请输入经办人',
            postname:'borrowOperatorName',
            status: '',
            colWidth: [12, 24],
            disabled: true,
          },
        ]
      },
      // borrowModal 布局
      borrowModal:{
        defaultCon: {
          labelCol: {
            sm: { span: 8 },
            xl: { span: 8 },
            xxl: { span: 8 }
          },
          wrapperCol: {
            sm: { span: 16 },
            xl: { span: 14 },
            xxl: { span: 14 }
          }
        },
        textareaCon: {
          labelCol: {
            sm: { span: 8 },
            xl: { span: 8 },
            xxl: { span: 4 }
          },
          wrapperCol: {
            sm: { span: 16 },
            xl: { span: 14 },
            xxl: { span: 19 }
          }
        },
      },
      returnForm:{
        formInputs:[
          {
            title: '归还人',
            type: "text",
            required: true,
            placeholder: "请输入归还人",
            key: "returner",
            name: "returner",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: '',
            tip: '请输入归还人',
            postname:'returner',
            status: '',
            colWidth: [12, 24]
          },
          {
              title: '归还日期',
              otherType: 'date',  
              required: true,
              placeholder: '请选择归还日期',
              key: "returnDate",
              name: "returnDate",
              val: void 0,
              postname: "returnDate",
              status: '',
              colWidth: [12, 24],
              disabled: true,
          },
          {
            title: "归还备注",
            otherType: "textarea",
            required: false,
            placeholder: "请输入归还备注",
            key: "returnDesc",
            name: "returnDesc",
            val: void 0,
            postname: "returnDesc",
            maxlength: 200,
            minlength: 0,
            reg: "",
            tip: "* 请输入归还备注",
            status: "",
            colWidth: [24, 24]
          },
          {
            title: '归还经办人',
            type: "text",
            required: true,
            placeholder: "请输入归还经办人",
            key: "returnOperatorName",
            name: "returnOperatorName",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: '',
            tip: '请输入归还经办人',
            postname:'returnOperatorName',
            status: '',
            colWidth: [12, 24],
            disabled: true,
          },
        ]
      },
      returnModal:{
        defaultCon: {
          labelCol: {
            sm: { span: 6 },
            xl: { span: 6 },
            xxl: { span: 6 }
          },
          wrapperCol: {
            sm: { span: 18 },
            xl: { span: 16 },
            xxl: { span: 16 }
          }
        },
        textareaCon: {
          labelCol: {
            sm: { span: 6 },
            xl: { span: 6 },
            xxl: { span: 3 }
          },
          wrapperCol: {
            sm: { span: 18 },
            xl: { span: 16 },
            xxl: { span: 20 }
          }
        },
      },
      tempOperateVal: null,  //临时：table--当前操作值
      tempPersonId: null,    //临时：table--key值 即personId
      tempAgentId: null,   //经办人id
      submitLoading: false, //modal--提交loading
      tempRowId: null,  //临时：table--row-id值
      printVisible: false, //打印modal
      printConfirmLoading: false,  //打印modal
      modalWidth: '',  //打印modal的宽度

      currRow: {
        a0101: '',
        a0100a: '',
        expectReturnDate: '',
        borrower: '',
        borrowerIdNum: '',
        borrowerTelNum: '',
      },
      printData:{
        useName:'',
      },
      fileNum: '',  //打印---文件编号
      firstTitle: '江西省人才流动中心', //打印--大标题
      secondTitle: '借条',  //打印---小标题
      nowData:moment(new Date()).format("YYYY年MM月DD日"),  //打印--日期
      currentRowData: null,  //当前行数据
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
    getTableData(condition, pageNum, limitNum) {
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
       *         */
      this.tableLoading = true;
      this.tempCondition = condition;
      this.$http.fetchPost('materialBorrow@getCatalogBorrowList.action',{
        page: pageNum,
        limit: limitNum,
        borrowState: (!condition || !condition.borrowState) ? '' : condition.borrowState,
        a0101: (!condition || !condition.a0101) ? '' : condition.a0101,
        a0100a: (!condition || !condition.a0100a) ? '' : condition.a0100a,
        a0184: (!condition || !condition.a0184) ? '' : condition.a0184,
        startDate: (!condition || !condition.startDate) ? '' : condition.startDate,
        endDate: (!condition || !condition.endDate) ? '' : condition.endDate
      }).then(res => {
        if(Number(res.code) === 0){
          this.tableTotalNum = res.count;
          let tempTableData = res.data;
          this.initArr.tabledataArr = [];
          tempTableData.forEach((element, index) => {
            this.initArr.tabledataArr.push({
              num: (pageNum - 1) * limitNum + index + 1,
              key:  element.id ?  element.id : element.a01000,   //key值
              a01000: element.a01000,
              a0100a: element.a0100a,
              a0101: element.a0101,
              applyName: element.a0101,
              a0184: element.a0184,
              applyIdNum:element.a0184,
              shelvesNo: element.shelvesNo,
              expectReturnDate: element.expectReturnDate,
              borrower: element.borrower,
              borrowerIdNum: element.borrowerIdNum,
              borrowerTelNum: element.borrowerTelNum,
              borrowDate: element.borrowDate,
              borrowReason: element.borrowReason,
              returner: element.returner,
              returnDate: element.returnDate,
              isInware: element.isInware,
              borrowState: element.borrowState ? element.borrowState : '',
            })

            tableDataArr = this.initArr.tabledataArr;
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

    getRecordTableData(condition, pageNum, limitNum){
      /**
       * 功能：查阅记录页面，查询功能，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
       */
      this.recordTableLoading = true;
      this.$http.fetchPost('materialBorrow@getCatalogBorrowList.action',{
        page: pageNum,
        limit: limitNum,
        borrowState: '2',
        a0101: (!condition || !condition.a0101) ? '' : condition.a0101,
        a0100a: (!condition || !condition.a0100a) ? '' : condition.a0100a,
        a0184: (!condition || !condition.a0184) ? '' : condition.a0184,
        startDate: (!condition || !condition.startDate) ? '' : condition.startDate,
        endDate: (!condition || !condition.endDate) ? '' : condition.endDate
      }).then(res => {
        if(Number(res.code) === 0){
          this.recordTableTotalNum = res.count;
          let tempTableData = res.data;
          this.recordInitArr.tabledataArr = [];
          tempTableData.forEach((element, index) => {
            this.recordInitArr.tabledataArr.push({
              num: (pageNum - 1) * limitNum + index + 1,
              key: element.id,   //key值
              a0100a: element.a0100a,
              a0101: element.a0101,
              a0184: element.a0184,
              shelvesNo: element.shelvesNo,
              expectReturnDate: element.expectReturnDate,
              borrower: element.borrower,
              borrowerIdNum: element.borrowerIdNum,
              borrowerTelNum: element.borrowerTelNum,
              borrowDate: element.borrowDate,
              borrowReason: element.borrowReason,
              returner: element.returner,
              returnDate: element.returnDate,
            })
          });
        } else{
          this.$message.error('抱歉，获取数据失败，请刷新后重试！');
        }
      }).catch(error => {
        this.$message.error('抱歉，网络异常！');
      }).finally(end => {
        this.recordTableLoading = false;
      })
    },

    searchRecordFun(){
      //查阅记录
      this.tempOperateVal = 'checkRecord'
      this.visible = true;
    },

    handleCancel(){
      //关闭模态框
      this.visible = false;
    },

    operateFun(currData, operateVal){
      /**
       * 功能：table操作
       */
      const _this = this;
      _this.tempOperateVal = operateVal;
      _this.currentRowData = currData;
      _this.tempPersonId = tempMaterialId = currData['a01000'];
      if(operateVal === 'checkout' || operateVal === 'return'){
        if(operateVal === 'checkout'){
          //借出操作
          _this.borrowForm.formInputs.forEach(element => {   
            //清空modal--status
            if(element.status || element.status === ''){
              element.status = '';
            }
          });
        } else{
          //归还操作
          _this.tempRowId = currData['key'];
          _this.returnForm.formInputs.forEach(element => {   
            //清空modal--status
            if(element.status || element.status === ''){
              element.status = '';
            } 
            element.val = void 0;
          });
        }
        _this.getAgentFun(currData);   //获取经办人
      } else{
        //打印预览操作
        _this.printOperateFun(currData);
      }
      
    },
    getAgentFun(currRowData){
      /**
       * 功能：根据当前row数据：(姓名，身份证号，档案编号，row['key']即personId获取经办人及经办人id)
       * 参数：currRowData:当前row数据
       */
      if(currRowData){
        const _this = this;
        _this.$http.fetchPost('materialBorrow@catalogBorrowRecord.action', {
          a0101: currRowData.a0101,
          a0184: currRowData.a0184,
          a0100a: currRowData.a0100a,
          personId: currRowData.key
        }).then(res => {
          if(Number(res.code) === 0){
            _this.tempAgentId = res.data.borrowOperatorId;
            if(_this.tempOperateVal === 'checkout'){
              //借出
              currRowData.borrowOperatorName = res.data.borrowOperatorName;
              for(let key in currRowData){
                if(key === 'borrower' || key === 'borrowerIdNum' || key === 'borrowerTelNum' || key === 'expectReturnDate' || key ==='borrowReason'){ 
                  currRowData[key] = void 0; 
                }
              }
              _this.borrowForm = utils.getNewFormSearch(currRowData, _this.borrowForm);
            } else{
              //归还
              for(let key in currRowData){
                if(key === 'returner' || key === 'returnDesc'){
                  currRowData[key] = void 0;
                }
              }
              currRowData.returnOperatorName = res.data.borrowOperatorName;
              _this.returnForm = utils.getNewFormSearch(currRowData, _this.returnForm);
            }
            _this.visible = true;
            
          } else{
            _this.$message.error('抱歉，获取数据失败，请刷新后重试！');
          }
        }).catch(error => {
          _this.$message.error('抱歉，网络异常！');
        })
      }
    },

    handleOK(){
      /**
       * modal--提交功能
       */
      const _this = this;
      let resultForm =  _this.$refs.modalForm.getFormData();
      if(resultForm['isRight']){
        _this.submitLoading = true;
        _this.confirmLoading = true;
        let currPostObj = resultForm['postObj'];
        if(_this.tempOperateVal === 'checkout'){
          //借出操作
          currPostObj.materialId = _this.tempPersonId;
          currPostObj.borrowOperatorId = _this.tempAgentId;
          _this.$http.fetchPost('materialBorrow@saveCatalogBorrow.action', currPostObj).then(res => {
            if(Number(res.code) === 0){
              _this.$message.success('提交成功！');
              _this.getTableData(_this.tempCondition, 1, 10);
              _this.visible = false;
              _this.confirmLoading = false;
            } else{
              _this.$message.error('抱歉，提交数据失败，请刷新后重试！');
            }
          }).catch(error => {
            _this.$message.error('抱歉，网络异常！');
          }).finally(end => {
            _this.submitLoading = false;
          })
        } else{
          //归还操作
          currPostObj.returnOperatorId = _this.tempAgentId;
          currPostObj.returnId  = _this.tempRowId;
          currPostObj.e0115 = '0';
          _this.$http.fetchPost('materialBorrow@saveCatalogBorrow.action', currPostObj).then(res => {
            if(Number(res.code) === 0){
              _this.$message.success('归还成功');
              _this.getTableData(_this.tempCondition, 1, 10);
              _this.visible = false;
              _this.confirmLoading = false;
            } else{
              _this.$message.error('抱歉，操作失败，请刷新后重试！');
            }
          }).catch(error => {
            _this.$message.error('抱歉，网络异常！');
          }).finally(end => {
            _this.submitLoading = false;
          })
        }
      }
    },

    printCancel(){
      //打印modal-- 取消显示
      this.printVisible = false;
    },

    printOperateFun(currRowData){
      /**
       * 功能：打印操作
       * 参数：currRowData：当前row数据
       */
      const _this = this;
      _this.$http.fetchPost('materialBorrow@materialPrint.action',{
        a0101: currRowData.a0101,
        expectReturnDate: currRowData.expectReturnDate,
        a0100a: currRowData.a0100a,
        borrower:currRowData.borrower,
        borrowerIdNum: currRowData.borrowerIdNum,
        materialId: currRowData.a01000
      }).then(res => {
        if(Number(res.code) === 0){
          this.fileNum = res.data.dueBillSerialNumber;   //文件编号
          for(let key in this.currRow){
            this.currRow[key] = res.data[key];
          }
          this.currRow.borrower = currRowData.borrower;
          this.currRow.borrowerIdNum = currRowData.borrowerIdNum;
          this.currRow.borrowerTelNum = currRowData.borrowerTelNum;
          _this.printVisible = true;
        }else{
          _this.$message.error('抱歉，获取数据失败，请刷新后重试！');
        }
      }).catch(error => {
        _this.$message.error('抱歉，网络异常！');
      })
    },

    print(){
      /**
       * 功能：打印modal--打印操作
       */
      // this.$refs.printPage.printFun();
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    //this.getTableData(null, 1, 10);
    let dpiArr = utils.js_getDPI();
    this.modalWidth = Math.ceil(dpiArr[0] * 8.27 * 1.2 + 300);
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
.modalOverFlowAuto{
  height:100%;
  overflow:auto;
}
.checkRecordTable{
  height: 100%;
}


.modalInnerContainer{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.printContent{
  flex:1;
  overflow-y: auto;
}
.printBtn{
  height: 40px;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.printBtn button{
  margin: 0 10px;
}
</style>