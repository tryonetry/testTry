<!-- template -->
<template>
<div class="outer" >
    <TableView
        :initArrData="initArr"
        :totalCount="tableTotalNum"
        @searchTable="getTableData"
        :loading="tableLoading"
    >

        <!-- tableFormSearch里添加其他按钮 -->
        <span slot="formAction">
            <a-button class="buttonOperate" type="primary" @click="bundleAdd">新 增</a-button>
        </span>

        <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
        <div slot="tableAction" slot-scope="slotPropsData">
            <a
                href="javascript:;"
                @click="previewPrint(slotPropsData.currRowdata)"
                class="primaryBtnColor"
            >预览打印</a>
            <a
                href="javascript:;"
                @click="previewEdit(slotPropsData.currRowdata)"
            >预览编辑</a>
            <a-popconfirm
                title="确定删除吗?"
                okText="确定"
                cancelText="取消"
                @confirm="deleteFun(slotPropsData.currRowdata.id)"
            >
                <a href="javascript:;" class="errorBtnColor">删除</a>
            </a-popconfirm>
        </div>
    </TableView>

    <!-- 预览编辑弹层 -->
    <div class="previewEditModal">
        <a-modal
            centered
            :visible="editVisiable"
            @cancel="handleCancel"
            :width="'50%'"
            style="height:40%;overflow: hidden;"
            :maskClosable='false'
        >
            <template slot="footer">
                <a-button key="back" @click="handleCancel">取 消</a-button>
                <a-button key="submit" type="primary" :loading='saveEditLoading' @click="saveEdit">保 存</a-button>
            </template>
            <!-- title -->
            <div slot="title" class="titleSlot">
                <p>预览编辑</p>
                <span>{{currRow && currRow.name}}</span>
            </div>

            <div class="editModalForm">
                <TableFromSearch :formDataArr='editFormData' :layout='editModal' ref="editForm"></TableFromSearch>
            </div>
        </a-modal>
    </div>

    <!-- 新增弹层 -->
    <div class="addEditModal">
        <a-modal
            centered
            title="新增商调函"
            :visible="addVisiable"
            @cancel="handleCancel"
            :width="'80%'"
            style="height:70%;overflow: hidden;"
            :maskClosable='false'
        >
            <template slot="footer">
                <a-button key="back" @click="resetForm">重 置</a-button>
                <a-button key="submit" type="primary" :loading='saveAddLoading' @click="saveAdd">保 存</a-button>
            </template>

            <div class="addModalForm">
                <TableFromSearch :formDataArr='addFormData' :layout='addModal' ref="addForm"></TableFromSearch>
            </div>
        </a-modal>
    </div>

    <!-- 打印弹层 -->
    <div class="printEditModal">
        <a-modal
            centered
            title="预览打印"
            :visible="printVisiable"
            @cancel="handleCancel"
            :width="'80%'"
            style="height:95%;overflow: hidden;"
            :maskClosable='false'
        >
            <template slot="footer">
                <a-button key="back" @click="handleCancel">取 消</a-button>
                <a-button key="submit" type="primary" :loading='saveAddLoading' @click="print">打 印</a-button>
            </template>

            <!-- 打印模板 -->
            <TemplateOfPrint :fileNum="fileNum" :firstTitle="firstTitle" :secondTitle="secondTitle" ref="print">
                <div slot="printContent" class="printContent">
                    <p><span class="redSpan redUL" style="width:200px;display:inline-block;">{{currRow && currRow.ycdjg}}</span><span class="redSpan">:</span></p>
                    <p class="indent">现在你处的<span class="redSpan">{{currRow && currRow.name}}</span>同志（身份证号:<span class="redSpan">{{currRow && currRow.idNum}}</span>），要求（委托存档/调出档案），经研究请按下列第（<input type="text" v-model="printData.selectOption" style="width:100px;"/>）项办理。</p>
                    <p class="indent">一、如同意调出，请将该同志人事档案、现实表现等材料通过机要转递寄来。档案需装订成册、有完整档案目录，请附档案转递通知单。</p>
                    <p class="indent">二、同意调入，请办理调动手续，于<input type="text" v-model="printData.year" style="width:80px;"/>年<input type="text" v-model="printData.month" style="width:40px;"/>月<input type="text" v-model="printData.day" style="width:40px;"/>日前介绍到我中心报到。</p>
                    <p class="indent">三、经研究同意调出档案，你处能否接收，请复函。</p>
                    <p class="indent">四、经研究，暂不同意调出档案，特此函告。</p>
                    <p class="indent">五、</p>
                    <div class="bottom">
                        <div class="bottomRight">
                            <p>{{nowData}}</p>
                        </div>
                        <div class="commonFont clear" style="margin-bottom:20px;font-size:16px;">
                            <p>档案寄往：江西省人才流动中心（代理服务部收）</p>
                            <p>地&nbsp;&nbsp;址：南昌市二七北路266号</p>
                            <p>邮&nbsp;&nbsp;编：330046</p>
                            <p>电&nbsp;&nbsp;话：0791-86371944</p>
                            <p>到档查询：http://news.jxrcw.com/rsdl/ddxx.asp</p>
                        </div>
                        <div class="otherDashCont">
                            <p style="font-size:14px;font-weight:bold;text-align:center">请沿此线剪下，将线下部分贴于档案背面，否则不予接收，谢谢配合！</p>
                            <div class="bottomRight">
                                <span class="redSpan" style="font-size:22px;font-weight:bold;">NO: {{fileNum}}</span>
                            </div>
                            <div class="dashCont clear">
                                <p>档案人姓名: <span class="redSpan">{{currRow && currRow.name}}</span></p>
                                <p>{{nowData}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </TemplateOfPrint>
        </a-modal>
    </div>

</div>
</template>

<script>

// 委托单位名称 To 委托单位编号
function companyNameToNum(codeVal){
  // console.log(codeVal)
  if(codeVal){
    return [
      {name:'val',data:codeVal},
      {name:'disabled',data:true}
    ]
  }
  return [{name:'val',data:''},{name:'disabled',data:false}]
}

// 委托单位编号 To 委托单位名称
function companyNumToName(numVal){
  if(numVal || String(numVal) === '0'){
    return [
      {name:'val',data:numVal},
      {name:'disabled',data:true},
      {name:'tip',data:'* 抱歉,尚未找到对应编号的公司'}
    ]
  }else{
    return [
      {name:'val',data:''},
      {name:'disabled',data:false},
      {name:'tip',data:'* 请选择委托存档单位名称'},
      {name:'status',data:void 0},
    ]
  }
}

import moment from "moment";
import TemplateOfPrint from '@/components/templateOfPrint';
import TableView from "@/components/tableView";
import TableFromSearch from "@/components/tableFormSearch";
export default {
    name:"ProveBusinessletter",
    //import引入的组件需要注入到对象中才能使用
    components: { TableView,TableFromSearch,TemplateOfPrint},
    props:[""],

    data() {
        return {
                            
            tableTotalNum: 0,   //总页数：默认为0
            tempCondition:null,
            tableLoading:false,
            // tableView传值方式
            initArr:{
                treeflag: false,   //左侧tree是否存在
                tableCheck: false, //table是否可以check
                // formInputs 传值方式
                formData: {
                    //forminputs data
                    formInputs:[

                        //input
                        {
                            title: '姓名',
                            type: "text",
                            required: false,
                            placeholder: "请输入姓名",
                            key: "name",
                            name: "name",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'name',
                            status: '',
                        },
                        {
                            title: '身份证/社保卡号',
                            type: "text",
                            required: false,
                            placeholder: "请输入身份证/社保卡号",
                            key: "idNum",
                            name: "idNum",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'idNum',
                            status: '',
                        },
                        {
                            title: '委托存档单位名称',
                            otherType: 'searchSelect',
                            required: false,
                            placeholder: "请选择委托存档单位名称",
                            key: 'dwmcId',
                            name: 'dwmcId',
                            val: void 0,
                            children: [],
                            status: '',
                        },
                        {
                            title: '委托存档单位编号',
                            type: "text",
                            required: false,
                            placeholder: "请输入委托存档单位编号",
                            key: "dwmcNum",
                            name: "dwmcNum",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'dwmcNum',
                            status: '',
                        },
                        // select/searchSelect
                        
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
                        scopedSlots: { customRender: "cursorTitle" }   //鼠标滑上去tip显示当前，不写的话则不显示
                    },
                    {
                        title: "姓名",
                        dataIndex: "name",
                        key: "name",
                        fixed: "left",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "身份证号",
                        dataIndex: "idNum",
                        key: "idNum",
                        fixed: "left",
                        width: 250,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "联系电话",
                        dataIndex: "dabh",
                        key: "dabh",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "人才函字",
                        dataIndex: "wrchz",
                        key: "wrchz",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "原存档机构",
                        dataIndex: "ycdjg",
                        key: "ycdjg",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "开具日期",
                        dataIndex: "kjDate",
                        key: "kjDate",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "委托存档单位名称",
                        dataIndex: "dwmc",
                        key: "dwmc",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "委托存档单位编号",
                        dataIndex: "dwbh",
                        key: "dwbh",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "工作单位名称",
                        dataIndex: "fzdw",
                        key: "fzdw",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "操作人",
                        dataIndex: "inputPerson",
                        key: "inputPerson",
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "操作",
                        key: "action",
                        width: 200,
                        fixed:"right",
                        scopedSlots: { customRender: "action" }
                    }
                ],
                // table数据
                tabledataArr: [],
            },
            editVisiable:false,
            addVisiable:false,
            printVisiable:false,
            saveEditLoading:false,
            saveAddLoading:false,
            talentWord:'',
            currRow:null,
            // 编辑 form 数据
            editFormData:{
                formInputs: [
                    {
                        title: '姓名',
                        type: "text",
                        required: true,
                        placeholder: "请输入姓名",
                        key: "name",
                        name: "name",
                        val: void 0,
                        postname: "name",
                        maxlength: 20,
                        minlength: 0,
                        reg: '',
                        tip: '* 请输入正确的邮寄编号',
                        status: '',
                        colWidth:[24,24],
                    },
                    {
                        title: '身份证/社保卡号',
                        type: "text",
                        required: true,
                        placeholder: "请输入身份证/社保卡号",
                        key: "idNum",
                        name: "idNum",
                        val: void 0,
                        postname: "idNum",
                        maxlength: 18,
                        minlength: 15,
                        reg: 'testid',
                        tip: '* 请输入正确格式的身份证/社保卡号',
                        status: '',
                        colWidth:[24,24],
                    },
                    {
                        title: '原存档机构',
                        type: "text",
                        required: true,
                        placeholder: "请输入原存档机构名称",
                        key: "ycdjg",
                        name: "ycdjg",
                        val: void 0,
                        postname: "ycdjg",
                        maxlength: 50,
                        minlength: 0,
                        reg: '',
                        tip: '* 请输入原存档机构名称',
                        status: '',
                        colWidth:[24,24],
                    },
                ]
            },
            // 添加 form 数据
            addFormData:{
                formInputs: [
                    {
                        title: '姓名',
                        type: "text",
                        required: true,
                        placeholder: "请输入姓名",
                        key: "name",
                        name: "name",
                        val: void 0,
                        postname: "name",
                        maxlength: 20,
                        minlength: 0,
                        reg: '',
                        tip: '* 请输入正确的邮寄编号',
                        status: '',
                        colWidth:[12,24],
                    },
                    {
                        title: '身份证/社保卡号',
                        type: "text",
                        required: true,
                        placeholder: "请输入身份证/社保卡号",
                        key: "idNum",
                        name: "idNum",
                        val: void 0,
                        postname: "idNum",
                        maxlength: 18,
                        minlength: 15,
                        reg: 'testid',
                        tip: '* 请输入正确格式的身份证/社保卡号',
                        status: '',
                        colWidth:[12,24],
                    },
                    {
                        title: '联系电话',
                        type: "text",
                        required: false,
                        placeholder: "请输入联系电话",
                        key: "dabh",
                        name: "dabh",
                        val: void 0,
                        postname: "dabh",
                        maxlength: 11,
                        minlength: 11,
                        reg: 'testMobile',
                        tip: '* 请输入正确格式的电话号码',
                        status: '',
                        colWidth:[12,24],
                    },
                    {
                        title: '开具日期',
                        otherType: "date",
                        required: false,
                        disabled:true,
                        placeholder: "请选择开具日期",
                        key: "kjDate",
                        name: "kjDate",
                        val: moment(new Date()),
                        postname: "kjDate",
                        reg: '',
                        tip: '* 请选择开具日期',
                        status: '',
                        colWidth:[12,24],
                    },
                    {
                        title: '委托存档单位名称',
                        otherType: 'searchSelect',
                        required: false,
                        placeholder: "请选择委托存档单位名称",
                        key: 'companyId',
                        name: 'companyId',
                        val: void 0,
                        children: [],
                        status: '',
                        colWidth:[12,24],
                        connectTo:['companyNum'], //关联到委托单位编号
                        connectToFun:[companyNameToNum],
                    },
                    {
                        title: '委托存档单位编号',
                        type: "text",
                        required: false,
                        placeholder: "请输入委托存档单位编号",
                        key: "companyNum",
                        name: "companyNum",
                        val: void 0,
                        maxlength: 20,
                        minlength: 0,
                        reg: '',
                        tip: '',
                        postname:'companyNum',
                        status: '',
                        colWidth:[12,24],
                        connectTo:['companyId'], //关联到委托单位名称
                        connectToFun:[companyNumToName], 
                    },
                    {
                        title: '工作单位名称',
                        type: "text",
                        required: false,
                        placeholder: "请输入工作单位名称",
                        key: "fzdw",
                        name: "fzdw",
                        val: void 0,
                        postname: "fzdw",
                        maxlength: 50,
                        minlength: 0,
                        reg: '',
                        tip: '* 请输入工作单位名称',
                        status: '',
                        colWidth:[12,24],
                    },
                    {
                        title: '人才函字',
                        type: "text",
                        required: false,
                        disabled:true,
                        placeholder: "请输入人才函字",
                        key: "wrchz",
                        name: "wrchz",
                        val: void 0,
                        postname: "wrchz",
                        maxlength: 30,
                        minlength: 0,
                        reg: 'testNumAndChar',
                        tip: '* 请输入正确的人才函字',
                        status: '',
                        colWidth:[12,24],
                    },
                    {
                        title: '原存档机构',
                        type: "text",
                        required: true,
                        placeholder: "请输入原存档机构名称",
                        key: "ycdjg",
                        name: "ycdjg",
                        val: void 0,
                        postname: "ycdjg",
                        maxlength: 50,
                        minlength: 0,
                        reg: '',
                        tip: '* 请输入原存档机构名称',
                        status: '',
                        colWidth:[12,24],
                    },
                    {
                        title: '转递原因',
                        otherType: "textarea",
                        required: false,
                        placeholder: "请输入转递原因",
                        key: "zdyy",
                        name: "zdyy",
                        val: void 0,
                        postname: "zdyy",
                        maxlength: 200,
                        minlength: 0,
                        reg: '',
                        tip: '* 请输入转递原因',
                        status: '',
                    },
                    
                ]
            },
            // sendModal 布局
            editModal:{
                defaultCon: {
                    labelCol: {
                        sm: { span: 4 },
                        xl: { span: 4 },
                        xxl: { span: 4 }
                    },
                    wrapperCol: {
                        sm: { span: 18 },
                        xl: { span: 18 },
                        xxl: { span: 18 }
                    }
                },
            },
            addModal:{
                defaultCon: {
                labelCol: {
                    sm: { span: 6 },
                    xl: { span: 6 },
                    xxl: { span: 6 }
                },
                wrapperCol: {
                    sm: { span: 18 },
                    xl: { span: 16 },
                    xxl: { span: 16 }
                }
                },
                textareaCon: {
                labelCol: {
                    sm: { span: 6 },
                    xl: { span: 6 },
                    xxl: { span: 3 }
                },
                wrapperCol: {
                    sm: { span: 18 },
                    xl: { span: 16 },
                    xxl: { span: 20 }
                }
                },
            },

            fileNum:'360000A180000318',
            firstTitle:'江西省人才流动中心',
            secondTitle:'调(档)函',
            nowData:moment(new Date()).format("YYYY年MM月DD日"),
            printData:{
                selectOption:"",
                year:"",
                month:"",
                day:"",
            },
        };
    },

    //监听属性 类似于data概念
    computed: {
        companyList:function(){
            if(this.$store.getters.getCompanyData){
                this.handleCompanyList(this.$store.getters.getCompanyData)
                return this.$store.getters.getCompanyData;
            }else{
                return null;
            }
        }
    },

    //监控data中的数据变化
    watch: {
        companyList:{
           handler:function(newVal){
               this.handleCompanyList(newVal)
           },

           deep:true,//深度监听
        }
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
            this.$http.fetchPost('businessLetter@getBusinessLetterList.action',{
                page: pageNum,
                limit: limitNum,
                ...condition
            }).then((res)=>{
                if(Number(res.code) === 0){
                    this.tableTotalNum = res.count;
                    this.initArr.tabledataArr = res.data;
                    this.initArr.tabledataArr.forEach((element, index) => {
                        let tempState = String(element.transferOutState);
                        Object.assign(element,{
                            key:element.id,
                            num: (pageNum - 1) * limitNum + index + 1,
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

        // 公司列表处理
        handleCompanyList(data){
            // console.log(data)
            let tempCompanylist = [];
            data.forEach( company => {
                // attention ! code - id
                tempCompanylist.push({itemName:company.companyName,itemCode: company.id,itemId:company.companyNumber});
            });
            this.initArr.formData.formInputs.forEach(item => {
                if(item.name === 'dwmcId'){
                    Object.assign(item,{children:tempCompanylist})
                }
            });
            this.addFormData.formInputs.forEach(item => {
                if(item.name === 'companyId'){
                    Object.assign(item,{children:tempCompanylist})
                }
            });
        },
        
        // 预览编辑
        previewEdit(currRowdata){
            this.editVisiable = true;
            this.currRow = currRowdata;
            this.editFormData.formInputs.forEach(item => {
                Object.assign(item,{
                    val:currRowdata[item.name],
                    status:void 0,
                })
            })
        },

        // click 新增
        bundleAdd(){
            const _this = this;
            this.$http.fetchPost('businessLetter@businessLetterAddForWrchz.action',null)
                .then(res => {
                    if(Number(res.code) === 0){
                        _this.addFormData.formInputs.forEach(item => {
                            if(item.name === 'wrchz'){
                                Object.assign(item,{val:res.data.wrchz});
                            }
                        });
                        _this.addVisiable = true;
                        _this.resetForm();
                    }else{
                        _this.$message.error('抱歉,网络错误,请稍后重试');
                    }
                })
                .catch(err => {
                    _this.$message.error('抱歉,网络错误,请稍后重试');
                })
            
        },

        // cancel
        handleCancel(){
            this.editVisiable = false;
            this.addVisiable = false;
            this.printVisiable = false;
        },

        // 保存编辑
        saveEdit(){
            const _this = this;
            let result = this.$refs.editForm.getFormData();
            if(result.isRight){
                this.saveEditLoading = true;
                this.$http.fetchPost('businessLetter@editBusinessLetter.action',{...result.postObj,id:this.currRow.id})
                .then(res => {
                    // console.log(res);
                    if(Number(res.code) === 0){
                        _this.$message.success('保存成功!');
                        _this.getTableData(_this.tempCondition,1,10);
                        _this.editVisiable = false;
                    }else{
                        _this.$message.warning('抱歉,保存失败,请重试');
                    }
                })
                .catch(err => {
                    _this.$message.error('抱歉,网络异常,请稍后重试');
                })
                .finally(end => {
                    _this.saveEditLoading = false;
                })
            }
        },

        // 新增保存
        saveAdd(){
            const _this = this;
            let result = this.$refs.addForm.getFormData();
            if(result.isRight){
                this.saveAddLoading = true;
                this.$http.fetchPost('businessLetter@insertBusinessLetter.action',{...result.postObj,dwmc:result.postObj.companyId+','+result.postObj.companyNum})
                .then(res => {
                    // console.log(res);
                    if(Number(res.code) === 0){
                        _this.$message.success('保存成功!');
                        _this.getTableData(_this.tempCondition,1,10);
                        _this.addVisiable = false;
                    }else{
                        _this.$message.warning('抱歉,保存失败,请重试');
                    }
                })
                .catch(err => {
                    _this.$message.error('抱歉,网络异常,请稍后重试');
                })
                .finally(end => {
                    _this.saveAddLoading = false;
                })
            }
        },

        // 新增重置
        resetForm(){
            this.addFormData.formInputs.forEach(item => {
                if(item.name !== 'wrchz' && item.name !== 'kjDate'){
                    Object.assign(item,{
                        val:void 0,
                        status:void 0,
                        disabled:false,
                    })
                }
                
            })
        },

        // 删除
        deleteFun(id){
            const _this = this;
            if(id){
                this.$http.fetchPost('businessLetter@deleteBusinessLetter.action',{id,})
                    .then(res => {
                        if(Number(res.code) === 0){
                            _this.$message.success('删除成功!');
                            _this.getTableData(_this.tempCondition,1,10);
                        }else{
                            _this.$message.warning('抱歉,删除失败,请重试');
                        }
                        
                    })
                    .catch(err => {
                        _this.$message.error('抱歉,网络异常,请稍后重试!');
                    })
            }
        },

        // 预览打印
        previewPrint(currRowdata){
            this.printVisiable = true;
            this.currRow = currRowdata;
        },

        // 打印
        print(){
            this.$refs.print.printFun();
            // this.$http.fetchPost('archPrintProof@findBusinessLetter.action',{name:'1'})
            //     .then(res => {
            //         console.log(res);
            //     })
        },
    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.getTableData(null,1,10);
    },

    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        
    },

    beforeCreate() {}, //生命周期 - 创建之前

    beforeMount() {}, //生命周期 - 挂载之前

    beforeUpdate() {}, //生命周期 - 更新之前

    updated() {}, //生命周期 - 更新之后

    beforeDestroy() {}, //生命周期 - 销毁之前

    destroyed() {}, //生命周期 - 销毁完成

    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发

}

</script>

<style scoped>
.editModalForm,.addModalForm{
    padding-top: 10px;
    height: 100%;
    overflow-y: auto;
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
.otherDashCont{
    border-top: 2px dashed #333333;
}
.dashCont{
    display: flex;
    justify-content: space-between;
}
</style>