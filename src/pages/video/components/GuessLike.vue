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
            <up-avatar :src="item.author_avatar" size="25"></up-avatar>
            <up-text
              :lines="2"
              :text="item.author_nickname"
              color="#fff"
              size="11"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { guessLike } from "@/api/common";

const list = ref([]);

onMounted(() => {
  guessLike().then((res) => {
    console.log("🚀 ~ res:", res);
    list.value = res.data.results;
  });
});
const handleClickToPage = (item) => {
  uni.navigateTo({
    url: "/pages/video/video?id=" + item.id,
  });
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
