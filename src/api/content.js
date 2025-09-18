import {
	getRequest,
	postRequest
} from "@/utils/http";

// 推荐列表
export const getContentList = params => {
	return getRequest('/content/core/list', params);
}

// 发现列表
export const discoverList = params => {
	return getRequest('/content/core/listForFX', params)
}

/* 长视频详情 */
export const contentDetail = id => {
	return getRequest('/content/core/' + id)
}

/* 长视频 推荐列表 */
export const contentRandom = () => {
	return getRequest('/content/core/random')
}

/** 收藏 */
export const favoriteAdd = (pararms) => {
	return postRequest('/favorite/add', pararms)
}

/** 取消收藏 */
export const favoriteRemove = (pararms) => {
	return postRequest('/favorite/remove', pararms)
}