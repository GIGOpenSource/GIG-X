<template>
	<view class="page">
		<!-- <scroll-view class="bannerwrapper" scroll-y="true" @scrolltolower="lower">
			<image
				v-for="(item, index) in bannerlist"
				:key="index"
				class="banner"
				:style="{ height: `calc(80vh / ${bannerlist.length >= 3 ? 3 : bannerlist.length})` }"
				:src="item.imageUrl"
			/>
		</scroll-view> -->
		<up-image :src="bannerlist[0]?.imageUrl" width="100%" height="80vh" @click="handleOpenPage(bannerlist[0].clickUrl)"></up-image>
		<up-count-down :time="5 * 1000" format="ss" class="count-down" @finish="countDownFinsh"></up-count-down>
		<view class="logo">
			<image src="/static/images/logo2.png" mode=""></image>
		</view>
	</view>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { onLoad, onHide, onReachBottom } from '@dcloudio/uni-app';
import {getAdsList} from '@/api/public.js'
import { userinfoStore } from '@/store/userinfos'
const store = userinfoStore()
import {
	login
} from '@/api/setup.js'


let bannerlist = ref([]);

const total = ref(0);
const page = ref(1);
const isFirst = ref(false)

onLoad(() => {
	isFirst.value = uni.getStorageSync('isFirst');

	const params = {
		username: 'Lisi2',
		password: 'password123'
	};
	login(params).then((res) => {
		if (res.code === 200) {
			uni.setStorageSync('user_info', res.data.userInfo)
			uni.setStorageSync('token', res.data.token)
			list(); //获取轮播图列表
			 store.getUserinfo({id: res.data.userInfo.id})
		}
	});
});
onHide(() => {
	uni.setStorageSync('isFirst', false);
});
const list = () => {
	getAdsList({
		adType: 'ads',
		currentPage: page.value,
		pageSize: 20
	}).then((res) => {
		console.log(res);
		bannerlist.value = res.data.records;
		total.value = res.data.total;
	});
};
const lower = () => {
	if (total.value > bannerlist.length) {
		total.value++;
		list();
	}
};

// 打开页面
const handleOpenPage = (url)=>{
	// #ifdef APP-PLUS
	plus.runtime.openURL( url, ()=>{
		console.log('打开外链失败');
	} );
	// #endif

	// #ifdef APP-PLUS
	console.log('手机打开失败');
	// #endif
}

// 倒计时结束跳转页面
const countDownFinsh = ()=>{
	if (isFirst.value === false) {
		uni.switchTab({
			// #ifdef APP-PLUS
			url: '/pages/index/index'
			// #endif
			// #ifndef APP-PLUS
			url: '/pages/index/index-v'
			// #endif
		})
	} else {
		uni.navigateTo({
			url: '/pages/guide/guide'
		})
	}
}
</script>

<style lang="scss" scoped>
page {
	background: #fff;
}

.count-down {
	position: fixed;
	top: 120rpx;
	right: 80rpx;
	background-color: rgba(0, 0, 0, 0.3);
	padding: 5rpx 10rpx;
	border-radius: 50%;
}

.bannerwrapper {
	max-height: 80vh;
}

.banner {
	width: 100%;
	vertical-align: middle;
}

.logo {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 20vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #fff;

	image {
		width: 250rpx;
		height: 80rpx;
	}
}
</style>
