<!-- template -->
<template>
  <div class="outer">

    <a-modal
      centered 
      :visible="addModalState"
      @cancel="handleCancel"
      @ok="confirmAdd"
      okText="保存"
      cancelText="取消"
      width="60%"
      :maskClosable='false'
      class="modal"
    >
      <div slot="title" class="titleSlot">
        <p>{{addModalTitle}}</p>
        <span>{{currUserData && currUserData.userName}}</span>
      </div>
      <div class="addContainer">
        <TableFromSearch :formDataArr='addFormData' :layout='addModal' ref="addForm"></TableFromSearch>
      </div>
    </a-modal>

    <TableView :initArrData="initArr" :totalCount="tableTotalNum" @searchTable="getTableData" :loading="tableLoading">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
          <a-button class="buttonOperate" @click="handleAdd(0)">添加</a-button>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          href="javascript:;"
          data-type="密码重置"
          class="infoBtnColor"
          @click="resetPsw(slotPropsData.currRowdata)"
        >密码重置</a>
        <a
          href="javascript:;"
          data-type="解锁"
          class="primaryBtnColor"
          @click="unLockUser(slotPropsData.currRowdata)"
        >解锁</a>
        <a
          href="javascript:;"
          @click="handleAdd(1,slotPropsData.currRowdata)"
          data-type="编辑"
        >编辑</a>
        <a-popconfirm
          title="确定删除此用户吗?"
          okText="确定"
          cancelText="取消"
          @confirm="deleteFun(slotPropsData.currRowdata)"
        >
          <a href="javascript:;" class="errorBtnColor">删除</a>
        </a-popconfirm>
      </div>

      <div slot="tableAction2" slot-scope="slotPropsData">
        <a-switch @click="handleChecked(slotPropsData.currRowdata)" checkedChildren="已启用" unCheckedChildren="未启用" :checked="String(slotPropsData.currRowdata.userState) === '1' ? true : false" />
      </div>
    </TableView>

  </div>
</template>

