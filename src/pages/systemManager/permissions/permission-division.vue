<!-- template -->
<template>
  <div class="outer">

  <!-- 授权的 modal -->
  <a-modal
    centered 
    :visible="permissionVisiable"
    @cancel="handleCancel"
    width="60%"
    style="height:60%;overflow: hidden;"
    :maskClosable='false'
  >
    <div slot="title" class="titleSlot">
      <p>授权角色</p>
      <span>{{`共${permissionTotalNum}条记录`}}</span>
    </div>
    <div slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button @click="handlePermission" type="primary" :loading="permissionConfirmLoading">保存</a-button>
    </div>
    <TableView 
      :initArrData="initPermissionArr" 
      @searchTable="getPermissionTableData"
      @listeningCheck="listeningPermissionCheck(arguments)"
      @listeningCheckAll="listeningPermissionCheckAll(arguments)"
      :loading="permissonTableLoading" >
    </TableView>
  </a-modal>
  
  <!-- 分配人员的 modal -->
  <a-modal
    centered 
    :visible="divisionVisiable"
    @cancel="handleCancel"
    width="50%"
    style="height:60%;overflow: hidden;"
    :maskClosable='false'
  >
    <div slot="title" class="titleSlot">
      <p>分配人员</p>
      <span>{{`共${divisionTotalNum}条记录`}}</span>
    </div>
    <div slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button @click="handleDivision" type="primary" :loading="divisionConfirmLoading">确定</a-button>
    </div>
    <TableView 
      :initArrData="initDivisionArr" 
      @searchTable="getDivisionTableData" 
      @listeningCheck="listeningDivisionCheck(arguments)"
      @listeningCheckAll="listeningDivisionCheckAll(arguments)"
      :filterTableCheck='filterTableCheck'
      :loading="divisionTableLoading" >
    </TableView>
  </a-modal>

  <!-- 添加或保存的 modal -->
  <a-modal
      centered 
      :visible="addEditModal"
      @cancel="handleCancel"
      cancelText="取消"
      width="30%"
      :maskClosable='false'
      class="modal"
    >
      <!-- title -->
      <div slot="title" class="titleSlot">
        <p>{{addEditModalTitle}}</p>
        <span>{{treeNodeObj && treeNodeObj.title}}</span>
      </div>
      <!-- footer -->
      <div slot="footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button @click="confirmAddEdit" type="primary" :loading="addModalConfirmLoading">{{modalIsInAdd ? '添加' : '保存'}}</a-button>
      </div>
      <!-- 编辑或添加用户组 -->
      <div class="addEditModalContainer">
        <TableFromSearch :formDataArr='addFormData' :layout='addModal' ref="addForm"></TableFromSearch>
      </div>

    </a-modal>

  <div class="padCon">
    <div class="leftTree">
        <OtherTree :treeDataObj="treeDataObj" @accepttreeNode="accepttreeNodeFun">
          <div slot="treeOperate" class="treeBtnContainer">
            <a-button-group>
              <a-button type="primary" :disabled="addDisabled ? true : false" @click="treeNodeHandle(0)">添加</a-button>
              <a-button :disabled="editDisabled ? true : false" @click="treeNodeHandle(1)">编辑</a-button>
              <a-popconfirm
                title="确定删除此用户组吗?"
                okText="确定"
                cancelText="取消"
                @confirm="treeNodeHandle(2)"
              >
                <a-button type="danger" :disabled="deleteDisabled ? true : false" >删除</a-button>
              </a-popconfirm>
             </a-button-group>
          </div>
        </OtherTree>
    </div>

    <div class="rightTable">
      <TableView :initArrData="initArr" :totalCount="tableTotalNum" @searchTable="getTableData" :loading="tableLoading">
        <!-- tableFormSearch里添加其他按钮 -->
        <template slot="formAction">
            <a-button type="primary" class="buttonOperate" :disabled="divisionDisabled ? true : false" @click="treeNodeHandle(3)">分配人员</a-button>
            <a-button :disabled="permissionDisabled ? true : false" @click="treeNodeHandle(4)">授权</a-button>
        </template>

        <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
        <div slot="tableAction" slot-scope="slotPropsData">
          <a-popconfirm
            title="确定删除吗?"
            okText="确定"
            cancelText="取消"
            @confirm="listDeleteFun(slotPropsData.currRowdata)"
          >
            <a href="javascript:;" class="errorBtnColor">删除</a>
          </a-popconfirm>
        </div>
      </TableView>
    </div>
  
  </div>
  </div>
