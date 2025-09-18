<template>
	<z-paging-swiper>
		<template #top>
			<!-- 导航栏 -->
			<up-navbar bgColor="transparent" placeholder :autoBack="false" :fixed="false">
				<template #left>
					<tabs :list="list" @change="onTabChange"></tabs>
				</template>

				<template #right>
					<view class="search" @click="uni.navigateTo({ url: '/pages/search/search' })">
						<up-icon name="search" color="#fff" size="22"></up-icon>
						<text>搜索</text>
					</view>
				</template>
			</up-navbar>
		</template>
		<swiper :current="current" class="content">
			<swiper-item v-for="(item, index) in 4" :key="index">
				<active :more="true" :tabs="current" />
			</swiper-item>
		</swiper>

		<dragball>
			<template #content>
				<view class="dragball" @click="clicks">
					<image src="/static/images/icon_add_community.png" mode=""></image>
				</view>
			</template>
		</dragball>
	</z-paging-swiper>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import tabs from '@/components/tabs/tabs.vue';
import SocialPost from './components/SocialPost.vue';
import { onReachBottom } from '@dcloudio/uni-app';
const current = ref(0);
const dataList = ref([]);
const page = ref(1);
const total = ref(0);
const list = ref([
	{
		name: '推荐'
	},
	{
		name: '关注'
	},
	{
		name: '最新'
	},
	{
		name: '同城'
	}
]);
const onTabChange = (index) => {
	current.value = index.index;
};
const clicks = () => {
	uni.navigateTo({
		url: '/pages/community/publish'
	});
};
</script>
<style lang="scss" scoped>
.content {
	margin: 20rpx;
	height: 100%;

	swiper-item {
		width: 100%;
		height: 100%;
	}
}

.dragball {
	background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	text-align: center;
	line-height: 80rpx;
	font-size: 90rpx;
	font-weight: bold;

	image {
		width: 100%;
		height: 100%;
	}
}
</style>
