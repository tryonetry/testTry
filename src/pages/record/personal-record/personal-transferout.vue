<!-- template -->
<template>
  <!-- 档案转出 -->
  <div class="outer">
    <TableView :initArrData="initArr" @searchTable="getTableData" ref="updateTable" :totalCount="tableTotalNum" :loading="tableLoading">
      <div slot="tableAction" slot-scope="slotPropsData">
        <!-- 编辑 -->
        <!-- && slotPropsData.currRowdata.confNumber -->
        <a
          href="javascript:;"
          class="primaryBtnColor"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '2'"
          @click="EditModalFun(slotPropsData.currRowdata)"
        >编辑</a>

        <!-- 浏览函件 -->
        <a
          href="javascript:;"
          class="primaryBtnColor"
          @click="viewLettersFun(slotPropsData.currRowdata)"
        >浏览函件</a>

        <!-- 待出库状态 -->
        <a
          href="javascript:;"
          class="canNotClickBtnColor"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '0'"
        >待出库</a>

        <!-- 撤销操作 -->
        <a-popconfirm
          title="您确定撤销吗?"
          okText="确定"
          cancelText="取消"
          @confirm="cancelOrDelete(slotPropsData.currRowdata && slotPropsData.currRowdata.id,0)"
        >
          <a
            href="javascript:;"
            class="warnBtnColor"
            v-if="String(slotPropsData.currRowdata.transferOutState) === '1'"
          >撤销</a>
        </a-popconfirm>

        <!-- 转出操作 -->
        <a
          href="javascript:;"
          class="primaryBtnColor"
          @click="transferOutShow(slotPropsData.currRowdata)"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '1'"
        >确认转出</a>

        <!-- 已转出状态 -->
        <a
          href="javascript:;"
          class="canNotClickBtnColor"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '2'"
        >已转出</a>

        <!-- 邮寄编号操作 -->
        <a
          href="javascript:;"
          class="primaryBtnColor"
          @click="openSendModal(slotPropsData.currRowdata)"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '2' && !slotPropsData.currRowdata.confNumber"
        >邮寄编号</a>

        <!-- 预览打印操作 -->
        <!-- && !slotPropsData.currRowdata.confNumber -->
        <a
          href="javascript:;"
          :class="printLoading ? 'canNotClickBtnColor':'primaryBtnColor'"
          @click="printAndPreview(slotPropsData.currRowdata)"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '2'"
        >打印</a>

        <!-- 已撤销状态 -->
        <a
          href="javascript:;"
          class="canNotClickBtnColor"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '3'"
        >已撤销</a>

        <!-- 删除操作 -->
        <a-popconfirm
          title="您确定删除吗?"
          okText="确定"
          cancelText="取消"
          @confirm="cancelOrDelete(slotPropsData.currRowdata && slotPropsData.currRowdata.id,1)"
        >
          <a
            href="javascript:;"
            class="errorBtnColor"
            v-if="String(slotPropsData.currRowdata.transferOutState) !== '3'"
          >删除</a>
        </a-popconfirm>

      </div>
      <span slot="formAction">
        <a-button class="buttonOperate" @click="rollOutFun">现场转出申请</a-button>
        <a-button class="buttonOperate" @click="batchRollOutFun">批量转出申请</a-button>
      </span>
    </TableView>
    
    <!-- 档案转出弹层 -->
    <div class="addModal">
      <a-modal
        centered
        title="个人档案转出"
        :visible="visible"
        :width="'90%'"
        @cancel="handleCancel"
        style="height:85%;overflow: hidden;"
        :maskClosable='false'
      >
        <template slot="footer">
            <a-button key="back" @click="handleCancel">取 消</a-button>
            <a-button key="submit" type="primary" :loading='confirmLoading' @click="rollOutApplyFun">提 交</a-button>
        </template>
        <TransferOnSite 
          :personData="currentPersonData" 
          :showRandom='showRandom' 
          @sendConfirmBtnTitle='getConfirmBtnTitle'
          @sendBtnStatus="getBtnStatus"
          :handleCancel='handleCancel'
          :requestData="requestData"
          :isAction="isAction"
          :actionData="actionData"
          ref="transferChild"
        ></TransferOnSite>
      </a-modal>
    </div>

    <!-- 邮寄编号弹层 -->
    <div class="addModal">
      <a-modal
        centered
        :visible="sendModalShow"
        :width="'50%'"
        @cancel="handleCancel"
        style="height:40%;overflow: hidden;"
        :maskClosable='false'
      >
        <template slot="footer">
            <a-button key="back" @click="handleCancel">取 消</a-button>
            <a-button key="submit" type="primary" :loading='sendConfirmLoading' @click="saveSendNum">保 存</a-button>
        </template>
        <!-- title -->
        <div slot="title" class="titleSlot">
          <p>邮寄编号填写</p>
          <span>注意 : 请认真核对邮寄编号,保存后无法修改</span>
        </div>

        <div class="sendModalForm">
          <TableFromSearch :formDataArr='sendFormData' :layout='sendModal' ref="sendForm"></TableFromSearch>
        </div>
      </a-modal>
    </div>

    <!-- 预览打印 -->
    <a-modal
        centered
        title="预览打印"
        :visible="printModalVisible"
        @cancel="handleCancel"
        @ok="print"
        :width="'80%'"
        style="height:95%;overflow: hidden;"
        :maskClosable='false'
        class="printModal"
        cancelText="取消"
        okText="打印"
    >
        <div class="detailModalCont">
            <a-tabs defaultActiveKey="1" style="padding:10px;height:100%;" @change="tabIndexChange">

              <a-tab-pane tab="调档函" key="1">
                <TemplateOfPrint  ref="print1" :isNoWatermark='true' :stubOut="'1'"> 
                    <div slot="printContent" class="printContent" style="font-size: 16px;">
                      <!-- 机要转递 -->
                      <div class="confidentialCon">
                          <div class="confidentialConName">机要<br/>转递</div>
                          <div class="confidentialConDetail">
                            <div class="firstDetail">
                              <div class="postcode" style="width:20%;">邮编:{{printTableData.length > 0  && printTableData[0].postalCode}}</div>
                              <div class="archivePerson" style="width:40%;">档案人:{{printTableData.length > 0  && printTableData[0].applyName}}</div>
                              <div class="archiveNum" style="width:40%;">档案编号:{{printTableData.length > 0  && printTableData[0].recordNum}}</div>
                            </div>
                            <div class="firstDetail">
                              <div class="address">地址：{{printTableData.length > 0  && printTableData[0].archiveDirectionAddress}}</div>
                            </div>
                            <div class="firstDetail">
                              <div class="address">单位：{{printTableData.length > 0  && printTableData[0].archiveDirectionOrg}}</div>
                            </div>
                          </div>
                      </div>     
                      <hr />                 
                      <!-- 流动人员人事档案转递存根 -->
                      <div style="margin: 30px 0 40px 0;">
                        <div class="cungenbigTitle" style="margin-bottom: 0;">
                            <h1>流动人员人事档案转递存根</h1>
                        </div>
                        <div style="display:flex;color: red;font-weight: bold;font-size: 16px;justify-content: flex-end;">NO.{{fileNum1}}</div>
                        <a-table class="printTable" :columns="printTableColumns" :dataSource="printTableData" bordered :pagination="false"></a-table>
                        <div class="bottomRight" style="padding:0;">
                            <p>{{nowData}}</p>
                        </div>
                      </div>
                      <hr />   
                      <!-- 流动人员人事档案转递通知单 -->
                      <div style="margin: 30px 0 40px 0;">
                        <div class="cungenbigTitle" style="margin-bottom: 0;">
                            <h1>流动人员人事档案转递通知单</h1>
                        </div>
                        <p><span class="redSpan redUL" style="width:200px;display:inline-block;">{{printTableData.length > 0  && printTableData[0].archiveDirectionOrg}}</span><span class="redSpan">:</span></p>
                        <p class="indent">兹将<span class="redSpan">{{printTableData.length > 0  && printTableData[0].applyName}}</span>同志的人事档案转递你处，请按档案目录清点查收，并将回执退回。</p>
                        <a-table class="printTable printNoticeTable" :columns="printTableNoticeColumns" :dataSource="printTableData" bordered :pagination="false"></a-table>
                        <div class="bottomRight" style="padding:0;">
                            <p>{{nowData}}</p>
                        </div>
                      </div>                                                                                                                                                  
                      <hr />
                      <!-- 回执 -->
                      <div class="receiptContainer">
                        <div class="receipt">
                          
                          <!-- 回执左侧 --> 
                          <div class="reLeft">
                            <p>回</p>
                            <p>执</p>
                          </div>

                          <!-- 回执右侧 -->
                          <div class="reRight">
                            <div style="display:flex;justify-content: flex-start;">
                              <div>{{firstTitle}}：</div>
                              <div style="text-align:right;font-size:16px;flex: 1;">NO:{{fileNum1}}</div>
                            </div>
                            <p class="indent">你处于{{hztransferOutDate}}转来  {{printTableData.length > 0  && printTableData[0].applyName}}   同志的人事档案材料共壹册/份，已全部收到，现将回执退回。</p>
                            <div class="signCont">
                              <p>收件人签名</p>
                              <p style="margin-right:120px;">收件机关盖章</p>
                            </div>
                            <div class="bottomRight" style="padding: 0;">
                              <p>{{nowData}}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 最下方 -->
                      <div class="bottomEnd">
                        <div>
                          <p>单位名称：{{firstTitle}} 代理服务部</p>
                          <p><span style="font-size: 17px;">地</span><span style="padding-left:31px;font-size: 17px;">址：江西省南昌市二七北路266号</span></p>
                        </div>
                        <div>
                          <p>邮编：330046</p>
                        </div>
                      </div>
                      
                    </div>
                </TemplateOfPrint>
              </a-tab-pane>

              <a-tab-pane tab="现实表现" key="2" >
                <TemplateOfPrint :fileNum="fileNum" :firstTitle="firstTitle" secondTitle="现实表现证明" ref="print2">
                    <div slot="printContent" class="printContent">
                      <p class="indent">{{currRowdata && currRowdata.a0101}}，性别：{{currRowdata && currRowdata === '1' ? '男' : (currRowdata === '2' ? '女' : (currRowdata === '9' ? '未说明的性别' : '未知的性别'))}}，身份证号：{{currRowdata && currRowdata.a0184}}，系我中心档案托管人员。据其档案材料记载：该同志始终立场坚定，旗帜鲜明地与党中央保持高度一致，坚持四项基本原则，遵守国家法律法规，在“六四”中无不良言行记录；遵守单位工作纪律，工作认真、负责。</p>
                      <p class="indent">无该同志参加“法轮功”等非法组织记录。</p>
                      <p class="indent">特此证明。</p>
                      <div class="bottomRight">
                        <p>{{nowData}}</p>
                      </div>
                    </div>
                </TemplateOfPrint>
              </a-tab-pane>
                
            </a-tabs>
        </div>
    </a-modal>

    <!-- 编辑弹层 -->
    <div class="addModal">
      <a-modal
        centered
        :visible="editvisible"
        :width="'90%'"
        @cancel="handleEditCancel"
        style="height:85%;overflow: hidden;"
        :maskClosable='false'
      >
        <template slot="footer">
            <a-button key="back" @click="handleEditCancel">取 消</a-button>
            <a-button key="submit" type="primary" :loading='confirmLoading' @click="editFormSubmit">提 交</a-button>
        </template>
        <!-- title -->
        <div slot="title" class="titleSlot">
          <p>编辑</p>
          <span>{{editCurrentData && editCurrentData.applyName}} </span>
        </div>
        <div class="editModalForm">
          <TableFromSearch :formDataArr='editFormData' ref="editForm"></TableFromSearch>
          <FormHeader :formTitle='"上传函件"'></FormHeader>
          <div class="edituploadCon" style="margin: 0 8% 46px;">
            <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload" :multiple="true">
                <a-button> <a-icon type="upload" /> 上传函件 </a-button>
            </a-upload>
          </div>
        </div>
      </a-modal>
    </div>

    <!-- 浏览函件 -->
    <div class="addModal">
      <a-modal
        centered
        :visible="viewLettervisible"
        :width="'90%'"
        @cancel="handleViewCancel"
        style="height:85%;overflow: hidden;"
        :maskClosable='false'
      >
        <template slot="footer">
            <a-button key="back" @click="handleViewCancel">取 消</a-button>
        </template>
        <!-- title -->
        <div slot="title" class="titleSlot">
          <p>浏览函件</p>
          <span>{{editCurrentData && editCurrentData.applyName}} </span>
        </div>
        <div class="viewLetterModalForm">
          <div class="letterList" v-viewer="{navbar:false, scalable: false}">
            <div class="letterItem" v-for="(item, index) in fileList" :key="index">
              <img :src="item.url" :alt="item.name" />
              <p>{{item.name}}</p>
            </div>
          </div>
        </div>
      </a-modal>
    </div>

    <!-- 批量转出申请--table -->
    <div class="addModal">
      <a-modal
        centered
        :visible="batchVisible"
        :confirmLoading="batchConfirmLoading"
        :width="'80%'"
        @cancel="batchCancel"
        :maskClosable="false"
        style="height:85%;overflow: hidden;"
        :footer="null"
        class="noFooterBody"
      >
        <div slot="title" class="roomModalTitleSlot">
          <p>批量转出申请</p>
        </div>

        <!-- 现场查借阅modal -->
        <div class="sceneBorrow">
           <TableView :initArrData="batchDataInitArr" :totalCount="batchTableTotalNum" :layout="batchLayout" :loading="batchTableLoading" @searchTable="getBatchTableData" ref="batchTableView">
            <span slot="formAction">
              <a-button class="buttonOperate" type="danger" @click="clearBatchTable">清除累计查询</a-button>
              <a-button class="buttonOperate"  @click="batchApplyFun">批量转出</a-button>
            </span>
          </TableView>
        </div>

      </a-modal>
    </div>

    <!-- 批量转出申请--form信息 -->
    <div class="addModal">
      <a-modal
        centered
        :visible="batchApplyVisible"
        :confirmLoading="batchApplyConfirmLoading"
        :width="'80%'"
        @cancel="batchApplyCancel"
        :maskClosable="false"
        style="height:85%;overflow: hidden;z-index: 1005;"
      >
        <div slot="title" class="roomModalTitleSlot">
          <p>批量转出申请</p>
        </div>

        <div class="editModalForm">
          <TableFromSearch :formDataArr='batchFormData' ref="editForm"></TableFromSearch>
        </div>
        <template slot="footer">
          <a-button key="cancel" @click="batchApplyCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="batchSubmit">提交</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import TransferOnSite from "@/components/record/transferOnSite";
