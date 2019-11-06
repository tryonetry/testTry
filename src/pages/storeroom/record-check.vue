<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" :loading="tableLoading" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
        <a-button class="buttonOperate" @click="sceneOperate('now')">现场查(借)阅</a-button>
        <a-button class="buttonOperate" @click="multipleOperate('batchAudit')">批量查(借)阅</a-button>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <div slot="tableAction" slot-scope="slotPropsData">
        <!-- 已入库：无操作；只显示状态 -->
        <a
          v-if="slotPropsData.currRowdata.borrowState === '11'"
          href="javascript:;"
          data-type="已入库"
          class="successBtnColor"
        >已入库</a>

        <a
          v-if="slotPropsData.currRowdata.borrowState === '9'"
          href="javascript:;"
          data-type="归还"
          class="primaryBtnColor"
          @click="operateFun(slotPropsData.currRowdata, 'return')"
        >归还</a>

        <!-- 删除此操作了； 归还操作等价于入库 -->
        <!-- <a
          v-if="slotPropsData.currRowdata.borrowState === '10'"
          href="javascript:;"
          data-type="入库"
          class="infoBtnColor"
          @click="operateFun(slotPropsData.currRowdata, 'putstorage')"
        >入库</a> -->

        <a 
          v-if="slotPropsData.currRowdata.borrowState === '8'"
          href="javascript:;"
          data-type="借出"
          class="warnBtnColor"
          @click="operateFun(slotPropsData.currRowdata, 'checkout')"
        >借出</a>

        <a-popconfirm
          title="确定删除吗?"
          okText="确定"
          cancelText="取消"
          @confirm="deleteFun(slotPropsData.currRowdata)"
        >
          <a href="javascript:;" class="errorBtnColor">删除</a>
        </a-popconfirm>
      </div>
    </TableView>



    <!-- 现场借出、归还modal -->
    <div class="addModal">
      <a-modal
        centered
        :visible="sceneVisible"
        :confirmLoading="sceneConfirmLoading"
        :width="mulitipleOperateVal==='now' || mulitipleOperateVal === 'batchNow' ? '80%' : '40%'"
        @cancel="sceneCancel"
        :maskClosable="false"
        style="height:85%;overflow: hidden;"
        :footer="mulitipleOperateVal==='now' || mulitipleOperateVal === 'batchNow' ? null : void 0"
      >
        <div slot="title" class="roomModalTitleSlot">
          <p>{{mulitipleOperateVal==='now' || mulitipleOperateVal === 'batchNow' ? '档案现场查(借)阅' : '档案归还登记'}}</p>
          <span v-if="mulitipleOperateVal === 'return'">{{tempRowData && tempRowData.a0101}}</span>
        </div>

        <!-- 现场查借阅modal -->
        <div class="sceneBorrow" v-if="mulitipleOperateVal === 'now' || mulitipleOperateVal === 'batchNow'">
           <TableView :initArrData="sceneLoanDataInitArr" :totalCount="sceneTableTotalNum" :loading="sceneTableLoading" @searchTable="getSceneTableData" ref="sceneTableView">
            <span slot="formAction">
              <a-button class="buttonOperate" type="danger" @click="clearSceneTable">清除累计查询</a-button>
              <a-button class="buttonOperate" @click="multipleOperate('batchNow')">批量查(借)阅</a-button>
            </span>
          </TableView>
        </div>
        
        <!-- 归还modal -->
        <div class="modalOverFlowAuto" v-else>
          <TableFromSearch :formDataArr="returnForm" :layout="returnModal" ref="returnSearchForm"></TableFromSearch>
        </div>

        <!-- 归还modal--footer -->
        <template slot="footer" v-if="mulitipleOperateVal !== 'now' || mulitipleOperateVal !== 'batchNow'">
          <a-button key="cancel" @click="sceneCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="returnOk">提交</a-button>
        </template>

      </a-modal>
    </div>

    <!-- 批量查借阅modal -->
    <div class="addModal">
      <a-modal
        centered
        :visible="modalVisible"
        :confirmLoading="modalConfirmLoading"
        width="80%"
        @cancel="handleCancel"
        :maskClosable="false"
        style="height:85%;overflow: hidden;"
      >
        <div slot="title" class="roomModalTitleSlot">
          <p>批量查(借)阅</p>
          <span v-if="mulitipleOperateVal === 'checkout'">{{tempRowData && tempRowData.a0101}}</span>
        </div>

        <!-- 批量查借阅 -->
        <div class="batchBorrow">
          <TableFromSearch :formDataArr="multipleForm" :layout="layoutModal" ref="multipleTableForm" ></TableFromSearch>
          <div class="right" slot="otherForm">
             <!-- 表格头部 -->
            <div class="materialHead">
              <ul>
                  <li>序 号</li>
                  <li>查(借)阅人<i class="required">*</i></li>
                  <li>查(借)阅人身份证号码<i class="required">*</i></li>
                  <li>操 作</li>
              </ul>
            </div>

            <!-- 表格内容 -->
            <div class="materialBody" v-if='listDirectory'>
                <div>
                    <ul v-for="(row,index) in listDirectory" :key="index">
                        <li>{{index+1}}</li>
                        <li @click.stop="bundleClick(index,'name',$event)">
                            <input v-if='row.inEdit && row.inEdit.name' type="text"  v-model="row.borrower"/>
                            <span v-else>{{row.borrower}}</span>
                        </li>
                        <li @click.stop="bundleClick(index,'idNum',$event)">
                            <input v-if='row.inEdit && row.inEdit.idNum' type="text" @blur="isRegIdNum(row.borrowerTelNum, index, 'idNum', $event)" v-model="row.borrowerTelNum"/>
                            <span v-else>{{row.borrowerTelNum}}</span>
                        </li>
                        <li class="actions">
                            <a-popconfirm
                                title="确定删除吗?"
                                okText="确定"
                                cancelText="取消"
                                placement="rightBottom"
                                @confirm="deleteMaterial(index)"
                            >
                              <span class="errorBtnColor">删 除</span>
                            </a-popconfirm>
                        </li>
                    </ul>
                </div>
            </div>
             <!-- 点击添加 -->
            <p class="materialAddBtn" @click="addNewMaterial">
                <a-icon type="plus" style="color:#666"/>
                <!-- <a-button type="primary"><a-icon type="plus" />新 增</a-button> -->
            </p>
          </div>
        </div>

        <!-- 批量查借阅modal--footer操作 -->
        <template slot="footer">
          <a-button key="cancel" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="mulitipleOk">提交</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import TableFromSearch from '@/components/tableFormSearch';
