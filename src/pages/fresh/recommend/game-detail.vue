<template>
	<z-paging ref="paging" :loading-more-enabled="false" :refresher-enabled="false">
		<template #top>
			<!-- 导航栏 -->
			<up-navbar bgColor="transparent" color="#fff" placeholder autoBack :fixed="false">
				<template #left>
					<up-icon name="arrow-left" color="#fff" size="18"></up-icon>
				</template>

				<template #center>
					<view>游戏详情</view>
				</template>

				<!-- 	<template #right>
					<view>分享</view>
				</template> -->
			</up-navbar>
		</template>

		<template #bottom>
			<view class="bottom-btn">
				<up-button :text="!dataDetail.isPaied ? '支付金币下载' : '立即下载'" class="custom-down" shape="circle" @click="handleClickDown"></up-button>
			</view>
		</template>

		<view class="content">
			<view class="game-info">
				<up-image :src="dataDetail.imageUrl" width="200rpx" height="200rpx" radius="30rpx"></up-image>

				<view class="info">
					<view class="name">{{ dataDetail.adName }}</view>
					<view class="des">{{ dataDetail.adDescription }}</view>
				</view>
			</view>

			<view class="screen-shoot">
				<view class="tit">游戏截图</view>
				<scroll-view scroll-x="true" style="white-space: nowrap">
					<view class="scroll-shoot">
						<up-image :src="dataDetail.imageUrl" width="710rpx" height="320rpx" radius="30rpx" style="margin-right: 40rpx"></up-image>
					</view>
				</scroll-view>
			</view>

			<view class="long-des">
				<view class="tit">游戏文案</view>
				<view class="des">
					{{ dataDetail.adDescription }}
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

import { gameDetail } from '@/api/public.js';

const id = ref(0);
const paging = ref(null);
const dataDetail = ref({});

onLoad((options) => {
	id.value = options.id;

	queryList();
});

const queryList = (pageNo, pageSize) => {
	gameDetail(id.value).then((res) => {
		console.log('res', res);
		if (res.code === 200) {
			dataDetail.value = res.data;
		}
	});
};

const handleClickDown = () => {
	// #ifdef APP-PLUS
	plus.runtime.openURL(dataDetail.value.clickUrl);
	// #endif
};
</script>

<style lang="scss" scoped>
.content {
	padding: 20rpx;

	display: flex;
	flex-wrap: wrap;

	.game-info {
		display: flex;

		.info {
			margin-left: 20rpx;

			.name {
				margin-top: 20rpx;
				font-size: 21px;
			}

			.des {
				margin-top: 20rpx;
				font-size: 12px;
				color: rgba(255, 255, 255, 0.6);
			}
		}
	}

	.screen-shoot {
		margin-top: 50rpx;

		.tit {
			font-size: 15px;
			margin-bottom: 20rpx;
		}

		.scroll-shoot {
			display: flex;
		}
	}
}

.long-des {
	margin-top: 50rpx;

	.tit {
		font-size: 15px;
		margin-bottom: 20rpx;
	}

	.des {
		font-size: 17px;
	}
}

.bottom-btn {
	background: linear-gradient(180deg, #1a1921 0%, #312744 100%);
	padding: 40rpx 30rpx;

	.custom-down {
		background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
		color: #fff;
		font-size: 17px;
		font-weight: 400;
		border: none;
		height: 85rpx;
	}
}
</style>
