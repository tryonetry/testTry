<template>
  <div :class="editableCol && editableCol.length > 0 ? 'editViewContainer' : 'viewContainer'">
    
    <div class="organ_tree" v-if="treeFlag">
      <OrganTree @sendTreeValue="acceptTreeValue"></OrganTree>
    </div>
    <div :class="treeFlag ? 'viewContent' : 'noviewContent'">

      <!-- 搜索框上方的内容 -->
      <slot name="underSearchCont"></slot>

      <!-- table 搜索框 -->
      <TableFromSearch :formDataArr="formData" @searchForm="searchFormFun" @bundleChange="bundleChangeFun" :layout="layout" :tableBodyRize="tableBodyRize">
        <slot name="formAction"></slot>
      </TableFromSearch>

      <div class="tableCon" v-if="!isHasNotTable" ref="tableCon">
        
        <!-- checkbox -->
        <a-table
          :columns="columns"
          :dataSource="tabledata"
          :rowSelection="tablecheck ? {onSelect:onSelect, onSelectAll:onSelectAll,getCheckboxProps:getCheckboxProps,selectedRowKeys: selectedRowKeys, onChange: onSelectChange} : null"
          :scroll="isEditAndAdd ? {x:tableWidth} :{ x: tableWidth,y:tableHeight}"
          :pagination="false"
          :bordered="bordered"
          :loading="loading"
        >

          
          <!-- 表格页脚 (添加时候显示) -->
          <template v-if="isEditAndAdd" slot="footer" slot-scope="currentPageData">
            <div class="addBtn" @click="addList">
              <a-icon type="plus" style="color:#666"/>
            </div>
          </template>

          <!-- ####################################### 此处是自定义列 ############################### -->
          
          <!-- 操作按钮 -->
          <span slot="action" slot-scope="text, record, index" class="actionContainer">
            <!-- 可编辑按钮 -->
            <p v-if="editableCol && editableCol.length > 0" class="editAble">
              <a v-if="record.inEdit" href="javascript:;" class="primaryBtnColor" @click="changeEditStatus(index,false)">确 定</a>
              <a v-else href="javascript:;" class="primaryBtnColor" @click="changeEditStatus(index,true)">编 辑</a>
              <a-popconfirm
                title="您确定删除吗?"
                okText="确定"
                cancelText="取消"
                @confirm="deleteRow(index)"
              >
                <a href="javascript:;" class="errorBtnColor">删 除</a>
              </a-popconfirm>
            </p>
            <slot name="tableAction" :currRowdata="record" :currTableData="tabledata"></slot>
          </span>

          <span slot="action2" slot-scope="text, record">
            <slot name="tableAction2" :currRowdata="record" :currTableData="tabledata"></slot>
          </span>
          
          <!-- 鼠标放上去显示当前行数据 -->
          <span slot="cursorTitle" slot-scope="text, record">
            <a-tooltip :currRowdata="record" placement="bottom">
              <template slot='title'>
                {{text}}
              </template>
              {{text}}
            </a-tooltip>
          </span>

          <template slot="customize" slot-scope="text, record">
              <slot name="customizeInner" :currRowdata="record"></slot>
          </template>

          <!-- 连接 -->
          <span slot="nameLink" slot-scope="text, record">
            <a
              href="javascript:void(false);"
              class="tableLink"
              :currRowdata="record"
            >{{record.name || record.a0101}}</a>
          </span>

          <!-- 图片 -->
          <div slot="img" slot-scope="text, record" class="tableImg">
            <img :src="record.photo" alt="">
          </div>

          

          <!-- 必填项表头 -->
          <template  v-for="col in editCol" :slot="col">
            <p :key="col" v-if='col.split("_")[1] === "requireTitle"'>
               {{col.split("_")[0]}}
              <span class="redSpan">*</span>
            </p>
           
          </template>

          <!-- <span slot="材料类型_requireTitle" ><a-icon type="smile-o" /> Name</span> -->

          <!-- 此处未知 bug 只能同时存在一个 v-for 循环的 solt,所以将不同的类型分置同一个 for 中 -->
          <template  v-for="col in editCol" :slot="col" slot-scope="text, record ,index">
            
             
              <!-- <span :key="col" v-if='col.split("_")[1] === "requireTitle"'>{{col.split("_")[0]}}<span>*</span></p> -->

              <!-- 普通可编辑列 -->
              <div :key="col" v-if='col.split("_")[1] === "editInput"'>
                <a-input
                  v-if="record.inEdit"
                  v-model="record[col.split('_')[0]]"
                  class="editInput"></a-input>
                <span v-else>{{text}}</span>
              </div>

              <!-- 日期可编辑列 -->
              <div :key="col" v-if='col.split("_")[1] === "editDateInput"'>
                <a-date-picker
                  v-if="record.inEdit"
                  placeholder="请选择日期"
                  :format="getColHeaderData(col.split('_')[0]) && getColHeaderData(col.split('_')[0]).dateFormat"
                  :value="text ? moment(text,getColHeaderData(col.split('_')[0]) && getColHeaderData(col.split('_')[0]).dateFormat) : void 0"
                  @change="changeDataEdit(arguments,index,col.split('_')[0])"
                  allowClear
                />
                <span v-else>{{text}}</span>
              </div>

              <!-- 可搜索下拉框可编辑列 -->
              <div :key="col" v-if='col.split("_")[1] === "editSelectInput"'>
                <a-select
                  v-if="record.inEdit"
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择"
                  v-model="record[col.split('_')[0]].code"
                  @change="changeSearchSelectEdit(arguments,index,col.split('_')[0],getColHeaderData(col.split('_')[0]) && getColHeaderData(col.split('_')[0]).itemChildren)"
                  :filterOption="filterOption"
                  allowClear
                >
                  <a-select-option
                    v-for="(el, index) in getColHeaderData(col.split('_')[0]) && getColHeaderData(col.split('_')[0]).itemChildren"
                    :key="index"
                    :value="el.itemCode"
                    :disabled="el.isdisabled">
                    {{el.itemName}}
                  </a-select-option>
                </a-select>
                <span v-else>{{record[col.split('_')[0]].name}}</span>
              </div>

              <!-- 地址可编辑列 -->
              <div :key="col" v-if='col.split("_")[1] === "editAddressInput"'>
                <a-cascader
                  v-if="record.inEdit"
                  :options="address"
                  placeholder="请选择地址"
                  v-model="record[col.split('_')[0]].code"
                  @change="changeAddressEdit(arguments,index,col.split('_')[0])"
                  :fieldNames="{label:'name',value:'code',children:'children'}"
                  allowClear
                />
                <span v-else>{{record[col.split('_')[0]].name}}</span>
              </div>

          </template>
          <!-- ####################################### 此处是自定义列 ############################### -->
        </a-table>
        
      </div>
      <div class="pagination_view" v-if="!isHasNotTable && !noPagination">
        <a-pagination
          v-model="currentPageNum"
          :total="tableTotalCount"
          :showTotal="total => `共 ${total} 条`"
          @change="changePagination"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OrganTree from "@/components/organTree";
