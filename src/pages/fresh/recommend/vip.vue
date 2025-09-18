<template>
	<z-paging-swiper>
		<template #top>
			<!-- 导航栏 -->
			<up-navbar bgColor="transparent" leftIconColor="#fff" title="VIP" titleColor="#fff" placeholder :fixed="false" :autoBack="true"></up-navbar>

			<!-- tab分类 -->
			<up-tabs
				:list="categoryList"
				:current="currentCategory"
				@click="handleClickCategory"
				lineColor="transparent"
				:activeStyle="{
					color: '#fff',
					fontSize: '17px',
					fontWeight: '400'
				}"
				:inactiveStyle="{
					color: 'rgba(255,255,255, .6)',
					fontSize: '15px',
					fontWeight: '400'
				}"
				itemStyle="padding-left: 15px; padding-right: 5px; height: 34px;"
			/>
		</template>

		<!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
		<!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->

		<swiper class="swiper" :current="currentCategory" @animationfinish="swiperAnimationfinish">
			<swiper-item v-for="(tab, index) in categoryList.length" :key="tab">
				<tabs-page :tab-index="index" :current="currentCategory" v-if="currentCategory === index"></tabs-page>
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script setup>
import { ref } from 'vue';

import tabsPage from '../../discover/TabsPage.vue';

const currentCategory = ref(0);
const categoryList = ref([
	{
		name: '关注'
	},
	{
		name: '推荐'
	},
	{
		name: '视频'
	},
	{
		name: '游戏'
	},
	{
		name: '最新'
	},
	{
		name: '最新'
	},
	{
		name: '最新'
	},
	{
		name: '最新'
	},
	{
		name: '最新'
	},
	{
		name: '最新'
	},
	{
		name: '最新'
	},
	{
		name: '最新'
	}
]);
// 切换分类
const handleClickCategory = (tab) => {
	currentCategory.value = tab.index;
};
const onTabChange = (tab) => {
	console.log(tab);
};

// swiper滑动结束
const swiperAnimationfinish = (e) => {
	currentCategory.value = e.detail.current;
};
const handleToLongVideo = () => {
	uni.navigateTo({
		url: '/pages/video/video'
	});
};
</script>

<style lang="scss">
page {
	background-color: #221b39;
}

.swiper {
	height: 100%;
}

.content {
	padding: 20rpx;
}

.card-list {
	display: flex;
	flex-wrap: wrap;
	margin-top: 20rpx;

	.card-view {
		margin-right: 20rpx;
		margin-bottom: 20rpx;

		&:nth-child(2n) {
			margin-right: 0;
		}
	}
}
</style>
