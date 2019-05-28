<template>
  <div class="outer">
    <TableView :initArrData="initArr" @searchTable="getTableData">
      <div slot="tableAction" slot-scope="slotPropsData">
        <a href="javascript:;" @click="viewFun(slotPropsData.currRowdata)" class="primaryBtnColor">查看</a>
        <a href="javascript:;" @click="recommendFun(slotPropsData.currRowdata)" class="infoBtnColor">推荐</a>
        
      </div>
    </TableView>
  </div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
  name: "InfoCruit",
  components: {
    TableView
  },
  data() {
    return {
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check

        formData: {
          // inputs
          formInputs:[
            {
              title: '职位名称',
              type: "text",
              required: false,
              placeholder: "请输入职位名称",
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
          ],
          // btns
          formBtns:[
            { title: "查询", htmltype: "submit", operate: "searchForm" },
            { title: "重置", htmltype: "button", operate: "resetForm" },
          ],
        },

        columnsArr: [
          //table标头
          { title: "序号", dataIndex: "num", key: "num" },
          { title: "发布单位", dataIndex: "depart", key: "depart" },
          { title: "职位名称", dataIndex: "job", key: "job" },
          { title: "工作地址", dataIndex: "address", key: "address" },
          { title: "月薪", dataIndex: "wage", key: "wage", sorter: (a, b) => a.wage - b.wage  },
          { title: "工作年限", dataIndex: "workYear", key: "workYear", sorter: (a, b) => a.workYear - b.workYear  },
          { title: "福利待遇", dataIndex: "welfare", key: "welfare" },
          { title: "招聘人数", dataIndex: "cruitnum", key: "cruitnum", sorter: (a, b) => a.cruitnum - b.cruitnum  },
          { title: "发布时长", dataIndex: "release", key: "release", sorter: (a, b) => a.release - b.release  },
          { title: "创建时间", dataIndex: "build", key: "build", sorter: (a, b) => a.build - b.build  },
          {
            title: "操作",
            key: "action",
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: [
          //table数据
          {
            key: 1,
            num: 1,
            depart: "发布单位",
            job: "职位",
            address: "地址",
            wage: "20000",
            workYear: "5",
            welfare: "test",
            cruitnum: "3",
            release: "3天",
            build: "2019-03-20"
          }
        ]
      }
    };
  },
  methods: {
    getTableData(condition, initableArr) {
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * condition:form查询结果：{}
       *  */
      console.log(condition);
      let tempData = [];
      if(condition.length === 0){
        this.initArr.tabledataArr = initableArr;
      } else{
        tempData = initableArr.filter(item => {
           return Object.keys(condition).every(key =>{
              return String(item[key]).toLowerCase().includes(String(condition[key]).trim().toLowerCase())
           });
         });
      }
      console.log(tempData);
      this.initArr.tabledataArr = tempData;
    },
    viewFun(data){
      /***
       * 功能:查看当前行数据
       */
      console.log(data)
    },
    recommendFun(data){
      /***
       * 功能：推荐操作
       */
      console.log(data);
    }
  }
};
</script>

<style>
</style>