<!-- template -->
<template>
    <div class="editDocOuter" @click='resetAllState'>

        <!-- 左侧选择档案目录类型 -->
        <div class="left">
            <ul v-if="!!listDirectory && listDirectory.length>0">
                <li v-for="(item,index) in listDirectory" :key='index' :class="index===currentIndex?'activeli':''" @click="indexChange(index)">
                    {{item.name}}
                </li>
            </ul>
        </div>

        <!-- 右侧操作当前的档案目录类型 -->
        <div class="right">
            <!-- msg -->
            <div class="bundleContainer">
                <MsgTip :msgTip="msgTip" :msgIndex="msgIndex" :watcherState="watcherState"></MsgTip>
            </div>
            <!-- 表格头部 -->
            <div class="materialHead">
                <ul>
                    <li>序 号</li>
                    <li>材料名称</li>
                    <li>材料生成日期</li>
                    <li>页 数</li>
                    <li>备 注</li>
                    <li>操 作</li>
                </ul>
            </div>
            <!-- 表格内容 -->
            <div class="materialBody" v-if='listDirectory && listDirectory[currentIndex]'>
                <div v-if='listDirectory[currentIndex].dataArr.length>0'>
                    <ul v-for="(row,index) in listDirectory[currentIndex].dataArr" :key="index">
                        <li>{{index+1}}</li>
                        <li @click.stop="bundleClick(index,'name',$event)">
                            <input v-if='row.inEdit && row.inEdit.name' type="text" v-model="row.e01z111a"/>
                            <span v-else>{{row.e01z111a}}</span>
                        </li>
                        <li @click.stop="bundleClick(index,'date',$event)">
                            <a-date-picker 
                                v-if='row.inEdit && row.inEdit.date' 
                                :disabledDate="disabledEndDate"
                                :defaultValue="row.e01z117a?moment(row.e01z117a, dateFormat):moment(new Date(),dateFormat)"
                                :format="dateFormat"
                                @change="dateChange(arguments,row)"
                            />
                            <span v-else>{{row.e01z117a}}</span>
                        </li>
                        <li>{{row.e01z114}}</li>
                        <li @click.stop="bundleClick(index,'tip',$event)">
                            <input v-if='row.inEdit && row.inEdit.tip' type="text" v-model="row.e01z121"/>
                            <span v-else>{{row.e01z121}}</span>
                        </li>
                        <li class="actions">
                            <span class="primaryBtnColor">上传材料</span>
                            <a-popconfirm
                                title="确定删除吗?"
                                okText="确定"
                                cancelText="取消"
                                placement="rightBottom"
                                @confirm="deleteMaterial(index)"
                            >
                                <span class="errorBtnColor">删 除</span>
                            </a-popconfirm>
                        </li>
                    </ul>
                </div>
                <p v-else class="noCurrentIndexData">暂无此材料数据</p>
            </div>
            <!-- 点击添加 -->
            <p class="materialAddBtn" @click="addNewMaterial">
                <a-icon type="plus" style="color:#666"/>
                <!-- <a-button type="primary"><a-icon type="plus" />新 增</a-button> -->
            </p>
        </div>
    </div>
</template>

<script>