</template>

<script>
import utils from '../../../utils/util';
import TableView from "@/components/tableView";
import OtherTree from '@/components/otherTree';
import TableFromSearch from "@/components/tableFormSearch";

export default {
  name: "PermissionDivision",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView,OtherTree,TableFromSearch},
  props: [""],

  data() {
    return {
      tableTotalNum: 0, //总页数：默认为0
      currentPage:1,
      permissionTotalNum:0,
      divisionTotalNum:0,
      tableLoading:false,
      permissonTableLoading:false,
      divisionTableLoading:false,
      permissionConfirmLoading:false,
      divisionConfirmLoading:false,
      permissionVisiable:false,
      divisionVisiable:false,
      permissionPostArr:[],
      divisionPostArr:[],
      // tableView传值方式
      initArr: {
        otherTreeFlag:true,
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check
        // formInputs 传值方式
        formData: {
          //forminputs data
          formInputs: [
          ],

          // form btns
          formBtns: []
        },
        //table的表头
        columnsArr: [
          {
            title: "序号",
            dataIndex: "num",
            key: "num",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "角色名称",
            dataIndex: "roleName",
            key: "roleName",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "角色描述",
            dataIndex: "roleDesc",
            key: "roleDesc",
            width:300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "角色来源",
            dataIndex: "type",
            key: "type",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            scopedSlots: { customRender: "action" } 
          }
        ],
        // table数据
        tabledataArr: [],
      },

      // permission table  data
      initPermissionArr: {
        otherTreeFlag:false,
        treeflag: false, //左侧tree是否存在
        tableCheck: true, //table是否可以check
        noPagination:true,
        superimposeWidth:true,
        selectedRowKeys:[], // 默认选择项
        //table的表头
        columnsArr: [
          {
            title: "序号",
            dataIndex: "num",
            key: "num",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "角色名称",
            dataIndex: "roleName",
            key: "roleName",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "角色描述",
            dataIndex: "roleDesc",
            key: "roleDesc",
            width:300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "角色来源",
            dataIndex: "type",
            key: "type",
            scopedSlots: { customRender: "cursorTitle" }
          },
        ],
        // table数据
        tabledataArr: [],
      },

      // division table data
      initDivisionArr:{
        otherTreeFlag:false,
        treeflag: false, //左侧tree是否存在
        tableCheck: true, //table是否可以check
        noPagination:true,
        superimposeWidth:true,
        selectedRowKeys:[], // 默认选择项
        formData: {
          //forminputs data
          formInputs: [
            {
              title: "用户名",
              type: "text",
              placeholder: "请输入需查找用户名",
              key: "userName",
              name: "userName",
              postname: "userName",
              val: void 0
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
            width: 150,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "登录名",
            dataIndex: "userCode",
            key: "userCode",
            width: "40%",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "用户姓名",
            dataIndex: "userName",
            key: "userName",
            scopedSlots: { customRender: "cursorTitle" }
          },
        ],
        // table数据
        tabledataArr: [],
      },

      addFormData:{
          formInputs: [
              {
                  title: '用户组名称',
                  type: "text",
                  required: true,
                  placeholder: "请输入用户组名称(不包含特殊字符)",
                  key: "ugName",
                  name: "ugName",
                  val: void 0,
                  postname: "ugName",
                  maxlength: 20,
                  minlength: 0,
                  reg: 'testNoSpecialStr',
                  tip: '* 请输入正确的用户组名称(不包含特殊字符)',
                  status: '',
                  colWidth:[24,24],
                  isHide:false,
              },
              {
                  title: '所属用户组',
                  otherType: 'searchSelect',
                  required: true,
                  placeholder: "请选择用户所属用户组",
                  key: 'userGroupIds',
                  name: 'userGroupIds',
                  postname: "userGroupIds",
                  tip: '* 请选择用户所属的用户组',
                  val: void 0,
                  children: [],
                  status: '',
                  colWidth:[24,24],
                  isHide:true,
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
                  xl: { span: 18 },
                  xxl: { span: 18 }
              }
          },
      },
      addModalConfirmLoading:false,
      treeNodeObj:null,
      treeDataObj: {
        isSearch: true,
        searchPlaceholder:'请输入搜索用户组名称',
        isChecked: false,
        dataArr: [],
        expandAction:1, // 点击箭头可展开或收缩
      },
      addDisabled:false,
      editDisabled:false,
      deleteDisabled:false,
      divisionDisabled:false,
      permissionDisabled:false,
      addEditModal:false,
      addEditModalIsUserEdit:false,
      addEditModalTitle:"",
      userGroupName:"",
      modalIsInAdd:false,
      userBelong:void 0,
      userBelongArr:[],
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
      // userGroup@getAllotRole.action
      const _this = this;
      this.currentPage = pageNum;
      this.tableLoading = true;
      this.$http.fetchPost('userGroup@getAllotRole.action',{
          page: pageNum,
          limit: limitNum,
          id:this.treeNodeObj.key,
          type:this.treeNodeObj.type,
          ...condition,
      }).then((res)=>{
          if(Number(res.code) === 0){
              _this.tableTotalNum = res.count;
              this.initArr.tabledataArr = res.data;
              this.initArr.tabledataArr.forEach((element, index) => {
                Object.assign(element,{
                  key:element.roleId,
                  num: (pageNum - 1) * limitNum + index + 1,
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

    // 获取授权列表
    getPermissionTableData(condition,pageNum,limitNum){
      const _this = this;
      this.permissonTableLoading = true;
      this.initPermissionArr.selectedRowKeys = [];
      this.initPermissionArr.tabledataArr = [];
      this.$http.fetchPost('userGroup@getRoleList.action',{
          page: pageNum,
          limit: limitNum,
          id:this.treeNodeObj.key,
          type:this.treeNodeObj.type,
          ...condition,
      }).then((res)=>{
          console.log(res);
          if(Number(res.code) === 0){
              console.log(res.data);
              this.permissionTotalNum = res.count;
              this.initPermissionArr.tabledataArr = res.data;
              this.initPermissionArr.tabledataArr.forEach((element, index) => {
                Object.assign(element,{
                  key:element.roleId,
                  num: (pageNum - 1) * limitNum + index + 1,
                });
                if(element.LAY_CHECKED){
                  this.initPermissionArr.selectedRowKeys.push(element.roleId);
                }
              });
          }else{
              this.$message.warning("抱歉,暂时未查到数据!");
          }
      }).catch(err => {
        _this.$message.error("抱歉,网络异常,请稍后重试");
      }).finally(end => {
        _this.permissonTableLoading = false;
      })
    },

    // 获取分配人员列表
    getDivisionTableData(condition,pageNum,limitNum){
      const _this = this;
      this.divisionTableLoading = true;
      this.initDivisionArr.selectedRowKeys = [];
      this.initDivisionArr.tabledataArr = [];
      this.$http.fetchPost('user@getSysUserList.action',{
          page: pageNum,
          limit: limitNum,
          ...condition,
      }).then((res)=>{
          if(Number(res.code) === 0){
              // console.log(res.data);
              this.divisionTotalNum = res.count;
              this.initDivisionArr.tabledataArr = res.data;
              this.initDivisionArr.tabledataArr.sort((item1,item2) => Number(item1.flag) - Number(item2.flag));
              this.initDivisionArr.tabledataArr.forEach((element, index) => {
                Object.assign(element,{
                  key:element.userId,
                  num: (pageNum - 1) * limitNum + index + 1,
                });
                if(element.flag === "1"){
                  this.initDivisionArr.selectedRowKeys.push(element.userId);
                }
              });
          }else{
              this.$message.warning("抱歉,暂时未查到数据!");
          }
      }).catch(err => {
        _this.$message.error("抱歉,网络异常,请稍后重试");
      }).finally(end => {
        _this.divisionTableLoading = false;
      })
    },

    // 过滤授权列表 table 不可选择项
    filterTableCheck(record){
        return { 
            props: {
              disabled: record.flag === "1", // Column configuration not to be checked
            }
        }
    },

    resetAddForm(){
      this.addFormData.formInputs.forEach(item => {
        Object.assign(item,{
          val:void 0,
          status:"",
        })
      })
    },

    treeNodeHandle(handleType){
      // console.log(this.treeNodeObj);
      this.resetAddForm();
      // handleType 0-添加 1-编辑 2-删除 3-分配人员 4-授权
      if(this.treeNodeObj && this.treeNodeObj.key){
        switch (handleType) {
          case 0:
            this.addEditModal = true;
            this.addEditModalTitle = "添加用户组";
            this.modalIsInAdd = true;
            this.userGroupName = "";
            this.addFormData.formInputs[0].isHide = false;
            this.addFormData.formInputs[1].isHide = true;
            this.addFormData.formInputs[0].val = "";
            break;
          case 1:
            this.addEditModal = true;
            this.modalIsInAdd = false;
            if(this.treeNodeObj.isLeaf){
              this.addEditModalTitle = "用户编辑";
              this.addFormData.formInputs[0].isHide = true;
              this.addFormData.formInputs[1].isHide = false;
              this.addFormData.formInputs[1].val = this.treeNodeObj.pId;
            }else{
              this.addEditModalTitle = "编辑用户组";
              this.addFormData.formInputs[0].isHide = false;
              this.addFormData.formInputs[1].isHide = true;
              this.addFormData.formInputs[0].val = this.treeNodeObj.title;
            }
            break;
          case 2:
            this.$http.fetchPost("userGroup@deleteUserGroupById.action",{
              id:this.treeNodeObj.key
            }).then(res => {
              if(Number(res.code) === 0){
                this.$message.success("删除成功!");
                this.initFetch();
                this.resetDisabled();
                this.treeNodeObj = null;
              }else{
                this.$message.warning("删除失败,请重试");
              }
            }).catch(err => {
              this.$message.error('抱歉，网络异常，请稍后重试！');
            })
            break;
          case 3:
            this.divisionVisiable = true;
            this.getDivisionTableData(null,1,99999);
            break;
          case 4:
            this.permissionVisiable = true;
            this.getPermissionTableData(null,1,99999);
            break;
          default:
            break;
        }
      }else{
        this.$message.warning("请选择需要操作的树节点");
      }
    },

    // 树重拍
    getNewTreeData(dataArr) {
      /***
       * 功能：根据ant-design-vue格式重组tree数据:替换原来的id为key; name为title
       */
      dataArr.forEach(el => {
        el.title = el.name;
        el.key = el.id;
        el.value = el.id;
        // el.isLeaf = el.isParent === "false" && el.key.length > 10 ? true:null;
        el.isLeaf = el.type === "2" && el.key.length > 10 ? true : null;
        delete el.name;
        delete el.id;
        if (el.children) {
          this.getNewTreeData(el.children);
        }
      });
      return dataArr;
    },

    // 获取树数据
    getTreeData(){
      this.$http.fetchPost("userGroup@getUserGroupTree.action",{
        rootPId:"0"
      }).then(res => { 
          if(Number(res.code) === 0){
            this.treeDataObj.dataArr = this.getNewTreeData(utils.one2MultiDimensional("0",res.data));
            // console.log(this.treeDataObj.dataArr)
          } else{
              this.$message.warning('抱歉，获取数据失败，请刷新后重试！');
          }
      }).catch(error => {
          // console.error(error)
          this.$message.error('抱歉，网络异常，请稍后重试！');
      })

    },

    // 点击树
    accepttreeNodeFun(node){

      this.treeNodeObj = node;
      this.resetDisabled();
      // console.log(data);
      if(node.pId === "0"){
        // 根节点
        this.deleteDisabled = true;
        this.divisionDisabled = true;
        this.permissionDisabled = true;
        this.initArr.tabledataArr = [];
      }else if(node.isLeaf){
        // 叶子节点
        this.addDisabled = true;
        this.deleteDisabled = true;
        this.divisionDisabled = true;
        this.getTableData(null,this.currentPage,10);
      }else{
        // 非根节点和叶子节点
        this.addDisabled = true;
        this.getTableData(null,this.currentPage,10);
      }
    },

    // 删除列表已授权的角色
    listDeleteFun(row){

      this.$http.fetchPost("userGroup@deleteRole.action",{
        id:this.treeNodeObj.key,
        type:this.treeNodeObj.type,
        roleId:row.roleId
      }).then(res => {
        if(Number(res.code) === 0){
          this.$message.success("删除成功!");
          this.getTableData(null,this.currentPage,10);
        }else{
          this.$message.warning("删除失败,请重试");
        }
      }).catch(err => {
        this.$message.error("抱歉,网络异常,请稍后重试");
      });

    },

    // 重置按钮
    resetDisabled(){
      this.addDisabled = false;
      this.editDisabled = false;
      this.deleteDisabled = false;
      this.divisionDisabled = false;
      this.permissionDisabled = false;
    },

    // 添加或编辑确认
    confirmAddEdit(){

      // judge form result is right or not
      let result = this.$refs.addForm.getFormData();
      if(!result.isRight) return;

      // loading ...
      this.addModalConfirmLoading = true;

      // userGroup@insertUserGroup.action ugCode
      if(this.modalIsInAdd){

        // 添加
        this.$http.fetchPost("userGroup@insertUserGroup.action",{
          ugCode:this.treeNodeObj.key,
          ...result.postObj, //ugName
        }).then(res => {
          if(Number(res.code) === 0){
            this.$message.success("添加成功!");
            this.handleCancel();
            this.initFetch();
          }else{
            this.$message.warning("添加失败,请重试");
          }
        }).catch(err => {
          this.$message.error("抱歉,网络异常,请稍后重试");
        }).finally(end => {
          this.addModalConfirmLoading = false;
        });

      }else if(this.treeNodeObj){
        //编辑
        if(this.treeNodeObj.isLeaf){

          // 编辑用户所属
          this.$http.fetchPost("userGroup@editGroupUser.action",{
            userId:this.treeNodeObj.key,
            ...result.postObj
          }).then(res => {
            if(Number(res.code) === 0){
              this.$message.success("修改成功!");
              this.handleCancel();
              this.initFetch();
            }
          }).catch(err => {
            this.$message.error("抱歉,网络异常,请稍后重试");
          }).finally(end => {
            this.addModalConfirmLoading = false;
          });

        }else{

          // 编辑用户组名称
          this.$http.fetchPost("userGroup@insertUserGroup.action",{
            id:this.treeNodeObj.key,
            ugCode:this.treeNodeObj.pId,
            ...result.postObj, //ugName
          }).then(res => {
            if(Number(res.code) === 0){
              this.$message.success("修改成功!");
              this.handleCancel();
              this.initFetch();
            }else{
              this.$message.warning("修改失败,请重试");
            }
          }).catch(err => {
            this.$message.error("抱歉,网络异常,请稍后重试");
          }).finally(end => {
            this.addModalConfirmLoading = false;
          });

        }
      }
    },
    
    // 监听授权 table check 事件
    listeningPermissionCheck(args){
      this.permissionPostArr = [];
      args[2].forEach(item => {
        this.permissionPostArr.push(item.roleId)
      })
    },

    listeningPermissionCheckAll(args){
      this.permissionPostArr = [];
      args[1].forEach(item => {
        this.permissionPostArr.push(item.roleId)
      })
    },

    // 保存授权
    handlePermission(){
      // strArr
      // console.log(this.permissionPostArr);
      this.permissionConfirmLoading = true;
      this.$http.fetchPost("userGroup@insertRole.action",{
        id:this.treeNodeObj.key,
        type:this.treeNodeObj.type,
        strArr:this.permissionPostArr.join(",")
      }).then(res => {
        if(Number(res.code) === 0){
          this.$message.success("保存成功!");
          this.handleCancel();
          this.getTableData(null,this.currentPage,10);
        }else{
          this.$message.warning("保存失败,请重试");
        }
      }).catch(err => {
        this.$message.error("抱歉,网络异常,请稍后重试");
      }).finally(end => {
        this.permissionConfirmLoading = false;
      })
    },
    

    // 监听分配 table check 事件
    listeningDivisionCheck(args){
      // selected 即第二参数为 true 添加,为 false 遍历删除
      if(args[1]){
        this.divisionPostArr.push(args[0].userId);
      }else{
        this.divisionPostArr.forEach((item,index) => {
          if(item === args[0].userId){
            this.divisionPostArr.splice(index,1);
          }
        })
      }
    },

    listeningDivisionCheckAll(args){
      // selected 为 true 全部添加,为 false 置空
      if(args[0]){
        args[2].forEach(item => {
          this.divisionPostArr.push(item.userId);
        });
      }else{
        this.divisionPostArr.splice(0,this.divisionPostArr.length);
      }
    },

    // 确定分配
    handleDivision(){
      // strArr
      // console.log(this.divisionPostArr)
      this.divisionConfirmLoading = true;
      this.$http.fetchPost("user@saveUsergroup.action",{
        userGroupId:this.treeNodeObj.key,
        strArr:this.divisionPostArr.join(",")
      }).then(res => {
        if(Number(res.code) === 0){
          this.$message.success("分配成功!");
          this.handleCancel();
        }else{
          this.$message.warning("分配失败,请重试");
        }
      }).catch(err => {
        this.$message.error("抱歉,网络异常,请稍后重试");
      }).finally(end => {
        this.divisionConfirmLoading = false;
      })
    },

    handleCancel(){
      this.addEditModal = false;
      this.permissionVisiable = false;
      this.divisionVisiable = false;
    },

    // 获取所有的用户组
    getAllUserGroup(){
      this.$http.fetchPost("userGroup@getUserGroupList.action",{})
        .then(res => {
          if(Number(res.code) === 0){
            this.addFormData.formInputs[1].children = [];
            res.data.forEach(item => {
              this.addFormData.formInputs[1].children.push({
                itemName:item.ugName,
                itemCode:item.id,
                itemKey:item.ugCode,
              })
            });
          }
        })
    },
    
    // initFetch
    initFetch(){
      this.getTreeData();
      this.getAllUserGroup();
    },

  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.initFetch();
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

.padCon{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background: #fff;
}
.leftTree{
    width: 14%;
    min-width: 170px;
    height: 100%;
    float: left;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    padding: 10px 12px;
}
.rightTable{
    height: 100%;
    width: 86%;
    max-width: calc(100% - 170px);
    float: right;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
}
.treeBtnContainer{
  display: flex;
  justify-content: center;
  padding-bottom: 15px;
}
.addEditModalContainer{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}
.addEditModalContainer>div{
  width: 100%;
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
</style>