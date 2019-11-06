<!-- 角色管理 -->
<template>
  <div class="outer">
    
    <!-- 添加 -->
    <a-modal
      centered 
      :visible="addState"
      @cancel="handleCancel"
      width="45%"
      :maskClosable='false'
      class="modal"
    >
      <!-- title -->
      <div slot="title" class="titleSlot">
        <p>{{currRowdata && currRowdata.roleName ? "编辑" : "添加"}}</p>
        <span>{{currRowdata && currRowdata.roleName}}</span>
      </div>
      <!-- footer -->
      <div slot="footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button @click="confirmAdd" type="primary" :loading="addConfirmLoading">{{currRowdata && currRowdata.roleName ? "保存" : "添加"}}</a-button>
      </div>
      <div class="addEditModalContainer">
        <TableFromSearch :formDataArr='addFormData' :layout='addModal' ref="addForm"></TableFromSearch>
      </div>
    </a-modal>

    <!-- 授权 -->
    <a-modal
      centered 
      :visible="permissionState"
      @cancel="handleCancel"
      width="50%"
      :maskClosable='false'
      class="modal"
    >
      <!-- title -->
      <div slot="title" class="titleSlot">
        <p>授权</p>
        <span>{{currRowdata && currRowdata.roleName}}</span>
      </div>
      <!-- footer -->
      <div slot="footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="permissionTreeConfirm" :loading="permissionConfirmLoading">保存</a-button>
      </div>
      <a-tabs defaultActiveKey="1" :activeKey="activeTabKey" @change="tabChange" style="height:400px" tabPosition="left">
        <a-tab-pane class="tabPane" tab="功能菜单" key="1">
          <div class="contactCheck"><a-checkbox @change="featureOnChange">关联子节点</a-checkbox></div>
          <div class="paneLoading" v-if="featureTreeLoading">
            <a-spin tip="Loading..." />
          </div>
          <OtherTree v-else :treeDataObj="featureMenuTree" @acceptCheckNode="accepttreeNodeFun(arguments,'featureMenuTree')"></OtherTree>
        </a-tab-pane>
        <a-tab-pane class="tabPane" tab="机构授权" key="2">
          <div class="contactCheck"><a-checkbox @change="organOnChange">关联子节点</a-checkbox></div>
          <div class="paneLoading" v-if="orgTreeLoading">
            <a-spin tip="Loading..." />
          </div>
          <OtherTree v-else :treeDataObj="orgPermissionTree" @acceptCheckNode="accepttreeNodeFun(arguments,'orgPermissionTree')"></OtherTree>
        </a-tab-pane>
      </a-tabs>
    </a-modal>

    <TableView :initArrData="initArr" :totalCount="tableTotalNum" @searchTable="getTableData" :loading="tableLoading">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
          <a-button class="buttonOperate" @click="handleAdd">添加</a-button>
      </span>
      <div slot="tableAction2" slot-scope="slotPropsData">
        <a-switch @click="handleOpenState(slotPropsData.currRowdata)" checkedChildren="已启用" unCheckedChildren="未启用" :checked="String(slotPropsData.currRowdata.roleState) === '1' ? true : false" />
      </div>
      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          href="javascript:;"
          @click="handleAdd(slotPropsData.currRowdata)"
          data-type="编辑"
        >编辑</a>
        <a-popconfirm
          title="确定删除吗?"
          okText="确定"
          cancelText="取消"
          @confirm="deleteFun(slotPropsData.currRowdata)"
        >
          <a href="javascript:;" class="errorBtnColor">删除</a>
        </a-popconfirm>
        <a
          href="javascript:;"
          @click="handlePermisson(slotPropsData.currRowdata)"
          data-type="授权"
          class="primaryBtnColor"
        >授权</a>
      </div>
      
    </TableView>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import TableFromSearch from "@/components/tableFormSearch";
import OtherTree from '@/components/otherTree';

