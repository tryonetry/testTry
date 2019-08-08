<!-- template -->
<template>
  <div class="outer">
    
    <TableView :initArrData="initArr"  @accepttreeNode="accepttreeNodeFun">
      <!-- tableFormSearch里添加其他按钮 -->
      <div slot="underSearchCont" class="orgTitle">
        <p>{{isOrg ? "机构名称 : " : "行政区划 : " }}{{ orgObj && orgObj.title }}</p>
      </div>
      <span slot="formAction" class="formBtns">
          <a-button type="primary" @click="handleAdd" v-if="!isOrg">添加到当前行政区</a-button>
          <a-button type="primary" @click="handleChange" v-if="isOrg">立即修改</a-button>
          <a-button @click="handleReset">重 置</a-button>
          <a-button type="danger" @click="handleDelete" v-if="isOrg">删除当前机构</a-button>
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
      isOrg:null, // 是否为机构 null表示未选择任何节点
      orgObj:null,
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
              title: "存档机构名称",
              type: "text",
              required: true,
              placeholder: "请输入存档机构名称",
              key: "",
              name: "",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "* 请输入存档机构名称",
              postname: "",
              status: ""
            },
            {
              title: "机构简称",
              type: "text",
              required: false,
              placeholder: "请输入机构简称",
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
              title: "是否为代理机构",
              otherType: "select",
              required: false,
              placeholder: "请选择是否为代理机构",
              key: "",
              name: "",
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
              title: "所在行政区",
              type: "text",
              required: false,
              placeholder: "所在行政区",
              key: "",
              name: "",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "",
              status: "",
              disabled:true,
              isHide:false,
            },
          ],

          // form btns
          formBtns: [
            // { title: "重置", htmltype: "button", operate: "resetForm" }
          ]
        },
      },
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

    // tree 选择
    accepttreeNodeFun(newTreeData){
      this.initArr.formData.formInputs[3].isHide = false;
      this.orgObj = newTreeData;
      if(newTreeData.isLeaf){

        this.isOrg = true;
        this.$http.fetchGet("orgManage@findOrgManageById.action", {
          id:newTreeData.key
        }).then(res => {
          if(Number(res.code) === 0){
            // b0101 机构名字
            // b0104 机构简称
            // isAgent "0" "1" 是否为代理
            // city.name 所在区划分
            this.initArr.formData.formInputs[0].val = res.data.b0101;
            this.initArr.formData.formInputs[1].val = res.data.b0104;
            this.initArr.formData.formInputs[2].val = res.data.isAgent;
            this.initArr.formData.formInputs[3].val = res.data.city.name;
          }else{
            this.$message.warning("获取数据失败,请重试");
          }
        }).catch(err => {
          this.$message.error("网络异常,请稍后重试");
        })

      }else{
        this.isOrg = false;
        this.reset();
        this.initArr.formData.formInputs[3].val = newTreeData.title;
        this.initArr.formData.formInputs[3].isHide = true;
      }
    },

    // 添加机构到行政区划
    handleAdd(){
      let orgName = this.initArr.formData.formInputs[0].val;
      
      if(orgName || String(orgName) === "0" && this.orgObj && this.orgObj.pid){
        this.$http.fetchPost("orgManage@addGovOrg.action",{
          pid:this.orgObj.pid,
          orgTotalName:orgName,
          orgSampleName:this.initArr.formData.formInputs[1].val,
          isAgent:this.initArr.formData.formInputs[2].val,
          unitType:"1",
          status:"0",
        }).then(res => {

        }).catch(err => {

        })
      }

    },

    // 修改
    handleChange(){

    },

    handleReset(){
      this.orgObj = null;
      this.reset();
    },

    // 重置
    reset(){
      this.initArr.formData.formInputs.forEach(input => {
        input.val = void 0;
      })
    },

    // 删除
    handleDelete(){
      
    },

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
.orgTitle{
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.orgTitle>p{
  margin-left: 20px;
}
.formBtns button{
  margin-left: 10px;
}
</style>