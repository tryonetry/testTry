<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" @searchTable="getTableData" ref="updateTable" :totalCount="tableTotalNum" :loading="tableLoading">
      <span slot="formAction">
        <a-button class="buttonOperate"  @click="rollOutFun">现场调转</a-button>
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
        @cancel="handleCancel"
        style="height:85%;overflow: hidden;"
        :maskClosable='false'
      >
        <template slot="footer">
            <a-button key="back" @click="handleCancel">取 消</a-button>
            <a-button key="submit" type="primary" :loading='confirmLoading' @click="rollOutApplyFun">调 转</a-button>
        </template>
        <div class="modalContent">
          <TransferOnSite 
            :isInner='true' 
            :showRandom='showRandom'
            ref="transferChild"
            :handleCancel='handleCancel'
            :requestData="requestData"
            @sendBtnStatus="getBtnStatus"
          ></TransferOnSite>
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
              key: "a0101",
              name: "a0101",
              postname: "a0101",
              val: void 0
            },
            {
              title: "公民身份号码/社保卡号",
              type: "text",
              placeholder: "请输入公民身份号码/社保卡号",
              key: "a0184",
              name: "a0184",
              postname: "a0184",
              val: void 0
            },
            {
              title: "存档编号",
              type: "text",
              placeholder: "请输入存档编号",
              key: "a0100a",
              name: "a0100a",
              postname: "",
              val: void 0
            },
            // {
            //   title: "申请日期",
            //   otherType: "daterange",
            //   placeholder: "请选择申请日期范围",
            //   key: "applyDate",
            //   name: "applyDate",
            //   postname: "",
            //   val: void 0
            // }
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
            dataIndex: "a0101",
            key: "a0101",
            fixed:'left',
            width:200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "公民身份号码/社保卡号",
            dataIndex: "a0184",
            key: "a0184",
            fixed:'left',
            width:200,
          },
          { 
            title: "调转日期", 
            dataIndex: "transferDate", 
            key: "transferDate",
            width:150,
          },
          { 
            title: "调转方式", 
            dataIndex: "transferType", 
            key: "transferType",
            width:200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "原委托存档单位名称", 
            dataIndex: "oldCompanyName", 
            key: "originDepartName",
            width:250,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "现委托存档单位名称", 
            dataIndex: "transferCompanyName", 
            key: "transferCompanyName",
            width:250,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "经办人", 
            dataIndex: "changeUser", 
            key: "changeUser",
            width:200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "备注",
            dataIndex: "remarks",
            key: "remarks",
            scopedSlots: { customRender: "cursorTitle" }
          }
        ],
        tabledataArr: []
      },
      visible: false, //模态框默认不可见
      confirmLoading: false, //模态框确认按钮加载：默认不加载
      showRandom:Math.random(), // 点击更新数据
      tempCondition:{},
      tableTotalNum:0,
      tableLoading:false,
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
      this.tableLoading = true;
      this.tempCondition = condition;
      this.$http.fetchPost('personalArch@getInternalTransferList.action',{
          page: pageNum,
          limit: limitNum,
          ...condition
      }).then((res)=>{
          if(Number(res.code) === 0){
              this.tableTotalNum = res.count;
              this.initArr.tabledataArr = res.data;
              this.initArr.tabledataArr.forEach((element, index) => {
                Object.assign(element,{
                  key:element.id,
                  num: (pageNum - 1) * limitNum + index + 1,
                  transferType: element.transferType === '1' ? '集体转集体' : element.transferType === '2' ? '集体转个人' : element.transferType === '3' ? '个人转集体' : '',
                });
              });

              // console.log(this.initArr.tabledataArr)
          }else{
              _this.$message.error("抱歉,暂时未查到数据!");
          }
      }).catch(err => {
        _this.$message.error("抱歉,网络异常,请稍后重试");
      }).finally(end => {
        _this.tableLoading = false;
      })
    },

    rollOutFun() {
      /***
       * 功能：现场转出函数
       *  */
      this.showRandom = Math.random();
      this.visible = true;
      // 清除 form 数据
      this.$nextTick(function(){
        this.$refs.transferChild.claerForm('formDataInner');
      })
    },

    // 转出申请
    rollOutApplyFun() {
      this.$refs.transferChild.confirmOrTransferOut();
    },

    // 关闭模态框
    handleCancel() {
      this.visible = false;
    },

    // 获取当前的 btn 的 提交状态
    getBtnStatus(status){
      this.confirmLoading = status;
    },

    // 重新获取数据
    requestData(){
      this.getTableData(this.tempCondition,1,10);
    },
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // this.getTableData(null,1,10);
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