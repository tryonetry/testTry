// 档案目录
<template>
    <div class="outer">

        <!-- 左侧树 -->
        <!-- @click="changeIndex(null,false,null)" -->
        <div class="left">
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
            <!-- 阅读器-->
            <iframe id="readerIframe" ref="iframe" :src="iframeUrl" frameborder="0"></iframe>
        </div>
    </div>    
</template>

<script>


export default {
    name:'DocDirectory',
    // 需要父组件传userId
    props:["userId","ramdomKey"],
    components:{
    },
    data(){
        return{
            // 树
            treeData:null,
            // 默认展开的keys
            defaultExpandedKeys:[],
            // 选择的keys
            selectedKeys:[],
            // 展开的keys
            expandedKeys:[],
            // 当前的列表
            currentList:[],
           
            initParamsObj: {
                host: '192.168.1.222',   //主机地址
                port: '7777',   //主机服务端口
                token: 'c179b71f839643899bce954235b0e394',  //授权码 
                appname: 'arch',   //应用ID
                watermark: '', //水印
                defaultimgtype: 0, //图像类型  0 原始图 ；1 高清图像 
                HD: [],  //高清图像数组
                oldPicture: [],  //原始图像数组
                nameArr: [],  //图片名称数组
                aPrintIndexs: [],  //可打印的图片下标数组 
                region: false,   //是否开启区域授权功能
                tempFilePath: '',  //当前文件路径
            },
            iframeUrl: this.$targetHost + 'hasngcadrefile/DReader.html'
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
                    // console.log(_this.treeData)
                    _this.defaultExpandedKeys.push(_this.treeData[0].key);
                    _this.expandedKeys.push(_this.treeData[0].key);
                }else{
                    // 提示数据失败
                    _this.$message.warning('抱歉,用户档案目录信息不存在');
                }
            }).catch((err)=>{
                if(err){
                    // 提示数据失败
                    _this.$message.error('抱歉,网络错误了,请稍后重试');
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
                        if(res.data && res.data.length > 0){
                            let tempItemPath = '';
                            let tempFilePathArr = res.data[0].split('/');
                            for(let i = 5; i < tempFilePathArr.length - 1; i++){
                                    tempItemPath += tempFilePathArr [i] + '/'
                            }

                            _this.initParamsObj.tempFilePath = tempItemPath + '.cadremultip'

                            let tempNameArr = [];
                            res.data.forEach((item, index) => {
                                let tempItemArr = item.split('/');
                                tempNameArr.push(tempItemArr[tempItemArr.length - 1])
                            });
                            _this.initParamsObj.nameArr = [...tempNameArr];
                            // console.log(_this.initParamsObj);
                            try{
                            //调用iframe中的方法
                                _this.$refs.iframe.contentWindow.initReader(_this.initParamsObj);	
                            }catch(e){
                                let count = 0;
                                let timer = setInterval(()=>{
                                    count++;
                                    if(this.$refs.iframe){
                                        clearInterval(timer);
                                        count = 0;
                                        _this.$refs.iframe.contentWindow.initReader(_this.initParamsObj);								
                                    }else if(count > 3){
                                        clearInterval(timer);
                                        count = 0;
                                    }
                                },1000);
                            }
                            _this.currentList = res.data;
                            _this.currentList.forEach((item)=>{
                                item.imgData = _this.$targetHost+item.filePath.substr(2);
                                item.name = item.fileName;
                                item.onChange = false;
                            });
                        } else{
                            this.$message.warning('暂无数据！');
                        }
                    }else{
                        _this.$message.error('抱歉，获取数据失败，请刷新后重试！');
                    }
                   
                })
            }
        },
        onExpand(keys){
            this.expandedKeys = keys;
        }

    },
    
    watch: {
        // 保证每次进来都是最新状态
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
        width: 100%;
    }
    .checkImgContainer{
        padding: 20px;
        box-sizing: border-box;
        overflow-y: auto;
        width:100%;
    }
    .left{
        width: 25%;
        padding: 20px;
        box-sizing: border-box;
        overflow: auto;
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
        padding-right: 20px;
        box-sizing: border-box;
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

    #readerIframe {
        width: 100%; 
        height: 100%;
		border: 1px solid #eee;
	}
</style>

