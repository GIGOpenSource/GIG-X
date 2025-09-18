<template>
	<z-paging ref="paging">
		<up-navbar bgColor="transparent" placeholder :autoBack="true" :fixed="false">
			<template #left>
				<up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
			</template>
			<template #center>
				<up-tabs :list="tabs" @click="click" lineColor="#fff" :activeStyle="{ color: '#ffffff' }"
					:inactiveStyle="{ color: 'rgba(255,255,255,.4 )' }">
				</up-tabs>
			</template>
		
		</up-navbar>

		<view class="content">
			<messageList v-if="current == 0" />
			<interact v-if="current == 1" />
			<noticeList v-if="current == 2" />
		</view>

	</z-paging>
</template>

<script setup>
	import {
		reactive,
		ref
	} from 'vue';
	import noticeList from './components/notice-list.vue'
	import messageList from './components/message-list.vue'
	const tabs = reactive([{
		name: '消息'
	}, {
		name: '互动'
	}, {
		name: '通知'
	}])
	const current = ref(0)
	const click = (item) => {
		current.value = item.index
	}
</script>

<style lang="scss" scoped>
	.content {
		margin: 20rpx;
	}
</style>