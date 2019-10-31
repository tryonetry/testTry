<!-- 开户申请审核 -->
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
                    v-if="String(slotPropsData.currRowdata.approveStatus)  === '0'"
                    href="javascript:;"
                    @click="review(slotPropsData.currRowdata)"
                    class="primaryBtnColor"
               >审核</a>
               <a
                    v-if="String(slotPropsData.currRowdata.approveStatus)  === '1'"
                    href="javascript:;"
                    class="canNotClickBtnColor"
               >已审核</a>
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
                <p>开户申请审核</p>
                <span>{{currentData && currentData.unitCode}}</span>
            </div>
            <!-- content -->
            <div class="content">
                <FormHeader :formTitle='"单位开户申请信息"'></FormHeader>
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
    name:"AccountApply",
    //import引入的组件需要注入到对象中才能使用
    components: {TableView,FormHeader,ShowBasicInfo},
    props:[""],

    data() {
        return {
            tableTotalNum: 0,   //总页数：默认为0
            tableLoading:false,
            tempCondition:{},
            reviewModal:false, // 审核弹层
            currentData:null, // 当前行数据
            allowConfirmLoading:false,
            refuseConfirmLoading:false,
            reviewResult:'',
            baseData:[
                { label:"申请单位", val:void 0 ,name:'unitCode'},
                { label:"单位性质", val:void 0 ,name:'unitNature'},
                { label:"单位联系人", val:void 0 ,name:'hrContact'},
                { label:"联系人电话", val:void 0 ,name:'hrLeaderTelNumber'},
                { label:"申请日期", val:void 0 ,name:'applyTime'},
                { label:"联系人身份证正面", val:void 0 ,name:'identityFront',isImg:true},
                { label:"联系人身份证反面", val:void 0 ,name:'identityReverse',isImg:true},
                { label:"营业执照副本", val:void 0 ,name:'businessLicense',isImg:true},
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
                            title: '委托存档单位名称',
                            type: "text",
                            required: false,
                            placeholder: "请输入委托存档单位名称",
                            key: "unitCode",
                            name: "unitCode",
                            val: void 0,
                            maxlength: 50,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'unitCode',
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
                            val: void 0,
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
                        scopedSlots: { customRender: "cursorTitle" }   //鼠标滑上去tip显示当前，不写的话则不显示
                    },
                    {
                        title: "委托存档单位名称",
                        dataIndex: "unitCode",
                        key: "unitCode",
                        fixed: "left",
                        width: 250,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "单位性质",
                        dataIndex: "unitNature",
                        key: "unitNature",
                        width: 300,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "单位联系人",
                        dataIndex: "hrContact",
                        key: "hrContact",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "申请时间",
                        dataIndex: "applyTime",
                        key: "applyTime",
                        width: 300,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "操作",
                        key: "action",
                        scopedSlots: { customRender: "action" },
                        width: 200,
                        fixed:"right"
                    }
                ],
                // table数据
                tabledataArr: [],
            }

        };
    },

    //监听属性 类似于data概念
    computed: {
    },

    //监控data中的数据变化
    watch: {
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
            this.$http.fetchPost('openAccountApproval@getopenAccountList.action',{
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
                            key:element.unitId,
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
                Object.assign(item,{val:currRowdata[item.name]})
            });
            
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

            this.$http.fetchPost('openAccountApproval@openAccountApproval.action',{
                applyId:this.currentData.openAccountId,
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
            this.$http.fetchPost('openAccountApproval@delOpenAccountApproval.action',{
                id:currRowdata.openAccountId
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