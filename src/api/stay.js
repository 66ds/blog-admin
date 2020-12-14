import request from '../utils/request';

/**
 * 留言列表查询
 * @param query
 */
export const stayMessageListApi = (query) => {
    return request({
        url: '/api/v1/pub/staymessage/list',
        method: 'post',
        data:query,
    });
};