import MsgTip from './msgTip';
import moment from 'moment';
export default {
    name:"EditDocDirectory",
    //import引入的组件需要注入到对象中才能使用
    components: {
        MsgTip,
    },
    props:["userId","ramdomKey"],

    data() {
        return {
            dateFormat:'YYYYMMDD',
            msgTip:'',
            msgIndex:0,
            watcherState:Math.random(),
            listDirectory:[],
            currentIndex:0,
            userData:null,
            initEditState:{name:false,date:false,tip:false},
        };
    },

    //监听属性 类似于data概念
    computed: {
        tempEmptyObj:function(){
            let tempEmptyObj = null;
            if(this.listDirectory && this.listDirectory.length > 0){
                tempEmptyObj = {...this.listDirectory[0].dataArr[0]};
            }
            for(let key in tempEmptyObj){
                tempEmptyObj[key] = '';
            }
            return tempEmptyObj;
        }
    },

    //监控data中的数据变化
    watch: {
        // 保证每次进来重新获取
        ramdomKey:{
            handler:function(){
                this.fetchUserData(this.userId);
            },
        }
    },

    //方法集合
    methods: {
        moment,
        // 弹出提示信息 index:[0-success,1-info,2-warning,3-err]
        alertTip(msg,index,close){
            if(close){
                this.closeState = close;
            }else{
                this.closeState = false;
            }
            
            this.msgTip = msg;
            this.msgIndex = index;
            this.watcherState = Math.random();
        },

        // change index
        indexChange(index){
            this.currentIndex = index;
        },

        // 重组列表
        initListDirectory(){
            const _this = this;
            const { userData } = this;
            this.listDirectory = [];
            if(!userData) return;
            userData.forEach((item,index)=>{
                let tempObj = {
                    name:item.name,
                    dataArr:item.dataArr,
                };
                // 每条数据添加可编辑列状态值
                tempObj.dataArr.forEach(item => {
                    // item is an object
                    if(item){
                        item.inEdit = _this.initEditState ;
                    }
                });
                _this.listDirectory.push(tempObj);
            });
        },
        // fetch user data
        fetchUserData(userId){
            const _this = this;
            this.$http.fetchGet('digitalArchives@loadCatalog.action',{a01000:userId})
            .then((res)=>{

                if(Number(res.code) === 0){
                    _this.userData = res.data;
                    _this.initListDirectory();
                }else{
                    _this.alertTip('抱歉,用户档案目录信息不存在',2,false);
                }

            })
            .catch(()=>{
                _this.alertTip('抱歉,网络错误了,请稍后重试',3,false);
            })
        },
        // 切换状态
        bundleClick(index,columnName,el){
            const { currentIndex } = this;
            this.resetAllState();
            this.listDirectory[currentIndex].dataArr[index].inEdit[columnName] = true;
            this.listDirectory = [...this.listDirectory];
            
            this.$nextTick(function(){
                el.currentTarget.firstElementChild.focus();
            });
        },
        // 姜所有的编辑状态置为 false
        resetAllState(){
            const _this = this;
            this.listDirectory.forEach((item)=>{
                item.dataArr.forEach((row)=>{
                    row.inEdit = {..._this.initEditState};
                });
            });
            this.listDirectory = [...this.listDirectory];
        },
        // 添加新的材料
        addNewMaterial(){
            if(this.listDirectory && this.listDirectory[this.currentIndex] && this.listDirectory[this.currentIndex].dataArr){
                this.listDirectory[this.currentIndex].dataArr.push({...this.tempEmptyObj})
            }else{
                this.alertTip('抱歉,网络错误了,请稍后重试',2,false);
            }
        },
        // 删除材料
        deleteMaterial(index){
            this.listDirectory[this.currentIndex].dataArr.splice(index,1);
        },
        // 不可选择时间
        disabledEndDate(current){
            // console.log(moment().endOf('day'))
            return current && current >= moment().endOf('day');
        },
        dateChange(args,item){
            item.e01z117a = args[1];
        }
        
    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        // console.log(this.userId);
        this.fetchUserData(this.userId);
    },

    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        // this.alertTip('this is a test msg',1);
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
.editDocOuter{
    display: flex;
    /* position: relative; */
}
.editDocOuter .right{
    position: relative;
}
.bundleContainer{
    width: 100%;
    position: absolute;
    top:0;
    left: 0;
}
.left{
    width: 20%;
    box-sizing: border-box;
    /* padding: 20px; */
    border-right: 3px solid #e8e8e8;
}
.left>ul>li{
    width: 100%;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    text-align: center;
    /* border-bottom: 1px solid #e8e8e8; */
}
.left .activeli{
    color: #ffffff;
    background: #1890ff;
}
.left .activeli:hover{
    background: #1890ff;
}
.left>ul>li:hover{
    background: rgb(230,247,255)
}

.right{
    flex: 1;
    padding: 10px;
    box-sizing: border-box;
    overflow-y: auto;
    max-height: 600px;
}
.right ul{
    display: flex;
    border-bottom: 1px solid #e8e8e8;
    border-left: 1px solid #e8e8e8;
}
.right .materialHead{
    background: #fafafa;
    border-top: 1px solid #e8e8e8;
}
.right .materialHead li{
    font-size: 16px;
}
.right .noCurrentIndexData{
    height: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 16px;
    color: #cccccc;
    border: 1px solid #e8e8e8;
    border-top: none;
}
.right ul li{
    text-align: center;
    box-sizing: border-box;
    height: 45px;
    line-height: 45px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-right:  1px solid #e8e8e8;
}
.right ul li input{
    width: 80%;
    height: 35px;
    border:1px solid #d9d9d9;
    line-height: 35px;
    text-align: center;
    border-radius: 3px;
}
.right ul li .ant-calendar-picker{
    width: 90%;
}
.right ul li input:hover{
    border:1px solid #1890ff;
}
.right .actions span{
    cursor: pointer;
}
.right ul li:nth-child(1){
    width: 10%;
}
.right ul li:nth-child(2){
    width: 20%;
    cursor: pointer;
}
.right ul li:nth-child(3){
    width: 17.5%;
    cursor: pointer;
}
.right ul li:nth-child(4){
    width: 10%;
}
.right ul li:nth-child(5){
    width: 20%;
    cursor: pointer;
}
.right ul li:nth-child(6){
    width: 22.5%;
}

.materialAddBtn{
    text-align: center;
    font-size: 18px;
    height: 45px;
    line-height: 45px;
    border: 1px solid #e8e8e8;
    border-top: none;
    cursor: pointer;
    /* margin-top: 20px; */
}
</style>