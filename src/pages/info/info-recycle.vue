<template>
  <div class="outer">
    <TableView :initArrData="initArr" @searchTable="getTableData" :totalCount="tableTotalNum">
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          href="javascript:;"
          @click="operateFun(currentData=slotPropsData.currRowdata, 2)"
          data-type="浏览"
          class="primaryBtnColor"
        >浏览</a>
        <a href="javascript:;" data-type="编辑" @click="operateFun(currentData=slotPropsData.currRowdata, 1)">恢复</a>
        <a-popconfirm
          title="确定删除吗?"
          okText="确定"
          cancelText="取消"
          @confirm="deleteFun(slotPropsData.currRowdata)"
        >
          <a href="javascript:;" class="warnBtnColor">删除</a>
        </a-popconfirm>
      </div>
    </TableView>

    <!-- 浏览信息 -->
    <div class="addModal">
      <a-modal
        centered
        title="浏览信息"
        :visible="visible"
        width="95%"
        @cancel="handleCancel"
        style="height:95%;overflow: hidden;"
      >
        <InfoOperate
          :operateStatusVal="operateStatus"
          :currRowDataId="operateDataId"
        ></InfoOperate>
        <template slot="footer">
          <a-button key="cancel" @click="handleCancel">取消</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import InfoOperate from '@/components/infoOperate'
export default {
  name: "InfoRecycle",
  components: {
    TableView,
    InfoOperate
  },
  data() {
    return {
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check
        formData: {
          // input items
          formInputs: [
            {
              title: "姓名",
              type: "text",
              required: false,
              placeholder: "请输入姓名",
              key: "a0101",
              name: "a0101",
              val: void 0,
              postname: "a0101",
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              status: ""
            },
            {
              title: "选择日期",
              otherType: "daterange",
              required: false,
              placeholder: "请选择日期范围",
              key: "startDate-endDate",
              name: "startDate-endDate",
              val: void 0,
              postname: ""
            }
          ],
          // btns
          formBtns: [
            { title: "查询", htmltype: "submit", operate: "searchForm" }
          ]
        },
        columnsArr: [
          //table标头
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
            key: "a0101",
            fixed: 'left',
            width: 100,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "性别",
            dataIndex: "a0104",
            key: "a0104",
            width: 120,
            fixed: 'left',
            scopedSlots: { customRender: "cursorTitle" },
            filters: [
              {
                text: "男",
                value: "0"
              },
              {
                text: "女",
                value: "1"
              }
            ],
            onFilter: (value, record) => record.genderType.indexOf(value) === 0
          },
          {
            title: "出生日期",
            dataIndex: "a0107",
            key: "a0107",
            width: 150,
            fixed: 'left',
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "婚姻状况",
            dataIndex: "a0131",
            key: "a0131",
            width: 150,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "籍贯",
            dataIndex: "a0111",
            key: "a0111",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "毕业院校",
            dataIndex: "a0888",
            key: "a0888",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "手机号码",
            dataIndex: "a3707c",
            key: "a3707c",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "工作单位",
            dataIndex: "a0824",
            key: "a0824",
            width: 200,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "删除日期",
            dataIndex: "uLastModifiedDate",
            key: "uLastModifiedDate",
            width: 200,
            sorter: (a, b) => a.delDate - b.delDate,
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "删除人",
            dataIndex: "uLastModifieder",
            key: "uLastModifieder",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            fixed: 'right',
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: [] //table数据
      },
      tableTotalNum: 0,
      operateDataId: null,
      operateStatus: null, 
      visible: false, //模态框默认不可见
      tempCondition: {} //临时查询条件
    };
  },
  created() {
    this.getTableData(null, 1, 10);
  },
  methods: {
    getTableData(condition, pageNum, limitNum) {
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * condition:form查询结果：{}
       *  */
      // console.log(condition);
      this.tempCondition = condition;
      this.$http
        .fetchGet("informationPool@findRecycleBinA01List.action", {
          page: pageNum,
          limit: limitNum,
          status: 2,
          a0101: !condition || !condition.a0101 ? "" : condition.a0101,
          startDate:
            !condition || !condition.startDate ? "" : condition.startDate,
          endDate: !condition || !condition.endDate ? "" : condition.endDate
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.tableTotalNum = res.count;
            let tempTableData = res.data;
            this.initArr.tabledataArr = [];
            tempTableData.forEach((element, index) => {
              this.initArr.tabledataArr.push({
                key: element.a01000,
                num: (pageNum - 1) * limitNum + index + 1, //序号
                a0101: element.a0101,
                a0104: element.a0104 === '1' ? '男' : (element.a0104 === '2' ? '女' : (element.a0104 === '9' ? '未说明的性别' : '未知的性别')),
                a0107: element.a0107,
                a0131: element.a0131,
                a0111: element.a0111,
                a0888: element.a0888,
                a3707c: element.a3707c,
                a0824: element.a0824,
                uLastModifiedDate: element.uLastModifiedDate,
                uLastModifieder: element.uLastModifieder
              });
            });
          }
        });
    },
    operateFun(data, statusVal){
      this.operateDataId = data.key;
      this.operateStatus = statusVal;
      if(statusVal != 2){
        //恢复操作
        this.$http.fetchPost('informationPool@recycleBinRestore.action', {
          a01000: data.key,
          state: 1
        }).then(res => {
           if(Number(res.code) === 0){
             this.$message.success('恢复成功！');
             this.getTableData(this.tempCondition, 1, 10);
           } else{
             this.$message.error('恢复失败！')
           }
        }).catch(error =>{
            this.$message.error('恢复失败！')
        });
      } else{
        //浏览
        this.showModalFun();
      }
    },
    showModalFun() {
      /**
       * 功能：模态框状态变为true:打开模态框，根据操作，更该模态框标题
       * 参数:statusVal：操作状态值
       */
      this.visible = true;
    },
     handleCancel() {
      /***
       * 功能：模态框取消操作
       */
      this.visible = false;
    },
    deleteFun(data) {
      this.$http
        .fetchPost("informationPool@infoDel.action", {
          a01000: data.key
        })
        .then(res => {
          // console.log(res);
          if (Number(res.code) === 0) {
            this.$message.success("删除成功");
            this.getTableData(this.tempCondition, 1, 10);
          }
        });
    }
  }
};
</script>

<style>
</style>