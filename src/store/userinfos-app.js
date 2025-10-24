// APP端专用状态管理 - 不依赖Pinia
import {
	getUserinfo,
	getCurrentUserinfo
} from '@/api/public.js'

class UserinfoStore {
	constructor() {
		this.userinfo = {};
		this.personInfo = {};
		this.init();
	}

	init() {
		// 从本地存储恢复数据
		try {
			const storedUserinfo = uni.getStorageSync('userinfos_userinfo');
			const storedPersonInfo = uni.getStorageSync('userinfos_personInfo');
			
			// 默认用户信息 - 确保所有必要字段都存在
			const defaultUserinfo = {
				id: 'guest',
				avatar: '',
				username: 'guest',
				user_nickname: '游客',
				phone: '',
				email: '',
				is_vip: false,
				member_level: 0,
				gold_coin: 0,
				vip_days: 0,
				status: 1,
				followers_count: 0,
				following_count: 0,
				likes_count: 0
			};
			
			if (storedUserinfo && typeof storedUserinfo === 'object') {
				// 合并存储的用户信息和默认值，确保所有字段都存在
				this.userinfo = { ...defaultUserinfo, ...storedUserinfo };
				console.log('APP端：从存储恢复用户信息', this.userinfo);
			} else {
				// 如果没有存储的用户信息，使用默认值
				this.userinfo = defaultUserinfo;
				console.log('APP端：使用默认用户信息', this.userinfo);
			}
			
			if (storedPersonInfo && typeof storedPersonInfo === 'object') {
				this.personInfo = storedPersonInfo;
			} else {
				this.personInfo = {};
			}
		} catch (error) {
			console.error('恢复用户信息失败:', error);
			// 设置默认值
			this.userinfo = {
				id: 'guest',
				avatar: '',
				username: 'guest',
				user_nickname: '游客',
				phone: '',
				email: '',
				is_vip: false,
				member_level: 0,
				gold_coin: 0,
				vip_days: 0,
				status: 1,
				followers_count: 0,
				following_count: 0,
				likes_count: 0
			};
			this.personInfo = {};
			console.log('APP端：使用错误恢复默认用户信息', this.userinfo);
		}
	}

	async getUserinfo(params) {
		try {
			const res = await getUserinfo(params);
			if (res && res.data) {
				this.userinfo = res.data;
				// 保存到本地存储
				uni.setStorageSync('userinfos_userinfo', res.data);
				return res.data;
			}
		} catch (error) {
			console.error('获取用户信息失败:', error);
			throw error;
		}
	}

	async getPersonInfo(params) {
		try {
			const res = await getUserinfo(params);
			if (res && res.data) {
				this.personInfo = res.data;
				// 保存到本地存储
				uni.setStorageSync('userinfos_personInfo', res.data);
				return res.data;
			}
		} catch (error) {
			console.error('获取个人信息失败:', error);
			throw error;
		}
	}

	// 获取当前用户信息并覆盖
	async updateCurrentUserinfo() {
		try {
			const res = await getCurrentUserinfo();
			if (res && res.data) {
				// 覆盖用户信息
				this.userinfo = res.data;
				uni.setStorageSync('userinfos_userinfo', res.data);
				console.log('用户信息已更新:', res.data);
				return res.data;
			}
		} catch (error) {
			console.error('获取用户信息失败:', error);
			throw error;
		}
	}
}

// 创建APP端专用实例
const userinfoStore = new UserinfoStore();

export { userinfoStore };
