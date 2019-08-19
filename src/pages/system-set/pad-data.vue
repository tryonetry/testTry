<!-- template -->
<template>
  <div class="outer">
    <div class="padCon">
      <div class="leftTree">
        <OtherTree
          :treeDataObj="treeDataObj"
          @accepttreeNode="accepttreeNodeFun"
          @acceptCheckNode="acceptCheckNodeFun"
        ></OtherTree>
      </div>
      <div class="rightTable">
        <TableView
          :initArrData="initArr"
          :totalCount="tableTotalNum"
          :loading="tableLoading"
          @searchTable="getTableData"
          ref="padTable"
        >
          <!-- tableFormSearch里添加其他按钮 -->
          <span slot="formAction">
            <a-button class="buttonOperate" type="primary" @click="generateDataFun">生成数据</a-button>
          </span>
          <div slot="tableAction" slot-scope="slotPropsData">
            <!-- @click="operateFun(slotPropsData.currRowdata, 2)" -->
            <a href="javascript:;" data-type="下载" class="primaryBtnColor">下载</a>
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
      </div>
    </div>

    <!-- 生成数据--modal -->
    <div class="addModal">
      <a-modal
        class="infopoll"
        centered
        title="生成数据"
        :visible="visible"
        :confirmLoading="confirmLoading"
        width="35%"
        @cancel="handleCancel"
        style="height:65%;overflow: hidden;"
        :maskClosable="false"
      >
        <div class="generateDataCon">
          <a-row>
            <a-col :span="6">创建文件夹</a-col>
            <a-col :span="18">
              <a
                v-if="isCreateFile"
                href="javascript:void(0);"
                class="successBtnColor"
                style="padding: 0;"
              >成功</a>
              <a-spin v-else>
                <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
              </a-spin>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="6">读取数据</a-col>
            <a-col :span="18">
              <a
                v-if="isReadData"
                href="javascript:void(0);"
                class="successBtnColor"
                style="padding: 0;"
              >成功</a>
              <a-spin v-else>
                <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
              </a-spin>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="6">文件写入数据</a-col>
            <a-col :span="18">
              <a
                v-if="isWriteDate"
                href="javascript:void(0);"
                class="successBtnColor"
                style="padding: 0;"
              >成功</a>
              <a-spin v-else>
                <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
              </a-spin>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="6">计算文件大小</a-col>
            <a-col :span="18">
              <a
                v-if="isFileSize"
                href="javascript:void(0);"
                class="successBtnColor"
                style="padding: 0;"
              >成功</a>
              <a-spin v-else>
                <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
              </a-spin>
            </a-col>
          </a-row>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import OtherTree from "@/components/otherTree";
