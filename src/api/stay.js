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


/**
 * 添加留言
 * @param messageContent
 * @param parentStayId
 */
export const addStayMessageApi = (messageContent,parentStayId) => {
    return request({
        url: '/api/v1/pri/staymessage/save',
        method: 'post',
        data:{
            messageContent,
            parentStayId
        }
    });
};

/**
 * 查看parentstayId是stayId的留言信息
 * @param stayId
 * @returns {AxiosPromise}
 */
export const selectStayInfoApi = (stayId) => {
    return request({
        url: '/api/v1/pri/staymessage/info/'+stayId,
        method: 'post'
    });
}

/**
 * 修改留言内容
 * @param stayForm
 * @returns {AxiosPromise}
 */
export const updateStayInfoApi = (stayForm) => {
    return request({
        url: '/api/v1/pri/staymessage/update',
        method: 'post',
        data:stayForm
    });
};
