import request from '../utils/request';

/**
 * 查询所有友情链接
 * @param query
 * @returns {AxiosPromise}
 */
export const selectFriendLinkListApi = (query) => {
    return request({
        url:'/api/v1/pri/friendlylink/lists',
        method:'post',
        data:query
    })
}

/**
 * 批量删除友链
 * @param stayIds
 */
export const linkDeleteBatchApi = (linkIds)=>{
    return request({
        url:"/api/v1/pri/friendlylink/batch?linkIds="+linkIds,
        method:"get"
    })
}

/**
 * 单个友链删除
 * @param linkId
 */
export const linkDeleteApi = (linkId)=>{
    return request({
        url:"/api/v1/pri/friendlylink/delete/"+linkId,
        method:"post"
    })
}

/**
 * 单个友链查询
 * @param linkId
 * @returns {AxiosPromise}
 */
export const selectLinkInfoApi = (linkId)=>{
    return request({
        url:"/api/v1/pri/friendlylink/info/"+linkId,
        method:"post"
    })
}

/**
 * 修改友链信息
 * @param linkForm
 * @returns {AxiosPromise}
 */
export const updateLinkInfoApi = (linkForm) => {
    return request({
        url:"/api/v1/pri/friendlylink/update",
        method:"post",
        data:linkForm
    })
}

