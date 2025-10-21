<template>
  <view class="pageBox">
    <tw-videov
      ref="videoGroup"
      @lodData="loadingData"
      @refreshData="refreshData"
      :autoplay="autoplay"
      :nextPlay="nextPlay"
      :loopPlay="loopPlay"
      :swId="swId"
      @doubleClick="doubleClick"
      @longpress="longpress"
      @swiperChange="swiperChange"
      :totalvod="totalvod"
      @removeAllData="removeAllData"
      @showVipDialog="onShowVipDialog"
      @showCoinDialog="onShowCoinDialog"
      @showInsufficientCoinDialog="onShowInsufficientCoinDialog"
      @checkVipPermission="onCheckVipPermission"
    ></tw-videov>

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
        <text>此视频为金币视频,您的金币不足,请充值</text>
      </template>
    </Dialog>

    <!-- <view class="automatic">
			<view class="automatic-item" @click="openAutomatic">点击{{nextPlay?'关闭自动播放':'开启自动播放'}}</view>
			<view class="automatic-item" @click="addVodData">点击在当前视频下标{{currIndex}}后插入视频</view>
			<view class="automatic-item" @click="removeVodData">点击删除视频</view>
			<view class="automatic-item" @click="specifyPlay(currIndex + 1)">点击指定第{{currIndex + 1}}个视频播放</view>
		</view> -->
  </view>
</template>

<script>
/*
 * vue页面引用 H5、小程序引用示例
 */
import twVideov from "@/components/tsp-video/tsp-video-list/video-v.vue";
import Dialog from "@/components/Dialog.vue";
import { contentList, contentFollowList } from "@/api/common";
import { userinfoStore } from "@/store/userinfos.js";
import { computed, ref } from "vue";

