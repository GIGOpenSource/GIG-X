<template>
	<view class="comment-popup" :style="{ height: screenHeight + 'px', left: modelValue ? 0 : screenWidth + 'px' }">
		<!-- 遮罩层 -->
		<view class="mask" @click="close" :style="{ width: screenWidth + 'px', height: screenHeight + 'px' }"></view>

		<!-- 评论内容区域 -->
		<view
			class="comment-content"
			:style="{ width: screenWidth + 'px', height: commentHeight + 'px', transform: `translateY(${showPopup ? 0 : commentHeight}px)` }"
			@click="clickStop"
		>
			<!-- 标题栏 -->
			<view class="f header boxSizing">
				<view class="f" v-if="searchText">
					<text class="header-title">大家都在搜 :</text>
					<text class="header-text text_one" :style="{ maxWidth: screenWidth / 2.5 + 'px' }">{{ searchText }}</text>
				</view>
				<view v-else class="f f-lv-c" style="flex: 1">
					<text class="header-plNum-text">{{ total }}条评论</text>
				</view>

				<!-- 只存在app、h5 -->
				<!-- #ifdef APP-PLUS || H5 -->
				<view class="f wxClose">
					<view class="f header-btn" @click="openZoom">
						<image class="header-btn-icon" src="/static/tsp-icon/tsp-sx.png" v-if="enlarge"></image>
						<image class="header-btn-icon" src="/static/tsp-icon/tsp-fd.png" v-else></image>
					</view>
					<view class="f header-btn" @click="close">
						<text class="close">×</text>
					</view>
				</view>
				<!-- #endif -->

				<!-- 适配小程序胶囊按钮 -->
				<!-- #ifndef APP-PLUS || H5 -->
				<!-- 没有搜索文本的时候 -->
				<view class="f" :class="[!enlarge ? 'wxClose' : '']" v-if="!searchText">
					<view class="f header-btn" @click="openZoom">
						<image class="header-btn-icon" src="/static/tsp-icon/tsp-sx.png" v-if="enlarge"></image>
						<image class="header-btn-icon" src="/static/tsp-icon/tsp-fd.png" v-else></image>
					</view>
					<view class="f header-btn" @click="close">
						<text class="close">×</text>
					</view>
				</view>
				<view :style="{ width: menuButtonWidth + 'px', height: '1px' }" v-if="enlarge && !searchText"></view>

				<!-- 有搜索文本的时候 -->
				<view class="f" v-if="searchText && !enlarge">
					<view class="f header-btn" @click="openZoom">
						<image class="header-btn-icon" src="/static/tsp-icon/tsp-sx.png" v-if="enlarge"></image>
						<image class="header-btn-icon" src="/static/tsp-icon/tsp-fd.png" v-else></image>
					</view>
					<view class="f header-btn" @click="close">
						<text class="close">×</text>
					</view>
				</view>
				<!-- #endif -->
			</view>
			<!-- 推荐搜索文本评论数量就在下方 -->
			<view class="f header-plNum" v-if="searchText">
				<text class="header-plNum-text">421条评论</text>
				<!-- 适配小程序胶囊按钮 -->
				<!-- #ifndef APP-PLUS || H5 -->
				<view class="f wxClose" v-if="enlarge">
					<view class="f header-btn" @click="openZoom">
						<image class="header-btn-icon" src="/static/tsp-icon/tsp-sx.png" v-if="enlarge"></image>
						<image class="header-btn-icon" src="/static/tsp-icon/tsp-fd.png" v-else></image>
					</view>
					<view class="f header-btn" @click="close">
						<text class="close">×</text>
					</view>
				</view>
				<!-- #endif -->
			</view>

			<!-- 评论列表 -->
			<view class="comment-list boxSizing" :style="{ height: commentHeight - 95 - reviewHeight + 'px' }">
				<!-- #ifdef APP-NVUE -->
				<tsp-list :height="commentHeight - 95 - reviewHeight" @scrolltolower="loadMoreList" ref="listRef">
					<tsp-cell v-for="(item, index) in commentlist" :key="index">
						<!-- 评论内容 -->
						<commentItem
							:ref="'itemRef' + index"
							:item="item"
							:index="index"
							@openPlReply="openPlReply"
							@openHfReply="openHfReply"
							@openUpComment="openUpComment"
							@packUpComment="packUpComment"
							@updataComment="updataComment"
							@updataLike="updataLike"
							@reviewOperation="reviewOperation"
							:screenWidth="screenWidth"
						/>
					</tsp-cell>
					<tsp-cell>
						<tspLoadMore :status="status"></tspLoadMore>
					</tsp-cell>
				</tsp-list>
				<!-- #endif -->

				<!-- scroll-view 封装成组件scroll-into-view 滚动会失效，所以只能单独使用了 -->
				<!-- #ifndef APP-NVUE -->
				<scroll-view
					class="uni-list"
					:scroll-y="true"
					@scrolltolower="loadMoreList"
					:style="{ height: commentHeight - 95 - reviewHeight + 'px' }"
					:scroll-into-view="scrollViewId"
					:scroll-with-animation="scrollAnimation"
				>
					<view v-for="(item, index) in commentlist" :key="index" :id="'commentId' + index">
						<!-- 评论内容 -->
						<commentItem
							:ref="'itemRef' + index"
							:item="item"
							:index="index"
							@openPlReply="openPlReply"
							@openHfReply="openHfReply"
							@openUpComment="openUpComment"
							@packUpComment="packUpComment"
							@updataComment="updataComment"
							@updataLike="updataLike"
							@reviewOperation="reviewOperation"
							:screenWidth="screenWidth"
						/>
					</view>
					<tsp-cell>
						<tspLoadMore :status="status"></tspLoadMore>
					</tsp-cell>
				</scroll-view>
				<!-- #endif -->

				<view class="comment-list-loading f f-lv-c" v-if="loading">
					<!-- #ifndef APP-NVUE -->
					<tspLoading />
					<!-- #endif -->

					<!-- #ifdef APP-NVUE -->
					<tspLoading :loadingType="2" />
					<!-- #endif -->
				</view>
			</view>
			<!-- 输入框 -->
			<view class="f inputBox boxSizing f f-v-c" :style="{ width: screenWidth + 'px' }">
				<view class="inputBox-layer f">
					<view class="f inputBox-input" @click="openInput(null)">
						<text class="inputBox-input-text" style="width: 48px" v-if="phizImg">[表情]</text>
						<text class="inputBox-input-text" style="width: 58px" v-if="plImgList.length > 0">[图片]x{{ plImgList.length }}</text>
						<text class="inputBox-input-text text_one" :style="{ width: screenWidth / 2.2 + 'px', maxWidth: screenWidth / 1.8 - phizWidth - sendWidth + 'px' }">
							{{ remarkInput ? remarkInput : phizImg ? '' : plImgList.length > 0 ? '' : '输入评论内容' }}
						</text>
					</view>
					<image src="/static/tsp-icon/upImg.png" mode="" class="inputBox-layer-img" @touchstart="openInput('img')"></image>
					<text class="inputBox-layer-ej" @touchstart="openInput('zidi')">@</text>
					<image src="/static/tsp-icon/biaoqing.png" mode="" class="inputBox-layer-img" @touchstart="openInput('emoji')"></image>
				</view>
				<view class="inputBox-send f f-lv-c" v-if="phizImg || remarkInput || plImgList.length > 0" @click="sendComment">
					<text class="inputBox-send-text">发送</text>
				</view>
			</view>
		</view>

		<!-- 弹窗输入框 -->
		<commentInput v-model="showInput" @inputText="inputText" :contentInfo="contentInfo" :openType="openType" @closeImg="closeImg" :currReplyInfo="currReplyInfo" />

		<!-- 弹窗评论操作 -->
		<commentOperate v-model="showOperate" :reviewInfo="reviewInfo" @delteComment="delteComment"></commentOperate>
	</view>
