<template>
	<view>
		<!-- 头部个人信息 -->
		<view class="top">
			<up-avatar :src="personInfo.avatar" size="60"></up-avatar>
			<view class="right">
				<view class="name">
					<text>{{ personInfo.user_nickname }}</text>
					<text class="vip" v-if="personInfo.is_vip">VIP</text>
				</view>
				<view class="phone">{{ personInfo.username }}</view>
				<view class="phone">{{ personInfo.user_bio || '暂无' }}</view>
			</view>
			<view class="" v-if="isFollow && uni.getStorageSync('user_info').user_id !== userId" @click="follow">
				{{ personInfo.is_follower ? '取消关注' : '关注' }}
			</view>
		</view>
		<!-- 数量 -->
		<view class="num">
			<view class="">
				<text>关注 :</text>
				<text>{{ personInfo.following_count || 0 }}</text>
			</view>
			<view class="">
				<text>粉丝 :</text>
				<text>{{ personInfo.followers_count || 0 }}</text>
			</view>
			<view class="">
				<text>点赞 :</text>
				<text>{{ personInfo.likes_count || 0 }}</text>
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
	followtoggle
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

onShow(() => {
	store.getPersonInfo({
		id: props.userId
	})

})

const follow = () => {
	let params = {
		followee_id: uni.getStorageSync('otherId')
	}
	followtoggle(params).then(res => {
		store.getPersonInfo({
			id: props.userId
		})
	})

};
</script>
<style lang="scss" scoped>
.top {
	display: flex;
	align-items: center;

	.right {
		margin-left: 20rpx;
		line-height: 50rpx;
		width: 70%;

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
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		
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