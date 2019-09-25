<!-- template -->
<template>
  <div class="outer">
    <TableView
      :initArrData="initArr"
      :loading="tableLoading"
      :totalCount="tableTotalNum"
      @searchTable="getTableData"
    >
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
        <a-button class="buttonOperate" type="primary" @click="operateFun(null, 1)">添加</a-button>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          href="javascript:;"
          data-type="字典维护"
          class="primaryBtnColor"
          @click="dictMaintainFun(slotPropsData.currRowdata)"
        >字典维护</a>
        <a href="javascript:;" @click="operateFun(slotPropsData.currRowdata, 2)" data-type="编辑">编辑</a>
        <a-popconfirm
          title="确定删除吗?"
          okText="确定"
          cancelText="取消"
          @confirm="deleteFun(slotPropsData.currRowdata)"
        >
          <a href="javascript:;" class="errorBtnColor">删除</a>
        </a-popconfirm>
      </div>
    </TableView>

    <!-- table添加、编辑; 字典维护的编辑、添加 -->
    <div class="addModal">
      <a-modal
        centered
        :visible="visible"
        :confirmLoading="confirmLoading"
        :width="operateStatus === 1 || operateStatus === 2 ? '40%' : '80%'"
        @cancel="handleCancel"
        :maskClosable="false"
        style="height:60%;overflow: hidden; z-index: 1005;"
      >
        <div slot="title" class="roomModalTitleSlot">
          <p>{{operateStatus == 1 ? '添加信息': (operateStatus === 2 ?'编辑信息': (operateStatus === 3 ? '新增字典项': '修改字典项'))}}</p>
          <span>{{currentRowData && (operateStatus === 2 ? currentRowData.dictName : currentRowData.itemName)}}</span>
        </div>
        <div style="height:100%;overflow:auto;">
          <TableFromSearch :formDataArr="addEditForm" :layout="addEditModal" ref="addEditForm"></TableFromSearch>
        </div>
        <template slot="footer">
          <a-button key="cancel" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="handleOk">提交</a-button>
        </template>
      </a-modal>
    </div>

    <!-- 字典维护 -->
    <div class="addModal">
      <a-modal
        class="detailModal"
        centered
        :visible="maintainVisible"
        :confirmLoading="maintainConfirmLoading"
        width="80%"
        @cancel="handleMaintainCancel"
        :maskClosable="false"
        style="height:80%;overflow: hidden;"
        :footer="null"
      >
        <div slot="title" class="roomModalTitleSlot">
          <p>字典维护</p>
          <span>{{currentRowData && currentRowData.dictName}}</span>
        </div>
        <div style="height:100%;overflow:auto;">
          <TableView
            class
            :initArrData="initMaintainArr"
            :loading="maintainTableLoading"
            :totalCount="maintainTableTotalNum"
          >
            <span slot="formAction">
              <a-button class="buttonOperate" type="primary" @click="operateFun(null, 3)">添加</a-button>
            </span>
            <div slot="tableAction" slot-scope="slotPropsData">
              <a
                href="javascript:;"
                @click="operateFun(slotPropsData.currRowdata, 4)"
                data-type="修改"
              >修改</a>
              <a-popconfirm
                title="确定删除吗?"
                okText="确定"
                cancelText="取消"
                @confirm="deleteMaintainFun(slotPropsData.currRowdata)"
              >
                <a href="javascript:;" class="errorBtnColor">删除</a>
              </a-popconfirm>
            </div>
          </TableView>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import TableFromSearch from "../../components/tableFormSearch";
