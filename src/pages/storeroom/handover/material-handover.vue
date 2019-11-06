<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" :loading="tableLoading" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
        <a-button class="buttonOperate" @click="acceptRecordFun">接收</a-button>
        <a-button type="primary" class="buttonOperate" @click="printFun">打印回执</a-button>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <!-- <div slot="tableAction" slot-scope="slotPropsData"></div> -->
    </TableView>

    <!-- 打印模态框 -->
    <div class="addModal">
      <a-modal
        centered
        title="交接清单预览"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :width="modalWidth"
        @cancel="handleCancel"
        style="height:85%;overflow: hidden;"
        :maskClosable="false"
      >
        <div class="modalInnerContainer">
          <!-- 打印模板 -->
          <TemplateOfPrint :fileNum="fileNum" :firstTitle="firstTitle" :secondTitle="secondTitle" ref="print">
              <div slot="printContent" class="printContent">
                <p class="indent">
                  今收到<span class="redSpan">{{currRow && currRow.perName}}</span>同志（档案管理编号：<span class="noFontColorSpan">{{currRow && currRow.archNumber}}</span>)<span class="redSpan">{{currRow && currRow.materialNames}}</span>等材料，共（<span class="redSpan">{{currRow && currRow.materialNums}}</span>）份（套）
                </p>
                <div class="bottom">
                  <div class="bottomRight">
                      <p>签收人：{{currRow && currRow.signName}}</p>
                      <p>日期：{{nowData}}</p>
                  </div>
                </div>
              </div>
          </TemplateOfPrint>
        </div>
        <template slot="footer">
            <a-button key="back" @click="handleCancel">取 消</a-button>
            <a-button key="submit" type="primary"  @click="print">打 印</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import TemplateOfPrint from '@/components/templateOfPrint';
