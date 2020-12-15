<template>
    <div class="article">
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
                <el-input v-model="query.content" placeholder="内容或系统或浏览器" class="handle-input mr10"></el-input>
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
                <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
                <el-table-column prop="stayUserIp" label="用户IP地址" align="center"></el-table-column>
                <el-table-column prop="messageContent" label="留言内容" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="messageStayTime" label="留言时间" align="center"></el-table-column>
                <el-table-column prop="staySys" label="系统" align="center"></el-table-column>
                <el-table-column prop="stayChrome" label="浏览器" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="stayForm.stayMessageEntity"
                                type="text"
                                icon="el-icon-edit"
                                @click="checkReply(scope.$index, scope.row)"
                        >查看回复
                        </el-button>
                        <el-button v-else
                                   type="text"
                                   icon="el-icon-edit"
                                   @click="publishReply(scope.$index, scope.row)"
                        >发表回复
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
        <el-dialog title="分类" :visible.sync="addStay" width="60%" @close="closeDialog">
            <el-form :model="sortForm" :rules="rules" ref="sortForm" label-width="80px" label-position="right"
                     class="demo-ruleForm">
                <el-form-item label="分类名称" prop="sortName">
                    <el-input v-model="sortForm.sortName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="sortAlias">
                    <el-input v-model="sortForm.sortAlias" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类描述" prop="sortDescription">
                    <el-input v-model="sortForm.sortDescription" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addSort = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('sortForm')">{{flag==true?'添加':'编辑'}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {stayMessageListApi} from '../../api/stay.js'
    import {
        articlesListApi,
        articlesInfoApi,
        articlesDeleteApi,
        articlesDeleteBatchApi
    } from '../../api/articles';
    import {sortsCatagorysApi} from '../../api/sorts'
    import 'mavon-editor/dist/css/index.css';

    export default {
        name: 'basetable',
        data() {
            return {
                addStay: false,
                query: {
                    content:'',
                    page: 1,
                    limit: 10
                },
                loading:true,
                tableData: [],
                delList: [],
                pageTotal: 0,
                data:[],
                flag: true,
                stayForm: {
                    stayId: '',
                    messageContent: '',
                    messageStayTime: '',
                    userName: '',
                    userImg:'',
                    staySys: 0,
                    stayChrome: 0,
                    stayUserIp: '',
                    stayMessageEntity:'',
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
                stayMessageListApi(query).then(res => {
                    console.log(res)
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
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    return articlesDeleteApi(row.articleId, this.$store.getters.getToken);
                }).then(res => {
                    if (res.code == 0) {
                        this.$message.success('删除成功');
                        this.handleSearch()
                    }
                }).catch((e) => {
                    this.$message.error(e);
                });
            },
            // 多选操作
            handleSelectionChange(val) {
                val = val.map(item => item.articleId)
                this.delList = val;
            },
            delAllSelection() {
                if(this.delList.length == 0){
                    return  this.$message.warning("请先选择");
                }
                // 二次确认删除
                this.$confirm(`确定要删除${this.delList}吗？`, '提示', {
                    type: 'warning'
                }).then(() => {
                    return articlesDeleteBatchApi(this.delList, this.$store.getters.getToken);
                }).then(res => {
                    if (res.code == 0) {
                        this.$message.success('删除成功');
                        this.handleSearch()
                    }
                }).catch((e) => {
                    this.$message.error(e);
                });
            },
            sortsCatagory(){
                sortsCatagorysApi(this.$store.getters.getToken).then(res=>{
                    this.data = res.data
                }).catch(e=>{
                    this.$message.error(e);
                })
            },
            articlesInfo(articleId){
                articlesInfoApi(articleId, this.$store.getters.getToken).then(res => {
                    if (res.code == 0) {
                        this.articleForm = res.data;
                        if(res.data.labelsEntityList != ''&& res.data.labelsEntityList != null){
                            //视图层更新
                            this.$set(this.articleForm, 'labelNames', res.data.labelsEntityList.map(item=>item.labelName))
                        }
                    }
                }).catch(e => {
                    this.$message.error(e);
                });
            },
            // 编辑操作
            handleEdit(index, row) {
                this.addArticle = true;
                this.flag = false;
                this.sortsCatagory();
                this.articlesInfo(row.articleId)
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'page', val);
                this.getData(this.query);
            },
            getValue(value, html) {
                this.articleForm.articleContent = html;
            },
            //关闭弹窗重置表单
            closeDialog() {
                this.$refs.articleForm.resetFields();
            }
        }
    };
</script>

<style>
    @media only screen and (min-width: 321px) and (max-width: 768px){
        .handle-box{
            display: none;
        }
    }
    .article .handle-box {
        margin-bottom: 20px;
    }

    .article .handle-select {
        width: 120px;
    }

    .article .handle-input {
        width: 300px;
        display: inline-block;
    }

    .article .table {
        width: 100%;
        font-size: 14px;
    }

    .article .red {
        color: #ff0000;
    }

    .article .mr10 {
        margin-right: 10px;
    }

    .article .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }

    .article .ql-snow .ql-picker-label::before {
        position: absolute !important;
    }
</style>
