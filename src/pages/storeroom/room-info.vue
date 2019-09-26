<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" :loading="tableLoading" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
        <a-button class="buttonOperate" type="primary" @click="operateFun({}, 1)">添加</a-button>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          href="javascript:;"
          @click="operateFun(slotPropsData.currRowdata, 3)"
          data-type="编辑"
        >编辑</a>
        <a-popconfirm placement="topLeft" okText="确定" cancelText="取消" @confirm="deleteFun(slotPropsData.currRowdata)">
          <template slot="title">
            <p>确定删除吗？</p>
            <p>删除库房将同时删除库房内的密集架信息！</p>
          </template>
          <a href="javascript:;" class="errorBtnColor">删除</a>
        </a-popconfirm>
      </div>
    </TableView>

    <!-- 添加/编辑/浏览 -->
    <div class="addModal">
      <a-modal
        centered
        :visible="visible"
        :confirmLoading="confirmLoading"
        width="80%"
        @cancel="handleCancel"
        :maskClosable="false"
        style="height:85%;overflow: hidden;"
      >
        <div slot="title" class="roomModalTitleSlot">
          <p>{{operateStatus==1? '添加信息': '编辑信息'}}</p>
          <span>{{currentRowData && currentRowData.whName}}</span>
        </div>
        <div style="height:100%;overflow:auto;">
          <TableFromSearch :formDataArr="roomInfoForm" ref="infoForm"></TableFromSearch>
        </div>
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
import TableFromSearch from "../../components/tableFormSearch";
import utils from "../../utils/util.js";
import { setTimeout } from "timers";
export default {
  name: "RoomInfo",
  //import引入的组件需要注入到对象中才能使用
  components: {
    TableView,
    TableFromSearch
  },
  props: [""],

  data() {
    return {
      utils,
      tableTotalNum: 0, //总页数：默认为0
      tableLoading: false,  //table loading
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
              title: "库房编号",
              type: "text",
              required: false,
              placeholder: "请输入库房编号",
              key: "whCode",
              name: "whCode",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "",
              status: ""
            },
            {
              title: "库房名称",
              type: "text",
              required: false,
              placeholder: "请输入库房名称",
              key: "whName",
              name: "whName",
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
            title: "库房编号",
            dataIndex: "whCode",
            key: "whCode",
            width: 200,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "库房名称",
            dataIndex: "whName",
            key: "whName",
            width: 200,
            fixed: "left",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "起始分区号",
            dataIndex: "whAreaStartNum",
            key: "whAreaStartNum",
            width: 120,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "库房分区数",
            dataIndex: "whAreaNum",
            key: "whAreaNum",
            width: 120,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "库房管理人",
            dataIndex: "whManager",
            key: "whManager",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "联系方式",
            dataIndex: "whManagerPhone",
            key: "whManagerPhone",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "空闲容量",
            dataIndex: "freeNum",
            key: "freeNum",
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "总容量",
            dataIndex: "whTotalNum",
            key: "whTotalNum",
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "库房描述",
            dataIndex: "whDesc",
            key: "whDesc",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            fixed: "right",
            scopedSlots: { customRender: "action" }
          }
        ],
        // table数据
        tabledataArr: []
      },
      roomInfoForm: {
        //模态框添加或编辑时：tableFormSearch
        formInputs: [
          {
            title: "库房编号",
            type: "text",
            required: true,
            placeholder: "请输入库房编号",
            key: "whCode",
            name: "whCode",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "whCode",
            status: ""
          },
          {
            title: "库房名称",
            type: "text",
            required: true,
            placeholder: "请输入库房名称",
            key: "whName",
            name: "whName",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "whName",
            status: ""
          },
          {
            title: "起始分区",
            type: "text",
            required: true,
            placeholder: "请输入起始分区",
            key: "whAreaStartNum",
            name: "whAreaStartNum",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "请输入起始分区",
            postname: "whAreaStartNum",
            status: ""
          },
          {
            title: "分区数",
            type: "text",
            required: true,
            placeholder: "请输入分区数",
            key: "whAreaNum",
            name: "whAreaNum",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "请输入分区数",
            postname: "whAreaNum",
            status: ""
          },
          {
            title: "管理人",
            type: "text",
            required: false,
            placeholder: "请输入管理人",
            key: "whManager",
            name: "whManager",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "whManager",
            status: ""
          },
          {
            title: "联系方式",
            type: "text",
            required: false,
            placeholder: "请输入联系方式",
            key: "whManagerPhone",
            name: "whManagerPhone",
            val: void 0,
            maxlength: 11,
            minlength: 8,
            reg: "",
            tip: "请输入正确得联系方式",
            postname: "",
            status: ""
          },
          {
            title: "库房描述",
            otherType: "textarea",
            required: false,
            placeholder: "请输入库房描述",
            key: "whDesc",
            name: "whDesc",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            postname: "whDesc",
            status: ""
          }
        ]
      },
      currentId: null, //当前点击的id值
      operateStatus: null, //操作状态：1-添加， 2-浏览， 3-编辑
      visible: false,      //模态框显隐：默认:false不显示
      confirmLoading: false,   //模态框加载状态： 默认false不加载
      tempCondition: {},  //临时--查询条件
      currentRowData: null,  //当前行数据
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
      this.tempCondition = condition;
      this.$http
        .fetchPost("wareHouse@getWareHouseList.action", {
          status: 1,
          page: pageNum,
          limit: limitNum,
          whCode: !condition || !condition.whCode ? "" : condition.whCode,
          whName: !condition || !condition.whName ? "" : condition.whName
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.tableTotalNum = res.count;
            let tempTableData = res.data;
            this.initArr.tabledataArr = [];
            tempTableData.forEach((element, index) => {
              this.initArr.tabledataArr.push({
                key: element.whId,
                num: (pageNum - 1) * limitNum + index + 1,
                whAreaNum: element.whAreaNum,
                whAreaStartNum: element.whAreaStartNum,
                whCode: element.whCode,
                whDesc: element.whDesc,
                whManager: element.whManager,
                whManagerPhone: element.whManagerPhone,
                whName: element.whName,
                whTotalNum: element.whTotalNum,
                freeNum: element.whTotalNum - element.whNowNum
              });
            });
          } else{
            this.$message.error('抱歉，获取数据失败，请重新刷新！');
          }
        }).catch(error => {
          this.$message.error('抱歉，网络异常！');
        }).finally(end => {
          this.tableLoading = false;
      });
    },
    operateFun(data, statusVal) {
      /***
       * 功能：增加、编辑操作
       * 参数: data:当前操作的数据； statusVal：当前操作按钮的状态值； 1-->添加； 3-->编辑
       */
      this.operateStatus = statusVal;
      this.visible = true;
      this.currentRowData = data;
      let initData = {};
      if (statusVal == 1) {
        //添加操作
        initData = {
          whCode: "",
          whName: "",
          whAreaNum: "",
          whAreaStartNum: "",
          whManager: "",
          whManagerPhone: "",
          whDesc: ""
        };
        this.roomInfoForm.formInputs.forEach(item => {
          item.status = '';
        })
      } else {
        //编辑操作
        initData = data;
        this.currentId = data["key"];
      }
      this.roomInfoForm = this.utils.getNewFormSearch(
        initData,
        this.roomInfoForm
      );
    },
    handleOk() {
      /**
       * 功能：模态框确定操作；根据之前点击的操作按钮判断数据提交；1-->添加； 3-->编辑
       */
      let formDataObj = this.$refs.infoForm.getFormData();
      let currObjData = this.utils.transferFormToObj(
        formDataObj['resultData']
      );
      if(formDataObj['notRequiredHasDataRight'] && formDataObj['requiredFiledsRight']){
        if (this.operateStatus == 1) {
          this.$http
            .fetchPost("wareHouse@insertWareHouse.action", currObjData)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("添加成功");
                this.getTableData(this.tempCondition, 1, 10);
                setTimeout(() => {
                  this.visible = false;
                  this.confirmLoading = false;
                }, 2000);
              } else {
                this.$message.error("添加失败");
              }
            })
            .catch(error => {
              this.$message.error("抱歉，网络异常，添加失败");
            });
        } else {
          currObjData = Object.assign({}, currObjData, { whId: this.currentId });
          this.$http
            .fetchPost("wareHouse@editWareHouse.action", currObjData)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("编辑成功");
                this.getTableData(this.tempCondition, 1, 10);
                setTimeout(() => {
                  this.visible = false;
                  this.confirmLoading = false;
                }, 2000);
              } else {
                this.$message.error("编辑失败");
              }
            })
            .catch(error => {
              this.$message.error("抱歉，网络异常，编辑失败");
            });
        }
      }
    },
    handleCancel() {
      //模态框取消操作
      this.visible = false;
    },
    deleteFun(data) {
      /**
       * 功能：删除按钮操作
       * 参数：data:当前进行删除操作的数据
       */
      this.$http
        .fetchPost("wareHouse@deleteWareHouse.action", {
          whId: data.key
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
          this.$message.error("抱歉，网络异常，删除失败!");
        });
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
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

</style>