<template>
	 <view class="">会员权益</view>
	 <view class="con">
		 <view class="list" v-for="(item,index) in 10" :key="index">
			 <up-image src="https://cdn.uviewui.com/uview/album/1.jpg" shape="circle" width="42" height="42"></up-image>
			 <text>特权名称</text>
		 </view>
	 </view>
</template>

<script>
	
	
</script>

<style lang="scss" scoped> 
.con{
	display: flex;
	flex-wrap: wrap;
	max-height: 500rpx;
	overflow-y: scroll;
}
.list{
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 20rpx;
	width: 25%;
	text{
		margin-top: 20rpx;
		font-size: 20rpx;
	}
}
</style>