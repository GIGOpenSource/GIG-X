<template>
	<z-paging-swiper ref="paging" :loading-more-enabled="false">
		<template #top>
			<!-- 导航栏 -->
			<up-navbar bgColor="transparent" placeholder :autoBack="false" :fixed="false" @rightClick="rightClick">
				<template #left>
					<tabs :list="list" @change="onTabChange"></tabs>
				</template>

				<template #right>
					<view class="search">
						<up-icon name="search" color="#fff" size="22"></up-icon>
						<text>搜索</text>
					</view>
				</template>
			</up-navbar>

			<!-- tab分类 -->
			<!-- 			<up-tabs
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
			/> -->
		</template>

		<swiper :current="currentCategory" style="height: 100%" @animationfinish="swiperAnimationfinish">
			<swiper-item v-for="(item, index) in list.length">
				<tabs-page :current="currentCategory" :tabsIndex="index" v-if="currentCategory === index"></tabs-page>
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import tabs from '@/components/tabs/tabs.vue';
import TabsPage from './TabsPage.vue';

import { getAdsList } from '@/api/public.js';

onMounted(() => {
	console.log('reresresresresresress');
	const params = {
		currentPage: 1,
		pageSize: 20
	};
	// getAdsList(params).then(res => {
	// 	console.log('res', res);
	// }).catch(err => {
	// 	console.log('err', err);
	// })
});

const list = ref([
	{
		name: '发现'
	},
	{
		name: '精选'
	}
]);

const currentCategory = ref(0);
const categoryList = ref([
	{
		name: '关注'
	},
	{
		name: '推荐'
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
	currentCategory.value = tab.index;
};

// 定义方法
const rightClick = () => {
	console.log('rightClick');
	uni.navigateTo({
		url: '/pages/search/search'
	});
};

const leftClick = () => {
	console.log('leftClick');
};

// swiper滑动结束
const swiperAnimationfinish = (e) => {
	currentCategory.value = e.detail.current;
};
</script>

<style lang="scss"></style>
