import request from '../utils/request';

export const fetchData = (token) => {
    return request({
        url: '/api/v1/pri/users/list',
        method: 'get',
        headers:{
            token
        }
    });
};

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


/**
 * 文件上传
 */
export const fileUploadApi=(file,token)=>{
    return request({
        url:"/api/v1/pri/oos/upload",
        method:"post",
        data:file,
        headers: { 'Content-Type': 'multipart/form-data',token}
    })
}

/**
 * 文章添加
 */
export const articlesAddApi=()=>{
    return request({
        url:"/api/v1/pri/articles/add",
        method:"post",
        data:{

        }
    })
}
