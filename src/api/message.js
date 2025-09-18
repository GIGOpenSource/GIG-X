import {
	getRequest,
	postRequest
} from '@/utils/http.js'
//消息列表查询
export const getList = (params) => {
	return getRequest('/messages/list', params)
}
//创建消息
export const addlist = (params) => {
	return postRequest('/messages/write', params)
}

//获取会话详情
export const details = (params) => {
	return getRequest('/messages/query', params)
}