</template>

<script>
import tspLoading from '../tsp-load/tsp-loading.vue'
import tspLoadMore from '../tsp-load/tsp-load-more.vue'
import tspList from '../tsp-list/tsp-list.vue'
import tspCell from '../tsp-list/tsp-cell.vue'
import commentItem from './comment-item.vue'
import commentInput from './comment-input.vue'
import commentOperate from './comment-operate.vue'
import { getCommentData, getReplyData } from './commentData.js' //假数据
import { getCommentList } from '@/api/community.js'
export default {
	components: {
		tspLoading,
		tspLoadMore,
		tspList,
		tspCell,
		commentItem,
		commentInput,
		commentOperate
	},
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
			default: 49
			// #endif

			// #ifndef APP-PLUS || H5
			default: 44
			// #endif
		},
		commentInfo: {
			type: Object,
			default: ()=>{ return {} }
		}
	},
	data() {
		return {
			showPopup: false,
			commentlist: [], //评论列表
			screenWidth: 0, //屏幕的宽度
			screenHeight: 0, //屏幕的高度
			statusBarHeight: 0, // 状态栏高度
			menuButtonWidth: 0, //小程序胶囊按钮的宽度
			searchText: '', //推荐搜索文本
			reviewHeight: 0, //有推荐搜索文本，评论数量就在下方的高度
			commentHeight: 0, //评论内容区域的高度
			enlarge: false, //评论去是否全屏放大
			page: 1,
			loading: false,
			status: 'loading',
			showInput: false,
			remarkInput: '', //文本内容
			phizImg: '' ,//表情图片
			plImgList: [],//发送的图片
			phizWidth: 0, //表情文本的宽度
			sendWidth: 0, //发送按钮的宽度
			contentInfo: {},
			openType: null,
			openReq: false,
			replyItemInfo: {}, //点击评价回复的对象
			replyValInfo: {}, //点击回复列表里回复的对象
			currReplyInfo: {},//当前回复的对象
			replyItemIndex: 0, //评论列表的下标
			replyUpIndex: 0, //展开项的下标
			replyValIndex: 0, //回复内容的下标
			scrollViewId: '',
			scrollAnimation: false, //scroll-view 滚动是否有动画效果
			showOperate: false, //是否显示弹出评论操作
			reviewInfo: {}, //选中某行弹出评论操作的对象
			total: -1
		}
	},
	computed: {

	},
	created() {
		if(this.searchText){
			this.reviewHeight = 30
		}
		const deviceInfo = uni.getSystemInfoSync()
		/* if(deviceInfo.windowHeight){ //获取tabBar栏的高度
			this.tabBarHeight = deviceInfo.screenHeight - deviceInfo.windowHeight
		} */
		this.screenWidth = deviceInfo.screenWidth //屏幕的宽度
		this.statusBarHeight = deviceInfo.statusBarHeight
		if (this.tabBarShow == 1) { //减去自定义底部栏的高度
			this.screenHeight = deviceInfo.screenHeight - this.tabBarHeight
		} else {
			this.screenHeight = deviceInfo.windowHeight
		}
		this.commentHeight = this.screenHeight / 1.4 //评论内容区域的高度
		// #ifndef APP-PLUS || H5
		let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
		this.menuButtonWidth = menuButtonInfo.width
		// #endif
	},
	watch: {
		modelValue(val) {
			this.commentHeight = this.screenHeight / 1.4 //评论内容区域的高度
			if (val) {
				this.enlarge = false
				setTimeout(() => {
					this.showPopup = val
				},50)
			} else {
				this.showPopup = false
			}
		}
	},
	methods: {
		/* 模拟请求列表 */
		startData(data){
			let valueIdNum = parseInt(uni.getStorageSync('commentIdsNum') || 1)
			console.log('this.commentInfo',this.commentInfo);
			const params = {
				currentPage:1,
				pageSize:9999,
				targetId: this.commentInfo.id,
				commentType: 'CONTENT'

			}
			return getCommentList(params)


			// new Promise((resolve, reject)=>{
				// setTimeout(()=>{
					// let dataList = []
					// if(this.page <= 5 ){
						// dataList = JSON.parse(JSON.stringify( getCommentData() )) //假数据
						// dataList.filter((item,index)=>{
							// /** 必要参数数据必须拼接  */
							// item.imgList = index % 2 == 0 ? ['/static/image/draft_cover1.jpg','/static/image/draft_cover1.jpg','/static/image/draft_cover1.jpg','/static/image/draft_cover1.jpg'] : ['/static/image/draft_cover16.jpg'] //图片或者图集
							// item.listTotal = index % 2 == 0 ? 15 : 5 //回复评论的总数量 --- 可根据自己的真实数据赋值
							// item.phizImg = '' //表情
							// item.likeShow = false //是否已点赞: true、false --- 默认必须参数，可赋值修改 (如果真实数据是0-1的话，可根据条件判断成true、false)
							// item.foldShow = false //是否已踩踏: true、false --- 默认必须参数，可赋值修改 (如果真实数据是0-1的话，可根据条件判断成true、false)
//
							// item.list = [] //回复列表 --- 默认必须参数，不用修改
							// item.wbId = valueIdNum + index //虚拟id --- 默认必须参数 (主要用于文本展开、收起判断)
							// item.pageNum = 1 //回复列表分页 --- 默认必须参数，不用修改
							// item.expandIndex = 0 //展开评论的层级 --- 默认必须参数，不用修改
							// item.expandNum = 0 //已经展开评论的数量 --- 默认必须参数，不用修改
							// item.loadShow = false //是否显示loading加载动画 --- 默认必须参数，不用修改
							// item.imgStyle = {} //评论图片加载的宽高 --- 默认必须参数，不用修改
							// item.textShow = true //添加插入评论时控制文本显示加载使用的 --- 默认必须参数，不用修改
							// item.isOmit = false //文本内容是否收起  --- 默认必须参数，不用修改
							// item.isShow = false //文本内容是否显示展开、收起  --- 默认必须参数，不用修改
							// item.selectedRow = false //是否选中添加背景样式  --- 默认必须参数，不用修改
						// })
						// this.page++
						// uni.setStorageSync('commentIdsNum', (valueIdNum + dataList.length) )
					// }else{
						// dataList = []
					// }
					// resolve(dataList)
				// },500)
			// })
		},
		/* 模拟请求回复列表 */
		replyReqData(){
			let valueIdNum = parseInt(uni.getStorageSync('commentIdsNum') || 1)
			return new Promise((resolve, reject)=>{
				setTimeout(()=>{
					let dataList = JSON.parse(JSON.stringify( getReplyData() )) //回复列表假数据
					dataList.filter((item,index)=>{
						/** 必要参数数据必须拼接  */
						item.imgList = index % 2 == 0 ? ['/static/image/draft_cover1.jpg','/static/image/draft_cover1.jpg','/static/image/draft_cover1.jpg'] : ['/static/image/draft_cover16.jpg'] ,//图片或者图集
						item.likeShow = false //是否已点赞: true、false --- 默认必须参数，可修改 (如果真实数据是0-1的话，可根据条件判断成true、false)
						item.foldShow = false //是否已踩踏: true、false --- 默认必须参数，可修改 (如果真实数据是0-1的话，可根据条件判断成true、false)

						item.wbId = valueIdNum + index //虚拟id --- 默认必须参数 (主要用于文本展开、收起判断)
						item.show = false //--- 默认必须参数，不用修改
						item.imgStyle = {} //评论图片加载的宽高 --- 默认必须参数，不用修改
						item.textShow = true //添加插入评论时控制文本显示加载使用的 --- 默认必须参数，不用修改
						item.isOmit = false //文本内容是否收起  --- 默认必须参数，不用修改
						item.isShow = false //文本内容是否显示展开、收起  --- 默认必须参数，不用修改
						item.selectedRow = false //是否选中添加背景样式  --- 默认必须参数，不用修改
					})
					uni.setStorageSync('commentIdsNum', (valueIdNum + dataList.length) )
					resolve(dataList)
				},500)
			})
		},
		clickStop(event) {
			event.stopPropagation()
		},
		close() {
			this.showPopup = false
			this.enlarge = false
			this.showInput = false
			setTimeout(() => {
				this.$emit('update:modelValue', false)
			}, 250)
		},
		/* 放大缩小 */
		openZoom() {
			this.enlarge = !this.enlarge
			if (this.enlarge) {
				this.commentHeight = this.screenHeight - this.statusBarHeight
			} else {
				this.commentHeight = this.screenHeight / 1.4
			}
		},
		/* 初始加载 */
		loadData() {
			this.page = 1
			this.loading = true
			this.status = 'loading'
			this.commentlist = []
			uni.removeStorageSync('commentIdsNum')
			this.resetData()
			this.getList()
		},
		/* 到底加载事件 */
		loadMoreList(){
			console.log('到底加载事件')
			if(this.status == 'noMore') return
			this.getList()
		},
		/* 列表请求 */
		getList() {
			if(this.openReq) return
			let valueIdNum = parseInt(uni.getStorageSync('commentIdsNum') || 1)
			this.openReq = true
			this.startData().then((res)=>{
				this.total = res.data.total
				this.openReq = false
				if(res.code == 200){
					let list = res.data.records
					list.forEach((item,index)=>{
						/** 必要参数数据必须拼接  */
						item.imgList = index % 2 == 0 ? []:[] //图片或者图集
						item.listTotal = index % 2 == 0 ? 15 : 5 //回复评论的总数量 --- 可根据自己的真实数据赋值
						item.phizImg = '' //表情
						item.likeShow = false //是否已点赞: true、false --- 默认必须参数，可赋值修改 (如果真实数据是0-1的话，可根据条件判断成true、false)
						item.foldShow = false //是否已踩踏: true、false --- 默认必须参数，可赋值修改 (如果真实数据是0-1的话，可根据条件判断成true、false)

						item.list = [] //回复列表 --- 默认必须参数，不用修改
						item.wbId = valueIdNum + index //虚拟id --- 默认必须参数 (主要用于文本展开、收起判断)
						item.pageNum = 1 //回复列表分页 --- 默认必须参数，不用修改
						item.expandIndex = 0 //展开评论的层级 --- 默认必须参数，不用修改
						item.expandNum = 0 //已经展开评论的数量 --- 默认必须参数，不用修改
						item.loadShow = false //是否显示loading加载动画 --- 默认必须参数，不用修改
						item.imgStyle = {} //评论图片加载的宽高 --- 默认必须参数，不用修改
						item.textShow = true //添加插入评论时控制文本显示加载使用的 --- 默认必须参数，不用修改
						item.isOmit = false //文本内容是否收起  --- 默认必须参数，不用修改
						item.isShow = false //文本内容是否显示展开、收起  --- 默认必须参数，不用修改
						item.selectedRow = false //是否选中添加背景样式  --- 默认必须参数，不用修改
					})
					this.commentlist = this.commentlist.concat(list)
					this.status = 'noMore'
				}else{
					this.status = 'noMore'
				}
				setTimeout(()=>{
					this.loading = false
				},300)
			})
		},
		/* 展开评论 */
		openUpComment(item,index){
			let objData = item.list[this.commentlist[index].expandIndex]
			if(objData){ //此分页展开数据已经加载请求过了
				let idx = this.commentlist[index].expandIndex
				this.commentlist[index].list[idx].expand = true //重新展开
				/* 显示已经渲染完成的数据 */
				this.$nextTick(()=>{
					this.commentlist[index].list[idx].list.filter(item=>{
						item.show = true
					})
				})
				this.commentlist[index].expandIndex += 1 //展开评论的层级
				this.commentlist[index].expandNum += this.commentlist[index].list[idx].list.length  //已经展开评论的数量
			}else{
				//展开分页加载请求
				// console.log('加载请求',item.pageNum)
				this.commentlist[index].loadShow = true //显示loading
				this.replyReqData({page: item.pageNum}).then((res)=>{
					if(res.length > 0){
						let num = 0
						let result = {
							expand: true, //是否展开
							list: res
						}
						/* 判断是否有评论的展开项，并且没有其他的展开项的时候 */
						let curIdex = this.commentlist[index].expandIndex - 1 < 0 ? 0 : this.commentlist[index].expandIndex - 1
						if(this.commentlist[index].list.length > 0 && this.commentlist[index].list[curIdex] &&
						this.commentlist[index].list[curIdex].type){
							/* 拼接在有评论的展开项的后面 */
							this.commentlist[index].list[curIdex].list = this.commentlist[index].list[curIdex].list.concat(res)
							num = 1
						}else{ //没有评论的展开项
							this.commentlist[index].list.push(result)
						}
						this.commentlist[index].list.forEach(item=>{
							if(item.expand){
								num++
							}
						})
						this.commentlist[index].pageNum += 1 //分页加1
						this.commentlist[index].expandNum += res.length //已经展开评论的数量
						this.commentlist[index].expandIndex = num  //展开评论的层级

						/* 显示已经渲染完成的数据 */
						this.$nextTick(()=>{
							this.commentlist[index].list.filter(item=>{
								if(item.expand){
									item.list.filter(v=>{
										v.show = true
									})
								}
							})
						})
					}
					this.commentlist[index].loadShow = false
				})
			}
		},
		/* 收起评论 */
		packUpComment(type,itemData,index,view){

			/* 滚动到当前回复人 */
			// #ifdef APP-NVUE
			this.$refs.listRef.scrollToView(view,type)
			// #endif

			// #ifndef APP-NVUE
			this.scrollViewId = ''
			if(type == 'sqwb'){
				this.scrollAnimation = true
			}
			this.$nextTick(()=>{
				this.scrollViewId = view
				setTimeout(()=>{
					this.scrollAnimation = false
				},50)
			})
			// #endif

			if(type == 'sqpl'){
				this.$nextTick(()=>{
					this.commentlist[index].list.forEach(item=>{
						item.expand = false
						item.list.forEach(v=>{
							v.show = false
						})
					})
					this.commentlist[index].expandNum = 0
					this.commentlist[index].expandIndex = 0
				})
			}

		},
		/* 评论图片加载更新数据 */
		updataComment(type, item, index, i, idx){
			if(type == 'pl'){
				this.commentlist[index].imgWidth = item.imgWidth
				this.commentlist[index].imgHeight = item.imgHeight
				this.commentlist[index].imgStyle = item.imgStyle
			}else if(type == 'hf'){
				/* 回复图片加载更新数据 */
				this.commentlist[index].list[i].list[idx].imgWidth = item.imgWidth
				this.commentlist[index].list[i].list[idx].imgHeight = item.imgHeight
				this.commentlist[index].list[i].list[idx].imgStyle = item.imgStyle
			}
		},
		/* 点赞成功更新数据 */
		updataLike(type, obj, index, i, idx){
			if(type == 'pl'){ //评论点赞更新
				this.commentlist[index].likeShow = obj.likeShow
				this.commentlist[index].likeeffect = obj.likeeffect
				this.commentlist[index].likes = obj.likes
			}else if(type == 'hf'){ //回复点赞更新
				this.commentlist[index].list[i].list[idx].likeShow = obj.likeShow
				this.commentlist[index].list[i].list[idx].likeeffect = obj.likeeffect
				this.commentlist[index].list[i].list[idx].likes = obj.likes
			}else if(type == 'cai'){ //踩踏点赞
				if(i >= 0){
					this.commentlist[index].list[i].list[idx].foldShow = obj.foldShow
				}else{
					this.commentlist[index].foldShow = obj.foldShow
				}
			}else if(type == 'sqwb'){ //展开、收起文本
				if(i >= 0){
					this.commentlist[index].list[i].list[idx].isShow = obj.isShow
					this.commentlist[index].list[i].list[idx].isOmit = obj.isOmit
				}else{
					this.commentlist[index].isShow = obj.isShow
					this.commentlist[index].isOmit = obj.isOmit
				}
			}else if(type == 'xzwb'){ //选中当前行
				if(i >= 0){
					this.commentlist[index].list[i].list[idx].selectedRow = obj.selectedRow
				}else{
					this.commentlist[index].selectedRow = obj.selectedRow
				}
			}
			this.$forceUpdate()
		},
		openInput(val) {
			this.replyItemInfo = {}
			this.replyValInfo = {}
			this.currReplyInfo = {}
			this.openType = val
			this.showInput = true
		},
		closeImg(val){
			this.openType = val
		},
		/* 评论回调 */
		inputText(val){
			this.remarkInput = val.text
			this.phizImg = val.phizImg
			this.plImgList = val.plImgList
			this.contentInfo = val
			if(val.sureSend){ //内部输入框确定点击发送内容
				this.sendComment()
				return false
			}
			if(this.remarkInput || this.phizImg){
				this.sendWidth = 65
			}else{
				this.sendWidth = 0
			}
			this.phizWidth = this.phizImg ? 48 : 0

		},
		/* 重置数据 */
		resetData(){
			this.contentInfo = {}
			this.remarkInput = ''
			this.phizImg = ''
			this.plImgList = []
			this.sendWidth = 0
			this.phizWidth = 0
			this.$forceUpdate()
		},
		/* 点击评论列表中的回复打开输入框 */
		openPlReply(type,item,index){
			this.replyItemIndex = index //评论列表的下标
			this.currReplyInfo = item
			this.openReply(type)
		},
		openHfReply(type,item,val,index,i,idx){
			this.replyItemIndex = index //评论列表的下标
			this.replyUpIndex = i //展开项的下标
			this.replyValIndex = idx //回复内容的下标
			this.currReplyInfo = val
			this.openReply(type)
		},
		/* 打开输入框 */
		openReply(type){
			this.currReplyInfo.replyType = type  // 回复类型
			this.openType = null
			this.showInput = true
		},
		/* 点击发送 */
		sendComment() {
			if(!this.remarkInput.trim() && !this.phizImg && !this.plImgList.length){
				uni.showToast({
					title: '表达你的态度在评论吧',
					icon: 'none'
				})
				return false
			}
			//虚拟文本id
			let valueIdNum = parseInt(uni.getStorageSync('commentIdsNum') || 1)
			let wbId = valueIdNum + 1

			let dataObj = {
				avatar: '/static/tsp-icon/touxiang.jpg',
				username: '卧槽无情',
				content: this.contentInfo.text,
				author: 1, //是否是作者
				time: '3-14',
				likes: 0,
				ipAddres: '福建',
				wbId: wbId, //虚拟id --- 默认必须参数(主要用于文本展开、收起判断)
				likeShow: false, //是否已点赞: true、false --- 默认必须参数，可修改
				foldShow: false ,//是否已踩踏: true、false --- 默认必须参数，可修改
				show: false, //--- 默认必须参数，不用修改
				textShow: false, //控制文本显示加载的 --- 默认必须参数，不用修改
				isOmit: false, //文本内容是否收起  --- 默认必须参数，不用修改
				isShow: false, //文本内容是否显示展开、收起  --- 默认必须参数，不用修改
				selectedRow: false //是否选中添加背景样式  --- 默认必须参数，不用修改
			}
			if(this.phizImg){ //有表情图片
				dataObj.phizImg = this.phizImg
			}
			if(this.plImgList.length > 0){ //有发送图片
				dataObj.imgStyle = {} //评论图片加载的宽高 --- 默认必须参数，不用修改
				dataObj.imgList = this.plImgList
			}
			/* 插入数据 */
			// if(this.currReplyInfo.replyType){ //评论、回复他人
			// 	if(this.currReplyInfo.replyType == 'hf'){ //回复他人
			// 		dataObj.replyUser = this.currReplyInfo.username
			// 	}
			// 	let result = {
			// 		expand: true, //是否展开
			// 		list: [dataObj],
			// 		type: 'py', //此列展开项为自己评论回复的
			// 	}
			// 	if(this.currReplyInfo.replyType == 'hf'){ //回复他人
			// 		if(this.commentlist[this.replyItemIndex].list.length > 0){ //判断是否有展开项评论
			// 			let upIndex = this.commentlist[this.replyItemIndex].list.length - 1
			// 			this.commentlist[this.replyItemIndex].list[upIndex].list.push(dataObj)
			// 		}else{ //没有的话创建新的展开项
			// 			this.commentlist[this.replyItemIndex].list.push(result)
			// 		}

			// 	}else{ //评论他人
			// 		if(this.commentlist[this.replyItemIndex].list.length > 0){ //判断是否有展开项评论
			// 			this.commentlist[this.replyItemIndex].list[0].list.unshift(dataObj)
			// 			this.commentlist[this.replyItemIndex].list[0].expand = true
			// 		}else{ //没有的话创建新的展开项
			// 			this.commentlist[this.replyItemIndex].list.unshift(result)
			// 		}
			// 	}
			// 	let num = 0
			// 	this.commentlist[this.replyItemIndex].list.forEach(item=>{
			// 		if(item.expand){
			// 			num++
			// 		}
			// 	})
			// 	this.commentlist[this.replyItemIndex].expandNum += result.list.length //已经展开评论的数量
			// 	this.commentlist[this.replyItemIndex].expandIndex = num  //展开评论的层级
			// 	this.commentlist[this.replyItemIndex].listTotal += 1  //回复评论的总数量 + 1

			// 	/* 显示已经渲染完成的数据 */
			// 	this.$nextTick(()=>{
			// 		this.commentlist[this.replyItemIndex].list.filter(item=>{
			// 			if(item.expand){
			// 				item.list.filter(v=>{
			// 					v.show = true
			// 					v.textShow = true
			// 				})
			// 			}
			// 		})
			// 	})
			// }else{ //个人评论
			// 	dataObj.list = [] //回复列表
			// 	dataObj.pageNum = 1 //回复列表分页
			// 	dataObj.listTotal = 0 //回复评论的总数量
			// 	dataObj.expandIndex = 0 //展开评论的层级
			// 	dataObj.expandNum = 0 //已经展开评论的数量
			// 	this.commentlist.unshift(dataObj)
			// 	this.$nextTick(()=>{

			// 		this.commentlist[0].textShow = true

			// 		// #ifndef APP-NVUE
			// 		this.scrollViewId = ''
			// 		this.$nextTick(()=>{
			// 			this.scrollViewId = 'commentId0'
			// 		})
			// 		// #endif

			// 		// #ifdef APP-NVUE
			// 		this.$refs['itemRef0'][0].scrollRefToView('commentId0')
			// 		// #endif
			// 	})
			// }
			uni.setStorageSync('commentIdsNum', wbId )
			this.$emit('submitComment', this.contentInfo)
			this.$nextTick(()=>{
				this.resetData()
			})
		},
		/* 弹窗显示评论操作 */
		reviewOperation(item, index, i, idx){
			this.reviewInfo = {item, index, i, idx}
			this.showOperate = true
		},
		/* 删除评论 */
		delteComment(){
			if(this.reviewInfo.idx >= 0){
				this.commentlist[this.reviewInfo.index].list[this.reviewInfo.i].list.splice(this.reviewInfo.idx,1)
			}else{
				this.commentlist.splice(this.reviewInfo.index,1)
			}
			this.showOperate = false
			uni.showToast({title: '删除成功',icon: 'none'})
		}
	}
}
</script>

