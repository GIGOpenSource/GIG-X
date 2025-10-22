<template>
  <view class="guess-like">
    <view class="title">猜你喜欢</view>

    <view class="like-list">
      <view
        class="like-item"
        v-for="item in list"
        @click="handleClickToPage(item)"
      >
        <up-image
          :show-loading="true"
          :src="item.cover_url"
          width="150px"
          height="80px"
          radius="5px"
        ></up-image>
        <view class="like-des">
          <view class="like-name">{{ item.title }}</view>
          <view class="like-user">
            <up-avatar :src="item.author.avatar" size="25"></up-avatar>
            <up-text
              :lines="2"
              :text="item.author.user_nickname"
              color="#fff"
              size="11"
            />
          </view>
        </view>
      </view>
    </view>

    <!-- VIP权限弹窗 -->
    <Dialog
      v-model="showVipDialog"
      :cancelText="'取消'"
      :confirmText="'去开通'"
      :closeOnClickMask="false"
      @cancel="onVipDialogCancel"
      @confirm="onVipDialogConfirm"
      @close="onVipDialogCancel"
    >
      <template #title>VIP视频</template>
      <template #tip>此视频为VIP视频,请开通VIP后观看</template>
    </Dialog>

    <!-- 金币购买弹窗 -->
    <Dialog
      v-model="showCoinDialog"
      :cancelText="'取消'"
      :confirmText="'确定'"
      :closeOnClickMask="false"
      @cancel="onCoinDialogCancel"
      @confirm="onCoinDialogConfirm"
      @close="onCoinDialogCancel"
    >
      <template #title>金币视频</template>
      <template #tip>
        <text
          >此视频为金币视频,是否花费{{
            currentVideoData?.price || 0
          }}个金币</text
        >
      </template>
    </Dialog>

    <!-- 金币不足弹窗 -->
    <Dialog
      v-model="showInsufficientCoinDialog"
      :cancelText="'取消'"
      :confirmText="'去充值'"
      :closeOnClickMask="false"
      @cancel="onInsufficientCoinDialogCancel"
      @confirm="onInsufficientCoinDialogConfirm"
      @close="onInsufficientCoinDialogCancel"
    >
      <template #title>金币不足</template>
      <template #tip>
        <text
          >此视频为金币视频,您的金币不足,需充值{{
            (currentVideoData?.price || 0) - (store.userinfo.gold_coin || 0)
          }}金币</text
        >
      </template>
    </Dialog>
  </view>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { guessLike } from "@/api/common";
import { purchase } from "@/api/community.js";
import Dialog from "@/components/Dialog.vue";
import { userinfoStore } from "@/store/userinfos.js";

const list = ref([]);

// 弹窗相关数据
const showVipDialog = ref(false);
const showCoinDialog = ref(false);
const showInsufficientCoinDialog = ref(false);
const currentVideoData = ref(null);

// 获取用户信息 - 与首页保持一致
const store = userinfoStore();
const is_vip = computed(() => store.userinfo.is_vip);

// 获取猜你喜欢数据
const fetchGuessLikeData = () => {
  return guessLike().then((res) => {
    console.log("🚀 ~ res:", res);
    list.value = res.data.results;
    return res;
  });
};

onMounted(() => {
  fetchGuessLikeData();
});

// 刷新数据方法
const refreshData = () => {
  console.log("刷新猜你喜欢数据");
  return fetchGuessLikeData();
};

// 暴露方法给父组件
defineExpose({
  refreshData,
});
const handleClickToPage = (item) => {
  // 检查VIP权限
  if (item.is_vip && !item.is_purchase) {
    // 如果是VIP视频且未购买，需要权限检查
    checkVipPermission(item);
  } else {
    // 非VIP视频或已购买的VIP视频，直接跳转
    uni.navigateTo({
      url: "/pages/video/video?id=" + item.id,
    });
  }
};

