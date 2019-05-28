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
        :width="900"
        :confirmLoading="confirmLoading"
        okText="确定"
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
  name: "PersonalTransferInner",
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
        tabledataArr: [
            {key: 1, num: 1, name: '', applyDate: '', turnDate: '', turnWays: '', originDepartName:'', nowDepartName:'', charge: ''}
        ]
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
                title: "籍贯",
                type: "text",
                required: false,
                disabled: true,
                placeholder: "请输入籍贯",
                key: "nativePlace",
                name: "nativePlace",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入籍贯",
                status: ""
              },
              {
                title: "民族",
                otherType: "searchSelect",
                required: true,
                disabled: true,
                placeholder: "请选择民族",
                name: "national",
                key: "national",
                val: void 0,
                postname: "",
                children: [
                  { id: 1, title: "汉族", isdisabled: false },
                  { id: 2, title: "蒙古族", isdisabled: false }
                ]
              },
              {
                title: "户籍状态",
                type: "text",
                required: false,
                disabled: true,
                placeholder: "请输入户籍状态",
                key: "hjStatus",
                name: "hjStatus",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入户籍状态",
                status: ""
              },
              {
                title: "户籍所在地",
                type: "text",
                required: false,
                disabled: true,
                placeholder: "请输入户籍所在地",
                key: "hjPlace",
                name: "hjPlace",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入户籍所在地",
                status: ""
              },
              {
                title: "现居住地址",
                type: "text",
                required: false,
                disabled: true,
                placeholder: "请输入现居住地址",
                key: "personAddress",
                name: "personAddress",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入现居住地址",
                status: ""
              },
              {
                title: "婚姻状况",
                otherType: "searchSelect",
                required: false,
                disabled: true,
                placeholder: "请选择婚姻状况",
                name: "marriageStatus",
                key: "marriageStatus",
                val: void 0,
                postname: "",
                children: [
                  { id: 1, title: "已婚", isdisabled: false },
                  { id: 2, title: "未婚", isdisabled: false }
                ]
              },
              {
                title: "健康状况",
                otherType: "searchSelect",
                required: false,
                disabled: true,
                placeholder: "请选择健康状况",
                name: "healthStatus",
                key: "healthStatus",
                val: void 0,
                postname: "",
                children: [
                  { id: 1, title: "健康或良好", isdisabled: false },
                  { id: 2, title: "一般或较弱", isdisabled: false }
                ]
              },
              {
                title: "政治面貌",
                otherType: "searchSelect",
                required: true,
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
                title: "参加工作年月",
                otherType: "date",
                required: false,
                disabled: true,
                placeholder: "请选择参加工作年月",
                key: "joinWorkDate",
                name: "joinWorkDate",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请选择参加工作年月",
                status: ""
              },
              {
                title: "紧急联系人",
                type: "text",
                required: false,
                disabled: true,
                placeholder: "请输入紧急联系人",
                key: "emergency",
                name: "emergency",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入紧急联系人",
                status: ""
              },
              {
                title: "电子邮箱",
                type: "text",
                required: false,
                disabled: true,
                placeholder: "请输入电子邮箱",
                key: "email",
                name: "email",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入电子邮箱",
                status: ""
              },
              {
                title: "手机号码",
                type: "text",
                required: true,
                disabled: true,
                placeholder: "请输入手机号码",
                key: "phone",
                name: "phone",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入手机号码",
                status: ""
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
                title: "最高学历所学专业",
                type: "text",
                required: true,
                disabled: true,
                placeholder: "请输入最高学历所学专业",
                key: "professional",
                name: "professional",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入最高学历所学专业",
                status: ""
              },
              {
                title: "最高学历毕业院校",
                type: "text",
                required: true,
                disabled: true,
                placeholder: "请输入最高学历毕业院校",
                key: "graduateSchool",
                name: "graduateSchool",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入最高学历毕业院校",
                status: ""
              },
              {
                title: "最高学历毕业日期",
                otherType: "date",
                required: true,
                disabled: true,
                placeholder: "请选择最高学历毕业日期",
                key: "graduateDate",
                name: "graduateDate",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请选择最高学历毕业日期",
                status: ""
              },
              {
                title: "单位名称",
                type: "text",
                required: true,
                disabled: true,
                placeholder: "请输入单位名称",
                key: "departName",
                name: "departName",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请输入单位名称",
                status: ""
              },
              {
                title: "备注",
                otherType: "textarea",
                required: false,
                disabled: true,
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
            ]
          }
        },
        {
          cardTitle: "调转信息",
          //form
          formData: {
            //inputs
            formInputs: [
              {
                title: "调转日期",
                otherType: "date",
                required: false,
                placeholder: "请选择调转日期",
                key: "rollOutDate",
                name: "rollOutDate",
                val: void 0,
                postname: "",
                maxlength: 20,
                minlength: 0,
                reg: "",
                tip: "* 请选择调转日期",
                status: ""
              },
              {
                title: "调转方式",
                otherType: "searchSelect",
                required: false,
                placeholder: "请选择调转方式",
                name: "rollOutWay",
                key: "rollOutWay",
                val: void 0,
                postname: "",
                children: [
                  { id: 1, title: "xxxxx", isdisabled: false },
                  { id: 2, title: "yyyyy", isdisabled: false }
                ]
              },
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