<template>
  <!-- 简介 -->
  <view class="container">
    <!-- 头像 -->
    <view class="user-line">
      <view class="user">
        <view
          class=""
          @click.stop="uni.navigateTo({ url: '/pages/my/person' })"
        >
          <up-avatar :src="detail.author_avatar"></up-avatar>
        </view>
        <view class="info">
          <view class="name">{{ detail.author_nickname }}</view>
          <view class="nums">{{ detail.favorite_count }}粉丝</view>
        </view>
      </view>
      <!-- <view class="now">2355人正在看</view> -->
    </view>

    <!-- 简介 -->
    <view class="des">{{ detail.description }}</view>

    <!-- 标签 -->
    <view class="tags">
      <view v-for="(item, index) in detail.tags" :key="index">#{{ item }}</view>
    </view>

    <!-- 评分 -->
    <view class="rate">
      <view class="rate-label">评分</view>
      <up-rate
        :count="rateCount"
        v-model="countValue"
        active-color=" #FFDA70"
        size="24"
        :readonly="countValue > 0"
        @change="handleChange"
        @click="onRateClick"
      ></up-rate>

      <text
        style="
          margin-left: 10rpx;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.6);
        "
        v-if="countValue > 0"
        >已评分</text
      >
    </view>
    <!-- 猜你喜欢 -->
    <guess-like></guess-like>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";
import { ratingRate, ratingGet } from "@/api/content";
import GuessLike from "./GuessLike.vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
const props = defineProps({
  detail: {
    type: Object,
    default: () => {},
  },
});
const rateCount = ref(5);
const countValue = ref(0);
const isUserRating = ref(false); // 添加标志位来区分用户操作和程序设置

watch(
  () => props.detail,
  (val) => {
    console.log(val, "val");
    if (val && val.id) {
      getRating();
    }
  },
  { immediate: true } // 立即执行一次
);

const getRating = () => {
  ratingGet({ content_id: props.detail.id }).then((res) => {
    // 通过 content_id 筛选出匹配的评分对象
    const rating = res.data;
    if (rating) {
      isUserRating.value = false; // 设置标志位为false，表示这是程序设置
      countValue.value = rating.score;
    }
  });
};

const onRateClick = () => {
  // 标记这是用户操作
  isUserRating.value = true;
};

const handleChange = (value) => {
  // 只有在用户操作时才执行评分逻辑
  if (isUserRating.value) {
    ratingRate({ content_id: props.detail.id, score: value.toFixed(1) }).then(
      (res) => {
        console.log(res, "res");
      }
    );
  }
  // 重置标志位
  isUserRating.value = false;
};
onLoad((e) => {
  console.log("+++++++++++++onLoad", e);
  // getRating(); // 已通过 watch 处理
});

onShow(() => {
  console.log("Introduction组件 onShow - detail:", props.detail);
});
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
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
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .now {
    font-size: 11px;
  }
}

.des {
  font-size: 17px;
  margin-top: 10rpx;
}

.tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 40rpx;

  view {
    padding: 10rpx 20rpx;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.15);
    font-size: 11px;
    margin-right: 10rpx;
    margin-bottom: 10rpx;
  }
}

.rate {
  display: flex;
  align-items: center;
  margin-top: 40rpx;

  .rate-label {
    font-size: 20px;
    margin-right: 40rpx;
  }
}
</style>
