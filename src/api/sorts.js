import request from '../utils/request';

/**
 * 查找该用户下所有的分类
 * @param token
 */
export const sortsCatagorysApi= (token) => {
    return request({
        url: '/api/v1/pri/sorts/catagorys',
        method: 'get',
        headers:{
            token
        }
    });
};

/**
 * 分类列表查询
 * @param token
 */
export const sortsListApi = (query,token) => {
    return request({
        url: '/api/v1/pri/sorts/list',
        method: 'post',
        data:query,
        headers:{
            token
        }
    });
};

/**
 * 分类添加
 */
export const sortsAddApi=(sortsForm,token)=>{
    return request({
        url:"/api/v1/pri/sorts/add",
        method:"post",
        data:sortsForm,
        headers: {token}
    })
}
