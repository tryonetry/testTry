<!-- template -->
<template>
  <div class="outer">
    
    <TableView :initArrData="initArr"  @accepttreeNode="accepttreeNodeFun">
      <!-- tableFormSearch里添加其他按钮 -->
      <div slot="underSearchCont" class="orgTitle">
        <p>{{orgObj && orgObj.type == '1' ? "机构名称 : " : "行政区划 : " }}{{ orgObj && orgObj.title }} <span v-if="orgObj && orgObj.key && (orgObj.key.length < 4 || orgObj.type == '1')" class="canAddOrg">[当前行政区划不可添加机构]</span></p>
      </div>
      <span slot="formAction" class="formBtns">
          <a-button type="primary" @click="handleAdd" v-if="orgObj && orgObj.key && orgObj.key.length >= 4 && orgObj.type == '0'">添加到当前行政区</a-button>
          <a-button type="primary" @click="handleChange" v-if="orgObj && orgObj.key && orgObj.key.length >= 4 && orgObj.type == '1'">立即修改</a-button>
          <a-button @click="handleReset">重 置</a-button>
          <a-popconfirm
            title="确定要删除当前机构吗?"
            okText="确定"
            cancelText="取消"
            @confirm="handleDelete"
          >
            <a-button type="danger" v-if="orgObj && orgObj.key && orgObj.key.length >= 4 && orgObj.type == '1'">删除当前机构</a-button>
          </a-popconfirm>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <!-- <div slot="tableAction" slot-scope="slotPropsData"></div> -->
    </TableView>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
