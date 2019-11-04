<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" :loading="tableLoading" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction"></span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <!-- <div slot="tableAction"></div> -->
    </TableView>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
  name: "RetirementRemind",
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
            //input
            {
              title: "存档编号",
              type: "text",
              required: false,
              placeholder: "请输入存档编号",
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
              title: "档案状态",
              otherType: "searchSelect",
              required: false,
              placeholder: "请选择档案状态",
              key: "archiveStatus",
              name: "archiveStatus",
              val: void 0,
              children: [
                {
                  itemCode: "0",
                  itemName: "待入库"
                },
                {
                  itemCode: "1",
                  itemName: "已入库"
                },
                {
                  itemCode: "9",
                  itemName: "接收待入库"
                },
              ],
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
              title: "公民身份号码/社保卡号",
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
             // select/searchSelect
            {
              title: "人员身份",
              otherType: "select",
              required: false,
              placeholder: "请选择人员身份",
              key: "archivesIdentity",
              name: "archivesIdentity",
              val: void 0,
              children: [],
              status: ""
            },
            // date
            {
              title: "录入时间",
              otherType: "daterange",
              required: false,
              placeholder: '请选择录入时间',
              key: "startDate-endDate",
              name: "startDate-endDate",
              val: void 0,
              postname: "startDate-endDate",
              status: "",
            },
            {
              title: "剩余月份",
              type: "text",
              required: false,
              placeholder: "请输入剩余月份",
              key: "monthNumber",
              name: "monthNumber",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "monthNumber",
              status: ""
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
            fixed:'left',
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案人姓名",
            dataIndex: "a0101",
            key: "a0101",
            fixed: 'left',
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "性别",
            dataIndex: "a0104",
            key: "a0104",
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "公民身份号码/社保卡号",
            dataIndex: "a0184",
            key: "a0184",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "出生日期",
            dataIndex: "a0107",
            key: "a0107",
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "所属机构",
            dataIndex: "b0101",
            key: "b0101",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "人员身份",
            dataIndex: "archivesIdentity",
            key: "archivesIdentity",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案状态",
            dataIndex: "archiveStatus",
            key: "archiveStatus",
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "退休剩余时间（月）",
            dataIndex: "remainMonth",
            key: "remainMonth",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "是否在库",
            dataIndex: "isInware",
            key: "isInware",
            fixed: 'right',
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          }
        ],
        // table数据
        tabledataArr: []
      }
    };
  },

  //监听属性 类似于data概念
  computed: {
    directoryData:function(){
      if(this.$store.getters.getDirectoryData){
        this.getPersonIdentityFun(this.$store.getters.getDirectoryData);
        return this.$store.getters.getDirectoryData;
      }else{
        return null;
      }
    }
  },

  //监控data中的数据变化
  watch: {
    directoryData:{
      // 改变数据
      handler:function(newVal,oldVal){
        if(newVal){
          this.getPersonIdentityFun(newVal);
        }
      },
      deep:true,//深度监听
    },
  },

  //方法集合
  methods: {
    getTableData(condition, pageNum, limitNum) {
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
       *         */
      this.tableLoading = true;
      this.$http.fetchPost('archDocument@getRetireRemindList.action', {
        page: pageNum,
        limit: limitNum,
        a0100A: (!condition || !condition.a0100A) ? '' : condition.a0100A,
        archiveStatus: (!condition || !condition.archiveStatus) ? '' : condition.archiveStatus,
        a0101: (!condition || !condition.a0101) ? '' : condition.a0101,
        a0184: (!condition || !condition.a0184) ? '' : condition.a0184,
        archivesIdentity: (!condition || !condition.archivesIdentity) ? '' : condition.archivesIdentity,
        startDate: (!condition || !condition.startDate) ? '' : condition.startDate,
        endDate: (!condition || !condition.endDate) ? '' : condition.endDate,
        monthNumber: (!condition || !condition.monthNumber) ? '' : condition.monthNumber,
      }).then(res => {
        if(Number(res.code) === 0){
          this.tableTotalNum = res.count;
          let tempTableData = res.data;
          this.initArr.tabledataArr = [];
          tempTableData.forEach((element, index) => {
            this.initArr.tabledataArr.push({
              key: element.a01000,   //唯一key值
              num: (pageNum - 1) * limitNum + index + 1,
              a0100a: element.a0100a,
              a0101: element.a0101,
              a0104:element.a0104 === '1' ? '男' : (element.a0104 === '2' ? '女': ''),
              a0184: element.a0184,
              a0107: element.a0107,
              b0101: element.b0101,
              archivesIdentity: element.archivesIdentity === '1' ? '干部' : (element.archivesIdentity === '2' ? '工人' : '其他'),
              archiveStatus: element.archiveStatus === '0' ? '待入库' : (element.archiveStatus === '1' ? '已入库' : '接收待入库'),
              remainMonth: element.remainMonth,
              isInware:element.isInware === "2" ? "已转出" : (element.isInware === "0" ?"在库" : '借出')
            })
          });
        } else{
          this.$message.error('抱歉，获取数据失败，请重新刷新！');
        }
      }).catch(error => {
        this.$message.error('抱歉，网络异常！');
      }).finally(end => {
        this.tableLoading = false;
      });
    },
    getPersonIdentityFun(dataArr){
      /**
       * 功能：把获取到的字典人员数据填入到对应的formInputs---children里面
       * 参数：dataArr:字典数据
       */
      if(dataArr){
        this.initArr.formData.formInputs.forEach(element => {
          if(element.key === 'archivesIdentity'){
            element.children = dataArr.personIdentityList;
          }
        });
      }
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    //this.getTableData(null, 1, 10);
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