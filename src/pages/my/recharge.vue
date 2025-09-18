<template>
	<view class="">
		<up-navbar bgColor="transparent" placeholder :autoBack="true" :fixed="false">
			<template #left>
				<up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
			</template>
			<template #center>
				<up-tabs :list="tabs" @click="click" lineColor="#fff" :activeStyle="{ color: '#ffffff' }"
					:inactiveStyle="{ color: 'rgba(255,255,255,.4 )' }">
				</up-tabs>
			</template>
			<template #right>
				<view class="" @click="path">
					明细
				</view>
			</template>
		</up-navbar>
		<!-- 用户信息 -->
		<rechargeUserinfo :current="current"/>
		 <view class="content">
			 <vipTime v-if="current == 0"/>
			 <vipInterests v-if="current == 0"/>
			 <vipCoin v-if="current == 1"/>
		 </view>
		 <view style="height: 200rpx;"></view>
		 <view class="bottom">
			 <view class="pay" @click="pay">
				 <view class="zfb">支付宝</view>
				  <view class="wx">微信支付</view>
			 </view>
			 <view class="vip" @click="open">立即开通VIP</view>
		 </view>
	</view>
</template>

<script setup>
	import rechargeUserinfo from './components/recharge-userinfo.vue'
	import vipTime from './components/vip-time.vue'
	import vipInterests from './components/vip-interests.vue'
	import vipCoin from './components/vip-coin.vue'
	import {
		reactive,ref
	} from 'vue';
	const tabs = reactive([{
			name: 'VIP'
		},{
			name: '金币'
		}
	])
    const current = ref(0)
	const click = (item) =>{
		console.log('item', item);
		current.value = item.index
	}
	const path = () => {
		uni.navigateTo({
			url:'/pages/my/bill'
		})
	}
	const pay = () => {
		uni.showToast({
			title: '支付成功',
			success:()=>{
				 
			}
		})
	}
	const open = () => {
		 uni.showToast({
		 	title: '开通成功',
		 	success:()=>{
		 		 
		 	}
		 })
	}
</script>

<style lang="scss" scoped>
	.content{
		background:#212028;
		margin: 0 30rpx;
		border-radius: 20rpx;
		padding: 30rpx;
	}
	.bottom{
		padding: 30rpx 30rpx 50rpx 30rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		background: linear-gradient(180deg, #1A1921 0%, #312744 100%);
		width: 100%;
		box-sizing: border-box;
		.pay{
			display: flex;
			justify-content: space-between;
			view{
				width: 45%;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 80rpx;
				text-align: center;
				background: #fff;
				color: #000;
				font-weight: bold;
				font-size: 28rpx;
			}
		}
		.vip{
			margin-top: 20rpx;
			width: 100%;
			background: linear-gradient(180deg, #5662E1 0%, #614793 100%);
			color: #fff;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 80rpx;
			text-align: center;

		}
	}
</style>