<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList" :default-page-size="50">
		<template #top>
			<!-- 导航栏 -->
			<up-navbar bgColor="transparent" color="#fff" placeholder autoBack :fixed="false">
				<template #left>
					<up-icon name="arrow-left" color="#fff" size="18"></up-icon>
				</template>

				<template #center>
					<view>推荐APP</view>
				</template>

				<!-- <template #right>
					<up-icon name="more-dot-fill" color="#fff" size="18"></up-icon>
				</template> -->
			</up-navbar>
		</template>

		<!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
		<!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
		<view class="content">
			<view class="app-item" v-for="item in dataList" @click="handleClickApp(item.clickUrl)">
				<up-image :src="item.imageUrl" radius="32rpx" width="120rpx" height="120rpx"></up-image>
				<view class="app-name">{{ item.adName }}</view>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
import { ref } from 'vue';

import { getAdsList } from '@/api/public';

const paging = ref(null);
// v-model绑定的这个变量不要在分页请求结束中自己赋值，直接使用即可
const dataList = ref([]);

const queryList = (pageNo, pageSize) => {
	const params = {
		adType: 'app',
		currentPage: pageNo,
		pageSize
	};
	getAdsList(params)
		.then((res) => {
			console.log('resres', res);
			// 将请求结果通过complete传给z-paging处理，同时也代表请求结束，这一行必须调用
			paging.value.complete(res.data.records);
		})
		.catch((res) => {
			// 如果请求失败写paging.value.complete(false);
			paging.value.complete(false);
		});
};

const handleClickApp = (url) => {
	// #ifdef APP-PLUS
	plus.runtime.openURL(url);
	// #endif
};
</script>

<style lang="scss" scoped>
.content {
	padding: 20rpx;

	display: flex;
	flex-wrap: wrap;

	.app-item {
		margin-left: 27rpx;
		text-align: center;
		margin-bottom: 20rpx;

		.app-name {
			font-size: 10px;
			margin-top: 5rpx;
		}
		&:nth-child(5n + 1) {
			margin-left: 0;
		}
	}
}
</style>
