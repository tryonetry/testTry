<!-- template -->
<template>
  <!-- 信息变更 -->
  <div class="outer">
    <TableView :initArrData="initArr" @searchTable="getTableData" ref="updateTable" :totalCount="tableTotalNum">
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          href="javascrit:;"
          class="primaryBtnColor"
          @click="editOperate(slotPropsData.currRowdata)"
        >进入</a>
      </div>
    </TableView>
    <div class="modal">
      <a-modal
        centered 
        :visible="modalState"
        okText="提交"
        cancelText="取消"
        @ok="handleOk"
        @cancel="handleCancel"
        :width="'90%'"
        :maskClosable='false'
      >
        <div slot="title" class="titleSlot">
          <p>信息变更</p>
          <span>{{currentPersonData && currentPersonData.a0101}}</span>
        </div>
        <div class="recordInfoContainer">
          <RecordInfo :currentPersonData='currentPersonData'></RecordInfo>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import RecordInfo from "../../../components/record/record-info";
export default {
  name: "PersonalInfoChange",
  //import引入的组件需要注入到对象中才能使用
  components: {
    TableView,
    RecordInfo
  },
  props: [""],

  data() {
    return {
      tableTotalNum:0,
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false,
        formData: {
          //form inputs
          formInputs: [
            {
              title: "姓名",
              type: "text",
              placeholder: "请输入姓名",
              key: "a0101",
              name: "a0101",
              postname: "a0101",
              val: void 0
            },
            {
              title: "身份证号",
              type: "text",
              placeholder: "请输入身份证号",
              key: "a0184",
              name: "a0184",
              postname: "a0184",
              val: void 0
            },
            {
              title: "存档编号",
              type: "text",
              placeholder: "请输入存档编号",
              key: "a0100A",
              name: "a0100A",
              postname: "a0100A",
              val: void 0
            }
          ],
          formBtns: [
            { title: "查询", htmltype: "submit", operate: "searchForm" },
            { title: "重置", htmltype: "button", operate: "resetForm" }
          ]
        },
        columnsArr: [
          //table标头
          {
            title: "序号",
            dataIndex: "num",
            key: "num",
            fixed: "left",
            width: 80
          },
          { 
            title: "姓名", 
            dataIndex: "a0101", 
            key: "a0101",
            width:150, 
          },
          { 
            title: "身份证号",
            dataIndex: "a0184", 
            key: "a0184",
            width:250,
          },
          { 
            title: "性别", 
            dataIndex: "a0104",
            key: "a0104",
            width:100,
          },
          { 
            title: "电话号码", 
            dataIndex: "a3707C", 
            key: "a3707C",
            width:250,
          },
          { 
            title: "存档编号", 
            dataIndex: "a0100A", 
            key: "a0100A",
            width:250,
          },
          {
            title: "存档日期",
            dataIndex: "uCreateDate",
            key: "uCreateDate",
            sorter: (a, b) => a.date - b.date,
            width:250,
          },
          {
            title: "操作",
            key: "action",
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: []
      },
      modalState:false,
      currentPersonData:null,
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
      const _this = this;
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
      **/
      this.$http.fetchPost('personalArch@getPersonalArchList.action',{
          page: pageNum,
          limit: limitNum,
          ...condition
      }).then((res)=>{
          if(Number(res.code) === 0){
              _this.tableTotalNum = res.count;
              this.initArr.tabledataArr = res.data;
              console.log(res.data)
              this.initArr.tabledataArr.forEach((element, index) => {

                Object.assign(element,{key:element.a01000,num: (pageNum - 1) * limitNum + index + 1,a0104:element.a0104 === "1" ? "男" : "女"});

                // this.initArr.tabledataArr.push({
                //     key: element.a01000, //主键值
                //     num: (pageNum - 1) * limitNum + index + 1, //序号
                //     a01000: element.a01000, //id
                //     a0101: element.a0101, //姓名
                //     a0184: element.a0184, //身份证号
                //     a3707c: element.a3707c, //联系电话
                //     a0100A:element.a0100A, //存档编号
                //     // a0888: element.a0888, //单位名称
                //     // companyNumber: element.companyNumber, //单位编号
                //     // shelvesNo: element.shelvesNo, //档案位置号
                //     uCreateDate: element.uCreateDate, //存档日期
                // });
              });
          }else{
              _this.$message.warning("抱歉,暂时未查到数据!");
          }
      })
    },
    // 点击进入
    editOperate(currdata) {
      this.currentPersonData = currdata;
      // console.log(this.currentPersonData)
      this.modalState = true;
    },
    handleOk(){
      // this.modalState = 
    },
    handleCancel(){
      this.modalState = false;
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},

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
.modal{
    max-height: 80%;
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
  .recordInfoContainer{
    height: 700px;
    max-height: 700px;
    overflow: auto;
  }
</style>