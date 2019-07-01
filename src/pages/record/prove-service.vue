<!-- template -->
<template>
<div class="outer">
    
    <!-- 档案转出弹层 -->
    <div class="proofModal">
      <a-modal
        centered
        title="现场开具证明"
        :visible="visible"
        :width="'90%'"
        @cancel="handleCancel"
        style="height:85%;overflow: hidden;"
        :maskClosable='false'
        :footer="null"
      >
        <TableView
            :initArrData="initArr1"
            :totalCount="tableTotalNum1"
            @searchTable="getTableData1"
            :loading="tableLoading1"
        >
            <div slot="tableAction" slot-scope="slotPropsData" >
                
                <div class="actionClass" v-if="String(slotPropsData.currRowdata.isInware) === '0'">
                    <a-select
                        v-model="selectProofType"
                        placeholder="请选择证明类型"
                        allowClear
                        class="actionSelect"
                    >
                        <a-select-option
                            v-for="(el, index) in proofTypes"
                            :key="index"
                            :value="el.itemCode"
                        >{{el.itemName}}</a-select-option>
                    </a-select>
                    <a
                        href="javascript:;"
                        class="primaryBtnColor"
                    >预览打印</a>
                </div>
                <a
                    v-if="String(slotPropsData.currRowdata.isInware) === '2'"
                    href="javascript:;"
                    class="canNotClickBtnColor"
                >抱歉,档案已转出,不可进行打印操作</a>
                <a
                    v-if="String(slotPropsData.currRowdata.isInware) !== '0' && String(slotPropsData.currRowdata.isInware) !== '2'"
                    href="javascript:;"
                    class="canNotClickBtnColor"
                >请完成其他正在进行的操作后进行打印</a>

            </div>
            
        </TableView>
      </a-modal>
    </div>

    <TableView
        :initArrData="initArr"
        :totalCount="tableTotalNum"
        @searchTable="getTableData"
        :loading="tableLoading"
    >

        <!-- tableFormSearch里添加其他按钮 -->
        <span slot="formAction">
            <a-button @click="proofOnSite">现场开具证明</a-button>
        </span>

        <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
        <div slot="tableAction" slot-scope="slotPropsData">
            <a
                v-if="slotPropsData.currRowdata.printState !== '已打印'"
                href="javascript:;"
                @click="showAndPrint(slotPropsData.currRowdata)"
                class="primaryBtnColor"
            >预览打印</a>
            <a
                href="javascript:;"
                class="canNotClickBtnColor"
            >预览打印</a>

        </div>
    </TableView>
