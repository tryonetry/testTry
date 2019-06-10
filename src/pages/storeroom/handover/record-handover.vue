<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
          <a-button class="buttonOperate" @click="acceptRecordFun">接收</a-button>
          <a-button type="primary" class="buttonOperate" @click="printFun">打印交接清单</a-button>
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
        :footer="null"
        :maskClosable="false"
      >
        <div class="modalInnerContainer">
            <div class="printContent">
              <PrintTemplate :printDataObj="printTemplateData" ref="printPage"></PrintTemplate>
            </div>
            <div class="printBtn">
              <a-button key="cancel" @click="handleCancel">取消</a-button>
              <a-button key="submit" type="primary" @click="handleOk">打印</a-button>
            </div> 
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import PrintTemplate from '@/components/printTemplate';
import moment from "moment";
import utils from '@/utils/util.js'
export default {
  name: "RecordHandover",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView, PrintTemplate },
  props: [""],

  data() {
    return {
      utils,
      tableTotalNum: 0, //总页数：默认为0
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
              title: "身份证号/社保卡号",
              type: "text",
              required: false,
              placeholder: "请输入身份证号/社保卡号",
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
              title: "经办人名称",
              otherType: "searchSelect",
              required: false,
              placeholder: "请选择经办人名称",
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
              placeholder: '请选择接收日期',
              key: "startDate-endDate",
              name: "startDate-endDate",
              val: void 0,
              postname: "startDate-endDate",
              status: "",
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
        columnsArr: [
          //table的表头
          {
            title: "序号",
            dataIndex: "num",
            key: "num",
            fixed: 'left',
            width: 80,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "姓名",
            dataIndex: "e0102",
            key: "e0102",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "性别",
            dataIndex: "e0103",
            key: "e0103",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "身份证号",
            dataIndex: "e0104",
            key: "e0104",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "存档编号",
            dataIndex: "e0101",
            key: "e0101",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "经办人",
            dataIndex: "e0108a",
            key: "e0108a",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "状态",
            dataIndex: "e0112Name",
            key: "e0112Name",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "接收日期",
            dataIndex: "e0106a",
            key: "e0106a",
            scopedSlots: { customRender: "cursorTitle" }
          },
        ],
        // table数据
        tabledataArr: []
      },
      printTemplateData:{
        //打印模板数据
        cardTitle: '江西省人才流动中心',   //大标题
        subTitle: '档案交接清单',         //小标题
        isRightNum: false,               //是否有右侧编号/内容
        // rightContent:{                   //如果有右侧内容：传值格式
        //   title: 'NO：',                 
        //   value: '360000B1905300010',
        //   className: {                   //样式：备注：用之前把样式名写在PrintTemplate组件里；
        //     rightNumber: true,
        //     rightNumberRed: true
        //   }
        // },
        otherContent: [                  //日期及其他内容
          // {
          //   title: 'AAAAA人',
          //   value: 'ZZZZZ'
          // },
          {
            type: 'date',
            title: '日期',
            value: ''
          }
        ],
        content:[                        //内容部分
          {
            type: 'table',
            data:{
              columnsArr: [
                {
                  title: "序号",
                  dataIndex: "num",
                  key: "num",
                  width: '10%',
                },
                {
                  title: "姓名",
                  dataIndex: "e0102",
                  key: "e0102",
                  width: '10%',
                },
                {
                  title: "性别",
                  dataIndex: "e0103",
                  key: "e0103",
                  width: '10%',
                },
                {
                  title: "身份证号",
                  dataIndex: "e0104",
                  key: "e0104",
                  width: '20%',
                },
                {
                  title: "存档编号",
                  dataIndex: "e0101",
                  key: "e0101",
                  width: '20%',
                },
                {
                  title: "经办人",
                  dataIndex: "e0108a",
                  key: "e0108a",
                  width: '10%',
                },
                {
                  title: "状态",
                  dataIndex: "e0112Name",
                  key: "e0112Name",
                  width: '10%',
                },
                {
                  title: "接收日期",
                  dataIndex: "e0106a",
                  key: "e0106a",
                },
              ],
              tableDataArr: []
            }
          }
        ],
      },
      tempCondition: {}, //当前查询条件
      visible: false, //模态框默认不显示
      confirmLoading: false, //确认加载状态 默认为false
      modalWidth: '',  //modal的宽度
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
    moment,
    getTableData(condition, pageNum, limitNum) {
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
       *         */
      this.tempCondition = condition;
      this.$http.fetchPost('fileConnect@getConnectList.action',{
        page: pageNum,
        limit: limitNum,
        e0100: '0',
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
              e0108: element.e0108,
              e0108a: element.e0108a,
              e0106a: element.e0106a,
              e0112: element.e0112,
              e0112Name: element.e0112 === '0' ? '已接收' : '待接收'
            })
          });
        }
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
       * 功能：接收档案
       */
      if(this.checkTableData.length > 0){
        let isAccept = this.isAccept(this.checkTableData, 'accept');
        console.log(isAccept);
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
    acceptRecordPostFun(currIdStr){
      /***
       * 功能：接收档案post操作
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
    printFun(){
      /***
       * 功能：打印交接清单功能
       */
      if(this.checkTableData.length > 0) {
        let isPrint = this.isAccept(this.checkTableData, 'print');
        console.log(isPrint);
        if(isPrint.isFlag){
          console.log(this.checkTableData);
          this.visible = true;
          this.printTemplateData.content[0].data.tableDataArr = this.checkTableData;
        } else{
          this.$message.error('请选择已接收的文件信息进行打印！')
        }
      } else{
        this.$message.error('请选择至少一条已接收的文件信息进行打印！')
      }
    },
    handleCancel() {
      /***
       * 功能：模态框取消操作
       */
      this.visible = false;
    },
    handleOk(){
      /***
       * 功能：打印操作
       */
      this.$refs.printPage.printFun();
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getAgentOptions();
    this.getTableData(null, 1, 10);
    let dpiArr = this.utils.js_getDPI();
    this.modalWidth = Math.ceil(dpiArr[0] * 8.27 * 1.2 + 300);
  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
 
  },

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
.printContent{
  flex:1;
  overflow-y: auto;
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