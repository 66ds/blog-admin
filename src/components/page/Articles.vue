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
                <el-select v-model="query.type" placeholder="模式" clearable  class="handle-select mr10">
                        <el-option label="私有" value="0"></el-option>
                        <el-option label="公开" value="1"></el-option>
                        <el-option label="仅为好友看" value="2"></el-option>
                </el-select>
                <el-select v-model="query.up" placeholder="置顶" clearable class="handle-select mr10">
                    <el-option label="非置顶" value="0"></el-option>
                    <el-option label="置顶" value="1"></el-option>
                </el-select>
                <el-select v-model="query.support" placeholder="推荐" clearable class="handle-select mr10">
                    <el-option label="非推荐" value="0"></el-option>
                    <el-option label="推荐" value="1"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="标题或内容" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button
                        type="success"
                        icon="el-icon-plus"
                        class="handle-del mr10"
                        @click="handleAdd"
                >添加文章
                </el-button>
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
                <el-table-column prop="articleId" label="id" width="55" align="center"></el-table-column>
                <el-table-column prop="userId" label="发表用户" align="center"></el-table-column>
                <el-table-column prop="articleTitle" label="标题" align="center"></el-table-column>
                <el-table-column prop="articleContentOrigin" label="内容" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="articleViews" label="浏览量" align="center"></el-table-column>
                <el-table-column prop="articleCommentCount" label="评论总数" align="center"></el-table-column>
                <el-table-column prop="articleLikeCount" label="文章赞总数" align="center"></el-table-column>
                <el-table-column prop="articleType" label="模式" align="center">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.articleType==0?'私有':scope.row.articleType==1?'公开':'仅为好友看'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="articleUp" label="是否置顶" align="center">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.articleUp==0?'非置顶':'置顶'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="articleSupport" label="是否推荐" align="center">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.articleSupport==0?'非推荐':'推荐'}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="articleDate" label="发布时间" width="160" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
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


        <!-- 文章的填写和编辑-->
        <el-dialog title="文章" :visible.sync="addArticle" width="60%" @close="closeDialog">
            <el-form :model="articleForm" :rules="rules" ref="articleForm" label-width="80px" label-position="right"
                     class="demo-ruleForm">
                <el-form-item label="文章标题" prop="articleTitle">
                    <el-input v-model="articleForm.articleTitle" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="文章介绍" prop="articleIntroduce">
                    <el-input v-model="articleForm.articleIntroduce" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="文章内容" prop="articleContentOrigin">
                    <!-- 图片上传组件辅助-->
                    <mavon-editor ref="md" v-model="articleForm.articleContentOrigin" @imgAdd="$imgAdd"
                                  @change="getValue"
                                  style="min-height: 600px;border: 1px solid #DCDFE6;box-shadow: 0 0 0 0;"/>
                </el-form-item>
                <el-form-item label="文章模式" prop="articleType">
                    <el-select v-model="articleForm.articleType" placeholder="请选择文章模式">
                        <el-option label="私有" :value="0"></el-option>
                        <el-option label="公开" :value="1"></el-option>
                        <el-option label="仅为好友看" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章标签" prop="labelNames">
                    <el-select
                            v-model="articleForm.labelNames"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            placeholder="允许填写多个">
                    </el-select>
                </el-form-item>
                <el-form-item label="文章分类" prop="sortIds">
                    <cascader :options="data" :value="articleForm.sortIds" @sortCatagory="sortCatagory"/>
                </el-form-item>
                <el-form-item label="是否置顶" prop="articleUp">
                    <el-switch v-model="articleForm.articleUp" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item label="是否推荐" prop="articleSupport">
                    <el-switch v-model="articleForm.articleSupport" :inactive-value="0" :active-value="1"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addArticle = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('articleForm')">{{flag==true?'添加':'编辑'}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        articlesListApi,
        fileUploadApi,
        articlesAddApi,
        articlesInfoApi,
        articlesUpdateApi,
        articlesDeleteApi,
        articlesDeleteBatchApi
    } from '../../api/articles';
    import {sortsCatagorysApi} from '../../api/sorts'
    import Cascader from '../common/Cascader';
    import { mavonEditor } from 'mavon-editor';
    import 'mavon-editor/dist/css/index.css';

    export default {
        name: 'basetable',
        data() {
            return {
                addArticle: false,
                query: {
                    type: '',
                    name: '',
                    up:'',
                    support:'',
                    page: 1,
                    limit: 10
                },
                loading:true,
                tableData: [],
                delList: [],
                pageTotal: 0,
                data:[],
                flag: true,
                articleForm: {
                    articleId: '',
                    articleTitle: '',
                    articleContent: '',
                    articleType: '',
                    articleIntroduce:'',
                    articleUp: 0,
                    articleSupport: 0,
                    articleContentOrigin: '',
                    labelNames:[],
                    sortIds:[]
                },
                rules: {
                    articleTitle: [
                        { required: true, message: '请输入文章标题', trigger: 'blur' }
                    ],
                    articleContentOrigin: [
                        { required: true, message: '请输入文章内容', trigger: 'blur' }
                    ],
                    articleType: [
                        { required: true, message: '请选择文章模式', trigger: 'change' }
                    ],
                    labelNames: [
                        { required: true, message: '请输入文章标签', trigger: 'blur' }
                    ],
                    articleIntroduce:[
                        { required: true, message: '请输入文章介绍', trigger: 'blur' }
                    ],
                    sortIds:[
                        { required: true, message: '请输入文章分类', trigger: 'blur' }
                    ],
                }
            };
        },
        components: {
            mavonEditor,
            Cascader
        },
        created() {
            this.getData(this.query);
        },
        methods: {
            // 获取文章列表数据
            getData(query) {
                this.loading = true
                articlesListApi(query).then(res => {
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
                    return articlesDeleteApi(row.articleId);
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
                    return articlesDeleteBatchApi(this.delList);
                }).then(res => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                        this.handleSearch()
                    }
                }).catch((e) => {
                    this.$message.error(e);
                });
            },
            sortsCatagory(){
                sortsCatagorysApi().then(res=>{
                    this.data = res.data
                }).catch(e=>{
                    this.$message.error(e);
                })
            },
            articlesInfo(articleId){
                articlesInfoApi(articleId).then(res => {
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
            handleAdd(){
                this.sortsCatagory();
                this.addArticle=!this.addArticle;
                this.flag=true
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'page', val);
                this.getData(this.query);
            },
            //添加和编辑
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.flag) {
                            articlesAddApi(this.articleForm).then(res => {
                                if (res.code == 0) {
                                    this.$message.success('添加成功');
                                    //关闭弹窗
                                    this.addArticle = false;
                                    //重新渲染表格
                                    this.handleSearch()
                                } else {
                                    this.$message.warning(res.msg);
                                }
                            }).catch(e => {
                                this.$message.error(e);
                            });
                        } else {
                            articlesUpdateApi(this.articleForm).then(res => {
                                if (res.code == 0) {
                                    this.$message.success('编辑成功');
                                    //关闭弹窗
                                    this.addArticle = false;
                                    //重新渲染表格
                                    this.handleSearch()
                                } else {
                                    this.$message.warning(res.msg);
                                }
                            }).catch(e => {
                                this.$message.error(e);
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            getValue(value, html) {
                this.articleForm.articleContent = html;
            },
            //上传图片markdown
            $imgAdd(pos, $file) {
                // 第一步.将图片上传到服务器.
                let formdata = new FormData();
                formdata.append('file', $file);
                fileUploadApi(formdata).then(res => {
                    if (res.code == 0) {
                        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                        // $vm.$img2Url 详情见本页末尾
                        this.$message.success('上传成功');
                        this.$refs.md.$img2Url(pos, res.data);
                    } else {
                        this.$message.error('上传失败');
                        this.$refs.md.$refs.toolbar_left.$imgDelByFilename(res.msg);
                    }
                }).catch(e => {
                    this.$message.error(e);
                });
            },
            //关闭弹窗重置表单
            closeDialog() {
                this.$refs.articleForm.resetFields();
            },
            sortCatagory(val){
                this.articleForm.sortIds = val
            }
        }
    };
</script>

<style>
    @media only screen and (min-width: 321px) and (max-width: 768px){
       .article .handle-box{
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
