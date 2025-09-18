<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList">
		<view class="container">
			<!-- 签到 -->
			<view class="sign">
				<view class="tit">签到任务</view>

				<view class="task">
					<up-image radius="15rpx" src="/static/images/2.png" width="120rpx" height="120rpx"></up-image>
					<view class="name">毛绒搪胶玩具</view>
				</view>

				<view class="steps">
					<up-steps :current="currentStep" activeColor="#6370f7" dot>
						<up-steps-item v-for="(item, index) in 7" :key="item">
							<template #title>
								<view style="font-size: 11px">{{ item }}</view>
							</template>
							<template #desc>
								<view style="font-size: 11px">{{ currentStep >= index ? '已签到' : '待签到' }}</view>
							</template>
						</up-steps-item>
					</up-steps>

					<!-- 签到 -->
					<up-button text="立即签到" shape="circle" class="custom-style"></up-button>
					<view class="sign-days">已连续签到{{ currentStep }}天</view>
				</view>
			</view>

			<!-- 任务列表 -->
			<view class="task-list">
				<!-- 任务分类标签 -->
				<view class="task-tabs">
					<view class="tab-list">
						<view class="tab-item" :class="{ active: activeTab === 'daily' }" @click="switchTab('daily')">
							<text class="tab-text">每日任务</text>
						</view>
						<view class="tab-item" :class="{ active: activeTab === 'newbie' }" @click="switchTab('newbie')">
							<text class="tab-text">新手任务</text>
						</view>
					</view>
				</view>

				<!-- 任务 -->
				<view class="tasks">
					<view class="task-item" v-for="item in 10">
						<view class="task">
							<up-image src="/static/images/5.png" width="70rpx" height="70rpx" radius="50%"></up-image>
							<view class="des">
								<view class="title">任务标题</view>
								<view class="exp">任务说明</view>
							</view>
						</view>

						<up-button text="领取奖励" class="custom-btn" shape="circle"></up-button>
					</view>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
import { ref } from 'vue';

const dataList = ref([]);
const currentStep = ref(5);

const activeTab = ref('daily');
const switchTab = (tab) => {
	activeTab.value = tab;
};

const handleClickTaskTab = () => {};

const queryList = () => {};
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;

	.sign {
		padding: 20rpx 30rpx;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 40rpx;

		.tit {
			font-size: 16px;
			margin-bottom: 20rpx;
		}

		.task {
			display: flex;
			flex-direction: column;
			align-items: center;

			.name {
				margin-top: 10rpx;
				font-size: 15px;
			}
		}

		.steps {
			margin-top: 20rpx;
		}

		.custom-style {
			background: linear-gradient(180deg, #5662e1 0%, #614793 100%) !important;
			border: none !important;
			width: 340rpx !important;
			font-size: 17px !important;
			color: #fff !important;
			margin-top: 40rpx;
		}

		.sign-days {
			font-size: 11px;
			color: rgba(255, 255, 255, 0.6);
			text-align: center;
			margin-top: 20rpx;
		}
	}
}

:deep(.u-steps-item__wrapper) {
	background-color: transparent !important;
}

.task-list {
	margin-top: 20rpx;
	padding: 20rpx 30rpx;
	border-radius: 40rpx;
	background: rgba(255, 255, 255, 0.03);

	.tab-list {
		margin-top: 20rpx;
		display: flex;
		background-color: #2d2d2d;
		border-radius: 40rpx;
		border: 2rpx solid #fff;
	}

	.tab-item {
		flex: 1;
		padding: 20rpx 0;
		text-align: center;
		border-radius: 40rpx;
		transition: all 0.3s linear;
		color: #fff;
	}

	.tab-item.active {
		background-color: #ffffff !important;

		.tab-text {
			color: #3a3939;
		}
	}

	.tab-text {
		font-size: 28rpx;
		color: #fff;
		font-size: 17px;
		font-weight: 500;
	}
}

.tasks {
	margin-top: 20rpx;

	.task-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);

		&:last-child {
			border-bottom: none;
		}

		.task {
			display: flex;
			align-items: center;
			flex: 1;

			.des {
				flex: 1;
				margin-left: 20rpx;

				.tit {
					font-size: 15px;
				}

				.exp {
					font-size: 11px;
					color: rgba(255, 255, 255, 0.6);
				}
			}
		}

		.custom-btn {
			width: 190rpx;
			background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
			border: none;
			color: #fff;
			font-size: 15px;
		}
	}
}
</style>
