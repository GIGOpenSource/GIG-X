import {
	getRequest,
	postRequest,
	putRequest
} from '@/utils/http.js'

// 分类列表
export const categoryList= (params) => {
	return getRequest('/categories/',params)
}

// 分类详情
export const categoryDetail= (id) => {
	return getRequest('/categories/' + id)
}

// 内容列表
export const contentList= (params) => {
	return getRequest('/contents/', params)
}

// 内容详情
export const contentDetail= (id) => {
	return getRequest('/contents/' + id)
}

// 内容评论
export const contentCommentList= (params) => {
	return getRequest('/comments/v1/content/', params)
}

// 内容评论
export const addContentComment= (params) => {
	return postRequest('/comments/v1/content/', params)
}
// 猜你喜欢
export const guessLike= (params) => {
	return getRequest('/contents/guesslike/', params)
}

// 内容点赞
export const contentLike= (id) => {
	return postRequest('/likes/v1/content/toggle/', { target_id: id })
}

// 内容收藏
export const contentCollect= (id) => {
	return postRequest('/favourites/v1/toggle/', { target_id: id })
}

// 任务列表
export const taskList = (params) =>{
	return getRequest('/tasks/template/', params)
}