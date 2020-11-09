<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content" v-show="!isShow">
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
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="loginForm()">登录</el-button>
                </div>
                <div class="login-tips">还没有账号?&nbsp;<a href="#" @click="change">免费注册</a><div/>
                </div>
            </el-form>
            <el-form :model="param" :rules="rules" ref="register" label-width="0px" class="ms-content"  v-show="isShow">
                <el-form-item prop="phone">
                    <el-input v-model="param.phone" placeholder="phone">
                        <el-button slot="prepend" icon="el-icon-phone"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input v-model="param.code" placeholder="code">
                        <el-button slot="prepend" icon="el-icon-message"></el-button>
                        <el-button slot="append" type="primary" @click="send">{{message}}</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                            type="password"
                            placeholder="password"
                            v-model="param.password"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="registerForm()">注册</el-button>
                </div>
                <div class="login-tips">已有账号?&nbsp;<a href="#" @click="change">立即登录</a><div/>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import { sendCodeApi,userRegisterApi,userLoginApi } from "@/api/index";
function isvalidPhone(str) {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    return reg.test(str)
}
let validPhone=(rule, value,callback)=>{
    if (!value){
        callback(new Error('请输入手机号码'))
    }else  if (!isvalidPhone(value)){
        callback(new Error('请输入正确的11位手机号码'))
    }else {
        callback()
    }
}
export default {
    data: function() {
        return {
            flag:true,
            isShow:false,
            message:'发送验证码',
            number:60,
            param: {
                username: '',
                password: '',
                phone:'',
                code:''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                phone: [{ required: true,validator:validPhone, trigger: 'blur' }],
                code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        loginForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    userLoginApi(this.param.username,this.param.password).then(res=>{
                        if(res.code!=0){
                            this.$message.error(res.msg);
                        }else{
                            // console.log(res)
                            this.$message.success("登录成功");
                            // this.$router.push('/');
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        registerForm() {
            this.$refs.register.validate(valid => {
                if (valid) {
                    // localStorage.setItem('ms_username', this.param.username);
                    userRegisterApi(this.param.phone,this.param.code,this.param.password).then(res=>{
                        if(res.code!=0){
                            this.$message.error(res.msg);
                        }else{
                            this.$message.success("注册成功");
                        }
                    })
                } else {
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
                this.flag=false
                this.message = this.number+"秒再次发送"
                this.number--;
                setTimeout(()=>this.sendCode(),1000);
            }
        },
        send(){
            if(!isvalidPhone(this.param.phone)){
                this.$message.error("请填写正确的手机号")
                return
            }
            if(!this.flag){
                this.$message.error("操作频繁")
            }else{
                sendCodeApi(this.param.phone).then(res=>{
                    if(res.code != 0){
                        this.$message.error(res.msg);
                    }else{
                        this.$message.success("发送成功");
                    }
                })
                this.sendCode()
            }
        },
        change(){
            this.isShow = !this.isShow
            this.$refs.login.resetFields();
            this.$refs.register.resetFields();
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
