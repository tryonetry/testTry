<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" :loading="tableLoading" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
          <a-button class="buttonOperate" @click="operateFun(null, '1')">批量出库</a-button>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          href="javascript:;"
          @click="operateFun(slotPropsData.currRowdata, '2')"
          data-type="出库"
          class="primaryBtnColor"
        >出库</a>
        <a-popconfirm
          title="确定撤销吗?"
          okText="确定"
          cancelText="取消"
          @confirm="recallFun(slotPropsData.currRowdata)"
        >
          <a href="javascript:;" class="errorBtnColor">撤销</a>
        </a-popconfirm>
      </div>
    </TableView>

    <!-- 出库modal -->
    <div class="addModal">
      <a-modal
        centered
        :visible="visible"
        :confirmLoading="confirmLoading"
        width="50%"
        @cancel="handleCancel"
        :maskClosable="false"
        style="height:85%;overflow: hidden;"
      >
        <div slot="title" class="roomModalTitleSlot">
          <p>{{operateStatus== '1'? '档案转出批量出库登记': '档案转出出库登记'}}</p>
          <span>{{currentRowData && currentRowData.a0101}}</span>
        </div>

        <div style="height:100%;overflow:auto;">
          <TableFromSearch :formDataArr="checkoutForm" :layout="layoutModal" ref="checkoutForm"></TableFromSearch>
        </div>
        <template slot="footer">
            <a-button key="cancel" @click="handleCancel">取消</a-button>
            <a-button key="submit" type="primary" @click="handleOk">提交</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import TableFromSearch from "../../components/tableFormSearch";
