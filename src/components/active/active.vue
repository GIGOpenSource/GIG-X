<template>
	<scroll-view scroll-y="true" @scrolltolower="lower" style="max-height: 90vh">
		<view v-for="(item, index) in isList ? list : list.slice(0, 1)" :key="index" class="con"
			@click="todetails(item.id)">
			<view class="top">
				<view class="left">
					<view class="" @click.stop="topath(item.user_id)"><up-avatar :src="item.user_avatar"
							size="40"></up-avatar></view>
					<view class="message">
						<text>{{ item.user_nickname || item.followeeNickname || '用户已注销' }}</text>
						<text class="time">{{ item.create_time }}</text>
					</view>
				</view>
				<view class="follow">
					<text
						v-if="!isfollow && !item.is_follower && item.user_id !== uni.getStorageSync('user_info').user_id"
						@click.stop="follow(index)">关注</text>
					<view class="" @click.stop="oparea">
						<up-icon name="more-dot-fill" color="#ffffff" size="28" v-if="more"></up-icon>
					</view>
				</view>
			</view>
			<view class="title">{{ item.title }}</view>
			<view class="images" v-if="item.images">
				<image v-for="(image, indx) in item.images" :key="indx" :src="image" mode=""
					@click="previewImage(item.images)">
				</image>
			</view>
			<view class="distance" v-if="tabs == 3">距离你{{ (Math.random() * 50).toFixed(2) }}km</view>
			<view class="bottom">
				<view class="" @click.stop="share(index, item.id)">
					<up-icon name="share-square" color="#ffffff" size="26"></up-icon>
					<text>{{ item.share_count }}</text>
				</view>
				<view class="right">
					<view class="" @click.stop="give(index, item.id)">
						<up-icon :name="item.is_liked ? 'thumb-up-fill' : 'thumb-up'"
							:color="item.is_liked ? '#ff0000' : '#ffffff'" size="26"></up-icon>
						<text>{{ item.like_count }}</text>
					</view>
					<view class="">
						<up-icon name="order" color="#ffffff" size="26"></up-icon>
						<text>{{ item.comment_count }}</text>
					</view>
				</view>
			</view>
		</view>
		<up-empty mode="data" v-if="!list.length"></up-empty>
		<operation :show="show" @update:show="(val) => (show = val)" />
	</scroll-view>
</template>

<script setup>
import {
	ref,
	reactive,
	onMounted,
	watch
} from 'vue';
import {
	communityList,
	getFollwingList,
	getLatestList,
	getDetails,
	liketoggle,
	addShare,
	followtoggle
} from '@/api/community.js'
import {
	onShow
} from '@dcloudio/uni-app'
import {
	dynamicsList,
	login
} from '@/api/setup.js'
import {
	userinfoStore
} from '@/store/userinfos'
const {
	userinfo
} = userinfoStore()
const src = ref('http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg');
const show = ref(false);
const page = ref(1)
const total = ref(0)
const props = defineProps({
	//是否有更多按钮
	more: {
		type: Boolean,
		default: false,
		required: true
	},
	// 是否有关注
	isfollow: {
		type: Boolean,
		default: true
	},
	isList: {
		type: Boolean,
		default: true,
		required: true
	},
	//是否跳转
	isPath: {
		type: Boolean,
		default: false
	},
	tabs: {
		type: Number,
		default: 0,
	},
	detailId: {
		type: Number,
		default: 0,
	}
});
const list = ref([]);
const todetails = (id) => {
	if(props.isList){
      uni.navigateTo({ url: '/pages/community/details?id=' + id })
	} 
}
//切换点赞状态
const give = (index, id) => {
	let params = { target_id: id }
	if (list.value[index].is_liked) {
		list.value[index].like_count -= 1;
	} else {
		list.value[index].like_count += 1;
	}
	liketoggle(params).then(res => {
		list.value[index].is_liked = !list.value[index].is_liked
	})


};
//关注
const follow = (index) => {
	let params = {
		followee_id: list.value[index].user_id
	}
	followtoggle(params).then(res => {
		list.value[index].is_follower = !list.value[index].is_follower
	})
};
const share = (index, id) => {
	addShare({
		userId: userinfo.id,
		id: id
	}).then(res => {
		list.value[index].shareCount++
	})
}
const oparea = () => {
	show.value = true;
};
//预览图片
const previewImage = (images) => {
	uni.previewImage({
		urls: images
	});
};
const topath = (id) => {
	uni.setStorageSync('otherId', id)
	uni.navigateTo({
		url: '/pages/my/person'
	});
};
const getlist = async (newVal) => {
	let params = {
		currentPage: page.value,
		pageSize: 20,
		user_id: props.isfollow ? uni.getStorageSync('otherId') : uni.getStorageSync('user_info').user_id,
		type: 'dynamic',
		tabs: newVal == 0 || newVal == 3 ? 'recommend' : newVal == 1 ? 'follow' : 'latest'
	}
	let res = {}
	if (newVal == 4) {
		res = await getDetails({
			dynamic_id: props.detailId,
			userId: userinfo.id,
			currentUserId: userinfo.id
		})
		list.value = [res.data]
	} else {
		res = await communityList(params)
		list.value = [...list.value, ...res.data.results]
		total.value = res.data.pagination.total
	}
}

const lower = () => {
	if (total.value > list.length) {
		total.value++
		getlist()
	}

}
// onMounted(() => {
// 	getlist(0)
// })
watch(() => props.tabs, (newVal) => {
	list.value = []
	getlist(newVal)
}, {
	immediate: true
});
//暴露
defineExpose({
	getlist
})
</script>

<style lang="scss" scoped>
.distance {
	margin-bottom: 20rpx;
	font-size: 24rpx;
}

.con {
	background: #212028;
	margin-bottom: 20rpx;
	padding: 20rpx;
	border-radius: 15rpx;
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
				color: rgba(255, 255, 255, 0.6);
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