export default {
  components: {
    twVideov,
    Dialog,
  },
  props: {
    /* 多个tab视频时需传入不同的类型id */
    swId: {
      type: String,
      default: "",
    },
    /* 当前tabsPage的下标 */
    pageIndex: {
      type: Number,
      default: 0,
    },
    /* 当前tab栏下标 */
    tabIndex: {
      type: Number,
      default: 0,
    },
    /* 当前tab栏数据 */
    tabItem: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const store = userinfoStore();
    const is_vip = computed(() => store.userinfo.is_vip);
    const showVipDialog = ref(false);
    const showCoinDialog = ref(false);
    const showInsufficientCoinDialog = ref(false);
    const currentVideoData = ref(null);

    return {
      store,
      is_vip,
      showVipDialog,
      showCoinDialog,
      showInsufficientCoinDialog,
      currentVideoData,
    };
  },
  data() {
    return {
      videoData: [],
      autoplay: true,
      nextPlay: false,
      loopPlay: true,
      tNum: 0,
      currIndex: 0,
      totalvod: 0, //视频总数量，有值才能滑动加载到最后一个视频并禁止循环滑动（仅H5、小程序支持）
    };
  },
  created() {
    // this.videoData = getVodData()
    this.initVod();
  },
  onShow() {
    /* 播放视频 */
    if (this.$refs.videoGroup) {
      this.$refs.videoGroup.showPlay();
      this.$refs.videoGroup.muteVideo(false); //取消视频播放设置为静音，解决切换到其他页面后因为网络问题还在有声音播放
    }
  },
  onHide() {
    /* 暂停视频 */
    if (this.$refs.videoGroup) {
      this.$refs.videoGroup.hidePause();
      this.$refs.videoGroup.muteVideo(true); //视频播放设置为静音，解决切换到其他页面后因为网络问题还在有声音播放
    }
  },
  watch: {
    tabIndex(val) {
      //tab栏切换监听操作
      this.$nextTick(() => {
        if (this.$refs.videoGroup) {
          if (val != this.pageIndex) {
            //tab视频并不在当前视频页
            this.$refs.videoGroup.muteVideo(true); //视频播放设置为静音，解决切换到其他页面后因为网络问题还在有声音播放
          } else {
            this.$refs.videoGroup.muteVideo(false); //取消视频播放设置为静音，解决切换到其他页面后因为网络问题还在有声音播放
          }
        }
      });
    },
  },
  methods: {
    startData() {
      console.log(this.tabItem);

      let fn = this.tabItem.id === "follow" ? contentFollowList : contentList;
      let params = {
        type: "short",
        // tabs: this.tabItem.id,
        ordering:
          this.tabItem.id === "recommend"
            ? "-like_count"
            : this.tabItem.id === "latest"
            ? "-create_time"
            : "-like_count",
        currentPage: this.tNum + 1,
      };

      this.tabItem.id === "follow" && delete params.ordering;

      return new Promise((resolve, reject) => {
        fn(params)
          .then((res) => {
            console.log("🚀 ~ startData ~ res:", res);
            if (res.code === 200) {
              this.tNum += 1;
              this.totalvod = res.data.pagination.total; //视频总数量，有值才能滑动加载到最后一个视频并禁止循环滑动（仅H5、小程序支持）
              let dataList = res.data.results;
              dataList.filter((item, index) => {
                /** 参数数据自行拼接  */
                item.tsId = "tsId" + (this.tNum * 15 + index); //视频id，用于删除视频, 需要改成自己的视频id
                item.vodUrl = item.data;
                item.coverImg = item.cover_url; //视频封面
                item.coverShow = false; //是否显示视频封面，vue 小程序端不播放会显示视频，可以不用显示封面，App不播放不会显示视频，就需要封面了
                item.object_fit = item.object_fit; //视频的显示类型
                item.fullScreenShow = item.fullScreenShow; //是否有全屏观看按钮
                item.sliderShow = true; //是否显示进度条
                item.rotateImgShow = false; //是否显示旋转头像
                item.fabulousShow = item.is_liked; //是否点赞
                item.collectionShow = item.is_favourites; //是否收藏
                item.followReally = item.is_follower; //是否已经关注
                item.desc = item.description; //视频描述
                item.author = item.author; //作者名称
                item.likeCount = item.like_count; //点赞数量
                item.commentCount = item.comment_count; //评论数量
                item.favoriteCount = item.favorite_count; //收藏数量
                item.is_vip = item.is_vip; //VIP状态
                console.log(
                  "视频数据设置 - 视频ID:",
                  item.id,
                  "VIP状态:",
                  item.is_vip
                );
              });
              if (dataList.length > 0) {
                resolve(dataList);
              } else {
                resolve([]);
              }
            } else {
              resolve([]);
            }
          })
          .catch((err) => {
            resolve([]);
          });
      });
    },
    /* 初始加载视频数据 */
    initVod() {
      this.startData().then((res) => {
        if (res.length > 0) {
          /* 调用视频的初始方法 */
          if (this.swId && this.tabIndex != this.pageIndex) {
            //tab视频加载后并不在当前视频页，关闭自动播放
            this.autoplay = false;
          } else {
            this.autoplay = true;
          }
          // #ifdef H5
          this.autoplay = false;
          // #endif
          this.$nextTick(() => {
            this.$refs.videoGroup.initVod(res, 0); //0是播放的下标（默认播放下标是0）不需要指定视频播放可不传

            // 初始化完成后检查第一个视频的VIP权限
            setTimeout(() => {
              if (res.length > 0) {
                this.checkVipPermission(res[0]);
              }
            }, 200);
          });
        }
      });
    },
    /* 下拉刷新 */
    refreshData() {
      this.tNum = 0;
      this.startData().then((res) => {
        if (res.length > 0) {
          /* 调用视频的重新加载方法 */
          setTimeout(() => {
            if (this.swId && this.tabIndex != this.pageIndex) {
              //tab视频刷新后并不在当前视频页，关闭自动播放
              this.autoplay = false;
            } else {
              this.autoplay = true;
            }
            this.$nextTick(() => {
              this.$refs.videoGroup.refreshSquare(res); //0是播放的下标（默认播放下标是0）下标是从0开始

              // 刷新完成后检查第一个视频的VIP权限
              setTimeout(() => {
                if (res.length > 0) {
                  this.checkVipPermission(res[0]);
                }
              }, 200);
            });
          }, 2000);
        }
      });
    },
    /* 上拉加载 */
    loadingData() {
      this.startData().then((res) => {
        if (res.length > 0) {
          /* 调用视频的到底加载方法方法 */
          this.$refs.videoGroup.lodingData(res);
        }
      });
    },
    /* 双击回调 */
    doubleClick(event) {
      // console.log('双击当前视频回调',event)
    },
    /* 长按当前视频回调 */
    longpress(event, list) {
      // console.log('长按当前视频回调',event)
    },
    /* swiper切换当前视频回调 */
    swiperChange(event) {
      // console.log('swiper切换当前视频回调',event)
      this.currIndex = event.videoIndex;

      // 检查当前视频的VIP权限
      if (this.$refs.videoGroup && this.$refs.videoGroup.totalPlayList) {
        const currentVideo =
          this.$refs.videoGroup.totalPlayList[event.videoIndex];
        if (currentVideo) {
          this.checkVipPermission(currentVideo);
        }
      }
    },
    /* 是否开启自动播放 */
    openAutomatic() {
      this.nextPlay = !this.nextPlay;
      this.loopPlay = this.nextPlay ? false : true;
    },
    /* 添加、指定位置插入视频*/
    addVodData() {
      this.startData().then((res) => {
        if (res.length > 0) {
          /* 调用添加视频方法 */
          this.$refs.videoGroup.addVodData(res, this.currIndex);
        }
      });
    },
    /* 删除视频 */
    removeVodData() {
      /* 调用删除视频方法 */
      // this.totalvod = 7 //删除视频后如果没有分页加载数据了，需设定总数量才能滑动加载到最后一个视频并禁止循环滑动
      this.$refs.videoGroup.removeVodData([
        "tsId0",
        "tsId1",
        "tsId2",
        "tsId3",
        "tsId4",
        "tsId5",
        "tsId6",
        "tsId7",
        "tsId8",
        "tsId9",
        "tsId10",
        "tsId11",
        "tsId12",
        "tsId13",
        "tsId14",
      ]);
    },
    /* 视频已被全部删除回调 */
    removeAllData() {
      // console.log('视频已被全部删除')
    },
    /* 选择指定视频下标播放 下标是从0开始*/
    specifyPlay(playIndex) {
      /* 调用选择指定视频下标播放 */
      this.$refs.videoGroup.scrollToVod(playIndex);
    },
    /* tabVideo onShow 播放视频 */
    assemblyOnShow() {
      if (this.$refs.videoGroup) {
        this.$refs.videoGroup.showPlay();
        this.$refs.videoGroup.muteVideo(false); //取消视频播放设置为静音，解决切换到其他页面后因为网络问题还在有声音播放
      }
    },
    /* tabVideo onHide 暂停视频 */
    assemblyOnHide() {
      if (this.$refs.videoGroup) {
        this.$refs.videoGroup.hidePause();
        this.$refs.videoGroup.muteVideo(true); //视频播放设置为静音，解决切换到其他页面后因为网络问题还在有声音播放
      }
    },
    /* tabVideo进度条滑动事件 */
    appVodTouchmoveSlider(event) {
      this.$refs.videoGroup.touchmoveSlider(event);
    },
    /* tabVideo进度条滑动结束事件 */
    appVodTouchendSlider(event) {
      this.$refs.videoGroup.touchendSlider(event);
    },
    /* VIP权限检查 */
    checkVipPermission(videoData, actionType = "play") {
      console.log("检查VIP权限:", videoData, "操作类型:", actionType);
      console.log("视频is_vip:", videoData?.is_vip);
      console.log("视频is_purchase:", videoData?.is_purchase);
      console.log("视频price:", videoData?.price);
      console.log("用户is_vip:", this.is_vip);

      // 如果视频是VIP视频且用户不是VIP
      if (videoData && videoData.is_vip && !this.is_vip) {
        console.log("检测到VIP视频且用户非VIP，显示弹窗");
        this.currentVideoData = videoData;
        this.showVipDialog = true;

        // 根据操作类型进行不同处理
        if (actionType === "play") {
          // 如果是播放操作，暂停当前视频并显示遮罩层
          if (this.$refs.videoGroup) {
            this.$refs.videoGroup.videoPause(this.$refs.videoGroup.vodIndex);
          }
          // 显示VIP遮罩层
          this.showVipMask = true;
        }

        return false; // 没有权限
      }

      // 如果用户是VIP，但视频需要购买且用户未购买
      if (
        videoData &&
        this.is_vip &&
        videoData.is_vip &&
        !videoData.is_purchase
      ) {
        console.log("检测到VIP用户但视频需要购买，检查金币余额");
        const userGoldCoin = this.store.userinfo.gold_coin || 0;
        const videoPrice = videoData.price || 0;

        this.currentVideoData = videoData;

        // 根据操作类型进行不同处理
        if (actionType === "play") {
          // 如果是播放操作，暂停当前视频
          if (this.$refs.videoGroup) {
            this.$refs.videoGroup.videoPause(this.$refs.videoGroup.vodIndex);
          }
        }

        // 判断金币是否充足
        if (userGoldCoin >= videoPrice) {
          console.log("金币充足，显示购买确认弹窗");
          this.showCoinDialog = true; // 第一个设计图：是否花费金币购买
        } else {
          console.log("金币不足，显示充值提示弹窗");
          this.showInsufficientCoinDialog = true; // 第二个设计图：金币不足，请充值
        }

        return false; // 需要购买
      }

      console.log("用户有权限");
      return true; // 有权限
    },
    /* VIP弹窗取消 */
    onVipDialogCancel() {
      this.showVipDialog = false;
      // 如果用户还不是VIP，显示遮罩层
      if (
        this.currentVideoData &&
        this.currentVideoData.is_vip &&
        !this.is_vip
      ) {
        this.showVipMask = true;
      }
      this.currentVideoData = null;
    },
    /* VIP弹窗确认 - 跳转到VIP开通页面 */
    onVipDialogConfirm() {
      this.showVipDialog = false;
      this.showVipMask = false;
      // 跳转到VIP开通页面
      uni.navigateTo({
        url: "/pages/my/recharge",
      });
      console.log("跳转到VIP开通页面");
    },
    /* 处理来自菜单组件的VIP权限弹窗请求 */
    onShowVipDialog(data) {
      console.log("收到VIP权限检查请求:", data);
      this.currentVideoData = data.videoData;
      this.showVipDialog = true;
      // 对于菜单操作，不显示遮罩层
      this.showVipMask = false;
    },
    /* 处理来自菜单组件的金币购买弹窗请求 */
    onShowCoinDialog(data) {
      console.log("收到金币购买检查请求:", data);
      this.currentVideoData = data.videoData;
      this.showCoinDialog = true;
    },
    /* 处理来自菜单组件的金币不足弹窗请求 */
    onShowInsufficientCoinDialog(data) {
      console.log("收到金币不足检查请求:", data);
      this.currentVideoData = data.videoData;
      this.showInsufficientCoinDialog = true;
    },
    /* 处理来自视频组件的VIP权限检查请求 */
    onCheckVipPermission(data) {
      console.log("收到VIP权限检查请求:", data);
      const { videoData, actionType, callback } = data;

      // 检查VIP权限
      const hasPermission = this.checkVipPermission(videoData, actionType);

      // 调用回调函数返回结果
      if (callback && typeof callback === "function") {
        callback(hasPermission);
      }
    },
    /* 金币购买弹窗取消 */
    onCoinDialogCancel() {
      this.showCoinDialog = false;
      this.currentVideoData = null;
    },
    /* 金币购买弹窗确认 */
    onCoinDialogConfirm() {
      this.showCoinDialog = false;
      // 这里可以调用购买接口
      console.log("确认购买视频，花费金币:", this.currentVideoData?.price);
      // TODO: 调用购买接口，购买成功后更新视频的 is_purchase 状态
      this.currentVideoData = null;
    },
    /* 金币不足弹窗取消 */
    onInsufficientCoinDialogCancel() {
      this.showInsufficientCoinDialog = false;
      this.currentVideoData = null;
    },
    /* 金币不足弹窗确认 - 跳转到充值页面 */
    onInsufficientCoinDialogConfirm() {
      this.showInsufficientCoinDialog = false;
      // 跳转到充值页面
      uni.navigateTo({
        url: "/pages/my/recharge",
      });
      console.log("跳转到充值页面");
      this.currentVideoData = null;
    },
  },
};
</script>

<style>
.pageBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
}
.automatic {
  position: absolute;
  z-index: 20;
  top: 160rpx;
  left: 50rpx;
}
.automatic-item {
  margin-top: 15rpx;
  font-size: 32rpx;
  color: blue;
}
.automatic-item:active {
  transform: scale(0.8);
  transition: all 0.3s linear;
}
</style>
