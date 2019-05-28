<!-- template -->
<template>
  <!-- 信息变更 -->
  <div class="outer">
    <TableView :initArrData="initArr" @searchTable="getTableData" ref="updateTable">
      <div slot="tableAction" slot-scope="slotPropsData">
        <a
          href="javascrit:;"
          class="primaryBtnColor"
          @click="editOperate(slotPropsData.currRowdata)"
        >进入</a>
      </div>
    </TableView>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
  name: "PersonalInfoChange",
  //import引入的组件需要注入到对象中才能使用
  components: {
    TableView
  },
  props: [""],

  data() {
    return {
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
              key: "name",
              name: "name",
              postname: "",
              val: void 0
            },
            {
              title: "身份证号",
              type: "text",
              placeholder: "请输入身份证号",
              key: "idCard",
              name: "idCard",
              postname: "",
              val: void 0
            },
            {
              title: "存档编号",
              type: "text",
              placeholder: "请输入存档编号",
              key: "recordNum",
              name: "recordNum",
              postname: "",
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
          { title: "身份证号", dataIndex: "idCard", key: "idCard" },
          { title: "姓名", dataIndex: "name", key: "name" },
          { title: "性别", dataIndex: "gender", key: "gender" },
          { title: "电话号码", dataIndex: "phone", key: "phone" },
          { title: "存档编号", dataIndex: "recordNum", key: "recordNum" },
          {
            title: "存档日期",
            dataIndex: "recordDate",
            key: "recordDate",
            sorter: (a, b) => a.date - b.date
          },
          {
            title: "操作",
            key: "action",
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: [
          {
            key: 1,
            idCard: "1234567996582147",
            name: "test",
            gender: "男",
            phone: "12345678902",
            recordNum: "C123",
            recordDate: "2015-06-03"
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
    getTableData(condition, initableArr) {
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：data:form查询结果：{}
       *  */
      console.log(condition);
      let tempData = [];
      if (condition.length === 0) {
        this.initArr.tabledataArr = initableArr;
      } else {
        tempData = initableArr.filter(item => {
          return Object.keys(condition).every(key => {
            return String(item[key])
              .toLowerCase()
              .includes(
                String(condition[key])
                  .trim()
                  .toLowerCase()
              );
          });
        });
      }
      console.log(tempData);
      this.initArr.tabledataArr = tempData;
    },
    editOperate(currdata) {
      /***
       * 功能：编辑操作
       * 参数：data:当前行数据
       */
      this.$router.push({
        name: "personal-receive",
        params: {
          data: currdata
        }
      });
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