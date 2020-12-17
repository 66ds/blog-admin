<template>
    <div class="link">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 文章管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="danger"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除
                </el-button>
                <el-input v-model="query.content" placeholder="请输入友链名称或友链信息" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
                    v-loading="loading"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="linkId" label="友链标识" align="center"></el-table-column>
                <el-table-column prop="linkName" label="友链名称" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="linkUrl" label="友链地址" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="linkEmail" label="友链邮箱" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="linkDesc" label="友链信息" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="linkCreateTime" label="友链创建时间" align="center"></el-table-column>
                <el-table-column prop="linkAllow" label="是否审核" align="center">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.linkAllow == 0?'未审核':'已审核'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleDelete(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.page"
                        :page-size="query.limit"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 分类的填写和编辑-->
        <el-dialog title="回复" :visible.sync="addStay" width="60%" @close="closeDialog">
            <el-form :model="stayForm" :rules="rules" ref="stayForm" label-width="80px" label-position="right"
                     class="demo-ruleForm">
                <el-form-item label="留言内容" prop="messageContent">
                    <el-input type="textarea" v-model="stayForm.messageContent" maxlength="100"  show-word-limit :autosize="{ minRows: 4, maxRows: 5}"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addStay = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('stayForm')">{{flag==true?'添加':'编辑'}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {selectFriendLinkListApi,addStayMessageApi,selectStayInfoApi,updateStayInfoApi,stayDeleteBatchApi,stayDeleteApi} from '../../api/link.js'
    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    content:'',
                    page: 1,
                    limit: 10
                },
                addStay: false,
                loading:true,
                tableData: [],
                delList: [],
                pageTotal: 0,
                flag: true,
                stayForm: {
                    stayId: '',
                    messageContent: '',
                    parentStayId:''
                },
                rules: {
                    messageContent: [
                        { required: true, message: '请输入留言内容', trigger: 'blur' }
                    ]
                },
            };
        },
        components: {
        },
        created() {
            this.getData(this.query);
        },
        methods: {
            // 获取文章列表数据
            getData(query) {
                this.loading = true
                selectFriendLinkListApi(query).then(res => {
                    this.tableData = res.data.list;
                    this.pageTotal = res.data.totalCount || 0;
                    this.loading = false;
                }).catch(e=>{
                    this.$message.error(e);
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'page', 1);
                this.getData(this.query);
            },
            // 多选操作
            handleSelectionChange(val) {
                val = val.map(item => item.stayId)
                this.delList = val;
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'page', val);
                this.getData(this.query);
            },
            //关闭弹窗重置表单
            closeDialog() {
                this.$refs.stayForm.resetFields();
            },
            //批量删除留言
            delAllSelection() {
                if(this.delList.length == 0){
                    return  this.$message.warning("请先选择");
                }
                // 二次确认删除
                this.$confirm(`确定要删除${this.delList}吗？`, '提示', {
                    type: 'warning'
                }).then(() => {
                    return stayDeleteBatchApi(this.delList);
                }).then(res => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                        this.handleSearch()
                    }
                }).catch((e) => {
                    this.$message.error(e);
                });
            },
            // 删除单个留言
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    return stayDeleteApi(row.stayId);
                }).then(res => {
                    this.$message.success(res.msg);
                    this.handleSearch()
                }).catch((e) => {
                    this.$message.error(e);
                });
            },
            //发表回复
            publishReply(index,row){
                this.flag = true;
                this.addStay = true;
                this.stayForm.parentStayId = row.stayId;
            },
            //查看留言
            checkReply(index,row){
                this.flag = false
                this.addStay = true
                this.selectStayInfo(row.stayId)
            },
            //添加和编辑
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.flag) {
                            this.addStayMessage(this.stayForm.messageContent,this.stayForm.parentStayId)
                        } else {
                            this.updateStayInfo(this.stayForm)
                        }
                    } else {
                        return false;
                    }
                });
            },
            //公共模块 添加留言并重新刷新留言
            async addStayMessage(content,parentStayId){
                try{
                    const res = await addStayMessageApi(content,parentStayId);
                    this.$message.success(res.msg);
                    //关闭弹窗
                    this.addStay = false
                    //重新刷新表格
                    this.handleSearch()
                }catch (e) {
                    this.$message.error(e)
                }
            },
            //查看parentstayId是stayId的留言信息
            async selectStayInfo(stayId){
                try{
                    const res = await selectStayInfoApi(stayId);
                    this.stayForm = res.data;
                }catch (e) {
                    this.$message.error(e)
                }
            },
            //修改留言内容
            async updateStayInfo(stayForm){
                try{
                    const res = await updateStayInfoApi(stayForm);
                    this.$message.success(res.msg);
                    //关闭弹窗
                    this.addStay = false
                }catch (e) {
                    this.$message.error(e)
                }
            }

        }
    };
</script>

<style>
    @media only screen and (min-width: 321px) and (max-width: 768px){
        .link .handle-box{
            display: none;
        }
    }
    .link .handle-box {
        margin-bottom: 20px;
    }

    .link .handle-select {
        width: 120px;
    }

    .link .handle-input {
        width: 300px;
        display: inline-block;
    }

    .link .table {
        width: 100%;
        font-size: 14px;
    }

    .link .red {
        color: #ff0000;
    }

    .link .mr10 {
        margin-right: 10px;
    }

    .link .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }

    .link .ql-snow .ql-picker-label::before {
        position: absolute !important;
    }
</style>
