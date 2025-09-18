<template>
	<view class="con">
		<view class="list" v-for="(item,index) in 10" :key="index" @click="current = index">
			<view :class="current == index ? 'title current-title':'title'">999金币</view>
			<image src="/static/image/coin.png.png"></image>
			<view :class="current == index ? 'prices current-prices':'prices'">19.9元</view>
			<view :class="current == index ? 'ori-prices current-ori-prices':'ori-prices'">999元</view> 
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	const current = ref(0)
</script>

<style lang="scss" scoped>
	.con {
		display: flex;
		justify-content: space-between;
		margin-bottom: 30rpx;
		flex-wrap: wrap;
	}

	.list {
		width: 30%;
		border: 4rpx solid rgba(255, 255, 255, .3);
		height: 300rpx;
		border-radius: 15rpx;
		overflow: hidden;
		display: flex;
		align-items: center;
		flex-direction: column;
		color: rgba(255, 255, 255, .3);
		margin-bottom: 20rpx;
        image{
			width: 80rpx;
			height: 100rpx;
		}
		.title {
			width: 100%;
			height: 60rpx;
			background: rgba(255, 255, 255, .4);
			text-align: center;
			color: #000;
			line-height: 60rpx;
			font-size: 24rpx;
			font-weight: bold;
		}

		.prices {
			margin: 30rpx 0 10rpx 0;
			font-size: 34rpx;
			font-weight: bold;
		}

		.ori-prices {
			font-size: 24rpx;
			text-decoration: line-through;
		}

		.promotion {
			margin-top: 60rpx;
			font-size: 22rpx;
		}

		.current-title {
			background: #F3D4AB;
		}

		.current-prices,
		.current-ori-prices {
			color: #F3D4AB;
		}

		.current-promotion {
			color: #FFF;
		}
	}
</style>