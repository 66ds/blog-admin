import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

/**
 * 发送短信
 * @param {*} videoId
 */
export const sendCodeApi = (phone) => {
    return request({
        url:"/sms/send/"+phone
    })
}

/**
 * 用户注册
 */
export const userRegisterApi=(userTelephoneNumber,code,userPassword)=>{
    return request({
        url:"/user/register",
        method: 'post',
        data: {
            userTelephoneNumber,code,userPassword
        }
    })
}
