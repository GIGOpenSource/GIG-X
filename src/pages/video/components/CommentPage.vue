<template>
	<view class="comment-page">
		<view class="comment-list">
			<view class="comment-item" v-for="(item, index) in list" :key="index">
				<view class="user-line">
					<view class="user">
						<view class="" @click.stop="uni.navigateTo({ url: '/pages/my/person' })">
							<up-avatar :src="item.userAvatar"></up-avatar>
						</view>
						<view class="info">
							<view class="name">{{ item.userNickname || '用户名' }}</view>
							<view class="nums">{{ item.createTime }}</view>
						</view>
					</view>
					<view class="now" @click="give(item)">
						<up-icon :name="item.flag ? 'heart-fill' : 'heart'" :color="item.flag ? '#ff0000' : '#D9D9D9'" size="22"></up-icon>
						<text style="margin-left: 10rpx">{{ item.likeCount }}</text>
					</view>
				</view>

				<view class="des">
					{{ item.content }}
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getCommentList } from '@/api/community';
const props = defineProps({
	id: {
		type: String,
		default: '0'
	}
});

const list = ref([]);

const reload = () => {
	const params = {
		targetId: props.id,
		currentPage: 1,
		pageSize: 9999
	};
	getCommentList(params).then((res) => {
		console.log(res.data);
		if (res.code === 200) {
			list.value = res.data.records;
		}
	});
};

const give = (item) => {
	item.flag = !item.flag;
	if (item.flag) {
		item.likeCount += 1;
	} else {
		item.likeCount -= 1;
	}
};

onLoad(() => {
	console.log(props.id);
	reload();
});

defineExpose({ reload });
</script>

<style lang="scss" scoped>
.comment-page {
	padding: 20rpx;
}

.comment-item {
	padding-bottom: 40rpx;
	border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);
	margin-bottom: 40rpx;
}

.user-line {
	display: flex;
	align-items: center;
	justify-content: space-between;

	.user {
		display: flex;
		align-items: center;

		.info {
			margin-left: 10rpx;

			.name {
				font-size: 15px;
			}

			.nums {
				font-size: 15px;
				color: rgba(255, 255, 255, 0.6);
			}
		}
	}

	.now {
		font-size: 11px;
		display: flex;
		align-items: center;
	}
}

.des {
	font-size: 17px;
	margin-top: 20rpx;
}
</style>
