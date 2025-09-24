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
    enabled: true,
    strategies: [
      {
        key: 'userinfos',  
        storage: localStorage,     // 也可以换成 sessionStorage
        paths: ['userinfo', 'personInfo']
      }
    ]
  }
});