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
          class="primaryBtnColor"
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
        <a-button class="buttonOperate" @click="rollOutFun()">现场转出申请</a-button>
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

  </div>
</template>

<script>
import TableView from "@/components/tableView";
import TransferOnSite from "@/components/record/transferOnSite";
import TableFromSearch from "@/components/tableFormSearch";
import { request } from 'http';
export default {
  name: "PersonalTransferOut",
  // import引入的组件需要注入到对象中才能使用
  components: {
    TableView,
    TransferOnSite,
    TableFromSearch,
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
              title: "姓名",
              type: "text",
              placeholder: "请输入姓名",
              key: "applyName",
              name: "applyName",
              postname: "applyName",
              val: void 0
            },
            {
              title: "身份证号/社保卡号",
              type: "text",
              placeholder: "请输入身份证号/社保卡号",
              key: "applyIdNum",
              name: "applyIdNum",
              postname: "applyIdNum",
              val: void 0
            },
            {
              title: "档案编号",
              type: "text",
              placeholder: "请输入档案编号",
              key: "archSerialNum",
              name: "archSerialNum",
              postname: "archSerialNum",
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
            width:150,
            sorter: (a, b) => a.uCreateDate && b.uCreateDate && Number(a.uCreateDate.replace(/-/g,'')) - Number(b.uCreateDate.replace(/-/g,'')),
          },
          { 
            title: "转出原因", 
            dataIndex: "transferOutCause", 
            key: "transferOutCause",
            width:350,
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
            title: "邮寄日期", 
            dataIndex: "confNumberDate", 
            key: "confNumberDate",
            sorter: (a, b) => a.uCreateDate && b.uCreateDate && Number(a.uCreateDate.replace(/-/g,'')) - Number(b.uCreateDate.replace(/-/g,'')),
            width:150,
          },
          { 
            title: "邮寄编号备注", 
            dataIndex: "confNumberRemark", 
            key: "confNumberRemark",
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
      showRandom:Math.random(),
      currentPersonId:'', //当前人的 id
      confirmBtnTitle:'转出申请',
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
      this.visible = false;
      this.sendModalShow = false;
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
    this.getTableData(null,1,10);
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
</style>