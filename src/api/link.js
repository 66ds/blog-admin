import request from '../utils/request';

/**
 * 查询所有友情链接
 * @param query
 * @returns {AxiosPromise}
 */
export const selectFriendLinkListApi = (query) => {
    return request({
        url:'/api/v1/pub/friendlylink/lists',
        method:'post',
        data:query
    })
}