<style scoped>
.f {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
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

.mgt7 {
	margin-top: 7px;
}

.mgt10 {
	margin-top: 10px;
}

.mgt15 {
	margin-top: 15px;
}

.mgl20 {
	margin-left: 20px;
}

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

/*字体两行省略*/
.text_two {
	/* #ifndef APP-NVUE */
	display: -webkit-box;
	word-break: break-all;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
	/* #endif */

	/* #ifdef APP-NVUE */
	lines: 2;
	/* #endif */
}

/* #ifndef APP-NVUE */
.boxSizing {
	box-sizing: border-box;
}

/* #endif */
.comment-popup {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	/* bottom: 0; */
	z-index: 300;
	overflow: hidden;
}

.mask {
	position: absolute;
	/* width: 100%;
		height: 100%; */
}

.comment-content {
	position: absolute;
	left: 0;
	bottom: 0;
	/* width: 100%;
		height: 70vh; */
	background: #fff;
	border-radius: 20rpx 20rpx 0 0;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
	transition-duration: 0.2s;
	transition-property: transform, opacity, height;
	transition-timing-function: ease;
}

.comment-Show {
	opacity: 1;
}

.comment-Hide {
	opacity: 0;
}

.header {
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	height: 45px;
	padding: 0 15px;
}

.header-title {
	color: #666;
	font-size: 15px;
}

.header-text {
	color: #134781;
	font-size: 15px;
	margin-left: 10px;
	/* max-width: 300rpx; */
}

.header-btn {
	width: 25px;
	height: 25px;
	background-color: #f7f7f7;
	border-radius: 25px;
	align-items: center;
	justify-content: center;
	margin-left: 20px;
}

.header-btn-icon {
	width: 15px;
	height: 15px;
}

.close {
	position: relative;
	top: -1px;
	color: #666;
	font-size: 21px;
}

.header-plNum {
	height: 30px;
	padding: 0 15px;
	align-items: center;
	justify-content: center;
	position: relative;
}

.header-plNum-text {
	font-size: 13px;
	color: #000;
}

.wxClose {
	position: absolute;
	right: 15px;
}

.comment-list {
	position: relative;
}

.uni-list {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex: 1;
	position: relative;
	flex-direction: column;
}

/* #ifndef APP-NVUE */
::v-deep ::-webkit-scrollbar {
	display: none;
}
/* #endif */

.comment-list-loading {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #fff;
}

.inputBox {
	position: absolute;
	bottom: 0;
	height: 50px;
	align-items: center;
	border-top: 1px solid #eee;
	padding: 0 15px;
	background-color: #fff;
}

.inputBox-layer {
	flex: 1;
	background: #f3f3f1;
	height: 35px;
	border-radius: 35px;
	align-items: center;
	padding-right: 15px;
}

.inputBox-input {
	height: 35px;
	font-size: 15px;
	padding: 0 15px;
	flex: 1;
	align-items: center;
}

.inputBox-input-text {
	font-size: 15px;
	color: #888;
}

.inputBox-layer-img {
	width: 20px;
	height: 20px;
	margin-left: 13px;
}

.inputBox-layer-ej {
	font-size: 20px;
	font-weight: bold;
	color: #666666;
	margin-left: 13px;
}

.inputBox-send {
	height: 30px;
	margin-left: 10px;
	width: 55px;
	border-radius: 30px;
	background-color: #fc2451;
}
.inputBox-send-text {
	font-size: 15px;
	color: #fff;
}
</style>
