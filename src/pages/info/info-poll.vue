<!--人才信息总库-->
<template>
  <div class="outer">
    <TableView
      :initArrData="initArr"
      :totalCount="tableTotalNum"
      :loading="tableLoading"
      @searchTable="getTableData"
      ref="updateTable"
      @accepttreeNode="accepttreeNodeFun"
    >
      <span slot="formAction">
        <a-button class="buttonOperate" type="primary" @click="operateFun({},1)">添加</a-button>
        <a-button class="buttonOperate" @click="portraitView">个人画像</a-button>
        <JsonExcel :data="exportDataArr" :fields="exportFiledsJson" :name="fieldsName" style="display: inline-block;">
          <a-button class="buttonOperate" @click="exportFun">导出</a-button>
        </JsonExcel>
        <!-- <a-button class="buttonOperate" @click="exportAllFun">导出全部</a-button> -->
      </span>
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          href="javascript:;"
          @click="operateFun(slotPropsData.currRowdata, 2)"
          data-type="浏览"
          class="primaryBtnColor"
        >浏览</a>
        <a
          href="javascript:;"
          @click="operateFun(slotPropsData.currRowdata, 3)"
          data-type="编辑"
        >编辑</a>
        <a-popconfirm
          title="确定删除吗?"
          okText="确定"
          cancelText="取消"
          @confirm="deleteFun(slotPropsData.currRowdata, slotPropsData.currTableData)"
        >
          <a href="javascript:;" class="errorBtnColor">删除</a>
        </a-popconfirm>
      </div>
    </TableView>
    <!-- 添加信息模态框 -->
    <div class="addModal">
      <a-modal
        class="infopoll"
        centered
        :visible="visible"
        :confirmLoading="confirmLoading"
        width="95%"
        @cancel="handleCancel"
        style="height:95%;overflow: hidden;"
        :maskClosable="false"
      >
        <div slot="title" class="roomModalTitleSlot">
          <p>{{operateStatus== 1? '添加信息': (operateStatus==2? '浏览信息' :'编辑信息')}}</p>
          <span>{{currentRowData && currentRowData.a0101}}</span>
          <span style="margin-left: 30px;" v-if="operateStatus != 1">籍贯：{{currentRowData && currentRowData.a0111}}</span>
          <span style="margin-left: 30px;" v-if="operateStatus != 1">学历：{{currentRowData && this.conVersionData(currentRowData.a0834)}}</span>
        </div>


        <InfoOperate
          ref="operatePage"
          :operateStatusVal="operateStatus"
          :currRowDataId="operateDataId"
          :addSelectTreeNode="selectTreeNode"
          :ramdomKey="ramdomKey"
          @OperateStatusFun='infoOperateFun'
        ></InfoOperate>
        <template slot="footer">
          <a-button key="cancel" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="handleOk" v-if="operateStatus !== 2">提交</a-button>
        </template>
      </a-modal>
    </div>

    <!-- 个人画像modal -->
     <div class="addModal">
      <a-modal
        class="personImgModal"
        centered
        :visible="personVisible"
        :confirmLoading="personConfirmLoading"
        width="1000px"
        @cancel="handlePersonCancel"
        style="height:650px;overflow: hidden;"
        :maskClosable="false"
        :footer="null"
      >
        <div slot="title" class="roomModalTitleSlot">
          <p>个人画像</p>
          <span>{{tempPersonData && tempPersonData.a0101}}</span>
        </div>
        
        <div class="personContainer">
          <div class="hotCon">
              点击热度：{{(tempPersonData && tempPersonData.pageView) ? tempPersonData.pageView : 0}} 次
          </div>
          <div class="personContent">
             <div class="firstCircle">
               <div class="secondCircle">
                 <div class="contentCircle">
                   <img :src="imgUrl" v-if="tempPersonData && tempPersonData.imgPath"/>
                   <img v-else src="../../assets/image/defaulthead.png" />
                 </div>
               </div>
               <div class="detail_div detail_div_name"><Portrait :infoObj="nameObj"></Portrait></div>
               <div class="detail_div detail_div_gender"><Portrait :infoObj="genderObj"></Portrait></div>
               <div class="detail_div detail_div_age"><Portrait :infoObj="ageObj"></Portrait></div>
               <div class="detail_div detail_div_college"><Portrait :infoObj="collegeObj"></Portrait></div>
               <div class="detail_div detail_div_profess"><Portrait :infoObj="professObj"></Portrait></div>
               <div class="detail_div detail_div_marry"><Portrait :infoObj="marryObj"></Portrait></div>
               <div class="detail_div detail_div_edu"><Portrait :infoObj="eduObj"></Portrait></div>
               <div class="detail_div detail_div_address"><Portrait :infoObj="addressObj"></Portrait></div>
             </div>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import InfoOperate from "@/components/infoOperate";