import utils from "../../utils/util.js";
export default {
  name: "Dictionary",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView, TableFromSearch },
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
          formInputs: [
            // select/searchSelect
            {
              title: "字典标准",
              otherType: "select",
              required: false,
              placeholder: "请选择字典标准",
              key: "dictStandard",
              name: "dictStandard",
              postname: "dictStandard",
              val: void 0,
              children: [],
              status: ""
            },
            //input
            {
              title: "字典编号",
              type: "text",
              required: false,
              placeholder: "请输入字典编号",
              key: "keywords",
              name: "keywords",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "keywords",
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
            width: 60,
            scopedSlots: { customRender: "cursorTitle" } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: "编号",
            dataIndex: "dictCode",
            key: "dictCode",
            width: 300,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "编号名称",
            dataIndex: "dictName",
            key: "dictName",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            fixed: "right",
            width: 200,
            scopedSlots: { customRender: "action" }
          }
        ],
        // table数据
        tabledataArr: []
      },
      tempPageSize: 1, //table--初始化page
      tempCondition: null, //临时---table查询条件
      visible: false, //添加/编辑 modal
      confirmLoading: false, //添加/编辑 modal
      operateStatus: null, //操作状态
      currentRowData: null, //当前行数据
      addEditForm: {}, //添加、编辑modal--tableformSearch
      tableAddEditForm: {
        //添加/编辑modal
        formInputs: [
          {
            title: "编码",
            type: "text",
            required: true,
            placeholder: "请输入编码",
            key: "dictCode",
            name: "dictCode",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "dictCode",
            status: "",
            colWidth: [24, 24]
          },
          {
            title: "名称",
            type: "text",
            required: true,
            placeholder: "请输入名称",
            key: "dictName",
            name: "dictName",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "dictName",
            status: "",
            colWidth: [24, 24]
          },
          {
            title: "字典标准",
            otherType: "select",
            required: false,
            placeholder: "请选择字典标准",
            key: "standard",
            name: "standard",
            postname: "standard",
            val: void 0,
            children: [],
            status: "",
            colWidth: [24, 24]
          }
        ]
      },
      addEditModal: {
        defaultCon: {
          labelCol: {
            sm: { span: 4 },
            xl: { span: 4 },
            xxl: { span: 4 }
          },
          wrapperCol: {
            sm: { span: 18 },
            xl: { span: 18 },
            xxl: { span: 18 }
          }
        }
      },
      tempDictId: "", //临时--row的id值
      tempDictRow: null, //table---row数据

      maintainVisible: false, //字典维护--modal
      maintainConfirmLoading: false, //字典维护--modal
      maintainTableLoading: false, //字典维护--table--loading
      maintainTableTotalNum: 0, //字典维护--table--总页数
      initMaintainArr: {
        //字典维护---table
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check
        noPagination: true, //table--不分页
        superimposeWidth: true, //根据当前屏幕分列
        formData: {
          formInputs: [],
          formBtns: []
        },
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
            title: "编号",
            dataIndex: "itemCode",
            key: "itemCode",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "段数",
            dataIndex: "itemNum",
            key: "itemNum",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "使用标志",
            dataIndex: "isUseName",
            key: "isUseName",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "叶节点",
            dataIndex: "isLeafName",
            key: "isLeafName",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "排序",
            dataIndex: "orderindex",
            key: "orderindex",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "名称",
            dataIndex: "itemName",
            key: "itemName",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            fixed: "right",
            width: 200,
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: []
      },
      maintainAddEditForm: {
        formInputs: [
          {
            title: "是否叶节点",
            otherType: "select",
            required: false,
            placeholder: "请选择是否叶节点",
            key: "isLeaf",
            name: "isLeaf",
            postname: "isLeaf",
            val: void 0,
            children: [
              {
                itemCode: "1",
                itemName: "是"
              },
              {
                itemCode: "0",
                itemName: "否"
              }
            ],
            status: ""
          },
          {
            title: "上级字典项",
            otherType: "select",
            required: false,
            placeholder: "请选择上级字典项",
            key: "parentItemCode",
            name: "parentItemCode",
            postname: "parentItemCode",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "使用标志",
            otherType: "select",
            required: false,
            placeholder: "请选择使用标志",
            key: "isUse",
            name: "isUse",
            postname: "isUse",
            val: void 0,
            children: [
              {
                itemCode: "1",
                itemName: "未使用"
              },
              {
                itemCode: "0",
                itemName: "使用"
              }
            ],
            status: ""
          },
          {
            title: "级别编码",
            type: "text",
            required: false,
            placeholder: "请输入级别编码",
            key: "itemLevelcode",
            name: "itemLevelcode",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "itemLevelcode",
            status: ""
          },
          {
            title: "名称",
            type: "text",
            required: true,
            placeholder: "请输入名称",
            key: "itemName",
            name: "itemName",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "itemName",
            status: ""
          },
          {
            title: "简称",
            type: "text",
            required: false,
            placeholder: "请输入简称",
            key: "shortName",
            name: "shortName",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "shortName",
            status: ""
          },
          {
            title: "全拼",
            type: "text",
            required: false,
            placeholder: "请输入全拼",
            key: "compSpell",
            name: "compSpell",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "compSpell",
            status: ""
          },
          {
            title: "简拼",
            type: "text",
            required: false,
            placeholder: "请输入简拼",
            key: "logoSpell",
            name: "logoSpell",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "logoSpell",
            status: ""
          },
          {
            title: "编码",
            type: "text",
            required: true,
            placeholder: "请输入字典编码",
            key: "itemCode",
            name: "itemCode",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "itemCode",
            status: ""
          },
          {
            title: "级别",
            type: "text",
            required: false,
            placeholder: "请输入级别",
            key: "itemLevel",
            name: "itemLevel",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "itemLevel",
            status: ""
          },
          {
            title: "段数",
            type: "text",
            required: false,
            placeholder: "请输入段数",
            key: "itemNum",
            name: "itemNum",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "itemNum",
            status: ""
          },
          {
            title: "排序",
            type: "text",
            required: false,
            placeholder: "请输入排序",
            key: "orderindex",
            name: "orderindex",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "orderindex",
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
       *         */
      this.tableLoading = true;
      this.tempPageSize = pageNum;
      this.tempCondition = condition;
      this.$http
        .fetchPost("dict@getDictList.action", {
          page: pageNum,
          limit: limitNum,
          dictStandard:
            !condition || !condition.dictStandard ? "" : condition.dictStandard,
          keywords: !condition || !condition.keywords ? "" : condition.keywords
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.tableTotalNum = res.count;
            let tempTableData = res.data;
            this.initArr.tabledataArr = [];
            tempTableData.forEach((element, index) => {
              this.initArr.tabledataArr.push({
                key: element.dictId, //主键值
                num: (pageNum - 1) * limitNum + index + 1, //序号
                dictCode: element.dictCode,
                dictName: element.dictName,
                standard: element.standard
              });
            });
          } else {
            this.$message.error("抱歉，获取数据失败，请刷新后重试！");
          }
        })
        .catch(err => {
          this.$message.error("抱歉，网络异常！");
        })
        .finally(end => {
          this.tableLoading = false;
        });
    },
    getDictoryStandard(currData) {
      /***
       * 功能：获取字典标准
       *         */
      this.$http
        .fetchPost("dictItem@getDictItemByDictCode.action", {
          dictCode: currData
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let tempData = res.data;
            let dictStandardData = [];
            if (tempData && tempData.length > 0) {
              tempData.forEach(item => {
                dictStandardData.push({
                  itemCode: item.itemCode,
                  itemName: item.itemName
                });
              });
              if (currData === "Code_Standard") {
                //字典标准
                this.initArr.formData.formInputs[0].children = dictStandardData; //字典标准下拉框
                //添加/编辑modal--字典标准
                this.tableAddEditForm.formInputs.forEach(el => {
                  if (el.key === "standard") {
                    el.children = dictStandardData;
                  }
                });
              } else {
                //字典维护--上级字典项
                this.maintainAddEditForm.formInputs.forEach(el => {
                  if (el.key === "parentItemCode") {
                    el.children = dictStandardData;
                  }
                });
              }
            }
          } else {
            this.$message.error("抱歉，获取数据失败，请刷新后重试！");
          }
        })
        .catch(err => {
          this.$message.error("抱歉，网络异常！");
        });
    },
    operateFun(currRowdata, statusVal) {
      /**
       * 功能：字典维护和编辑操作
       * 参数：currRowdata：当前行数据； statusVal：操作状态值（1-添加； 2-编辑）
       */
      let initData = {};
      this.operateStatus = statusVal;
      this.currentRowData = currRowdata;
      if (Number(statusVal) === 1 || Number(statusVal) === 2) {
        //字典的添加、编辑
        if (Number(statusVal) === 1) {
          //添加
          initData = {
            dictCode: void 0,
            dictName: void 0,
            standard: void 0
          };
          this.tableAddEditForm.formInputs.forEach(el => {
            if (el.key === "dictCode") {
              el.disabled = false;
            }
            el.status = "";
          });
        } else {
          //编辑
          initData = currRowdata;
          this.tableAddEditForm.formInputs.forEach(el => {
            if (el.key === "dictCode") {
              el.disabled = true;
            }
            el.status = "";
          });
          this.tempDictId = currRowdata.key;
        }
        this.addEditForm = utils.getNewFormSearch(
          initData,
          this.tableAddEditForm
        );
      } else {
        //字典维护--添加、编辑
        this.getDictoryStandard(this.tempDictRow["dictCode"]); //字典维护--tableFormSearch--上级字典项select赋值
        this.maintainAddEditForm.formInputs.forEach(el => {
          el.status = "";
        });
        if (Number(statusVal) === 3) {
          //字典维护--添加
          initData = {
            isLeaf: "",
            parentItemCode: "",
            isUse: "",
            itemLevelcode: "",
            itemName: "",
            shortName: "",
            compSpell: "",
            logoSpell: "",
            itemCode: "",
            itemLevel: "",
            itemNum: "",
            orderindex: ""
          };
        } else {
          //字典维护--编辑
          initData = currRowdata;
          this.tempDictId = currRowdata.key;
        }
        this.addEditForm = utils.getNewFormSearch(
          initData,
          this.maintainAddEditForm
        );
      }
      this.visible = true;
    },
    handleCancel() {
      //添加/编辑modal---取消
      this.visible = false;
    },
    handleOk() {
      //添加/编辑modal---提交
      let formDataObj = this.$refs.addEditForm.getFormData();
      let currObjData = formDataObj.postObj;
      if (formDataObj.isRight) {
        if (this.operateStatus == 1) {
          //table---添加
          this.$http
            .fetchPost("dict@checkDictCode.action", {
              dictCode: currObjData.dictCode
            })
            .then(res => {
              if (Number(res.code) === 0) {
                this.addDictFun(currObjData);
              } else {
                this.$message.error("抱歉，编号已经存在，请勿重复添加！");
              }
            })
            .catch(err => {
              this.$message.error("抱歉，网络异常！");
            });
        } else if (this.operateStatus == 2) {
          //table---编辑
          currObjData = Object.assign({}, currObjData, {
            dictId: this.tempDictId
          });
          this.editDictFun(currObjData);
        } else if (this.operateStatus == 3) {
          //字典维护--添加
          this.$http
            .fetchPost("dictItem@checkDictItemCode.action", {
              dictCode: this.tempDictRow["dictCode"],
              itemCode: currObjData.itemCode
            })
            .then(res => {
              if (Number(res.code) === 0) {
                currObjData = Object.assign({}, currObjData, {
                  dictCode: this.tempDictRow["dictCode"]
                });
                this.mainTainAddOrEditFun(currObjData);
              } else {
                this.$message.error("抱歉，操作失败，请刷新后重试");
              }
            })
            .catch(err => {
              this.$message.error("抱歉，网络异常！");
            });
        } else if (this.operateStatus == 4) {
          //字典维护编辑
          currObjData = Object.assign({}, currObjData, {
            dictCode: this.tempDictRow["dictCode"],
            itemId: this.tempDictId
          });
          this.mainTainAddOrEditFun(currObjData);
        }
      }
    },
    editDictFun(currPostObj) {
      /**
       * 功能：字典--编辑提交服务
       * 参数：currPostObj:post到服务器的数据
       */
      this.confirmLoading = true;
      this.$http
        .fetchPost("dict@updateDict.action", currPostObj)
        .then(res => {
          if (Number(res.code) === 0) {
            this.$message.success("编辑成功");
            this.visible = false;
            this.confirmLoading = false;
            this.getTableData(this.tempCondition, this.tempPageSize, 10);
          } else {
            this.$message.error("抱歉，操作失败，请刷新后重试！");
          }
        })
        .catch(error => {
          this.$message.error("抱歉，网络异常！");
        });
    },
    addDictFun(currPostObj) {
      /**
       * 功能：字典--添加提交服务
       * 参数：currPostObj:post到服务器的数据
       */
      this.confirmLoading = true;
      this.$http
        .fetchPost("dict@saveDict.action", currPostObj)
        .then(res => {
          if (Number(res.code) === 0) {
            this.$message.success("添加成功");
            this.visible = false;
            this.confirmLoading = false;
            this.getTableData(this.tempCondition, this.tempPageSize, 10);
          } else {
            this.$message.error("抱歉，操作失败，请刷新后重试！");
          }
        })
        .catch(error => {
          this.$message.error("抱歉，网络异常！");
        });
    },
    deleteFun(currRowdata) {
      /**
       * 功能：删除操作
       * 参数：currRowdata：当前行数据；
       */
      this.$http
        .fetchPost("dict@deleteDict.action", {
          dictId: currRowdata.key
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.$message.success("删除成功！");
            this.getTableData(this.tempCondition, this.tempPageSize, 10);
          } else {
            this.$message.error("抱歉，操作失败，请刷新后重试！");
          }
        })
        .catch(err => {
          this.$message.error("抱歉，网络异常！");
        });
    },
    dictMaintainFun(currRowdata) {
      /**
       * 功能：字典维护
       * 参数：currRowdata：当前行数据
       */
      this.currentRowData = currRowdata;
      this.maintainVisible = true;
      this.tempDictRow = currRowdata;
      this.getMaintainTableFun(currRowdata);
    },
    getMaintainTableFun(currRowdata) {
      /**
       * 功能：获取字典维护--table数据
       * 参数：currRowdata:点击字典维护按钮获取table-row数据
       */
      this.maintainTableLoading = true;
      this.$http
        .fetchPost("dictItem@getDictItemByDictCode.action", {
          dictCode: currRowdata.dictCode
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let tempTableData = res.data;
            this.initMaintainArr.tabledataArr = [];
            tempTableData.forEach((element, index) => {
              this.initMaintainArr.tabledataArr.push({
                key: element.itemId, //主键值
                num: index + 1, //序号
                dictCode: element.dictCode,
                itemCode: element.itemCode,
                itemNum: element.itemNum,
                isUse: element.isUse,
                isUseName: element.isUse === "1" ? "停用" : "",
                isLeaf: element.isLeaf,
                isLeafName: element.isLeaf === "1" ? "是" : "否",
                itemName: element.itemName,
                itemLevel: element.itemLevel,
                itemLevelcode: element.itemLevelcode,
                parentItemCode: element.parentItemCode,
                shortName: element.shortName,
                compSpell: element.compSpell,
                logoSpell: element.logoSpell,
                orderindex: element.orderindex
              });
            });
          } else {
            this.$message.error("抱歉，获取数据失败，请刷新后重试！");
          }
        })
        .catch(err => {
          this.$message.error("抱歉，网络异常！");
        })
        .finally(end => {
          this.maintainTableLoading = false;
        });
    },
    handleMaintainCancel() {
      //字典维护--modal--取消
      this.maintainVisible = false;
    },
    mainTainAddOrEditFun(currPostObj) {
      /**
       * 功能：字典维护--添加、编辑
       * 参数：currPostObj：当前提交数据
       */
      this.$http
        .fetchPost("dictItem@saveOrUpdateDictItem.action", currPostObj)
        .then(res => {
          if (Number(res.code) === 0) {
            this.$message.success("操作成功！");
            this.visible = false;
            this.getMaintainTableFun(this.tempDictRow);
          } else {
            this.$message.error("抱歉，新增失败，请刷新后重试！");
          }
        })
        .catch(err => {
          this.$message.error("抱歉，网络异常！");
        });
    },
    deleteMaintainFun(currRowdata) {
      /**
       * 功能：字典维护--删除功能
       * 参数：currRowdata：当前行数据
       */
      console.log(currRowdata);
      this.$http
        .fetchPost("dictItem@deleteDictItem.action", {
          itemId: currRowdata.key
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.$message.success("删除成功！");
            this.getMaintainTableFun(this.tempDictRow);
          } else {
            this.$message.error("抱歉，操作失败，请刷新后重试！");
          }
        })
        .catch(err => {
          this.$message.error("抱歉，网络异常！");
        });
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getDictoryStandard("Code_Standard");
    this.getTableData(null, this.tempPageSize, 10);
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
</style>