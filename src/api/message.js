import {
	getRequest,
	postRequest
} from '@/utils/http.js'

//消息列表查询
export const getList = (params) => {
	return getRequest('/chat/message/', params)
}
//创建会话
export const addlist = (params) => {
	return postRequest('/chat/message/', params)
}

//获取会话详情
export const details = (params) => {
	return getRequest(`/api/chat/session/${id}/`)
}



//获取通知
export const getNotice = (params) => {
	return getRequest('/notifications/', params)
}
