<template>
	<!-- :style="{ paddingTop: statusBar + 'px'}" -->
	<z-paging ref="pagingRef" @query="queryList">
		<template #top>
			<up-navbar @rightClick="handlClickBack" :autoBack="true" bg-color="transparent" left-icon-color="#fff" :fixed="false"></up-navbar>
			<!-- <view class="back" @click="handlClickBack">
				<up-icon name="arrow-left" size="18" color="#fff"></up-icon>
			</view> -->
			<!-- 视频 -->
			<video-player :detail="detail"></video-player>

			<!-- 广告 -->
			<advertisement></advertisement>

			<up-tabs
				:list="tabs"
				:activeStyle="{
					color: '#fff',
					fontWeight: 'bold',
					transform: 'scale(1.05)'
				}"
				:inactiveStyle="{
					color: 'rgba(255,255,255, .5)',
					transform: 'scale(1)'
				}"
				lineColor="#fff"
				@click="handleClickTab"
			></up-tabs>
		</template>

		<template #bottom>
			<view class="comment-btn" v-show="currentTab === 1">
				<up-input
					placeholder="输入评论内容"
					border="surround"
					shape="circle"
					:customStyle="{
						backgroundColor: '#fff'
					}"
					v-model="commenValue"
				></up-input>

				<up-button text="发表" shape="circle" class="custom-style" @click="publish"></up-button>
			</view>
		</template>

		<!-- 简介 -->
		<introduction v-show="currentTab === 0" :detail="detail"></introduction>

		<!-- 评论 -->
		<comment-page v-show="currentTab === 1" :id="id" ref="commentRef"></comment-page>

		<!-- 转发弹窗 -->
		<forwardMenu v-model="showForward" :forwardInfo="commentInfo"></forwardMenu>
	</z-paging>
</template>

<script setup>
import { reactive, ref } from 'vue';

import { onReady, onLoad } from '@dcloudio/uni-app';

import videoPlayer from '@/components/video-player/index.vue';
import advertisement from '@/components/advertisement/advertisement.vue';
import Introduction from './components/Introduction.vue';
import CommentPage from './components/CommentPage.vue';
import forwardMenu from '@/components/tsp-video/forward-menu/forward-menu.vue';

import { contentDetail } from '@/api/content.js';
import { addComment } from '@/api/community.js';

const commentRef = ref();

const commentInfo = ref();
const showForward = ref(false);
const statusBar = ref(20);

const id = ref(0);

const pagingRef = ref(null);
const detail = ref({});

onReady(() => {
	/* 监听打开转发*/
	uni.$on('updateOpenForward', (data) => {
		commentInfo.value = data.item;
		showForward.value = true;
	});
});
onLoad((options) => {
	statusBar.value = uni.getWindowInfo().statusBarHeight;
	id.value = options.id;
});

const currentTab = ref(0);
const tabs = ref([
	{
		name: '简介'
	},
	{
		name: '评论'
	}
]);

const commenValue = ref('');

const handleClickTab = (e) => {
	currentTab.value = e.index;
};
const handlClickBack = (e) => {
	uni.navigateBack();
};

const queryList = () => {
	contentDetail(id.value).then((res) => {
		console.log('res', res);
		if (res.code === 200) {
			detail.value = res.data;
		}
	});
};

const publish = async () => {
	const params = {
		targetId: id.value,
		content: commenValue.value,
		commentType: 'LONGVIDEO',
		userId: uni.getStorageSync('user_info').id
	};
	const res = await addComment(params);
	console.log('res', res);
	if (res.code === 200) {
		commentRef.value.reload();
	}
};
</script>

<style lang="scss" scoped>
.comment-btn {
	padding: 24rpx 30rpx;
	background: linear-gradient(175.26deg, #311f4f 14.46%, #1e1b33 122.11%);
	display: flex;
	align-items: center;

	.u-input--circle {
		padding: 3px 20rpx !important;
	}
}

.back {
	border-radius: 50%;
	padding: 10rpx;
	background-color: rgba(0, 0, 0, 0.2);
	position: fixed;
	top: 80rpx;
	left: 30rpx;
	z-index: 99;
}

.custom-style {
	width: 100rpx;
	height: 64rpx;
	background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
	color: #fff;
	border: none;
	margin-left: 20rpx;
}
</style>