import utils from '@/utils/util.js'
import moment from "moment";
export default {
  name: "MaterialHandover",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView, TemplateOfPrint },

  props: [],
  
  data() {
    return {
      utils,
      moment,
      tableTotalNum: 0, //总页数：默认为0
      tableLoading: false,  //tableloading
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
              key: "e0102",
              name: "e0102",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "e0102",
              status: ""
            },
            {
              title: "公民身份号码/社保卡号",
              type: "text",
              required: false,
              placeholder: "请输入公民身份号码/社保卡号",
              key: "e0104",
              name: "e0104",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "e0104",
              status: ""
            },
            {
              title: "存档编号",
              type: "text",
              required: false,
              placeholder: "请输入存档编号",
              key: "e0101",
              name: "e0101",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "e0101",
              status: ""
            },
            {
              title: "经办人",
              otherType: "searchSelect",
              required: false,
              placeholder: "请选择经办人",
              key: "e0108",
              name: "e0108",
              val: void 0,
              children: [],
              status: ""
            },
            // date
            {
              title: "接收日期",
              otherType: "daterange",
              required: false,
              placeholder: "请选择接收日期",
              key: "startDate-endDate",
              name: "startDate-endDate",
              val: [void 0, void 0],
              postname: "startDate-endDate",
              status: ""
              //   disabledDate: "disabledEndDate", //函数名：只能选今天和今天以前的
              //   disabledStartDate: "disabledStartDate" //函数名：只能选今天和今天以后的
            },
            // select/searchSelect
            {
              title: "接收状态",
              otherType: "select",
              required: false,
              placeholder: "请选择接收状态",
              key: "e0112",
              name: "e0112",
              val: void 0,
              children: [
                {
                  itemCode: "1",
                  itemName: "待接收"
                },
                {
                  itemCode: "0",
                  itemName: "已接收"
                },
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
            title: "接收日期",
            fixed: "left",
            width: 120,
            dataIndex: "e0106a",
            key: "e0106a",
            sorter: (a, b) => a.e0106a && b.e0106a && Number(a.e0106a.replace(/-/g,'')) - Number(b.e0106a.replace(/-/g,'')),
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "存档编号",
            dataIndex: "e0101",
            key: "e0101",
            width: 200,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "姓名",
            dataIndex: "e0102",
            key: "e0102",
            width: 100,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "性别",
            dataIndex: "e0103",
            key: "e0103",
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "公民身份号码/社保卡号",
            dataIndex: "e0104",
            key: "e0104",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "材料类别",
            dataIndex: "e0105",
            key: "e0105",
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "材料名称",
            dataIndex: "e0106",
            key: "e0106",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案位置号",
            dataIndex: "e0107",
            key: "e0107",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "经办人",
            dataIndex: "e0108a",
            key: "e0108a",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "状态",
            dataIndex: "e0112Name",
            key: "e0112Name",
            width: 100,
            fixed: 'right',
            scopedSlots: { customRender: "cursorTitle" }
          },
           {
            title: "是否在库",
            dataIndex: "isInware",
            key: "isInware",
            fixed: 'right',
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
        ],
        // table数据
        tabledataArr: []
      },
      tempCondition: {},  //当前查询条件
      visible: false, //模态框默认不显示
      confirmLoading: false, //确认加载状态 默认为false
      modalWidth: '',  //modal的宽度
       
      currRow: {
        perName: '',
        archNumber: '',
        materialNames: '',
        materialNums: '',
        signName: ''
      },
      fileNum: '',  //打印---文件编号
      firstTitle: '江西省人才流动中心', //打印--大标题
      secondTitle: '回执',  //打印---小标题
      nowData:moment(new Date()).format("YYYY年MM月DD日"),  //打印--日期
    };
  },

  //监听属性 类似于data概念
  computed: {
    checkTableData: function() {
      return this.$store.getters.getinfoTableCheckData;
    }
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
      this.$http.fetchPost('fileConnect@getConnectList.action',{
        page: pageNum,
        limit: limitNum,
        e0100: '1',
        e0109: '0',
        e0101: (!condition || !condition.e0101) ? '' : condition.e0101,
        e0102: (!condition || !condition.e0102) ? '' : condition.e0102,
        e0104: (!condition || !condition.e0104) ? '' : condition.e0104,
        e0108: (!condition || !condition.e0108) ? '' : condition.e0108,
        e0112: (!condition || !condition.e0112) ? '' : condition.e0112,
        startDate: (!condition || !condition.startDate) ? '' : condition.startDate,
        endDate: (!condition || !condition.endDate) ? '' : condition.endDate
      }).then(res => {
        if(Number(res.code) === 0){
          this.tableTotalNum = res.count;
          let tempTableData = res.data;
          this.initArr.tabledataArr = [];
          tempTableData.forEach((element, index) => {
            this.initArr.tabledataArr.push({
              key: element.e01000,
              num: (pageNum - 1) * limitNum + index + 1,
              e0101: element.e0101,
              e0102: element.e0102,
              e0103: element.e0103,
              e0104: element.e0104,
              e0105: element.e0105,
              e0106: element.e0106,
              e0106a: element.e0106a,
              e0107: element.e0107,
              e0108: element.e0108,
              e0108a: element.e0108a,
              e0112: element.e0112,
              e0112Name: element.e0112 === '0' ? '已接收' : '待接收',
              isInware:element.isInware === "2" ? "已转出" : (element.isInware === "0" ?"在库" : '已出库'),
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
    },
    getAgentOptions(){
      /**
       * 功能：获取经办人options
       */
      this.$http.fetchPost('fileConnect@queryUserName.action').then(res => {
        if(Number(res.code) === 0){
           this.initArr.formData.formInputs.forEach(item => {
              if(item.key == 'e0108'){
                res.data.forEach(element => {
                  item.children.push({
                    itemCode: element.e0108,
                    itemName: element.e0108a
                  })
                });
                
              }
           });
        }
      })
    },
    acceptRecordFun(){
      /***
       * 功能:材料交接接收功能
       */
      if(this.checkTableData.length > 0 ){
        let isAccept = this.isAccept(this.checkTableData, 'accept');
        if(isAccept['isFlag']){
          this.acceptRecordPostFun(isAccept['currIdStr']);
        } else{
          this.$message.error('请选择待接收档案进行操作！')
        }
      } else{
        this.$message.error('请至少选择一条待接收的数据！')
      }
    },
    isAccept(checkDataArr, operateVal){
    /***
     * 功能：判读当前选择的数据是否可以接收
     * 参数：checkDataArr:当前checktable选择的值
     */
      let currflag, currIdStr = '',currDataArr = []; 
      if(operateVal == 'accept'){
        checkDataArr.forEach(el => {
          if(el.e0112 == '1'){
            currDataArr.push(el);
            currIdStr += el.key + ',';
          }
        });
      } else{
         checkDataArr.forEach(el => {
          if(el.e0112 == '0'){
            currDataArr.push(el);
          }
        });
      }
      if(currDataArr.length == checkDataArr.length){
          currflag = true;
        } else{
          currflag = false;
        }
        return {'isFlag': currflag, 'currIdStr' : currIdStr};
    },
    printFun(){
      /***
       * 功能：打印回执
       */
      if(this.checkTableData.length > 0){
        let isPrint = this.isAccept(this.checkTableData, 'print');
        if(isPrint['isFlag']){
          if(this.checkTableData.length == 1){
            this.getNewPrintData(this.checkTableData[0]);
          } else{
            this.$message.error('请选择一条已接收的文件信息进行打印！')
          }
        } else{
          this.$message.error('请选择已接收的文件信息进行打印！')
        }
      } else{
        this.$message.error('请选择一条已接收的文件信息进行打印！')
      }
    },
    getNewPrintData(currData){
      /**
       * 功能：根据当前选择的打印数据：获取打印的data
       * 参数：currData:当前选择的数据
       */
      this.$http.fetchPost('fileConnect@materialReceiptPrint.action',{
        perName: currData.e0102,
        archNumber: currData.e0101,
        strArr: currData.key
      }).then(res => {
        // console.log(res);
        if(Number(res.code) === 0){
          this.fileNum = res.data.dueBillSerialNumber;   //文件编号
          for(let key in this.currRow){
            this.currRow[key] = res.data[key];
          } 
          this.visible = true;
        }
      })
    },
    acceptRecordPostFun(currIdStr){
      /***
       * 功能：材料交接，接收
       * 参数：currIdStr:当前选择的状态为未接收的数据的id
       */
      this.$http.fetchPost('fileConnect@turnTakeOver.action', {
        takeOver: 'takeOver',
        strArr: currIdStr
      }).then(res => {
        if(Number(res.code) === 0){
          this.$message.success('接收成功！')
          this.getTableData(this.tempCondition, 1, 10);
        } else{
          this.$message.error('接收失败，请重新操作！')
        }
      })
    },
    handleCancel() {
      /***
       * 功能：模态框取消操作
       */
      this.visible = false;
    },
    print(){
      /***
       * 功能：打印操作
       */
      this.$refs.print.printFun();
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getAgentOptions();
    //this.getTableData(null, 1, 10);
    let dpiArr = this.utils.js_getDPI();
    this.modalWidth = Math.ceil(dpiArr[0] * 8.27 * 1.2 + 300);
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
.modalInnerContainer{
  height: 100%;
  display: flex;
  flex-direction: column;
}

.printBtn{
  height: 40px;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.printBtn button{
  margin: 0 10px;
}
</style>