import TableFromSearch from "@/components/tableFormSearch";
import TemplateOfPrint from '@/components/templateOfPrint';
import FormHeader from "@/components/formHeader";
import moment from "moment";
import { request } from 'http';
import utils from "../../../utils/util.js";


//投递方式  To 转往单位地址
function transfermodeToAddressFun(val){
    if(String(val) === '1' || String(val) === '2'){
        return [
            {name: 'required', data: true}
        ]
    } else{
        return [
            {name: 'required', data: false}
        ]
    }
}

// 委托单位名称 To 委托单位编号
function companyNameToNum(codeVal){
  if(codeVal){
    return [
      {name:'val',data:codeVal},
      {name:'disabled',data:true}
    ]
  }
  return [{name:'val',data:''},{name:'disabled',data:false}]
}

// 委托单位编号 To 委托单位名称
function companyNumToName(numVal){
  if(numVal || String(numVal) === '0'){
    return [
      {name:'val',data:numVal},
      {name:'disabled',data:true},
      {name:'tip',data:'* 抱歉,尚未找到对应编号的公司'}
    ]
  }else{
    return [
      {name:'val',data:''},
      {name:'disabled',data:false},
      {name:'tip',data:'* 请选择委托存档单位名称'},
      {name:'status',data:void 0},
    ]
  }
}

