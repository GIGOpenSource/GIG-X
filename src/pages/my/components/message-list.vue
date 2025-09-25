<template>
	<view class="">
		<view class="list" v-for="(item, index) in list" :key="index" @click="details(item)">
			<view class="left">
				<up-avatar :src="uni.getStorageSync('user_info').user_id == item.user_id ? item.other_user_avatar : item.user_avatar" size="40"></up-avatar>
				<view style="margin-left: 20rpx;">
					<view class="">{{ uni.getStorageSync('user_info').user_id == item.user_id ? item.other_user_nickname : item.user_nickname }}</view>
					<view class="">{{ item.last_message.content }}</view>
				</view>
			</view>
			<view class="right">
				<view class="">{{ item.update_time.split(' ')[0] }}</view>
				<view class="">{{ item.update_time.split(' ')[1] }}</view>
			</view>
		</view>
		<up-empty mode="data" v-if="!list.length"></up-empty>
	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getlist } from '@/api/message.js'
import { onReachBottom } from '@dcloudio/uni-app';
import {
	userinfoStore
} from '@/store/userinfos.js'
const store = userinfoStore()
const list = ref([])
const total = ref(0)
const page = ref(1)
const getMessage = () => {
	getlist({
		currentPage: page.value,
		pageSize: 20
	}).then(res => {
		list.value = res.data.results
		total.value = res.data.pagination.total
	})
}
const details = (item) => {
	
	store.getPersonInfo({
		id: uni.getStorageSync('user_info').user_id == item.user_id ? item.other_user_id : item.user_id
	}).then(res => {
      uni.navigateTo({ url: '/pages/my/dialogue'})
	})
	
}
onMounted(() => {
	getMessage()
})
onReachBottom(() => {
	if (total.value > list.value.length) {
		page.value++
		getlist()
	}
})
//暴露
defineExpose({
	getMessage
})

</script>

<style lang="scss" scoped>
.list {
	padding: 20rpx 0;
	margin: 0 30rpx;
	border-bottom: 1rpx solid rgba(255, 255, 255, .1);
	color: rgba(255, 255, 255, .4);
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 24rpx;

	.left {
		display: flex;
		align-items: center;
	}

	.right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}


}
</style>