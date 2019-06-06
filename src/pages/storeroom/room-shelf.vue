<!-- template -->
<template>
  <div class="outer">
    <div class="leftTree">
      <OtherTree :treeDataObj="treeDataObj" @accepttreeNode="accepttreeNodeFun"></OtherTree>
    </div>
    <div class="rightContainer">
      <TableView :initArrData="initArr" :totalCount="tableTotalNum" @searchTable="getTableData">
        <!-- tableFormSearch里添加其他按钮 -->
        <span slot="formAction">
          <a-button class="buttonOperate" type="primary" @click="operateFun(currentData={}, 1)">添加</a-button>
        </span>

        <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
        <div slot="tableAction" slot-scope="slotPropsData">
          <a
            href="javascript:;"
            @click="operateFun(currentData=slotPropsData.currRowdata, 3)"
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
    </div>

    <!-- 添加/编辑/浏览 -->
    <div class="addModal">
      <a-modal
        centered
        :title="operateStatus==1 ? '添加密集架': '编辑密集架'"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :width="1600"
        @cancel="handleCancel"
        style="height:85%;overflow: hidden;"
      >
        <TableFromSearch :formDataArr="roomShelfForm" ref="shelfForm"></TableFromSearch>
        <template slot="footer">
          <a-button key="cancel" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="handleOk">提交</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import OtherTree from "@/components/otherTree";
