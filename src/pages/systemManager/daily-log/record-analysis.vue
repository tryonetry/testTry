<!-- template -->
<template>
  <div class="outer">
    <TableView
      :initArrData="initArr"
      :totalCount="tableTotalNum"
      :loading="tableLoading"
      @searchTable="getTableData"
    >
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction"></span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          href="javascript:;"
          @click="operateFun(slotPropsData.currRowdata)"
          data-type="日志详细"
          class="primaryBtnColor"
        >日志详细</a>
      </div>
    </TableView>

    <!-- 日志详细 -->
    <div class="addModal">
      <a-modal
        class="detailModal"
        centered
        :visible="visible"
        :confirmLoading="confirmLoading"
        width="80%"
        @cancel="handleCancel"
        :maskClosable="false"
        style="height:80%;overflow: hidden;"
        :footer="null"
      >
        <div slot="title" class="roomModalTitleSlot">
          <p>日志详细</p>
          <span>{{currentRowData && currentRowData.dictName}}</span>
        </div>
        <div style="height:100%;overflow:auto;">
          <TableView
            class
            :initArrData="initDetailArr"
            :loading="detailTableLoading"
            :totalCount="detailTableTotalNum"
            @searchTable="getDetailTableData"
          ></TableView>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
  name: "RecordAnalysis",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView },
  props: [""],

  data() {
    return {
      tableTotalNum: 0, //总页数：默认为0
      tableLoading: false, //table--loading
      // tableView传值方式
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check
        superimposeWidth: true, //
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
            width: 60,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "姓名",
            dataIndex: "a0101",
            key: "a0101",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "性别",
            dataIndex: "a0104",
            key: "a0104",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "籍贯",
            dataIndex: "a0111",
            key: "a0111",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "工作单位",
            dataIndex: "a0202A",
            key: "a0202A",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "日志详细",
            key: "action",
            fixed: "right",
            width: 150,
            scopedSlots: { customRender: "action" }
          }
        ],
        // table数据
        tabledataArr: []
      },
      visible: false, //日志详情--modal
      confirmLoading: false, //日志详情--modal
      detailTableLoading: false, //日志详情--modal--table--loading
      detailTableTotalNum: 0, //日志详情--modal--table总页数
      initDetailArr: {
        //日志详情--modal--table
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check
        superimposeWidth: true, //
        formData: {
          formInputs: [
            {
              title: "选择日期",
              otherType: "daterange",
              required: false,
              placeholder: "请选择日期范围",
              key: "startDate-endDate",
              name: "startDate-endDate",
              val: void 0,
              postname: ""
            },
            {
              title: "操作用户",
              type: "text",
              required: false,
              placeholder: "请输入操作用户",
              key: "creator",
              name: "creator",
              val: void 0,
              postname: "creator",
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              status: ""
            },
            {
              title: "IP地址",
              type: "text",
              required: false,
              placeholder: "请输入IP地址",
              key: "ip",
              name: "ip",
              val: void 0,
              postname: "ip",
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              status: ""
            },
            {
              title: "操作状态",
              otherType: "select",
              required: false,
              placeholder: "请选择操作状态",
              key: "status",
              name: "status",
              postname: "status",
              val: void 0,
              children: [
                {
                  itemCode: "0",
                  itemName: "异常"
                },
                {
                  itemCode: "1",
                  itemName: "成功"
                }
              ],
              status: ""
            }
          ],
          formBtns: [
            { title: "查询", htmltype: "submit", operate: "searchForm" },
            { title: "重置", htmltype: "button", operate: "resetForm" }
          ]
        },
        columnsArr: [
          {
            title: "序号",
            dataIndex: "num",
            key: "num",
            fixed: "left",
            width: 60,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            fixed: "left",
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "模块",
            dataIndex: "moduleId",
            key: "moduleId",
            width: 250,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "内容",
            dataIndex: "content",
            key: "content",
            width: 350,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作人",
            dataIndex: "creator",
            key: "creator",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "时间",
            dataIndex: "createDate",
            key: "createDate",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "状态",
            dataIndex: "status",
            key: "status",
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "IP地址",
            dataIndex: "ip",
            key: "ip",
            scopedSlots: { customRender: "cursorTitle" }
          }
        ],
        tabledataArr: []
      },
      currentRowData: null //table--row
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
      this.$http
        .fetchPost("serviceLog@getArchList.action", {
          page: pageNum,
          limit: limitNum,
          a0101: !condition || !condition.a0101 ? "" : condition.a0101
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.tableTotalNum = res.count;
            let tempTableData = res.data;
            this.initArr.tabledataArr = [];
            tempTableData.forEach((element, index) => {
              this.initArr.tabledataArr.push({
                key: element.a01000, //主键值
                num: (pageNum - 1) * limitNum + index + 1, //序号
                a0101: element.a0101,
                a0104: element.a0104 === "1" ? "男" : "女",
                a0111: element.a0111,
                a0202A: element.a0202A
              });
            });
          } else {
            this.$message.error("抱歉，获取数据失败，请刷新后重试！");
          }
        })
        .catch(err => {
          this.$message.error("抱歉，网络异常！");
        })
        .finally(end => {
          this.tableLoading = false;
        });
    },
    operateFun(currRowdata) {
      this.visible = true;
      this.currentRowData = currRowdata;
      this.initDetailArr.formData.formInputs.forEach(el => {
        el.val = void 0;
      });
      this.getDetailTableData(null, 1, 10);
    },
    getDetailTableData(condition, pageNum, limitNum) {
      this.detailTableLoading = true;
      this.$http
        .fetchPost("serviceLog@getArchLogList.action", {
          page: pageNum,
          limit: limitNum,
          a01000: this.currentRowData["key"],
          creator: !condition || !condition.creator ? "" : condition.creator,
          startDate:
            !condition || !condition.startDate ? "" : condition.startDate,
          endDate: !condition || !condition.endDate ? "" : condition.endDate,
          status: !condition || !condition.status ? "" : condition.status,
          ip: !condition || !condition.ip ? "" : condition.ip
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.detailTableTotalNum = res.count;
            let tempTableData = res.data;
            this.initDetailArr.tabledataArr = [];
            tempTableData.forEach((element, index) => {
              this.initDetailArr.tabledataArr.push({
                key: element.logId, //主键值
                num: (pageNum - 1) * limitNum + index + 1, //序号
                operation: element.operation
                  ? this.isOperateNameFun(element.operation)
                  : "",
                moduleId: element.moduleId,
                content: element.content,
                creator: element.creator,
                createDate: element.createDate,
                status: element.status === "1" ? "成功" : "异常",
                ip: element.ip
              });
            });
          } else {
            this.$message.error("抱歉，获取数据失败，请刷新后重试！");
          }
        })
        .catch(err => {
          this.$message.error("抱歉，网络异常！");
        })
        .finally(end => {
          this.detailTableLoading = false;
        });
    },
    isOperateNameFun(data) {
      /**
       * 功能：判断操作对应名称
       * 参数：data:当前操作状态值
       */
      let resultStr = "";
      switch (data) {
        case "1":
          resultStr = "创建";
          break;
        case "2":
          resultStr = "编辑";
          break;
        case "3":
          resultStr = "销毁";
          break;
        case "4":
          resultStr = "查询";
          break;
        case "5":
          resultStr = "浏览";
          break;
        case "6":
          resultStr = "导入";
          break;
        case "7":
          resultStr = "导出";
          break;
        case "8":
          resultStr = "其他";
          break;
        default:
          resultStr = "";
      }
      return resultStr;
    },
    handleCancel() {
      this.visible = false;
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getTableData(null, 1, 10);
  },

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