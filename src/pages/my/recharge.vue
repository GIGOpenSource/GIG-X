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
		<rechargeUserinfo :current="current" />
		<view class="content">
			<vipTime v-if="current == 0" @getmoney="handmoney" />
			<vipInterests v-if="current == 0" :selectedVipData="membership_benefits" />
			<vipCoin v-if="current == 1" @getmoney="handmoney" />
		</view>
		<view style="height: 200rpx;"></view>
		<view class="bottom">
			<!-- <view class="pay">
				<view class="zfb">支付宝</view>
				<view class="wx">微信支付</view>
			</view> -->
			<view class="vip" @click="btn">{{ current == 0?personInfo.is_vip ? '续费VIP' : '立即开通VIP':'金币充值' }}</view>
		</view>
		<up-popup :show="show" @close="close" @open="open" mode="center" round="10" :closeable="true">
			<view class="popup">
				<image :src="imagesurl" />
			</view>
		</up-popup>
	</view>
</template>

<script setup>
import rechargeUserinfo from './components/recharge-userinfo.vue'
import vipTime from './components/vip-time.vue'
import vipInterests from './components/vip-interests.vue'
import vipCoin from './components/vip-coin.vue'
import {
	pay
} from '@/api/public.js'
import {
	reactive, ref, onMounted
} from 'vue';
import { storeToRefs } from "pinia";
import { userinfoStore } from "@/store/userinfos.js";
const store = userinfoStore();
const { personInfo } = storeToRefs(store);
const tabs = reactive([{
	name: 'VIP'
}, {
	name: '金币'
}
])
const current = ref(0)
const deviceId = ref('')
const imagesurl = ref('')
const show = ref(false);
const money = ref(0)
const membership_benefits = ref([])
const click = (item) => {
	current.value = item.index
}
const path = () => {
	uni.navigateTo({
		url: '/pages/my/bill'
	})
}
const open = () => {
	show.value = true
}
const close = () => {
	show.value = false
}
const handmoney = (e, benefits) => {
	money.value = e
	membership_benefits.value = benefits
}
const btn = () => {
	pay({
		device_id: deviceId.value,
		type: current == 0 ? 'vip' : 'gold',
		money: money.value
	}).then(res => {
		imagesurl.value = res.msg.payUrl
		show.value = true
	})
}
onMounted(() => {
	uni.getSystemInfo({
		success: (res) => {
			deviceId.value = res.deviceId
		}
	})
})

</script>

<style lang="scss" scoped>
.content {
	background: #212028;
	margin: 0 30rpx;
	border-radius: 20rpx;
	padding: 30rpx;
}

.bottom {
	padding: 30rpx 30rpx 50rpx 30rpx;
	position: fixed;
	left: 0;
	bottom: 0;
	background: linear-gradient(180deg, #1A1921 0%, #312744 100%);
	width: 100%;
	box-sizing: border-box;

	.pay {
		display: flex;
		justify-content: space-between;

		view {
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

	.vip {
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

.popup {
	width: 400rpx;
	height: 400rpx;
	display: flex;
	justify-content: center;
	align-items: center;

	image {
		width: 300rpx;
		height: 80%;
	}
}
</style>