import TableFromSearch from "@/components/tableFormSearch";
import address from '../../public/json/address.js';
import moment from 'moment';
import { isMoment } from 'moment';
import { setTimeout } from 'timers';
import utils from '../utils/util';

export default {
  name: "TableView",
  components: {
    OrganTree,
    TableFromSearch,
  },
  props: ["initArrData", "totalCount","filterTableCheck","loading","layout","initHeight"],
  data() {
    return {
      formData: [], //表格上方form
      organData: [], //左侧树tree数据
      treeFlag: Boolean, //左侧树是否存在
      otherTreeFlag:Boolean, // 其他树
      isHasNotTable: Boolean, //table是否存在： true：不存在， false：存在
      columns: [], //table表头
      tabledata: [], //table数据
      tablecheck: Boolean, //table是否可以选择
      tableTotalCount: 0,
      currentPageNum: 1,
      condition:{},  //子组件的查询结果
      tableWidth:"100%",
      tableHeight:200, // 设置table滚动的高度
      timer:null, //监听器
      bordered:false, // 边框默认 false
      selectedRowKeys: [], //选择的 keys
      editableCol: [], 
      addMaxLength:0,
    };
  },
  watch: {
    initArrData: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.treeFlag = newVal.treeflag;
          this.otherTreeFlag = newVal.otherTreeFlag;
          this.noPagination = newVal.noPagination;
          this.bordered = newVal.bordered ? newVal.bordered : false;
          this.isEditAndAdd = newVal.isEditAndAdd ? newVal.isEditAndAdd : false;
          this.superimposeWidth = newVal.superimposeWidth ? newVal.superimposeWidth : false;
          this.editableCol = newVal.editableCol;
          this.formData = newVal.formData;
          this.columns = newVal.columnsArr;
          this.tabledata = newVal.tabledataArr;
          this.tablecheck = newVal.tableCheck;
          this.isHasNotTable = newVal.isHasNotTable;
          this.addMaxLength = newVal.addMaxLength;
          sessionStorage.setItem(
            "hctabledata",
            JSON.stringify(newVal.tabledataArr)
          );

          this.selectedRowKeys = newVal.selectedRowKeys ? newVal.selectedRowKeys : [];
          // 单元格宽度溢出处理
          this.$nextTick(function(){
            
            let theadWidthArr = [];
            let fixedLeftNum = 0;
            newVal.columnsArr && newVal.columnsArr.forEach((col,i) => {
              // 不固定且有宽度的 push
              if(col.width && col.width > 0 && !col.fixed){
                theadWidthArr.push(col.width);
              }
              if(col.fixed === 'left'){
                fixedLeftNum += 1;
              }

            });
            if(newVal.tableCheck) fixedLeftNum += 1;
            let theadWidthArrLen = theadWidthArr.length;
            let thDom = document.querySelectorAll('.tableCon .ant-table-thead th');
            let trDom = document.querySelectorAll('.tableCon .ant-table-tbody tr');
            // console.log(theadWidthArrLen);
            [].forEach.call(trDom,(item,index) => {
              [].forEach.call(item.childNodes,(td,tdIndex) => {
                
                if(newVal.tableCheck){
                  if(tdIndex !== 0 && td.getAttribute && td.getAttribute('class') !== 'ant-table-fixed-columns-in-body' && theadWidthArr[tdIndex-fixedLeftNum]){
                    td.style.maxWidth = theadWidthArr[tdIndex-fixedLeftNum]+'px';
                  }
                }else {
                  if(td.getAttribute && td.getAttribute('class') !== 'ant-table-fixed-columns-in-body' && theadWidthArr[tdIndex-fixedLeftNum]){
                    td.style.maxWidth = theadWidthArr[tdIndex-fixedLeftNum]+'px';
                  }
                }

                // td.setAttribute('max-height',)
              })
            });

          });

        }
      }
    },

    totalCount: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal || Number(newVal) === 0) {
          this.tableTotalCount = newVal;
        }
      }
    },

  },
  created() {
    if(this.initHeight){
      this.tableHeight = Number(this.initHeight);
    }
  },
  mounted() {
    const _this = this;
    
    setTimeout(function(){
      _this.$nextTick(function(){
        if(_this.columns && _this.columns.length > 0){
          _this.tableBodyRize();
        }
      });
    },0);

    // 监听窗口改变 
    window.onresize = function(){
      _this.$nextTick(function(){
        if(_this.columns && _this.columns.length > 0){
          _this.tableBodyRize();
        }
      });
    }

  },
  destroyed(){
    window.onresize = null;
  },
  methods: {
    moment,
    isMoment,
    getCondition(){
      return this.condition;
    },

    // table 宽高重新渲染
    tableBodyRize(){
        let currScreenWidth = this.treeFlag || this.otherTreeFlag ? 1920-280-240 : 1920-280;
        let tempHeight = this.$refs.tableCon.clientHeight - 59;
        let tempWidth = 0;
        this.initArrData.columnsArr.forEach(el => {
          if(el.width){
            tempWidth += Number(el.width);
          }
        });
        tempWidth +=  200;
        if(tempWidth > currScreenWidth || this.superimposeWidth){
          currScreenWidth = tempWidth
        }
        this.tableHeight = tempHeight > 200 ? utils.detectZoom()/100 * tempHeight : utils.detectZoom()/100 * this.tableHeight;
        this.tableWidth = utils.detectZoom()/100 * currScreenWidth;
    },
    
    bundleChangeFun(value){
      /**
       * 监听子组件：tableFormSearch上值是否发生变化；当发生变化则修改this.condition的值；
       */
      this.condition = value;
    },
    acceptTreeValue(value) {
      /***
       * 功能:接收子组件选择的treeNode值
       * 参数：value：子组件上选择的treeNode
       */
      this.condition = Object.assign({}, this.condition, {upUnitId: value['key'], type: value['type']});
      this.$emit("accepttreeNode", value, this.condition); //把treeNode选择得值派发给父组件：info-poll

    },

    // 获取 table 数据
    getTableData(){
      return  this.tabledata;
    },

    // 通过form获取数据
    searchFormFun(data, isOperateLimit) {
      /***
       * 功能：调用父组件的searchTable函数，重新获取tableData值
       * data:form点击查询按钮获取需要的查询结果；
       * isOperateLimit：判断查询操作是否根据条件被限制；若为true--必须输入查询条件才可查询；否则为false--不需要查询条件也可查询
       */
      data.forEach(element => {

        let elName = element.name;
        if(elName.indexOf('-') >= 0 && element.val instanceof Array && elName.split('-').length === element.val.length){

          //val值为数组,name为-隔开的
          let elNameArr = elName.split('-');
          elNameArr.forEach((item,index)=>{
            if(isMoment(element.val[index])){
              this.condition[item] = element.val[index].format('YYYY-MM-DD')
            }else{
              this.condition[item] = element.val[index];
            }
          });

        }else if(elName.indexOf('-') < 0){
          if (element.val) {
            this.condition[element.name] = element.val;
          } else {
            this.condition[element.name] = "";
          }
        }
      });
      
      //console.log(isOperateLimit);
      if(isOperateLimit != 'no'){
        //被限制--必须有条件才可查询
        let isSearchFlagArr = [];
        for(let prop in this.condition){
          if(this.condition[prop] && this.condition[prop] != 'undefined' && this.condition[prop].__proto__.constructor !== Array){
            isSearchFlagArr.push(this.condition[prop]);
          }
        }
        
        if(isSearchFlagArr.length > 0){
          this.$emit("searchTable", this.condition, 1, 10);
          // this.tabledata = this.$parent.initArr.tabledataArr;
          this.currentPageNum = 1;
        } else{
          this.$message.warning('请输入查询条件,进行此操作！');
        }
      } else{
        //不被限制--不输入条件也可查询
        this.$emit("searchTable", this.condition, 1, 10);
        this.currentPageNum = 1;
      }
      
      
    },

    // check table 选择
    onSelect(record,selected,selectedRows) {
      /***
       * 功能：checbox-table选择表格数据
       * 参数：record:当前行； selected:true/false; selectedRows:[]选择的数据
       */
      this.$emit("listeningCheck",record,selected,selectedRows);
      this.$store.dispatch('getinfoTableCheckData',selectedRows);
    },

    // check table 全选
    onSelectAll(selected, selectedRows, changeRows) {
      //table全选
      this.$emit("listeningCheckAll",selected, selectedRows, changeRows);
      this.$store.dispatch('getinfoTableCheckData',selectedRows);
    },

    // check table 改变
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },

    // 过滤可选择条件
    getCheckboxProps(record){
      if(this.filterTableCheck && this.filterTableCheck instanceof Function){
        return this.filterTableCheck(record);
      }else{
        return record => {
          return {props:{}}
        }
      }
    },

    changeTableData() {
      //更新table
      this.tabledata = this.$parent.initArr.tabledataArr;
    },

    changePagination(page, pageSize){
      //换页：page:当前page; pageSize:当前页得显示数据数量
      this.$emit('searchTable', this.condition, page, pageSize);
    },

    /***
     * 此处以下为可编辑列部分的方法
     */

    //获取当前列对应的列头数据 
    getColHeaderData(colName){
      let result = null;
      this.columns.forEach(item => {
        if(colName === item.dataIndex){
          result = item;
        }
      });
      return result;
    },

    // 添加数据
    addList(){
      
      if(this.columns.length <= 0 )  return;
      if(this.tabledata.length >= this.addMaxLength) {
        this.$message.warning('只能添加'+ this.addMaxLength + '条数据！');
        return;
      } 

      // 添加空行
      let emptyRow = {};
      this.columns.forEach(item => {
        if(item.dataIndex){
          
          if(item.scopedSlots && item.scopedSlots.customRender && (item.scopedSlots.customRender.split('_')[1] === 'editAddressInput' || item.scopedSlots.customRender.split('_')[1] === 'editSelectInput')){
            emptyRow[item.dataIndex] = {code:void 0,name:''};
          }else{
            emptyRow[item.dataIndex] = void 0;
          }
          emptyRow['key'] = this.tabledata.length;
          if(this.editableCol && this.editableCol.length > 0){
            emptyRow['inEdit'] = false;
          }
        }
      });
      this.tabledata.push(emptyRow);
    },

    // 删除行
    deleteRow(index){
      // console.log(this.tabledata[index])
      this.tabledata.splice(index,1);
    },

    // 改变编辑状态
    changeEditStatus(index,state){
      this.tabledata[index].inEdit = state;
      this.tabledata = [...this.tabledata]
    },

    // editInput change
    changeEditInput(value,index,col){
      this.tabledata[index][col] = value;
    },

    // 日期编辑列
    changeDataEdit(args,index,col){
      this.tabledata[index][col] = args[1];
    },

    // searchSelect搜索过滤
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    // 可搜索编辑列
    changeSearchSelectEdit(args,index,col,itemChildren){
      itemChildren.forEach(item => {
        if(item.itemCode === args[0]){
          this.tabledata[index][col].name = item.itemName;
        }
      })
    },
    // 地址编辑列
    changeAddressEdit(args,index,col){
      let addressName = '';
      args[1].forEach(item => {
        addressName += " " + item.name
      })
      this.tabledata[index][col].name = addressName;
    },
    

  },


  computed:{
    editCol:function(){
      return this.editableCol && this.editableCol.length > 0 ? [...this.editableCol] : [];
    },
    address(){
      return address;
    }
  }
};
</script>

<style scoped>

.viewContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
}
.editViewContainer{
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
}
.organ_tree {
  width: 14%;
  min-width: 170px;
  height: 100%;
  float: left;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding: 10px 12px;
}

.viewContent,
.noviewContent {
  height: 100%;
  float: right;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.viewContent {
  width: 86%;
  max-width: calc(100% - 170px);
}

.noviewContent {
  width: 100%;
}
.tableLink {
  color: #2d8cf0;
}
.pagination_view {
  margin: 20px;
  display: flex;
  justify-content: flex-end;
}

.tdOverflow{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  display: inline-block;
  max-width: 300px;
}

.tableCon{
  flex: 1;
  /* overflow-y: hidden; */
}
.tableCon .ant-table-wrapper{
  height: 100%;
}
.tableImg{
  height: 50px;
}
.tableImg>img{
  height: 100%;
}
.addBtn{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 17px;
  box-sizing: border-box;
  cursor: pointer;
}
.actionContainer{
  display: flex;
  justify-content: center;
  align-items: center;
}
.editAble{
  display: flex;
}
.editInput{
  text-align: center;
}
.redSpan{
  margin-left: 5px;
  color: red;
}
</style>