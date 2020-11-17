<template>
    <div>
        <el-cascader
                filterable
                clearable
                v-model="val"
                :options="options"
                @change="handleChange"
                placeholder="请输入文章分类"
                :props="props"></el-cascader>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                props: {
                    label: 'sortName',
                    value: 'sortId'
                },
                //监听下面的value变化
                val:''
            };
        },
        watch: {
            value(newV,oldV) {
               this.val = newV
            }
        },
        props: ['options', 'value'],
        methods: {
            handleChange(value) {
                this.$emit('sortCatagory', this.val);
            }
        }
    };

</script>


<style>


</style>
