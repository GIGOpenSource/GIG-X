<template>
	<!-- 简介 -->
	<view class="container">
		<!-- 头像 -->
		<view class="user-line">
			<view class="user">
				<view class="" @click.stop="uni.navigateTo({ url: '/pages/my/person' })">
					<up-avatar :src="detail.authorAvatar"></up-avatar>
				</view>
				<view class="info">
					<view class="name">{{ detail.authorNickname }}</view>
					<view class="nums">{{ detail.favoriteCount }}粉丝</view>
				</view>
			</view>
			<!-- <view class="now">2355人正在看</view> -->
		</view>

		<!-- 简介 -->
		<view class="des">{{ detail.description }}</view>

		<!-- 标签 -->
		<view class="tags">
			<view v-for="(item, index) in detail.tags" :key="index">#{{ item }}</view>
		</view>

		<!-- 评分 -->
		<view class="rate">
			<view class="rate-label">评分</view>
			<up-rate :count="rateCount" v-model="countValue" :readonly="countValue > 0" active-color=" #FFDA70" size="24"></up-rate>
			<text style="margin-left: 10rpx; font-size: 15px; color: rgba(255, 255, 255, 0.6)" v-if="countValue > 0">已评分</text>
		</view>
		<!-- 猜你喜欢 -->
		<guess-like></guess-like>
	</view>
</template>

<script setup>
import { ref } from 'vue';

import GuessLike from './GuessLike.vue';

defineProps({
	detail: {
		type: Object,
		default: () => {}
	}
});

const rateCount = ref(5);
const countValue = ref(0);
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
}

.user-line {
	display: flex;
	align-items: center;
	justify-content: space-between;

	.user {
		display: flex;
		align-items: center;

		.info {
			margin-left: 10rpx;

			.name {
				font-size: 15px;
			}

			.nums {
				font-size: 11px;
				color: rgba(255, 255, 255, 0.6);
			}
		}
	}

	.now {
		font-size: 11px;
	}
}

.des {
	font-size: 17px;
	margin-top: 10rpx;
}

.tags {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	margin-top: 40rpx;

	view {
		padding: 10rpx 20rpx;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.15);
		font-size: 11px;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
	}
}

.rate {
	display: flex;
	align-items: center;
	margin-top: 40rpx;

	.rate-label {
		font-size: 20px;
		margin-right: 40rpx;
	}
}
</style>
