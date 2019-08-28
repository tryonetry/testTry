<!-- template -->
<template>
  <!-- 单位职工信息变更 -->
  <div class="outer">
    <TableView :initArrData="initArr" @searchTable="getTableData" ref="updateTable" :totalCount="tableTotalNum">
        <div slot="tableAction" slot-scope="slotPropsData">
          <a href="javascrit:;" @click="editOperate(slotPropsData.currRowdata)" class="primaryBtnColor">编辑</a>
        </div>
    </TableView>

    <!-- 点击进入 -->
    <div class="changeModal">
      <a-modal
        centered
        :visible="changeModalShow"
        :width="'90%'"
        style="height:90%;overflow: hidden;"
        :maskClosable='false'
        @cancel="handleCancel"
        :keyboard='true'
      >
        <!-- title -->
        <template slot="footer">
          <a-button key="back" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" :loading='confirmLoading' @click="insertInfoToCompany">保存</a-button>
        </template>

        <!-- title -->
        <div slot="title" class="titleSlot">
          <p>单位职工录入</p>
          <span>{{currentPersonData.a0101}}</span>
        </div>
        <div class="insertContainer">
          <RecordInfo :isStaff='isStaff' :currentPersonData='currentPersonData' ref="accountInfoForm"></RecordInfo>
        </div>
      </a-modal>
    </div>
    
  </div>
</template>

<script>

import moment from 'moment';
import TableView from "@/components/tableView";
import RecordInfo from "@/components/record/record-info";

export default {
  name: "DepartWorker",
  //import引入的组件需要注入到对象中才能使用
  components: {
    TableView,
    RecordInfo,
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
              title: "委托存档单位编号",
              type: "text",
              placeholder: "请输入委托存档单位编号",
              key: "companyNum",
              name: 'companyNum',
              postname: 'companyNum',
              val: void 0,
              maxlength:40,
            },
            {
              title: "存档编号",
              type: "text",
              placeholder: "请输入存档编号",
              key: "a0100A",
              name: 'a0100A',
              postname: 'a0100A',
              maxlength:40,
              val: void 0
            },
            {
              title: "身份证/社保卡号",
              type: "text",
              placeholder: "请输入公民身份证/社保卡号",
              key: "a0184",
              name: 'a0184',
              postname: 'a0184',
              maxlength:18,
              val: '612525199508144314'
            }
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
            width: 100
          },
          { 
            title: "姓名", 
            dataIndex: "a0101", 
            key: "a0101", 
            fixed: "left",
            width: 200,
          },
          { 
            title: "身份证/社保卡号", 
            dataIndex: "a0184", 
            key: "a0184", 
            fixed: "left",
            width: 200,
          },
          { 
            title: "委托存档单位名称", 
            dataIndex: "companyName", 
            key: "companyName",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "委托存档单位编号", 
            dataIndex: "oldArchiveUnit", 
            key: "oldArchiveUnit",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "统一社会信用代码", 
            dataIndex: "businessLicense", 
            key: "businessLicense",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "存档编号", 
            dataIndex: "a0100A", 
            key: "a0100A",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "存档日期", 
            dataIndex: "uCreateDate", 
            key: "uCreateDate", 
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            fixed: "right",
            width: 150,
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr:[],
        tempCondition:{},
      },
      deleteModalData:{
        formInputs: [
          {
              title: '销户原因',
              type: "text",
              required: false,
              placeholder: "请输入销户原因",
              key: "respon",
              name: "respon",
              val: void 0,
              postname: "respon",
              maxlength: 100,
              minlength: 0,
              reg: '',
              tip: '* 请输入销户原因',
              status: '',
              colWidth:[24,24],
          },
          {
              title: '销户日期',
              otherType: "date",
              required: false,
              placeholder: "请选择销户日期",
              key: "closeDate",
              name: "closeDate",
              val: moment(new Date()),
              postname: "closeDate",
              maxlength: 20,
              minlength: 0,
              reg: '',
              tip: '* 请选择销户日期',
              status: '',
              disabled:true,
              colWidth:[24,24],
          },
        ]
      },
      // deleteModal 布局
      deleteModal:{
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
      tableTotalNum:0,
      changeModalShow:false,
      confirmLoading:false,
      currentPersonData:{},
      random:Math.random(),
      isStaff:true,
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
      this.tempCondition = condition;
      this.$http.fetchPost('companyInfo@getPersonalArchList.action',{
          page: pageNum,
          limit: limitNum,
          ...condition
      }).then((res)=>{
          if(Number(res.code) === 0){
              this.tableTotalNum = res.count;
              console.log(this.tableTotalNum)
              this.initArr.tabledataArr = res.data;
              this.initArr.tabledataArr.forEach((element, index) => {
                console.log(element)
                Object.assign(element,{
                  key:element.a01000,
                  num: (pageNum - 1) * limitNum + index + 1,
                  transferType: element.transferType === '1' ? '集体转集体' : element.transferType === '2' ? '集体转个人' : element.transferType === '3' ? '个人转集体' : '',
                });
              });

              // console.log(this.initArr.tabledataArr)
          }else{
              _this.$message.error("抱歉,暂时未查到数据!");
          }
      })
    },

    editOperate(currdata){
      this.currentPersonData = currdata;
      console.log(currdata)
      this.random = Math.random();
      this.changeModalShow = true;
    },

    // 关闭弹框 
    handleCancel(){
      this.changeModalShow  = false;
    },

    reGetData(){
      this.getTableData(this.tempCondition,1,10);
    },

    insertInfoToCompany(){
      // const _this = this;
      // let reultFormData = this.$refs.accountInfoForm.getFormSearchData(); 
      // // console.log(reultFormData)
      // if(reultFormData.isRight && this.currentEnterprice.id){
      //   this.confirmLoading = true;
      //   this.$http.fetchPost('companyInfo@insertPersonalArch.action',{
      //     ...reultFormData.postObj,
      //     a01000:_this.currentEnterprice.id,
      //   })
      //   .then(res => {
      //     if(Number(res.code) === 0){
      //       _this.$message.success('录入成功');
      //     }else{
      //       _this.$message.warning('抱歉,录入失败,请重试');
      //     }
      //   })
      //   .catch(err => {
      //     _this.$message.error('抱歉,网络错误,请稍后重试');
      //   })
      //   .finally(end => {
      //     _this.confirmLoading = false;
      //   })
      // }
    },


  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getTableData(this.tempCondition,1,10);
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
  .outerContainer{
    height: 100%;
  }
  .titleSlot{
    display: flex;
  }
  .titleSlot>p{
    margin-right: 40px;
  }
  .titleSlot>span{
    color:#2d8cf0;
  }
  .insertContainer{
    width: 100%;
    height: 100%;
    padding-top: 10px;
    box-sizing: border-box;
    overflow-y: auto;
  }
</style>