export default {
  name: "PersonalTransferOut",
  // import引入的组件需要注入到对象中才能使用
  components: {
    TableView,
    TransferOnSite,
    TableFromSearch,
    TemplateOfPrint,
    FormHeader
  },
  props: [""],

  data() {
    return {
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false,
        formData: {
          //form inputs
          formInputs: [
             {
              title: "存档编号",
              type: "text",
              placeholder: "请输入存档编号",
              key: "archSerialNum",
              name: "archSerialNum",
              postname: "archSerialNum",
              val: void 0
            },
            {
              title: "姓名",
              type: "text",
              placeholder: "请输入姓名",
              key: "applyName",
              name: "applyName",
              postname: "applyName",
              val: void 0
            },
            {
              title: "公民身份号码/社保卡号",
              type: "text",
              placeholder: "请输入公民身份号码/社保卡号",
              key: "applyIdNum",
              name: "applyIdNum",
              postname: "applyIdNum",
              val: void 0
            },
            {
              title: "申请状态",
              otherType: "select",
              placeholder: "请选择申请状态",
              key: "transferOutState",
              name: "transferOutState",
              postname: "transferOutState",
              val: void 0,
              children:[
                {itemName:'待出库',itemCode:'0'},
                {itemName:'待转出',itemCode:'1'},
                {itemName:'已转出',itemCode:'2'},
                {itemName:'已撤销',itemCode:'3'}
              ]
            },
            {
              title: "申请日期",
              otherType: "daterange",
              placeholder: "请选择申请日期范围",
              key: "startDate-endDate",
              name: "startDate-endDate",
              postname: "startDate-endDate",
              val: [void 0 , void 0]
            },
          ],
          formBtns: [
            { title: "查询", htmltype: "submit", operate: "searchForm" },
            { title: "重置", htmltype: "button", operate: "resetForm" }
          ]
        },
        columnsArr: [
          //table标头
          {
            title: "序号",
            dataIndex: "num",
            key: "num",
            fixed: "left",
            width: 80
          },
          { 
            title: "姓名", 
            dataIndex: "applyName", 
            key: "name",
            width: 150,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "申请日期", 
            dataIndex: "applyDate", 
            key: "applyDate",
            width:120,
            sorter: (a, b) => a.uCreateDate && b.uCreateDate && Number(a.uCreateDate.replace(/-/g,'')) - Number(b.uCreateDate.replace(/-/g,'')),
          },
          { 
            title: "转出原因", 
            dataIndex: "transferOutCauseName", 
            key: "transferOutCauseName",
            width:200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "档案管理机构",
            dataIndex: "originalArchiveOrg", 
            key: "originalArchiveOrg",
            width:200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案转往机构",
            dataIndex: "archiveDirectionOrg",
            key: "archiveDirectionOrg",
            width:200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "转出状态", 
            dataIndex: "tempTransferOutState", 
            key: "tempTransferOutState",
            width:100,
          },
          {
            title: "转出日期",
            dataIndex: "transferOutDate",
            key: "transferOutDate",
            width:150,
            sorter: (a, b) => a.uCreateDate && b.uCreateDate && Number(a.uCreateDate.replace(/-/g,'')) - Number(b.uCreateDate.replace(/-/g,'')),
          },
          { 
            title: "经办人", 
            dataIndex: "operatorName", 
            key: "operatorName",
            width:150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "邮寄编号", 
            dataIndex: "confNumber", 
            key: "confNumber",
            width:150,
          },
           { 
            title: "邮寄编号备注", 
            dataIndex: "confNumberRemark", 
            key: "confNumberRemark",
          },
          { 
            title: "邮寄日期", 
            dataIndex: "confNumberDate", 
            key: "confNumberDate",
            sorter: (a, b) => a.uCreateDate && b.uCreateDate && Number(a.uCreateDate.replace(/-/g,'')) - Number(b.uCreateDate.replace(/-/g,'')),
            width:150,
          },
          {
            title: "操作",
            key: "action",
            fixed: "right",
            width:450,
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: []
      },
      sendFormData:{
        formInputs: [
          {
              title: '邮寄编号',
              type: "text",
              required: true,
              placeholder: "请输入邮寄编号",
              key: "confNumber",
              name: "confNumber",
              val: void 0,
              postname: "confNumber",
              maxlength: 20,
              minlength: 0,
              reg: 'testNumAndChar',
              tip: '* 请输入正确的邮寄编号',
              status: '',
              colWidth:[12,24],
          },
          {
              title: '邮寄日期',
              otherType: "date",
              required: true,
              placeholder: "请选择邮寄日期",
              key: "confNumberDate",
              name: "confNumberDate",
              val: void 0,
              postname: "confNumberDate",
              maxlength: 20,
              minlength: 0,
              reg: '',
              tip: '* 请选择邮寄日期',
              status: '',
              colWidth:[12,24],
          },
          {
              title: '备注',
              otherType: "textarea",
              required: false,
              placeholder: "请输入邮寄备注",
              key: "confNumberRemark",
              name: "confNumberRemark",
              val: void 0,
              postname: "confNumberRemark",
              maxlength: 200,
              minlength: 0,
              reg: '',
              tip: '* 请输入邮寄备注',
              status: '',
          },
        ]
      },
      // sendModal 布局
      sendModal:{
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
      isAction:false,
      actionData:null,
      tableTotalNum: 0, //table数据量
      tableLoading:false,
      tempCondition:{},
      visible: false, //模态框默认不可见
      sendModalShow:false, //邮寄编号弹层
      confirmLoading: false, //模态框确认按钮加载：默认不加载
      sendConfirmLoading:false, //邮寄确认按钮加载
      currentPersonData:{}, //当前人的数据
      currRowdata:{}, //当前行数据
      printModalVisible:false, //打印弹层显示
      showRandom:Math.random(),
      currentPersonId:'', //当前人的 id
      confirmBtnTitle:'转出申请',
      fileNum:"",
      fileNum1:"",
      printLoading:false,
      nowData:moment(new Date()).format("YYYY年MM月DD日"),  //打印--日期
      printTableColumns: [
        //打印--表格-表头
        {
          title: "姓名",
          dataIndex: "applyName",
          key: "applyName",
          width: 120,
        },
        {
          title: "转往单位",
          dataIndex: "archiveDirectionOrg",
          key: "archiveDirectionOrg",
          width: 180,
        },
        {
          title: "转递原因",
          dataIndex: "transferOutCauseName",
          key: "transferOutCauseName",
          width: 180,
        },
        {
          title: "册/份",
          dataIndex: "cefen",
          key: "cefen",
          width: 100,
        },
        {
          title: "备注",
          dataIndex: "remarks",
          key: "remarks",
        },
      ], 
      printTableNoticeColumns: [
        //打印--表格-表头
        {
          title: "姓名",
          dataIndex: "applyName",
          key: "applyName",
          width: 120,
        },
        {
          title: "转递单位",
          dataIndex: "zdDepart",
          key: "zdDepart",
          width: 180,
        },
        {
          title: "转递原因",
          dataIndex: "transferOutCauseName",
          key: "transferOutCauseName",
          width: 180,
        },
        {
          title: "册/份",
          dataIndex: "cefen",
          key: "cefen",
          width: 100,
        },
        {
          title: "备注",
          dataIndex: "remarks",
          key: "remarks",
        },
      ], 
      printTableData: [],  //打印--表格数据
      currentTabIndex:"1", // 当前的 tab index
      firstTitle: JSON.parse(sessionStorage.getItem('loginData')).loginUser['orgName'],
      hztransferOutDate: '',  //回执里面--日期
      printCount: 0,

      editCurrentData: null,  //编辑模态框--当前行数据
      editvisible: false,
      editFormData: {
        formInputs: [
          {
            title: '申请人',
            type: "text",
            required: true,
            placeholder: "请输入申请人姓名",
            key: "applyName",
            name: "applyName",
            val: void 0,
            postname: "applyName",
            maxlength: 20,
            minlength: 0,
            reg: '',
            tip: '* 请输入正确的申请人姓名',
            status: '',
          },
          {
            title: '公民身份号码/社保卡号',
            type: "text",
            required: true,
            placeholder: "请输入申请人公民身份号码/社保卡号",
            key: "applyIdNum",
            name: "applyIdNum",
            val: void 0,
            postname: "applyIdNum",
            maxlength: 18,
            minlength: 15,
            reg: 'testid',
            tip: '* 请输入正确的申请人公民身份号码/社保卡号',
            status: '',
          },
          {
            title: '申请人电话',
            type: "text",
            required: false,
            placeholder: "请输入申请人联系电话",
            key: "applyTemnum",
            name: "applyTemnum",
            val: void 0,
            postname: "applyTemnum",
            maxlength: 11,
            minlength: 11,
            reg: 'testMobile',
            tip: '* 请输入正确的申请人联系电话',
            status: '',
          },
          {
            title: '邮政编码',
            type: "text",
            required: false,
            placeholder: "请输入邮政编码",
            key: "postalCode",
            name: "postalCode",
            val: void 0,
            postname: "postalCode",
            maxlength: 6,
            minlength: 6,
            reg: 'testZipCode',
            tip: '* 请输入正确的邮政编码',
            status: '',
          },
          {
            title: "投递方式",
            otherType: "select",
            required: true,
            placeholder: "请选择投递方式",
            name: "deliveryWay",
            key: "deliveryWay",
            val: void 0,
            postname: "deliveryWay",
            tip:'* 请选择投递方式',
            children: [
                {itemCode: '1', itemName: '机要'},
                {itemCode: '2', itemName: '邮递'},
                {itemCode: '3', itemName: '自带'},
                {itemCode: '5', itemName: '其它'},
            ],
            status: "",
            connectTo:['archiveDirectionAddress'], 
            connectToFun: [transfermodeToAddressFun]
          },
          {
            title: "转出原因",
            otherType: "select",
            required: true,
            placeholder: "请选择转出原因",
            name: "transferOutCause",
            key: "transferOutCause",
            val: void 0,
            postname: "transferOutCause",
            tip:'* 请选择转出原因',
            children: [],
            status: ""
          },
          {
            title: '转往单位名称',
            type: "text",
            required: true,
            placeholder: "请输入转往单位名称",
            key: "archiveDirectionOrg",
            name: "archiveDirectionOrg",
            val: void 0,
            postname: "",
            maxlength: 40,
            minlength: 0,
            reg: '',
            tip: '* 请输入转往单位名称',
            status: '',
          },
          {
            title: '转往单位地址',
            type: "text",
            required: false,
            placeholder: "请输入转往单位地址",
            key: "archiveDirectionAddress",
            name: "archiveDirectionAddress",
            val: void 0,
            postname: "archiveDirectionAddress",
            maxlength: 40,
            minlength: 0,
            reg: '',
            tip: '* 请输入转往单位地址',
            status: '',
          },
          {
            title: "转往单位行政区划",
            otherType: "addressSelect",
            required: true,
            placeholder: "请选择转往单位行政区划",
            key: "archiveDirectionArea",
            name: "archiveDirectionArea",
            val: void 0,
            postname: "archiveDirectionArea",
            maxlength: 100,
            minlength: 0,
            reg: "",
            tip: "* 请选择转往单位行政区划",
            status: ""
          },
          {
            title: "申请日期",
            otherType: "date",
            required: false,
            placeholder: "请选择申请日期",
            key: "applyDate",
            name: "applyDate",
            val: moment(new Date()),
            postname: "a0107",
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "* 请选择申请日期",
            disabled:true,
            status: ""
          },
          {
            title: '邮寄编码',
            type: "text",
            required: true,
            placeholder: "请输入邮寄编码",
            key: "confNumber",
            name: "confNumber",
            val: void 0,
            postname: "confNumber",
            maxlength: 50,
            minlength: 0,
            reg: '',
            tip: '* 请输入正确的邮寄编码',
            status: '',
          },
          {
            title: "备注",
            otherType: "textarea",
            required: false,
            placeholder: "请输入备注",
            key: "remarks",
            name: "remarks",
            val: void 0,
            postname: "remarks",
            maxlength: 200,
            minlength: 0,
            reg: "",
            tip: "* 请输入备注",
            status: ""
          }
        ]
      },
      fileList: [],  //编辑模态框--上传函件
      tempfileList: [], ////编辑模态框--临时---上传函件

      viewLettervisible: false,  //浏览函件--modal
      
      batchVisible: false,  //批量转出申请--modal
      batchConfirmLoading: false,  //批量转出申请--modal
      batchTableTotalNum: 0,  //批量转出申请总页数：默认为0
      batchTableLoading: false,  //批量转出申请--table loading
      tempBatchCondition: null,  //批量转出申请--table 查询条件--临时
      batchDataInitArr:{
        //批量转出申请--tableview
        treeflag: false, //左侧tree是否存在
        tableCheck: true, //table是否可以check
        superimposeWidth:true,
        formData: {
          //forminputs data
          formInputs: [
            {
              title: "存档编号",
              type: "text",
              placeholder: "请输入存档编号",
              key: "archSerialNum",
              name: "archSerialNum",
              postname: "archSerialNum",
              val: void 0
            },
            {
              title: "姓名",
              type: "text",
              placeholder: "请输入姓名",
              key: "applyName",
              name: "applyName",
              postname: "applyName",
              val: void 0
            },
            {
              title: "公民身份号码/社保卡号",
              type: "text",
              placeholder: "请输入公民身份号码/社保卡号",
              key: "applyIdNum",
              name: "applyIdNum",
              postname: "applyIdNum",
              val: void 0
            },
            {
              title: "申请状态",
              otherType: "select",
              placeholder: "请选择申请状态",
              key: "transferOutState",
              name: "transferOutState",
              postname: "transferOutState",
              val: void 0,
              children:[
                {itemName:'待出库',itemCode:'0'},
                {itemName:'待转出',itemCode:'1'},
                {itemName:'已转出',itemCode:'2'},
                {itemName:'已撤销',itemCode:'3'}
              ]
            },
            {
              title: "申请日期",
              otherType: "daterange",
              placeholder: "请选择申请日期范围",
              key: "startDate-endDate",
              name: "startDate-endDate",
              postname: "startDate-endDate",
              val: [void 0 , void 0]
            },
            {
              title: "单位编号",
              type: "text",
              required: false,
              placeholder: "请输入单位编号",
              key: "companyNum",
              name: "companyNum",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "companyNum",
              status: "",
              connectTo:['companyId'], //关联到委托单位名称
              connectToFun:[companyNumToName], 
            },
            {
                title: '单位名称',
                otherType: 'searchSelect',
                required: false,
                placeholder: "请选择单位名称",
                key: 'companyId',
                name: 'companyId',
                val: void 0,
                children: [],  
                status: '',
                connectTo:['companyNum'], //关联到委托单位编号
                connectToFun:[companyNameToNum], 
            },
          ],
          formBtns: [
            { title: "累计查询", htmltype: "submit", operate: "searchForm" },
            // { title: "重置", htmltype: "button", operate: "resetForm" }
          ]
        },
        columnsArr: [
          //table标头
          {
            title: "序号",
            dataIndex: "num",
            key: "num",
            fixed: "left",
            width: 80
          },
          { 
            title: "姓名", 
            dataIndex: "applyName", 
            key: "name",
            width: 150,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "申请日期", 
            dataIndex: "applyDate", 
            key: "applyDate",
            width:120,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "转出原因", 
            dataIndex: "transferOutCauseName", 
            key: "transferOutCauseName",
            width:200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "档案管理机构",
            dataIndex: "originalArchiveOrg", 
            key: "originalArchiveOrg",
            width:200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案转往机构",
            dataIndex: "archiveDirectionOrg",
            key: "archiveDirectionOrg",
            width:200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "转出状态", 
            dataIndex: "tempTransferOutState", 
            key: "tempTransferOutState",
            width:100,
          },
          {
            title: "转出日期",
            dataIndex: "transferOutDate",
            key: "transferOutDate",
            width:150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "经办人", 
            dataIndex: "operatorName", 
            key: "operatorName",
            width:150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "邮寄编号", 
            dataIndex: "confNumber", 
            key: "confNumber",
            width:150,
          },
           { 
            title: "邮寄编号备注", 
            dataIndex: "confNumberRemark", 
            key: "confNumberRemark",
          },
          { 
            title: "邮寄日期", 
            dataIndex: "confNumberDate", 
            key: "confNumberDate",
            width:150,
            scopedSlots: { customRender: "cursorTitle" }
          }
        ],
        tabledataArr: []
      },
      batchLayout:{
        //批量转出申请--table--layout
        defaultCon: {
          labelCol: {
            sm: { span: 10 },
            xl: { span: 10 },
            xxl: { span: 10 }
          },
          wrapperCol:{
            sm: { span: 14 },
            xl: { span: 14 },
            xxl: { span: 14 }
          }
        }
      },

      batchApplyVisible:false, //批量转出申请--操作--modal
      batchApplyConfirmLoading:false,  //批量转出申请--操作--modal
      batchFormData:{
        //批量转出申请--操作--formdata--inputs
        formInputs: [
          {
              title: '申请人',
              type: "text",
              required: true,
              placeholder: "请输入申请人姓名",
              key: "applyName",
              name: "applyName",
              val: void 0,
              postname: "applyName",
              maxlength: 20,
              minlength: 0,
              reg: '',
              tip: '* 请输入正确的申请人姓名',
              status: '',
          },
          {
              title: '公民身份号码/社保卡号',
              type: "text",
              required: true,
              placeholder: "请输入申请人公民身份号码/社保卡号",
              key: "applyIdNum",
              name: "applyIdNum",
              val: void 0,
              postname: "applyIdNum",
              maxlength: 18,
              minlength: 15,
              reg: 'testid',
              tip: '* 请输入正确的申请人公民身份号码/社保卡号',
              status: '',
          },
          {
              title: '申请人电话',
              type: "text",
              required: false,
              placeholder: "请输入申请人联系电话",
              key: "applyTemnum",
              name: "applyTemnum",
              val: void 0,
              postname: "applyTemnum",
              maxlength: 11,
              minlength: 11,
              reg: 'testMobile',
              tip: '* 请输入正确的申请人联系电话',
              status: '',
          },
          {
              title: '邮政编码',
              type: "text",
              required: false,
              placeholder: "请输入邮政编码",
              key: "postalCode",
              name: "postalCode",
              val: void 0,
              postname: "postalCode",
              maxlength: 6,
              minlength: 6,
              reg: 'testZipCode',
              tip: '* 请输入正确的邮政编码',
              status: '',
          },
          {
              title: "投递方式",
              otherType: "select",
              required: true,
              placeholder: "请选择投递方式",
              name: "transfermode",
              key: "transfermode",
              val: void 0,
              postname: "transfermode",
              tip:'* 请选择投递方式',
              children: [
                  {itemCode: '1', itemName: '机要'},
                  {itemCode: '2', itemName: '邮递'},
                  {itemCode: '3', itemName: '自带'},
                  {itemCode: '5', itemName: '其它'},
              ],
              status: "",
              connectTo:['archiveDirectionAddress'], 
              connectToFun: [transfermodeToAddressFun]
          },
          {
              title: "转出原因",
              otherType: "select",
              required: true,
              placeholder: "请选择转出原因",
              name: "transferOutCause",
              key: "transferOutCause",
              val: void 0,
              postname: "transferOutCause",
              tip:'* 请选择转出原因',
              children: [],
              status: ""
          },
          {
              title: '转往单位名称',
              type: "text",
              required: true,
              placeholder: "请输入转往单位名称",
              key: "archiveDirectionOrg",
              name: "archiveDirectionOrg",
              val: void 0,
              postname: "",
              maxlength: 40,
              minlength: 0,
              reg: '',
              tip: '* 请输入转往单位名称',
              status: '',
          },
          {
              title: '转往单位地址',
              type: "text",
              required: false,
              placeholder: "请输入转往单位地址",
              key: "archiveDirectionAddress",
              name: "archiveDirectionAddress",
              val: void 0,
              postname: "archiveDirectionAddress",
              maxlength: 40,
              minlength: 0,
              reg: '',
              tip: '* 请输入转往单位地址',
              status: '',
          },
          {
              title: "转往单位行政区划",
              otherType: "addressSelect",
              required: true,
              placeholder: "请选择转往单位行政区划",
              key: "archiveDirectionArea",
              name: "archiveDirectionArea",
              val: void 0,
              postname: "archiveDirectionArea",
              maxlength: 100,
              minlength: 0,
              reg: "",
              tip: "* 请选择转往单位行政区划",
              status: ""
          },
          {
              title: "申请日期",
              otherType: "date",
              required: false,
              placeholder: "请选择申请日期",
              key: "applyDate",
              name: "applyDate",
              val: moment(new Date()),
              postname: "a0107",
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "* 请选择申请日期",
              disabled:true,
              status: ""
          },
          {
              title: "备注",
              otherType: "textarea",
              required: false,
              placeholder: "请输入备注",
              key: "remarks",
              name: "remarks",
              val: void 0,
              postname: "remarks",
              maxlength: 200,
              minlength: 0,
              reg: "",
              tip: "* 请输入备注",
              status: ""
          }
        ],
      }
    };
  },

  //监听属性 类似于data概念
  computed: {
    directoryData: function(){
      return this.$store.getters.getDirectoryData
    },
    checkTableData: function() {
      return this.$store.getters.getinfoTableCheckData;
    },
  },

  //监控data中的数据变化
  watch: {
    directoryData: {
      //字典数据监听
      immediate: true,
      deep: true,
      handler: function(newVal){
        if(newVal && newVal['archTransferTypeList'].length > 0){
          this.editFormData.formInputs.forEach(item => {
            if(item.key === 'transferOutCause'){
              item.children = this.directoryData['archTransferTypeList'];
            }
          });
        }
      }
    }
  },

  //方法集合
  methods: {
    getTableData(condition, pageNum, limitNum) {
      const _this = this;
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
      **/
      this.tableLoading = true;
      this.tempCondition = condition;
      this.$http.fetchPost('archTransferOut@getArchTransferOutApplyList.action',{
          page: pageNum,
          limit: limitNum,
          ...condition
      }).then((res)=>{
          if(Number(res.code) === 0){
              this.tableTotalNum = res.count;
              this.initArr.tabledataArr = res.data;
              this.initArr.tabledataArr.forEach((element, index) => {
                let tempState = String(element.transferOutState);
                Object.assign(element,{
                  key:element.id,
                  num: (pageNum - 1) * limitNum + index + 1,
                  tempTransferOutState: tempState === '0' ? "待出库" : tempState === '1' ? "待转出" : tempState === '2' ? "已转出" : tempState === '3' ? "已撤销" : "",
                  deliveryWay:  element.transfermode
                });
              });
          }else{
              _this.$message.warning("抱歉,暂时未查到数据!");
          }
      }).catch(err => {
        _this.$message.error("抱歉,网络异常,请稍后重试");
      }).finally(end => {
        _this.tableLoading = false;
      })
    },

    getBatchTableData(batchCondition, pageNum, limitNum){
      this.batchTableLoading = true;
      this.tempBatchCondition = batchCondition;
      const _this = this;
      this.$http.fetchPost('archTransferOut@getArchTransferOutApplyListForBatch.action', {
        page: pageNum,
        limit: limitNum,
        ...batchCondition
      }).then(res => {
        if(Number(res.code) === 0){
            this.batchTableTotalNum = res.count;
            this.batchDataInitArr.tabledataArr = res.data;
            this.batchDataInitArr.tabledataArr.forEach((element, index) => {
              let tempState = String(element.transferOutState);
              Object.assign(element,{
                key:element.id,
                num: (pageNum - 1) * limitNum + index + 1,
                tempTransferOutState: tempState === '0' ? "待出库" : tempState === '1' ? "待转出" : tempState === '2' ? "已转出" : tempState === '3' ? "已撤销" : "",
                deliveryWay:  element.transfermode
              });
            });
        }else{
          _this.$message.warning("抱歉,查询失败，请刷新后重试!");
        }
      }).catch(err =>{
        _this.$message.error("抱歉,网络异常,请稍后重试");
      }).finally(end => {
        _this.batchTableLoading = false;
      })
    },

    rollOutFun() {
      /***
       * 功能：现场转出函数
       *  */
      this.isAction = false;
      this.visible = true;
      this.showRandom = Math.random();
      // 清除 form 数据
      this.$nextTick(function(){
        this.$refs.transferChild.claerForm('formDataEnterprice');
        this.$refs.transferChild.claerForm('formDataNotInner');
        this.$refs.transferChild.claerForm('formDataAction');
      })
    },

    // 邮寄编号modal打开
    openSendModal(row){
      this.sendModalShow = true;
      this.currentPersonId = row.id;
    },

    // 邮寄编号保存
    saveSendNum(){
      const _this = this;
      let result = this.$refs.sendForm.getFormData();
      
      if(result.notRequiredHasDataRight && result.requiredFiledsRight){
        this.sendConfirmLoading = true;
        this.$http.fetchPost('archTransferOut@insertJybh.action',{...result.postObj,id:this.currentPersonId})
          .then(res => {
            // console.log(res);
            if(Number(res.code) === 0){
              _this.$message.success('保存成功!');
              _this.getTableData(_this.tempCondition,1,10);
              _this.sendModalShow = false;
            }else{
              _this.$message.error('抱歉,保存失败,请重试');
            }
          })
          .catch(err => {
            _this.$message.error('抱歉,网络异常,请稍后重试');
          })
          .finally(end => {
            _this.sendConfirmLoading = false;
          })
      }
      
    },

    // 打印预览
    printAndPreview(currRowdata){

      if(this.printLoading) return;
      this.printLoading = true;
      this.currRowdata = currRowdata;
      if(currRowdata.id){
          this.$http.fetchPost('archTransferOut@archTransforPrint.action',{id:currRowdata.id})
          .then(res => {
              if(Number(res.code) === 0){
                  this.fileNum = res.data.fielNum;
                  this.fileNum1 = res.data.ddhNum;
                  this.printModalVisible = true;
                  this.printTableData = [];
                  let resultData = Object.assign({}, res.data.archTransferOut, {key:  res.data.archTransferOut.id, cefen: res.data.cefen, zdDepart: this.firstTitle});
                  this.printTableData.push(resultData);
                  this.hztransferOutDate = res.data.archTransferOut.transferOutDate ? (res.data.archTransferOut.transferOutDate.substring(0,4) + '年' + res.data.archTransferOut.transferOutDate.substring(5,7) + '月' + res.data.archTransferOut.transferOutDate.substring(8,10) + '日') : moment(new Date()).format("YYYY年MM月DD日")
                  
              }else{
                  this.$message.warning("获取信息失败,请重试");
              }
          }).catch(err => {
              this.$message.error("抱歉,网络异常,请稍后重试");
          }).finally(end => {
              this.printLoading = false;
          })
      }

    },

    // 撤销 cd - 0 撤销  cd - 1
    cancelOrDelete(id,cd){
      const _this = this;
      if(cd === 0){
        this.$http.fetchPost('archDocument@archTransferoutOutCancel.action',{id,"archOut":"archOut"})
          .then(res => {
            if(Number(res.code) === 0){
              _this.$message.success('撤销成功 !');
              _this.getTableData(_this.tempCondition,1,10);
            }else if(Number(res.code) === 2){
              _this.$message.warning('抱歉, 您已过了撤销操作的时间, 请转出后进行退档操作!');
            }else{
              _this.$message.error('抱歉,撤销失败,请重试');
            }
          })
          .catch(err => {
            _this.$message.error('抱歉,网络异常,请稍后重试');
          })
      }else if(cd === 1){
        this.$http.fetchPost('archTransferOut@deleteArchTransferOut.action',{id})
          .then(res => {
            if(Number(res.code) === 0){
              _this.$message.success('删除成功 !');
              _this.getTableData(_this.tempCondition,1,10);
            }else{
              _this.$message.error('抱歉,删除失败,请重试');
            }
          })
          .catch(err => {
            _this.$message.error('抱歉,网络异常,请稍后重试');
          })
      }
    },  

    rollOutApplyFun(personData) {
      /**
       * 功能：模态框：转出申请操作
       */
      this.$refs.transferChild.confirmOrTransferOut();
      // this.confirmLoading = true;

    },

    handleCancel() {
      /***
       * 功能：模态框取消操作
       */
      this.printModalVisible = false;
      this.visible = false;
      this.sendModalShow = false;
    },

    // tab 更改
    tabIndexChange(index){
      this.currentTabIndex = index;
    },

    // 打印
    print(){
      let printIndex = "print"+this.currentTabIndex;
      if(this.printCount === 0){
          this.$refs[printIndex].printFun();
          this.printCount ++;
      } else{
          this.$refs[printIndex].printOtherFun();
      }
      
    },

    //获取 btn 的 title 
    getConfirmBtnTitle(title){
      this.confirmBtnTitle = title;
    },

    // 获取当前的 btn 的 提交状态
    getBtnStatus(status){
      this.confirmLoading = status;
    },

    requestData(){
      this.getTableData(this.tempCondition,1,10);
    },

    // action 转出
    transferOutShow(personData){

        const _this = this;

        this.actionData = null;
        if(personData && personData.archiveId && personData.id){
            this.isAction = true;
            this.$http.fetchGet('archTransferOut@getArchTransferOutInfo.action',{
                archiveId:personData.archiveId,
                id:personData.id,
            }).then(res => {
                if(Number(res.code) === 0 && res.data){
                  _this.visible = true;
                  _this.showRandom = Math.random();
                  _this.actionData = res.data;
                }else{
                  _this.$message.error('档案信息不存在!');
                }
            }).catch(err => {
                _this.$message.error('抱歉,网络异常,请稍后重试')
            });
        }
    },

    //编辑---关闭弹窗
    handleEditCancel(){
      this.editvisible = false;
    },

    //编辑
    EditModalFun(currData){
      this.editCurrentData = currData;
      this.editFormData.formInputs.forEach(item => {
        item.status = '';
      })
      this.editvisible = true;
      this.editFormData = utils.getNewFormSearch(
        currData,
        this.editFormData
      );
      this.getEditUploadFileList(currData);//点击编辑时--通过id获取已经上传的函件列表
      
    },

    getEditUploadFileList(currData, operateVal){
      //编辑时--通过id获取已经上传的函件列表;
      this.fileList = [];
      this.tempfileList = [];
      this.$http.fetchPost('archTransferOut@pictureShow.action', {
        id: currData.id,
      }).then(res => {
        if(Number(res.code) === 0){
          if(res.data){
            if(res.data.pictureArch && res.data.pictureArch.length > 0){
              res.data.pictureArch.forEach(item => {
                this.fileList.push(Object.assign(item, {
                  uid: item.p01000,
                  name: item.fileName,
                  url:this.$targetHost + utils.getImageUrl(item.filePath, 4),
                  thumbUrl: this.$targetHost + utils.getImageUrl(item.filePath, 4),
                  status: 'done',
                }))
              });
            } else{
              this.fileList = [];
            }
          }
        } else{
          this.$message.warning('抱歉，获取失败，请刷新后重试！');
        }
      }).catch(err => {
        this.$message.error('抱歉，网络异常！');
      })
    },

    //编辑--提交
    editFormSubmit(){
      let result = this.$refs.editForm.getFormData();
      if(result.isRight){
        //提交转出信息
        this.$http.fetchPost('archTransferOut@editArchTransfor.action',{
            archiveId:this.editCurrentData.a01000,
            id: this.editCurrentData.id,
            transfermode: result.postObj.deliveryWay == '1'?  '机要': (result.postObj.deliveryWay == '2'? '邮递' :(result.postObj.deliveryWay == '3' ? '自带' : '其它')),
            ...result.postObj,
        }).then(res => {
            if(Number(res.code) === 0){
                this.$message.success('编辑成功！');
                //提交--上传函件
                for(let i = 0; i < this.tempfileList.length; i++){
                  if(this.tempfileList[i].type){
                    this.uploadPost(this.tempfileList[i]);
                  } 
                }
                this.handleEditCancel();
                this.getTableData(this.tempCondition,1,10);
            }else{
                this.$message.warning('抱歉,编辑失败,请刷新后重试');
            }
        }).catch(err => {
            this.$message.error('抱歉,网络异常!');
        })
      }
    },

    //编辑--上传函件
    beforeUpload(file){
      const isJPG = file.type === "image/jpeg" || file.type === "image/jpg" || file.type === 'image/png';
      if (!isJPG) {
          this.$message.error("请上传JPEG、PNG或JPG格式!");
      } else{
          this.fileList = [...this.fileList, file];
          this.tempfileList = [...this.fileList];
          return false;
      }
    },
    //上传函件--上传：功能
    uploadPost(currfile){
        let dataObj = new FormData();
        this.$set(dataObj, 'files', currfile);
        
        this.$set(dataObj, 'a01000', this.editCurrentData.a01000);
        // this.uploading = true;

        this.$http.fetchPost('personArchBrowse@personArchBrowseInsert.action', dataObj,{headers:{'Content-Type':'multipart/form-data'}}).then(res => {
            if(Number(res.code) === 0){
                // this.uploading = false;
                this.$message.success('上传成功！');
            
            } else{
                // this.uploading = false;
                this.$message.error('上传失败！');
            }
        })
    },

    //编辑--上传函件--删除
    handleRemove(file) {
       this.$http.fetchPost('archTransferOut@deletePicture.action', {
         p01000: file.uid
       }).then(res => {
         if(Number(res.code) === 0){
           this.$message.success('删除成功！');
           this.getEditUploadFileList(this.editCurrentData);
         } else{
           this.$message.warning('抱歉，删除失败，请刷新后重试！');
         }
       }).catch(err => {
         this.$message.error('抱歉，网络异常！');
       })
    },

    //浏览函件--modal 关闭
    handleViewCancel(){
      this.viewLettervisible = false;
    },
    //浏览函件--按钮
    viewLettersFun(currData){
      this.editCurrentData = currData;
      this.viewLettervisible = true;
      this.getEditUploadFileList(currData);
    },

    //批量转出申请--modal--cancel
    batchCancel(){
      this.batchVisible = false;
    },

    batchRollOutFun(){
      //批量转出申请--modal
      this.batchVisible = true;
      this.$http.fetchGet('personalArch@getCompanyList.action',{})
      .then(res => {
        if(Number(res.code) === 0){
          // 委托存档单位名称
          this.batchDataInitArr.formData.formInputs.forEach(item => {
            if(item.key === 'companyId'){
              res.data.forEach(el => {
                item.children.push({
                  itemName:el.itemName,
                  itemCode: el.itemId,
                  itemId:el.itemCode
                })
              })
            }
          })
        }
      })
      
      this.clearBatchTable();
      this.$store.dispatch("getinfoTableCheckData", []);
    },

    clearBatchTable(){
      /**
       * 功能：批量转出申请modal---清除累计查询操作功能：清空tableformSearch以及table里面的累计查询
       */
      //清空当前tableFormsearch内容
      this.batchDataInitArr.formData.formInputs.forEach(item => {
        if(item.key === 'daterange'){
          item.val = [void 0, void 0]
        } else{
          item.val = void 0;
        }
      });
      this.tempBatchCondition ={
        archSerialNum: void 0,
        applyName: void 0,
        applyIdNum: void 0,
        transferOutState: void 0,
        startDate: void 0,
        endDate: void 0,
        companyNumber: void 0,
        companyId: void 0,
      }
      //清空后台查询条件数据
      this.$http.fetchPost('archTransferOut@archTransferOutApplyListReset.action').then(res => {
        this.batchDataInitArr.tabledataArr = [];
      })
    },
    
    batchApplyFun(){
    //批量申请操作按钮 
      this.batchFormData.formInputs.forEach(item => {
        if(item.key === 'transferOutCause'){
          item.children = this.directoryData['archTransferTypeList'];
        }
        item.val = void 0;
        item.status = '';
      });
    
      if(this.checkTableData && this.checkTableData.length > 0){
        let archiveIdStr = '';
        this.checkTableData.forEach(element => {
          archiveIdStr += element.key;
        });
        this.batchApplyVisible = true;
        console.log(archiveIdStr);
      } else{
        this.$message.error('请至少选择一条数据进行批量转出操作！');
      }
      

      
    },

    batchApplyCancel(){
      //批量申请操作按钮--modal--cancel
      this.batchApplyVisible = false;
    },

    batchSubmit(){
      //批量申请操作按钮--modal--提交

    },
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // this.getTableData(null,1,10);
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
  .modalContent{
    height: 100%;
    max-height: 100%;
  }
  .sendModalForm{
    padding-top: 10px;
    height: 100%;
    overflow: auto;
  }
  .titleSlot{
    display: flex;
  }
  .titleSlot>p{
    margin-right: 40px;
  }
  .detailModalCont{
    height: 100%;
  }
  .bigTitle{
    clear: both;
    margin-bottom: 20px;
  }
  .bigTitle>h1{
    text-align: center;
  }
  .receiptContainer{
    padding-top: 20px;
  }
  .receipt{
    clear: both;
    display: flex;
    border: 1px solid #000;
  }
  .receipt>div{
    padding: 8px 20px;
    box-sizing: border-box;
  }
  .receipt .reLeft{
    width: 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-right: 1px solid #000;
  }
  .receipt .reLeft>p{
    text-align: center;
  }
  .receipt .reRight{
    width: 90%;
  }
  .signCont{
    display: flex;
    justify-content: space-between;
    padding: 0;
  }
  .bottomEnd{
    clear: both;
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
  }
  .confidentialCon{
    clear: both;
    display: flex;
    border: 2px solid #000;
    box-sizing: border-box;
    margin-bottom: 40px;
    font-size: 20px;
  }

  .confidentialConName{
    width: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-right: 2px solid #000;
    text-align: center;
  }

  .confidentialConDetail{
    flex: 1;
  }

  .confidentialConDetail .firstDetail{
    display: flex;
    justify-content: flex-start;
    text-align: center;
    border-bottom: 2px solid #000;
    line-height: 40px;
  }

  .firstDetail:last-child{
    border: none;
  }

  .archivePerson{
    border: 2px solid #000;
    border-top: transparent;
    border-bottom: transparent;
  }
  
  .cungenbigTitle{
    margin-bottom: 40px;
  }
  .cungenbigTitle>h1,.cungenbigTitle>h2{
    text-align: center;
  }
  .cungenbigTitle>h1{
    font-size: 25px;
    margin-bottom: 10px;
  }
  .cungenbigTitle>h2{
    font-size: 20px;
  }

  .editModalForm,
  .viewLetterModalForm{
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .letterList{
    width: 100%;
    display: flex;
    justify-items: left;
  }
  .letterItem{
    width: 160px;
    text-align: center;
  }
  .letterItem img{
    width: 100%;
    height: 200px;
  }

</style>