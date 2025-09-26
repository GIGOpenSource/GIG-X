<template>
	<scroll-view class="page" scroll-y="true" @scrolltolower="lower">
		<view class="top">
			<view class="">
				全部评论（{{list.length }}）
			</view>
			<view class="tabs">
				<text :class="current == 0 ? 'current':''" @click="tabs(0)">推荐</text>
				<text> / </text>
				<text :class="current == 1 ? 'current':''" @click="tabs(1)">最新</text>
			</view>
		</view>
		<view class="center" v-for="(item,index) in list" :key="index">
			<view class="" @click.stop="topath(item.user_id)">
				<up-avatar :src="item.user_avatar" size="40"></up-avatar>
			</view>
			<view class="right">
				<view class="r-top">
					<view class="info">
						<text class="name">{{item.user_nickname}}</text>
						<text class="time">{{item.create_time}}</text>
					</view>
					<view class="give" @click.stop="give(index)">

						<up-icon :name="item.is_liked?'heart-fill':'heart'" :color="item.is_liked?'#ff0000':'#D9D9D9'"
							size="22"></up-icon>
						<text>{{item.like_count}}</text>
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
			target_id: list.value[index].id,
		}).then(res => {
			list.value[index].is_liked = !list.value[index].is_liked
			if (list.value[index].is_liked) {
				list.value[index].like_count += 1
			} else {
				list.value[index].like_count -= 1
			}
		})
	}
	const commentCon = () => {
		emits('onfocus')
	}
	const tabs = (num) => {
		current.value = num
		getlist()
	}
	const getlist = () => {
		getCommentList({
		    	parent_comment_id:0,
				target_id: props.detailId,
				// type: 'dynamic',
				currentPage: page.value,
				pageSize: 20,
				ordering:current.value?'-create_time':'-like_count'
			})
			.then(res => {
				list.value = [...list.value,...res.data.results]
				total.value = res.data.pagination.total
			})
	}
	const lower = () => {
		if (total.value > list.value.length) {
			page.value++;
			getlist()
		}
	}
	const topath = (id) => {
		uni.setStorageSync('otherId', id)
		uni.navigateTo({url:'/pages/my/person'})
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
		max-height: 46vh;
		margin: 20rpx;
		margin-bottom: 0;
		padding:0 20rpx;
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
			padding-top: 20rpx;
		}
       
		.center {
			display: flex;
			padding-top: 20rpx;

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