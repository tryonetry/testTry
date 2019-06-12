<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" @searchTable="getTableData" ref="updateTable">
      <span slot="formAction">
        <a-button class="buttonOperate"  @click="rollOutFun">现场转出</a-button>
      </span>
      <div slot="tableAction">
        <a href="javascript:;">调转</a>
      </div>
    </TableView>
    <div class="addModal">
      <a-modal
        centered
        title="档案内部调转"
        :visible="visible"
        :width="'90%'"
        :confirmLoading="confirmLoading"
        okText="确定"
        cancelText="取消"
        @ok="rollOutApplyFun"
        @cancel="handleCancel"
        style="height:85%;overflow: hidden;"
      >
        <div class="modalContent">
          <TransferOnSite :isInner='true'></TransferOnSite>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import TransferOnSite from "@/components/record/transferOnSite";
export default {
  name: "PersonalTransferInner",
  //import引入的组件需要注入到对象中才能使用
  components: {
    TableView,
    TransferOnSite
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
          { title: "姓名", dataIndex: "name", key: "name" },
          { title: "申请日期", dataIndex: "applyDate", key: "applyDate" },
          { title: "调转日期", dataIndex: "turnDate", key: "turnDate" },
          { title: "调转方式", dataIndex: "turnWays", key: "turnWays" },
          { title: "原单位名称", dataIndex: "originDepartName", key: "originDepartName" },
          { title: "现单位名称", dataIndex: "nowDepartName", key: "nowDepartName" },
          { title: "经办人", dataIndex: "charge", key: "charge" },
          {
            title: "操作",
            key: "action",
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: []
      },
      visible: false, //模态框默认不可见
      confirmLoading: false, //模态框确认按钮加载：默认不加载
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
     rollOutFun() {
      /***
       * 功能：现场转出函数
       *  */
      this.visible = true;
    },
    rollOutApplyFun() {
      /**
       * 功能：模态框：转出申请操作
       */
      this.confirmLoading = true;
      console.log(this.$refs.rollOutInfo.getFormSearchData());
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel() {
      /***
       * 功能：模态框取消操作
       */
      this.visible = false;
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
</style>