</div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
    name:"ProveService",
    //import引入的组件需要注入到对象中才能使用
    components: {TableView},
    props:[""],

    data() {
        return {
            visible:false,                   
            tableTotalNum: 0,   //总页数：默认为0
            tableTotalNum1: 0,
            tempCondition:{},
            tempCondition1:{},
            tableLoading:false,
            tableLoading1:false,
            // 证明类型
            proofTypes:[],
            selectProofType:void 0,
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
                            key: "applyName",
                            name: "applyName",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'applyName',
                            status: '',
                        },
                        {
                            title: '身份证号/社保卡号',
                            type: "text",
                            required: false,
                            placeholder: "请输入身份证号/社保卡号",
                            key: "applyIdNum",
                            name: "applyIdNum",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'applyIdNum',
                            status: '',
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
                        scopedSlots: { customRender: "cursorTitle" }   //鼠标滑上去tip显示当前，不写的话则不显示
                    },
                    {
                        title: "姓名",
                        dataIndex: "applyName",
                        key: "applyName",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "身份证号",
                        dataIndex: "applyIdNum",
                        key: "applyIdNum",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "联系电话",
                        dataIndex: "applyTelNum",
                        key: "applyTelNum",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "联系地址",
                        dataIndex: "applyContactAddress",
                        key: "applyContactAddress",
                        width: 220,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "证明材料类型",
                        dataIndex: "proofType",
                        key: "proofType",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "打印日期",
                        dataIndex: "printDate",
                        key: "printDate",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "数据来源",
                        dataIndex: "sourceType",
                        key: "sourceType",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "打印状态",
                        dataIndex: "printState",
                        key: "printState",
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "操作",
                        key: "action",
                        width: 150,
                        fixed:"right",
                        scopedSlots: { customRender: "action" }
                    }
                ],
                // table数据
                tabledataArr: [],
            },
            initArr1:{
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
                            key: "a0101",
                            name: "a0101",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'a0101',
                            status: '',
                        },
                        {
                            title: '身份证号/社保卡号',
                            type: "text",
                            required: false,
                            placeholder: "请输入身份证号/社保卡号",
                            key: "a0184",
                            name: "a0184",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'a0184',
                            status: '',
                        },
                        {
                            title: '存档编号',
                            type: "text",
                            required: false,
                            placeholder: "请输入存档编号",
                            key: "a0100A",
                            name: "a0100A",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'a0100A',
                            status: '',
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
                        width: 100,
                        scopedSlots: { customRender: "cursorTitle" }   //鼠标滑上去tip显示当前，不写的话则不显示
                    },
                    {
                        title: "姓名",
                        dataIndex: "a0101",
                        key: "a0101",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "身份证号",
                        dataIndex: "a0184",
                        key: "a0184",
                        width: 300,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "存档编号",
                        dataIndex: "a0100A",
                        key: "a0100A",
                        width: 250,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "委托存档单位编号",
                        dataIndex: "oldArchiveUnit",
                        key: "oldArchiveUnit",
                        // width: 250,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "选择证明类型打印",
                        key: "action",
                        width: 400,
                        fixed:"right",
                        scopedSlots: { customRender: "action" }
                    }
                ],
                // table数据
                tabledataArr: [],
            }

        };
    },

    //监听属性 类似于data概念
    computed: {
        directoryData:function(){
            if(this.$store.getters.getDirectoryData){
                this.splitDirectoryData(this.$store.getters.getDirectoryData);
                return this.$store.getters.getDirectoryData;
            }else{
                return null;
            }
        }
    },

    //监控data中的数据变化
    watch: {
        directoryData:{
            // 改变数据
            handler:function(newVal,oldVal){
                this.splitDirectoryData(newVal)
            },
            deep:true,//深度监听
        },
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
            this.$http.fetchPost('archPrintProof@printProofService.action',{
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
                            sourceType:String(element.sourceType) === '1' ? "现场打印" : String(element.sourceType) === '0' ? "网站申请" : "未知来源",
                            printState:String(element.printState) === '1' ? "已打印" : "未打印",
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
        getTableData1(condition, pageNum, limitNum) {
            const _this = this;
            /***
             * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
             * 参数：condition:form查询结果：{}
             **/
            this.tableLoading1 = true;
            this.tempCondition1 = condition;
            this.$http.fetchPost('personalArch@getPersonalArchProofList.action',{
                page: pageNum,
                limit: limitNum,
                ...condition
            }).then((res)=>{
                if(Number(res.code) === 0){
                    this.tableTotalNum1 = res.count;
                    this.initArr1.tabledataArr = res.data;
                    this.initArr1.tabledataArr.forEach((element, index) => {
                        let tempState = String(element.transferOutState);
                        Object.assign(element,{
                            key:element.a01000,
                            num: (pageNum - 1) * limitNum + index + 1,
                        });
                    });
                }else{
                    _this.$message.warning("抱歉,暂时未查到数据!");
                }
            }).catch(err => {
                _this.$message.error("抱歉,网络异常,请稍后重试");
            }).finally(end => {
                _this.tableLoading1 = false;
            })
        },

        // 现场开具证明
        proofOnSite(){
            this.visible = true;
        },

        handleCancel(){
            this.visible = false;
        },
        // 拆分字典数据
        splitDirectoryData(Data){
            if(!Data) return;
            this.proofTypes = Data.proofTypeList;
        }

    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        
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
    .actionClass{
        display: flex;
        align-items: center;
    }
    .actionClass .actionSelect{
        width: 180px;
        margin-right: 10px;
    }
</style>