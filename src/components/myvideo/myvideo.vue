<template>
	<scroll-view scroll-y="true" @scrolltolower="lower" style="max-height: 90vh">
		<view class="tabs">
			<view v-for="(item, index) in tabs" :class="current == index ? 'current' : ''" @click="clicks(index)">
				{{ item }}
			</view>
		</view>
		<view class="con">
			<view class="list" v-for="(item, index) in list" :key="index"
				@click="uni.navigateTo({ url: '/pages/video/video?id=' + item.id })">
				<image :src="item.cover_url" mode="widthFix"></image>
				<view class="play">
					<text>播放：{{ item.view_count }}</text>
					<!-- <text>01:01:01</text>   -->
				</view>
				<view class="title">{{ item.title }}</view>
				<view class="time">{{ item.create_time }}</view>
			</view>
		</view>
		<up-empty mode="data" v-if="!list.length"></up-empty>
	</scroll-view>
</template>
<script setup>
import {
	ref,
	reactive,
	watch
} from 'vue'
import {
	getVideo
} from '@/api/setup.js'
const current = ref(0)
const page = ref(1)
const list = ref([])
const total = ref(0)
const tabs = reactive(['短视频', '长视频'])
const props = defineProps({
	// 是否有关注
	isfollow: {
		type: Boolean,
		default: true
	}
});
const clicks = (index) => {
	current.value = index
	list.value = []
	getlist()
}
const getlist = () => {
	let params = {
		currentPage: page.value,
		pageSize: 20,
		author: props.isfollow ? uni.getStorageSync('otherId') : uni.getStorageSync('user_info').user_id,
		type: current.value ? 'long' : 'short',
		// tabs:'latest'
	}
	getVideo(params).then(res => {
		list.value = [...list.value, ...res.data.results]
		total.value = res.data.total
	})
}
const lower = () => {
	if (total.value > list.value.length) {
		page.value++
		getlist()
	}
}
watch(() => current, (newVal) => {
	list.value = []
	getlist()
}, {
	immediate: true
});
const resetData = () => {
	list.value = [];
	page.value = 1;
	total.value = 0;
	getlist()
}
defineExpose({
	resetData
})
</script>

<style lang="scss" scoped>
.tabs {
	display: flex;

	view {
		margin-right: 15rpx;
		color: rgb(255, 255, 255, .8);
	}

	.current {
		color: #ffffff;
		font-size: 32rpx;
	}
}

.con {
	column-count: 2; //一行几个
	column-gap: 30rpx; //行间距
	margin-top: 30rpx;
}

.list {
	break-inside: avoid; //避免在主体框中插入任何中断（页面，列或区域）。
	background: #212028;
	margin-bottom: 20rpx;
	width: 100%;
	border-radius: 15rpx;
	overflow: hidden;

	image {
		width: 100%;
	}

	.play {
		position: relative;
		font-size: 20rpx;
		margin: -50rpx 0 20rpx 0;
		display: flex;
		justify-content: space-between;
	}

	.time {
		color: rgb(255, 255, 255, .8);
		font-size: 20rpx;
		margin: 15rpx 25rpx;
	}

	.title {
		overflow: hidden;
		/* 超出隐藏   */
		white-space: nowrap;
		/* 不换行     */
		text-overflow: ellipsis;
		/* 省略号     */
		margin: 35rpx 25rpx 0 15rpx;
		font-size: 27rpx;
	}

}
</style>