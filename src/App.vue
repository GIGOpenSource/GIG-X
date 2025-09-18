<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
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
