<!-- template -->
<template>
  <div class="outer">
  <div class="padCon">
    <div class="leftTree">
        <OtherTree :treeDataObj="treeDataObj" @accepttreeNode="accepttreeNodeFun">
          <div slot="treeOperate" class="treeBtnContainer">
            <a-button-group>
              <a-button type="primary" :disabled="addDisabled ? true : false" @click="treeNodeHandle(0)">添加</a-button>
              <a-button :disabled="editDisabled ? true : false" @click="treeNodeHandle(1)">编辑</a-button>
              <a-button type="danger" :disabled="deleteDisabled ? true : false" @click="treeNodeHandle(2)">删除</a-button>
             </a-button-group>
          </div>
        </OtherTree>
    </div>

    <div class="rightTable">
      <TableView :initArrData="initArr" :totalCount="tableTotalNum" @searchTable="getTableData">
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
            @confirm="deleteFun(slotPropsData.currRowdata, slotPropsData.currTableData)"
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

export default {
  name: "PermissionDivision",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView,OtherTree },
  props: [""],

  data() {
    return {
      tableTotalNum: 0, //总页数：默认为0
      // tableView传值方式
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check
        // formInputs 传值方式
        formData: {
          //forminputs data
          formInputs: [],

          // form btns
          formBtns: []
        },
        //table的表头
        columnsArr: [
          {
            title: "序号",
            dataIndex: "num",
            key: "num",
            fixed: "left",
            width: 60,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "角色名称",
            dataIndex: "",
            key: "",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "角色描述",
            dataIndex: "",
            key: "",
            width:250,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "角色来源",
            dataIndex: "",
            key: "",
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
      treeNodeObj:null,
      treeDataObj: {
        isSearch: true,
        searchPlaceholder:'请输入搜索机构名称',
        isChecked: false,
        dataArr: []
      },
      addDisabled:false,
      editDisabled:false,
      deleteDisabled:false,
      divisionDisabled:false,
      permissionDisabled:false,
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
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
       *         */
    },

    treeNodeHandle(handleType){
      // handleType 0-添加 1-编辑 2-删除 3-分配人员 4-授权
      if(this.treeNodeObj && this.treeNodeObj.key){
        switch (handleType) {
          case 0:
            
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            break;
          case 4:
            break;
          default:
            break;
        }
      }else{
        this.$message.warning("请选择需要操作的树节点");
      }
    },
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
          } else{
              this.$message.warning('抱歉，获取数据失败，请刷新后重试！');
          }
      }).catch(error => {
          console.error(error)
          this.$message.error('抱歉，网络异常，请稍后重试！');
      })

    },

    accepttreeNodeFun(node){
      this.treeNodeObj = node;
      this.resetDisabled();
      // console.log(data);
      if(node.pId === "0"){
        // 根节点
        this.deleteDisabled = true;
        this.divisionDisabled = true;
        this.permissionDisabled = true;
      }else if(node.isLeaf){
        // 叶子节点
        this.addDisabled = true;
        this.deleteDisabled = true;
        this.divisionDisabled = true;
      }else{
        // 非根节点和叶子节点
        this.addDisabled = true;
      }
    },

    resetDisabled(){
      this.addDisabled = false;
      this.editDisabled = false;
      this.deleteDisabled = false;
      this.divisionDisabled = false;
      this.permissionDisabled = false;
    },

  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getTreeData();
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
</style>