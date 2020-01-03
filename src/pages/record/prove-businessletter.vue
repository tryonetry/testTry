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
                :class="printLoading ? 'canNotClickBtnColor':'primaryBtnColor'"
            >预览打印</a>
            <a
                href="javascript:;"
                @click="previewEdit(slotPropsData.currRowdata)"
            >编辑</a>
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
            :width="'80%'"
            style="height:70%;overflow: hidden;"
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
                <div slot="printContent" style="color: #000" class="printContent">
                    <p style="font-size: 21px;"><span class="redSpan redUL" style="display:inline-block;padding: 0 10px 0 0;">{{currRow && currRow.ycdjg}}</span><span class="redSpan printConFontWeight" style="padding: 0px;font-size: 25px;">:</span></p>
                    <p class="indent" style="margin-bottom: 0;font-size: 22px"><span class="redSpan redUL" style="padding: 0 10px 0 0;">{{currRow && currRow.name}}</span>同志（身份证号:<span class="redSpan redUL printConNumFontFamily" style="padding: 0 10px 0 0;margin-left: 10px;">{{currRow && currRow.idNum}}</span>），已申请委托我单位管理档案。根据中组部、人社部等五部门《关于进一步加强流动人员人事档案管理服务工作的通知》（人社部发〔<span class="printConNumFontFamily">2014</span>〕<span class="printConNumFontFamily">90</span>号）和人社部办公厅《关于简化优化流动人员人事档案管理服务的通知》（人社厅发〔<span class="printConNumFontFamily">2016</span>〕<span class="printConNumFontFamily">75</span>号）文件规定，如同意，请将其人事档案通过机要渠道转递至我单位。</p>
                    <p class="indent" style="margin: 0;font-size:22px;"><span class="printConFontWeight" style="font-size:22px;">注：</span><span class="indent" style="font-size:22px;"><span class="printConNumFontFamily">1.</span>转来的档案需装订成册、有完整档案目录。</span></p>
                    <p class="indent" style="margin-top: 0;"><span style="margin-left: 40px;font-size:22px;"><span class="printConNumFontFamily">2.</span>请附档案转递通知单。</span></p>
                    <div v-html="nowData" style="display:flex; justify-content: flex-end;margin-right:35px;margin-top: 20px;">

                    </div>

                    <!-- 二维码 -->
                    <div class="currErweima">
                        <div style="width:120px;height:100px;">
                            <img :src="erweimaPath" alt="二维码" style="width: 100px;height:100px;"/>
                        </div>
                        <div style="display: flex;flex-direction: column;justify-content: space-between;font-weight: bold;font-size: 21px">
                            <div>机要地址：<span v-html="loginData['orgAddress']"></span></div>
                            <div>邮<span style="margin-left:41px;">编：<span class="printConNumFontFamily">{{loginData.orgPostalCode}}</span></span></div>
                            <div>电<span style="margin-left:41px;">话：<span class="printConNumFontFamily">{{loginData.orgPhone}}</span></span></div>

                        </div>
                        
                    </div>
                    <div class="otherDashCont">
                        <p style="font-size:14px;font-weight:bold;text-align:center">请沿此线剪下，将线下部分贴于档案正面，便于我们接收，谢谢！</p>
                        <!-- <div class="bottomRight">
                            <span class="redSpan" style="font-size:22px;font-weight:bold;">NO: {{fileNum}}</span>
                        </div> -->
                        <div style="font-size: 30px;font-weight: bold;margin-bottom: 15px;margin-top:20px;font-weight: bold;">
                            <p style="letter-spacing: 2px;font-family: '仿宋';" v-html="loginData['orgAddress']"></p>
                            <p style="font-family: '仿宋';">{{firstTitle}}<span style="margin-left: 20px;font-family: '仿宋';">代理服务部收</span></p>
                        </div>
                        <div class="dashCont clear">
                            <p>档案人姓名: <span class="redSpan printConFontWeight redUL" style="padding:0 10px 0 0;margin-left:10px;">{{currRow && currRow.name}}</span></p>
                            <!-- <p>{{nowData}}</p> -->
                            <p>调档函编号：<span class="redSpan redUL printConFontWeight printConNumFontFamily" style="padding:0 10px 0 0;margin-left:5px;">{{fileNum}}</span></p>
                        </div>
                    </div>
                </div>
                <div v-if="false" slot="printContentDispatch" style="color: #000" class="printContent">
                    <p style="font-size: 21px;"><span class="redSpan redUL" style="display:inline-block;padding: 0 10px 0 0;">{{currRow && currRow.ycdjg}}</span><span class="redSpan printConFontWeight" style="padding: 0px;font-size: 25px;">:</span></p>
                    <p class="indent" style="margin-bottom: 0;font-size: 22px">兹有贵单位<span class="redSpan redUL" style="padding: 0 10px 0 0;">{{currRow && currRow.name}}</span>（身份证号:<span class="redSpan redUL printConNumFontFamily" style="padding: 0 10px 0 0;margin-left: 10px;">{{currRow && currRow.idNum}}</span>），已被聘为江西省人力资源有限公司派遣员工，并签订劳动合同，现特发此函至贵处，拟调该同志的人事档案。请将其人事档案与人事关系于<span class="printConNumFontFamily">2020</span>年<span class="printConNumFontFamily">1</span>月<span class="printConNumFontFamily">19</span>日前通过机要途径转至我中心。为荷。</p>

                    <div v-html="nowData" style="display:flex; justify-content: flex-end;margin-right:35px;margin-top: 20px;">

                    </div>

                    <!-- 二维码 -->
                    <div class="currErweima">
                        <div style="width:120px;height:100px;">
                            <img :src="erweimaPath" alt="二维码" style="width: 100px;height:100px;"/>
                        </div>
                        <div style="display: flex;flex-direction: column;justify-content: space-between;font-weight: bold;font-size: 21px">
                            <div>机要地址：<span v-html="loginData['orgAddress']"></span></div>
                            <div>邮<span style="margin-left:41px;">编：<span class="printConNumFontFamily">{{loginData.orgPostalCode}}</span></span></div>
                            <div>电<span style="margin-left:41px;">话：<span class="printConNumFontFamily">{{loginData.orgPhone}}</span></span></div>

                        </div>
                        
                    </div>
                    <div class="otherDashCont">
                        <p style="font-size:14px;font-weight:bold;text-align:center">请沿此线剪下，将线下部分贴于档案正面，便于我们接收，谢谢！</p>
                        <!-- <div class="bottomRight">
                            <span class="redSpan" style="font-size:22px;font-weight:bold;">NO: {{fileNum}}</span>
                        </div> -->
                        <div style="font-size: 30px;font-weight: bold;margin-bottom: 55px;margin-top:35px;font-weight: bold;">
                            <p style="letter-spacing: 2px;font-family: '仿宋';" v-html="loginData['orgAddress']"></p>
                            <p style="font-family: '仿宋';">{{firstTitle}}<span style="margin-left: 20px;font-family: '仿宋';">档案室收</span></p>
                        </div>
                        <div class="dashCont clear">
                            <p>档案人姓名: <span class="redSpan printConFontWeight redUL" style="padding:0 10px 0 0;margin-left:10px;">{{currRow && currRow.name}}</span></p>
                            <!-- <p>{{nowData}}</p> -->
                            <p>调档函编号：<span class="redSpan redUL printConFontWeight printConNumFontFamily" style="padding:0 10px 0 0;margin-left:5px;">{{fileNum}}</span></p>
                            <p>单位：<span class="redSpan redUL printConFontWeight printConNumFontFamily" style="padding:0 10px 0 0;margin-left:5px;">调档函编号</span></p>
                        </div>
                    </div>
                </div>
            </TemplateOfPrint>
        </a-modal>
    </div>