import utils from "../../utils/util.js";
import TableFromSearch from "../../components/tableFormSearch";
export default {
  name: "RoomShelf",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView, OtherTree, TableFromSearch },
  props: [""],

  data() {
    return {
      utils,
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
              title: "密集架编号",
              type: "text",
              required: false,
              placeholder: "请输入密集架编号",
              key: "whdCode",
              name: "whdCode",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "whdCode",
              status: ""
            },
            {
              title: "密集架名称",
              type: "text",
              required: false,
              placeholder: "请输入密集架名称",
              key: "whdName",
              name: "whdName",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "whdName",
              status: ""
            }
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
            title: "密集架编号",
            dataIndex: "whdCode",
            key: "whdCode",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "密集架名称",
            dataIndex: "whdName",
            key: "whdName",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "密集架列数(列)",
            dataIndex: "whdColumnNum",
            key: "whdColumnNum",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "密集架层数(层)",
            dataIndex: "whdLayerNum",
            key: "whdLayerNum",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "每格最大档案盒数(盒)",
            dataIndex: "whdGridNum",
            key: "whdGridNum",
            width: 180,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "空闲容量",
            dataIndex: "freeCapacity",
            key: "freeCapacity",
            width: 120,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "总容量",
            dataIndex: "whdTotalNum",
            key: "whdTotalNum",
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "密集架描述",
            dataIndex: "whdDesc",
            key: "whdDesc",
            width: 180,
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
      //左侧tree
      treeDataObj: {
        isSearch: false,
        searchPlaceholder: "",
        dataArr: []
      },
      selectTreeNode: null, //选择得treeNode值
      tempCondition: {}, //选择查询条件
      visible: false, //模态框默认不显示
      confirmLoading: false, //确认加载状态 默认为false
      operateStatus: null, //当前操作状态：1--添加， 3--编辑
      currentId: null, //当前点击table行的id值
      currWhId: null, //当前点击table行的whId值
      roomShelfForm: {
        formInputs: [
          {
            title: "密集架编号",
            type: "text",
            required: false,
            placeholder: "请输入密集架编号",
            key: "whdCode",
            name: "whdCode",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "whdCode",
            status: ""
          },
          {
            title: "密集架名称",
            type: "text",
            required: false,
            placeholder: "请输入密集架名称",
            key: "whdName",
            name: "whdName",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "whdName",
            status: ""
          },
          {
            title: "密集架列数",
            type: "text",
            required: false,
            placeholder: "请输入密集架列数",
            key: "whdColumnNum",
            name: "whdColumnNum",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "whdColumnNum",
            status: ""
          },
          {
            title: "密集架层数",
            type: "text",
            required: false,
            placeholder: "请输入密集架层数",
            key: "whdLayerNum",
            name: "whdLayerNum",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "whdLayerNum",
            status: ""
          },
          {
            title: "密集架每格盒数",
            type: "text",
            required: false,
            placeholder: "请输入密集架每格盒数",
            key: "whdGridNum",
            name: "whdGridNum",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "whdGridNum",
            status: ""
          },
          {
            title: "密集架描述",
            otherType: "textarea",
            required: false,
            placeholder: "请输入密集架描述",
            key: "whdDesc",
            name: "whdDesc",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "whdDesc",
            status: ""
          }
        ]
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
       * */
      this.tempCondition = condition;
      this.$http
        .fetchPost("wareHouse@getWareHouseDetailList.action", {
          page: pageNum,
          limit: limitNum,
          whdCode: !condition || !condition.whdCode ? "" : condition.whdCode,
          whdName: !condition || !condition.whdName ? "" : condition.whdName,
          whId: !condition || !condition.whId ? "" : condition.whId,
          whAreaName:
            !condition || !condition.whAreaName ? "" : condition.whAreaName
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.tableTotalNum = res.count;
            let tempTableData = res.data;
            this.initArr.tabledataArr = [];
            tempTableData.forEach((element, index) => {
              this.initArr.tabledataArr.push({
                key: element.whdId,  //本身id值
                whId: element.whId,  //对应的分区的id值
                num: (pageNum - 1) * limitNum + index + 1,
                whdCode: element.whdCode,
                whdName: element.whdName,
                whdColumnNum: element.whdColumnNum,
                whdLayerNum: element.whdLayerNum,
                whdGridNum: element.whdGridNum,
                whdDesc: element.whdDesc,
                whdTotalNum: element.whdTotalNum,
                freeCapacity: element.whdTotalNum - element.whdNowNum
              });
            });
          }
        });
    },
    getInitTreeData() {
      /***
       * 功能：获取tree数据
       */
      this.$http
        .fetchPost("wareHouse@getWareHouseTree.action", {
          _: "1558683047124"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let tempTreeData = res.data;
            tempTreeData.push({
              id: 0,
              isParent: "true",
              name: "全部",
              pId: "001"
            });
            this.treeDataObj.dataArr = this.getTreeNewData(tempTreeData);
          }
        });
    },
    getTreeNewData(dataArr) {
      /***
       * 功能：把当前数据转化为tree格式
       * 参数：dataArr:当前需要转化得数据
       */
      let arrData = [];
      dataArr.forEach(item => {
        if (item.pId == "001") {
          let obj = {
            key: item.id,
            pId: item.pId,
            title: item.name,
            children: []
          };
          arrData.push(obj);
        }
      });
      return this.getTreeChildrenData(dataArr, arrData);
    },
    getTreeChildrenData(totalDataArr, dataArr) {
      /****
       * 功能： 遍历根据父的key(即id)匹配子类相同的pId;赋值到对应的children里
       * 参数：totalDataArr:全部的数据； dataArr：当前匹配得到的父的数据
       */
      dataArr.forEach(item => {
        let childrenArr = [];
        totalDataArr.forEach(el => {
          if (item.key == el.pId) {
            childrenArr.push({
              key: el.id,
              pId: el.pId,
              title: el.name,
              children: []
            });
          }
        });
        item.children = childrenArr;
        if (childrenArr.length > 0) {
          this.getTreeChildrenData(totalDataArr, childrenArr);
        }
      });

      return dataArr;
    },
    accepttreeNodeFun(value) {
      //接收左侧tree选择得值；
      this.selectTreeNode = value;
      this.tempCondition = Object.assign({}, this.tempCondition, {
        whId: value.pId,
        whAreaName: value.title
      });
      this.getTableData(this.tempCondition, 1, 10);
    },
    operateFun(data, statusVal) {
      /***
       * 功能：添加或编辑操作
       * 参数：data:当前行数据； statusVal:当前操作状态值：1--添加；3--编辑
       */
      this.operateStatus = statusVal;
      let initData = {};
      if (statusVal == 1) {
        //添加
        initData = {
          whdCode: "",
          whdName: "",
          whdColumnNum: "",
          whdLayerNum: "",
          whdGridNum: "",
          whdDesc: ""
        };
        if (this.selectTreeNode) {
          if (this.selectTreeNode.pId.length > 10) {
            this.visible = true;
          } else {
            this.visible = false;
            this.$message.error("请选择库房具体分区！");
          }
        } else {
          this.visible = false;
          this.$message.error("请选择库房分区！");
        }
      } else {
        //编辑
        this.visible = true;
        initData = data;
        this.currentId = data["key"];
        this.currWhId = data['whId'];
      }
      this.roomShelfForm = this.utils.getNewFormSearch(
        initData,
        this.roomShelfForm
      );
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      let currObjData = this.utils.transferFormToObj(
        this.$refs.shelfForm.getFormData()
      );
      console.log(currObjData);
      if (this.operateStatus == 1) {
        //添加
        currObjData = Object.assign({}, currObjData, {'whId': this.selectTreeNode['pId'], 'whdArea': parseInt(this.selectTreeNode['title'])})
        this.$http
          .fetchPost("wareHouse@insertWareHouseDetail.action", currObjData)
          .then(res => {
            if (Number(res.code) === 0) {
              this.$message.success("添加成功！");
              this.getTableData(this.tempCondition, 1,10);
              setTimeout(() => {
                this.visible = false;
                this.confirmLoading = false;
              }, 2000);
            } else {
              this.$message.error("添加失败！");
            }
          })
          .catch(error => {
            this.$message.error("添加失败！");
          });
      } else {
        //编辑
        currObjData = Object.assign({}, currObjData, { 'whdId': this.currentId, 'whId': this.currWhId });
        console.log(currObjData);
        this.$http
          .fetchPost("wareHouse@editWareHouseDetail.action", currObjData)
          .then(res => {
            if (Number(res.code) === 0) {
              this.$message.success("编辑成功！");
              this.getTableData(this.tempCondition, 1,10);
              setTimeout(() => {
                this.visible = false;
                this.confirmLoading = false;
              }, 2000);
            } else {
              this.$message.error("编辑失败！");
            }
          })
          .catch(error => {
            this.$message.error("编辑失败！");
          });
      }
    },
    deleteFun(data) {
      this.$http
        .fetchPost("wareHouse@deleteWareHouseDetail.action", {
          whdId: data.key
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.$message.success("删除成功!");
            this.getTableData(this.tempCondition, 1, 10);
          } else {
            this.$message.error("删除失败!");
          }
        })
        .catch(error => {
          this.$message.error("删除失败!");
        });
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getInitTreeData();
    this.getTableData(null, 1, 10);
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
.outer {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}
.leftTree {
  width: 14%;
  min-width: 170px;
  height: 100%;
  order: 0;
  /* -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); */
  padding: 10px 12px;
  border-right: 1px solid #dddddd;
}
.rightContainer {
  width: 86%;
  max-width: calc(100% - 170px);
}
</style>