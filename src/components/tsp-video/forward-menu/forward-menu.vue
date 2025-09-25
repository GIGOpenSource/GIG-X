<template>
	<view class="operate-popup" :style="{ height: screenHeight + 'px' }" v-if="modelValue">
		<!-- 遮罩层 -->
		<view class="operate-mask" @click="close" :style="{ width: screenWidth + 'px', height: screenHeight + 'px' }">
		</view>
		<!-- 二维码 -->
		<up-popup :show="flag" @close="close"  mode="center" round="10">
			<view class="pruop">
				<image :src="imageUrl" style="width: 200rpx; height: 200rpx;" @longpress="saveimage" />
				<view class="text">长按保存图片</view>
			</view>
		</up-popup>
		<!-- 内容区域 -->
		<view class="operate-content"
			:style="{ width: screenWidth + 'px', height: commentHeight + 'px', transform: `translateY(${showPopup ? 0 : commentHeight}px)` }"
			@click="clickStop">
			<scroll-view class="operate-content-box" scroll-y :show-scrollbar="false"
				:style="{ width: screenWidth + 'px', height: commentHeight - 15 + 'px' }">
				<view class="content-top f f-lv-s">
					<text class="content-top-title">分享给</text>
					<view class="f f-v-c">
						<!-- 	<view class="content-top-search">
							<text class="content-top-search-text">搜索</text>
						</view> -->
						<view class="f header-btn" @click="close">
							<text class="close">×</text>
						</view>
					</view>
				</view>

				<!-- <scroll-view class="user-tool f" scroll-x :style="{ width: screenWidth + 'px' }" :show-scrollbar="false">
					<view class="f">
						<view>
							<view class="user-tool-jq">
								<view class="user-tool-jq-top">
									<image class="user-tool-jq-img" src="/static/tsp-icon/touxiang.jpg"></image>
									<view class="user-tool-jq-imgTwo f f-lv-c">
										<image class="user-tool-jq-imgTwo-img" src="/static/logo.png"></image>
									</view>
								</view>
								<view class="f fw-c">
									<text class="user-tool-jq-zjfx-text">最近分享</text>
									<text class="user-tool-jq-hf">2个会话</text>
								</view>
							</view>
						</view>
						<view class="user-tool-item f fw-c" v-for="(item, index) in 10" :key="index">
							<image class="user-tool-item-avatar" src="/static/tsp-icon/touxiang.jpg"></image>
							<view>
								<text class="user-tool-item-text text_one">卧槽无情</text>
							</view>
						</view>
						<view>
							<view style="width: 10px; height: 15px"></view>
						</view>
					</view>
				</scroll-view> -->

				<scroll-view class="user-tool f" scroll-x :style="{ width: screenWidth + 'px' }"
					:show-scrollbar="false">
					<view class="f">
						<!-- <view class="user-tool-item f fw-c" v-for="(item, index) in 10" :key="index"> -->
						<view class="user-tool-item f fw-c">
							<up-copy content="i copy one video url! " @success="onCopySuccess">
								<view class="user-tool-item-avatar f f-lv-c">
									<!-- <image class="user-tool-item-avatar-icon" src="/static/tsp-icon/tsp-dztx.png"></image> -->
									<up-icon name="attach" size="30 "></up-icon>
								</view>
							</up-copy>
							<view>
								<text class="user-tool-item-text text_one">链接</text>
							</view>
						</view>
						<view class="user-tool-item f fw-c" @click="shareQe">
							<view class="user-tool-item-avatar f f-lv-c">
								<up-icon name="grid" size="30 " />
							</view>
							<view>

								<text class="user-tool-item-text text_one">分享二维码</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</scroll-view>

		</view>
	</view>
</template>

