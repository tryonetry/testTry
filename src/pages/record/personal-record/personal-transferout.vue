<!-- template -->
<template>
  <!-- 档案转出 -->
  <div class="outer">
    <TableView :initArrData="initArr" @searchTable="getTableData" ref="updateTable">
      <span slot="formAction">
        <a-button class="buttonOperate" @click="rollOutFun">现场转出</a-button>
      </span>
    </TableView>
    <div class="addModal">
      <a-modal
        centered
        title="个人档案转出"
        :visible="visible"
        :width="900"
        :confirmLoading="confirmLoading"
        okText="转出申请"
        cancelText="取消"
        @ok="rollOutApplyFun"
        @cancel="handleCancel"
        style="height:85%;overflow: hidden;"
      >
        <div class="modalContent">
          <TableFromSearch :formDataArr="searchFormData"></TableFromSearch>
          <RecordInfo :infoData="recordInfoData" ref="rollOutInfo"></RecordInfo>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import RecordInfo from "../../../components/record-info";
import TableFromSearch from "../../../components/tableFormSearch";
export default {
  name: "PersonalTransferOut",
  //import引入的组件需要注入到对象中才能使用
  components: {
    TableView,
    RecordInfo,
    TableFromSearch
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
          { title: "转出原因", dataIndex: "reason", key: "reason" },
          { title: "档案管理机构", dataIndex: "organ", key: "organ" },
          {
            title: "档案转往机构",
            dataIndex: "acceptOrgan",
            key: "acceptOrgan"
          },
          { title: "转出状态", dataIndex: "status", key: "status" },
          {
            title: "转出日期",
            dataIndex: "rollOutDate",
            key: "rollOutDate",
            sorter: (a, b) => a.date - b.date
          },
          { title: "经办人", dataIndex: "charge", key: "charge" },
          { title: "备注", dataIndex: "notes", key: "notes" }
        ],
        tabledataArr: []
      },
      searchFormData: {
        //inputs
        formInputs: [
          {
            title: "姓名",
            type: "text",
            required: false,
            placeholder: "请输入姓名",
            key: "searchName",
            name: "searchName",
            val: void 0,
            postname: "",
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "* 请输入姓名",
            status: ""
          },
          {
            title: "身份证号",
            type: "text",
            required: false,
            placeholder: "请输入身份证号",
            key: "searchIdCard",
            name: "searchIdCard",
            val: void 0,
            postname: "",
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "* 请输入身份证号",
            status: ""
          }
        ],
        //btns
        formBtns: [{ title: "查询", htmltype: "submit", operate: "searchForm" }]
      },
      visible: false, //模态框默认不可见
      confirmLoading: false, //模态框确认按钮加载：默认不加载
      recordInfoData: [
        //个人档案转出模态框渲染
        {
          cardTitle: "存档人员基本信息",
          //form
          formData: {
            // inpts
            formInputs: [
              {
                title: "身份证号码",
                type: "text",
                required: false,
                disabled: true,
                placeholder: "请输入身份证号码",
                key: "personIdCard",
                name: "personIdCard",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入身份证号码",
                status: ""
              },
              {
                title: "姓名",
                type: "text",
                required: false,
                disabled: true,
                placeholder: "请输入姓名",
                key: "personName",
                name: "personName",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入姓名",
                status: ""
              },
              {
                title: "曾用名",
                type: "text",
                required: false,
                disabled: true,
                placeholder: "请输入曾用名",
                key: "personUsedName",
                name: "personUsedName",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入曾用名",
                status: ""
              },
              {
                title: "性别",
                otherType: "searchSelect",
                required: false,
                disabled: true,
                placeholder: "请选择性别",
                name: "personGender",
                key: "personGender",
                val: void 0,
                postname: "",
                children: [
                  { id: 1, title: "女", isdisabled: false },
                  { id: 2, title: "男", isdisabled: false }
                ]
              },
              {
                title: "出生年月",
                otherType: "date",
                required: false,
                disabled: true,
                placeholder: "请选择出生年月",
                key: "personBirthday",
                name: "personBirthday",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请选择出生年月",
                status: ""
              },
              {
                title: "政治面貌",
                otherType: "searchSelect",
                required: false,
                disabled: true,
                placeholder: "请选择政治面貌",
                name: "politicsStatus",
                key: "politicsStatus",
                val: void 0,
                postname: "",
                children: [
                  { id: 1, title: "中共党员", isdisabled: false },
                  { id: 2, title: "中共预备党员", isdisabled: false }
                ]
              },
              {
                title: "最高学历",
                otherType: "searchSelect",
                required: false,
                disabled: true,
                placeholder: "请选择最高学历",
                name: "education",
                key: "education",
                val: void 0,
                postname: "",
                children: [
                  { id: 1, title: "博士", isdisabled: false },
                  { id: 2, title: "硕士", isdisabled: false }
                ]
              },
              {
                title: "存档性质",
                otherType: "searchSelect",
                required: false,
                disabled: true,
                placeholder: "请选择存档性质",
                name: "recordSaveType",
                key: "recordSaveType",
                val: void 0,
                postname: "",
                children: [
                  { id: 1, title: "xxxxx", isdisabled: false },
                  { id: 2, title: "yyyyy", isdisabled: false }
                ]
              },
              {
                title: "存档日期",
                otherType: "date",
                required: false,
                disabled: true,
                placeholder: "请选择存档日期",
                key: "recordDate",
                name: "recordDate",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请选择存档日期",
                status: ""
              },
              {
                title: "存档编号",
                type: "text",
                required: false,
                disabled: true,
                placeholder: "请输入存档编号",
                key: "recordNumber",
                name: "recordNumber",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入请输入存档编号",
                status: ""
              },
              {
                title: "联系电话",
                type: "text",
                required: false,
                disabled: true,
                placeholder: "请输入联系电话",
                key: "personPhone",
                name: "personPhone",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入联系电话",
                status: ""
              },
              {
                title: "居住地址",
                type: "text",
                required: false,
                disabled: true,
                placeholder: "请输入居住地址",
                key: "personAddress",
                name: "personAddress",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入居住地址",
                status: ""
              }
            ]
          }
        },
        {
          cardTitle: "转出信息",
          //form
          formData: {
            //inputs
            formInputs: [
              {
                title: "申请人",
                type: "text",
                required: false,
                placeholder: "请输入申请人",
                key: "personApply",
                name: "personApply",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入申请人",
                status: ""
              },
              {
                title: "身份证号",
                type: "text",
                required: false,
                placeholder: "请输入申请人身份证号",
                key: "applyIdCard",
                name: "applyIdCard",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入申请人身份证号",
                status: ""
              },
              {
                title: "申请日期",
                otherType: "date",
                required: false,
                placeholder: "请选择申请日期",
                key: "applyDate",
                name: "applyDate",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请选择申请日期",
                status: ""
              },
              {
                title: "转出原因",
                otherType: "searchSelect",
                required: false,
                placeholder: "请选择转出原因",
                name: "rollOutReason",
                key: "rollOutReason",
                val: void 0,
                postname: "",
                children: [
                  { id: 1, title: "xxxxx", isdisabled: false },
                  { id: 2, title: "yyyyy", isdisabled: false }
                ]
              },
              {
                title: "原存档单位名称",
                type: "text",
                required: false,
                placeholder: "请输入原存档单位名称",
                key: "originOrgan",
                name: "originOrgan",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入原存档单位名称",
                status: ""
              },
              {
                title: "转往单位名称",
                type: "text",
                required: false,
                placeholder: "请输入转往单位名称",
                key: "NowOrgan",
                name: "NowOrgan",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入转往单位名称",
                status: ""
              },
              {
                title: "转往单位地址",
                type: "text",
                required: false,
                placeholder: "请输入转往单位地址",
                key: "NowAddress",
                name: "NowAddress",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入转往单位地址",
                status: ""
              },
              {
                title: "备注",
                otherType: "textarea",
                required: false,
                placeholder: "请输入备注",
                key: "notes",
                name: "notes",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入备注",
                status: ""
              },
              {
                title: "调档函上传",
                otherType: "upload",
                required: false,
                key: "upload",
                name: "upload",
                val: void 0,
                postname: "",
                multiple: true, //是否支持多选文件
                action: "//jsonplaceholder.typicode.com/posts/", //上传地址
                listType: "text" //上传列表的内建样式
              }
            ]
          }
        }
      ]
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
.modalContent{
  overflow-y: auto;
  height: 100%;
}
</style>