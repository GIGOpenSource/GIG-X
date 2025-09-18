<template>
	<view class="">
		<up-navbar bgColor="transparent" placeholder :autoBack="true" :fixed="false">
			<template #left>
				<up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
			</template>
			<template #center>
				资料编辑
			</template>
			<template #right>
				<view @click="pubilsh">发布</view>
			</template>
		</up-navbar>
		<block v-for="(item,index) in form" :key="index">
			<textarea v-if="index == 2" :placeholder="item.name" v-model="params[item.key]"></textarea>
			<view class="images" v-else-if="index == 3">
				<up-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
					:maxCount="10" uploadIcon="plus"></up-upload>
			</view>
			<view v-else class="back">
				<input type="text" :placeholder="item.name" @click="choose(index,item.key)"
					:disabled="index == 0 || index == 4" v-model="params[item.key]" />
				<up-icon v-if="index == 0 || index == 4" name="arrow-right" color="#ffffff" size="20"></up-icon>
			</view>
		</block>
		<up-picker :show="show" :columns="columns" @cancel="show = false" @confirm="confirm"></up-picker>
	</view>
</template>


<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	import {
		createCommunity
	} from '@/api/community.js'
	const form = reactive([{
		name: '选择发布类型',
		key: 'dynamicType'
	}, {
		name: '输入发布标题',
		key: 'title'
	}, {
		name: '输入发布内容',
		key: 'content'
	}, {
		name: '图片',
		key: 'images',
		images: ['https://example.com/image1.jpg', 'https://example.com/image1.jpg']
	}, {
		name: '是否免费',
		key: 'isFree'
	}, {
		name: '设置价格（元）',
		key: 'price'
	}])
	const params = reactive({
		dynamicType: '',
		title: '',
		content: '',
		images: '',
		isFree: '',
		price: ''
	})
	const fileList1 = ref([]);
	const show = ref(false);
	const columns = reactive([
		[]
	]);
	const keyIndex = ref('')
	// 删除图片
	const deletePic = (event) => {
		fileList1.value.splice(event.index, 1);
	};

	// 新增图片
	const afterRead = async (event) => {
		// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
		let lists = [].concat(event.file);
		let fileListLen = fileList1.value.length;
		lists.map((item) => {
			fileList1.value.push({
				...item,
				status: 'uploading',
				message: '上传中',
			});
		});
		for (let i = 0; i < lists.length; i++) {
			const result = await uploadFilePromise(lists[i].url);
			let item = fileList1.value[fileListLen];
			fileList1.value.splice(fileListLen, 1, {
				...item,
				status: 'success',
				message: '',
				url: result,
			});
			fileListLen++;
		}
	};

	const uploadFilePromise = (url) => {
		return new Promise((resolve, reject) => {
			let a = uni.uploadFile({
				url: 'http://192.168.2.21:7001/upload', // 仅为示例，非真实的接口地址
				filePath: url,
				name: 'file',
				formData: {
					user: 'test',
				},
				success: (res) => {
					setTimeout(() => {
						resolve(res.data.data);
					}, 1000);
				},
			});
		});
	};
	const choose = (index, key) => {
		keyIndex.value = key
		if (index == 0) {
			columns[0] = ['视频', '动态']
			show.value = true
		} else if (index == 4) {
			columns[0] = ['是', '否']
			show.value = true
		}
	}
	const confirm = (e) => {
		params[keyIndex.value] = e.value[0]
		show.value = false
	}
	const pubilsh = () => {
		params.userId = uni.getStorageSync('user_info').id
		if (!params.dynamicType) return toast('请选择发布类型')
		if (!params.title) return toast('请输入发布标题')
		if (!params.title) return toast('请输入发布内容')
		if (params.isFree == '') return toast('请选择是否免费')
		params.isFree = params.isFree == '是' ? true : false
		params.dynamicType = params.dynamicType == '视频' ? 'video' : 'text'
		createCommunity(params)
			.then(res => {
				uni.showToast({
					title: "提交成功",
					success: () => {
						uni.navigateBack()
					}
				})
			})
	}
	const toast = (title) => {
		uni.showToast({
			title:  title,
			icon: 'none'
		})
	}
</script>

<style lang="scss" scoped>
	.back,
	textarea {
		background: #212028;
		margin: 20rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		width: 89%;
		display: flex;

		input {
			width: 95%;
		}
	}

	.images {
		margin: 0 20rpx;
	}
</style>
<style>
	/deep/ .u-upload__button {
		background: #212028 !important;
	}
</style>