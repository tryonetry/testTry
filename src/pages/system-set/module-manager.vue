<!-- template -->
<template>
  <div class="outer">
    <div class="padCon">
      <div class="leftTree">
        <OtherTree :treeDataObj="treeDataObj" @accepttreeNode="accepttreeNodeFun">
          <!-- <span slot="treeOperate">
                 <a-button class="buttonOperate" type="primary" size="small">添加</a-button>
          </span>-->
        </OtherTree>
      </div>
      <div class="rightTable">
        <TableView
          :initArrData="initArr"
          :totalCount="tableTotalNum"
          :loading="tableLoading"
          @searchTable="getTableData"
        >
           <div slot="tableAction2" slot-scope="slotPropsData">
            <a-switch @click="handleChecked(slotPropsData.currRowdata)" checkedChildren="已启用" unCheckedChildren="未启用" :checked="String(slotPropsData.currRowdata.muState) === '1' ? true : false" />
          </div>
        </TableView>
      </div>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import OtherTree from "@/components/otherTree";
export default {
  name: "ModuleManager",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView, OtherTree },
  props: [""],

  data() {
    return {
      tableTotalNum: 0, //总页数：默认为0
      tableLoading: false, //table--loading
      // tableView传值方式
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check
        superimposeWidth: true, //
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
            title: "名称",
            dataIndex: "muName",
            key: "muName",
            width: 200,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "编号",
            dataIndex: "muCode",
            key: "muCode",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "地址",
            dataIndex: "muHelpUrl",
            key: "muHelpUrl",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "类别",
            dataIndex: "muType",
            key: "muType",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "是否启用",
            dataIndex: "muState",
            key: "muState",
            scopedSlots: { customRender: "action2" }
          }
        ],
        // table数据
        tabledataArr: []
      },
      treeDataObj: {
        isSearch: false,
        isChecked: false,
        dataArr: []
      },
      mouduleId: "" //选择的节点id
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
      this.tableLoading = true;
      this.$http
        .fetchPost("module@getModuleList.action", {
          page: pageNum,
          limit: limitNum,
          modulePid: this.mouduleId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.tableTotalNum = res.count;
            let tempTableData = res.data;
            this.initArr.tabledataArr = [];
            tempTableData.forEach((element, index) => {
              this.initArr.tabledataArr.push({
                key: element.muId, //主键值
                num: (pageNum - 1) * limitNum + index + 1, //序号
                muName: element.muName,
                muCode: element.muCode, 
                muHelpUrl: element.muHelpUrl,
                muType: element.muType === '1' ? '操作': '菜单',
                muState: element.muState,
              });
            });
          } else {
            this.$message.warning("抱歉，获取数据失败，请刷新后重试！");
          }
        })
        .catch(error => {
          this.$message.error("抱歉，网络异常，请稍后重试！");
        })
        .finally(end => {
          this.tableLoading = false;
        });
    },
    getModuleTreeData() {
      /**
       * 功能：获取模块左侧tree数据,将tree数据重组
       */
      this.$http
        .fetchPost("module@getParentModule.action")
        .then(res => {
          if (Number(res.code) === 0) {
            this.getTreeRootFun(res.data);
          } else {
            this.$message.warning("抱歉，获取数据失败，请刷新后重试！");
          }
        })
        .catch(error => {
          this.$message.error("抱歉，网络异常，请稍后重试！");
        });
    },
    getTreeRootFun(data) {
      /**
       * 功能：过滤获取tree--根节点；重组tree数据
       * 参数：data:当前需重组的数据
       */
      if (data && data.length > 0) {
        let resultTree = [];
        data.forEach(el => {
          if (Number(el.pId) === 0) {
            resultTree.push(el);
            this.mouduleId = el.id;
            el.children = this.restructureTreeFun(el.id, data);
          }
        });
        this.treeDataObj.dataArr = this.getNewTreeData(resultTree);
        this.getTableData(null, 1, 10);
      }
    },
    restructureTreeFun(nodeId, data) {
      /**
       * 功能：根据nodeId从data中过滤出chidren
       * 参数：nodeId：父id值； data：重组的数据
       */
      let childData = [];
      data.forEach(item => {
        if (nodeId === item.pId) {
          childData.push(item);
          item.children = this.restructureTreeFun(item.id, data);
        }
      });
      return childData;
    },
    getNewTreeData(dataArr) {
      /***
       * 功能：根据ant-design-vue格式重组tree数据:替换原来的id为key; name为title
       */
      dataArr.forEach(el => {
        el.title = el.name;
        el.key = el.id;
        el.value = el.id;
        el.isLeaf = el.isParent === "false" && el.key.length > 10 ? true : null;
        delete el.name;
        delete el.id;
        if (el.children) {
          this.getNewTreeData(el.children);
        }
      });
      return dataArr;
    },
    accepttreeNodeFun(data) {
      /**
       * 功能：接收tree选择的数据
       */
      console.log(data);
      this.mouduleId = data.key;
      this.getTableData(null, 1, 10);
    },
    handleChecked(rowData){
      /**
       * 功能：是否启用操作：切换状态
       * 参数：rowData：当前行数据
       */
      let postState = "";
      if(rowData.muState === "0"){
        postState = "1";
      }else{
        postState = "0";
      }
      this.$http.fetchPost('module@updateModuleStateByModuleCode.action', {
        moduleCode:rowData.muCode,
        muState: postState
      }).then(res => {
         if(Number(res.code) === 0){
            this.$message.success("状态切换成功!");
            this.getTableData(null, 1, 10);
         }else{
          this.$message.warning("抱歉,操作失败,请刷新后重试！");
        }
      }).catch(error => {
        this.$message.error("抱歉，网络异常，请稍后重试！");
      });
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getModuleTreeData();
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
.padCon {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
}
.leftTree {
  width: 14%;
  min-width: 170px;
  height: 100%;
  float: left;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding: 10px 12px;
}
.rightTable {
  height: 100%;
  width: 86%;
  max-width: calc(100% - 170px);
  float: right;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
}
</style>