<template>
	<view class="">
		<view class="list" v-for="(item, index) in list" :key="index" @click="details(item)">
			<view class="left">
				<up-avatar :src="item.receiverAvatar" size="40"></up-avatar>
				<view style="margin-left: 20rpx;">
					<view class="">{{ item.other_user_nickname || '暂无' }}</view>
					<view class="">{{ item.content }}</view>
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
import {
	storeToRefs
} from 'pinia'
import {
	userinfoStore
} from '@/store/userinfos.js'
const store = userinfoStore()
const list = ref([])



const getMessage = () => {
	getlist({
		currentPage: 1,
		pageSize: 20
	}).then(res => {
		list.value = res.data
	})
}
const details = (item) => {
	store.getPersonInfo({
		id: item.other_user_id
	}).then(res => {
      uni.navigateTo({ url: '/pages/my/dialogue'})
	})
	
}
onMounted(() => {
	getMessage()
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