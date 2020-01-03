<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" :loading="tableLoading" @searchTable="getTableData" ref="recordTable">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
          <JsonExcel :data="initArr.tabledataArr" :fields="exportFiledsJson" :name='fieldsName'>
            <a-button class="buttonOperate" @click="exportFun">导出入库清单</a-button>
          </JsonExcel>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <!-- <div slot="tableAction" slot-scope="slotPropsData"></div> -->
    </TableView>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import utils from "../../utils/util.js";
import moment from "moment";

export default {
  name: "RecordInSearch",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView },
  props: [""],

  data() {
    return {
      utils,
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
              placeholder: "请选择录入时间",
              key: "startDate-endDate",
              name: "startDate-endDate",
              val: [void 0, void 0],
              postname: "startDate-endDate",
              status: ""
              //   disabledDate: "disabledEndDate", //函数名：只能选今天和今天以前的
              //   disabledStartDate: "disabledStartDate" //函数名：只能选今天和今天以后的
            },
            {
              title: '导出列',
              otherType: 'searchSelect',
              required: false,
              placeholder: "请选择需要导出的列",
              key: 'colsStr',
              name: 'colsStr',
              val: [],
              children: [
                  { itemCode: 'a0101', itemName: '档案人姓名' },
                  { itemCode: 'a0104' , itemName: '性别' },
                  { itemCode: 'a0184' , itemName: '公民身份号码/社保卡号' },
                  { itemCode: 'archivesIdentity' , itemName: '人员身份' },
                  { itemCode: 'a0100a' , itemName: '存档编号' },
                  { itemCode: 'shelvesNo' , itemName: '库房位置' },
                  { itemCode: 'inwareOperatorName' , itemName: '经办人' },
                  { itemCode: 'archHandover' , itemName: '档案交接人' },
                  { itemCode: 'inwareDate' , itemName: '入库时间' },
              ],  
              status: '',
              mode: 'multiple'
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
            width: 250,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案人姓名",
            dataIndex: "a0101",
            key: "a0101",
            width: 150,
            fixed: "left",
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
            width: 250,
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
            title: "库房位置",
            dataIndex: "shelvesNo",
            key: "shelvesNo",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "经办人",
            dataIndex: "inwareOperatorName",
            key: "inwareOperatorName",
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "档案交接人",
            dataIndex: "archHandover",
            key: "archHandover",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "入库时间",
            dataIndex: "inwareDate",
            key: "inwareDate",
            sorter: (a, b) => a.inwareDate && b.inwareDate && Number(a.inwareDate.replace(/[\s+|\-|:]/g,'')) - Number(b.inwareDate.replace(/[\s+|\-|:]/g,'')),
            scopedSlots: { customRender: "cursorTitle" }
          },
        ],
        // table数据
        tabledataArr: []
      },
      tempCondition: {}, //临时查询条件
      fieldsJson:{     //导出列表字段对应
        '序号': 'num',
        '档案人姓名': "a0101",
        '性别': "a0104",
        '公民身份号码/社保卡号': "a0184",
        '人员身份': "archivesIdentity",
        '存档编号': "a0100a",
        '库房位置': "shelvesNo",
        '经办人': "inwareOperatorName",
        '档案交接人': "archHandover",
        '入库时间': 'inwareDate'
      },
      exportFiledsJson: {},
      fieldsName: '档案入库清单' + this.moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
    };
  },

  //监听属性 类似于data概念
  computed: {
    directoryData: function(){
      return this.$store.getters.getDirectoryData
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
    directoryData: {
      //字典数据监听
      immediate: true,
      deep: true,
      handler: function(newVal){
        if(newVal && newVal['personIdentityList'].length > 0){
          this.initArr.formData.formInputs.forEach(item => {
            if(item.key === 'archivesIdentity'){
              item.children = this.directoryData['personIdentityList'];
            }
          });
        }
      }
    }
  },

  //方法集合
  methods: {
    moment,
    getTableData(condition, pageNum, limitNum) {
      /**
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
       */
      this.tableLoading = true;
      this.tempCondition = condition;
      this.$http.fetchPost('archDocument@getArchInWareList.action',{
        page: pageNum,
        limit: limitNum,
        archiveStatus:'1',
        a0100A: (!condition || !condition.a0100A) ? '' : condition.a0100A,
        a0184: (!condition || !condition.a0184) ? '' : condition.a0184,
        a0101: (!condition || !condition.a0101) ? '' : condition.a0101,
        archivesIdentity: (!condition || !condition.archivesIdentity) ? '' : condition.archivesIdentity,
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
              key: element.waId,    //唯一的id值； 现在由于垃圾数据影响会报错key值重复
              a0101: element.a0101,
              a0104: element.a0104 === '1' ? '男' : (element.a0104 === '2' ? '女' : (element.a0104 === '9' ? '未说明的性别' : (element.a0104 === '0' ? '未知的性别' : ''))),
              a0184: element.a0184,
              archivesIdentity: element.archivesIdentity ? (element.archivesIdentity == "1" ? "干部" : "工人") : '',
              shelvesNo: (element.whdArea ? element.whdArea : '') + '区' + (element.waColumnCode ? element.waColumnCode : '') + '列' + (element.waLayerCode ? element.waLayerCode : '') + '层' + (element.orderNo ? element.orderNo : '') + '号',
              inwareOperatorName: element.inwareOperatorName,
              archHandover: element.archHandover,
              inwareDate: element.inwareDate,
              a0100a: element.a0100a,
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
    exportFun(){
      /**
       * 功能：导出列表功能
       */
      let tempNewCondition = this.$refs.recordTable.getCondition();
      let newCondition = {};
      if(JSON.stringify(tempNewCondition) !== '{}'){
        newCondition = tempNewCondition;
      } else{
        newCondition = {
          'a0100A': "",
          'a0101': "",
          'a0184': "",
          'archivesIdentity': "",
          'colsStr': [],
          'startDate-endDate': ""
        }
      }
      console.log(newCondition);
      let currFiledsJsonObj = {}, conditionLen = newCondition['colsStr'].length ;
      if(conditionLen > 0){
        for(let key in this.fieldsJson){
          for(let i = 0; i< newCondition['colsStr'].length; i++){
            if(newCondition['colsStr'][i] === this.fieldsJson[key]){
              currFiledsJsonObj[key] = this.fieldsJson[key];
            }
          }
        }
      } else{
        currFiledsJsonObj = {
          '序号': 'num',
          '档案人姓名': "a0101",
          '性别': "a0104",
          '公民身份号码/社保卡号': "a0184",
          '人员身份': "archivesIdentity",
          '存档编号': "a0100a",
          '库房位置': "shelvesNo",
          '经办人': "inwareOperatorName",
          '档案交接人': "archHandover",
          '入库时间': 'inwareDate'
        }
      }
      this.exportFiledsJson = currFiledsJsonObj;
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