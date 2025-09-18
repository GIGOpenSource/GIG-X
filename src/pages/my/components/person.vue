<template>
	<z-paging ref="paging" >
		<up-navbar bgColor="transparent" placeholder :autoBack="isBack" :fixed="false" >
			<template #left>
				<up-icon name="arrow-left" color="#ffffff" size="20" v-if="isBack"></up-icon>
			</template>
			<template #right>
				<text class="" @click="toPath('/pages/my/message')">消息中心</text>
				<text class="setup" @click="toPath('/pages/my/setup')">设置</text>
			</template>
		</up-navbar>
		<view class="content">
			<userinfo :isFollow="isBack" :userId="isBack ? uni.getStorageSync('otherId'):uni.getStorageSync('user_info').id"/>
			<vip v-if="!isBack && uni.getStorageSync('user_info').isVip == 'Y'"/>
			<!-- 动态，视频，互动 -->
			<view class="tabs">
				<view v-for="(item,index) in tarbar" :key="index" :class="current == index ? 'current':''"
					@click="clicks(index)">{{item}}</view>
			</view>
			<active v-if="current == 0" :isfollow="isBack" :more="true" :tabs="6"/>
			<myvideo v-if="current == 1" :isfollow="isBack"/>
			<interact v-if="current == 2" :isfollow="isBack"/>
			
		</view>
		<view style="height: 80rpx;" v-if="isBack"></view>
	</z-paging>
	
	<view class="private-message" v-if="isBack" @click="toPath('/pages/my/dialogue')">私信</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		 onMounted 
	} from 'vue';
	import userinfo from './userinfo.vue'
	import vip from './vip.vue'
	import {
		userinfoStore
	} from '@/store/userinfos'
	const { userInfo } = userinfoStore()
	const props = defineProps({
		isBack:{ 
			type:Boolean,
			default:false
		}
	})
	const list = ref([{
		name: '消息中心'
	}, {
		name: '设置'
	}])
	const tarbar = ref(['动态', '视频', '互动'])
	const current = ref(0)
	const clicks = (index) => {
		current.value = index
	}
	const onTabChange = (tab) => {
		console.log(tab);
	}
	const toPath = (url) => {
		uni.navigateTo({
			url
		})
	}
	onMounted(() => {
		if(!props.isBack){
			tarbar.value = ['动态', '视频', '互动']
		}else{
			 tarbar.value = ['动态', '视频']
		}
	})
</script>

<style lang="scss" scoped>
	.content {
		// background: pink;
		margin: 30rpx;
	}

	.setup {
		margin-left: 30rpx;
	}

	.tabs {
		display: flex;
		justify-content: space-around;
		margin: 30rpx 0;

		view {
			width: 33%;
			text-align: center;

			height: 70rpx;
			line-height: 70rpx;
			border-radius: 80rpx;
			color: #fff;

		}

		.current {
			background: #ffffff;
			color: #000;
		}
	}
	.private-message{
		background: linear-gradient(180deg, #5662E1 0%, #614793 100%);
		width: 92%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 80rpx;
       position: fixed;
	   left: 30rpx;
	   bottom: 30rpx;
	}
</style>