import utils from "../../utils/util.js";
import moment from 'moment';
export default {
  name: "RecordCheckOut",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView, TableFromSearch },
  props: [""],

  data() {
    return {
      tableTotalNum: 0, //总页数：默认为0
      tableLoading: false,  //table loading
      // tableView传值方式
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: true, //table是否可以check
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
            {
              title: "档案位置号",
              type: "text",
              required: false,
              placeholder: "请输入档案位置号(区-层-列-号)",
              key: "shelvesNo",
              name: "shelvesNo",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "shelvesNo",
              status: ""
            },
            // select/searchSelect
            {
              title: "出库类型",
              otherType: "select",
              required: false,
              placeholder: "请选择出库类型",
              key: "outwareType",
              name: "outwareType",
              postname: "outwareType",
              val: 'transferout',
              children: [
                {
                  itemCode: "transferout",
                  itemName: "档案转出"
                }
              ],
              status: ""
            }
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
            fixed: "left",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案人姓名",
            dataIndex: "a0101",
            key: "a0101",
            fixed: "left",
            width: 200,
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
            title: "公民身份号码/社保卡号",
            dataIndex: "a0184",
            key: "a0184",
            width: 350,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "库房位置",
            dataIndex: "shelvesNo",
            key: "shelvesNo",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            fixed: 'right',
            width: 200,
            scopedSlots: { customRender: "action" }
          }
        ],
        // table数据
        tabledataArr: []
      },
      tempCondition:{},  //临时查询条件
      operateStatus: null, //操作状态值， 1--批量出库，； 2--出库
      visible: false,     //modal--默认false，不显示
      confirmLoading: false,   //modal--默认false，不加载
      checkoutForm:{
        formInputs:[
          {
            title: "申请人",
            type: "text",
            required: false,
            placeholder: "请输入申请人",
            key: "applyName",
            name: "applyName",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "请输入申请人",
            postname: "applyName",
            status: "",
            isHide: false,
            disabled: true,
            colWidth: [12, 24]
          },
          {
              title: '申请日期',
              otherType: 'date',  
              required: false,
              placeholder: '请选择申请日期',
              key: "applyDate",
              name: "applyDate",
              val: void 0,
              postname: "applyDate",
              status: '',
              isHide: false,
              disabled: true,
              colWidth: [12, 24]
          },
          {
            title: "出库经办人",
            type: "text",
            required: false,
            placeholder: "请输入出库经办人",
            key: "outwareOperatorName",
            name: "outwareOperatorName",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "请输入出库经办人",
            postname: "outwareOperatorName",
            status: "",
            isHide: false,
            disabled: true,
            colWidth: [12, 24]
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
            tip: "请输入存档编号",
            postname: "a0100a",
            status: "",
            isHide: false,
            disabled: true,
            colWidth: [12, 24]
          },
          {
            title: "档案位置号",
            type: "text",
            required: false,
            placeholder: "请输入档案位置号",
            key: "shelvesNo",
            name: "shelvesNo",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "请输入档案位置号",
            postname: "shelvesNo",
            status: "",
            isHide: false,
            disabled: true,
            colWidth: [12, 24]
          },
          {
            title: '出库日期',
            otherType: 'date',  
            required: false,
            placeholder: '请选择出库日期',
            key: "outwareDate",
            name: "outwareDate",
            val: moment(new Date(), 'YYYY-MM-DD'),
            postname: "outwareDate",
            status: '',
            tip: '请选择出库日期',
            isHide: false,
            disabled: true,
            colWidth: [12, 24]
          },
          {
            title: "出库说明",
            otherType: "textarea",
            required: false,
            placeholder: "请输入出库说明",
            key: "outwareDesc",
            name: "outwareDesc",
            val: void 0,
            postname: "outwareDesc",
            maxlength: 200,
            minlength: 0,
            reg: "",
            tip: "* 请输入出库说明",
            status: "",
            colWidth: [24, 24]
          },
        ]
      },
      layoutModal:{
        defaultCon: {
          labelCol: {
            sm: { span: 6 },
            xl: { span: 6 },
            xxl: { span: 6 }
          },
          wrapperCol: {
            sm: { span: 18 },
            xl: { span: 16 },
            xxl: { span: 16 }
          }
        },
        textareaCon: {
          labelCol: {
            sm: { span: 6 },
            xl: { span: 6 },
            xxl: { span: 3 }
          },
          wrapperCol: {
            sm: { span: 18 },
            xl: { span: 16 },
            xxl: { span: 20 }
          }
        },
      },
      currOperateId: null, //当前操作的id
      batchOperateIdStr: null,  //批量操作--id字符串
      currentRowData: null,  //当前行数据
    };
  },

  //监听属性 类似于data概念
  computed: {
    checkTableData: function() {
      return this.$store.getters.getinfoTableCheckData;
    },
  },

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
      this.tempCondition = condition;
      this.$http.fetchPost('archDocument@getArchOutWareList.action', {
        page: pageNum,
        limit: limitNum,
        a0100a: (!condition || !condition.a0100a) ? '' : condition.a0100a,
        a0101: (!condition || !condition.a0101) ? '' : condition.a0101,
        a0184: (!condition || !condition.a0184) ? '' : condition.a0184,
        outwareType: (!condition || !condition.outwareType) ? 'transferout' : condition.outwareType,
        shelvesNo: (!condition || !condition.shelvesNo) ? '' : condition.shelvesNo
      }).then(res => {
        if(Number(res.code) === 0){
          this.tableTotalNum = res.count;
          let tempTableData = res.data;
          this.initArr.tabledataArr = [];
          tempTableData.forEach((element, index) => {
            this.initArr.tabledataArr.push({
              num: (pageNum - 1) * limitNum + index + 1,
              key: element.id,
              a0100a: element.a0100a,
              a0101: element.a0101,
              a0104: element.a0104 === '1' ? '男' : (element.a0104 === '2' ? '女' : (element.a0104 === '9' ? '未说明的性别' : (element.a0104 === '0' ? '未知的性别' : ''))),
              a0184: element.a0184,
              shelvesNo: element.shelvesNo,
              applyName: element.applyName,
              applyDate: element.applyDate,
              outwareOperatorName: element.operatorName,
              outwareDesc: element.outwareDesc
            })
          });
        } else{
          this.$message.error('抱歉，获取数据失败，请刷新后重试！');
        }
      }).catch(error => {
        this.$message.error('抱歉，网络异常！');
      }).finally(end => {
        this.tableLoading = false;
      });
    },
    operateFun(currData, operateVal){
      /**
       * 功能：批量出库、出库操作
       * 参数：currData：当前row数据[为批量出库时，为null]; operateVal:当前操作状态值， 1--批量出库；2--出库
       */
      const _this = this; 
      _this.operateStatus = operateVal;
      _this.currentRowData = currData;
      if(currData && operateVal === '2'){
        //出库
        _this.checkoutForm.formInputs.forEach(el => {
          if(el.key === 'applyName' || el.key === 'applyDate' || el.key === 'a0100a' || el.key === 'shelvesNo'){
            el.isHide = false;
          }
        });
        _this.currOperateId = currData['key'];
        _this.visible = true;
        _this.checkoutForm = utils.getNewFormSearch(currData, _this.checkoutForm);
      } else{
        //批量出库
        _this.checkoutForm.formInputs.forEach(el => {
          if(el.key === 'applyName' || el.key === 'applyDate' || el.key === 'a0100a' || el.key === 'shelvesNo'){
            el.isHide = true;
          } else if(el.key === 'outwareOperatorName' || el.key === 'outwareDesc'){
            el.val = void 0;
          }
        });
        if(_this.checkTableData && _this.checkTableData.length > 0){
          _this.visible = true;
          _this.batchOperateIdStr = utils.borrowFun(_this.checkTableData, 'key');
        } else{
          _this.$message.error('请至少选择一条需要出库的档案申请信息进行批量出库操作!')
        }
      }
    },

    handleCancel(){
      this.visible = false;
    },
    handleOk(){
      /**
       * 功能：modal---提交操作
       */
      const _this = this;
      let resultForm =  _this.$refs.checkoutForm.getFormData();
      if(resultForm['isRight']){
        let currPostObj = resultForm['postObj'];
        if(_this.operateStatus === '2'){
          //出库操作
          currPostObj.id = _this.currOperateId;
          _this.$http.fetchPost('archDocument@archTransferoutOutWare.action', currPostObj).then(res => {
            if(Number(res.code) === 0){
              _this.$message.success('出库成功！');
              _this.getTableData(_this.tempCondition, 1, 10);
              setTimeout(() => {
                _this.visible = false;
                _this.confirmLoading = false;
              })
            } else{
              _this.$message.error('抱歉，操作失败，请刷新后重试！');
            }
          }).catch(error => {
            _this.$message.error('抱歉，网络异常！');
          })
        } else if(_this.operateStatus === '1'){
          //批量操作
          currPostObj.ids = _this.batchOperateIdStr;
          _this.$http.fetchPost('archDocument@archTransferoutOutWares.action', currPostObj).then(res => {
            if(Number(res.code) === 0){
              _this.$message.success('出库成功！');
              _this.getTableData(_this.tempCondition, 1, 10);
              setTimeout(() => {
                _this.visible = false;
                _this.confirmLoading = false;
              })
            } else{
              _this.$message.error('抱歉，操作失败，请刷新后重试！');
            }
          }).catch(error => {
            _this.$message.error('抱歉，网络异常！');
          })
        }
      }
    },
    recallFun(currData){
      /**
       * 功能：撤回操作;
       * 参数：currData:当前row数据
       */
      this.$http.fetchPost('archDocument@archTransferoutOutCancel.action',{
        id: currData['key']
      }).then(res => {
        if(Number(res.code) === 0){
          this.$message.success('撤回成功！');
          this.getTableData(this.tempCondition, 1, 10);
        } else{
          this.$message.error('抱歉，操作失败，请刷新后重试！');
        }
      }).catch(error => {
        this.$message.error('抱歉，网络异常！');
      })
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getTableData(null, 1, 10);
    this.$store.dispatch("getinfoTableCheckData", []);
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