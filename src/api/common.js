import {
	getRequest,
	postRequest,
	putRequest
} from '@/utils/http.js'

// 发现列表
export const categoryList= (params) => {
	return getRequest('/categories/',params)
}

// 发现详情
export const categoryDetail= (id) => {
	return getRequest('/categories/' + id)
}