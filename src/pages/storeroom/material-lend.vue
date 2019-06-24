<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" :loading="tableLoading" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
        <a-button class="buttonOperate">查阅记录</a-button>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <!-- <div slot="tableAction" slot-scope="slotPropsData"></div> -->
    </TableView>

    <!-- 查阅记录modal -->
    <div class="addModal">
      <a-modal
        centered
        title="档案材料借阅"
        :visible="visible"
        :confirmLoading="confirmLoading"
        width="50%"
        @cancel="handleCancel"
        :maskClosable="false"
        style="height:85%;overflow: hidden;"
        :footer="null"
      >
      
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
  name: "MaterialLend",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView },
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
            title: "借阅人公民身份号码/社保卡号'",
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
        borrowState: (!condition || !condition.borrowState) ? '1' : condition.borrowState,
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
              key: element.a01000,   //key值
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
        this.tableLoading = false;
      })
    },
    handleCancel(){
      this.visible = false;
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