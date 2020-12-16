import request from '../utils/request';

/**
 * 查找该用户下所有的分类
 * @param token
 */
export const sortsCatagorysApi= () => {
    return request({
        url: '/api/v1/pri/sorts/catagorys',
        method: 'get'
    });
};

/**
 * 分类列表查询
 */
export const sortsListApi = (query) => {
    return request({
        url: '/api/v1/pri/sorts/list',
        method: 'post',
        data:query,
    });
};

/**
 * 分类添加
 */
export const sortsAddApi=(sortsForm)=>{
    return request({
        url:"/api/v1/pri/sorts/add",
        method:"post",
        data:sortsForm
    })
}

/**
 * 单个分类查询
 */
export const sortsInfoApi=(id)=>{
    return request({
        url:"/api/v1/pri/sorts/info/"+id,
        method:"get"
    })
}

/**
 * 文章编辑
 */
export const sortsUpdateApi=(sortForm)=>{
    return request({
        url:"/api/v1/pri/sorts/update",
        method:"post",
        data:sortForm
    })
}


/**
 * 删除分类
 */
export const sortsDeleteApi = (sortId)=>{
    return request({
        url:"/api/v1/pri/sorts/delete/"+sortId,
        method:"get"
    })
}
