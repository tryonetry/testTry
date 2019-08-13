<!-- template -->
<template>
  <div class="outer">
    <div class="padCon">
      <div class="leftTree">
         <OtherTree :treeDataObj="treeDataObj" @accepttreeNode="accepttreeNodeFun"></OtherTree>
      </div>
      <div class="rightTable">
        <TableView :initArrData="initArr" :totalCount="tableTotalNum" @searchTable="getTableData">
          <!-- tableFormSearch里添加其他按钮 -->
          <span slot="formAction">
            <a-button class="buttonOperate" type="primary">生成数据</a-button>
          </span>
        </TableView>
      </div>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import OtherTree from '@/components/otherTree'
export default {
  name: "padData",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView, OtherTree },
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
          formInputs: [
            //input
            {
              title: "客户端密码",
              type: "text",
              required: false,
              placeholder: "请输入客户端密码",
              key: "",
              name: "",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "",
              status: ""
            },
            {
              title: "备注信息",
              type: "text",
              required: false,
              placeholder: "请输入备注信息",
              key: "",
              name: "",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "",
              status: ""
            }
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
            fixed: "left",
            width: 60,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "文件名",
            dataIndex: "",
            key: "",
            width: 300,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "文件大小",
            dataIndex: "",
            key: "",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "生成时间",
            dataIndex: "",
            key: "",
            width: 250,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "信息备注",
            dataIndex: "",
            key: "",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            width: 200,
            fixed: "right",
            scopedSlots: { customRender: "action" }
          }
        ],
        // table数据
        tabledataArr: []
      },
      treeDataObj: {
        isSearch: true,
        searchPlaceholder:'请输入搜索机构名称',
        isChecked: true,
        dataArr: []
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
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
       *         */
    },
    getPadTreeData(){
        this.$http.fetchPost('padFilePackage@getParentId.action', {
            upUnitId: ''
        }).then(res => { 
           if(Number(res.code) === 0){
              this.treeDataObj.dataArr = this.getNewTreeData(res.data);
           } else{
               this.$message.warning('抱歉，获取数据失败，请刷新后重试！');
           }
        }).catch(error => {
            this.$message.error('抱歉，网络异常，请稍后重试！');
        })
    },
    getNewTreeData(dataArr) {
      /***
       * 功能：根据ant-design-vue格式重组tree数据:替换原来的id为key; name为title
       */
      dataArr.forEach(el => {
        el.title = el.name;
        el.key = el.id;
        el.value = el.id;
        el.isLeaf = el.isParent === "false" && el.key.length > 10 ? true:null;
        delete el.name;
        delete el.id;
        if (el.children) {
          this.getNewTreeData(el.children);
        }
      });
      return dataArr;
    },
    accepttreeNodeFun(data){
      /**
       * 功能：接收tree选择的数据
       */
      console.log(data);
    },
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
      this.getPadTreeData();
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
</style>