<template>
  <view class="discover-page">
    <!-- 导航栏 -->
    <up-navbar
      bgColor="transparent"
      placeholder
      :autoBack="false"
      :fixed="false"
      @rightClick="handleSearchClick"
    >
      <template #left>
        <view class="main-tabs">
          <view
            v-for="(tab, index) in mainTabList"
            :key="tab.key"
            class="main-tab-item"
            :class="{ active: currentMainTabIndex === index }"
            @click="handleMainTabClick(index)"
          >
            {{ tab.name }}
          </view>
        </view>
      </template>

      <template #right>
        <view class="search-btn">
          <up-icon name="search" color="#fff" size="22"></up-icon>
          <text>搜索</text>
        </view>
      </template>
    </up-navbar>

    <!-- 子分类标签栏 -->
    <view class="sub-category-container">
      <scroll-view
        scroll-x="true"
        class="sub-category-scroll"
        :show-scrollbar="false"
        :enable-flex="true"
        :scroll-left="categoryScrollLeft"
        scroll-with-animation="true"
      >
        <view class="sub-category-list">
          <view
            v-for="(category, index) in subCategoryList"
            :key="category.id || index"
            class="sub-category-item"
            :class="{ active: currentSubCategoryIndex === index }"
            @click="handleSubCategoryClick(index)"
          >
            {{ category.name }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 内容区域 - 使用swiper实现左右滑动 -->
    <view class="content-container">
      <swiper
        :current="currentSubCategoryIndex"
        @change="handleSwiperChange"
        class="content-swiper"
      >
        <swiper-item
          v-for="(category, index) in subCategoryList"
          :key="`${currentMainTab.key}-${category.id}-${index}`"
          class="swiper-item"
        >
          <!-- 只渲染当前显示的子分类组件，其他位置显示占位 -->
          <DiscoverContent
            v-if="index === currentSubCategoryIndex"
            :key="`${currentMainTab.key}-${category.id}-${index}`"
            :mainTabKey="currentMainTab.key"
            :mainTabOrdering="currentMainTab.ordering"
            :subCategoryId="category.id"
            :subCategoryName="category.name"
            :subCategoryIndex="index"
          />
          <view v-else class="placeholder-content">
            <text>滑动加载中...</text>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, onActivated } from "vue";
import { onShow } from "@dcloudio/uni-app";
import DiscoverContent from "./components/DiscoverContent.vue";
import { getCategories } from "@/api/public.js";

// 主标签页数据
const mainTabList = ref([
  {
    key: "discover",
    name: "发现",
    ordering: "-create_time",
  },
  {
    key: "featured",
    name: "精选",
    ordering: "-like_count",
  },
]);

// 子分类标签数据
const subCategoryList = ref([]);

// 当前选中的主标签页索引
const currentMainTabIndex = ref(0);

// 当前选中的子分类索引
const currentSubCategoryIndex = ref(0);

// 子分类标签是否已加载完成
const subCategoriesLoaded = ref(false);

// 子标签滚动相关
const categoryScrollLeft = ref(0);

// 计算当前主标签页
const currentMainTab = computed(() => {
  return mainTabList.value[currentMainTabIndex.value];
});

// 获取子分类标签
const loadSubCategories = async () => {
  try {
    console.log("开始获取子分类标签...");
    const res = await getCategories();
    console.log("获取子分类标签响应:", res);

    if (res.code === 200 && res.data) {
      const categories = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      subCategoryList.value = categories.map((item, index) => ({
        id: item.id,
        name: item.name || item.title,
      }));

      console.log("处理后的子分类标签:", subCategoryList.value);

      // 设置默认选中的子分类
      if (subCategoryList.value.length > 0) {
        currentSubCategoryIndex.value = 0;
        subCategoriesLoaded.value = true;

        // 初始化滚动位置
        scrollToCategory(0);

        await nextTick();
        console.log("子分类标签加载完成");
      }
    } else {
      throw new Error("子分类标签接口返回异常数据");
    }
  } catch (error) {
    console.error("获取子分类标签失败:", error);
    // 使用默认子分类
    subCategoryList.value = [
      { id: "all", name: "全部" },
      { id: "hot", name: "热门" },
      { id: "new", name: "最新" },
    ];
    currentSubCategoryIndex.value = 0;
    subCategoriesLoaded.value = true;
    await nextTick();
    console.log("使用默认子分类标签");
  }
};

