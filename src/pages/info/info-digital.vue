<template>
  <div class="outer">
    <TableView :totalCount="tableTotalNum" :initArrData="initArr" @searchTable="getTableData">
      <div slot="tableAction" slot-scope="slotPropsData">
        <a href="javascript:;" class="primaryBtnColor" @click="openModel('directoryModalState',slotPropsData.currRowdata)">档案目录</a>
        <!-- <a href="javascript:;" class="infoBtnColor">档案编辑</a> -->
        <a
          href="javascript:;"
          class="defaultBtnColor"
          @click="openModel('editModalState',slotPropsData.currRowdata)"
        >编辑</a>
      </div>
    </TableView>

    <!-- 档案目录弹出层 -->
    <div class="modal directoryModal">
      <a-modal
        centered 
        :visible="directoryModalState"
        @cancel="handleCancel"
        :width ="1200"
        :footer='null'
        :maskClosable='false'
      >
        <!-- slot title -->
        <div slot="title" class="titleSlot">
          <p>档案目录</p>
          <span>{{currentData && currentData.name}}</span>
        </div>
        <!-- 档案目录 -->
        <DocDirectory :userId="currentData && currentData.key" :ramdomKey="editRadomKey"></DocDirectory>
      </a-modal>
    </div>

    <!-- 档案编辑弹出层 -->
    <div class="modal editModal">
      <a-modal
        centered 
        :visible="editModalState"
        :confirmLoading="editModalConfirm"
        okText="保存"
        cancelText="取消"
        @ok="editHandleOk"
        @cancel="handleCancel"
        :width ="1200"
        :maskClosable='false'
      >
        <!-- slot title -->
        <div slot="title" class="titleSlot">
          <p>档案编辑</p>
          <span>{{currentData && currentData.name}}</span>
        </div>
        <!-- 编辑档案 -->
        <EditDocDirectory :userId="currentData && currentData.key" :ramdomKey="editRadomKey" ref="EditDocDirectory"></EditDocDirectory>
      </a-modal>
    </div>

  </div>
</template>

<script>
import TableView from "@/components/tableView";
import DocDirectory from "@/components/docDirectory";
import EditDocDirectory from '@/components/editDocDirectory';
export default {
  name: "InfoDigital",
  components: {
    TableView,
    DocDirectory,
    EditDocDirectory,
  },
  data() {
    return {
      // 当前行数据
      currentData:null,
      // 数据
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false,
        formData: {
          // inputs
          formInputs: [
            {
              title: '姓名',
              type: "text",
              required: false,
              placeholder: "请输入姓名",
              key: "name",
              name: "name",
              val: void 0,
              postname: "",
              maxlength: 20,
              minlength: 0,
              reg: '',
              tip: '',
              status: '',
              
            },
            {
              title: "组织机构",
              otherType: "treeselect",
              placeholder: "请选择组织机构",
              key: "organ",
              name: 'organ',
              children:[],
            }
          ],
          // btns
          formBtns: [
            { title: "查询", htmltype: "submit", operate: "searchForm" }
          ]
        },
        columnsArr: [
          {
            title: "序号",
            dataIndex: "num",
            key: "num",
            fixed: "left",
            width: 80
          },
          { title: "照片", dataIndex: "photo", key: "photo", width: 200 ,scopedSlots: { customRender: "img" }},
          { title: "姓名", dataIndex: "name", key: "name", width: 200 , scopedSlots: { customRender: "nameLink" }},
          { title: "籍贯", dataIndex: "address", key: "address", width: 300 },
          {
            title: "最高学历",
            dataIndex: "graduate",
            key: "graduate",
            width: 100
          },
          {
            title: "操作",
            key: "action",
            width: 200,
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: [],
      },
      tableTotalNum:0,
      // 弹框状态
      directoryModalState:false,
      // directoryModalConfirm:false,
      editModalState:false,
      editRadomKey:Math.random(),
      editModalConfirm:false,
      // 档案目录当前数据
      currentPersonDirectory:null,
    };
  },
  created(){
    this.initArr.formData.formInputs[1].children = this.treeData;
    this.getTableData(null,1,10);
  },
  computed:{
      treeData:function(){
        return this.$store.getters.getInfoPollTreeData
      },
  },
  methods: {

    getTableData(condition, pageNum, limitNum) {
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * condition:form查询结果：{}
       *  */
      console.log(condition);
      const _this = this;
      this.$http.fetchGet('digitalArchives@personnelList.action',{
        page:pageNum,
        limit:limitNum,
        name:(!condition || !condition.name) ? '' : condition.name,
        nodeId:(!condition || !condition.organ) ? '' : condition.organ,
        orgtype:(!condition || !condition.organ) ? '' : condition.organ.length > 10 ? "1":"0",  // 机构 为1 非机构节点为 0
      }).then((res)=>{
        if(Number(res.code) === 0){
          // 整理数据
          this.initArr.tabledataArr = [];
          this.tableTotalNum = res.count;
          res.data.forEach((item,index)=>{
            let oneRowData = {
              key: item.a01000,
              num: index+1,
              photo: _this.$targetHost+item.imgPath.substr(2),
              name: item.a0101,
              address:item.a3711,
              graduate:item.a0888,
              // organ: "01",
            };
            this.initArr.tabledataArr.push(oneRowData);
          });
        }
      });

      // let tempData = [];
      // if(condition.length === 0){
      //   this.initArr.tabledataArr = initableArr;
      // } else{
      //   tempData = initableArr.filter(item => {
      //      return Object.keys(condition).every(key =>{
      //         return String(item[key]).toLowerCase().includes(String(condition[key]).trim().toLowerCase())
      //      });
      //    });
      // }
      // console.log(tempData);
      // this.initArr.tabledataArr = tempData;
    },
    // 关闭所有的弹框为 false
    handleCancel(){
      this.editModalState = false;
      this.directoryModalState = false;
    },
    editHandleOk(){
      const _this = this;
      let finalData = this.$refs['EditDocDirectory'].getFinishData();
      this.$http.fetchPost('digitalArchives@addCatalog.action',{arrs:JSON.stringify(finalData)})
          .then(res => {
              console.log(res);
              if(Number(res.code) === 0){
                _this.$message.success('保存成功!');
                _this.handleCancel();
              }else{
                _this.$message.error('保存失败,请重试');
              }
          })
          .catch(err => {
             _this.$message.error('抱歉,网络错误,请稍后重试');
          })
    },
    
    // 点击档案编辑
    openModel(modalStateName,rowData) {
      this.currentData = rowData;
      this.handleCancel();
      this[modalStateName] = true;
      this.editRadomKey = Math.random();
      // this.getUerDirectory(rowData.key);
    }
  }
};
</script>
    
<style>
  .ant-modal-body{
    padding:0;
  }
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
</style>