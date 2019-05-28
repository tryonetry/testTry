<!-- template -->
<template>
  <div class="outer">
    <TableView :initArrData="initArr" :totalCount="tableTotalNum" @searchTable="getTableData">
      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
          <a-button class="primary">立即修改</a-button>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <!-- <div slot="tableAction" slot-scope="slotPropsData"></div> -->
    </TableView>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
  name: "OrganManager",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView },
  props: [""],

  data() {
    return {
      tableTotalNum: 0, //总页数：默认为0
      // tableView传值方式
      initArr: {
        treeflag: true, //左侧tree是否存在
        tableCheck: false, //table是否可以check
        isHasNotTable: true,  //table是否存在： 存在：false； 不存在：true
        // formInputs 传值方式
        formData: {
          //forminputs data
          formInputs: [
            //input
            {
              title: "单位名称",
              type: "text",
              required: false,
              placeholder: "请输入单位名称",
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
              title: "单位简称",
              type: "text",
              required: false,
              placeholder: "请输入单位简称",
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
             // select/searchSelect
            {
              title: "单位是否是代理机构",
              otherType: "select",
              required: false,
              placeholder: "请选择单位是否是代理机构",
              key: "",
              name: "",
              val: void 0,
              children: [
                {
                  itemCode: "1",
                  itemName: "xxx"
                }
              ],
              status: ""
            },
            {
              title: "所在行政区",
              type: "text",
              required: false,
              placeholder: "请输入所在行政区",
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
          ],

          // form btns
          formBtns: [
            { title: "重置", htmltype: "button", operate: "resetForm" }
          ]
        },
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
</style>