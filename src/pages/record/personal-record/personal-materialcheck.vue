<!-- template：该模块当前目录下删除；转到：档案库房管理---档案查(借)阅服务部分 -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" @searchTable="getTableData" ref="updateTable">
      <span slot="formAction">
        <a-button class="buttonOperate" @click="searchRecordFun">查(借)阅记录</a-button>
      </span>
    </TableView>
    <div class="addModal">
      <a-modal
        centered
        title="档案材料查(借)阅记录"
        :visible="visible"
        :width="1300"
        @cancel="handleCancel"
        :footer="null"
        style="height:85%;overflow: hidden;"
      >
        <tableView :initArrData="initRecordArr" @searchTable="getModalTableData"></tableView>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
  name: "PersonalMaterialCheck",
  //import引入的组件需要注入到对象中才能使用
  components: {
    TableView
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
              key: "name",
              name: "name",
              postname: "",
              val: void 0
            },
            {
              title: "身份证号",
              type: "text",
              placeholder: "请输入身份证号",
              key: "idCard",
              name: "idCard",
              postname: "",
              val: void 0
            },
            {
              title: "档案编号",
              type: "text",
              placeholder: "请输入档案编号",
              key: "recordNum",
              name: "recordNum",
              postname: "",
              val: void 0
            },
            {
              title: "申请日期",
              otherType: "daterange",
              placeholder: "请选择申请日期范围",
              key: "applyDate",
              name: "applyDate",
              postname: "",
              val: void 0
            }
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
          { title: "身份证号", dataIndex: "idCard", key: "idCard" },
          { title: "姓名", dataIndex: "name", key: "name" },
          { title: "性别", dataIndex: "gender", key: "gender" },
          { title: "电话号码", dataIndex: "phone", key: "phone" },
          { title: "档案编号", dataIndex: "recordNum", key: "recordNum" },
          {
            title: "存档日期",
            dataIndex: "saveRecordDate",
            key: "saveRecordDate",
            sorter: (a, b) => a.date - b.date
          },
          { title: "档案位置号", dataIndex: "position", key: "position" },
          { title: "在库状态", dataIndex: "status", key: "status" }
        ],
        tabledataArr: []
      },
      initRecordArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false,
        formData: {
          //form inputs
          formInputs: [
            {
              title: "材料类别",
              otherType: "searchSelect",
              required: true,
              placeholder: "请选择材料类别",
              name: "materialType",
              key: "materialType",
              val: void 0,
              postname: "",
              children: [
                { id: 1, title: "履历材料", isdisabled: false },
                { id: 2, title: "自传材料", isdisabled: false }
              ]
            },
            {
              title: "材料名称",
              type: "text",
              placeholder: "请输入材料名称",
              key: "materialName",
              name: "materialName",
              postname: "",
              val: void 0
            },
            {
              title: "查(借)阅单位",
              type: "text",
              placeholder: "请输入查(借)阅单位",
              key: "searchDepart",
              name: "searchDepart",
              postname: "",
              val: void 0
            },
            {
              title: "查(借)阅人",
              type: "text",
              placeholder: "请输入查(借)阅人",
              key: "searchPerson",
              name: "searchPerson",
              postname: "",
              val: void 0
            },
            {
              title: "查(借)阅日期",
              otherType: "daterange",
              placeholder: "请选择查(借)阅日期",
              key: "searchDate",
              name: "searchDate",
              postname: "",
              val: void 0
            }
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
          { title: "材料类别", dataIndex: "materialType", key: "materialType" },
          { title: "材料名称", dataIndex: "materialName", key: "materialName" },
          { title: "页数", dataIndex: "page", key: "page" },
          {
            title: "查(借)阅单位",
            dataIndex: "searchDepart",
            key: "searchDepart"
          },
          {
            title: "查(借)阅人",
            dataIndex: "searchPerson",
            key: "searchPerson"
          },
          {
            title: "查(借)阅电话",
            dataIndex: "searchPhone",
            key: "searchPhone"
          },
          {
            title: "查(借)阅原因",
            dataIndex: "searchReason",
            key: "searchReason"
          },
          {
            title: "查(借)阅内容",
            dataIndex: "searchContent",
            key: "searchContent"
          },
          {
            title: "查(借)阅日期",
            dataIndex: "searchDate",
            key: "searchDate",
            sorter: (a, b) => a.date - b.date
          }
        ],
        tabledataArr: []
      },
      visible: false //模态框默认不可见
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
    getTableData(condition, initableArr) {
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：data:form查询结果：{}
       *  */
      let tempData = [];
      if (condition.length === 0) {
        this.initArr.tabledataArr = initableArr;
      } else {
        tempData = initableArr.filter(item => {
          return Object.keys(condition).every(key => {
            return String(item[key])
              .toLowerCase()
              .includes(
                String(condition[key])
                  .trim()
                  .toLowerCase()
              );
          });
        });
      }
      this.initArr.tabledataArr = tempData;
    },
    getModalTableData(condition, initableArr) {
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：data:form查询结果：{}
       *  */
      let tempData = [];
      if (condition.length === 0) {
        this.initRecordArr.tabledataArr = initableArr;
      } else {
        tempData = initableArr.filter(item => {
          return Object.keys(condition).every(key => {
            return String(item[key])
              .toLowerCase()
              .includes(
                String(condition[key])
                  .trim()
                  .toLowerCase()
              );
          });
        });
      }
      this.initRecordArr.tabledataArr = tempData;
    },
    searchRecordFun() {
      /**
       * 功能：查(借)阅记录功能
       */
      this.visible = true;
    },
    handleCancel() {
      /***
       * 功能：模态框取消操作
       */
      this.visible = false;
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},

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