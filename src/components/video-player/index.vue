<template>
	<!-- 视频 -->
	<view>
		<video-player :video="detail?.contentData?.videoUrl"></video-player>

		<!-- 视频price -->
		<!-- <view class="price-line">

			<view class="price">

				<view class="price">
					<up-image src="/static/images/diamond.png" width="12px" height="12px"></up-image>
					<text>66购买</text>
				</view>
				<view class="price">
					<text>（会员价</text>
					<up-image src="/static/images/diamond.png" width="12px" height="12px"></up-image>
					<text>21）</text>
				</view>
			</view>
			<view class="tip">
				会员充值，新用户首充好礼
			</view>
		</view> -->

		<!-- 一件三联 -->
		<view class="three-piece">
			<view class="piece-item" v-for="item in pieceList" :key="item.key">
				<up-image :src="item.acImg" width="24px" height="24px" v-show="item.isActive" @click="handleClickPiece(item)"></up-image>
				<up-image :src="item.img" width="24px" height="24px" v-show="!item.isActive" @click="handleClickPiece(item)"></up-image>

				<text>{{ item.num }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, watch } from 'vue';
import { favoriteAdd } from '@/api/content';

import videoPlayer from './video-player.vue';

const props = defineProps({
	detail: {
		type: Object,
		default: () => {}
	}
});

const videoErrorCallback = () => {};

const give = ref(false);
const iscollect = ref(false);
const collect = () => {
	iscollect.value = !iscollect.value;
};

// 一键三联
const pieceList = ref([
	{
		key: 'thumb',
		isActive: false,
		img: '/static/images/thumb.png',
		acImg: '/static/images/ac-thumb.png',
		num: 0
	},
	{
		key: 'thumbNo',
		isActive: false,
		img: '/static/images/thumb-no.png',
		acImg: '/static/images/ac-thumb-no.png',
		num: 0
	},
	{
		key: 'star',
		isActive: false,
		img: '/static/images/star.png',
		acImg: '/static/images/ac-star.png',
		num: 0
	},
	{
		key: 'share',
		isActive: false,
		img: '/static/images/share.png',
		acImg: '/static/images/share.png',
		num: 0
	}
]);

// 一键三联
const handleClickPiece = (item) => {
	if (item.key === 'share') {
		return uni.$emit('updateOpenForward', item);
	}
	item.isActive = !item.isActive;
	item.isActive ? item.num++ : item.num--;
};

watch(
	() => props.detail,
	(val) => {
		pieceList.value[0].num = props.detail.likeCount;
		pieceList.value[1].num = props.detail.scoreCount;
		pieceList.value[2].num = props.detail.favoriteCount;
		pieceList.value[3].num = props.detail.shareCount;
	}
);
</script>

<style lang="scss" scoped>
// 视频价格
.price-line {
	padding: 10rpx 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 11px;
	background: rgba(20, 20, 20, 1);

	.price {
		display: flex;
		align-items: center;
	}
}

.three-piece {
	display: flex;
	align-items: center;
	padding: 40rpx 0;
	border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);

	.piece-item {
		flex: 1;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;

		text {
			font-size: 10px;
			margin-top: 5rpx;
		}
	}
}
</style>
