<template>
	<view class="">
		<up-navbar bgColor="#1a1921" placeholder :autoBack="true" :fixed="true">
			<template #left>
				<up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
			</template>
			<template #center>
				{{name || '暂无昵称'}}
			</template>
			<template #right>
				<view class="" @click.stop="oparea">
					<up-icon name="more-dot-fill" color="#ffffff" size="28"></up-icon>
				</view>
			</template>
		</up-navbar>
		<!-- 2是左边 1是右边 -->
		<view class="con" v-for="(item,index) in list" :key="index"
			:style="userId == item.senderId?'align-items: flex-end' :'align-items: flex-start;'">
			<view class="list">
				<view class="" v-if="userId == item.receiverId"><up-avatar :src="item.receiverAvatar" size="40"></up-avatar></view>
				<view class="right" :style="item.ismine == 1 ?' align-items: flex-end' :''">
					<view :class="userId == item.senderId ? 'mine':'con'">{{item.content}}</view>
					<view class="time">{{item.createTime}}</view>
				</view>
				<view class="" v-if="userId == item.senderId"><up-avatar :src="item.senderAvatar" size="40"></up-avatar></view>
			</view>
		</view>
		<view style="height: 100rpx;"></view>
		<view class="bottom">
			<input type="text" placeholder="输入消息内容" v-model="con" />
			<view class="publish" @click="save">发送</view>
		</view>
		<operation :show="show" @update:show="(val) => (show = val)" />
		<!-- <Dialog :modelValue="modelValue" @update:modelValue="val => modelValue = val" /> -->
       <!-- <up-empty mode="data" v-if="!list.length"></up-empty> -->
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		onMounted
	} from 'vue'
	import Dialog from '@/components/Dialog.vue'
	import {
		addlist,
		details
	} from '@/api/message.js'
	import {
		login
	} from '../../api/setup'
	import { onLoad
	} from '@dcloudio/uni-app'
	
	const show = ref(false)
    const receiverId = ref(0)
	const list = ref([])
	const name = ref('')
	const con = ref('')
	const userId = uni.getStorageSync('user_info').id
	const modelValue = ref(false) //是否显示弹窗
	const save = () => {
		addlist({
			senderId: uni.getStorageSync('user_info').id,
			receiverId: receiverId.value,
			content:con.value
		}).then(res => {
			getdetails()
		})
	}
	const oparea = () => {
		show.value = true
	}
	const getdetails = () => {
		details({
			senderId: uni.getStorageSync('user_info').id,
			receiverId: receiverId.value
		}).then(res => {
			list.value = res.data
		})
	}
	onMounted(() => {
		getdetails()
	})
	onLoad((e) => {
		receiverId.value = e.id
		name.value = e.name
		getdetails()
	})
</script>

<style lang="scss" scoped>
	.con {
		display: flex;
		flex-direction: column;

	}

	.list {
		display: flex;
		margin: 20rpx 0 20rpx 20rpx;

		.right {
			margin: 0 20rpx;
			display: flex;
			flex-direction: column;

			.con {
				background: #fff;
				color: #000;
				padding: 20rpx;
				border-radius: 20rpx;
			}

			.mine {
				background: #5662E1;
				color: #fff;
				padding: 20rpx;
				border-radius: 20rpx;
			}

			.time {
				color: rgba(255, 255, 255, .4);
				font-size: 24rpx;
				margin-top: 20rpx;
			}
		}
	}

	.bottom {
		background: linear-gradient(175.26deg, #311F4F 14.46%, #1E1B33 122.11%);
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		padding: 30rpx 30rpx 60rpx 30rpx;
		box-sizing: border-box;
		justify-content: space-between;
		font-size: 26rpx;

		input {
			background: #fff;
			width: 80%;
			font-size: 26rpx;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 60rpx;
			text-indent: 30rpx;
			color: #000;
		}

		.publish {
			background: linear-gradient(180deg, #5662E1 0%, #614793 100%);
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			width: 100rpx;
			border-radius: 60rpx;
		}
	}
</style>