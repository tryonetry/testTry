<!-- template -->
<template>
<div class="outer">
        <TableView
            :initArrData="initArr"
            :totalCount="tableTotalNum"
            @searchTable="getTableData"
            :loading="tableLoading"
        >

            <!-- tableFormSearch里添加其他按钮 -->
            <span slot="formAction">
            </span>

            <!-- 自定义列 -->
            <div slot="customizeInner" slot-scope="slotPropsData">
                <span @click="openDetails(slotPropsData.currRowdata)" class="primaryBtnColor">{{slotPropsData.currRowdata.a0101}}</span>
            </div>

        </TableView>

        <!-- 查看详情 -->
        <a-modal
            centered
            title="查看详情"
            :visible="visiable"
            @cancel="cancel"
            :width="'90%'"
            style="height:90%;overflow: hidden;"
            :maskClosable='false'
            :footer="null"
            class="detailModal"
        >
            <div class="detailModalCont">
                <a-tabs defaultActiveKey="1" :activeKey="currIndex" style="padding:10px;height:100%;" @change="tabChange">

                    <a-tab-pane tab="基础信息" key="1" forceRender>
                        <div class="infoCont">
                            <FormHeader :formTitle='"人员基本信息"'></FormHeader>
                            <ShowBasicInfo :baseData="baseInfoData" class="infoPart"></ShowBasicInfo>
                            <FormHeader :formTitle='"人员学历信息"'></FormHeader>
                            <ShowBasicInfo :baseData="educationData" class="infoPart"></ShowBasicInfo>    
                            <FormHeader :formTitle='"人员存档信息"'></FormHeader>
                            <ShowBasicInfo :baseData="saveRecordData" class="infoPart"></ShowBasicInfo>
                        </div>
                    </a-tab-pane>

                    <a-tab-pane tab="委托存档单位信息" key="2" >
                        <TableView
                            :initArrData="initArr1"
                            :totalCount="tableTotalNum1"
                            @searchTable="getTableData1"
                            :loading="tableLoading1"
                        ></TableView>
                    </a-tab-pane>

                    <a-tab-pane tab="转入信息" key="3" >
                        <TableView
                            :initArrData="initArr2"
                            :totalCount="tableTotalNum2"
                            @searchTable="getTableData1"
                            :loading="tableLoading2"
                        ></TableView>
                    </a-tab-pane>

                    <a-tab-pane tab="转出信息" key="4" >
                        <TableView
                            :initArrData="initArr3"
                            :totalCount="tableTotalNum3"
                            @searchTable="getTableData1"
                            :loading="tableLoading3"
                        ></TableView>
                    </a-tab-pane>
                    
                </a-tabs>
            </div>
        </a-modal>
</div>
</template>

