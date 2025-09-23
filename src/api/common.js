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
