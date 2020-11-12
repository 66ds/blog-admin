import request from '../utils/request';

/**
 * 发送短信
 * @param {*} videoId
 */
export const sendCodeApi = (phone) => {
    return request({
        url:"/api/v1/pub/sms/send/"+phone
    })
}

/**
 * 用户注册
 */
export const userRegisterApi=(userTelephoneNumber,code,userPassword)=>{
    return request({
        url:"/api/v1/pub/user/register",
        method: 'post',
        data: {
            userTelephoneNumber,code,userPassword
        }
    })
}

/**
 * 用户登录
 */
export const userLoginApi=(userTelephoneNumber,userPassword)=>{
    return request({
        url:"/api/v1/pub/user/login",
        method:'post',
        data:{
            userTelephoneNumber,userPassword
        }
    })
}