<script>
import TableView from "@/components/tableView";
import TableFromSearch from "@/components/tableFormSearch";
import moment from "moment";
export default {
  name: "UserManager",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView,TableFromSearch },
  props: [""],

  data() {
    return {
      tableTotalNum: 0, //总页数：默认为0
      currentPage:1,
      tableLoading:false,
      tempCondition:null,
      addModalState:false, // 添加 modal
      currUserData:null,
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
              title: "用户名称",
              type: "text",
              required: false,
              placeholder: "请输入用户名称",
              key: "userName",
              name: "userName",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "userName",
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
            width: 100,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "登录名",
            dataIndex: "userCode",
            key: "userCode",
            width: 250,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "用户姓名",
            dataIndex: "userName",
            key: "userName",
            width: 250,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "是否锁定",
            dataIndex: "userLoginFailnum",
            key: "userLoginFailnum",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "到期时间",
            dataIndex: "userIndate",
            key: "userIndate",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "用户状态",
            dataIndex: "userState",
            key: "userState",
            width: 300,
            scopedSlots: { customRender: "action2" }
          },
          {
            title: "操作",
            key: "action",
            scopedSlots: { customRender: "action" }
          }
        ],
        // table数据
        tabledataArr: []
      },
      addFormData:{
        formInputs: [
          {
              title: '登录名',
              type: "text",
              required: true,
              placeholder: "请输入登录名",
              key: "userCode",
              name: "userCode",
              val: void 0,
              postname: "userCode",
              maxlength: 20,
              minlength: 0,
              reg: '',
              tip: '* 请输入登录名',
              status: '',
              colWidth:[12,24],
          },
          {
              title: '用户姓名',
              type: "text",
              required: true,
              placeholder: "请输入用户名",
              key: "userName",
              name: "userName",
              val: void 0,
              postname: "userName",
              maxlength: 20,
              minlength: 0,
              reg: '',
              tip: '* 请输入用户名',
              status: '',
              colWidth:[12,24],
          },
          {
              title: '所属机构',
              otherType: "select",
              required: true,
              placeholder: "请选择所属机构",
              key: "orgId",
              name: "orgId",
              val: void 0,
              postname: "orgId",
              reg: '',
              tip: '* 请选择所属机构',
              status: '',
              colWidth:[12,24],
              children:[],
          },
          {
              title: '账号有效期',
              otherType: "date",
              required: false,
              placeholder: "请选择账号有效期日期",
              key: "userIndate",
              name: "userIndate",
              val: void 0,
              postname: "userIndate",
              maxlength: 20,
              minlength: 0,
              reg: '',
              tip: '* 请输入用户名',
              status: '',
              colWidth:[12,24],
          },
          {
            title:"用户状态",
            otherType: "radio",
            key: "userState",
            name: "userState",
            val: '1',
            postname: "userState",
            children:[
              {label:"启用",value:'1'},
              {label:"禁用",value:'0'},
            ],
            colWidth:[12,24],
          },
        ]
      },
      // sendModal 布局
      addModal:{
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
      addModalTitle:"",
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
      this.currentPage = pageNum;
      this.$http.fetchPost('user@getSysUserList.action',{
          page: pageNum,
          limit: limitNum,
          ...condition
      }).then((res)=>{
          if(Number(res.code) === 0){
              _this.tableTotalNum = res.count;
              this.initArr.tabledataArr = res.data;
              this.initArr.tabledataArr.forEach((element, index) => {
                Object.assign(element,{
                  key:element.userId,
                  num: (pageNum - 1) * limitNum + index + 1,
                  userLoginFailnum:String(element.userLoginFailnum) === '0' ? "正常" : "锁定"
                });
              });
          }else{
              _this.$message.warning("抱歉,暂时未查到数据!");
          }
      }).catch(err => {
        _this.$message.error("抱歉,网络异常,请稍后重试");
      }).finally(end => {
        _this.tableLoading = false;
      })
    },

    // 添加 或 编辑 modalType 0-> 添加 1-> 编辑
    handleAdd(modalType,currRowdata){
      this.currUserData = currRowdata;
      if(modalType === 0){
        this.addModalTitle = "添加用户";
      }else if(modalType === 1){
        this.addModalTitle = "编辑用户";
      }
      this.changeAddFormData();
      this.addModalState = true;
    }, 

    // 更改弹框数据 addFormData
    changeAddFormData(){
      this.resetAddFormData();
      this.addFormData.formInputs.forEach(item => {
        if(this.currUserData && this.currUserData[item.name]){
          if(item.otherType === "date"){
            item.val = moment(this.currUserData[item.name]);
          }else{
            item.val = this.currUserData[item.name]
          }
        }
      });
    },

    // 重置弹框数据
    resetAddFormData(){
      this.addFormData.formInputs.forEach(item => {
        if(item.otherType === "radio"){
          item.val = item.children && item.children[0] && item.children[0].value;
        }else{
          item.val = void 0;
          item.status = void 0;
        }
      });
    },

    confirmAdd(){
      // 验证用户是否已经存在
      this.$http.fetchPost("user@checkUserCode.action",{
        userCode:this.addFormData.formInputs[0].val,
        userId:this.currUserData && this.currUserData.userId,
      }).then(res => {
        let result = this.$refs.addForm.getFormData();
        if(Number(res.code) === 2 && result.isRight){
          // 验证通过
          if(!this.currUserData){

            // 添加
            this.$http.fetchPost("user@InserOrUpdateSysUser.action",{
              ...result.postObj,
            }).then(res => {

              if(Number(res.code) === 0){
                this.$message.success("添加成功!");
                this.getTableData(this.tempCondition,this.currentPage,10);
                this.handleCancel();
              }else{
                this.$message.warning("抱歉,添加失败,请重试!");
              }
            }).catch(err => {
              this.$message.error("抱歉,网络异常,请稍后重试");
            })

          }else if(this.currUserData.userId){

            // 编辑
            this.$http.fetchPost("user@InserOrUpdateSysUser.action",{
              ...result.postObj,
              userId:this.currUserData.userId,
            }).then(res => {
              // console.log(res);
              if(Number(res.code) === 0){
                this.$message.success("编辑修改成功!");
                this.getTableData(this.tempCondition,this.currentPage,10);
                this.handleCancel();
              }else{
                this.$message.warning("抱歉,编辑修改失败,请重试!");
              }
            }).catch(err => {
              this.$message.error("抱歉,网络异常,请稍后重试");
            })

          }
        }else{
          // 验证不通过
          this.$message.warning("抱歉,登录名已存在!");
        }
      });
      
    },

    // 关闭
    handleCancel(){
      this.addModalState = false;
    },

    // 切换用户状态
    handleChecked(rowData){
      let postState = "";
      if(rowData.userState === "0"){
        postState = "1";
      }else{
        postState = "0";
      }
      this.$http.fetchPost('user@updateUserStateByUserCode.action',{
        userCode:rowData.userCode,
        userState:postState,
      }).then(res => {
        if(Number(res.code) === 0){
          this.$message.success("状态切换成功!");
          this.getTableData(this.tempCondition,this.currentPage,10);
        }else{
          this.$message.warning("抱歉,用户状态切换失败,请重试");
        }
      }).catch(err => {
        this.$message.error("抱歉,网络异常,请稍后重试");
      })
    },

    // 重置密码
    resetPsw(rowData){
      if(rowData.userId){
        this.$http.fetchGet('user@resetPassword.action',{
          userId:rowData.userId,
        }).then(res => {
          if(Number(res.code) === 0){
            this.$message.success("重置密码成功!");
            // this.getTableData(this.tempCondition,this.currentPage,10);
          }else{
            this.$message.warning("抱歉,重置密码失败,请重试");
          }
        }).catch(err => {
          this.$message.error("抱歉,网络异常,请稍后重试");
        })
      }
    },

    // 解锁
    unLockUser(rowData){
      if(rowData.userLoginFailnum === '正常'){
        this.$message.warning("用户未锁定");
      }else{
        this.$http.fetchPost("user@updateUserStateByUserCode.action",{
          userCode:rowData.userCode,
          userLoginFailnum:"0",
        }).then(res => {
          if(Number(res.code) === 0){
            this.$message.success("解锁成功!");
            this.getTableData(this.tempCondition,this.currentPage,10);
          }else{
            this.$message.warning("抱歉,解锁失败,请重试");
          }
        }).catch(err => {
          this.$message.error("抱歉,网络异常,请稍后重试");
        })
      }
    },

    // 删除
    deleteFun(rowData){
      if(rowData.userId){
        this.$http.fetchPost("user@deleteSysUser.action",{
          userId:rowData.userId
        }).then(res => {
          if(Number(res.code) === 0){
            this.$message.success("删除成功!");
          }else{
            this.$message.warning("抱歉,删除失败,请重试");
          }
        }).catch(err => {
          this.$message.error("抱歉,网络异常,请稍后重试");
        })
      }
    },

  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getTableData(this.tempCondition,1,10);

    // 获取机构
    this.$http.fetchPost("user@findOrg.action",{})
      .then(res => {
        if(Number(res.code) === 0){
          res.data.forEach(item => {
            this.addFormData.formInputs[2].children.push({
              itemCode:item.b01000,
              itemName:item.b0101,
            })
          })
          
        }
      })
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
  .titleSlot{
    display: flex;
  }
  .titleSlot>p{
    margin-right: 40px;
  }
  .titleSlot>span{
    color:#2d8cf0;
  }
</style>