import JsonExcel from "vue-json-excel";
import moment from "moment";
import Portrait from '@/components/info/portrait'
export default {
  name: "InfoPoll",
  components: {
    TableView,
    InfoOperate,
    JsonExcel,
    Portrait
  },
  data() {
    return {
      initArr: {
        treeflag: true, //左侧tree是否存在
        tableCheck: true, //table是否可以check
        formData: {
          //form inputs
          formInputs: [
            {
              title: "姓名",
              type: "text",
              placeholder: "请输入姓名",
              key: "a0101",
              name: "a0101",
              val: void 0
            },
            {
              title: "档案编号",
              type: "text",
              placeholder: "请输入档案编号",
              key: "a0100a",
              name: "a0100a",
              val: void 0
            },
            {
              title: "身份证号",
              type: "text",
              placeholder: "请输入身份证号",
              key: "a0184",
              name: "a0184",
              val: void 0
            }
          ],
          // form btns
          formBtns: [
            { title: "查询", htmltype: "submit", operate: "searchForm" }
            // { title: "添加", htmltype: "button", operate: "addOperate" },
            // { title: "个人对象", htmltype: "button", operate: "view" }
          ]
        },
        columnsArr: [
          //table表头
          {
            title: "序号",
            dataIndex: "num",
            key: "num",
            fixed: "left",
            width: 60,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "姓名",
            dataIndex: "a0101",
            fixed: "left",
            key: "a0101",
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
            title: "出生日期",
            dataIndex: "a0107",
            key: "a0107",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "毕业院校",
            dataIndex: "a0888",
            key: "a0888",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "参加工作年月",
            dataIndex: "a0134",
            key: "a0134",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "工作单位及职务",
            dataIndex: "a0202a",
            key: "a0202a",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "热度",
            dataIndex: "pageView",
            key: "pageView",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            width: 200,
            fixed: 'right',
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: [] //table数据
      },

      tableTotalNum: 0, //table数据量
      tableLoading: false, //table--loading
      tempPageSize: 1, //临时--table--pageSize
      visible: false, //模态框默认不可见
      confirmLoading: false, //模态框确认按钮加载：默认不加载
      selectTreeNode: null, //接收treeNode值
      operateStatus: null, //操作状态：1-添加， 2-浏览， 3-添加
      currentData: {},
      operateDataId: null, //当前操作数据
      tempCondition: {}, //临时查询条件
      ramdomKey:Math.random(), //确保档案目录数据每次都重新加载
      personVisible:false,  //个人画像--modal
      personConfirmLoading: false, //个人画像--modal
      tempPersonData: {}, //临时--个人画像数据

      exportDataArr: [], //导出数据
      exportFiledsJson:{
        //导出
        序号: 'num',
        姓名: 'a0101',
        出生日期: 'a0107',
        性别: 'a0104',
        毕业院校: 'a0888',
        参加工作年月: 'a0134',
        工作单位及职务: 'a0202a',
        热度: 'pageView'
      },
      fieldsName:"人员基础信息列表" + moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),  //导出excel表名称
      nameObj: {
        icon: 'user',
        iconColor: '#64c3fa',
        value: '',
        position: 'left'
      },
      genderObj:{
        icon: 'male',
        iconColor: '#e25c58',
        value: '',
        position: 'left'
      },
      ageObj:{
        icon: 'nianling',
        iconColor: '#ffffff',
        iconClass:'age_icon_bg',
        value: '',
        position: 'left'
      },
      collegeObj:{
        icon: 'school1',
        iconColor: '#ffffff',
        iconClass: 'college_icon_bg',
        value: '',
        position: 'left'
      },
      professObj:{
        icon: 'book1',
        iconColor: '#50b673',
        value: '',
        position: 'left'
      },
      marryObj:{
        icon: 'hunyinlianai',
        iconColor: '#1196db',
        value: '',
        position: 'right'
      },
      eduObj:{
        icon: 'xueli',
        iconColor: '#ea5c5c',
        value: '',
        position: 'right'
      },
      addressObj:{
        icon: '1302dizhi',
        iconColor: '#0590d9',
        value: '',
        position: 'right'
      },
      currentRowData: null,  //当前行数据
      dictoryDataArr: [],  //字典数据
      imgUrl: '',  //个人画像图片地址
    };
  },
  watch: {
    directoryData: {
      // 监听：字典数据
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.dictoryDataArr = newVal;
        }
      },
      deep: true //深度监听
    },
  },
  created() {
    //this.getTableData(null, this.tempPageSize, 10);
  },
  computed: {
    checkTableData: function() {
      return this.$store.getters.getinfoTableCheckData;
    },
    directoryData: function() {
      //字典数据
      if (this.$store.getters.getDirectoryData) {
        return this.$store.getters.getDirectoryData;
      } else {
        return null;
      }
    }
  },
  mounted() {},
  methods: {
    getTableData(condition, pageNum, limitNum) {
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
       *  */
      this.tempCondition = condition;
      this.tableLoading = true;
      this.tempPageSize = pageNum;
      this.$http
        .fetchGet("informationPool@findA01ListByState.action", {
          status: 1,
          page: pageNum,
          limit: limitNum,
          upUnitId: !condition || !condition.upUnitId ? "" : condition.upUnitId,
          jgType: !condition || !condition.type ? "" : condition.type,
          a0101: !condition || !condition.a0101 ? "" : condition.a0101,
          a0100a: !condition || !condition.a0100a ? "" : condition.a0100a,
          a0184: !condition || !condition.a0184 ? "" : condition.a0184
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.tableTotalNum = res.count;
            let tempTableData = res.data;
            this.initArr.tabledataArr = [];
            tempTableData.forEach((element, index) => {
              this.initArr.tabledataArr.push({
                key: element.a01000, //主键值
                num: (pageNum - 1) * limitNum + index + 1, //序号
                a0101: element.a0101, //姓名
                a0107: element.a0107, //出生日期
                a0104: element.a0104 === '1' ? '男' : (element.a0104 === '2' ? '女' : (element.a0104 === '9' ? '未说明的性别' : '未知的性别')), //性别
                a0888: element.a0888, //毕业院校
                a0134: element.a0134, //参加工作日期
                a0202a: element.a0202a, //工作单位名称
                pageView: element.pageView, //热度
                a0100a: element.a0100a, //档案编号
                a0184: element.a0184, //身份证号
                a0111: element.a0111,
                a0824: element.a0824,
                a0834: element.a0834,
                a0131: element.a0131,
                imgPath: element.imgPath,
                a0914: element.a0914
              });
            });
          } else{
            this.$message.error('抱歉，获取数据失败，请刷新后重试！');
          }
        }).catch(err => {
          this.$message.error('抱歉，网络异常！');
        }).finally(end => {
          this.tableLoading = false;
        });
    },

    conVersionData(data){
      let tempName = '';
      if(data){
        this.directoryData["educationList"].forEach(el => {
          if (el['itemCode'] === data) {
            tempName = el.itemName;
          }
        });
      }
      return tempName;
    },

    deleteFun(data, currTableData) {
      /**
       * 功能：table：删除操作
       * 参数：data:当前行数据
       */
      this.$http
        .fetchPost("informationPool@recycleBinRestore.action", {
          a01000: data.key,
          state: 2
        })
        .then(res => {
          // console.log(res);
          if (Number(res.code) === 0) {
            this.$message.success("删除成功");
            this.getTableData(this.tempCondition, this.tempPageSize, 10);
          } else{
            this.$message.warning('抱歉，操作失败，请刷新后重试！');
          }
        })
        .catch(err => {
          this.$message.error('抱歉，网络异常！');
        });
    },
    accepttreeNodeFun(newTreeData, newConditionVal) {
      /***
       * 功能：接收子组件TableView传过来的treeNode选择得值
       * 参数：data:子组件$meit派发过来的值
       */
      this.selectTreeNode = newTreeData;
      this.tempCondition = Object.assign({}, newConditionVal, {
        upUnitId: newTreeData["key"],
        type: newTreeData["type"]
      });
      this.getTableData(this.tempCondition, 1, 10);
    },
    operateFun(data, statusVal) {
      /***
       * 功能：增加操作
       */
      this.operateStatus = statusVal;
      this.operateDataId = data.key;
      this.currentRowData = data;
      if (statusVal == 1) {
        let treenode = this.selectTreeNode;
        if (treenode) {
          if (treenode.key.length > 4) {
            this.showModalFun();
          } else {
            this.$message.error("请在具体机构中添加信息");
          }
        } else {
          this.$message.error("请先选择机构");
        }
      } else if (statusVal == 2) {
        //浏览
        //当点击浏览--热度加1；刷新表格数据
        this.$http.fetchPost('informationPool@a01Browse.action', {
          a01000: data.key,
          pageView: Number(data.pageView) + 1
        }).then(res => {
          //console.log(res);
          if(Number(res.code) === 0){
            this.getTableData(this.tempCondition, this.tempPageSize, 10);
          }
        })
        
        this.showModalFun();
        
      } else {
        //编辑
        this.showModalFun();
      }
    },
    showModalFun() {
      /**
       * 功能：模态框状态变为true:打开模态框，根据操作，更该模态框标题
       * 参数:statusVal：操作状态值
       */
      this.ramdomKey = Math.random();
      this.visible = true;
    },
    handleOk() {
      /**
       * 功能：模态框：确定操作
       */
      this.confirmLoading = true;
      this.$refs.operatePage.getFinishData();
    },

    infoOperateFun(value){
      // console.log(value);
      if(value){
        this.getTableData(this.tempCondition, this.tempPageSize, 10);
        this.visible = false;
        this.confirmLoading = false;
      } else{
        this.visible = true;
      }
    },

    handleCancel() {
      /***
       * 功能：模态框取消操作
       */
      this.visible = false;
    },
    portraitView() {
      /***
       * 功能：查看个人画像
       */
      if (this.checkTableData.length < 1) {
        this.$message.error("请选择一条需要的画像信息");
      } else if (this.checkTableData.length > 1) {
        this.$message.error("最多选择一条需画像信息");
      } else {
        this.tempPersonData = this.checkTableData[0];
        this.personVisible = true;
        this.nameObj['value'] = this.tempPersonData['a0101'] ? this.tempPersonData['a0101'] : '姓名';
        this.genderObj['value'] = this.tempPersonData['a0104'] === "1" ? "男" : "女";
        this.ageObj['value'] = this.tempPersonData['a0107'] ? this.tempPersonData['a0107'] : '年龄';
        this.eduObj['value'] = this.getDictResultName('educationList', this.tempPersonData['a0834'], this.dictoryDataArr);
        this.professObj['value'] = this.tempPersonData['a0824'] ? this.tempPersonData['a0824'] : '专业';
        this.marryObj['value'] = this.getDictResultName('maritalList', this.tempPersonData['a0131'], this.dictoryDataArr);
        this.collegeObj['value'] = this.tempPersonData['a0888'] ? this.tempPersonData['a0888'] : '毕业院校';
        this.addressObj['value'] = this.tempPersonData['a0111'] ? this.tempPersonData['a0111'] : '地址';
        this.imgUrl = this.$targetHost + this.tempPersonData.imgPath.substr(2);
      }
    },
    
    handlePersonCancel(){
      //个人画像--modal
      this.personVisible = false;
    },

    exportFun(){
      //导出功能
      if(this.checkTableData && this.checkTableData.length > 0){
        this.exportDataArr = this.checkTableData;
      } else{
        this.$message.error('请至少选择一条数据进行操作！');
      }
    },
    // exportAllFun(){
    //   //导出全部
      
    // },
    getDictResultName(keyVal, itemCodeVal, dictDataArr){
       /**
        * 功能：通过itemCode值在字典数据里查找对应的itemName
        * 参数：keyVal:字典里对应的key值； itemCode：当前itemCode值； dictDataArr：字典数据
        */
      let tempDataArr = dictDataArr[keyVal], resultStr = '';
      // console.log(keyVal + ':' + itemCodeVal);
      // console.log(tempDataArr);
      if(itemCodeVal && dictDataArr && dictDataArr[keyVal].length > 0){
        tempDataArr.forEach(el => {
          if(el.itemCode === itemCodeVal){
            resultStr = el.itemName;
          }
        });
      } else{
        resultStr = '';
      }
      return resultStr;
    }
  }
};
</script>
<style scoped>
.personContainer{
  width:100%;
  height: 100%;
  overflow:hidden;
}

.hotCon{
    color: #333;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    text-align: right;
}

.personContent{
  width: 100%;
  height: calc(100% - 40px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.firstCircle{
  padding: 60px;
  border: 2px dashed #64c3fa;
  border-radius: 100%;
  position: relative;
  z-index: 1;
}

.detail_div{
  position: absolute;
  z-index: -1;
}

.detail_div_name{
  top: 5%;
  left: -10%;
}

.detail_div_gender{
  top: 33%;
  left: -27%;
}

.detail_div_age{
  top: 66%;
  left: -20%;
}


.detail_div_college{
  bottom: -7%;
  left: 25%;
}

.detail_div_profess{
  top: -14%;
  right: 21%;
}

.detail_div_marry{
  top: 10%;
  right: -17%;
}

.detail_div_edu{
  top: 44%;
  right: -32%;
}

.detail_div_address{
  top: 71%;
  right: -21%;
}

.secondCircle{
  padding: 30px;
  border: 2px solid #f3b396;
  border-radius: 100%;
  z-index: 2;
}


.contentCircle img{
  width: 200px;
  height: 200px;
  border-radius: 100%;
  z-index: 3;
}

</style>



