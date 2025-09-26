<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList" style="bottom:0;">
		<view class="container">
			<!-- 签到 -->
			<view class="sign">
				<view class="tit">签到任务</view>
				<view class="task">
					<up-image radius="15rpx" src="/static/images/2.png" width="120rpx" height="120rpx"></up-image>
					<view class="name">{{ signlist.name }}</view>
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
          <up-button
            text="立即签到"
            shape="circle"
            class="custom-style"
          ></up-button>
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
						<view class="tab-item" :class="{ active: activeTab === 'novice' }" @click="switchTab('novice')">
							<text class="tab-text">新手任务</text>
						</view>
					</view>
				</view>

				<!-- 任务 -->
				<view class="tasks">
					<view class="task-item" v-for="(item, index) in dataList" :key="index">
						<view class="task">
							<up-image src="/static/images/5.png" width="70rpx" height="70rpx" radius="50%"></up-image>
							<view class="des">
								<view class="title">{{ item.name }}</view>
								<view class="exp">{{ item.description }}</view>
							</view>
						</view>

						<up-button :text="statuslist[item.status]" class="custom-btn"
							:class="item.status == 'pending' ? 'bg1' : 'bg2'" shape="circle"
							@click="btn(item.id)"></up-button>
					</view>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
import { ref } from 'vue';
import { taskList, addtask } from '@/api/common'
const dataList = ref([]);
const list = ref([])
const signlist = ref([])
const currentStep = ref(5);
const paging = ref(null)
const activeTab = ref('daily');
const switchTab = (tab) => {
	activeTab.value = tab;
	paging.value.reload();
};
const statuslist = ({
	pending: '待领取',
	claimed: '已领取',
	completed: '已完成'
})
const queryList = (pageNo, pageSize) => {
	const params = {
		currentPage: pageNo,
		pageSize
	};
	taskList(params).then(res => {
		if (res.code === 200) {
			paging.value.complete(res.data);
			list.value = res.data.filter(item => item.task_template_type == activeTab.value)
			signlist.value = res.data.filter(item => item.task_template_type == 'checkin')[0]
		} else {
			paging.value.complete(false);
		}
	})
}
const btn = (id) => {
	addtask(id)
		.then(res => {
			paging.value.reload();

		})
}
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

<<<<<<< Updated upstream
    .custom-btn {
      width: 190rpx;
      background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
      border: none;
      color: #fff;
      font-size: 15px;
    }
  }
=======
		.custom-btn {
			width: 190rpx;
			border: none;
			color: #fff;
			font-size: 15px;
		}

		.bg1 {
			background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
		}

		.bg2 {
			background: #9b9b9b;
		}
	}
>>>>>>> Stashed changes
}
</style>
