<template>
  <view class="discover-content">
    <z-paging
      ref="pagingRef"
      v-model="contentList"
      @query="loadContentData"
      :auto="true"
      :swiper="false"
      :scrollable="false"
    >
      <view class="content-list">
        <card-view
          v-for="item in contentList"
          :key="item.id"
          :item="item"
          @click="handleCardClick(item)"
        />
      </view>
    </z-paging>

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
          >此视频为金币视频,您的金币不足,需充值{{ requiredCoins }}金币数</text
        >
      </template>
    </Dialog>
  </view>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { userinfoStore } from "@/store/userinfos.js";
import Dialog from "@/components/Dialog.vue";
import CardView from "./CardView/CardView.vue";
import { contentList as getContentList } from "@/api/common.js";
import { purchase } from "@/api/community.js";

// 组件属性
const props = defineProps({
  mainTabKey: {
    type: String,
    required: true,
  },
  mainTabOrdering: {
    type: String,
    required: true,
  },
  subCategoryId: {
    type: [String, Number],
    default: null,
  },
  subCategoryName: {
    type: String,
    default: "",
  },
  subCategoryIndex: {
    type: Number,
    default: 0,
  },
});

// 数据列表
const contentList = ref([]);
const pagingRef = ref();

// VIP权限检查相关状态
const store = userinfoStore();
const isVip = computed(() => store.userinfo.is_vip);
const userGoldCoin = computed(() => store.userinfo.gold_coin || 0);

const showVipDialog = ref(false);
const showCoinDialog = ref(false);
const showInsufficientCoinDialog = ref(false);
const currentVideoData = ref(null);

// 计算需要充值的金币数量
const requiredCoins = computed(() => {
  if (currentVideoData.value && currentVideoData.value.price) {
    return currentVideoData.value.price - userGoldCoin.value;
  }
  return 0;
});

// 监听属性变化，重新加载数据
watch(
  () => [props.mainTabKey, props.subCategoryId],
  (newVal, oldVal) => {
    console.log("DiscoverContent属性变化，重新加载数据");
    console.log("新值:", newVal, "旧值:", oldVal);
    console.log("主标签页:", props.mainTabKey, "排序:", props.mainTabOrdering);
    console.log(
      "子分类ID:",
      props.subCategoryId,
      "子分类名称:",
      props.subCategoryName
    );
    console.log("子分类索引:", props.subCategoryIndex);

    // 组件创建时就开始加载数据（因为只有当前显示的子分类才会创建组件）
    console.log("当前子分类组件，开始加载数据");

    if (pagingRef.value) {
      console.log("触发paging重新加载");
      pagingRef.value.reload();
    } else {
      console.log("pagingRef未准备好，稍后重试");
      // 如果pagingRef还没准备好，稍后重试
      setTimeout(() => {
        if (pagingRef.value) {
          console.log("延迟触发paging重新加载");
          pagingRef.value.reload();
        }
      }, 100);
    }
  },
  { immediate: true, deep: true }
);

// 加载内容数据
const loadContentData = async (pageNo, pageSize) => {
  console.log("=== 开始请求内容数据 ===");
  console.log("主标签页:", props.mainTabKey, "排序:", props.mainTabOrdering);
  console.log(
    "子分类ID:",
    props.subCategoryId,
    "子分类名称:",
    props.subCategoryName
  );
  console.log("页码:", pageNo, "页大小:", pageSize);

  try {
    const params = {
      type: "long",
      ordering: props.mainTabOrdering,
      categories: props.subCategoryId,
      currentPage: pageNo,
      pageSize,
    };

    console.log("内容数据API请求参数:", params);

    const res = await getContentList(params);
    console.log("内容数据响应:", res);

    if (res.code === 200) {
      const results = res.data.results || [];
      pagingRef.value.complete(results);
    } else {
      pagingRef.value.complete([]);
    }
  } catch (error) {
    console.error("加载内容数据失败:", error);
    pagingRef.value.complete([]);
  }
};