<script>
const tableUrls = [
    "multipleQuery@getPersonalArchEntrustUnitList.action",
    "multipleQuery@getPersonalArchReceiveList.action",
];
import FormHeader from "@/components/formHeader";
import ShowBasicInfo from '@/components/showBasicInfo';
import TableView from "@/components/tableView";
export default {
    name:"QueryService",
    //import引入的组件需要注入到对象中才能使用
    components: {FormHeader, ShowBasicInfo,TableView},
    props:[""],

    data() {
        return {
            companyDataArr:null,       
            tableTotalNum: 0,   //总页数：默认为0
            tableTotalNum1:0,
            tableTotalNum2:0,
            tableTotalNum3:0,
            tableLoading:false,
            tableLoading1:false,
            tableLoading2:false,
            tableLoading3:false,
            tempCondition:null,
            tempCondition1:null,
            tempCondition2:null,
            tempCondition3:null,
            currRow:null,
            currIndex:0,
            visiable:false,
            // tableView传值方式
            initArr:{
                treeflag: false,   //左侧tree是否存在
                tableCheck: false, //table是否可以check
                // formInputs 传值方式
                formData: {
                    //forminputs data
                    formInputs:[
                        // select/searchSelect
                        {
                            title: '委托存档单位名称',
                            otherType: 'searchSelect',
                            required: false,
                            placeholder: "请选择(搜索)单位名称",
                            key: 'companyId',
                            name: 'companyId',
                            val: void 0,
                            children: [],
                            status: '',
                        },
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
                            postname:'',
                            status: '',
                        },
                        {
                            title: '存档编号',
                            type: "text",
                            required: false,
                            placeholder: "请输入存档编号",
                            key: "a0100a",
                            name: "a0100a",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'',
                            status: '',
                        },
                        {
                            title: '身份证/社保卡号',
                            type: "text",
                            required: false,
                            placeholder: "请输入身份证/社保卡号",
                            key: "a0184",
                            name: "a0184",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'',
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
                        dataIndex: "a0101",
                        key: "a0101",
                        fixed: "left",
                        width: 150,
                        scopedSlots: { customRender: "customize" }
                    },
                    {
                        title: "存档编号",
                        dataIndex: "a0100a",
                        key: "a0100a",
                        fixed: "left",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "身份证号/社保卡号",
                        dataIndex: "a0184",
                        key: "a0184",
                        width: 250,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "手机号码",
                        dataIndex: "a3707c",
                        key: "a3707c",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "委托存档单位名称",
                        dataIndex: "a0888",
                        key: "a0888",
                        width: 250,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "委托存档单位编号",
                        dataIndex: "companyNumber",
                        key: "companyNumber",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "档案位置编号",
                        dataIndex: "shelvesNo",
                        key: "shelvesNo",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "存档日期",
                        dataIndex: "uCreateDate",
                        key: "uCreateDate",
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    // {
                    //     title: "操作",
                    //     key: "action",
                    //     scopedSlots: { customRender: "action" }
                    // }
                ],
                // table数据
                tabledataArr: [],
            },
            initArr1:{
                treeflag: false,
                tableCheck: false,
                superimposeWidth:true,
                columnsArr:[
                    {
                        title: "序号",
                        dataIndex: "num",
                        key: "num",
                        fixed: "left",
                        width: 150,
                    },
                    {
                        title: "单位名称",
                        dataIndex: "companyName ",
                        key: "companyName ",
                        width: 300,
                    },
                    {
                        title: "单位编号",
                        dataIndex: "companyNumber",
                        key: "companyNumber",
                        width: 200,
                    },
                    {
                        title: "统一社会信用代码",
                        dataIndex: "b0114",
                        key: "b0114",
                        width: 200,
                    },
                    {
                        title: "单位机构类型",
                        dataIndex: "companyNature",
                        key: "companyNature",
                        width: 150,
                    },
                    {
                        title: "所属行业",
                        dataIndex: "companyManagementRange",
                        key: "companyManagementRange",
                        width: 150,
                    },
                    {
                        title: "经济类型",
                        dataIndex: "economicType",
                        key: "economicType",
                        width: 150,
                    },
                    {
                        title: "行政区划",
                        dataIndex: "areaName",
                        key: "areaName",
                    },
                ],
                tabledataArr:[],
            },
            initArr2:{
                treeflag: false, 
                tableCheck: false, 
                superimposeWidth:true,
                columnsArr:[
                    {
                        title: "序号",
                        dataIndex: "num",
                        key: "num",
                        fixed: "left",
                        width: 150,
                    },
                    {
                        title: "姓名",
                        dataIndex: "a0101",
                        key: "a0101",
                        width: 200,
                    },
                    {
                        title: "性别",
                        dataIndex: "a0104",
                        key: "a0104",
                        width: 150,
                    },
                    {
                        title: "身份证/社保卡号",
                        dataIndex: "a0184",
                        key: "a0184",
                        width: 250,
                    },
                    {
                        title: "存档编号",
                        dataIndex: "a0100a",
                        key: "a0100a",
                        width: 200,
                    },
                    {
                        title: "存档日期",
                        dataIndex: "A3801",
                        key: "A3801",
                        width: 150,
                    },
                    {
                        title: "原存档单位名称",
                        dataIndex: "A3802",
                        key: "A3802",
                        width: 250,
                    },
                    {
                        title: "邮寄编号",
                        dataIndex: "confNumber",
                        key: "confNumber",
                        width: 200,
                    },
                    {
                        title: "经办人",
                        dataIndex: "userName",
                        key: "userName",
                        width: 200,
                    },
                    {
                        title: "备注",
                        dataIndex: "REMARKS",
                        key: "REMARKS",
                    },
                ],
                tabledataArr:[],
            },
            initArr3:{
                treeflag: false, 
                tableCheck: false, 
                superimposeWidth:true,
                columnsArr:[
                    {
                        title: "序号",
                        dataIndex: "num",
                        key: "num",
                        fixed: "left",
                        width: 150,
                    },
                    {
                        title: "姓名",
                        dataIndex: "a0101",
                        key: "a0101",
                        width: 200,
                    },
                    {
                        title: "性别",
                        dataIndex: "a0104",
                        key: "a0104",
                        width: 150,
                    },
                    {
                        title: "身份证/社保卡号",
                        dataIndex: "a0184",
                        key: "a0184",
                        width: 250,
                    },
                    {
                        title: "存档编号",
                        dataIndex: "a0100a",
                        key: "a0100a",
                        width: 200,
                    },
                    {
                        title: "转出日期",
                        dataIndex: "DC030010",
                        key: "DC030010",
                        width: 150,
                    },
                    {
                        title: "转往机构",
                        dataIndex: "DC030012",
                        key: "DC030012",
                        width: 250,
                    },
                    {
                        title: "邮寄编号",
                        dataIndex: "confNumberOut",
                        key: "confNumberOut",
                        width: 200,
                    },
                    {
                        title: "经办人",
                        dataIndex: "operatorName",
                        key: "operatorName",
                    },
                ],
                tabledataArr:[],
            },
            baseInfoData:[
                { label:"姓名", val:void 0 ,name:'a0101'},
                { label:"性别", val:void 0 ,name:'a0104'},
                { label:"身份证/社保卡号", val:void 0 ,name:'a0184'},
                { label:"曾用名", val:void 0 ,name:'a0139'},
                { label:"出生日期", val:void 0 ,name:'a0107'},
                { label:"籍贯", val:void 0 ,name:'a0111'},
                { label:"民族", val:void 0 ,name:'a0117'},
                { label:"户籍状态", val:void 0 ,name:'hujiState'},
                { label:"户籍所在地", val:void 0 ,name:'a0181'},
                { label:"现居住地址", val:void 0 ,name:'a3711'},
                { label:"婚姻状况", val:void 0 ,name:'a0131'},
                { label:"健康状况", val:void 0 ,name:'a0127'},
                { label:"政治面貌", val:void 0 ,name:'a0141'},
                { label:"参加工作日期", val:void 0 ,name:'a0134'},
                { label:"紧急联系人", val:void 0 ,name:'partyDuties'},
                { label:"电子邮箱", val:void 0 ,name:'a3708'},
                { label:"联系电话", val:void 0 ,name:'a3707C'},
                { label:"委托存档单位名称", val:void 0 ,name:'companyId'},
                { label:"委托存档单位编号", val:void 0 ,name:'companyNum'},
                { label:"工作单位名称", val:void 0 ,name:'a0202A'},
                { label:"备注", val:void 0 ,name:'remarks',oneRow:true},
                { label:"缺少材料", val:void 0 ,name:'lackMaterials',oneRow:true},
            ],
            educationData:[
                { label:"最高学位", val:void 0 ,name:'a0914'},
                { label:"最高学历", val:void 0 ,name:'a0834'},
                { label:"最高学历毕业日期", val:void 0 ,name:'a0807'},
                { label:"最高学历毕业院校", val:void 0 ,name:'a0888'},
                { label:"最高专业技术职务", val:void 0 ,name:'majorPost'},
                { label:"取得时间", val:void 0 ,name:'toRegularDate'},
            ],
            saveRecordData:[
                { label:"存档编号", val:void 0 ,name:'a0100A'},
                { label:"存档性质", val:void 0 ,name:'personType'},
                { label:"存档位置号", val:void 0 ,name:'shelvesNo'},
                { label:"来档方式", val:void 0 ,name:'source'},
                { label:"邮寄编号", val:void 0 ,name:'confNumber'},
            ],
        };
    },

    //监听属性 类似于data概念
    computed: {
        companyData:function(){
            if(this.$store.getters.getCompanyData){
                // console.log(this.$store.getters.getCompanyData)
                this.handlerCompanyData(this.$store.getters.getCompanyData);
                return this.$store.getters.getCompanyData
            }else{
                // console.log(1)
                return null;
            }
        }
    },

    //监控data中的数据变化
    watch: {
        companyData:{
           handler:function(newVal){
               this.companyDataArr = newVal;
               this.handlerCompanyData(this.companyDataArr)
           },
           deep:true,//深度监听
        }
    },

    //方法集合
    methods: {
        handlerCompanyData(arr){
            this.initArr.formData.formInputs[0].children = [...arr].map((item)=>{
                return {itemCode:item.id,itemName:item.companyName}
            })
        },
        getTableData(condition, pageNum, limitNum) {
            const _this = this;
            /***
             * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
             * 参数：condition:form查询结果：{}
            **/
            this.tempCondition = condition;
            this.tableLoading = true;
            this.$http.fetchPost('multipleQuery@getPersonalArchMultipleQueryList.action',{
                page: pageNum,
                limit: limitNum,
                ...condition
            }).then((res)=>{
                if(Number(res.code) === 0){
                    _this.tableTotalNum = res.count;
                    this.initArr.tabledataArr = res.data;
                    this.initArr.tabledataArr.forEach((element, index) => {
                        Object.assign(element,{
                            key:element.a01000,
                            num: (pageNum - 1) * limitNum + index + 1,
                        });
                    });
                }else{
                    _this.$message.warning("抱歉,暂时未查到数据!");
                }
            }).catch(err => {
                _this.$message.warning("抱歉,网络异常,请稍后重试!");
            }).finally(end => {
                _this.tableLoading = false;
            })
        },

        getTableData1(condition,pageNum, limitNum,tabIndex){
            const _this = this;
            let urlIndex = 0;
            if(tabIndex - 1 !== 0){
                urlIndex = 1;
            }
            // console.log(urlIndex)
            this["tempCondition"+tabIndex] = condition;
            this['tableLoading'+tabIndex] = true;
            this.$http.fetchPost(tableUrls[urlIndex],{
                page: pageNum,
                limit: limitNum,
                personId:this.currRow.a01000,
                archiveId:this.currRow.a01000,
                archState:tabIndex === 2 ? "0" : tabIndex === 3 ? "2" : "",
                ...condition,
            }).then(res => {
                if(Number(res.code) === 0){
                    _this["tableTotalNum"+tabIndex] = res.count;
                    _this["initArr"+tabIndex].tabledataArr = res.data;
                    _this["initArr"+tabIndex].tabledataArr.forEach((element, index) => {
                        let tempState = String(element.transferOutState);
                        Object.assign(element,{
                            key:element.A01000,
                            num: (pageNum - 1) * limitNum + index + 1,
                        });
                    });
                }else{
                    _this.$message.warning('抱歉,获取数据失败,请重试!');
                }
            }).catch(err => {
                _this.$message.error('抱歉,网络异常,请稍后重试!');
            }).finally(end => {
                _this['tableLoading'+tabIndex] = false;
            })
        },

        insertDataToBaseInfo(infoData,data){
            infoData.forEach(item => {
                Object.assign(item,{
                    val:data[item.name]
                });
            });
        },

        // 查看详情
        openDetails(currRowdata){
            this.currRow = currRowdata;
            this.currIndex = '1';
            const _this = this;
            // 获取数据
            if(currRowdata.a01000){
                this.$http.fetchPost('multipleQuery@getPersonalArchById.action',{
                    a01000:currRowdata.a01000
                }).then(res => {
                    if(Number(res.code) === 0){
                        // console.log(res.data);
                        const { insertDataToBaseInfo, baseInfoData, educationData, saveRecordData } = this;
                        insertDataToBaseInfo(baseInfoData,res.data);
                        insertDataToBaseInfo(educationData,res.data);
                        insertDataToBaseInfo(saveRecordData,res.data);
                        this.visiable = true;
                    }else{
                        _this.$message.warning('抱歉,获取数据失败,请重试');
                    }
                }).catch(err => {
                    _this.$message.warning('抱歉,网络异常,请稍后重试');
                });
                this.getTableData1(this["tempCondition1"],1,10,1);
                this.getTableData1(this["tempCondition2"],1,10,2);
                this.getTableData1(this["tempCondition3"],1,10,3);
            }
            
        },

        // close modal
        cancel(){
            this.visiable = false;
        },

        // change tab
        tabChange(index){
            this.currIndex = index;
        }

    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        // console.log(1)
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
    .detailModalCont{
        height: 100%;
    }
    .infoCont{
        height: 100%;
        overflow-y: auto;
    }
    .infoPart{
        padding-bottom: 40px;
    }
</style>