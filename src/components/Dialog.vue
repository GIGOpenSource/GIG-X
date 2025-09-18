<template>
	<view class="dialog-modal" v-if="modelValue">
		<view class="mask" @click="onClickMak"></view>

		<view class="content">
			<view class="dialog-header">
				<view class="dialog-header-title">
					<slot name="title">温馨提示</slot>
				</view>

				<view class="dialog-header-tip">
					<slot name="tip">该内容需要VIP解锁</slot>
				</view>

				<up-icon name="close" size="28" color="#000" class="right-icon" @click="handleClickClose"></up-icon>
				
			</view>
			<view class="dialog-content">
				<slot>4363474574568659</slot>
			</view>
			
			<view class="dialog-footer">
				<view class="cancel-btn">
					<slot name="cancel">
						<up-button :text="cancelText"  shape="circle" class="btn" @click="onCancel"></up-button>
					</slot>
				</view>
				<view class="confirm-btn">
					<slot name="confirm">
						<up-button :text="confirmText"  shape="circle" class="btn" @click="onConfirm"></up-button>
					</slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';

	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: true,
			required: true
		},
		/* 是否可以点击蒙版关闭 **/
		closeOnClickMask:{
			type: Boolean,
			default: true
		},
		cancelText:{
			type: String,
			 default: '查看更多'
		},
		confirmText:{
			type: String,
			 default: '立即体验'
		}
	})

	const emits = defineEmits(['update:modelValue','cancel','confirm','close'])
    console.log(props.modelValue,'modelValuemodelValue11111')
	const onCancel = ()=> {
		console.log('cancel');
		emits('cancel')
		emits('update:modelValue', false)
	}
	const onConfirm = ()=> {
		console.log('confirm');
		emits('confirm')
		emits('update:modelValue', false)
	}
	const onClose = ()=>{
		console.log('close');
		emits('close')
		emits('update:modelValue', false)
	}
	const onClickMak = ()=>{
		console.log('onClickMak');
		if(!props.closeOnClickMask) return
		emits('update:modelValue', false)
	}
	const handleClickClose = ()=>{
		console.log('handleClickClose');
		emits('update:modelValue', false)
	}
</script>

<style lang="scss" scoped>
	.dialog-modal {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 99;

		.mask {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, 0.5);
		}

		.content {
			position: absolute;
			z-index: 9;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);

			background-color: #fff;
			border-radius: 48rpx;
			// padding: 40rpx 50rpx;
			color: #3b362e;
			min-width: 534rpx;
			min-height: 215rpx;

			.dialog-header {
				position: relative;
				background: url('/static/images/dialog-bg.png') 0 0 no-repeat;
				background-size: 100% 100%;
				border-radius: 48rpx 48rpx 0 0;
				padding: 40rpx 50rpx 50rpx;
				text-align: center;
				
				.right-icon {
					position: absolute;
					right: 36rpx;
					top: 40rpx;
				}
				
				.dalog-header-title{
					font-size: 15px;
				}
				.dialog-header-tip{
					margin-top: 26rpx;
					
					font-size: 21px;
					font-weight: bold;
				}
			}
			
			.dialog-content{
				padding: 25rpx 45rpx;
			}
			
			.dialog-footer{
				display: flex;
				justify-content: center;
				margin-bottom: 40rpx;
				
				.btn{
					background: linear-gradient(180deg, #5662E1 0%, #614793 100%);
					font-size: 15px;
					color: #fff;
					height: 80rpx;
					width: 208rpx;
					&:first-child{
						margin-right: 10rpx;
					}
					&:last-child{
						margin-left: 10rpx;
					}
				}
			}
		}
	}
</style>