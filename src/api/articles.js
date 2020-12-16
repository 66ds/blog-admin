import request from '../utils/request';

/**
 * 文章列表查询
 * @param query
 */
export const articlesListApi = (query) => {
    return request({
        url: '/api/v1/pri/articles/list',
        method: 'post',
        data:query
    });
};

/**
 * 文件上传
 * @param file
 */
export const fileUploadApi=(file)=>{
    return request({
        url:"/api/v1/pri/oos/upload",
        method:"post",
        data:file,
        headers: { 'Content-Type': 'multipart/form-data'}
    })
}

/**
 * 文章查询
 * @param articleForm
 */
export const articlesAddApi=(articleForm)=>{
    return request({
        url:"/api/v1/pri/articles/add",
        method:"post",
        data:articleForm
    })
}

/**
 * 单篇文章查询
 * @param id
 */
export const articlesInfoApi=(id)=>{
    return request({
        url:"/api/v1/pub/articles/info/"+id,
        method:"get"
    })
}

/**
 * 文章编辑
 * @param articleForm
 */
export const articlesUpdateApi=(articleForm)=>{
    return request({
        url:"/api/v1/pri/articles/update",
        method:"post",
        data:articleForm
    })
}

/**
 * 单篇文章删除
 * @param articlesId
 */
export const articlesDeleteApi = (articlesId)=>{
    return request({
        url:"/api/v1/pri/articles/delete/"+articlesId,
        method:"get"
    })
}

/**
 * 批量删除
 * @param articleIds
 */
export const articlesDeleteBatchApi = (articleIds)=>{
    return request({
        url:"/api/v1/pri/articles/batch?articleIds="+articleIds,
        method:"get"
    })
}
