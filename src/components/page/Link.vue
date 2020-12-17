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
                <el-table-column prop="linkName" label="友链名称" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="linkUrl" label="友链地址" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="linkEmail" label="友链邮箱" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="linkDesc" label="友链信息" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
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
        <!-- 友链的编辑-->
        <el-dialog title="文章" :visible.sync="addLink" width="60%" @close="closeDialog">
            <el-form :model="linkForm" :rules="rules" ref="linkForm" label-width="80px" label-position="right"
                     class="demo-ruleForm">
                <el-form-item label="友链名称" prop="linkName">
                    <el-input v-model="linkForm.linkName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="友链地址" prop="linkUrl">
                    <el-input v-model="linkForm.linkUrl" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="友链邮箱" prop="linkEmail">
                    <el-input v-model="linkForm.linkEmail" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="友链信息" prop="linkDesc">
                    <el-input v-model="linkForm.linkDesc" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否审核" prop="linkAllow">
                    <el-switch v-model="linkForm.linkAllow" :inactive-value="0" :active-value="1"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addLink = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('linkForm')">编辑</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        selectFriendLinkListApi,
        selectLinkInfoApi,
        updateLinkInfoApi,
        linkDeleteBatchApi,
        linkDeleteApi
    } from '../../api/link.js';

    let checkEmail = (rule, value, callback) => {
        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        if (!value) {
            return callback(new Error('请输入邮箱地址'))
        }
        setTimeout(() => {
            if (mailReg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的邮箱格式'))
            }
        }, 100)
    };
    let checkUrl = (rule, value, callback) => {
        const reg = new RegExp(
            /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
        )
        if (value === '') {
            callback(new Error('请输入站点地址'))
        } else if (!reg.test(value)) {
            callback(new Error('请输入正确的站点地址'))
        } else {
            callback()
        }
    }
    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    content: '',
                    page: 1,
                    limit: 10
                },
                addLink: false,
                loading: true,
                tableData: [],
                delList: [],
                pageTotal: 0,
                linkForm: {
                    linkId: '',
                    linkName: '',
                    linkUrl: '',
                    linkEmail:'',
                    linkDesc:'',
                    linkAllow:0
                },
                rules: {
                    linkName: [
                        { required: true, message: '请输入站点名称', trigger: 'blur' },
                    ],
                    linkUrl: [
                        { required: true,validator: checkUrl, trigger: 'change' }
                    ],
                    linkEmail: [
                        { required:true, validator: checkEmail,trigger: 'change' }
                    ],
                    linkDesc: [
                        { required: true,message: '请输入站点描述', trigger: 'blur' }
                    ],
                    linkAllow: [
                        { required: true,trigger: 'blur' },
                    ],
                }
            };
        },
        components: {},
        created() {
            this.getData(this.query);
        },
        methods: {
            // 获取文章列表数据
            getData(query) {
                this.loading = true;
                selectFriendLinkListApi(query).then(res => {
                    this.tableData = res.data.list;
                    this.pageTotal = res.data.totalCount || 0;
                    this.loading = false;
                }).catch(e => {
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
                val = val.map(item => item.linkId);
                this.delList = val;
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'page', val);
                this.getData(this.query);
            },
            //编辑操作
            handleEdit(index, row) {
                //打开弹窗
                this.addLink = true;
                //获取单个友链信息
                this.selectLinkInfo(row.linkId);
            },
            //关闭弹窗重置表单
            closeDialog() {
                this.$refs.linkForm.resetFields();
            },
            //批量删除友链
            delAllSelection() {
                if (this.delList.length == 0) {
                    return this.$message.warning('请先选择');
                }
                // 二次确认删除
                this.$confirm(`确定要删除${this.delList}吗？`, '提示', {
                    type: 'warning'
                }).then(() => {
                    return linkDeleteBatchApi(this.delList);
                }).then(res => {
                    this.$message.success(res.msg);
                    this.handleSearch();
                }).catch((e) => {
                    this.$message.error(e);
                });
            },
            // 删除单个友链
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    return linkDeleteApi(row.linkId);
                }).then(res => {
                    this.$message.success(res.msg);
                    this.handleSearch();
                }).catch((e) => {
                    this.$message.error(e);
                });
            },
            //编辑
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.updateLinkInfo(this.linkForm);
                    } else {
                        return false;
                    }
                });
            },
            //修改留言内容
            async updateLinkInfo(linkForm) {
                try {
                    const res = await updateLinkInfoApi(linkForm);
                    this.$message.success(res.msg);
                    //关闭弹窗
                    this.addLink = false;
                    //刷新内容
                    this.handleSearch();
                } catch (e) {
                    this.$message.error(e);
                }
            },
            //查询单个友链信息
            async selectLinkInfo(linkId) {
                try {
                    const res = await selectLinkInfoApi(linkId);
                    this.linkForm = res.data;
                } catch (e) {
                    this.$message.error(e);
                }
            }

        }
    };
</script>

<style>
    @media only screen and (min-width: 321px) and (max-width: 768px) {
        .link .handle-box {
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
