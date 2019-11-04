<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" :loading="tableLoading" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction"></span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          href="javascript:;"
          data-type="添加"
          class="primaryBtnColor"
          @click="operateFun(currentData=slotPropsData.currRowdata, 1)"
        >添加</a>
        <a
          href="javascript:;"
          data-type="浏览"
          @click="operateFun(currentData=slotPropsData.currRowdata, 2)"
        >浏览</a>
      </div>
    </TableView>
    
    <!-- 浏览modal -->
    <div class="addModal">
      <a-modal
        centered
        :title="tempOperateVal === 2 ? '数字化档案材料预览' : '数字化档案材料添加'"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :width="tempOperateVal === 2 ?'80%' : '40%'"
        @cancel="handleCancel"
        style="height:85%;overflow: hidden;"
        :maskClosable="false"
      >
        <!-- 浏览--modal内容 -->
        <InfoOperate
          v-if="tempOperateVal === 2"
          ref="operatePage"
          :operateStatusVal="operateStatus"
          :currRowDataId="operateDataId"
          :addSelectTreeNode="selectTreeNode"
          :ramdomKey="ramdomKey"
        ></InfoOperate>
      
        <!-- 添加--modal内容 -->
        <div class="modalOverFlowAuto" v-else>
            <div class="personInfo">
              <span>姓名</span>
              <span></span>
            </div>
        </div>

        <template slot="footer">
          <a-button key="cancel" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="handleOk" v-if="operateStatus !== 2">提交</a-button>
        </template>
      </a-modal>
    </div>
    
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import InfoOperate from "@/components/infoOperate";
export default {
  name: "RecordPreview",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView, InfoOperate },
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
            dataIndex: "a0100A",
            key: "a0100A",
            fixed: "left",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "姓名",
            dataIndex: "a0101",
            key: "a0101",
            width:200,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "性别",
            dataIndex: "a0104",
            key: "a0104",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "身份证号",
            dataIndex: "a0184",
            key: "a0184",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          
          {
            title: "联系电话",
            dataIndex: "a3707C",
            key: "a3707C",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            fixed:'right',
            scopedSlots: { customRender: "action" }
          }
        ],
        // table数据
        tabledataArr: []
      },
      tempCondition: {},  //临时：condition
      visible: false, //浏览--modal
      confirmLoading: false,  //浏览--modal
      tempOperateVal: null,  //临时--当前操作状态值
      operateStatus: null, //浏览modal---InfoOperate：操作传值
      operateDataId: null, //浏览modal---InfoOperate：当前row：id传值
      selectTreeNode: null,  //浏览modal---InfoOperate：tree传值
      ramdomKey:Math.random(), //确保档案目录数据每次都重新加载
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
      this.tempCondition = condition;
      this.tableLoading = true;
      this.$http.fetchPost('personArchBrowse@getPersonArchBrowseList.action',{
        page: pageNum,
        limit: limitNum,
        a0101: (!condition || !condition.a0101) ? '' : condition.a0101,
        a0100A: (!condition || !condition.a0100A) ? '' : condition.a0100A,
        a0184: (!condition || !condition.a0184) ? '' : condition.a0184
      }).then(res => {
        if(Number(res.code) === 0){
          this.tableTotalNum = res.count;
          let tempTableData = res.data;
          this.initArr.tabledataArr = [];
          tempTableData.forEach((element, index) => {
            this.initArr.tabledataArr.push({
              key: element.a01000,   //唯一key值
              num: (pageNum - 1) * limitNum + index + 1,
              a0100A: element.a0100A,
              a0101: element.a0101,
              a0104: element.a0104 === '1' ? '男' : (element.a0104 === '2' ? '女': ''),
              a0184: element.a0184,
              a3707C: element.a3707C
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

    operateFun(currData, operateVal){
      /**
       * 功能：浏览和添加操作功能
       */
      const _this = this;
      _this.tempOperateVal = _this.operateStatus = operateVal;
      _this.operateDataId = currData['key'];
      if(Number(operateVal) === 1){
        //添加
      } else{
        //浏览
        _this.ramdomKey = Math.random();
      }
      _this.visible = true;
    },

    handleCancel(){
      //modal--关闭
      this.visible = false;
    },
    handleOk(){
      //modal--提交按钮
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // this.getTableData(null, 1, 10);
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
.modalOverFlowAuto{
  height:100%;
  overflow:auto;
}

</style>