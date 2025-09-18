<template>
	<view class="top">
		<view class="vip-title">{{current == 0?'VIP特权':'金币充值'}}</view>
		<view class="sub-title">{{current == 0?'开通VIP解锁全部特权':'充值赠送限时享受'}}</view>
		<view class="userinfo">
			<view class="left">
				<view class="avatar">
					<up-avatar :src="src" size="30"></up-avatar>
				</view>
				<text>用户昵称</text>
			</view>
			<view class="" v-if="current == 0">
				未开通VIP
			</view>
			<view class=""  v-if="current == 1">
				<text style="font-size: 22rpx;">金币余额：</text>
				<text>99999</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	const { current } = defineProps(['current'])
	const src = ref('http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg')
</script>

<style lang="scss" scoped>
	.top{
		margin: 30rpx;
		padding: 30rpx;
		border-radius: 20rpx;
		color:#F3D4AB ;
		background: #212028;
		.vip-title{
			font-size: 75rpx;
			font-style: italic;
			font-weight: bold;
		}
		.sub-title{
			font-size: 20rpx;
		}
		.userinfo{
			margin-top: 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.left{
				display: flex;
				align-items: center;
				text{
					margin-left: 20rpx;
				}
				.avatar{
					border:1rpx solid #F3D4AB;
					border-radius: 50%;
				}
			}
		}
	}
</style>