</div>
</template>

<script>
import utils from "../../utils/util.js";
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
import { constants } from 'crypto';
export default {
    name:"ProveBusinessletter",
    //import引入的组件需要注入到对象中才能使用
    components: { TableView,TableFromSearch,TemplateOfPrint},
    props:[""],

    data() {
        return {
            loginData: JSON.parse(sessionStorage.getItem('loginData'))['loginUser'],                
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
                            title: '公民身份号码/社保卡号',
                            type: "text",
                            required: false,
                            placeholder: "请输入公民身份号码/社保卡号",
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
                        title: "公民身份号码/社保卡号",
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
                        title: "委托存档单位编号",
                        dataIndex: "dwbh",
                        key: "dwbh",
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
                        tip: '* 请输入姓名',
                        status: '',
                        colWidth:[12,24],
                    },
                    {
                        title: '公民身份号码/社保卡号',
                        type: "text",
                        required: true,
                        placeholder: "请输入公民身份号码/社保卡号",
                        key: "idNum",
                        name: "idNum",
                        val: void 0,
                        postname: "idNum",
                        maxlength: 18,
                        minlength: 15,
                        reg: 'testid',
                        tip: '* 请输入正确格式的公民身份号码/社保卡号',
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
                        tip: '* 请输入正确格式的联系电话',
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
                        title: '委托存档单位编号',
                        type: "text",
                        required: false,
                        placeholder: "请输入委托存档单位编号",
                        key: "dwbh",
                        name: "dwbh",
                        val: void 0,
                        maxlength: 20,
                        minlength: 0,
                        reg: '',
                        tip: '',
                        postname:'dwbh',
                        status: '',
                        colWidth:[12,24],
                        connectTo:['dwmc'], //关联到委托单位名称
                        connectToFun:[companyNumToName], 
                    },
                    {
                        title: '委托存档单位名称',
                        otherType: 'searchSelect',
                        required: false,
                        placeholder: "请选择委托存档单位名称",
                        key: 'dwmc',
                        name: 'dwmc',
                        val: void 0,
                        children: [],
                        status: '',
                        colWidth:[12,24],
                        connectTo:['dwbh'], //关联到委托单位编号
                        connectToFun:[companyNameToNum],
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
                        title: '原存档单位名称',
                        type: "text",
                        required: true,
                        placeholder: "请输入原存档单位名称",
                        key: "ycdjg",
                        name: "ycdjg",
                        val: void 0,
                        postname: "ycdjg",
                        maxlength: 50,
                        minlength: 0,
                        reg: '',
                        tip: '* 请输入原存档单位名称',
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
                        title: '公民身份号码/社保卡号',
                        type: "text",
                        required: true,
                        placeholder: "请输入公民身份号码/社保卡号",
                        key: "idNum",
                        name: "idNum",
                        val: void 0,
                        postname: "idNum",
                        maxlength: 18,
                        minlength: 15,
                        reg: 'testid',
                        tip: '* 请输入正确格式的公民身份号码/社保卡号',
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
                        tip: '* 请输入正确格式的联系电话',
                        status: '',
                        colWidth:[12,24],
                    },
                    {
                        title: '开具日期',
                        otherType: "date",
                        required: false,
                        // disabled:true,
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
                    // {
                    //     title: '人才函字',
                    //     type: "text",
                    //     required: false,
                    //     disabled:true,
                    //     placeholder: "请输入人才函字",
                    //     key: "wrchz",
                    //     name: "wrchz",
                    //     val: void 0,
                    //     postname: "wrchz",
                    //     maxlength: 30,
                    //     minlength: 0,
                    //     reg: 'testNumAndChar',
                    //     tip: '* 请输入正确的人才函字',
                    //     status: '',
                    //     colWidth:[12,24],
                    // },
                    {
                        title: '原存档单位名称',
                        type: "text",
                        required: true,
                        placeholder: "请输入原存档单位名称",
                        key: "ycdjg",
                        name: "ycdjg",
                        val: void 0,
                        postname: "ycdjg",
                        maxlength: 50,
                        minlength: 0,
                        reg: '',
                        tip: '* 请输入原存档单位名称',
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
                        sm: { span: 8 },
                        xl: { span: 8 },
                        xxl: { span: 8 }
                    },
                    wrapperCol: {
                        sm: { span: 16 },
                        xl: { span: 16 },
                        xxl: { span: 16 }
                    }
                },
            },
            addModal:{
                defaultCon: {
                    labelCol: {
                        sm: { span: 8 },
                        xl: { span: 8 },
                        xxl: { span: 8 }
                    },
                    wrapperCol: {
                        sm: { span: 16 },
                        xl: { span: 16 },
                        xxl: { span: 16 }
                    }
                },
                textareaCon: {
                    labelCol: {
                        sm: { span: 8 },
                        xl: { span: 8 },
                        xxl: { span: 4 }
                    },
                    wrapperCol: {
                        sm: { span: 16 },
                        xl: { span: 16 },
                        xxl: { span: 20 }
                    }
                },
            },

            fileNum:'',
            firstTitle: JSON.parse(sessionStorage.getItem('loginData')).loginUser['orgName'],
            secondTitle:'调档函',
            nowData:moment(new Date()).format("YYYY年MM月DD日"),
            printLoading:false,
            printData:{
                selectOption:"",
                year:"",
                month:"",
                day:"",
            },
            erweimaPath: '',  //二维码路径
            printCount: 0,
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
                orgName: JSON.parse(sessionStorage.getItem('loginData')).loginUser['orgName'],
                ...condition
            }).then((res)=>{
                if(Number(res.code) === 0){
                    // this.erweimaPath = this.$targetHost + 'weixin/111.jpg';
                    let tempPathArr =  res.savePath.split('/');
                    this.erweimaPath = this.$targetHost + tempPathArr[tempPathArr.length-2] + '/' + tempPathArr[tempPathArr.length -1];
                    
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
            
            this.editFormData.formInputs.forEach(item => {
                if(item.name === 'dwmc'){
                    Object.assign(item,{children:tempCompanylist})
                }
            });
        },
        
        // 预览编辑
        previewEdit(currRowdata){
            this.editVisiable = true;
            this.currRow = currRowdata;
            this.editFormData = utils.getNewFormSearch(currRowdata, this.editFormData)
            // this.editFormData.formInputs.forEach(item => {
            //     Object.assign(item,{
            //         val:currRowdata[item.name],
            //         status:void 0,
            //     })
            // })
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
                this.$http.fetchPost('businessLetter@insertBusinessLetter.action',{
                    ...result.postObj,
                    // dwmc:result.postObj.companyId+','+result.postObj.companyNum
                    dwmc: result.postObj.companyId,   //名称
                    dwbh: result.postObj.companyNum   //编号
                })
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

            if(this.printLoading) return;
            this.printLoading = true;
            this.currRow = currRowdata;
            if(currRowdata.id){
                this.$http.fetchPost('businessLetter@businessLetterPrint.action',{id:currRowdata.id})
                .then(res => {
                    if(Number(res.code) === 0){
                        this.fileNum = res.data.dueBillSerialNumber
                        this.printVisiable = true;
                    }else{
                        this.$message.warning("获取信息失败,请重试");
                    }
                }).catch(err => {
                    this.$message.error("抱歉,网络异常,请稍后重试");
                }).finally(end => {
                    this.printLoading = false;
                })
            }
            
        },

        // 打印
        print(){
            if(this.printCount === 0){
                this.$refs.print.printFun();
                this.printCount ++;
            } else{
                this.$refs.print.printOtherFun();
            }
        },
    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        
        this.nowData = this.commonFun.toNumberFontFamily(this.nowData, 'printConNumFontFamily'); // 日期中数字字体设置
        this.loginData['orgAddress'] = this.commonFun.toNumberFontFamily(this.loginData['orgAddress'], 'printConNumFontFamily'); 
        // this.getTableData(null,1,10);
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
.otherDashCont{
    border-top: 2px dashed #333333;
}
.dashCont{
    display: flex;
    justify-content: space-between;
    /* font-weight: bold; */
}

.currErweima{
    margin: 60px 0;
    display: flex;
    justify-content: flex-start; 
    width: 100%;
}

</style>