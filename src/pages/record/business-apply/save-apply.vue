<!-- 档案存档申请审核 -->
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

           <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
           <div slot="tableAction" slot-scope="slotPropsData">
               <a
                    v-if="String(slotPropsData.currRowdata.approvalState)  === '0'"
                    href="javascript:;"
                    @click="review(slotPropsData.currRowdata)"
                    class="primaryBtnColor"
               >审核</a>
               <a
                    v-if="String(slotPropsData.currRowdata.approvalState)  === '1'"
                    href="javascript:;"
                    class="canNotClickBtnColor"
               >已审核</a>

               <a-popconfirm
                   v-if="String(slotPropsData.currRowdata.approvalState)  === '1' && String(slotPropsData.currRowdata.backoutStatus)  === '1' && !backOutLoading"
                   title="确定撤销吗?"
                   okText="确定"
                   cancelText="取消"
                   @confirm="backOut(slotPropsData.currRowdata)"
               >    
                    <a href="javascript:;" class="warnBtnColor">撤销</a>
               </a-popconfirm>

                <a-spin v-if="backOutLoading">
                    <a-icon slot="indicator" type="loading" style="font-size: 18px" spin />
                </a-spin>

               <a-popconfirm
                   title="确定删除吗?"
                   okText="确定"
                   cancelText="取消"
                   @confirm="deleteFun(slotPropsData.currRowdata)"
               >
                   <a href="javascript:;" class="errorBtnColor">删除</a>
               </a-popconfirm>
            </div>
      </TableView>

      <!-- 审核弹层 -->
      <div class="reviewModal">
        <a-modal
            centered
            :visible="reviewModal"
            :width="'90%'"
            @cancel="handleCancel"
            style="height:85%;overflow: hidden;"
            :maskClosable='false'
        >
            <!-- footer solt -->
            <template slot="footer">
                <a-popconfirm
                   title="确定拒绝通过吗?"
                   okText="确定"
                   cancelText="取消"
                   @confirm="refuseOrallow('0')"
               >
                    <a-button key="cancel" :loading='refuseConfirmLoading'>拒绝通过审核</a-button>
                </a-popconfirm>
                <a-popconfirm
                   title="确定允许通过吗?"
                   okText="确定"
                   cancelText="取消"
                   @confirm="refuseOrallow('1')"
               >
                    <a-button key="submit" type="primary" :loading='allowConfirmLoading'>允许通过审核</a-button>
                </a-popconfirm>
            </template>

            <!-- title -->
            <div slot="title" class="titleSlot">
                <p>档案存档申请审核</p>
                <span>{{currentData && currentData.applyName}}</span>
            </div>
            <!-- content -->
            <div class="content">
                <FormHeader :formTitle='"档案存档申请信息"'></FormHeader>
                <ShowBasicInfo :baseData="baseData"></ShowBasicInfo>
                <FormHeader :formTitle='"审核信息"'></FormHeader>
                <div class="reviewContent"><label>审核结果:</label><a-textarea
                    placeholder="请输入审核结果 (300字以内...)" 
                    v-model="reviewResult"
                    allowClear
                    maxlength='300'
                /></div>
            </div>
        </a-modal>
      </div>
</div>
</template>

