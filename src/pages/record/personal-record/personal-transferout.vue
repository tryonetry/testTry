<!-- template -->
<template>
  <!-- 档案转出 -->
  <div class="outer">
    <TableView :initArrData="initArr" @searchTable="getTableData" ref="updateTable" :totalCount="tableTotalNum" :loading="tableLoading">
      <div slot="tableAction" slot-scope="slotPropsData">

        <!-- 待出库状态 -->
        <a
          href="javascrit:;"
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
            href="javascrit:;"
            class="warnBtnColor"
            v-if="String(slotPropsData.currRowdata.transferOutState) === '1'"
          >撤销</a>
        </a-popconfirm>

        <!-- 转出操作 -->
        <a
          href="javascrit:;"
          class="primaryBtnColor"
          @click="transferOutShow(slotPropsData.currRowdata)"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '1'"
        >确认转出</a>

        <!-- 已转出状态 -->
        <a
          href="javascrit:;"
          class="canNotClickBtnColor"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '2'"
        >已转出</a>

        <!-- 邮寄编号操作 -->
        <a
          href="javascrit:;"
          class="primaryBtnColor"
          @click="openSendModal(slotPropsData.currRowdata)"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '2' && !slotPropsData.currRowdata.confNumber"
        >邮寄编号</a>

        <!-- 预览打印操作 -->
        <a
          href="javascrit:;"
          :class="printLoading ? 'canNotClickBtnColor':'primaryBtnColor'"
          @click="printAndPreview(slotPropsData.currRowdata)"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '2' && !slotPropsData.currRowdata.confNumber"
        >预览打印</a>

        <!-- 已撤销状态 -->
        <a
          href="javascrit:;"
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
            href="javascrit:;"
            class="errorBtnColor"
            v-if="String(slotPropsData.currRowdata.transferOutState) !== '3'"
          >删除</a>
        </a-popconfirm>

      </div>
      <span slot="formAction">
        <a-button class="buttonOperate" @click="rollOutFun">现场转出申请</a-button>
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
                <TemplateOfPrint :fileNum="fileNum1" firstTitle="流动人员人事档案材料转递存根" ref="print1">
                    <div slot="printContent" class="printContent">
                      <a-table :columns="printTableColumns" :dataSource="printTableData" bordered :pagination="false"></a-table>
                      <div class="bottomRight">
                          <p>{{nowData}}</p>
                      </div>
                      <div class="bigTitle">
                          <h1>流动人员人事档案材料转递存根</h1>
                      </div>
                      <p><span class="redSpan redUL" style="width:200px;display:inline-block;">xxxxxxx</span><span class="redSpan">:</span></p>
                      <p class="indent">兹将<span class="redSpan">zzzz</span>同志的档案转去请按档案目录清点查收，并将回执及时退回。</p>
                      <a-table :columns="printTableColumns" :dataSource="printTableData" bordered :pagination="false"></a-table>
                      <div class="bottomRight">
                          <p>{{nowData}}</p>
                      </div>

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
                            <p style="text-align:right;">NO:{{fileNum1}}</p>
                            <p style="padding:10px 0">江西省人才流动中心：</p>
                            <p class="indent">你处于2019 年 06 月 12 日转来   罗俊远   同志的档案材料共壹册（份），已全部收到，现将回执退回。</p>
                            <div class="signCont">
                              <p>收件人签名</p>
                              <p style="margin-right:120px;">收件机关盖章</p>
                            </div>
                            <div class="bottomRight">
                              <p>{{nowData}}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 最下方 -->
                      <div class="bottomEnd">
                        <div>
                          <p>单位名单：江西省人才流动中心 代理服务部</p>
                          <p>地址：江西省南昌市二七北路266号</p>
                        </div>
                        <div>
                          <p>邮编：330046</p>
                        </div>
                      </div>
                      
                    </div>
                </TemplateOfPrint>
              </a-tab-pane>

              <a-tab-pane tab="现实表现" key="2" >
                <TemplateOfPrint :fileNum="fileNum" firstTitle="江西省人才流动中心" secondTitle="现实表现证明" ref="print2">
                    <div slot="printContent" class="printContent">
                      <p class="indent">{{currRowdata && currRowdata.a0101}}，性别：{{currRowdata && currRowdata.a0104 === '1' ? "男" : "女" }}，身份证号：{{currRowdata && currRowdata.a0184}}，系我中心档案托管人员。据其档案材料记载：该同志始终立场坚定，旗帜鲜明地与党中央保持高度一致，坚持四项基本原则，遵守国家法律法规，在“六四”中无不良言行记录；遵守单位工作纪律，工作认真、负责。</p>
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


  </div>
</template>

<script>
import TableView from "@/components/tableView";
import TransferOnSite from "@/components/record/transferOnSite";
import TableFromSearch from "@/components/tableFormSearch";
import TemplateOfPrint from '@/components/templateOfPrint';
import moment from "moment";
import { request } from 'http';
export default {
  name: "PersonalTransferOut",
  // import引入的组件需要注入到对象中才能使用
  components: {
    TableView,
    TransferOnSite,
    TableFromSearch,
    TemplateOfPrint,
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
            width:100,
            sorter: (a, b) => a.uCreateDate && b.uCreateDate && Number(a.uCreateDate.replace(/-/g,'')) - Number(b.uCreateDate.replace(/-/g,'')),
          },
          { 
            title: "转出原因", 
            dataIndex: "transferOutCause", 
            key: "transferOutCause",
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
            width:300,
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
          dataIndex: "num",
          key: "num",
        },
        {
          title: "专递单位",
          dataIndex: "e0101",
          key: "e0101",
        },
        {
          title: "专递原因",
          dataIndex: "e0102",
          key: "e0102",
        },
        {
          title: "数册",
          dataIndex: "e0103",
          key: "e0103",
        },
        {
          title: "量份",
          dataIndex: "e0104",
          key: "e0104",
        },
        {
          title: "备注",
          dataIndex: "e0108a",
          key: "e0108a",
        },
      ], 
      printTableData: [],  //打印--表格数据
      currentTabIndex:"1", // 当前的 tab index
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
      this.$refs[printIndex].printFun();
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
  .titleSlot>span{
    color:red;
  }
  .detailModalCont{
    height: 100%;
  }
  .bigTitle{
    clear: both;
    margin-bottom: 40px;
  }
  .bigTitle>h1{
    text-align: center;
  }
  .receiptContainer{
    padding-top: 400px;
  }
  .receipt{
    clear: both;
    display: flex;
    border: 1px solid #e8e8e8;
  }
  .receipt>div{
    padding: 20px;
    box-sizing: border-box;
  }
  .receipt .reLeft{
    width: 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-right: 1px solid #e8e8e8;
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
    padding: 20px 0;
  }
  .bottomEnd{
    clear: both;
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
  }
</style>