// VIP权限检查方法
const checkVipPermission = (videoData, actionType = "play") => {
  console.log("检查VIP权限:", videoData, "操作类型:", actionType);
  console.log("视频is_vip:", videoData?.is_vip);
  console.log("视频is_purchase:", videoData?.is_purchase);
  console.log("视频price:", videoData?.price);
  console.log("用户is_vip:", isVip.value);
  console.log("用户金币:", userGoldCoin.value);

  // 如果视频不是VIP视频，直接允许观看
  if (videoData && !videoData.is_vip) {
    console.log("非VIP视频，直接允许观看");
    return true;
  }

  // 如果视频是VIP视频且用户不是VIP
  if (videoData && videoData.is_vip && !isVip.value) {
    console.log("检测到VIP视频且用户非VIP，显示VIP弹窗");
    currentVideoData.value = videoData;
    showVipDialog.value = true;
    return false;
  }

  // 如果用户是VIP，但视频需要购买且用户未购买
  if (videoData && isVip.value && videoData.is_vip && !videoData.is_purchase) {
    console.log("检测到VIP用户但视频需要购买，检查金币余额");
    const videoPrice = videoData.price || 0;

    currentVideoData.value = videoData;

    // 判断金币是否充足
    if (userGoldCoin.value >= videoPrice) {
      console.log("金币充足，显示购买确认弹窗");
      showCoinDialog.value = true; // 第一个设计图：是否花费金币购买
    } else {
      console.log("金币不足，显示充值提示弹窗");
      showInsufficientCoinDialog.value = true; // 第二个设计图：金币不足，请充值
    }

    return false; // 需要购买
  }

  console.log("用户有权限");
  return true; // 有权限
};

// 卡片点击处理
const handleCardClick = (item) => {
  console.log("点击内容卡片:", item);

  if (checkVipPermission(item)) {
    // 有权限，跳转到详情页
    uni.navigateTo({
      url: `/pages/video/video?id=${item.id}`,
    });
  }
};

// VIP弹窗取消
const onVipDialogCancel = () => {
  showVipDialog.value = false;
  // 如果用户还不是VIP，保持遮罩层状态（这里可以添加遮罩层逻辑）
  if (currentVideoData.value && currentVideoData.value.is_vip && !isVip.value) {
    // 可以在这里添加遮罩层显示逻辑
    console.log("用户还不是VIP，保持限制状态");
  }
  currentVideoData.value = null;
};

// VIP弹窗确认
const onVipDialogConfirm = () => {
  showVipDialog.value = false;
  currentVideoData.value = null;
  uni.navigateTo({
    url: "/pages/my/recharge",
  });
};

// 金币购买弹窗取消
const onCoinDialogCancel = () => {
  showCoinDialog.value = false;
  currentVideoData.value = null;
};

// 金币购买弹窗确认
const onCoinDialogConfirm = async () => {
  if (!currentVideoData.value) return;

  try {
    const res = await purchase({ id: currentVideoData.value.id });
    console.log("购买响应:", res);

    if (res.code === 200) {
      // 更新本地数据中的购买状态
      const targetItem = contentList.value.find(
        (item) => item.id === currentVideoData.value.id
      );
      if (targetItem) {
        targetItem.is_purchase = true;
        console.log("更新本地数据购买状态成功:", targetItem.id);
      }

      uni.showToast({
        title: "购买成功",
        icon: "success",
      });
    } else {
      uni.showToast({
        title: res.message || "购买失败",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("购买失败:", error);
    uni.showToast({
      title: "购买失败",
      icon: "error",
    });
  } finally {
    showCoinDialog.value = false;
    currentVideoData.value = null;
  }
};

// 金币不足弹窗取消
const onInsufficientCoinDialogCancel = () => {
  showInsufficientCoinDialog.value = false;
  currentVideoData.value = null;
};

// 金币不足弹窗确认
const onInsufficientCoinDialogConfirm = () => {
  showInsufficientCoinDialog.value = false;
  currentVideoData.value = null;
  uni.navigateTo({
    url: "/pages/my/recharge",
  });
};
</script>

<style lang="scss">
.discover-content {
  height: 100%;
  width: 100%;
}

.content-list {
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: space-between;
}
</style>