import { setInterval, clearInterval } from "timers";
export default {
  name: "padData",
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
          formInputs: [
            //input
            {
              title: "客户端密码",
              type: "text",
              required: true,
              placeholder: "请输入客户端密码",
              key: "passWord",
              name: "passWord",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "passWord",
              status: ""
            },
            {
              title: "备注信息",
              type: "text",
              required: false,
              placeholder: "请输入备注信息",
              key: "remark",
              name: "remark",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "remark",
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
            dataIndex: "fileName",
            key: "fileName",
            width: 300,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "文件大小",
            dataIndex: "fileSize",
            key: "fileSize",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "生成时间",
            dataIndex: "createDate",
            key: "createDate",
            width: 250,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "信息备注",
            dataIndex: "messageRemark",
            key: "messageRemark",
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
      //tree数据格式
      treeDataObj: {
        isSearch: false,
        isChecked: true,
        dataArr: []
      },
      acceptTreeNode: "",
      visible: false,
      confirmLoading: false,
      isCreateFile: false, //生成数据---创建文件夹
      isReadData: false, //生成数据--读取数据
      isWriteDate: false, //生成数据--写入数据
      isFileSize: false, //生成数据--文件大小,
      tempPageSize: 1,  //table--pageSize
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
      this.tempPageSize = pageNum
      this.$http
        .fetchPost("padFilePackage@findPadFileAll.action", {
          page: pageNum,
          limit: limitNum,
          status: "1",
          upUnitId: "",
          jgType: ""
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.tableTotalNum = res.count;
            let tempTableData = res.data;
            this.initArr.tabledataArr = [];
            tempTableData.forEach((element, index) => {
              this.initArr.tabledataArr.push({
                key: element.id, //主键值
                num: (pageNum - 1) * limitNum + index + 1, //序号
                fileName: element.fileName,
                fileSize: element.fileSize,
                createDate: element.createDate,
                messageRemark: element.messageRemark
              });
            });
          } else {
            this.$message.warning("抱歉，获取数据失败，请刷新后重试！");
          }
        })
        .catch(err => {
          this.$message.error("抱歉，网络异常，请稍后重试！");
        })
        .finally(end => {
          this.tableLoading = false;
        });
    },
    getPadTreeData() {
      this.$http
        .fetchPost("padFilePackage@getParentId.action", {
          upUnitId: ""
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.treeDataObj.dataArr = this.getNewTreeData(res.data);
          } else {
            this.$message.warning("抱歉，获取数据失败，请刷新后重试！");
          }
        })
        .catch(error => {
          this.$message.error("抱歉，网络异常，请稍后重试！");
        });
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
    },
    acceptCheckNodeFun(data) {
      /**
       * 功能：tree--check数据;并且过滤掉：江西省的区划代码('01')
       * 参数：data: 当前tree--check数据；
       */
      this.acceptTreeNode = data.filter(item => {
        if(item !== '01'){
          return item;
        }
      });
    },
    generateDataFun() {
      /**
       * 功能：生成数据和打开模态框操作
       */
      if (this.acceptTreeNode && this.acceptTreeNode.length > 0) {
        let tempCondition = this.$refs.padTable.getCondition();
        if (tempCondition && tempCondition.passWord) {
          let treeNodeStr = this.acceptTreeNode.join(",");
          this.isCreateFile = false;
          this.isReadData = false;
          this.isWriteDate = false;
          this.isFileSize = false;
          this.visible = true;
          this.$http
            .fetchPost("padFilePackage@doCreateInitData.action", {
              ids: treeNodeStr,
              passWord: tempCondition.passWord,
              remark: tempCondition.remark
            })
            .then(res => {
              if (Number(res.code) === 0) {
                this.changeStatusFun();
              } else {
                this.$message.error("抱歉，数据生成失败，请刷新后重试！");
              }
            })
            .catch(err => {
              this.$message.error("抱歉，网络异常！");
            });
        } else {
          this.$message.warning("请输入客户端密码！");
        }
      } else {
        this.$message.error("请至少选择一个行政区域进行此操作！");
      }
    },
    changeStatusFun() {
      /**
       * 功能：模态框--生成数据--每一步得状态改变
       */
      let _this = this;
      let timer = setInterval(function() {
        _this.$http
          .fetchPost("padFilePackage@percentage.action")
          .then(res => {
            console.log(res);
            if (res.data == "10") {
              _this.isCreateFile = true;
              _this.isReadData = false;
              _this.isWriteDate = false;
              _this.isFileSize = false;
            } else if (res.data == "20") {
              _this.isCreateFile = true;
              _this.isReadData = true;
              _this.isWriteDate = false;
              _this.isFileSize = false;
            } else if (res.data == "70") {
              _this.isCreateFile = true;
              _this.isReadData = true;
              _this.isWriteDate = true;
              _this.isFileSize = false;
            } else if (res.data == "100") {
              _this.isCreateFile = true;
              _this.isReadData = true;
              _this.isWriteDate = true;
              _this.isFileSize = true;
              clearInterval(timer);
              _this.visible = false;
              _this.$message.success('生成数据成功！');
              _this.getTableData(null, _this.tempPageSize, 10);
            }
          })
          .catch(err => {
            _this.$message.error("抱歉，网络异常！");
          });
      }, 500);
    },
    handleCancel() {
      //关闭--modal
      this.visible = false;
    },
    deleteFun(currRowdata) {
      /**
       * 功能：删除
       */
      this.$http
        .fetchPost("padFilePackage@delete.action", {
          id: currRowdata.key
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.$message.success("删除成功");
            this.getTableData(null, this.tempPageSize, 10);
          } else {
            this.$message.warning("抱歉，操作失败，请刷新后重试！");
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
    this.getPadTreeData();
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

.generateDataCon {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.generateDataCon .ant-row {
  line-height: 45px;
  border-bottom: 1px solid #eeeeee;
  padding: 0 10px;
}

.generateDataCon .ant-row .ant-col-18 {
  text-align: right;
}
</style>