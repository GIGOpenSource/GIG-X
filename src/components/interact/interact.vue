<template>
	<scroll-view scroll-y="true" @scrolltolower="lower" style="max-height: 90vh">
		<view v-for="(item,index) in list" :key="index" class="con"
			@click="uni.navigateTo({url:'/pages/community/details?id='+item.targetId})">
			<view class="desc" v-if="!item.commentContent">{{item.userNickname}}点赞了你的动态</view>
			<view class="desc" v-if="item.commentContent">@{{item.userNickname}}了你：{{item.commentContent}}</view>
			<view class="bg">
				<view class="top">
					<view class="left">
						<view @click.stop="topath(item.authorId)"><up-avatar :src="item.authorAvatar"
								size="40"></up-avatar></view>
						<view class="message">
							<text>{{item.authorNickname}}</text>
						</view>
					</view>
					<view class="follow">
						<text v-if="!item.isFollowingAuthor && item.targetId !== item.userId"
							@click.stop="follow(index)">关注</text>
						<view class="" @click.stop="oparea">
							<up-icon name="more-dot-fill" color="#ffffff" size="28"></up-icon>
						</view>
					</view>
				</view>
				<view class="title">{{item.title}}</view>
				<!-- <view class="images">
					<image src="/static/tsp-icon/touxiang.jpg" mode=""></image>
				</view> -->
			</view>
			<view class="bottom">
				<view class="">
					{{item.createTime}}
				</view>
				<view class="right">
					<view class="" @click.stop="give(index)">
						<up-icon :name="item.isLike? 'thumb-up-fill':'thumb-up'"
							:color="item.isLike? '#ff0000':'#ffffff'" size="26"></up-icon>
						<text>{{item.likeCount || 0}}</text>
					</view>
				</view>
			</view>
		</view>
		<operation :show="show" @update:show="val => show = val" />
		<up-empty mode="data" v-if="!list.length"></up-empty>
	</scroll-view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue'
	import {
		addFollow,
		cancelFollow,
		likeDelete,
		addLike
	} from '@/api/community.js'
	import {
		allList
	} from '@/api/setup.js'
	const src = ref('http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg')
	const show = ref(false)
	const total = ref(0)
	const list = ref([])
	const give = (index) => {

		let params = {
			userId: uni.getStorageSync('user_info').id,
			id: list.value[index].targetId
		}
		if (list.value[index].isLike) {
			likeDelete(params).then(res => {
				list.value[index].likeCount -= 1;
			})
		} else {
			addLike(params).then(res => {
				list.value[index].likeCount += 1;
			})
		}
		list.value[index].isLike = !list.value[index].isLike
	}
	const follow = (index) => {
		let params = {
			followerId: uni.getStorageSync('user_info').id,
			followeeId: list.value[index].targetAuthorId
		}
		if (list.value[index].isFollowingAuthor) {
			cancelFollow(params).then(res => {
				uni.showToast({
					title: '取消关注',
					icon: 'none'
				});
			})
		} else {
			addFollow(params).then(res => {
				list.value[index].isFollowingAuthor = true
				uni.showToast({
					title: '关注成功',
					icon: 'none'
				});
			})
		}
	}
	const oparea = () => {
		console.log('ZOULEMA ')
		show.value = true
	}
	const getlist = () => {
		allList({
			userId: uni.getStorageSync('user_info').id,
			currentPage: 1,
			pageSize: 20
		}).then(res => {
			list.value = res.data.records
			total.value = res.data.total
		})
	}
	const topath = (id) => {
		uni.setStorageSync('otherId', id)
		uni.navigateTo({
			url: '/pages/my/person'
		});
	}
	const lower = () => {
		if (total.value > list.length) {
			total.value++
			getlist()
		}
	}
	onMounted(() => {
		getlist()
	})
</script>

<style lang="scss" scoped>
	.con {
		background: #212028;
		margin-bottom: 20rpx;
		padding: 20rpx;
		border-radius: 15rpx;

		.bg {
			background: #28272e;
			// padding:20rpx;
			padding: 20rpx 20rpx 0 20rpx;
			box-sizing: border-box;
			margin-top: 20rpx;
			border-radius: 20rpx;
		}

		.desc {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;


		.follow {
			display: flex;

			text {
				margin-right: 20rpx;
				border: 1rpx solid #ffffff;
				padding: 10rpx 40rpx;
				border-radius: 60rpx;
				font-size: 28rpx;
			}
		}

		.left {
			display: flex;
			align-items: center;

			.message {
				display: flex;
				flex-direction: column;
				margin-left: 20rpx;

				.time {
					font-size: 18rpx;
					color: rgba(255, 255, 255, .6);
				}
			}
		}
	}

	.title {
		margin: 20rpx 0;
	}

	.images {
		display: flex;
		flex-wrap: wrap;

		image {
			width: 48%;
			height: 300rpx;
			margin: 0 13rpx 30rpx 0;
			border-radius: 15rpx;
		}
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		color: rgba(255, 255, 255, .6);
		font-size: 28rpx;

		view {
			display: flex;
			align-items: center;

		}

		.right {
			display: flex;

			view {
				margin-right: 7rpx;
			}

		}

	}
</style>