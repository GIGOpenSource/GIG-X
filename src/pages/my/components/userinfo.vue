<template>
	<view>
		<!-- 头部个人信息 -->
		<view class="top">
			<up-avatar :src="personInfo.avatar" size="60"></up-avatar>
			<view class="right">
				<view class="name">
					<text>{{personInfo.nickname}}</text>
					<text class="vip">VIP</text>
				</view>
				<view class="phone">{{personInfo.phone}}</view>
				<view class="phone">{{personInfo.bio || '暂无'}}</view>
			</view>
			<view class="" v-if="isFollow && uni.getStorageSync('user_info').id !== userId" @click="follow">{{status?'取消关注':'关注'}}
			</view>
		</view>
		<!-- 数量 -->
		<view class="num">
			<view class="">
				<text>关注 :</text>
				<text>{{personInfo.followingCount || 0}}</text>
			</view>
			<view class="">
				<text>粉丝 :</text>
				<text>{{personInfo.followersCount || 0}}</text>
			</view>
			<view class="">
				<text>点赞 :</text>
				<text>{{personInfo.likeCount || 0}}</text>
			</view>
		</view>
	</view>
</template>
<script setup>
	import {
		ref
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		storeToRefs
	} from 'pinia'
	import {
		userinfoStore
	} from '@/store/userinfos.js'
	import {
		followCheck
	} from '@/api/setup.js'
	import {
		addFollow,
		cancelFollow
	} from '@/api/community.js'
	const store = userinfoStore()
	const {
		personInfo
	} = storeToRefs(store)
	const {
		userinfo
	} = storeToRefs(store)
	const status = ref(false)
	const props = defineProps({
		isFollow: {
			type: Boolean,
			default: false
		},
		userId: {
			type: Number,
			default: 0
		}
	})
	//检查关注状态
	const check = () => {
		followCheck({
				followerId: uni.getStorageSync('user_info').id,
				followedId: props.userId
			})
			.then(res => {
				status.value = res.data
			})
	}
	onShow(() => {
		store.getPersonInfo({
			id: props.userId
		})
		if (props.isFollow && uni.getStorageSync('user_info').id !== props.userId) {
			console.log(1111);
			check()
		}
	})

	const follow = () => {
		console.log(userinfo,'222');
		let params = {
			followerId: uni.getStorageSync('user_info').id,
			followeeId: personInfo.value.id
		}
		if (status.value) {
			cancelFollow(params).then(res => {
				status.value = false
				uni.showToast({
					title: '取消关注',
					icon: 'none'
				});
			})
		} else {
			addFollow(params).then(res => {
				status.value = true
				uni.showToast({
					title: '关注成功',
					icon: 'none'
				});
			})
		}
	};
</script>
<style lang="scss" scoped>
	.top {
		display: flex;
		align-items: center;

		.right {
			margin-left: 20rpx;
			line-height: 50rpx;
			width: 60%;

			.name {
				display: flex;
				align-items: center;
				margin-bottom: 5rpx;

				.vip {
					background: linear-gradient(270deg, #7D7256 0%, #ECE6D5 100%);
					display: block;
					width: 75rpx;
					height: 40rpx;
					text-align: center;
					margin-left: 10rpx;
					border-radius: 60rpx;
					font-size: 26rpx;
					line-height: 40rpx;
				}
			}

			.phone {
				color: rgba(255, 255, 255, .6);
				font-size: 28rpx;
			}

		}
	}

	.num {
		display: flex;
		margin-top: 20rpx;
		justify-content: space-between;

		view {
			text:nth-of-type(1) {
				margin-right: 15rpx;
				color: rgba(255, 255, 255, .8);

			}
		}
	}
</style>