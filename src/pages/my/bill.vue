<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList">
		<up-navbar bgColor="transparent" placeholder :autoBack="true" :fixed="false">
			<template #left>
				<up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
			</template>
			<template #center>
				账单明细
			</template>
			<template #right>
					<view class=""@click.stop="oparea">
						<up-icon name="more-dot-fill" color="#ffffff" size="28" v-if="more" ></up-icon>
					</view>
			</template>
		</up-navbar>
		<view class="list" v-for="(item,index) in 10" :key="index">
			<view class="">  <text class="name">任务编辑</text> <text>2025-01-10</text> </view>
			<view class="">  <text class="money">-100金额</text> <text>18:00:00</text> </view>
		</view>
	</z-paging>
</template>

<script setup>
	import {
		ref , reactive
	} from 'vue';
	const paging = ref(null)
	const show = ref(false)
	 	const oparea = () => {
		 show.value = true
	}
	
		// v-model绑定的这个变量不要在分页请求结束中自己赋值，直接使用即可
	  const dataList = ref([])
	  
		// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.value.reload()即可
	  const queryList = (pageNo, pageSize) => {
			// 此处请求仅为演示，请替换为自己项目中的请求
	//       request.queryList({ pageNo,pageSize }).then(res => {
			// 	// 将请求结果通过complete传给z-paging处理，同时也代表请求结束，这一行必须调用
	//           paging.value.complete(res.data.list);
	//       }).catch(res => {
			// 	// 如果请求失败写paging.value.complete(false);
			// 	// 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
			// 	// 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
				paging.value.complete([{title:'123'},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"}]);
			// })
	  }
	 
</script>

<style lang="scss" scoped>
	.list{
		padding: 20rpx 0;
		margin: 0 30rpx;
		border-bottom: 1rpx solid rgba(255, 255, 255, .1);
		color: rgba(255, 255, 255, .4);
		.name{
			color: #fff;
		}
		.money{
			font-size: 22rpx;
		}
		view{
			display: flex;
			justify-content: space-between;
			line-height: 50rpx;
		}
	}
</style>