<!-- template -->
<template>
  <!-- 档案转出 -->
  <div class="outer">
    <TableView :initArrData="initArr" @searchTable="getTableData" ref="updateTable" :totalCount="tableTotalNum">
      <div slot="tableAction" slot-scope="slotPropsData">

        <a
          href="javascrit:;"
          class="canNotClickBtnColor"
          @click="editOperate(slotPropsData.currRowdata)"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '0'"
        >待出库</a>
        
        <a
          href="javascrit:;"
          class="warnBtnColor"
          @click="editOperate(slotPropsData.currRowdata)"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '1'"
        >撤销</a>
        <a
          href="javascrit:;"
          class="primaryBtnColor"
          @click="editOperate(slotPropsData.currRowdata)"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '1'"
        >转出</a>
        <a
          href="javascrit:;"
          class="canNotClickBtnColor"
          @click="editOperate(slotPropsData.currRowdata)"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '2'"
        >已转出</a>
        <a
          href="javascrit:;"
          class="primaryBtnColor"
          @click="openSendModal(slotPropsData.currRowdata)"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '2' && !slotPropsData.currRowdata.confNumber"
        >邮寄编号</a>
        <a
          href="javascrit:;"
          class="primaryBtnColor"
          @click="editOperate(slotPropsData.currRowdata)"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '2' && !slotPropsData.currRowdata.confNumber"
        >预览打印</a>
        <a
          href="javascrit:;"
          class="canNotClickBtnColor"
          @click="editOperate(slotPropsData.currRowdata)"
          v-if="String(slotPropsData.currRowdata.transferOutState) === '3'"
        >已撤销</a>
        <a
          href="javascrit:;"
          class="errorBtnColor"
          @click="editOperate(slotPropsData.currRowdata)"
          v-if="String(slotPropsData.currRowdata.transferOutState) !== '3'"
        >删除</a>

      </div>
      <span slot="formAction">
        <a-button class="buttonOperate" @click="rollOutFun">现场转出</a-button>
      </span>
    </TableView>
    <!-- 档案转出弹层 -->
    <div class="addModal">
      <a-modal
        centered
        title="个人档案转出"
        :visible="visible"
        :width="'90%'"
        :confirmLoading="confirmLoading"
        okText="转出申请"
        cancelText="取消"
        @ok="rollOutApplyFun"
        @cancel="handleCancel"
        style="height:85%;overflow: hidden;"
        :maskClosable='false'
      >
        <TransferOnSite></TransferOnSite>
      </a-modal>
    </div>
    <!-- 邮寄编号弹层 -->
    <div class="addModal">
      <a-modal
        centered
        title="邮寄编号"
        :visible="sendModalShow"
        :width="'50%'"
        :confirmLoading="sendConfirmLoading"
        okText="保存"
        cancelText="取消"
        @ok="saveSendNum"
        @cancel="handleCancel"
        style="height:40%;overflow: hidden;"
        :maskClosable='false'
      >
        <div class="sendModalForm">
          <TableFromSearch :formDataArr='sendFormData' :layout='sendModal'></TableFromSearch>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import TransferOnSite from "@/components/record/transferOnSite";
import TableFromSearch from "@/components/tableFormSearch";
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
              key: "name",
              name: "name",
              val: void 0,
              postname: "",
              maxlength: 20,
              minlength: 0,
              reg: '',
              tip: '* 请输入邮寄编号',
              status: '',
              colWidth:[12,24],
          },
          {
              title: '邮寄日期',
              otherType: "date",
              required: true,
              placeholder: "请选择邮寄日期",
              key: "name",
              name: "name",
              val: void 0,
              postname: "",
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
              key: "name",
              name: "name",
              val: void 0,
              postname: "",
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
      tableTotalNum: 0, //table数据量
      visible: false, //模态框默认不可见
      sendModalShow:false, //邮寄编号弹层
      confirmLoading: false, //模态框确认按钮加载：默认不加载
      sendConfirmLoading:false, //邮寄确认按钮加载
      currentPersonId:null,
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
     console.log(condition)
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
              _this.$message.error("抱歉,暂时未查到数据!");
          }
      })
    },
    rollOutFun() {
      /***
       * 功能：现场转出函数
       *  */
      this.visible = true;
    },
    // 邮寄编号modal打开
    openSendModal(row){
      this.sendModalShow = true;
      this.currentPersonId = row.id;
    },

    // 邮寄编号保存
    saveSendNum(){
      this.sendConfirmLoading = true;
    },

    rollOutApplyFun() {
      /**
       * 功能：模态框：转出申请操作
       */
      this.confirmLoading = true;

    },
    handleCancel() {
      /***
       * 功能：模态框取消操作
       */
      this.visible = false;
      this.sendModalShow = false;
    }
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
    height: 100%;
    overflow: auto;
  }
</style>