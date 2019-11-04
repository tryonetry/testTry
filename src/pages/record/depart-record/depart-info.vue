<!-- template -->
<template>
  <!-- 单位信息变更 -->
  <div class="outer">
    <TableView :initArrData="initArr" @searchTable="getTableData" ref="updateTable" :totalCount="tableTotalNum">
        <div slot="tableAction" slot-scope="slotPropsData">
          <a href="javascrit:;" @click="editOperate(slotPropsData.currRowdata)" class="primaryBtnColor">编辑</a>
          <a href="javascript:;" @click="deleteFun(slotPropsData.currRowdata)" class="errorBtnColor">销户</a>
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
        :footer='null'
      >
        <!-- title -->
        <div slot="title" class="titleSlot">
          <p>单位信息变更</p>
          <span>{{currentEnterprice.companyName}}</span>
        </div>
        <EnterpriceSignOrChange 
          :currentEnterprice='currentEnterprice' 
          :random='random' 
          :handleCancel='handleCancel'
          :reGetData='reGetData'
        ></EnterpriceSignOrChange>
      </a-modal>
    </div>

    <!-- 点击销户 -->
    <div class="deleteModal">
      <a-modal
        centered
        :visible="deleteModalShow"
        :width="'40%'"
        @cancel="handleCancel"
        style="height:35%;overflow: hidden;"
        :maskClosable='false'
        :keyboard='true'
      >
        <!-- title -->
        <template slot="footer">
          <a-button key="back" @click="handleCancel">取消</a-button>
          <a-popconfirm
            title="您确定要销户吗?"
            okText="确定"
            cancelText="取消"
            @confirm="confirmDelete()"
          >
            <a-button key="submit" type="primary" :loading='deleteConfirmLoading'>确认</a-button>
          </a-popconfirm>
        </template>

        <div slot="title" class="titleSlot">
          <p>单位销户</p>
          <span>{{currentEnterprice.companyName}}</span>
        </div>
        <!-- 确认销户原因和销户日期 -->
        <div class="deleteContainer">
          <TableFromSearch :formDataArr='deleteModalData' :layout='deleteModal' ref="deleteForm"></TableFromSearch>
        </div> 
      </a-modal>
    </div>

  </div>
</template>

<script>

import moment from 'moment';
import TableView from "@/components/tableView";
import EnterpriceSignOrChange from '@/components/record/enterpriceSignOrChange';
import TableFromSearch from "@/components/tableFormSearch";

export default {
  name: "DepartInfo",
  //import引入的组件需要注入到对象中才能使用
  components: {
    TableView,
    EnterpriceSignOrChange,
    TableFromSearch
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
              key: "companyNumber",
              name: 'companyNumber',
              postname: '',
              val: void 0
            },
            {
              title: "委托存档单位名称",
              type: "text",
              placeholder: "请输入委托存档单位名称",
              key: "companyName",
              name: 'companyName',
              postname: 'companyName',
              val: void 0
            },
           
            {
              title: "统一社会信用代码",
              type: "text",
              placeholder: "请输入统一社会信用代码",
              key: "businessLicense",
              name: 'businessLicense',
              postname: 'businessLicense',
              val: void 0
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
            title: "统一社会信用代码", 
            dataIndex: "businessLicense", 
            key: "businessLicense",
            fixed: "left",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
        
          { 
            title: "委托存档单位编号", 
            dataIndex: "companyNumber", 
            key: "companyNumber",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
            { 
            title: "委托存档单位名称", 
            dataIndex: "companyName", 
            key: "companyName",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          { 
            title: "联系电话", 
            dataIndex: "contactPhone", 
            key: "contactPhone", 
            width: 200,
          },
          { 
            title: "立户日期", 
            dataIndex: "tatsudoDate", 
            key: "tatsudoDate", 
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            fixed: "right",
            width: 250,
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
      deleteModalShow:false,
      deleteConfirmLoading:false,
      currentEnterprice:{},
      random:Math.random(),
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
      this.$http.fetchPost('companyInfo@getCompanyInfoList.action',{
          page: pageNum,
          limit: limitNum,
          ...condition
      }).then((res)=>{
          if(Number(res.code) === 0){
              this.tableTotalNum = res.count;
              console.log(this.tableTotalNum)
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
      })
    },

    editOperate(currdata){
      this.currentEnterprice = currdata;
      this.random = Math.random();
      this.changeModalShow = true;
    },

    deleteFun(currdata) {
      // 销户操作
      this.currentEnterprice = currdata;
      this.deleteModalShow = true;
      this.$nextTick(function(){
        this.$refs.deleteForm.resetForm();
      });
    },

    confirmDelete(){
      let confirmInfo = this.$refs.deleteForm.getFormData();

      if(confirmInfo.isRight && this.currentEnterprice.id){
        this.deleteConfirmLoading = true;
        this.$http.fetchPost('companyInfo@editCompanyInfoStatus.action',{
          id:this.currentEnterprice.id,
          ...confirmInfo.postObj
        })
        .then(res => {
          if(Number(res.code) === 0){
            this.$message.success('销户成功');
            this.handleCancel();
            this.getTableData(this.tempCondition,1,10);
          }else if(Number(res.code) === 2){
            this.$message.error(res.msg)
          }else{
            this.$message.error('抱歉,销户失败,请重试');
          }
        })
        .catch(err => {
          this.$message.error('销户失败,请稍后重试')
        })
        .finally(end => {
          this.deleteConfirmLoading = false;
        })
      }
    },

    // 关闭弹框 
    handleCancel(){
      this.changeModalShow  = false;
      this.deleteModalShow = false;
    },

    reGetData(){
      this.getTableData(this.tempCondition,1,10);
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // this.getTableData(this.tempCondition,1,10);
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
  .deleteContainer{
    width: 100%;
    height: 100%;
    padding-top: 10px;
    box-sizing: border-box;
    overflow-y: auto;
  }
</style>