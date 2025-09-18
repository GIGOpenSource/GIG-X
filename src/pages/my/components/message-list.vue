<template>
	<view class="">
		<view class="list" v-for="(item,index) in list" :key="index" @click="uni.navigateTo({url:'/pages/my/dialogue?id='+item.receiverId + '&name='+item.receiverNickname})">
			<view class="left">
				<up-avatar :src="item.receiverAvatar" size="40"></up-avatar>
				 <view style="margin-left: 20rpx;">
					  <view class="">{{item.receiverNickname || '暂无'}}</view>
					  <view class="">{{item.content}}</view>
				 </view>
			</view>
             <view class="right">
				  <view class="">{{item.updateTime.split(' ')[0]}}</view>
				  <view class="">{{item.updateTime.split(' ')[1]}}</view>
			 </view>
		</view>
	</view>
</template>

<script setup>
import { onMounted ,ref} from 'vue';
import { getList } from '@/api/message.js'
const list = ref([])



const getMessage = () => {
	 getList({
		 currentPage:1,
		 pageSize:20
	 }).then(res => {
		 list.value = res.data.records
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
		.left{
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