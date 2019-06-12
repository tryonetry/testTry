<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction"></span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <div slot="tableAction" slot-scope="slotPropsData">
         <!-- @click="operateFun(currentData=slotPropsData.currRowdata, 1)" -->
        <a
          v-if="slotPropsData.currRowdata.uState === '11'"
          href="javascript:;"
          data-type="已入库"
          class="primaryBtnColor"
        >已入库</a>
        <!-- @click="operateFun(currentData=slotPropsData.currRowdata, 1)" -->

        <a
          v-if="slotPropsData.currRowdata.uState === '9'"
          href="javascript:;"
          data-type="归还"
        >归还</a>

        <a 
          v-if="slotPropsData.currRowdata.uState === '8'"
          href="javascript:;"
          data-type="借出"
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
        tableCheck: false, //table是否可以check
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
            dataIndex: "uState",
            key: "uState",
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
                   uState: element.uState,
               })
            });
          }
      })
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