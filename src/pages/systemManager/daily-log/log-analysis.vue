<!-- template -->
<template>
  <div class="outer">
    <div class="padCon">
      <div class="leftTree">
        <OtherTree :treeDataObj="treeDataObj" @accepttreeNode="accepttreeNodeFun"></OtherTree>
      </div>
      <div class="rightTable">
        <TableView
          :initArrData="initArr"
          :totalCount="tableTotalNum"
          :loading="tableLoading"
          @searchTable="getTableData"
        >
          <!-- tableFormSearch里添加其他按钮 -->
          <span slot="formAction"></span>
        </TableView>
      </div>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import OtherTree from "@/components/otherTree";
import utils from "../../../utils/util";
export default {
  name: "LogAnalysis",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView, OtherTree },
  props: [""],

  data() {
    return {
      tableTotalNum: 0, //总页数：默认为0
      tableLoading: false, //table--loading
      tempPageSize: 1, //临时--当前table页码
      // tableView传值方式
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check
        superimposeWidth: true,
        // formInputs 传值方式
        formData: {
          //forminputs data
          formInputs: [
            //input
            {
              title: "操作人",
              type: "text",
              required: false,
              placeholder: "请输入操作人",
              key: "creator",
              name: "creator",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "creator",
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
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "ip",
              status: ""
            },
            // select/searchSelect
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
            },
            // date
            {
              title: "日志时间",
              otherType: "daterange",
              required: false,
              placeholder: "请选择日志时间",
              key: "startDate-endDate",
              name: "startDate-endDate",
              val: void 0,
              postname: "startDate-endDate",
              status: ""
            }
          ],

          // form btns
          formBtns: [
            {
              title: "查询",
              htmltype: "submit",
              operate: "searchForm",
              isLimit: "no"
            },
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
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "内容",
            dataIndex: "content",
            key: "content",
            width: 150,
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
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "状态",
            dataIndex: "status",
            key: "status",
            width: 120,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作机构",
            dataIndex: "creatorOrgId",
            key: "creatorOrgId",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "IP地址",
            dataIndex: "ip",
            key: "ip",
            scopedSlots: { customRender: "cursorTitle" }
          }
        ],
        // table数据
        tabledataArr: []
      },
      treeDataObj: {
        isSearch: false,
        isChecked: false,
        dataArr: []
      },
      tempTreeNode: "", //左侧tree--临时选择
      tempCondition: null //临时--table---condition
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
      this.tempPageSize = pageNum;
      this.tempCondition = condition;
      this.$http
        .fetchPost("serviceLog@getFuncLogList.action", {
          page: pageNum,
          limit: limitNum,
          moduleId: this.tempTreeNode,
          startDate:
            !condition || !condition.startDate ? "" : condition.startDate,
          endDate: !condition || !condition.endDate ? "" : condition.endDate,
          creator: !condition || !condition.creator ? "" : condition.creator,
          status: !condition || !condition.status ? "" : condition.status,
          ip: !condition || !condition.ip ? "" : condition.ip
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.tableTotalNum = res.count;
            let tempTableData = res.data;
            this.initArr.tabledataArr = [];
            tempTableData.forEach((element, index) => {
              this.initArr.tabledataArr.push({
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
                creatorOrgId: element.creatorOrgId,
                ip: element.ip
              });
            });
          } else {
            this.$message.error("抱歉，获取数据失败，请刷新后重试！");
          }
        })
        .catch(error => {
          this.$message.error("抱歉，网络异常！");
        })
        .finally(end => {
          this.tableLoading = false;
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
    getTreeData() {
      /**
       * 功能：获取tree数据
       */
      this.$http
        .fetchPost("role@getModuleTree.action", {
          id: "0"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.treeDataObj.dataArr = this.getNewTreeData(
              utils.one2MultiDimensional("0", res.data)
            );
            this.getTableData(null, this.tempPageSize, 10);
          } else {
            this.$message.error("抱歉，获取数据失败，请刷新后重试！");
          }
        })
        .catch(err => {
          this.$message.error("抱歉，网络异常！");
        });
    },
    getNewTreeData(dataArr) {
      /***
       * 功能：根据ant-design-vue格式重组tree数据:替换原来的id为key; name为title
       */
      dataArr.forEach(el => {
        el.title = el.name;
        el.key = el.id;
        el.value = el.id;
        // el.isLeaf = el.isParent === "false" && el.key.length > 10 ? true:null;
        el.isLeaf = el.type === "2" && el.key.length > 10 ? true : null;
        delete el.name;
        delete el.id;
        if (el.children) {
          this.getNewTreeData(el.children);
        }
      });
      return dataArr;
    },
    accepttreeNodeFun(data) {
      // console.log(data);
      this.tempTreeNode = data["key"];
      this.getTableData(this.tempCondition, this.tempPageSize, 10);
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getTreeData();
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
.padCon {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
}
.leftTree {
  width: 14%;
  min-width: 170px;
  height: 100%;
  float: left;
  /* box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); */
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  padding: 10px 12px;
}
.rightTable {
  height: 100%;
  width: 86%;
  max-width: calc(100% - 170px);
  float: right;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
}
</style>