import regs from '../../utils/regexp';
import utils from '../../utils/util'
export default {
  name: "RecordCheck",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView, TableFromSearch },
  props: [""],

  data() {
    return {
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

            // date
            {
              title: "申请日期",
              otherType: "daterange",
              required: false,
              placeholder: "请选择申请日期",
              key: "startDate-endDate",
              name: "startDate-endDate",
              val: [void 0, void 0],
              postname: "startDate-endDate",
              status: "",
            //   disabledDate: "disabledEndDate", //函数名：只能选今天和今天以前的
            //   disabledStartDate: "disabledStartDate" //函数名：只能选今天和今天以后的
            },
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
            width: 200,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案人姓名",
            dataIndex: "a0101",
            key: "a0101",
            width: 150,
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
            title: "公民身份号码/社保卡号",
            dataIndex: "a0184",
            key: "a0184",
            width: 350,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案位置号",
            dataIndex: "shelvesNo",
            key: "shelvesNo",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "委托存档单位编号",
            dataIndex: "companyNumber",
            key: "companyNumber",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "委托存档单位名称",
            dataIndex: "companyName",
            key: "companyName",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "查阅人",
            dataIndex: "borrower",
            key: "borrower",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "查阅人证件号",
            dataIndex: "borrowerTelNum",
            key: "borrowerTelNum",
            width: 250,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "查阅日期",
            dataIndex: "borrowDate",
            key: "borrowDate",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "查阅单位",
            dataIndex: "borrowUnit",
            key: "borrowUnit",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "查阅经办人",
            dataIndex: "borrowOperatorName",
            key: "borrowOperatorName",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "查阅备注",
            dataIndex: "borrowReason",
            key: "borrowReason",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "归还人",
            dataIndex: "returner",
            key: "returner",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "归还日期",
            dataIndex: "returnDate",
            key: "returnDate",
            width: 150,
            sorter: (a, b) => a.returnDate && b.returnDate && Number(a.returnDate.replace(/-/g,'')) - Number(b.returnDate.replace(/-/g,'')),
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "归还经办人",
            dataIndex: "returnOperatorName",
            key: "returnOperatorName",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "归还说明",
            dataIndex: "returnDesc",
            key: "returnDesc",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "借出状态",
            dataIndex: "borrowStateName",
            key: "borrowStateName",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            fixed: 'right',
            scopedSlots: { customRender: "action" }
          }
        ],
        // table数据
        tabledataArr: []
      },
      tempCondition: {}, //临时查询条件
      sceneVisible:false,   //现场借出modal 默认false：不显示
      sceneConfirmLoading : false,  //现场借出modal 默认false：不加载
      modalVisible: false,   //批量查借阅modal 默认false：不显示
      modalConfirmLoading: false,  //批量查借阅modal 默认false：不加载
      sceneTableTotalNum: 0,  //档案现场借出总页数：默认为0
      sceneTableLoading: false,  //档案现场--table loading
      sceneLoanDataInitArr:{
        //档案现场借出传得tableView数据
        treeflag: false, //左侧tree是否存在
        tableCheck: true, //table是否可以check
        superimposeWidth:true,
        formData: {
          //forminputs data
          formInputs: [
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
              title: "存档编号",
              type: "text",
              required: false,
              placeholder: "请输入(准确的)存档编号",
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
              title: "委托存档单位编号",
              type: "text",
              required: false,
              placeholder: "请输入委托存档单位编号",
              key: "companyNumber",
              name: "companyNumber",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "companyNumber",
              status: ""
            },
            {
                title: '委托存档单位名称',
                otherType: 'searchSelect',
                required: false,
                placeholder: "请选择委托存档单位名称",
                key: 'companyId',
                name: 'companyId',
                val: void 0,
                children: [],  
                status: '',
            },
            {
              title: "存档日期",
              otherType: "daterange",
              required: false,
              placeholder: "请选择存档日期",
              key: "startDate-endDate",
              name: "startDate-endDate",
              val: [void 0, void 0],
              postname: "startDate-endDate",
              status: "",
            },
          ],
          formBtns: [
            { title: "累计查询", htmltype: "submit", operate: "searchForm" },
            // { title: "重置", htmltype: "button", operate: "resetForm" }
          ]
        },
        columnsArr:[
          //表头
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
            dataIndex: "a0100A",
            key: "a0100A",
            width: 150,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "姓名",
            dataIndex: "a0101",
            key: "a0101",
            width: 100,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          }, {
            title: "性别",
            fixed: "left",
            dataIndex: "a0104",
            key: "a0104",
            width: 80,
            scopedSlots: { customRender: "cursorTitle" }
          },
           {
            title: "公民身份号码/社保卡号",
            dataIndex: "a0184",
            key: "a0184",
            width:200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "存档日期",
            dataIndex: "uCreateDate",
            key: "uCreateDate",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案位置号",
            dataIndex: "shelvesNo",
            key: "shelvesNo",
            fixed:'right',
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "是否在库",
            dataIndex: "isInwareName",
            key: "isInwareName",
            fixed:'right',
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
        ],
        tabledataArr: []
      },
      tempSceneCondition: {},  //档案现场查借阅临时查询条件
      multipleForm: {      //批量查借阅modal---tableFormSearch
        formInputs:[
          {
            title: '被查阅人姓名',
            type: "text",
            required: true,
            placeholder: "请输入被查阅人姓名",
            key: "a0101",
            name: "a0101",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: '',
            tip: '请输入被查阅人姓名',
            postname:'a0101',
            status: '',
            colWidth: [12, 24],
            isHide: true
          },
          {
            title: '被查阅人证件号码',
            type: "text",
            required: true,
            placeholder: "请输入被查阅人证件号码",
            key: "a0184",
            name: "a0184",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: '',
            tip: '请输入被查阅人证件号码',
            postname:'a0184',
            status: '',
            colWidth: [12, 24],
            isHide: true
          },
          {
            title: '单位名称',
            type: "text",
            required: true,
            placeholder: "请输入单位名称",
            key: "borrowUnit",
            name: "borrowUnit",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: '',
            tip: '请输入单位名称',
            postname:'borrowUnit',
            status: '',
            colWidth: [12, 24]
          },
          {
            title: "查阅原因",
            otherType: "textarea",
            required: false,
            placeholder: "请输入查阅原因",
            key: "consultCause",
            name: "consultCause",
            val: void 0,
            postname: "consultCause",
            maxlength: 200,
            minlength: 0,
            reg: "",
            tip: "* 请输入查阅原因",
            status: ""
          },
          {
            title: "查阅内容",
            otherType: "textarea",
            required: false,
            placeholder: "请输入查阅内容",
            key: "consultContent",
            name: "consultContent",
            val: void 0,
            postname: "consultContent",
            maxlength: 200,
            minlength: 0,
            reg: "",
            tip: "* 请输入查阅内容",
            status: ""
          },
          {
              title: '查(借)阅日期',
              otherType: 'date',  
              required: false,
              placeholder: '请选择查(借)阅日期',
              key: "borrowDate",
              name: "borrowDate",
              val: void 0,
              postname: "borrowDate",
              status: '',
              colWidth: [12, 24]
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
            colWidth: [12, 24]
          },
          {
            title: "备注",
            otherType: "textarea",
            required: false,
            placeholder: "请输入备注",
            key: "borrowReason",
            name: "borrowReason",
            val: void 0,
            postname: "borrowReason",
            maxlength: 200,
            minlength: 0,
            reg: "",
            tip: "* 请输入备注",
            status: ""
          },
          {
            title: '函件上传',
            otherType: 'upload',
            multiple: false,
            action:this.$targetHost + 'archBorrow@uploadBusinessLetter.action',
            listType: 'picture',
            accept: '.jpg, .png, .gif, .bmp, .jpeg',
            val: void 0,
            name: 'file',
            key: 'file',
            postname: 'file',
            colWidth: [12, 24]
          }
        ]
      },
      // layoutModal 布局
      layoutModal:{
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
      borrowColumns:[
        {
          title: '查(借)阅人',  
          key: "a0101" , 
          dataIndex: 'a0101', 
          scopedSlots: { customRender: 'a0101' }
        },
        {
          title: '查(借)阅人身份证号',  
          key: "a0184" , 
          dataIndex: 'a0184',
          scopedSlots: { customRender: 'a0184' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
        }
      ],
      returnForm: {  //归还modal--tableFormSearch
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
              colWidth: [12, 24]
          },
          {
            title: '经办人',
            type: "text",
            required: true,
            placeholder: "请输入经办人",
            key: "returnOperatorName",
            name: "returnOperatorName",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: '',
            tip: '请输入经办人',
            postname:'returnOperatorName',
            status: '',
            colWidth: [12, 24]
          },
          {
            title: "归还说明",
            otherType: "textarea",
            required: false,
            placeholder: "请输入归还说明",
            key: "returnDesc",
            name: "returnDesc",
            val: void 0,
            postname: "returnDesc",
            maxlength: 200,
            minlength: 0,
            reg: "",
            tip: "* 请输入归还说明",
            status: "",
            colWidth: [24, 24]
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
      borrowTableData:[],
      listDirectory: [],
      currentIndex: 0,
      currentListId:void 0,
      currentListIndex:0,
      initEditState:{name:false,idNum:false},
      // 当前条数据正确
      currentRowRight:true,
      mulitipleOperateVal: null, //批量操作功能：1--> 现场直接借出，不经过申请； 2-->客户提出申请后再借出；
      archiveIdStr: '',  //批量操作返回的符合的id字符串
      operateCurrId: '',  //归还、入库、借出操作按钮---当前的id； 
      tempRowData: null,  //当前行数据 

    };
  },

  //监听属性 类似于data概念
  computed: {
    checkTableData: function() {
      return this.$store.getters.getinfoTableCheckData;
    },
    companyList:function(){
        if(this.$store.getters.getCompanyData){
            return this.$store.getters.getCompanyData;
        }else{
            return null;
        }
    }
  },

  //监控data中的数据变化
  watch: {

  },

  //方法集合
  methods: {
    getTableData(condition, pageNum, limitNum) {
      /**
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
       */
      this.tableLoading = true;
      this.tempCondition = condition;
      this.$http.fetchPost('archBorrow@getArchBorrowApplyList.action', {
          page: pageNum,
          limit: limitNum,
          applyName: (!condition || !condition.a0101) ? '' : condition.a0101,
          applyIdNum: (!condition || !condition.a0184) ? '' : condition.a0184,
          archSerialNum: (!condition || !condition.a0100a) ? '' : condition.a0100a,
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
                   key: element.id,
                   a0100a: element.a0100a,
                   a0101: element.a0101,
                   a0104: element.a0104 === '1' ? '男' : '女',
                   a0184: element.a0184,
                   shelvesNo: element.shelvesNo,
                   companyNumber: element.companyNumber,
                   companyName: element.companyName,
                   borrower: element.borrower,
                   borrowerTelNum: element.borrowerTelNum,
                   borrowDate: element.borrowDate,
                   borrowUnit: element.borrowUnit,
                   borrowOperatorName: element.borrowOperatorName,
                   borrowReason: element.borrowReason,
                   returner: element.returner,
                   returnDate: element.returnDate,
                   returnOperatorName: element.returnOperatorName,
                   returnDesc: element.returnDesc,
                   borrowState: element.borrowState,
                   borrowStateName: element.borrowState === '7' ? '待出库' : (element.borrowState === '8' ? '待借出' : (element.borrowState === '9' ? '待归还' : (element.borrowState === '11' ? '已入库' : ''))) 
               })
            });
          } else{
            this.$message.error('抱歉，获取数据失败，请重新刷新！');
          }
      }).catch(error => {
          this.$message.error('抱歉，网络异常！');
      }).finally(end => {
        this.tableLoading = false;
      });
    },

    getSceneTableData(sceneCondition, pageNum, limitNum){
      /**
       * 功能：现场查借阅moda--查询操作：根据当前查询条件：sceneCondition，getTable数据
       * 参数：sceneCondition:form查询结果：{}
       */
      this.sceneTableLoading = true;
      this.tempSceneCondition = sceneCondition;
      this.$http.fetchPost('archBorrow@getPersonalArchList.action', {
        page: pageNum,
        limit: limitNum,
        a0101: (!sceneCondition || !sceneCondition.a0101) ? '' : sceneCondition.a0101,
        a0100A:  (!sceneCondition || !sceneCondition.a0100A) ? '' : sceneCondition.a0100A,
        a0184:  (!sceneCondition || !sceneCondition.a0184) ? '' : sceneCondition.a0184,
        companyNumber:  (!sceneCondition || !sceneCondition.companyNumber) ? '' : sceneCondition.companyNumber,
        companyId:  (!sceneCondition || !sceneCondition.companyId) ? '' : sceneCondition.companyId,
        startDate:  (!sceneCondition || !sceneCondition.startDate) ? '' : sceneCondition.startDate,
        endDate:  (!sceneCondition || !sceneCondition.endDate) ? '' : sceneCondition.endDate,
      }).then(res => {
        if(Number(res.code) === 0){
          this.sceneTableTotalNum = res.count;
          let tempSceneTableData = res.data;
          this.sceneLoanDataInitArr.tabledataArr = [];
          tempSceneTableData.forEach((element, index) => {
            this.sceneLoanDataInitArr.tabledataArr.push({
              num: (pageNum - 1) * limitNum + index + 1,
              key: element.a01000,
              a0100A: element.a0100A,
              a0101: element.a0101,
              a0184: element.a0184,
              uCreateDate: element.uCreateDate,
              shelvesNo: element.shelvesNo,
              isInware: element.isInware,
              isInwareName: element.isInware === '0' ? '在库' : (element.isInware === '1' ? '已出库' : '已转出')
            })
          });
        } else{
          this.$message.error('抱歉，获取数据失败，请重新刷新！');
        }
      }).catch(error => {
          this.$message.error('抱歉，网络异常！');
      }).finally(end => {
        this.sceneTableLoading = false;
      });
    },
    
    clearSceneTable(){
      /**
       * 功能：现场查借阅modal---清除累计查询操作功能：清空tableformSearch以及table里面的累计查询
       */
      //清空当前tableFormsearch内容
      this.sceneLoanDataInitArr.formData.formInputs.forEach(item => {
        if(item.key === 'daterange'){
          item.val = [void 0, void 0]
        } else{
          item.val = void 0;
        }
      });
      this.tempCondition ={
        companyNumber:void 0,
        companyId: void 0,
        a0101: void 0,
        a0184: void 0,
        a0100A: void 0,
        startDate: void 0,
        endDate: void 0
      }
      //清空后台查询条件数据
      this.$http.fetchPost('archBorrow@borrowListReset.action').then(res => {
        this.sceneLoanDataInitArr.tabledataArr = [];
      })
    },

    sceneOperate(currOpeVal){
      /**
       * 功能:now-->现场查借阅modal;  
       */
      this.mulitipleOperateVal = currOpeVal;
      this.sceneLoanDataInitArr.formData.formInputs.forEach(item => {
        if(item.key === 'companyId'){
          this.companyList.forEach(el => {
            item.children.push({
              itemCode: el.id,
              itemName: el.companyName
            })
          })
        }
      })
      this.sceneVisible = true;
      this.clearSceneTable();
      this.$store.dispatch("getinfoTableCheckData", []);
    },

    multipleOperate(currOpeVal){
      /***
       * 功能:批量查借阅按钮功能
       * 参数：currOpeVal:当前点击的操作:batchAudit--> 批量查借阅：客户提出申请后再借出； batchNow-->批量查借阅：现场直接借出，不经过申请；
       */
      const _this = this;
      _this.mulitipleOperateVal = currOpeVal;

      _this.multipleForm.formInputs.forEach(element => {   //批量查借阅modal---multipleForm:姓名和身份证号隐藏； 值赋值为void 0
        if(element.key === 'a0101' || element.key === 'a0184'){
          element.isHide = true;
          element.val = void 0;
        } else{
          element.val = void 0;
        }
        element.status = void 0;
      });
      _this.listDirectory = [];   //批量查借阅modal---可输入借阅人及身份证号数组赋值为[];
      if(currOpeVal === 'batchAudit'){
        //批量查借阅操作：客户提出申请后,再借出
        if(_this.checkTableData && _this.checkTableData.length > 0){
          let isOperateObj = _this.isMultipleOperateFun(_this.checkTableData, '8');
          _this.archiveIdStr = isOperateObj['archiveIdStr'];
          if(isOperateObj['isOperate']){
            _this.modalVisible = true;
          } else{
            _this.$message.error('请选择借出状态为:待借出，进行批量查借阅操作！');
          }
        } else{
          _this.$message.error('请至少选择一条数据进行批量查借阅操作！');
        }
      } else if(currOpeVal === 'batchNow'){
        //现场查借阅--批量查借阅操作：不需要申请
        if(_this.checkTableData.length > 0){
          let isOperateObj = _this.isMultipleOperateFun(_this.checkTableData, '0');
          _this.archiveIdStr = isOperateObj['archiveIdStr'];
          if(isOperateObj['isOperate']){
            _this.modalVisible = true;
          } else{
            _this.$message.error('请选择状态为：在库，进行批量查借阅操作！');
          }
        } else {
          _this.$message.error('请至少选择一条数据进行批量查借阅操作！');
        }
      }

    },

    isMultipleOperateFun(tempDataArr, batchStatus){
      /**
       * 功能:根据当前选择数据判断是否可以执行批量查借阅操作
       * 参数：tempDataArr：当前checkTable选择的数据
       */
      let tempObj = {
         'isOperate' : false,
         'archiveIdStr': ''
      }, isOperate = false, archiveIdStr ='';
      if(batchStatus === '8'){
        //批量操作---需申请
        tempDataArr.forEach(element => {
          if(element.borrowState === batchStatus){
            tempObj.isOperate = true;
            tempObj.archiveIdStr += element.key;
          } else{
            tempObj.isOperate = false;
            return;
          }
        });
      } else if(batchStatus === '0'){
        //现场查借阅--批量操作--不需要申请
        tempDataArr.forEach(element => {
          if(element.isInware === batchStatus){
            tempObj.isOperate = true;
            tempObj.archiveIdStr += element.key;
          } else{
            tempObj.isOperate = false;
            return;
          }
        });
      }
      
      return tempObj
    },

    sceneCancel(){
      //现场查借阅modal
      this.sceneVisible = false;
    },
    handleCancel(){
      //批量查借阅---modal默认关闭
      this.modalVisible = false
    },

    addNewMaterial(){
    // 添加新的查借阅人
      this.listDirectory.push({...this.initEditState});
    },

    bundleClick(index,columnName,el){
      // 切换table状态为edit状态
      const { currentIndex } = this;
      this.resetAllState();
      this.listDirectory[index].inEdit[columnName] = true;
      this.listDirectory = [...this.listDirectory];
       
      this.$nextTick(function(){
          el.currentTarget.children[0].focus();
      });
    },

    resetAllState(){
      // 将所有的编辑状态置为 false
      const _this = this;
      this.listDirectory.forEach((item)=>{
        item.inEdit = {..._this.initEditState};
      });
      this.listDirectory = [...this.listDirectory];
    },

    deleteMaterial(index){
      // 删除查借阅人
      this.listDirectory.splice(index,1);
    },
    
    isRegIdNum(val, index, key, event){
      /**
       * 功能：输入查借阅人身份证号验证
       * 参数：val:当前input值； index:当前row的index； key：当前列的key值； event：当前target
       */
      if(val){
        let isReg = regs.testid(val);
        if(isReg){
          if(this.listDirectory.length > 0){
            this.listDirectory.forEach((item, itemIndex) => {
              if(itemIndex !== index){
                if(item.borrowerTelNum === val){
                  this.$message.error('身份证号码不能重复！');
                  this.listDirectory[index].inEdit[key] = true;
                  event.stopPropagation();
                }
              }
            });
          }
        } else{
          this.$message.error('请输入正确的身份证号码！');
        }
      }
    },
    mulitipleOk(){
      /**
       * 功能：批量查借阅modal提交功能
       */
      let formResult = this.$refs.multipleTableForm.getFormData();
      let currPostObj = formResult['postObj'];
      currPostObj.strArr = this.archiveIdStr;
      if(formResult['isRight']){
        if(this.listDirectory.length >=2){   //判断table：表格数据必须大于2条
          let tempListTableArr = [...this.listDirectory];
          let borrorwTableObj = this.getNewBorrowTable(tempListTableArr); 
          if(borrorwTableObj['tempFalg']){  //判断table 表格已填数据必填项不能为空
            currPostObj['borrowers'] = utils.borrowFun(borrorwTableObj['borrowData'], 'borrower');   //table：查借阅人
            currPostObj['borrowerTelNums'] = utils.borrowFun(borrorwTableObj['borrowData'], 'borrowerTelNum');  //table:查借阅人身份证号码
            if(this.mulitipleOperateVal === 'batchAudit' || this.mulitipleOperateVal === 'checkout'){   //判断执行---批量查借阅操作:batchAudit-->批量查借阅； batchNow-->批量查借阅现场查(借)阅--批量查借阅；
              //操作为batchAudit-->客户提出申请后再借出； 
              currPostObj.bacch = '0';
              this.$http.fetchPost('archBorrow@archBorrow.action', currPostObj).then(res => {
                if(Number(res.code) === 0){
                  this.$message.success('批量查(借)阅成功！');
                  this.getTableData(this.tempCondition, 1, 10);
                  setTimeout(() => {
                    this.sceneVisible = false;
                    this.sceneConfirmLoading = false;
                    this.modalVisible = false;
                    this.modalConfirmLoading = false;
                  }, 2000);
                } else{
                  this.$message.error('抱歉，操作失败，请刷新后重试！');
                }
              }).catch(error => {
                  this.$message.error('抱歉，网络异常！');
              })
            } else if(this.mulitipleOperateVal === 'batchNow'){
              // 操作为batchNow-->现场直接借出，不经过申请；
              currPostObj.bacch = '1';
              this.$http.fetchPost('archBorrow@archBorrowNow.action', currPostObj).then(res => {
                if(Number(res.code) === 0){
                  this.$message.success('批量查(借)阅成功！');
                  this.getTableData(this.tempCondition, 1, 10);
                  setTimeout(() => {
                    this.sceneVisible = false;
                    this.sceneConfirmLoading = false;
                    this.modalVisible = false;
                    this.modalConfirmLoading = false;
                  }, 2000);
                } else{
                  this.$message.error('抱歉，操作失败，请刷新后重试！');
                }
              }).catch(error => {
                  this.$message.error('抱歉，网络异常！');
              })
            }

          } else{
            this.$message.error('请确保必填字段不为空(查(借)阅人、查(借)阅人身份证号码)')
          }
        } else{
          this.$message.error('至少输入两个查(借)阅人及其身份证号码！');
        }
        
      }
    },

    getNewBorrowTable(listDirectoryArr){
      /**
       * 功能：验证当前表格数据不能为空并且当前表格里身份证号码也都通过验证
       * 参数：listDirectoryArr:checkTable选择得数据
       */
      const _this = this;
      let  tempFalg = true, newData = [];
      listDirectoryArr.forEach((item, index) => {
        delete item.idNum;
        delete item.inEdit;
        delete item.name;
        if(item.borrower && item.borrowerTelNum && regs.testid(item.borrowerTelNum)){
          tempFalg =  true;
          newData.push(item);
        } else{
          tempFalg = false;
        }
      });
      return {'tempFalg':tempFalg, 'borrowData': newData}
    },

    operateFun(currRowData, operateVal){
      /**
       * 功能：table表里得操作
       * 参数：currRowData:当前row数据； operateVal：当前操作
       */
      const _this = this;
      _this.mulitipleOperateVal = operateVal;
      _this.operateCurrId = currRowData['key'];
      _this.tempRowData = currRowData;
      if(operateVal === 'return'){
        //归还
        _this.sceneVisible = true;
        _this.returnForm.formInputs.forEach(element => {
          if(element.status) {
            element.status = void 0;
          }
        });
        _this.returnForm = utils.getNewFormSearch(currRowData, _this.returnForm)
      } else if(operateVal === 'checkout'){
        //借出
        _this.archiveIdStr = currRowData['key'];
        _this.modalVisible = true;
        _this.multipleForm.formInputs.forEach(element => {
          if(element.key === 'a0101' || element.key === 'a0184'){
            element.isHide = false;
            element.disabled = true;
          }
        });
        _this.multipleForm = utils.getNewFormSearch(currRowData, _this.multipleForm);
        if(currRowData.borrower && currRowData.borrowerTelNum){
          _this.listDirectory = _this.getListDirectoryDataArr(currRowData.borrower, currRowData.borrowerTelNum);
        } else{
          _this.listDirectory = [];
        }
      }
    },

    getListDirectoryDataArr(borrowerStr, borrowerTelNumStr){
      /**
       * 借出操作功能：把当前数据里借阅人、借阅人身份证重新组成数组
       * 参数：borrowerStr:借阅人； borrowerTelNumStr：借阅人身份证
       */
      if(borrowerStr && borrowerTelNumStr){
        let tempBorrowArr = borrowerStr.substr(0, borrowerStr.length -1 ).split(',');
        let tempBorrowArrTelArr = borrowerTelNumStr.substr(0, borrowerTelNumStr.length - 1).split(',');
        let resultArr = [];
        for(let i = 0 ; i < tempBorrowArr.length; i++){
          resultArr.push({
           'borrower': tempBorrowArr[i],
           'borrowerTelNum':  tempBorrowArrTelArr[i]
          })
        }
        return resultArr
      }
    },

    returnOk(){
      /**
       * 功能：归还modal---提交按钮操作
       */
      const _this = this;
      let currSearchFormObj = _this.$refs.returnSearchForm.getFormData();
      let currPostObj = currSearchFormObj['postObj'];
      currPostObj.id = _this.operateCurrId;
      if(currSearchFormObj['isRight']){
        if(_this.mulitipleOperateVal === 'return'){
          _this.$http.fetchPost('archBorrow@archReturn.action', currPostObj).then(res => {
            if(Number(res.code) === 0){
              _this.$message.success('归还成功！');
              _this.getTableData(_this.tempCondition, 1, 10);
              setTimeout(() => {
                this.sceneVisible = false;
                this.sceneConfirmLoading = false;
              }, 2000);
            } else{
              this.$message.error('抱歉，操作失败，请刷新后重试！');
            }
          }).catch(error => {
              this.$message.error('抱歉，网络异常！');
          })
        }
      } 
    },

    deleteFun(currentRowData){
      /**
       * 功能：删除操作
       * 参数：currentRowData：当前行数据
       */
      if(currentRowData['key']){
        this.$http.fetchPost('archBorrow@deleteArchBorrow.action', {
          id: currentRowData['key']
        }).then(res => {
          if(Number(res.code) === 0){
            this.$message.success('删除成功！');
            this.getTableData(this.tempCondition, 1, 10);
          } else{
            this.$message.error('抱歉，删除失败，请刷新后重试！');
          }
        }).catch(error => {
          this.$message.error('抱歉，网络异常！');
        })
      }
    }
  },
  

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    //this.getTableData(null, 1, 10);
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
.borrowTable{
  margin: 0  45px 40px 45px;
}


