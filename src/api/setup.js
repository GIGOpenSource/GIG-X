import {
	getRequest,
	postRequest,
	putRequest
} from '@/utils/http.js'

export const updataUserinfo = (id,params) => {
	return putRequest('/users/'+id, params)
}

// 登录
export const login = (data) => {
	return postRequest('/auth/login', data, {
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}

//检查关注状态
export const followCheck= (params) => {
	return getRequest('/follow/check',params)
}

//动态列表
export const dynamicsList = (id,params) => {
	return getRequest('/social/dynamics/user/'+id,params)
}

// 视频列表
export const getVideoList = (id,params)=> {
	
	return getRequest('/users/'+id + '/contents', params);
}

//互动列表
export const allList = (params) => {
	return getRequest('/user-interactions/all',params)
}