import utils from '../../../utils/util'
export default {
  name: "OrganManager",
  //import引入的组件需要注入到对象中才能使用
  components: { TableView },
  props: [""],

  data() {
    return {
      orgObj:null,
      tableTotalNum: 0, //总页数：默认为0
      // tableView传值方式
      initArr: {
        treeflag: true, //左侧tree是否存在
        tableCheck: false, //table是否可以check
        isHasNotTable: true,  //table是否存在： 存在：false； 不存在：true
        isNoTitle: true,  //表格上--标题不显示
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
              key: "b0101",
              name: "b0101",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "* 请输入存档机构名称",
              postname: "b0101",
              status: ""
            },
            {
              title: "机构简称",
              type: "text",
              required: false,
              placeholder: "请输入机构简称",
              key: "b0104",
              name: "b0104",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "",
              postname: "b0104",
              status: ""
            },
            {
              title: "机构编号",
              type: "text",
              required: true,
              placeholder: "请输入机构编号",
              key: "b0114",
              name: "b0114",
              val: void 0,
              maxlength: 6,
              minlength: 6,
              reg: "",
              tip: "* 请输入6位机构编号",
              postname: "",
              status: ""
            },
            {
              title: "机构地址",
              type: "text",
              required: true,
              placeholder: "请输入机构地址",
              key: "b0117",
              name: "b0117",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "b0117",
              tip: "* 请输入机构地址",
              postname: "",
              status: ""
            },
            {
              title: "联系电话",
              type: "text",
              required: true,
              placeholder: "请输入联系电话",
              key: "b0107",
              name: "b0107",
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: "",
              tip: "* 请输入联系电话",
              postname: "b0107",
              status: ""
            },
            {
              title: "邮政编码",
              type: "text",
              required: true,
              placeholder: "请输入邮政编码",
              key: "b0111",
              name: "b0111",
              val: void 0,
              maxlength: 6,
              minlength: 6,
              reg: "",
              tip: "* 请输入正确的邮政编码",
              postname: "b0111",
              status: ""
            },
            {
              title: "是否拥有库房",
              otherType: "select",
              required: true,
              placeholder: "请选择是否拥有库房",
              key: "b0106",
              name: "b0106",
              val: void 0,
              children: [
                {
                  itemCode: "0",
                  itemName: "有"
                },
                {
                  itemCode: "1",
                  itemName: "没有"
                }
              ],
              status: "",
              isHide:false,
            },
             // select/searchSelect
            // {
            //   title: "是否为代理机构",
            //   otherType: "select",
            //   required: false,
            //   placeholder: "请选择是否为代理机构",
            //   key: "",
            //   name: "",
            //   val: void 0,
            //   children: [
            //     {
            //       itemCode: "1",
            //       itemName: "是"
            //     },
            //     {
            //       itemCode: "0",
            //       itemName: "否"
            //     }
            //   ],
            //   status: "",
            //   isHide:false,
            // },
            // {
            //   title: "所在行政区",
            //   type: "text",
            //   required: false,
            //   placeholder: "所在行政区",
            //   key: "",
            //   name: "",
            //   val: void 0,
            //   maxlength: 20,
            //   minlength: 0,
            //   reg: "",
            //   tip: "",
            //   postname: "",
            //   status: "",
            //   disabled:true,
            //   isHide:false,
            // },
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
      this.orgObj = newTreeData;
      if(newTreeData.type == '1'){
        this.$http.fetchGet("orgManage@findOrgManageById.action", {
          id:newTreeData.key
        }).then(res => {
          if(Number(res.code) === 0){
            this.initArr.formData = utils.getNewFormSearch(res.data, this.initArr.formData);

          }else{
            this.$message.warning("获取数据失败,请重试");
          }
        }).catch(err => {
          this.$message.error("网络异常,请稍后重试");
        })
      } else{
        this.reset();
      }
    },

    // 添加机构到行政区划
    handleAdd(){
      let orgName = this.initArr.formData.formInputs[0].val;
      if(this.orgObj.key.length < 4 || this.orgObj.type == '1'){
        this.$message.warning("请选择可加机构的行政区划");
        return;
      }
      
      let requireCount = 0,requireCountVal = 0;
      this.initArr.formData.formInputs.forEach(el => {
        if(el.required){
          requireCount ++;
          if(el.val){
            if(el.name === 'b0114' || el.name === 'b0111'){
              if(el.val.length == 6){
                requireCountVal++;
              }
            } else{
              requireCountVal++;
            }
          }
        }
      });
      
      
      if(Number(requireCount) === Number(requireCountVal)){
        this.$http.fetchPost("orgManage@addGovOrg.action",{
          pid:this.orgObj.key,
          orgTotalName:orgName,
          orgSampleName:this.initArr.formData.formInputs[1].val,
          b0114: this.initArr.formData.formInputs[2].val,
          b0117: this.initArr.formData.formInputs[3].val,
          b0107: this.initArr.formData.formInputs[4].val,
          b0111: this.initArr.formData.formInputs[5].val,
          b0106: this.initArr.formData.formInputs[6].val,
          unitType:"1",
          status:0,
        }).then(res => {
          if(Number(res.code) === 0){
            this.$message.success("添加成功!");
            this.getTreeData();
            this.reset();
          }else{
            this.$message.warning("抱歉,添加失败,请重试");
          }
        }).catch(err => {
          this.$message.error("抱歉,网络异常,请稍后重试");
        });
      }else{
        this.initArr.formData.formInputs.forEach(el => {
          if(el.required){
            if(el.val){
              if(el.name === 'b0114' || el.name === 'b0111'){
                if(el.val.length !== 6){
                  el.status = 'error';
                }
              } else{
                el.status = 'success';
              }
            } else{
              el.status = 'error';
            }
          }
        });
      }

    },

    // 修改
    handleChange(){

      let orgName = this.initArr.formData.formInputs[0].val;

      let requireCount = 0,requireCountVal = 0;
      this.initArr.formData.formInputs.forEach(el => {
        if(el.required){
          requireCount ++;
          if(el.val){
            if(el.name === 'b0114' || el.name === 'b0111'){
              if(el.val.length == 6){
                requireCountVal++;
              }
            } else{
              requireCountVal++;
            }
          }
        }
      });


      if(Number(requireCount) === Number(requireCountVal)){
        this.$http.fetchPost("orgManage@editOrg.action",{
          id:this.orgObj.key,
          upUnitId:this.orgObj.pId,
          orgTotalName:orgName,
          orgSampleName:this.initArr.formData.formInputs[1].val,
          b0114: this.initArr.formData.formInputs[2].val,
          b0117: this.initArr.formData.formInputs[3].val,
          b0107: this.initArr.formData.formInputs[4].val,
          b0111: this.initArr.formData.formInputs[5].val,
          b0106: this.initArr.formData.formInputs[6].val,
        }).then(res => {
          if(Number(res.code) === 0){
            this.$message.success("修改成功!");
            this.getTreeData();
            this.orgObj.title = orgName;
          }else{
            this.$message.warning("抱歉,修改失败,请重试");
          }
        }).catch(err => {
          this.$message.error("抱歉,网络异常,请稍后重试");
        })
      } else{
        this.initArr.formData.formInputs.forEach(el => {
          if(el.required){
            if(el.val){
              if(el.name === 'b0114' || el.name === 'b0111'){
                if(el.val.length !== 6){
                  el.status = 'error';
                }
              } else{
                el.status = 'success';
              }
            } else{
              el.status = 'error';
            }
          }
        });
      }
    },

    handleReset(){
      this.orgObj = null;
      this.reset();
    },

    // 重置
    reset(){
      this.initArr.formData.formInputs.forEach(input => {
        input.val = void 0;
        input.status = "";
      })
    },

    // 删除
    handleDelete(){
      if(this.orgObj && this.orgObj.key){
        this.$http.fetchPost("orgManage@deleteOrgManage.action",{
          nodeId:this.orgObj.key,
        }).then(res => {
          if(Number(res.code) === 0){
            this.$message.success("删除成功!");
            this.getTreeData();
            this.handleReset();
          }else{
            this.$message.warning("抱歉,删除失败,请重试");
          }
          
        }).catch(err => {
          this.$message.error("抱歉,网络异常,请稍后重试");
        })
      }
    },

    // 获取树数据
    getTreeData() {
      this.$http.fetchGet("informationPool@getParentId.action", {})
      .then(res => {
        if(Number(res.code) === 0){
          this.getNewTreeData(res.data);
        }
      });
    },

    // 重组tree数据:替换原来的id为key; name为title
    getNewTreeData(dataArr) {

      dataArr.forEach(el => {
        el.title = el.name;
        el.key = el.id;
        el.value = el.id;
        el.isLeaf = el.isParent === "false" && el.key.length > 10 ? true:null;
        delete el.name;
        delete el.id;
        if (el.children) {
          this.getNewTreeData(el.children);
        }
      });
      // patch 到 vuex
      this.$store.dispatch("getinfoPollTreeData", dataArr);
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
.canAddOrg{
  color: #faad14;
}
.formBtns button{
  margin-left: 10px;
}
</style>