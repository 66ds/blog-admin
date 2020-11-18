import request from '../utils/request';

/**
 * 文章列表查询
 * @param token
 */
export const articlesListApi = (query,token) => {
    return request({
        url: '/api/v1/pri/articles/list',
        method: 'post',
        data:query,
        headers:{
            token
        }
    });
};

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
export const articlesAddApi=(articleForm,token)=>{
    return request({
        url:"/api/v1/pri/articles/add",
        method:"post",
        data:articleForm,
        headers: {token}
    })
}

/**
 * 单偏文章查询
 */
export const articlesInfoApi=(id,token)=>{
    return request({
        url:"/api/v1/pub/articles/info/"+id,
        method:"get",
        headers:{token}
    })
}

/**
 * 文章编辑
 */
export const articlesUpdateApi=(articleForm,token)=>{
    return request({
        url:"/api/v1/pri/articles/update",
        method:"post",
        data:articleForm,
        headers:{
            token
        }
    })
}

/**
 * 单骗文章删除
 */
export const articlesDeleteApi = (articlesId,token)=>{
    return request({
        url:"/api/v1/pri/articles/delete/"+articlesId,
        method:"get",
        headers:{
            token
        }
    })
}

/**
 * 批量删除
 */
export const articlesDeleteBatchApi = (articleIds,token)=>{
    return request({
        url:"/api/v1/pri/articles/batch?articleIds="+articleIds,
        method:"get",
        headers:{
            token
        }
    })
}
