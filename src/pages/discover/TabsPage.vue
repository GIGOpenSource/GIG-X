<template>
	<z-paging ref="pagingRef" v-model="dataList" @query="queryList">
		<view class="content">
			<!-- <BannerSwiper /> -->

			<view class="card-list">
				<card-view :item="item" v-for="item in dataList" @click="handleToLongVideo(item.id)"></card-view>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['tabIndex', 'current']);

import BannerSwiper from './components/BannerSwiper/BannerSwiper.vue';
import CardView from './components/CardView/CardView.vue';

import { discoverList } from '@/api/content.js';

const pagingRef = ref();
const dataList = ref([]);

watch(
	() => props.current,
	(val, oldVal) => {
		pagingRef.value.reload();
	}
);

const queryList = (pageNo, pageSize) => {
	const params = {
		contentType: 'LONGVIDEO',
		selectType: props.current == 0 ? 'F' : 'T',
		currentPage: pageNo,
		pageSize
	};
	discoverList(params).then((res) => {
		console.log('props.current', res);
		if (res.code === 200) {
			pagingRef.value.complete(res.data.records);
		}
	});
};

const handleToLongVideo = (id) => {
	uni.navigateTo({
		url: '/pages/video/video?id=' + id
	});
};
</script>

<style lang="scss" scoped>
.content {
	padding: 20rpx;
}

.card-list {
	display: flex;
	flex-wrap: wrap;
	margin-top: 20rpx;

	.card-view {
		margin-right: 30rpx;
		margin-bottom: 30rpx;

		&:nth-child(2n) {
			margin-right: 0;
		}
	}
}
</style>
