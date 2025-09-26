<template>
	<view class="">
		<up-navbar bgColor="transparent" placeholder :autoBack="true" :fixed="false">
			<template #left>
				<up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
			</template>
			<template #center>
				发布动态
			</template>
			<template #right>
				<view @click="pubilsh">发布</view>
			</template>
		</up-navbar>
		<block v-for="(item, index) in form" :key="index">
			<textarea v-if="index == 2" :placeholder="item.name" v-model="params[item.key]"></textarea>
			<view class="images" v-else-if="index == 3">
				<up-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
					:maxCount="10" uploadIcon="plus"></up-upload>
			</view>
			<!-- 价格设置字段：只有在非免费时才显示 -->
			<view v-else-if="item.key === 'price' && params.isFree !== '是'" class="back" @click="choose(index, item.key)">
				<input type="text" :placeholder="item.name" :disabled="index == 0 || index == 4 || index == 6"
					v-model="params[item.key]" />
				<up-icon v-if="index == 0 || index == 4 || index == 6" name="arrow-right" color="#ffffff"
					size="20"></up-icon>
			</view>
			<!-- 其他字段正常显示 -->
			<view v-else-if="item.key !== 'price'" class="back" @click="choose(index, item.key)">
				<input type="text" :placeholder="item.name" :disabled="index == 0 || index == 4 || index == 6"
					v-model="params[item.key]" />
				<up-icon v-if="index == 0 || index == 4 || index == 6" name="arrow-right" color="#ffffff"
					size="20"></up-icon>
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
	createCommunity,
	createVideo
} from '@/api/community.js'
const form = ref([{
	name: '选择发布类型',
	key: 'type'
}, {
	name: '输入发布标题',
	key: 'title'
}, {
	name: '输入发布内容',
	key: 'content'
}, {
	name: '图片',
	key: 'images',
	images: ['https://fpoimg.com/375x580', 'https://fpoimg.com/375x580']
}, {
	name: '是否免费',
	key: 'isFree'
}, {
	name: '设置价格（元）',
	key: 'price'
}])
const params = reactive({
	type: '',
	title: '',
	content: '',//描述
	images: ['https://fpoimg.com/375x580', 'https://fpoimg.com/375x580'],
	isFree: '',
	price: '',
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
	} else if (index == 6) {
		columns[0] = ['长视频', '短视频']
		show.value = true
	}
	
}
const confirm = (e) => {
	params[keyIndex.value] = e.value[0]
	show.value = false
	
	// 如果选择免费，将价格设置为0
	if (keyIndex.value === 'isFree' && e.value[0] === '是') {
		params.price = '0'
	}
	
	const arr = [{
		name: '选择发布类型',
		key: 'type'
	}, {
		name: '输入发布标题',
		key: 'title'
	}, {
		name: '输入发布内容',
		key: 'content'
	}, {
		name: '图片',
		key: 'images',
		images: ['https://fpoimg.com/375x580', 'https://fpoimg.com/375x580']
	}, {
		name: '是否免费',
		key: 'isFree'
	}, {
		name: '设置价格（元）',
		key: 'price'
	}]

	form.value = params.type === '视频'
		? [...arr, ...[{ name: '视频类型', key: 'videotype' }]]
		: arr
}
const pubilsh = () => {
	params.user_id = uni.getStorageSync('user_info').user_id
	if (!params.type) return toast('请选择发布类型')
	if (!params.title) return toast('请输入发布标题')
	if (params.title.length > 20) return toast('发布标题不能超过20字')
	if (!params.content) return toast('请输入发布内容')
	if (params.isFree == '') return toast('请选择是否免费')
	if (params.isFree === '否' && (!params.price || params.price.trim() === '' || params.price === '0')) {
		return toast('请设置价格')
	}
	if (params.isFree === '否' && params.price && isNaN(parseFloat(params.price))) {
		return toast('价格必须是数字')
	}
	if (params.type !== '视频') {
		delete params.video_url
	}
	params.isFree = params.isFree == '是' ? true : false
	if (params.type == '视频') {
		params.description = params.content
		params.type = params.videotype == '长视频' ? 'long' : 'short'
		params.data = 'https://partyanimals.cn/media/videos/1.mp4',
		params.cover_url = 'https://fpoimg.com/375x580',
		delete params.content
		delete params.images
		createVideo(params).then(res => {
			uni.showToast({
				title: "提交成功",
				success: () => {
					uni.navigateBack()
				}
			})

		})
	} else {
		params.type = 'dynamic'
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



}
const toast = (title) => {
	uni.showToast({
		title: title,
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
:deep(.u-upload__button) {
	background: #212028 !important;
}
</style>