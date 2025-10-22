<template>
  <z-paging ref="paging">
    <up-navbar
      bgColor="transparent"
      placeholder
      :autoBack="isBack"
      :fixed="false"
    >
      <template #left>
        <up-icon
          name="arrow-left"
          color="#ffffff"
          size="20"
          v-if="isBack"
        ></up-icon>
      </template>
      <template #right>
        <view v-if="!isBack">
          <text class="" @click="toPath('/pages/my/message')">消息中心</text>
          <text class="setup" @click="toPath('/pages/my/setup')">设置</text>
        </view>
      </template>
    </up-navbar>
    <view class="content">
      <userinfo
        :isFollow="isBack"
        :userId="
          isBack
            ? uni.getStorageSync('otherId')
            : uni.getStorageSync('user_info').user_id
        "
      />
      <vip v-if="!isBack && personInfo.is_vip" />
      <!-- 动态，视频，互动 -->
      <view class="tabs">
        <view
          v-for="(item, index) in tarbar"
          :key="index"
          :class="current == index ? 'current' : ''"
          @click="clicks(index)"
          >{{ item }}</view
        >
      </view>
      <active1
        v-if="current == 0"
        :isfollow="isBack"
        :more="true"
        :tabs="6"
        ref="act"
      />
      <myvideo v-if="current == 1" :isfollow="isBack" ref="video" />
      <interact v-if="current == 2" :isfollow="isBack" ref="hudong" />
    </view>
    <view style="height: 80rpx" v-if="isBack"></view>
  </z-paging>

  <view
    class="private-message"
    v-if="
      isBack &&
      uni.getStorageSync('user_info').user_id !== uni.getStorageSync('otherId')
    "
    @click="toPath('/pages/my/dialogue')"
    >私信</view
  >
</template>

<script setup>
import { onShow } from "@dcloudio/uni-app";
import { ref, reactive, onMounted } from "vue";
import userinfo from "./userinfo.vue";
import vip from "./vip.vue";
import { userinfoStore } from "@/store/userinfos";
import { onPullDownRefresh } from "@dcloudio/uni-app";
const store = userinfoStore();
const personInfo = ref({})

// 初始化时获取用户信息
const getUserInfo = () => {
	store.getUserinfo({ id: uni.getStorageSync('user_info').user_id }).then(() => {
		personInfo.value = store.personInfo
	})
}

// 组件初始化时获取用户信息
getUserInfo()

const props = defineProps({
  isBack: {
    type: Boolean,
    default: false,
  },
});
const list = ref([
  {
    name: "消息中心",
  },
  {
    name: "设置",
  },
]);
const tarbar = ref(["动态", "视频", "互动"]);
const current = ref(0);
const act = ref(null);
const video = ref(null);
const hudong = ref();
const clicks = (index) => {
  current.value = index;
};
const onTabChange = (tab) => {
  console.log(tab);
};
const toPath = (url) => {
  uni.navigateTo({
    url,
  });
};
onMounted(() => {
  if (!props.isBack) {
    tarbar.value = ["动态", "视频", "互动"];
  } else {
    tarbar.value = ["动态", "视频"];
  }
});
onShow(() => {
	getUserInfo()
})
onPullDownRefresh(() => {
  if (current.value == 0) {
    act.value.page = 1;
    act.value.refreshData();
  } else if (current.value == 1) {
    video.value.page = 1;
    video.value.list = [];
    video.value.resetData();
  } else if (current.value == 2) {
    hudong.value.resetData();
  }

  uni.stopPullDownRefresh();
});
</script>

<style lang="scss" scoped>
.content {
  // background: pink;
  margin: 30rpx;
}

.setup {
  margin-left: 30rpx;
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin: 30rpx 0;

  view {
    width: 33%;
    text-align: center;

    height: 70rpx;
    line-height: 70rpx;
    border-radius: 80rpx;
    color: #fff;
  }

  .current {
    background: #ffffff;
    color: #000;
  }
}
.private-message {
  background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
  width: 92%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 80rpx;
  position: fixed;
  left: 30rpx;
  bottom: 30rpx;
}
</style>
