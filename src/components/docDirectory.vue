// 档案目录
<template>
    <div class="outer">

        <div class="bundleContainer">
            <MsgTip :msgTip="msgTip" :msgIndex="msgIndex" :watcherState="watcherState" :closeState="closeState"></MsgTip>
        </div>

        <!-- 左侧树 -->
        <div class="left"  @click="changeIndex()">
            <a-directory-tree
                :treeData="treeData"
                :defaultExpandedKeys="defaultExpandedKeys"
                :defaultSelectedKeys="selectedKeys"
                :selectedKeys="selectedKeys"
                :expandedKeys="expandedKeys"
                @select="onSelect"
                @expand="onExpand"
            ></a-directory-tree>
        </div>

        <!-- 右侧列表 -->
        <div class="right">
            <!-- 图片列表 -->
            <draggable v-model="currentList" group="people" @start="drag=true" @end="drag=false" class="dragContainer">
                <div v-for="(element,index) in currentList" :key="index" class="dragElement">
                    <div class="elementLeft">
                        <div class="elementImg">
                            <img :src="element.imgData" alt="" @click="openImgCheck(index)">
                        </div>
                        <span>{{element.name}}</span>
                    </div>
                    <div class="elementRight">
                        <a-input-search 
                            placeholder="输入调整的顺序值" 
                            v-show='element.onChange' 
                            v-model="targetIndex" 
                            type='number' 
                            @search='changeIndex(index,false)'
                        >
                            <a-button slot="enterButton">调 序</a-button>
                        </a-input-search>
                        <a-button v-show="!element.onChange" @click="changeIndex(index,true)">调 序</a-button>
                        <a-popconfirm title="确定要删除吗?" @confirm="confirmDelete(index)"  okText="确定" cancelText="取消">
                            <a-button>删 除</a-button>
                        </a-popconfirm>
                    </div>
                </div>
            </draggable>

        </div>
        <!-- 图片查看 -->
        <a-modal
            centered 
            @cancel="handleCancel"
            title="图片查看"
            :visible="checkImgModalStatus"
            :footer='null'
            :width ="1200"
            :maskClosable='true'
            :mask='false'
            class="imgModal"
        >
            <div class="checkImgContainer" v-if="checkImgModalStatus">
                <swiper :options="swiperOption" ref="mySwiper">
                    <!-- slides -->
                    <swiper-slide v-for="(item,index) in currentList" :key="index">
                        <img :src="item.imgData" alt="" />
                    </swiper-slide>
                    <div class="swiper-button-prev" slot="button-prev"></div>
                    <div class="swiper-button-next" slot="button-next"></div>
                </swiper>
            </div>
        </a-modal>
    </div>    
</template>

<script>
import 'swiper/dist/css/swiper.css'
import draggable from 'vuedraggable';
import MsgTip from './msgTip';
import { swiper, swiperSlide } from 'vue-awesome-swiper'
// import { debug } from 'util';
// import { setTimeout, clearTimeout } from 'timers';

