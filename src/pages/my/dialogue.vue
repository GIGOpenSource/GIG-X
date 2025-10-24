<template>
	<view class="">
		<up-navbar bgColor="#1a1921" placeholder :autoBack="true" :fixed="true">
			<template #left>
				<up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
			</template>
			<template #center>
				{{ personInfo.user_nickname || '暂无昵称' }}
			</template>
			<template #right>
				<view class="" @click.stop="oparea">
					<up-icon name="more-dot-fill" color="#ffffff" size="28"></up-icon>
				</view>
			</template>
		</up-navbar>
		<!-- 2是左边 1是右边 -->
		<view class="con" v-for="(item, index) in list" :key="index"
			:style="userId == item.sender_id ? 'align-items: flex-end' : 'align-items: flex-start;'">
			<view class="list">
				<view class="" v-if="userId == item.reply_to_id"><up-avatar :src="item.receiver_avatar"
						size="40"></up-avatar>
				</view>
				<view class="right" :style="item.ismine == 1 ? ' align-items: flex-end' : ''">
					<view :class="userId == item.sender_id ? 'mine' : 'con'">{{ item.content }}</view>
					<view class="time">{{ item.createTime }}</view>
				</view>
				<view class="" v-if="userId == item.sender_id"><up-avatar :src="item.sender_avatar"
						size="40"></up-avatar>
				</view>
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
		<Coin v-model="dialogVisible" @confirm="handleConfirm" @cancel="dialogVisible = false"
			@close="dialogVisible = false" :confirmText="userinfo.is_vip == false ? '去开通' : userinfo.gold_coin < 5 ? '去充值':''">
			<template #tip>
				
				<view class="" v-if="!userinfo.is_vip">该内容需要VIP解锁</view>
				<view class="" v-if="userinfo.is_vip && userinfo.gold_coin < 5">您的金币不足,请充值金币</view>
			</template>
		</Coin>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import Dialog from '@/components/Dialog.vue'
	import Coin from "@/components/Coin.vue";
	import {
		details,
		createRoom,
		sendMessage
	} from '@/api/message.js'
	import {
		storeToRefs
	} from 'pinia'
	import {
		userinfoStore
	} from '@/store/userinfos.js'
	const store = userinfoStore()
	const {
		personInfo
	} = storeToRefs(store)
	const dialogVisible = ref(false);
	const show = ref(false)
	const reply_to_id = ref(0)
	const list = ref([])
	const name = ref('')
	const con = ref('')
	const userId = uni.getStorageSync('user_info').user_id
	const modelValue = ref(false) //是否显示弹窗
	const userinfo = ref(store.userinfo) // 本地用户信息
	const handleConfirm = () => {
		uni.navigateTo({
			url:'/pages/my/recharge'
		})
	}
	const save = () => {
		if(!userinfo.value.is_vip || userinfo.value.gold_coin < 5){
			dialogVisible.value = true
			return
		} 
		if (personInfo.value.session_id) {
			sendMessage({
					receiver_id: personInfo.value.session_id,
					reply_to_id: personInfo.value.id,
					content: con.value
				})
				.then(res => {
					con.value = ''
					store.getUserinfo({
						id: uni.getStorageSync('user_info').user_id
					}).then(() => {
						userinfo.value = store.userinfo
						getdetails()
					})
				})
		} else {
			createRoom({
				other_user_id: personInfo.value.id,
				session_id: personInfo.value.session_id,
			}).then(result => {
				sendMessage({
						receiver_id: result.data.session_id,
						reply_to_id: personInfo.value.id,
						content: con.value
					})
					.then(res => {
						con.value = ''
						store.getPersonInfo({
							id: personInfo.value.id
						})
						store.getUserinfo({
							id: uni.getStorageSync('user_info').user_id
						}).then(() => {
							userinfo.value = store.userinfo
							getdetails()
						})
					})
			})
		}

	}
	const oparea = () => {
		show.value = true
	}
	const getdetails = () => {
		details({
			receiver_id: personInfo.value.session_id,
			currentPage: 1,
			pageSize: 100
		}).then(res => {
			list.value = res.data.results
		})
	}
	onMounted(() => {
		if (personInfo.value.session_id) {
			getdetails()
		}
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