<script>
import * as QRCode from 'qrcode';
export default {
	props: {
		modelValue: {
			type: Boolean,
			default: false
		},
		/* tabBar栏 0系统tabBar栏 1自定义tabBar栏 */
		tabBarShow: {
			type: Number,
			default: 0
		},
		/* 底部栏的高度 */
		tabBarHeight: {
			type: Number,
		// #ifdef APP-PLUS || H5
		default: 60,
		// #endif

			// #ifndef APP-PLUS || H5
			default: 60,
			// #endif
		},
		forwardInfo: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data() {
		return {
			showPopup: false,
			screenWidth: 0, //屏幕的宽度
			screenHeight: 0, //屏幕的高度
			commentHeight: 155,//内容区域的高度
			// commentHeight: 275 //内容区域的高度
			qrcodeData: "https://baidu.com", // 二维码数据
			imageUrl: '',
			flag: false

		}
	},
	watch: {
		modelValue(val) {
			if (val) {
				setTimeout(() => {
					this.showPopup = val
				}, 50)
			} else {
				this.showPopup = false
			}
		}
	},
	created() {
		const deviceInfo = uni.getSystemInfoSync()
		this.screenWidth = deviceInfo.screenWidth //屏幕的宽度
		if (this.tabBarShow == 1) { //减去自定义底部栏的高度
			this.screenHeight = deviceInfo.screenHeight - this.tabBarHeight
		} else {
			this.screenHeight = deviceInfo.windowHeight
		}
		this.getQrcode()
		// this.commentHeight = this.screenHeight / 1.68 //评论内容区域的高度
	},
	methods: {
		shareQe() {
			this.flag = true
		},
		saveimage() {
				uni.showLoading({ title: '保存中...' });
				const link = document.createElement('a');
				link.download = `qrcode_${Date.now()}.png`;
				link.href = this.imageUrl;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				uni.hideLoading();
		},
	clickStop(event) {
		event.stopPropagation()
	},
	close() {
		this.showPopup = false
		setTimeout(() => {
			this.$emit('update:modelValue', false)
		}, 250)
	},
	onCopySuccess() {
		this.close()
	},
	async getQrcode() {
		const qrDataURL = await QRCode.toDataURL(this.qrcodeData, {
			width: 300,
			height: 300,
			color: {
				dark: "#000000",
				light: "#ffffff"
			}
		});
		this.imageUrl = qrDataURL

	}
}
}
</script>

<style scoped lang="scss">
.pruop {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	width: 250rpx;
	height: 250rpx;
	color: #000;
	font-size: 24rpx;

	.text {
		margin-bottom: 10rpx;
	}
}

.f {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
}

.fx1 {
	flex: 1;
}

.f-v-c {
	align-items: center;
}

.f-lv-s {
	align-items: center;
	justify-content: space-between;
}

.f-lv-c {
	align-items: center;
	justify-content: center;
}

.fw {
	flex-direction: column;
}

.fw-c {
	flex-direction: column;
	align-items: center;
}

/* #ifndef APP-NVUE */
page,
view,
scroll-view {
	box-sizing: border-box;
}

::v-deep ::-webkit-scrollbar {
	display: none;
}

/* #endif */

/*字体单行省略*/
.text_one {
	/* #ifndef APP-NVUE */
	display: block;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	/* #endif */

	/* #ifdef APP-NVUE */
	lines: 1;
	/* #endif */
}

.operate-popup {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	z-index: 301;
	overflow: hidden;
}

.operate-mask {
	position: absolute;
	/* background-color: rgba(0, 0, 0, 0.2); */
}

.operate-content {
	position: absolute;
	left: 0;
	bottom: 0;
	background: #f5f5f5;
	border-radius: 20rpx 20rpx 0 0;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
	transition-duration: 0.2s;
	transition-property: transform, opacity, height;
	transition-timing-function: ease;
}

.operate-content-box {
	position: absolute;
	bottom: 0;
	left: 0;
}

.content-top {
	padding: 0 15px;
}

.content-top-title {
	font-size: 15px;
	color: #000;
}

.content-top-search {
	padding: 5px 13px;
	border-radius: 18px;
	background-color: #eee;
}

.header-btn {
	width: 28px;
	height: 28px;
	background-color: #eee;
	border-radius: 25px;
	align-items: center;
	justify-content: center;
	margin-left: 20px;
}

.close {
	position: relative;
	top: -1px;
	color: #666;
	font-size: 21px;
}

.content-top-search-text {
	color: #333;
	font-size: 13px;
}

.user-tool {
	margin-top: 15px;
	height: 100px;
}

.user-tool-jq {
	width: 60px;
	margin-left: 15px;
	height: 100px;
}

.user-tool-jq-top {
	position: relative;
	height: 60px;
}

.user-tool-jq-img {
	width: 38px;
	height: 38px;
	border-radius: 50%;
}

.user-tool-jq-imgTwo {
	position: absolute;
	top: 15px;
	left: 10px;
	width: 46px;
	height: 46px;
	border-radius: 50%;
	background-color: #f5f5f5;
}

.user-tool-jq-imgTwo-img {
	width: 38px;
	height: 38px;
	border-radius: 50%;
}

.user-tool-jq-zjfx {
	margin-top: 5px;
	margin-bottom: 3px;
}

.user-tool-jq-zjfx-text {
	margin-top: 5px;
	margin-bottom: 3px;
	font-size: 12px;
	color: #333;
}

.user-tool-jq-hf {
	font-size: 11px;
	color: #666;
}

.user-tool-item {
	width: 60px;
	margin-left: 15px;
}

.user-tool-item-avatar {
	width: 55px;
	height: 55px;
	border-radius: 50%;
	background-color: #fff;
}

.user-tool-item-avatar-icon {
	width: 30px;
	height: 30px;
}

.user-tool-item-text {
	color: #333;
	font-size: 12px;
	width: 60px;
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
	text-align: center;
	margin-top: 10px;
}
</style>
