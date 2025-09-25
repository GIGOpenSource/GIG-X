import {
	getRequest,
	postRequest
} from '@/utils/http.js'

//创建社区内容
export const createCommunity = (params) => {
	return postRequest('/social/dynamic/', params)
}

//获取推荐社区列表
export const communityList = (params) => {
	return getRequest('/social/dynamic/', params)
}

//分享动态
export const addShare = (params) => {
	return postRequest('/social/dynamic/share/', params)
}


//关注列表 
export const followList = (params) => {
	return getRequest('/social/dynamic_follow/', params)
}

//详情
export const getDetails = (params) => {
	return getRequest(`/social/dynamic/${params.dynamic_id}/`)
}

//点赞切换
export const liketoggle = (params) => {
	return postRequest('/likes/v2/dynamic/toggle/', params)
}



//创建评论
export const addComment = (params) => {
	return postRequest('/comments/v2/', params)
}

//获取评论
export const getCommentList = (params) => {
	return getRequest('/comments/v2/', params)
}

//评论点赞
export const commentlike = (params) => {
	return postRequest('/likes/v1/comment/toggle/', params)
}

//关注切换
export const followtoggle = (params) => {
	return postRequest('/follows/v2/toggle/', params)
}








