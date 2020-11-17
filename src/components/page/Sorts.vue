<template>
    <div class="sort">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 分类管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row :gutter="10">
                <el-col :sm="12">
                    <div class="handle-box">
                        <el-input
                                placeholder="输入关键字进行过滤"
                                v-model="filterText">
                        </el-input>
                    </div>
                    <el-tree
                            :data="menus"
                            :props="defaultProps"
                            node-key="sortId"
                            @node-click="handleNodeClick"
                            ref="menuTree"
                            :filter-node-method="filterNode"
                            :highlight-current="true"
                            :default-expand-all="true">
                    </el-tree>
                </el-col>
                <el-col :sm="12">
                    <div>
                        <div class="handle-box">
                            <el-button
                                    type="success"
                                    icon="el-icon-plus"
                                    class="handle-del mr10"
                                    @click="addCatagory"
                            >添加分类
                            </el-button>
                            <el-input v-model="query.name" placeholder="名称或别名或描述" class="handle-input mr10"></el-input>
                            <el-button type="primary" icon="el-icon-search" class="mr10" @click="handleSearch">搜索
                            </el-button>
                        </div>
                        <el-table
                                :data="tableData"
                                v-loading="loading"
                                border
                                class="table"
                                ref="multipleTable"
                                header-cell-class-name="table-header"
                        >
                            <el-table-column prop="sortId" label="id" width="55" align="center"></el-table-column>
                            <el-table-column prop="sortName" label="分类名称" align="center"></el-table-column>
                            <el-table-column prop="sortAlias" label="分类别名" align="center"></el-table-column>
                            <el-table-column prop="sortDescription" label="分类描述" align="center"
                                             :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="userId" label="创建用户" align="center"></el-table-column>
                            <el-table-column prop="parentSortId" label="父id" align="center"></el-table-column>
                            <el-table-column prop="sortTime" label="创建时间" width="160"
                                             align="center"></el-table-column>
                            <el-table-column label="操作" width="160" align="center">
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
                </el-col>
            </el-row>
        </div>


        <!-- 分类的填写和编辑-->
        <el-dialog title="分类" :visible.sync="addSort" width="60%" @close="closeDialog">
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

    import { sortsCatagorysApi, sortsListApi, sortsAddApi,sortsInfoApi,sortsUpdateApi,sortsDeleteApi} from '../../api/sorts';


    export default {
        name: 'basetable',
        data() {
            return {
                addSort: false,
                isRouterAlive: true,
                query: {
                    sortId: null,
                    name: '',
                    page: 1,
                    limit: 10
                },
                tableData: [],
                menus: [],
                token: this.$store.getters.getToken,
                pageTotal: 0,
                loading: true,
                flag: true,
                sortForm: {
                    sortId: '',
                    sortName: '',
                    sortAlias: '',
                    sortDescription: '',
                    parentSortId: 0
                },
                rules: {
                    sortName: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' }
                    ],
                    sortAlias: [
                        { required: true, message: '请输入分类别名', trigger: 'blur' }
                    ],
                    sortDescription: [
                        { required: true, message: '请选择分类描述', trigger: 'change' }
                    ]
                },
                filterText: '',
                defaultProps: {
                    children: 'children',
                    label: 'sortName',
                    id: 'sortId'
                }
            };
        },
        //检测数据变化
        watch: {
            filterText(val) {
                this.$refs.menuTree.filter(val);
            }
        },
        created() {
            this.getData(this.query);
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.sortName.indexOf(value) !== -1;
            },
            handleNodeClick(data) {
                //设置父id
                this.$set(this.sortForm, 'parentSortId', data.sortId);
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'page', 1);
                this.sortsList(this.query, this.token);
            },
            // 获取文章列表数据
            getData(query) {
                //获取分类数据
                this.sortsCatagory(this.token);
                //获取表格数据
                this.sortsList(query, this.token);
            },
            async sortsCatagory(token) {
                try {
                    const res = await sortsCatagorysApi(token);
                    this.menus = res.data;
                } catch (e) {
                    this.$message.error(e);
                }
            },
            async sortsList(query, token) {
                try {
                    this.loading = true
                    const res = await sortsListApi(query, token);
                    this.tableData = res.data.list;
                    this.pageTotal = res.data.totalCount || 0;
                    this.loading = false
                } catch (e) {
                    this.$message.error(e);
                }

            },
            async sortsAdd(sortForm,token){
                try{
                    const res = await sortsAddApi(sortForm,token);
                    if(res.code == 0){
                        //重新设0
                        this.$set(this.sortForm, 'parentSortId', 0);
                        this.$message.success('添加成功');
                        //关闭弹窗
                        this.addSort = false;
                        //重新渲染树
                        this.sortsCatagory(this.token);
                        //重新渲染表格
                        this.$set(this.query, 'page', 1);
                        this.sortsList(this.query, this.token);
                    }else{
                        this.$message.warning(res.msg);
                    }
                }catch (e) {
                    this.$message.error(e);
                }
            },
            async sortsUpdate(sortForm,token){
              try{
                  const res = await sortsUpdateApi(sortForm,token);
                  if(res.code == 0){
                      this.$message.success('编辑成功');
                      //关闭弹窗
                      this.addSort = false;
                      //重新渲染树
                      this.sortsCatagory(this.token);
                      //重新渲染表格
                      this.sortsList(this.query, this.token);
                  }else{
                      this.$message.warning(res.msg);
                  }
              }catch (e) {
                  this.$message.error(e);
              }
            },
            async sortsInfo(sortId,token){
                try{
                    const res = await sortsInfoApi(sortId,token);
                    this.sortForm = res.data;
                }catch (e) {
                    this.$message.error(e);
                }
            },
            // 删除操作
            async handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除该分类和它子分类吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    return sortsDeleteApi(row.sortId, this.token);
                }).then(res => {
                    if (res.code == 0) {
                        this.$message.success('删除成功');
                        this.$set(this.query, 'page', 1);
                        this.getData(this.query);
                    }else{
                        this.$message.warning(res.msg);
                    }
                }).catch((e) => {
                    this.$message.error(e);
                });
            },
            // 编辑操作
            async handleEdit(index, row) {
                this.addSort = true;
                this.flag = false;
                this.sortsInfo(row.sortId,this.token);
            },
            // 分页导航
            handlePageChange(val) {
                //重新加载表格数据
                this.$set(this.query, 'page', val);
                this.sortsList(this.query, this.token);
            },
            //添加和编辑
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.flag) {
                            //添加分类
                            this.sortsAdd(this.sortForm, this.token);
                        } else {
                            this.sortsUpdate(this.sortForm, this.token)
                        }
                    } else {
                        return false;
                    }
                });
            },
            //关闭弹窗重置表单
            closeDialog() {
                this.$refs.sortForm.resetFields();
            },
            addCatagory() {
                this.addSort = !this.addSort;
                this.flag = true;
            }
        }
    };
</script>

<style>
    .sort .handle-box {
        margin-bottom: 20px;
    }

    .sort .handle-input {
        width: 300px;
        display: inline-block;
    }

    .sort .table {
        width: 100%;
        font-size: 14px;
    }

    .sort .red {
        color: #ff0000;
    }

    .sort .mr10 {
        margin-right: 10px;
    }

    .sort .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }

    .sort .ql-snow .ql-picker-label::before {
        position: absolute !important;
    }
</style>
