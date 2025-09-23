import {
	getRequest,
	postRequest
} from '@/utils/http.js'

// 广告查询
export const getAdsList = (params) => {
	return getRequest('/ad/ads/', params)
}
// 用户信息
export const getUserinfo = (params) => {
	return getRequest(`/auth/users/${params.id}`)
}

// 用户兴趣标签
export const userInterestLabel = params => {
	return getRequest('/user-interest-tags/list', params)
}

// 广告（游戏）详情
export const adsDetail = (id, params) => {
	return getRequest(`/ad/ads/${id}`, params)
}

// 搜索
export const search = (params) => {
	return postRequest('/search/videos', params)
}