export default {
    name:'DocDirectory',
    // 需要父组件传userId
    props:["userId","ramdomKey"],
    components:{
        draggable,
        swiper,
        swiperSlide,
        MsgTip,
    },
    data(){
        return{
            treeData:null,
            defaultExpandedKeys:[],
            selectedKeys:[],
            expandedKeys:[],
            currentList:[],
            // 操作提示信息
            msgTip:'',
            msgIndex:0,
            watcherState:Math.random(),
            closeState:false,
            // 调整顺序的目标index
            targetIndex:'',

            // 图片查看
            swiperOption:{
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                initialSlide:0,
            },
            checkImgModalStatus:false,
            currentIndex:0,
        }
    },

    computed:{
       
    },

    created(){
        this.getUerDirectory(this.userId);
        // this.$http.fetchGet('digitalArchives@personnelList.action?page=1&limit=10&name=&nodeId=01')
        //     .then((res)=>{console.log(res)})
    },

    methods:{
        // 获取用户档案目录数据
        getUerDirectory(userId){
            const _this = this;
            this.$http.fetchGet('digitalArchives@loadArchiveTree.action',{
                a01000:userId,
            }).then((res)=>{
                if(Number(res.code) === 0){
                    _this.treeData = _this.getTreeData(res.data);
                    console.log(_this.treeData)
                    _this.defaultExpandedKeys.push(_this.treeData[0].key);
                    _this.expandedKeys.push(_this.treeData[0].key);
                }else{
                    // 提示数据失败
                    _this.alertTip('抱歉,用户档案目录信息不存在',2,false);
                }
            }).catch((err)=>{
                if(err){
                    // 提示数据失败
                    _this.alertTip('抱歉,网络错误了,请稍后重试',3,false);
                }
            })
        },

        // 抽取树结构数据
        getTreeData(data){
            // debugger;
            let deep = 0;
            function mapData(data){
                ++ deep ;
                // console.log(deep)
                data && data.length > 0 && data.forEach((item,index)=>{
                    if(item.name && item.id){
                        item.title = item.name;
                        item.key = item.id;
                        if(deep >= 2){
                            item.isLeaf = true;
                        }
                        // 如果当前为最后一个遍历的值
                        if(index === data.length-1){
                            --deep;
                        }
                        if(item.hasOwnProperty('checked')){
                            delete item.checked;
                        }
                        if(item.hasOwnProperty('isParent')){
                            delete item.isParent;
                        }
                        if(item.hasOwnProperty('open')){
                            delete item.open;
                        }
                        if(item.hasOwnProperty('type')){
                            delete item.type;
                        }
                        if(item.children && item.children.length > 0){
                            mapData(item.children);
                        }
                    }
                })
            }
            mapData(data);
            return data;
        },

        openImgCheck(index){
            this.swiperOption.initialSlide = index;
            this.checkImgModalStatus = true;
        },
        // 关闭
        handleCancel(){
            this.checkImgModalStatus = false;
        },

        confirmDelete(index){
            this.currentList.splice(index,1)
        },

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

        changeIndex(index,status){
            // console.log(index)
            const {currentList,targetIndex} = this;
            currentList.forEach((item)=>{item.onChange = false});
            if(!index && index !== 0) return;
            // 调序
            if(!status){
                if(targetIndex < 1){
                    this.targetIndex = '';
                    this.alertTip('请输入大于0的整数',2,false);
                    this.currentList[index].onChange = true;
                }else{
                    let tempItem = currentList[index];
                    this.currentList.splice(index,1);
                    this.currentList.splice(targetIndex-1,0,tempItem);
                    this.currentList[index].onChange = status;
                    this.alertTip('',0,true);
                }
            }else{
                this.currentList[index].onChange = status;
                this.currentList = [...this.currentList];
            }
        },

        // 选择树
        onSelect(keys,e){
            // console.log(this.selectedKeys);
            let _this = this;
            if(e.node.isLeaf){
                this.selectedKeys = [keys[0]]; // 点击叶子节点选中,非叶子节点不让选中
                this.$http.fetchGet('digitalArchives@catagFileList.action',{
                    catagId:keys[0],
                }).then((res)=>{
                    if(Number(res.code) === 0){
                        _this.currentList = res.data;
                        _this.currentList.forEach((item)=>{
                            item.imgData = _this.$targetHost+item.filePath.substr(2);
                            item.name = item.fileName;
                            item.onChange = false;
                        });
                    }else{
                        _this.alertTip('未找到此材料的数据',2,false);
                    }
                   
                }).catch(()=>{
                    _this.alertTip('抱歉,网络错误了,请稍后重试',3,false);
                })
            }
        },
        onExpand(keys){
            this.expandedKeys = keys;
        }

    },
    
    watch: {
        ramdomKey:{
            handler:function(){
                this.getUerDirectory(this.userId);
                this.currentList = [];
                this.selectedKeys = [];
                this.expandedKeys = [];
            },
           deep:true,//深度监听
        }
    },
}
</script>

<style scoped>
    .checkImgContainer,
    .outer{
        min-height: 600px;
        max-height: 600px;
        display: flex;
        position: relative;
        margin-top: 0;
    }
    .bundleContainer{
        position:absolute;
        width: 80%;
        right: 0;
        top:0;
        z-index: 1000;
    }
    .checkImgContainer{
        padding: 20px;
        box-sizing: border-box;
        overflow-y: auto;
        width:100%;
    }
    .left{
        width: 20%;
        padding: 20px;
        box-sizing: border-box;
        border-right: 3px solid #e8e8e8;
    }
    .right{
        flex:1;
        /* padding: 20px 20px 20px 0; */
        overflow-y: auto;
    }
    /* drag elements style*/
    .dragContainer{
        border-bottom: 1px solid #e8e8e8;
    }
    .dragElement{
        width: 100%;
        padding: 0 10px;
        border-bottom: 1px solid #e8e8e8;
        cursor: pointer;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
    }
    .elementLeft{
        display: flex;
    }
    .elementLeft .elementImg{
        width: 60px;
        height: 75px;
        margin-right: 40px;
    }
    .elementLeft .elementImg img{
        width: 100%;
        height: 100%;
    }
    .elementLeft span{
        line-height: 75px;
    }
    .elementRight{
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .elementRight>button,.ant-input-affix-wrapper{
        margin:5px;
    }
    .checkImgContainer img{
        width: 70%;
        max-height: 550px;
    }
    .checkImgContainer .swiper-slide{
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

