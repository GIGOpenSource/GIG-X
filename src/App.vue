<script>
import { guid } from "uview-plus";
import { login } from "@/api/setup.js";
import { userinfoStore } from "@/store/userinfos";

export default {
  onLaunch: function () {
    console.log("App Launch");
    let guid_name = guid();
    let guid_password = guid();
    const params = {
      username: uni.getStorageSync("guid_name") || guid_name,
      password: uni.getStorageSync("guid_password") || guid_password,
    };
    login(params).then((res) => {
      uni.setStorageSync("user_info", res.data);
      uni.setStorageSync("token", res.data.token);
      // 延迟调用 store，确保 Pinia 已初始化
      this.$nextTick(() => {
        const store = userinfoStore();
        store.getUserinfo({ id: res.data.user_id });
      });
    });
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-plus/index.scss";

/* #ifdef H5 */
:deep(.uni-tabbar) {
  .uni-tabbar__item:nth-of-type(4) {
    .uni-tabbar__icon {
      width: 42px !important;
      height: 42px !important;
      margin-top: -2px !important;
    }
  }
}
/* #endif */

/* #ifndef APP-NVUE */
page {
  --status-bar-height: 25px;
  --white-op-16: rgba(255, 255, 255, 0.16);
  /* 默认值兜底 */
  background-color: #1a1921;
  color: #fff;
}

// 导航栏搜索
.search {
  display: flex;
  align-items: center;
  background-color: var(--white-op-16);
  padding: 10rpx;
  border-radius: 100rpx;

  text {
    margin-left: 10rpx;
    margin-right: 15rpx;
    color: #fff;
  }
}

/* #endif */

/* #ifdef APP */
.navbar:before {
  display: block;
  content: "";
  height: var(--status-bar-height);
  width: 100%;
}

/* #endif */
</style>