// VIP权限检查
const checkVipPermission = (videoData) => {
  console.log("检查VIP权限:", videoData);
  console.log("视频is_vip:", videoData?.is_vip);
  console.log("视频is_purchase:", videoData?.is_purchase);
  console.log("视频price:", videoData?.price);
  console.log("用户is_vip:", is_vip.value);
  console.log("完整视频数据:", JSON.stringify(videoData, null, 2));

  // 如果视频不是VIP视频，直接允许操作
  if (videoData && !videoData.is_vip) {
    console.log("非VIP视频，直接允许操作");
    uni.navigateTo({
      url: "/pages/video/video?id=" + videoData.id,
    });
    return;
  }

  // 如果视频是VIP视频且用户不是VIP
  if (videoData && videoData.is_vip && !is_vip.value) {
    console.log("检测到VIP视频且用户非VIP，显示弹窗");
    currentVideoData.value = videoData;
    showVipDialog.value = true;
    return;
  }

  // 如果用户是VIP，但视频需要购买且用户未购买
  // 注意：如果 is_purchase 字段不存在，默认为未购买
  const isPurchased = videoData.is_purchase === true;
  console.log("视频是否已购买:", isPurchased);

  if (videoData && is_vip.value && videoData.is_vip && !isPurchased) {
    console.log("检测到VIP用户但视频需要购买，检查金币余额");
    const userGoldCoin = store.userinfo.gold_coin || 0;
    const videoPrice = videoData.price || 0;

    currentVideoData.value = videoData;

    // 判断金币是否充足
    if (userGoldCoin >= videoPrice) {
      console.log("金币充足，显示购买确认弹窗");
      showCoinDialog.value = true;
    } else {
      console.log("金币不足，显示充值提示弹窗");
      showInsufficientCoinDialog.value = true;
    }
    return;
  }

  console.log("用户有权限，直接跳转");
  uni.navigateTo({
    url: "/pages/video/video?id=" + videoData.id,
  });
};

// VIP弹窗取消
const onVipDialogCancel = () => {
  showVipDialog.value = false;
  currentVideoData.value = null;
};

// VIP弹窗确认 - 跳转到VIP开通页面
const onVipDialogConfirm = () => {
  showVipDialog.value = false;
  // 跳转到VIP开通页面
  uni.navigateTo({
    url: "/pages/my/recharge",
  });
  console.log("跳转到VIP开通页面");
  currentVideoData.value = null;
};

// 金币购买弹窗取消
const onCoinDialogCancel = () => {
  showCoinDialog.value = false;
  currentVideoData.value = null;
};

// 金币购买弹窗确认
const onCoinDialogConfirm = () => {
  console.log("确认购买视频，花费金币:", currentVideoData.value?.price);

  // 调用购买接口
  purchase({
    id: currentVideoData.value?.id,
  })
    .then((res) => {
      console.log("购买成功:", res);
      showCoinDialog.value = false;

      // 显示成功提示
      uni.showToast({
        title: "购买成功",
        icon: "success",
        duration: 2000,
      });

      // 购买成功后跳转到视频页面
      uni.navigateTo({
        url: "/pages/video/video?id=" + currentVideoData.value?.id,
      });

      currentVideoData.value = null;
    })
    .catch((err) => {
      console.error("购买失败:", err);
      uni.showToast({
        title: err.message || "购买失败，请重试",
        icon: "none",
        duration: 2000,
      });
    });
};

// 金币不足弹窗取消
const onInsufficientCoinDialogCancel = () => {
  showInsufficientCoinDialog.value = false;
  currentVideoData.value = null;
};

// 金币不足弹窗确认 - 跳转到充值页面
const onInsufficientCoinDialogConfirm = () => {
  showInsufficientCoinDialog.value = false;
  // 跳转到充值页面
  uni.navigateTo({
    url: "/pages/my/recharge",
  });
  console.log("跳转到充值页面");
  currentVideoData.value = null;
};
</script>

<style lang="scss" scoped>
.guess-like {
  margin-top: 40rpx;

  .title {
    font-size: 15px;
  }

  .like-list {
    margin-top: 20rpx;

    .like-item {
      display: flex;
      padding-bottom: 10rpx;

      .like-des {
        margin-left: 20rpx;
        font-size: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .like-user {
          font-size: 11px;
          display: flex;
          align-items: center;

          .name {
            margin-left: 20rpx;
          }
        }
      }
    }
  }
}
</style>
