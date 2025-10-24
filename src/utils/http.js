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

// 平台区分处理 - 不同的Content-Type
let httpConfig;

// #ifdef APP-PLUS
// APP端：使用form格式
httpConfig = {
	header: {
		'Content-Type': "application/x-www-form-urlencoded",
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
// #endif

// #ifdef H5
// H5端：使用JSON格式
httpConfig = {
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
// #endif

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
		// 平台区分处理 - 不同的数据格式
		let requestData = params;
		// #ifdef APP-PLUS
		// APP端：将JSON对象转换为URL编码格式
		if (other.header['Content-Type'] === 'application/x-www-form-urlencoded') {
			requestData = Object.keys(params).map(key => 
				encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
			).join('&');
			console.log('APP端：转换后的form数据:', requestData);
		}
		// #endif
		
		// 检查是否是登录接口，添加特殊处理
		if (url.includes('auth/login')) {
			console.log('=== executeRequest 中的登录接口检测 ===');
			console.log('登录接口URL:', host + url);
			console.log('登录请求头:', other.header);
			console.log('登录请求数据:', requestData);
			console.log('=====================================');
		}
		
		uni.request({
				// #ifdef APP-PLUS
			url: host + url,
			// #endif
			// #ifdef H5
			url: host + url,
			// #endif
			data: requestData,
			header: other.header,
			method: other.method,
			sslVerify: false,
			timeout: other.timeout,
			complete: data => {
				console.log('params:', params);
				console.log('requestData:', requestData);
				
				// 如果是登录接口，添加特殊处理
				if (url.includes('auth/login')) {
					console.log('=== 登录接口响应处理 ===');
					console.log('登录接口状态码:', data.statusCode);
					console.log('登录接口响应:', data.data);
					console.log('========================');
				}
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

					// 使用固定的简单登录参数
					const loginParams = {
						username: "11111",
						password: "22222"
					};
					
					console.log('自动登录使用固定参数:', loginParams);
					
					console.log('自动登录参数:', loginParams);

					login(loginParams).then((res) => {
						console.log('login-login-login-login-login', res.data);
						console.log('自动登录成功，获得新 token:', res.data.token);

						// 更新 token
						currentToken = res.data.token;
						httpConfig.header['Authorization'] = 'Token ' + currentToken;

						// 保存用户信息
						uni.setStorageSync("user_info", res.data);
						uni.setStorageSync("token", res.data.token);
						
						// 处理用户信息 - 与H5端保持一致
						console.log('自动登录成功，处理用户信息:', res.data);
						
						// 检查登录响应中的用户ID
						const userId = res.data.user_id || res.data.id;
						console.log('自动登录用户ID:', userId);
						
						if (userId) {
							// 有用户ID，获取详细用户信息
							console.log('开始获取用户详细信息，用户ID:', userId);
							
							try {
								const store = userinfoStore();
								store.getUserinfo({ id: userId }).then(() => {
									console.log('自动登录：用户信息获取成功');
								}).catch((error) => {
									console.error('自动登录：获取用户信息失败:', error);
									// 使用登录响应中的基本信息
									const basicUserinfo = {
										id: userId,
										avatar: res.data.avatar || "",
										username: res.data.username || "用户",
										user_nickname: res.data.user_nickname || res.data.username || "用户",
										phone: res.data.phone || "",
										email: res.data.email || "",
										is_vip: res.data.is_vip || false,
										member_level: res.data.member_level || 0,
										gold_coin: res.data.gold_coin || 0,
										vip_days: res.data.vip_days || 0,
										status: res.data.status || 1,
										followers_count: res.data.followers_count || 0,
										following_count: res.data.following_count || 0,
										likes_count: res.data.likes_count || 0
									};
									store.userinfo = basicUserinfo;
									uni.setStorageSync("userinfos_userinfo", basicUserinfo);
									console.log('自动登录：使用基本信息作为用户信息', basicUserinfo);
								});
							} catch (error) {
								console.error('自动登录：store初始化失败:', error);
							}
						} else {
							console.error('自动登录响应中缺少用户ID');
							// 使用登录响应中的基本信息
							const basicUserinfo = {
								id: res.data.id || "unknown",
								avatar: res.data.avatar || "",
								username: res.data.username || "用户",
								user_nickname: res.data.user_nickname || res.data.username || "用户",
								phone: res.data.phone || "",
								email: res.data.email || "",
								is_vip: res.data.is_vip || false,
								member_level: res.data.member_level || 0,
								gold_coin: res.data.gold_coin || 0,
								vip_days: res.data.vip_days || 0,
								status: res.data.status || 1,
								followers_count: res.data.followers_count || 0,
								following_count: res.data.following_count || 0,
								likes_count: res.data.likes_count || 0
							};
							
							try {
								const store = userinfoStore();
								store.userinfo = basicUserinfo;
								uni.setStorageSync("userinfos_userinfo", basicUserinfo);
								console.log('自动登录：使用基本信息作为用户信息', basicUserinfo);
							} catch (error) {
								console.error('自动登录：设置基本信息失败:', error);
							}
						}

						// 标记登录完成
						isLoginRequesting = false;

						// 处理队列中的请求
						processPendingRequests();
					}).catch((error) => {
						console.log('自动登录失败:', error);
						isLoginRequesting = false;

						// 自动登录失败时，设置默认用户信息
						// #ifdef APP-PLUS
						console.log('APP端：自动登录失败，设置默认用户信息');
						const fallbackUserinfo = {
							id: "guest",
							avatar: "",
							username: "guest",
							user_nickname: "游客",
							phone: "",
							email: "",
							is_vip: false,
							member_level: 0,
							gold_coin: 0,
							vip_days: 0,
							status: 1,
							followers_count: 0,
							following_count: 0,
							likes_count: 0
						};
						
						// 保存默认用户信息
						uni.setStorageSync("userinfos_userinfo", fallbackUserinfo);
						uni.setStorageSync("userinfo", fallbackUserinfo);
						uni.setStorageSync("user_info", fallbackUserinfo);
						
						// 更新store实例
						try {
							const store = userinfoStore();
							store.userinfo = fallbackUserinfo;
							console.log('APP端：自动登录失败后store已更新');
						} catch (storeError) {
							console.warn('APP端：自动登录失败后store更新失败:', storeError);
						}
						// #endif

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
			console.log('=== 登录接口检测 ===');
			console.log('检测到登录接口:', url);
			console.log('登录参数:', params);
			console.log('当前token状态:', currentToken);
			console.log('是否正在登录:', isLoginRequesting);
			console.log('==================');
			
			isLoginRequesting = true;

			executeRequest(url, params, other).then((result) => {
				console.log('=== 登录接口成功 ===');
				console.log('登录接口调用成功');
				console.log('登录响应:', result);
				console.log('==================');

				// 如果登录成功，更新 token
				if (result && result.token) {
					currentToken = result.token;
					httpConfig.header['Authorization'] = 'Token ' + currentToken;
					console.log('更新 token:', currentToken);
					console.log('更新后的请求头:', httpConfig.header);
				} else {
					console.warn('登录响应中没有token字段');
					console.warn('响应结构:', JSON.stringify(result, null, 2));
				}

				// 标记登录完成
				isLoginRequesting = false;

				// 处理队列中的请求
				console.log('开始处理队列中的请求，队列长度:', pendingRequests.length);
				processPendingRequests();

				resolve(result);
			}).catch((error) => {
				console.log('=== 登录接口失败 ===');
				console.log('登录接口调用失败:', error);
				console.log('错误详情:', JSON.stringify(error, null, 2));
				console.log('==================');
				
				isLoginRequesting = false;

				// 拒绝所有待处理的请求
				console.log('拒绝所有待处理请求，数量:', pendingRequests.length);
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