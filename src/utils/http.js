import {
	host
} from '@/config/config.js'
// 验证token是否失效
var expired = false;
let requestRecord = {

}

const token = uni.getStorageSync('token') || ''
let httpConfig = {
	header: {
		'Content-Type': "application/json",
		'Authorization': token,
		'token':token ?? '',
		'is-dev': 'true'
	},
	method: 'POST',
	showLoading: true, // 是否显示请求中的loading
	loadingText: '请求中...',
	loadingTime: 800, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
	timer: null, // 定时器
	loadingMask: false, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
	stopRepeat: false, // 是否阻止重复请求
	timeout: 15000, // 请求超时时间
	errorOutput: true // 请求失败输出信息
}

function request(url, params, other) {
	other = {
		...httpConfig,
		...other
	};
	// 防止莫名其妙token有时不刷新问题
	other.header['token'] = token
	return new Promise((resolve, reject) => {
		if (other.stopRepeat) {
			if (requestRecord.url === true) {
				reject();
				return;
			}
			requestRecord.url = true;
		}
		// 是否显示loading
		// 加一个是否已有timer定时器的判断，否则有两个同时请求的时候，后者会清除前者的定时器id
		// 而没有清除前者的定时器，导致前者超时，一直显示loading
		if (other.showLoading && !other.timer) {
			httpConfig.timer = setTimeout(() => {
				uni.showLoading({
					title: other.loadingText,
					mask: other.loadingMask
				})
				other.timer = null;
			}, other.loadingTime);
		}
		uni.request({
			url: host + url,
			data: params,
			header: other.header,
			method: other.method,
			timeout: other.timeout,
			complete: data => {
				// 请求返回后，隐藏loading(如果请求返回快的话，可能会没有loading)
				uni.hideLoading();
				// 清除定时器，如果请求回来了，就无需loading
				clearTimeout(httpConfig.timer);
				httpConfig.timer = null;
				if (data.statusCode == 200) {
					if (!(data.data.msg === '身份已过期' && !expired)) {
						expired = false;
						if (data.data.success) resolve(data.data);
						else {
							if (httpConfig.errorOutput) {
								uni.showToast({
									title: data.data.msg || data.data.message || '请求失败',
									icon: 'none'
								})
							}
							reject(data.data);
						}
					} else {
						uni.removeStorage({
							key: 'token'
						})
						uni.reLaunch({
							url: ''
						});
						expired = true;
						if (httpConfig.errorOutput) {
							uni.showToast({
								title: '身份已过期',
								icon: 'none'
							})
						}
						reject(data.data)
					}
				} else {
					console.warn(host + url, data);
					if (httpConfig.errorOutput) {
						uni.showToast({
							title: '请求失败',
							icon: 'none'
						})
					}
					reject(data)
				}
				if (other.stopRepeat && requestRecord.url === true) {
					requestRecord.url = false;
				}
			}
		});
	})
}

function getRequest(url, params = {}, other = {}) {
	return request(url, params, {
		...other,
		method: 'GET'
	})
}

function postRequest(url, params = {}, other = {}) {
	return request(url, params, {
		...other,
		method: 'POST'
	})
}
function putRequest(url, params = {}, other = {}) {
	return request(url, params, {
		...other,
		method: 'PUT'
	})
}
export {
	request,
	getRequest,
	postRequest,
	putRequest
}