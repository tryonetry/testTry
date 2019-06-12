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
        :width="'90%'"
        :confirmLoading="confirmLoading"
        okText="转出申请"
        cancelText="取消"
        @ok="rollOutApplyFun"
        @cancel="handleCancel"
        style="height:85%;overflow: hidden;"
        :maskClosable='false'
      >
        <TransferOnSite></TransferOnSite>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import TransferOnSite from "@/components/record/transferOnSite";
export default {
  name: "PersonalTransferOut",
  // import引入的组件需要注入到对象中才能使用
  components: {
    TableView,
    TransferOnSite,
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
              key: "applyName",
              name: "applyName",
              postname: "applyName",
              val: void 0
            },
            {
              title: "身份证号/社保卡号",
              type: "text",
              placeholder: "请输入身份证号/社保卡号",
              key: "applyIdNum",
              name: "applyIdNum",
              postname: "applyIdNum",
              val: void 0
            },
            {
              title: "档案编号",
              type: "text",
              placeholder: "请输入档案编号",
              key: "archSerialNum",
              name: "archSerialNum",
              postname: "archSerialNum",
              val: void 0
            },
            {
              title: "申请状态",
              otherType: "select",
              placeholder: "请选择申请状态",
              key: "transferOutState",
              name: "transferOutState",
              postname: "transferOutState",
              val: void 0,
              children:[
                {itemName:'待出库',itemCode:'0'},
                {itemName:'待转出',itemCode:'1'},
                {itemName:'已转出',itemCode:'2'},
                {itemName:'已撤销',itemCode:'3'}
              ]
            },
            {
              title: "申请日期",
              otherType: "daterange",
              placeholder: "请选择申请日期范围",
              key: "startDate-endDate",
              name: "startDate-endDate",
              postname: "startDate-endDate",
              val: [void 0 , void 0]
            },
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
          { 
            title: "姓名", 
            dataIndex: "applyName", 
            key: "name",
            width: 150,
          },
          { 
            title: "申请日期", 
            dataIndex: "applyDate", 
            key: "applyDate",
            width:150,
          },
          { 
            title: "转出原因", 
            dataIndex: "reason", 
            key: "reason" 
          },
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
    getTableData(condition, pageNum, limitNum) {
      const _this = this;
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
      **/
     console.log(condition)
      this.$http.fetchPost('archTransferOut@getArchTransferOutApplyList.action',{
          page: pageNum,
          limit: limitNum,
          ...condition
      }).then((res)=>{
          if(Number(res.code) === 0){
              _this.tableTotalNum = res.count;
              this.initArr.tabledataArr = res.data;
              console.log(res.data)
              this.initArr.tabledataArr.forEach((element, index) => {

                Object.assign(element,{key:element.a01000,num: (pageNum - 1) * limitNum + index + 1,a0104:element.a0104 === "1" ? "男" : "女"});

                // this.initArr.tabledataArr.push({
                //     key: element.a01000, //主键值
                //     num: (pageNum - 1) * limitNum + index + 1, //序号
                //     a01000: element.a01000, //id
                //     a0101: element.a0101, //姓名
                //     a0184: element.a0184, //身份证号
                //     a3707c: element.a3707c, //联系电话
                //     a0100A:element.a0100A, //存档编号
                //     // a0888: element.a0888, //单位名称
                //     // companyNumber: element.companyNumber, //单位编号
                //     // shelvesNo: element.shelvesNo, //档案位置号
                //     uCreateDate: element.uCreateDate, //存档日期
                // });
              });
          }else{
              _this.$message.error("抱歉,暂时未查到数据!");
          }
      })
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