export default {
  name: "RoleManager",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView, TableFromSearch, OtherTree },
  props: [""],

  data() {
    return {
      currRowdata:null,
      tableTotalNum: 0, //总页数：默认为0
      currentPage:1,
      tempCondition:null,
      tableLoading:false,
      activeTabKey:"1",
      permissionConfirmLoading:false,
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
              title: "角色名称",
              type: "text",
              required: false,
              placeholder: "请输入角色名称",
              key: "roleName",
              name: "roleName",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "roleName",
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
            width: 100,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "角色代码",
            dataIndex: "roleCode",
            key: "roleCode",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "角色名称",
            dataIndex: "roleName",
            key: "roleName",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "角色类型",
            dataIndex: "roleType",
            key: "roleType",
            width: 250,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "角色状态",
            dataIndex: "roleState",
            key: "roleState",
            width: 250,
            scopedSlots: { customRender: "action2" }
          },
          {
            title: "角色备注",
            dataIndex: "roleDesc",
            key: "roleDesc",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
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
      addModalTitle:"",
      addState:false,
      addConfirmLoading:false,
      addFormData:{
          formInputs: [
              {
                  title: '角色代码',
                  type: "text",
                  required: true,
                  placeholder: "请输入角色代码(只能包含数字和字母)",
                  key: "roleCode",
                  name: "roleCode",
                  val: void 0,
                  postname: "roleCode",
                  maxlength: 20,
                  minlength: 0,
                  tip: '* 请输入角色代码(只能包含数字和字母)',
                  status: '',
                  reg:"testNumAndChar",
                  colWidth:[24,24],
                  isHide:false,
              },
              {
                  title: '角色名称',
                  type: "text",
                  required: true,
                  placeholder: "请输入角色名称",
                  key: 'roleName',
                  name: 'roleName',
                  postname: "roleName",
                  tip: '* 请输入角色名称',
                  val: void 0,
                  status: '',
                  colWidth:[24,24],
                  isHide:false,
              },
              {
                  title: '角色类型',
                  otherType: 'searchSelect',
                  required: true,
                  placeholder: "请选择角色类型",
                  key: 'roleType',
                  name: 'roleType',
                  postname: "roleType",
                  tip: '* 请选择角色类型',
                  val: void 0,
                  children: [
                    {itemCode:"0",itemName:"系统管理角色"},
                    {itemCode:"1",itemName:"安全管理角色"},
                    {itemCode:"2",itemName:"安全审计角色"},
                    {itemCode:"3",itemName:"系统配置角色"},
                    {itemCode:"4",itemName:"网站管理角色"},
                  ],
                  status: '',
                  colWidth:[24,24],
                  isHide:false,
              },
              {
                title:"角色状态",
                otherType: "radio",
                key: "roleState",
                name: "roleState",
                val: '1',
                postname: "roleState",
                children:[
                  {label:"启用",value:'1'},
                  {label:"禁用",value:'0'},
                ],
                colWidth:[24,24],
              },
              {
                title: '角色备注',
                otherType: 'textarea',
                required: false,
                key: 'roleDesc',
                name: 'roleDesc',
                postname: "roleDesc",
                val: void 0,
                status: '',
                colWidth:[24,24],
                isHide:false,
              },
          ]
      },
      // sendModal 布局
      addModal:{
          defaultCon: {
              labelCol: {
                  sm: { span: 5 },
                  xl: { span: 5 },
                  xxl: { span: 5 }
              },
              wrapperCol: {
                  sm: { span: 17 },
                  xl: { span: 17 },
                  xxl: { span: 17 }
              }
          },
          textareaCon: {
            labelCol: {
              sm: { span: 5 },
              xl: { span: 5 },
              xxl: { span: 5 }
            },
            wrapperCol: {
              sm: { span: 17 },
              xl: { span: 17 },
              xxl: { span: 17 }
            }
          },
      },

      permissionState:false,
      featureTreeLoading:false,
      orgTreeLoading:false,
      featureMenuTree: {
        isChecked: true,
        checkedKeys:[],
        dataArr: [],
        checkStrictly:true,
      },
      orgPermissionTree:{
        isChecked: true,
        checkedKeys:[],
        dataArr: [],
        checkStrictly:true,
      }

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
      this.$http.fetchPost('role@roleLists.action',{
          page: pageNum,
          limit: limitNum,
          ...condition
      }).then((res)=>{
        // console.log(res);
          if(Number(res.code) === 0){
              _this.tableTotalNum = res.count;
              this.initArr.tabledataArr = res.data;
              this.initArr.tabledataArr.forEach((element, index) => {
                Object.assign(element,{
                  key:element.roleId,
                  num: (pageNum - 1) * limitNum + index + 1,
                  userLoginFailnum:String(element.userLoginFailnum) === '0' ? "正常" : "锁定",
                  roleType:this.filterData(element.roleType) ? this.filterData(element.roleType).itemName : element.roleType,
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

    // 过滤数据
    filterData(roleType,itemName){
      let tempObj = this.addFormData.formInputs[2].children.filter(item => item.itemCode === roleType)[0];
      if(tempObj){
        return tempObj
      }
    },

    // 重置数据
    resetFormData(arr){
      arr.forEach(item => {
        if(item.otherType === "radio"){
          item.val = item.children && item.children[0] && item.children[0].value;
        }else{
          item.val = void 0;
          item.status = void 0;
        }
      });
    },

    // 编辑回填数据
    addFormBackFill(){
      this.addFormData.formInputs.forEach(item => {
        if(this.currRowdata && this.currRowdata[item.name]){
          item.val = this.currRowdata[item.name];
        }
      })
    }, 

    // 更改状态
    handleOpenState(currRowdata){
      this.$http.fetchPost("role@changeRoleState.action",{
        roleCode:currRowdata.roleCode,
        roleState:currRowdata.roleState === "1" ? "0" : "1",
      }).then(res => {
        if(Number(res.code) === 0){
          this.$message.success("状态切换成功!");
          this.getTableData(this.tempCondition,this.currentPage,10);
        }else{
          this.$message.warning("状态切换失败,请重试");
        }
      }).catch(err => {
        this.$message.error("抱歉,网路异常,请稍后重试");
      })
    },

    // 添加
    handleAdd(currRowdata){
      this.resetFormData(this.addFormData.formInputs);
      if(currRowdata){
        this.currRowdata = currRowdata;
      }
      this.addFormBackFill();
      this.addState = true;
    },

    // 确认添加
    confirmAdd(){
      let result = this.$refs.addForm.getFormData();
      let postUrl = this.currRowdata.roleId ? "role@roleUpdate.action" : "role@insertRole.action";
      if(!result.isRight) return;
      // 判断code是否重复
      this.$http.fetchPost("role@checkRoleCode.action",{
        roleCode:result.postObj.roleCode
      }).then(res => {
        if(Number(res.code) === 0 || this.currRowdata.roleId){
          this.addConfirmLoading = true;
          this.$http.fetchPost(postUrl,{
            roleId:this.currRowdata.roleId,
            ...result.postObj,
          }).then(res => {
            if(Number(res.code) === 0){
              this.$message.success(this.currRowdata.roleId ? "保存成功!" : "添加成功!");
              this.getTableData(this.tempCondition,this.currentPage,10);
              this.handleCancel();
            }else{
              this.$message.warning(this.currRowdata.roleId ? "保存失败,请重试" : "添加失败,请重试");
            }
          }).catch(err => {
            this.$message.error("抱歉,网路异常,请稍后重试");
          }).finally(end => {
            this.addConfirmLoading = false;
          })
        }else{
          this.$message.warning("抱歉,角色代码重复,请重新输入");
          this.addFormData.formInputs[0].status = "warning";
        }
      })
      
    },

    // 删除
    deleteFun(currRowdata){
      this.$http.fetchPost("role@roleDel.action",{
        roleId:currRowdata.roleId
      }).then(res => {
        if(Number(res.code) === 0){
          this.$message.success("删除成功!");
          this.getTableData(this.tempCondition,this.currentPage,10);
        }else{
          this.$message.warning("删除失败,请重试");
        }
      }).catch(err => {
        this.$message.error("抱歉,网路异常,请稍后重试");
      })
    },


    getNewTreeData(dataArr,checkedArrName) {
      /***
       * 功能：根据ant-design-vue格式重组tree数据:替换原来的id为key; name为title
       */
      if(!(dataArr instanceof Array)) return;
      dataArr.forEach(el => {
        el.title = el.name;
        el.key = el.id;
        el.value = el.id;
        // el.isLeaf = el.isParent === "false" && el.key.length > 10 ? true:null;
        el.isLeaf = el.type === "2" && el.key.length > 10 ? true : null;
        delete el.name;
        delete el.id;
        if(el.checked === "true"){
          this[checkedArrName].checkedKeys.push(el.key);
        }
        if (el.children) {
          this.getNewTreeData(el.children,checkedArrName);
        }
      });
      return dataArr;
    },

    handlePermisson(currRowdata){
      this.permissionState = true;
      this.currRowdata = currRowdata;

      // 获取功能菜单树
      this.featureMenuTree.dataArr = [];
      this.featureMenuTree.checkedKeys = [];
      this.featureTreeLoading = true;
      this.$http.fetchPost("role@getModuleTree.action",{
        rootPId:"0",
        roleId:currRowdata.roleId,
      }).then(res => {
        if(Number(res.code) === 0){
          this.featureMenuTree.dataArr = this.getNewTreeData(res.data,"featureMenuTree");
        }else{
          this.$message.warning("获取数据失败,请刷新重试");
        }
      }).catch(err => {
        this.$message.error("抱歉,网络异常,请稍后重试");
      }).finally(end => {
        this.featureTreeLoading = false;
      })

      // 获取机构树
      this.orgPermissionTree.dataArr = [];
      this.orgPermissionTree.checkedKeys = [];
      this.orgTreeLoading = true;
      this.$http.fetchPost("role@getUnitTree.action",{
        roleId:currRowdata.roleId,
      }).then(res => {
        if(Number(res.code) === 0){
          this.orgPermissionTree.dataArr = this.getNewTreeData(res.data,"orgPermissionTree");
        }else{
          this.$message.warning("获取数据失败,请刷新重试");
        }
      }).catch(err => {
        // console.log(err)
        this.$message.error("抱歉,网络异常,请稍后重试");
      }).finally(end => {
        this.orgTreeLoading = false;
      })
    },

    handleCancel(){
      this.addState = false;
      this.permissionState = false;
    },

    tabChange(activeKey){
      this.activeTabKey = activeKey;
    },

    accepttreeNodeFun(args,arrStrName){
      if(!this[arrStrName].checkStrictly){
        //选择关联子节点时
        this[arrStrName].checkedKeys = args[0];
      } else{
        this[arrStrName].checkedKeys = args[0].checked;
      }
    },

    permissionTreeConfirm(){
      this.permissionConfirmLoading = true;
      let tempKeys = this.activeTabKey === "1" ? this.featureMenuTree.checkedKeys.join(",") : this.orgPermissionTree.checkedKeys.join(",");
      let postUrl = this.activeTabKey === "1" ? "role@saveModuleAuth.action" : "role@saveUnitAuth.action"

      this.$http.fetchPost(postUrl,{
        arrayP:tempKeys,
        roleId:this.currRowdata.roleId,
      }).then(res => {
        if(Number(res.code) === 0){
          this.$message.success("保存成功!");
          this.getTableData(this.tempCondition,this.currentPage,10);
          this.handleCancel();
        }else{
          this.$message.warning("保存失败,请重试");
        }
      }).catch(err => {
        this.$message.error("抱歉,网络异常,请稍后重试");
      }).finally(end => {
        this.permissionConfirmLoading = false;
      })

    },

    featureOnChange(e){
      //功能菜单--是否关联子节点
      if(e.target.checked){
        //关联 
        this.featureMenuTree.checkStrictly = false;
      } else{
        //不关联
        this.featureMenuTree.checkStrictly = true;
      }
    },
    organOnChange(e){
      //机构授权--是否关联子节点
      if(e.target.checked){
        //关联 
        this.orgPermissionTree.checkStrictly = false;
      } else{
        //不关联
        this.orgPermissionTree.checkStrictly = true;
      }
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getTableData(this.tempCondition,this.currentPage,10);
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
.tabPane{
  height: 100%;
  overflow: auto;
}
.paneLoading{
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.contactCheck{
  display: flex;
  justify-content: flex-end;
}
</style>