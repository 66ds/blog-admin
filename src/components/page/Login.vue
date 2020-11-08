<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content" v-if="ishow">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <div class="login-tips">还没有账号?&nbsp;<a href="#" @click="ishow=!ishow">免费注册</a><div/>
                </div>
            </el-form>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content" v-else>
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-phone"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-message"></el-button>
                        <el-button slot="append" type="primary" @click="send">{{message}}</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                            type="password"
                            placeholder="password"
                            v-model="param.password"
                            @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">注册</el-button>
                </div>
                <div class="login-tips">已有账号?&nbsp;<a href="#" @click="ishow=!ishow">立即登录</a><div/>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            flag:true,
            ishow:false,
            message:'发送验证码',
            number:60,
            param: {
                username: 'admin',
                password: '123123',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.$message.success('登录成功');
                    localStorage.setItem('ms_username', this.param.username);
                    this.$router.push('/');
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        sendCode(){
            if(this.number == 0){
                this.flag=true
                this.message="发送验证码"
                this.number=60
            }else{
                console.log("11111")
                this.flag=false
                this.message = this.number+"秒再次发送"
                this.number--;
                setTimeout(()=>this.sendCode(),1000);
            }
        },
        send(){
            if(!this.flag){
                console.log("操作频繁")
            }else{
                this.sendCode()
            }
        }
    },
};
</script>

<style>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips{
    font-size: 12px;
}
.login-tips a{
    color: #4477d0;
}
.el-button>span{
    font-size: 5px !important;
}
</style>