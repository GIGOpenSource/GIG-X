// #ifdef APP-PLUS
import { host } from '@/config/config.js';
// #endif

// #ifndef APP-PLUS
const host = import.meta.env.VITE_API_BASE_URL;
// #endif
import { login } from "@/api/setup.js";
import { userinfoStore } from "@/store/userinfos";
// 验证token是否失效
var expired = false;
let requestRecord = {

}

// 登录状态管理
let isLoginRequesting = false;
let pendingRequests = [];
let currentToken = uni.getStorageSync('token') || '';

let httpConfig = {
	header: {
		'Content-Type': "application/json",
		'Authorization': 'Token ' + currentToken,
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

// 处理队列中的请求
function processPendingRequests() {
	if (pendingRequests.length > 0 && !isLoginRequesting) {
		console.log('开始处理队列中的请求，共', pendingRequests.length, '个');
		pendingRequests.forEach(({ url, params, other, resolve, reject }) => {
			// 更新请求头中的 token
			other.header = {
				...other.header,
				'Authorization': 'Token ' + currentToken,
				'token': currentToken
			};
			console.log('处理队列请求:', url, '使用 token:', currentToken);
			executeRequest(url, params, other).then(resolve).catch(reject);
		});
		pendingRequests = [];
	}
}

// 执行实际的请求
function executeRequest(url, params, other) {
	other = {
		...httpConfig,
		...other
	};
	// 防止莫名其妙token有时不刷新问题
	other.header['token'] = currentToken
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
				// #ifdef APP-PLUS
			url: host + url,
			// #endif
			// #ifdef H5
			url: host + url,
			// #endif
			data: params,
			header: other.header,
			method: other.method,
			sslVerify: false,
			timeout: other.timeout,
			complete: data => {
				uni.hideLoading();
				clearTimeout(httpConfig.timer);
				httpConfig.timer = null;

				if (data.statusCode == 200 || data.statusCode == 201) {
					if (!(data.data.code == 403 && !expired)) {
						expired = false;
						if (data.data.code == 200 || data.data.code == 201) {
							// 检查是否是 auth/users 接口，如果是则更新用户信息
							if (url.includes('auth/users') && data.data.data) {
								console.log('检测到 auth/users 接口响应，更新用户信息');
								try {
									const store = userinfoStore();
									store.userinfo = data.data.data;
									console.log('用户信息已自动更新:', data.data.data);
								} catch (error) {
									console.error('更新用户信息失败:', error);
								}
							}
							resolve(data.data);
						} else {
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
				} else if (data.statusCode == 401) {
					console.log('收到 401 状态码，接口:', url);

					// 将当前请求加入待处理队列
					pendingRequests.push({ url, params, other, resolve, reject });

					// 如果已经在处理登录，直接返回
					if (isLoginRequesting) {
						console.log('已经在处理登录，当前请求已加入队列等待');
						return;
					}

					// 开始自动登录
					isLoginRequesting = true;
					console.log('开始自动登录...');

					const loginParams = {
						username: uni.getStorageSync("guid_name"),
						password: uni.getStorageSync("guid_password"),
					};

					login(loginParams).then((res) => {
						console.log('自动登录成功，获得新 token:', res.data.token);

						// 更新 token
						currentToken = res.data.token;
						httpConfig.header['Authorization'] = 'Token ' + currentToken;

						// 保存用户信息
						uni.setStorageSync("user_info", res.data);
						uni.setStorageSync("token", res.data.token);
						// const store = userinfoStore();
						// store.getUserinfo({ id: res.data.user_id });

						// 标记登录完成
						isLoginRequesting = false;

						// 处理队列中的请求
						processPendingRequests();
					}).catch((error) => {
						console.log('自动登录失败:', error);
						isLoginRequesting = false;

						// 拒绝所有待处理的请求
						pendingRequests.forEach(({ reject }) => {
							reject(error);
						});
						pendingRequests = [];
					});
				} else {
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

// 主要的请求函数
function request(url, params, other) {
	return new Promise((resolve, reject) => {
		// 检查是否是登录接口
		if (url.includes('auth/login')) {
			console.log('检测到登录接口:', url);
			isLoginRequesting = true;

			executeRequest(url, params, other).then((result) => {
				console.log('登录接口调用成功');

				// 如果登录成功，更新 token
				if (result && result.token) {
					currentToken = result.token;
					httpConfig.header['Authorization'] = 'Token ' + currentToken;
					console.log('更新 token:', currentToken);
				}

				// 标记登录完成
				isLoginRequesting = false;

				// 处理队列中的请求
				processPendingRequests();

				resolve(result);
			}).catch((error) => {
				console.log('登录接口调用失败:', error);
				isLoginRequesting = false;

				// 拒绝所有待处理的请求
				pendingRequests.forEach(({ reject }) => {
					reject(error);
				});
				pendingRequests = [];

				reject(error);
			});
		} else {
			// 非登录接口
			if (isLoginRequesting) {
				console.log('登录进行中，将请求加入队列:', url);
				pendingRequests.push({ url, params, other, resolve, reject });
			} else {
				// 没有登录请求，直接执行
				executeRequest(url, params, other).then(resolve).catch(reject);
			}
		}
	});
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
function patchRequest(url, params = {}, other = {}) {
	return request(url, params, {
		...other,
		method: 'PUT'
	})
}
export {
	request,
	getRequest,
	postRequest,
	putRequest,
	patchRequest
}