<script>
import TableView from "@/components/tableView";
import FormHeader from "@/components/formHeader";
import ShowBasicInfo from '@/components/showBasicInfo';
export default {
    name:"SaveApply",
    //import引入的组件需要注入到对象中才能使用
    components: {TableView,FormHeader,ShowBasicInfo},
    props:[""],

    data() {
        return {
            tableTotalNum: 0,   //总页数：默认为0
            tableLoading:false,
            backOutLoading:false,
            tempCondition:{},
            reviewModal:false, // 审核弹层
            currentData:null, // 当前行数据
            allowConfirmLoading:false,
            refuseConfirmLoading:false,
            reviewResult:'',
            baseData:[
                { label:"申请人", val:void 0 ,name:'applyName'},
                { label:"性别", val:void 0 ,name:'agent'},
                { label:"身份号码/社保卡号", val:void 0 ,name:'applyIdNum'},
                { label:"手机号", val:void 0 ,name:'applyTelNum'},
                { label:"申请日期", val:void 0 ,name:'applyDate'},
                { label:"毕业日期", val:void 0 ,name:'finishSchoolTime'},
                { label:"现工作单位", val:void 0 ,name:'nowCompany'},
                { label:"档案所在单位", val:void 0 ,name:'blongCompany'},
                { label:"申请转入原因", val:void 0 ,name:'syncCause'},
                { label:"身份证正面", val:void 0 ,name:'identityFront',isImg:true},
                { label:"身份证反面", val:void 0 ,name:'identityReverse',isImg:true},
                { label:"毕业证书", val:void 0 ,name:'doplomaCard',isImg:true},
                { label:"合同", val:void 0 ,name:'applyFile',isImg:true},
            ],
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
                            placeholder: "请输入申请人姓名",
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

                        // date
                        {
                            title: '申请日期',
                            otherType: 'daterange',
                            required: false,
                            placeholder: '请选择申请日期',
                            key: "applyStartDate-applyEndDate",
                            name: "applyStartDate-applyEndDate",
                            val: [void 0 , void 0],
                            postname: "applyStartDate-applyEndDate",
                            status: '',
                            disabledDate: 'disabledEndDate',   //函数名：只能选今天和今天以前的
                            disabledStartDate: 'disabledStartDate',  //函数名：只能选今天和今天以后的
                        },
                    ],

                    // form btns
                    formBtns: [
                        { title: "查询", htmltype: "submit", operate: "searchForm", isLimit: 'no' },
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
                        // scopedSlots: { customRender: "cursorTitle" }   //鼠标滑上去tip显示当前，不写的话则不显示
                    },
                    {
                        title: "申请人",
                        dataIndex: "applyName",
                        key: "applyName",
                        fixed: "left",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "公民身份号码/社保卡号",
                        dataIndex: "applyIdNum",
                        key: "applyIdNum",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                     {
                        title: "最高学历",
                        dataIndex: "applyDegree",
                        key: "applyDegree",
                        width: 150,
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
                        title: "毕业院校",
                        dataIndex: "applySchool",
                        key: "applySchool",
                        width: 250,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "申请日期",
                        dataIndex: "applyDate",
                        key: "applyDate",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "原档案管理机构",
                        dataIndex: "originalArchiveOrg",
                        key: "originalArchiveOrg",
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "操作",
                        key: "action",
                        fixed:'right',
                        width: 250,
                        scopedSlots: { customRender: "action" }
                    }
                ],
                // table数据
                tabledataArr: [],
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

        // 获取数据
        getTableData(condition, pageNum, limitNum) {
            const _this = this;
            /***
             * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
             * 参数：condition:form查询结果：{}
             **/
            this.tableLoading = true;
            this.tempCondition = condition;
            this.$http.fetchPost('archStore@getArchStoreApplyList.action',{
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
                _this.$message.error('抱歉,网络异常,请稍后重试');
            }).finally(end => {
                _this.tableLoading = false;
            })
        },

        // 审核
        review(currRowdata){
            this.currentData = currRowdata;
            this.reviewModal = true;
            // console.log(currRowdata);
            this.baseData.forEach(item => {
                if(item.name === "agent"){
                    Object.assign(item,{val:currRowdata[item.name] === '1' ? '男' : (currRowdata[item.name] === '2' ? '女' : (currRowdata[item.name] === '9' ? '未说明的性别' : '未知的性别'))});
                }
                Object.assign(item,{val:currRowdata[item.name]});
            });
            
        },

        //撤销
        backOut(currRowdata){
            const _this = this;
            this.backOutLoading = true;
            this.$http.fetchPost('archStore@approveBackOut.action',{
                id:currRowdata.id,
                idCard:currRowdata.applyIdNum,
            }).then(res => {
                if(Number(res.code) === 0){
                    _this.$message.success('撤销成功!');
                    _this.getTableData(_this.tempCondition,1,10);
                }else{
                    _this.$message.warning('抱歉,撤销失败,请重试');
                }
            }).catch(err => {
                _this.$message.error('抱歉,网络异常,请稍后重试');
            }).finally(end => {
                _this.backOutLoading = false;
            })
        },

        // close modal
        handleCancel(){
            this.reviewModal = false;
        },

        // confirm review  
        refuseOrallow(state){

            const _this = this;

            if(state === '1'){
                this.allowConfirmLoading = true;
            }else{
                this.refuseConfirmLoading = true;
            }

            this.$http.fetchPost('archStore@archStoreApproval.action',{
                applyId:this.currentData.id,
                approvalState: String(state),
                approvalRemark:this.reviewResult,
            })
            .then(res => {
                if(Number(res.code) === 0){
                    _this.$message.success('审核成功!');
                    _this.reviewModal = false;
                    _this.getTableData(_this.tempCondition,1,10);
                }else{
                    _this.$message.warning('审核失败,请重试');
                }
            })
            .catch(err => {
                _this.$message.console.error('抱歉,网络异常,请稍后重试');
            })
            .finally(end => {
                if(state === '1'){
                    this.allowConfirmLoading = false;
                }else{
                    this.refuseConfirmLoading = false;
                }
            })
        },
        // 删除审核
        deleteFun(currRowdata){
            const _this = this;
            this.$http.fetchPost('archTransferOut@deleteArchTransferOut.action',{
                id:currRowdata.id
            }).then(res => {
                if(Number(res.code) === 0){
                    _this.$message.success('删除成功!');
                    _this.getTableData(_this.tempCondition,1,10);
                }else{
                    _this.$message.warning('删除失败,请重试');
                }
            }).catch(err => {
                _this.$message.console.error('抱歉,网络异常,请稍后重试');
            })
        }
    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        // 初始化数据
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
    .titleSlot{
        display: flex;
    }
    .titleSlot>p{
        margin-right: 40px;
    }
    .titleSlot>span{
        color:#2d8cf0;
    }
    .content{
        height: 100%;
        overflow-y: auto;
        overflow-x:hidden;
    }
    .reviewContent{
        display: flex;
        margin-bottom: 20px;
    }
    .reviewContent > label{
        width: 20%;
        text-align: center;
        line-height: 100px;
    }
    .reviewContent > textarea{
        flex:1;
        height: 100px;
    }
</style>