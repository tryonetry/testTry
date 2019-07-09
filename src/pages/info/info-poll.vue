<!--人才信息总库-->
<template>
  <div class="outer">
    <TableView
      :initArrData="initArr"
      :totalCount="tableTotalNum"
      @searchTable="getTableData"
      ref="updateTable"
      @accepttreeNode="accepttreeNodeFun"
    >
      <span slot="formAction">
        <a-button class="buttonOperate" type="primary" @click="operateFun(currentData = {},1)">添加</a-button>
        <a-button class="buttonOperate" @click="portraitView">个人画像</a-button>
        <a-button class="buttonOperate">导出</a-button>
        <a-button class="buttonOperate">导出全部</a-button>
      </span>
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          href="javascript:;"
          @click="operateFun(currentData=slotPropsData.currRowdata, 2)"
          data-type="浏览"
          class="primaryBtnColor"
        >浏览</a>
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
    <!-- 添加信息模态框 -->
    <div class="addModal">
      <a-modal
        centered
        :title="operateStatus== 1? '添加信息': (operateStatus==2? '浏览信息' :'编辑信息')"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :width="operateStatus == 1 ? '80%': '96%'"
        @cancel="handleCancel"
        style="height:85%;overflow: hidden;"
        :maskClosable="false"
      >
        <InfoOperate
          ref="operatePage"
          :operateStatusVal="operateStatus"
          :currRowDataId="operateDataId"
          :addSelectTreeNode="selectTreeNode"
          :ramdomKey="ramdomKey"
        ></InfoOperate>
        <template slot="footer">
          <a-button key="cancel" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="handleOk" v-if="operateStatus !== 2">提交</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import InfoOperate from "@/components/infoOperate";
export default {
  name: "InfoPoll",
  components: {
    TableView,
    InfoOperate
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
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "出生日期",
            dataIndex: "a0107",
            key: "a0107",
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "性别",
            dataIndex: "a0104",
            key: "a0104",
            width: 60,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "毕业院校",
            dataIndex: "a0888",
            key: "a0888",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "参加工作日期",
            dataIndex: "a0134",
            key: "a0134",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "工作单位及职务",
            dataIndex: "a0202a",
            key: "a0202a",
            width: 250,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "热度",
            dataIndex: "pageView",
            key: "pageView",
            width: 60,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: [] //table数据
      },
      tableTotalNum: 0, //table数据量
      visible: false, //模态框默认不可见
      confirmLoading: false, //模态框确认按钮加载：默认不加载
      selectTreeNode: null, //接收treeNode值
      operateStatus: null, //操作状态：1-添加， 2-浏览， 3-添加
      currentData: {},
      operateDataId: null, //当前操作数据
      tempCondition: {}, //临时查询条件
      ramdomKey:Math.random(), //确保档案目录数据每次都重新加载
    };
  },
  watch: {},
  created() {
    this.getTableData(null, 1, 10);
  },
  computed: {
    checkTableData: function() {
      return this.$store.getters.getinfoTableCheckData;
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
                a0104: element.a0104 === "1" ? "男" : "女", //性别
                a0888: element.a0888, //毕业院校
                a0134: element.a0134, //参加工作日期
                a0202a: element.a0202a, //工作单位名称
                pageView: element.pageView, //热度
                a0100a: element.a0100a, //档案编号
                a0184: element.a0184 //身份证号
              });
            });
          }
        });
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
          console.log(res);
          if (Number(res.code) === 0) {
            this.$message.success("删除成功");
            this.getTableData(this.tempCondition, 1, 10);
          }
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
      if (statusVal == 1) {
        let treenode = this.selectTreeNode;
        console.log(treenode);
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
      let isCloseModelFlag = this.$refs.operatePage.getFinishData();
      if(isCloseModelFlag){
        console.log('提交完了，更新页面！');
        // this.getTableData(this.tempCondition, 1, 10);
        // setTimeout(() => {
        //   this.visible = false;
        //   this.confirmLoading = false;
        // }, 2000);
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
      console.log(this.checkTableData);
      if (this.checkTableData.length < 1) {
        this.$message.error("请选择一条需要的画像信息");
      } else if (this.checkTableData.length > 1) {
        this.$message.error("最多选择一条需画像信息");
      } else {
        console.log(111);
        this.$message.info("该功能暂未开通");
      }
    }
  }
};
</script>


