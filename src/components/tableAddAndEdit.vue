<!-- 可编辑 - 可添加表格 -->
<template>
    <div class="editAndAddContainer">
        <a-table :columns="tableData.columns" :dataSource="tableData.dataSource" >

            <template slot="operation" slot-scope="text, record, index">
                <div class='editable-row-operations'>
                    <span v-if="record.editable">
                    <a @click="() => save(record.key)">Save</a>
                    <a-popconfirm title='Sure to cancel?' @confirm="() => cancel(record.key)">
                        <a>Cancel</a>
                    </a-popconfirm>
                    </span>
                    <span v-else>
                    <a @click="() => edit(record.key)">Edit</a>
                    </span>
                </div>
            </template>
            
        </a-table>
    </div>
</template>

<script>

export default {
    name:"TableAddAndEdit",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    props:[""],

    data() {
        return {
            tableData:{
                column:[
                    {
                        title:'name',
                        dataIndex:'name',
                        width:150,
                    },
                    {
                        title:'age',
                        dataIndex:'age',
                        width:100,
                    },
                    {
                        title:'address',
                        dataIndex:'address',
                        width:250,
                    },
                    {
                        title:'date',
                        dataIndex:'date',
                        width:200,
                    },
                    {
                        title:'select',
                        dataIndex:'select',
                        width:150,
                    },
                    {
                        title:'operation',
                        dataIndex:'operation',
                        width:150,
                    },
                ],
                editColArr:[],
                dataSource:[],
            }
        };
    },

    //监听属性 类似于data概念
    computed: {},

    //监控data中的数据变化
    watch: {
        
    },

    //方法集合
    methods: {

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

</style>