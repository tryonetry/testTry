<!-- template -->
<template>
  <!-- 档案查(借)阅 -->
  <div class="outer">
    <TableView :initArrData="initArr" @searchTable="getTableData" ref="updateTable">
      <span slot="formAction">
        <a-button class="buttonOperate" type="primary" @click="searchRecordFun">现场申请</a-button>
        <a-button class="buttonOperate" type="primary">批量借出</a-button>
      </span>
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          href="javascript:;"
          class="successBtnColor"
          v-if="slotPropsData.currRowdata.statusOperate== 1"
        >入库</a>
        <a
          href="javascript:;"
          class="warnBtnColor"
          v-if="slotPropsData.currRowdata.statusOperate== 2"
        >借出</a>
        <a href="javascript:;" v-if="slotPropsData.currRowdata.statusOperate== 3">已入库</a>
        <a-popconfirm
          title="确定销户吗?"
          okText="确定"
          cancelText="取消"
          @confirm="deleteFun(slotPropsData.currRowdata, slotPropsData.currTableData)"
        >
          <a href="javascript:;" class="errorBtnColor">删除</a>
        </a-popconfirm>
      </div>
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
        <tableView :initArrData="initRecordArr" @searchTable="getModalTableData">
            <div slot="tableAction">
                <a  href="javascript:;" class="infoBtnColor">申请</a>
            </div>
        </tableView>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
  name: "PersonalCheck",
  //import引入的组件需要注入到对象中才能使用
  components: {
    TableView
  },
  props: [""],

  data() {
    return {
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: true,
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
          { title: "档案编号", dataIndex: "recordNum", key: "recordNum" },
          { title: "单位名称", dataIndex: "departName", key: "departName" },
          { title: "档案人姓名", dataIndex: "name", key: "name" },
          { title: "性别", dataIndex: "gender", key: "gender" },
          { title: "身份证号", dataIndex: "idCard", key: "idCard" },
          { title: "档案位置号", dataIndex: "position", key: "position" },
          { title: "借出状态", dataIndex: "status", key: "status" },
          {
            title: "操作",
            key: "action",
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: [
          {
            key: 1,
            recordName: "36000000000036",
            departName: "北京航星科技有限公司",
            name: "任静",
            gender: "",
            idCard: "623457196504247859",
            position: "",
            status: "待入库",
            statusOperate: 1
          }
        ]
      },
      initRecordArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false,
        formData: {
          //form inputs
          formInputs: [
            {
              title: "单位名称",
              otherType: "searchSelect",
              required: true,
              placeholder: "请选择单位名称",
              name: "departName",
              key: "departName",
              val: void 0,
              postname: "",
              children: [
                { id: 1, title: "景德镇陶瓷学院", isdisabled: false },
                { id: 2, title: "dddd", isdisabled: false }
              ]
            },
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
              title: "档案编号",
              type: "text",
              placeholder: "请输入档案编号",
              key: "recordNum",
              name: "recordNum",
              postname: "",
              val: void 0
            },
            {
              title: "存档日期",
              otherType: "daterange",
              placeholder: "请选择存档日期范围",
              key: "saveRecordDate",
              name: "saveRecordDate",
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
          { title: "联系电话", dataIndex: "phone", key: "phone" },
          {
            title: "存档编号",
            dataIndex: "recordNum",
            key: "recordNum"
          },
          {
            title: "存档日期",
            dataIndex: "saveRecordDate",
            key: "saveRecordDate"
          },
          {
            title: "档案位置号",
            dataIndex: "position",
            key: "position"
          },
          {
            title: "操作",
            key: "action",
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: [
            {key: 1, num: 1, idCard: '123456789098765432', name: '', phone: '', recordNum: '', saveRecordDate: '2016-02-01', position: ''}
        ]
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
    deleteFun(data, currTableData) {
      /**
       * 功能：table：删除操作
       * 参数：data:当前行数据
       */
      console.log(currTableData);
      this.initArr.tabledataArr = currTableData.filter(
        element => data.key !== element.key
      );
      this.$refs.updateTable.changeTableData(); //父组件调用子组件上：更新table函数
      this.$message.success("删除成功");
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