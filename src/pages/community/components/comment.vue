<template>
	<scroll-view class="page" scroll-y="true" @scrolltolower="lower">
		<view class="top">
			<view class="">
				全部评论（{{list.length }}）
			</view>
			<view class="tabs">
				<text :class="current == 0 ? 'current':''" @click="current = 0">推荐</text>
				<text> / </text>
				<text :class="current == 1 ? 'current':''" @click="current = 1">最新</text>
			</view>
		</view>
		<view class="center" v-for="(item,index) in list" :key="index">
			<view class="" @click.stop="uni.navigateTo({url:'/pages/my/person'})">
				<up-avatar :src="item.userAvatar" size="40"></up-avatar>
			</view>
			<view class="right">
				<view class="r-top">
					<view class="info">
						<text class="name">{{item.userNickname}}</text>
						<text class="time">{{item.createTime}}</text>
					</view>
					<view class="give" @click.stop="give(index)">

						<up-icon :name="item.isLiked?'heart-fill':'heart'" :color="item.isLiked?'#ff0000':'#D9D9D9'"
							size="22"></up-icon>
						<text>{{item.likeCount}}</text>
					</view>
				</view>
				<view class="" @click="commentCon">
					{{item.content}}
				</view>
			</view>
		</view>
		<up-empty mode="data" v-if="!list.length">
		</up-empty>
	</scroll-view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		getCommentList,
		commentlike
	} from '@/api/community.js'
	import {
		userinfoStore
	} from '@/store/userinfos'
	const {
		userinfo
	} = userinfoStore()
	const src = ref('http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg')
	const current = ref(0)
	const list = ref([])
	const page = ref(1)
	const total = ref(0)
	const emits = defineEmits(['commentCon'])
	const props = defineProps({
		detailId: {
			type: Number,
			default: 0, //动态id
		}
	})
	//点赞
	const give = (index) => {
		commentlike({
			userId: userinfo.id,
			likeType: "COMMENT",
			targetId: list.value[index].id,
			targetTitle: list.value[index].content,
			targetAuthorId: list.value[index].userId,
			userNickname: list.value[index].userNickname,
			userAvatar: list.value[index].userAvatar
		}).then(res => {
			list.value[index].isLiked = !list.value[index].isLiked
			if (list.value[index].isLiked) {
				list.value[index].likeCount += 1
			} else {
				list.value[index].likeCount -= 1
			}
		})
	}
	const commentCon = () => {
		emits('onfocus')
	}
	const getlist = () => {
		getCommentList({
			    userId: userinfo.id,
				targetId: props.detailId,
				commentType: 'COMMUNITY',
				currentPage: page.value,
				pageSize: 20
			})
			.then(res => {
				list.value = res.data.records
				total.value = res.data.total
			})
	}
	const lower = () => {
		if (total.value > list.length) {
			total.value++;
			getlist()
		}
	}
	onMounted(() => {
		getlist()
	})
	//暴露
	defineExpose({
		getlist
	})
</script>

<style lang="scss" scoped>
	.page {
		background: #212028;
		width: 95vw;
		// min-height: 20vh;
		max-height: 55vh;
		margin: 20rpx;
		padding: 20rpx;
		font-size: 28rpx;
		border-radius: 20rpx;
		box-sizing: border-box;

		.tabs {
			color: rgb(255, 255, 255, .5);

			.current {
				color: #fff;
			}
		}

		.top {
			display: flex;
			justify-content: space-between;
		}

		.center {
			display: flex;
			margin-top: 20rpx;

			.right {
				width: 600rpx;
				margin-left: 20rpx;
				padding-bottom: 20rpx;
				border-bottom: 1rpx solid rgba(255, 255, 255, .1);

				.r-top {
					display: flex;
					width: 100%;
					justify-content: space-between;
					margin-bottom: 20rpx;
					color: rgb(255, 255, 255, .6);

					.info {
						display: flex;
						flex-direction: column;

						.name {
							color: #fff;
						}

						.time {
							font-size: 24rpx;
						}
					}

					.give {
						display: flex;
						align-items: center;

						text {
							margin-left: 10rpx;
						}
					}
				}


			}
		}
	}
</style>