// 主标签页点击处理
const handleMainTabClick = (index) => {
  console.log("主标签页点击:", mainTabList.value[index]);
  currentMainTabIndex.value = index;
  console.log("切换到主标签页:", currentMainTab.value);
};

// 滚动到指定的子标签
const scrollToCategory = (index) => {
  // 计算每个子标签的宽度（根据CSS样式计算）
  // 每个标签的padding是 0 15px，字体大小约15px，估算总宽度
  const itemWidth = 80; // 估算每个标签的平均宽度

  // 计算滚动位置，让当前标签居中显示
  const containerWidth = 375; // 假设容器宽度，可以根据实际情况调整

  // 计算目标滚动位置
  let targetScrollLeft = 0;

  if (index > 0) {
    // 让当前标签尽量居中，但不要滚动过头
    targetScrollLeft = Math.max(
      0,
      index * itemWidth - containerWidth / 2 + itemWidth / 2
    );

    // 确保不会滚动超出范围
    const maxScrollLeft = Math.max(
      0,
      subCategoryList.value.length * itemWidth - containerWidth
    );
    targetScrollLeft = Math.min(targetScrollLeft, maxScrollLeft);
  }

  categoryScrollLeft.value = targetScrollLeft;
  console.log("滚动到子标签:", index, "滚动位置:", targetScrollLeft);
};

// 子分类标签点击处理
const handleSubCategoryClick = (index) => {
  console.log("子分类标签点击:", subCategoryList.value[index]);
  currentSubCategoryIndex.value = index;
  console.log("切换到子分类:", subCategoryList.value[index]);

  // 点击时也滚动到对应位置
  scrollToCategory(index);
};

// swiper滑动处理
const handleSwiperChange = (e) => {
  const currentIndex = e.detail.current;
  console.log("swiper滑动到索引:", currentIndex);
  currentSubCategoryIndex.value = currentIndex;
  console.log("滑动到子分类:", subCategoryList.value[currentIndex]);

  // 滑动时让子标签也滚动到对应位置
  scrollToCategory(currentIndex);

  // 滑动时只加载当前显示的子分类数据
  console.log(
    "swiper滑动，加载当前子分类数据:",
    subCategoryList.value[currentIndex]?.name
  );

  // 使用nextTick确保DOM更新后再处理
  nextTick(() => {
    console.log("swiper滑动完成，当前显示的子分类:", currentIndex);
  });
};

// 搜索按钮点击
const handleSearchClick = () => {
  console.log("搜索按钮点击");
  uni.navigateTo({
    url: "/pages/search/search",
  });
};

// 页面挂载
onMounted(() => {
  console.log("=== discover页面挂载 ===");
  loadSubCategories();
});

// 页面显示时刷新用户信息（每次进入都调用）
onShow(() => {
  console.log("=== discover页面显示 (onShow) ===");
  console.log("discover页面 onShow -> emit refresh-userinfo");
  uni.$emit("refresh-userinfo");
});

// 页面激活时刷新用户信息（用于keep-alive场景）
onActivated(() => {
  console.log("=== discover页面激活 (onActivated) ===");
  console.log("discover页面 onActivated -> emit refresh-userinfo");
  uni.$emit("refresh-userinfo");
});
</script>

<style lang="scss">
.discover-page {
  height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
}

.main-tabs {
  display: flex;
  align-items: center;
  gap: 20px;
}

.main-tab-item {
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    color: #fff;
    font-size: 20px;
    font-weight: 600;
  }
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #fff;
  font-size: 14px;
}

.sub-category-container {
  background: #1a1a1a;
  padding: 0 15px;
}

.sub-category-scroll {
  width: 100%;
  white-space: nowrap;
}

.sub-category-list {
  display: flex;
  align-items: center;
  height: 44px;
  min-width: max-content;
}

.sub-category-item {
  padding: 0 15px;
  height: 44px;
  line-height: 44px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  font-weight: 400;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    color: #fff;
    font-size: 17px;
    font-weight: 500;
  }

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }
}

.content-container {
  flex: 1;
  position: relative;
}

.content-swiper {
  height: 100%;
  width: 100%;
}

.swiper-item {
  height: 100%;
  width: 100%;
}

.placeholder-content {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
}
</style>
