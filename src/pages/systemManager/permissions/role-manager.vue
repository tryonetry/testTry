<!-- 角色管理 -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" @searchTable="getTableData" :loading="tableLoading">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
          <a-button class="buttonOperate">添加</a-button>
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
        <a
          href="javascript:;"
          @click="operateFun(currentData=slotPropsData.currRowdata, 2)"
          data-type="授权"
          class="primaryBtnColor"
        >授权</a>
      </div>
    </TableView>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
  name: "RoleManager",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView },
  props: [""],

  data() {
    return {
      tableTotalNum: 0, //总页数：默认为0
      tempCondition:null,
      tableLoading:false,
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
              title: "角色名称",
              type: "text",
              required: false,
              placeholder: "请输入角色名称",
              key: "roleName",
              name: "roleName",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "roleName",
              status: ""
            },
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
            title: "角色代码",
            dataIndex: "roleCode",
            key: "roleCode",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "角色名称",
            dataIndex: "roleName",
            key: "roleName",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "角色类型",
            dataIndex: "roleType",
            key: "roleType",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "角色状态",
            dataIndex: "roleState",
            key: "roleState",
            scopedSlots: { customRender: "cursorTitle" }
          },
          {
            title: "角色备注",
            dataIndex: "roleDesc",
            key: "roleDesc",
            width: 250,
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
      const _this = this;
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
      **/
      this.tableLoading = true;
      this.tempCondition = condition;
      this.$http.fetchPost('role@roleLists.action',{
          page: pageNum,
          limit: limitNum,
          ...condition
      }).then((res)=>{
        console.log(res);
          if(Number(res.code) === 0){
              _this.tableTotalNum = res.count;
              this.initArr.tabledataArr = res.data;
              this.initArr.tabledataArr.forEach((element, index) => {
                Object.assign(element,{
                  key:element.userId,
                  num: (pageNum - 1) * limitNum + index + 1,
                  userLoginFailnum:String(element.userLoginFailnum) === '0' ? "正常" : "锁定"
                });
              });
          }else{
              _this.$message.warning("抱歉,暂时未查到数据!");
          }
      }).catch(err => {
        _this.$message.error("抱歉,网络异常,请稍后重试");
      }).finally(end => {
        _this.tableLoading = false;
      })
    },
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getTableData(this.tempCondition,1,10);
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