.bundleContainer{
    width: 100%;
    /* position: absolute;
    top:0;
    left: 0; */
}

.right{
    flex: 1;
    padding: 10px;
    box-sizing: border-box;
    overflow-y: auto;
    max-height: 600px;
    margin: 0 45px;
    position: relative;
}
.right ul{
    display: flex;
    border-bottom: 1px solid #e8e8e8;
    border-left: 1px solid #e8e8e8;
}
.right .materialHead{
    background: #fafafa;
    border-top: 1px solid #e8e8e8;
}
.right .materialHead .required{
    color: red;
    margin-left: 10px;
}
.right .materialHead li{
    font-size: 16px;
}
.right .noCurrentIndexData{
    height: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 16px;
    color: #cccccc;
    border: 1px solid #e8e8e8;
    border-top: none;
}
.right ul li{
    text-align: center;
    box-sizing: border-box;
    height: 45px;
    line-height: 45px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-right:  1px solid #e8e8e8;
}
.right ul li input{
    width: 80%;
    height: 35px;
    border:1px solid #d9d9d9;
    line-height: 35px;
    text-align: center;
    border-radius: 3px;
}
.right ul li .ant-calendar-picker{
    width: 90%;
}
.right ul li input:hover{
    border:1px solid #1890ff;
}
.right .actions span{
    cursor: pointer;
}
.right ul li:nth-child(1){
    width: 10%;
}
.right ul li:nth-child(2){
    width: 30%;
    cursor: pointer;
}
.right ul li:nth-child(3){
    width: 40%;
    cursor: pointer;
}
.right ul li:nth-child(4){
    width: 20%;
}

.materialAddBtn{
    text-align: center;
    font-size: 18px;
    height: 45px;
    line-height: 45px;
    border: 1px solid #e8e8e8;
    border-top: none;
    cursor: pointer;
    /* margin-top: 20px; */
}

.uploadContainer{
    background: #ffffff;
    height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 20px;
}
.titleSlot p span{
    margin-left: 5px;
    color: #2d8cf0;
}

.batchBorrow, 
.modalOverFlowAuto{
  height:100%;
  overflow:auto;
}

.sceneBorrow{
  height: 100%;
}

</style>