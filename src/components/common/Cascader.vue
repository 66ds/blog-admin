<template>
    <div>
        <el-cascader
                v-model="value"
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
                }
            };
        },
        props: ['options', 'value'],
        methods: {
            handleChange(value) {
                this.$emit('sortCatagory', this.value);
            }
        }
    };

</script>


<style>


</style>
