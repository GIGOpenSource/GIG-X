// 平台区分处理
// #ifdef H5
// H5端：使用 Pinia
import { defineStore } from 'pinia';
import {
	getUserinfo,
	getCurrentUserinfo
} from '@/api/public.js'

export const userinfoStore = defineStore('userinfos', {
	state: () => {
		return {
			userinfo: {}, //用户信息
			personInfo: {}
		};
	},
	actions: {
		async getUserinfo(params) {
			const res = await getUserinfo(params)
			this.userinfo = res.data
		},
		async getPersonInfo(params) {
			const res = await getUserinfo(params)
			this.personInfo = res.data
		},
		// 获取当前用户信息并覆盖
		async updateCurrentUserinfo() {
			try {
				const res = await getCurrentUserinfo()
				if (res && res.data) {
					// 覆盖用户信息
					this.userinfo = res.data
					console.log('用户信息已更新:', res.data)
					return res.data
				}
			} catch (error) {
				console.error('获取用户信息失败:', error)
				throw error
			}
		},
	},
	persist: {
		storage: {
			getItem: (key) => uni.getStorageSync(key),
			setItem: (key, value) => uni.setStorageSync(key, value),
			removeItem: (key) => uni.removeStorageSync(key),
		},
		paths: ['userinfo', 'personInfo']
	}
});
// #endif

// #ifdef APP-PLUS
// APP端：使用原生类实现
import { userinfoStore as appUserinfoStore } from './userinfos-app.js';

// APP端：创建兼容函数，返回类实例
export function userinfoStore() {
	return appUserinfoStore;
}
// #endif