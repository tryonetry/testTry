<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
        <a-button class="buttonOperate" @click="operateSceneFun">现场查(借)阅</a-button>
        <a-button class="buttonOperate">批量查(借)阅</a-button>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <div slot="tableAction" slot-scope="slotPropsData">
         <!-- @click="operateFun(currentData=slotPropsData.currRowdata, 1)" -->
        <a
          v-if="slotPropsData.currRowdata.borrowState === '11'"
          href="javascript:;"
          data-type="已入库"
          class="successBtnColor"
        >已入库</a>
        <!-- @click="operateFun(currentData=slotPropsData.currRowdata, 1)" -->

        <a
          v-if="slotPropsData.currRowdata.borrowState === '9'"
          href="javascript:;"
          data-type="归还"
          class="primaryBtnColor"
        >归还</a>

        <a
          v-if="slotPropsData.currRowdata.borrowState === '10'"
          href="javascript:;"
          data-type="入库"
          class="infoBtnColor"
        >入库</a>

        <a 
          v-if="slotPropsData.currRowdata.borrowState === '8'"
          href="javascript:;"
          data-type="借出"
          class="warnBtnColor"
        >借出</a>

        <!-- @confirm="deleteFun(slotPropsData.currRowdata, slotPropsData.currTableData)"         -->
        <a-popconfirm
          title="确定删除吗?"
          okText="确定"
          cancelText="取消"
        >
          <a href="javascript:;" class="errorBtnColor">删除</a>
        </a-popconfirm>
      </div>
    </TableView>

    <!-- 现场借出modal -->
    <div class="addModal">
      <a-modal
        centered
        title="档案现场查(借)阅"
        :visible="sceneVisible"
        :confirmLoading="visibleConfirmLoading"
        :width="1600"
        @cancel="handleCancel"
        :maskClosable="false"
        style="height:85%;overflow: hidden;"
      >
        <TableView :initArrData="sceneLoanDataInitArr" :totalCount="sceneTableTotalNum" @searchTable="getSceneTableData" ref="sceneTableView">
          <span slot="formAction">
            <a-button class="buttonOperate" @click="resetSceneTable">重置</a-button>
            <a-button class="buttonOperate">批量查(借)阅</a-button>
          </span>
        </TableView>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
  name: "RecordCheck",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView },
  props: [""],

  data() {
    return {
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
              title: "身份号码/社保卡号",
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
            title: "单位编号",
            dataIndex: "companyNumber",
            key: "companyNumber",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "单位名称",
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
      sceneVisible: false,   //现场借出modal 默认false：不显示
      visibleConfirmLoading: false,  //现场借出modal 默认false：不加载
      sceneTableTotalNum: 0,  //档案现场借出总页数：默认为0
      sceneLoanDataInitArr:{
        //档案现场借出传得tableView数据
        treeflag: false, //左侧tree是否存在
        tableCheck: true, //table是否可以check
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
              title: "身份号码/社保卡号",
              type: "text",
              required: false,
              placeholder: "请输入(完整的)公民身份号码/社保卡号",
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
              title: "单位编号",
              type: "text",
              required: false,
              placeholder: "请输入单位编号",
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
                title: '单位名称',
                otherType: 'searchSelect',
                required: false,
                placeholder: "请选择单位名称",
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
            { title: "查询", htmltype: "submit", operate: "searchForm" },
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
            width: 200,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "姓名",
            dataIndex: "a0101",
            key: "a0101",
            width: 150,
            fixed: "left",
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
            title: "存档日期",
            dataIndex: "uCreateDate",
            key: "uCreateDate",
            scopedSlots: { customRender: "cursorTitle" }
          },
        ],
        tabledataArr: []
      }
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
      /**
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
       */
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
                   key: element.a01000,
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
                   borrowStateName: element.borrowState === '7' ? '待出库' : (element.borrowState === '8' ? '待借出' : (element.borrowState === '9' ? '带归还' : (element.borrowState === '10' ? '待入库' :(element.borrowState === '11' ? '已入库' : '')))) 
               })
            });
          } else{
            this.$message.error('抱歉，获取数据失败，请重新刷新！');
          }
      }).catch(error => {
          this.$message.error('抱歉，网络异常！');
        });
    },
    
    operateSceneFun(){
      /**
       * 功能：现场借出功能
       */
      this.sceneVisible = true;
    },

    getSceneTableData(sceneCondition, pageNum, limitNum){
      /**
       * 功能：档案现场借出：根据当前查询条件：sceneCondition，getTable数据
       * 参数：sceneCondition:form查询结果：{}
       */
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
              shelvesNo: element.shelvesNo
            })
          });
        } else{
          this.$message.error('抱歉，获取数据失败，请重新刷新！');
        }
      }).catch(error => {
          this.$message.error('抱歉，网络异常！');
        });
    },
    
    resetSceneTable(){
      //档案现场查借阅重置
    },
    
    handleCancel(){
      //modal默认关闭
      this.sceneVisible = false
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getTableData(null, 1, 10);
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