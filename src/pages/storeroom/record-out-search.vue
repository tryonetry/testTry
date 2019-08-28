<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" :loading="tableLoading" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction"></span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <!-- <div slot="tableAction" slot-scope="slotPropsData"></div> -->
    </TableView>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
  name: "RecordOutSearch",
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
              title: "身份证/社保卡号",
              type: "text",
              required: false,
              placeholder: "请输入身份证/社保卡号",
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
            // select/searchSelect
            {
              title: "出库类型",
              otherType: "select",
              required: false,
              placeholder: "请选择出库类型",
              key: "ao0102",
              name: "ao0102",
              postname: "ao0102",
              val: void 0,
              children: [
                {
                  itemCode: "1",
                  itemName: "档案查阅"
                },
                {
                  itemCode: "2",
                  itemName: "档案转出"
                }
              ],
              status: ""
            },
            // date
            {
              title: "出库时间",
              otherType: "daterange",
              required: false,
              placeholder: "请选择出库时间",
              key: "startDate-endDate",
              name: "startDate-endDate",
              val: void 0,
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
            width: 60,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "存档编号",
            dataIndex: "a0100a",
            key: "a0100a",
            fixed: 'left',
            width: 250,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案人姓名",
            dataIndex: "a0101",
            key: "a0101",
            fixed: 'left',
            width: 200,
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
            title: "身份证号",
            dataIndex: "a0184",
            key: "a0184",
            width: 250,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "出库类型",
            dataIndex: "ao0102",
            key: "ao0102",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "经办人",
            dataIndex: "ao0103",
            key: "ao0103",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "交接人",
            dataIndex: "ao0104",
            key: "ao0104",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "出库日期",
            dataIndex: "ao0105",
            key: "ao0105",
            sorter: (a, b) => a.ao0105 && b.ao0105 && Number(a.ao0105.replace(/[\s+|\-|:]/g,'')) - Number(b.ao0105.replace(/[\s+|\-|:]/g,'')),
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "出库说明",
            dataIndex: "REMARKS",
            key: "REMARKS",
            width: 200,            
            fixed: 'right',
            scopedSlots: { customRender: "cursorTitle" }
          },
        ],
        // table数据
        tabledataArr: []
      }
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
      this.$http.fetchPost('archDocument@getarchOutRecordsList.action', {
        page: pageNum,
        limit: limitNum,
        a0100a: (!condition || !condition.a0100a) ? '' : condition.a0100a,
        a0101: (!condition || !condition.a0101) ? '' : condition.a0101,
        a0184: (!condition || !condition.a0184) ? '' : condition.a0184,
        ao0102: (!condition || !condition.ao0102) ? '' : condition.ao0102,
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
              key: element.ao01000,
              a0100a: element.a0100a,
              a0101: element.a0101,
              a0104: element.a0104 === '1' ? '男' : (element.a0104 === '2' ? '女' : (element.a0104 === '9' ? '未说明的性别' : '未知的性别')),
              a0184: element.a0184,
              ao0102: element.ao0102 === '1' ? '档案查询' : '档案转出',
              ao0103: element.ao0103, 
              ao0104: element.ao0104,
              ao0105: element.ao0105,
              REMARKS: element.REMARKS
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