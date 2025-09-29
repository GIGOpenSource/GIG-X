import {
	defineStore
} from 'pinia';
import {
	getUserinfo
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