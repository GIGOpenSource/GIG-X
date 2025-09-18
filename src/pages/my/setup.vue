<template>
	<view class="">
		<up-navbar bgColor="transparent" placeholder :autoBack="true" :fixed="false">
			<template #left>
				<up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
			</template>
			<template #center>
				设置
			</template>
		</up-navbar>
		<view class="form" v-for="(item,index) in form" :key="index" @click="toPath(item.path)">
			<view class="">{{item.title}}</view>
			<up-icon name="arrow-right" color="#ffffff" size="20"></up-icon>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	const form = reactive([{
		title: '资料编辑',
		path: '/pages/my/data-editing'
	}, {
		title: '任务编辑',
		path: ''
	}, {
		title: '消费与充值',
		path: '/pages/my/recharge'
	}, {
		title: '我的钱包',
		path: ''
	}, {
		title: '在线客服',
		path: ''
	}, {
		title: '邀请码填写',
		path: ''
	}, {
		title: '创作者申请（后期上线）',
		path: ''
	}])
	const show = ref(false)
	const toPath = (url) => {
		if (!url) return uni.showToast({
			title: '暂未开发',
			duration: 2000,
			icon: 'none'
		});
		uni.navigateTo({
			url
		})
	}
	const oparea = () => {
		show.value = true
	}
</script>

<style lang="scss" scoped>
	.form {
		display: flex;
		padding: 30rpx 0;
		justify-content: space-between;
		margin: 0 30rpx;
		border-bottom: 1rpx solid rgba(255, 255, 255, .1);
	}

	.form:nth-of-type(8) {
		border-bottom: none;
	}
</style>