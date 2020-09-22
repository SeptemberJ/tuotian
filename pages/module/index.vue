<template>
	<view class="container">
		<uni-grid :column="3">
			<uni-grid-item>
				<view class="moduleItem" @click="toModule('productionReport')">
					<image src="../../images/pandian.png"></image>
					<text class="text">生产汇报</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="moduleItem" @click="toModule('warehousing')">
					<image src="../../images/ruku.png"></image>
					<text class="text">入库上架</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="moduleItem" @click="toModule('inventory')">
					<image src="../../images/PDA.png"></image>
					<text class="text">货位盘点</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="moduleItem" @click="toModule('locationAdjustment')">
					<image src="../../images/chalvtiaozhengdan.png"></image>
					<text class="text">货位调整</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="moduleItem" @click="toModule('materiaOrder')">
					<image src="../../images/QRscan.png"></image>
					<text class="text">领料扫描核对</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="moduleItem" @click="toModule('deliverGoods')">
					<image src="../../images/fahuo.png"></image>
					<text class="text">发货</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="moduleItem" @click="toModule('stockQuery')">
					<image src="../../images/wuliaochaxun.png"></image>
					<text class="text">库存查询</text>
				</view>
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script>
	import uniGrid from "../..//components/uni-grid/uni-grid.vue"
	import uniGridItem from "../../components/uni-grid-item/uni-grid-item.vue"
	export default {
		data() {
			return {
				F1: 0,
				F2: 0,
				F3: 0,
				F4: 0,
				F5: 0,
				F6: 0,
				F7: 0
			}
		},
		components: {
			uniGrid,
			uniGridItem
		},
		onLoad(options) {
			this.F1 = options.F1 || 0
			this.F2 = options.F2 || 0
			this.F3 = options.F3 || 0
			this.F4 = options.F4 || 0
			this.F5 = options.F5 || 0
			this.F6 = options.F6 || 0
			this.F7 = options.F7 || 0
		},
		methods: {
			toModule(kind) {
				switch (kind) {
					case 'productionReport':
						if (this.F1 == 0) {
							uni.showModal({
								content: '对不起，您没有该模块的操作权限！',
								showCancel: false
							})
							return false
						}
						uni.navigateTo({
							url: '../productionReport/list'
						})
						break
					case 'warehousing':
						if (this.F2 == 0) {
							uni.showModal({
								content: '对不起，您没有该模块的操作权限！',
								showCancel: false
							})
							return false
						}
						uni.navigateTo({
							url: '../warehousing/order'
						})
						break
					case 'inventory':
						if (this.F3 == 0) {
							uni.showModal({
								content: '对不起，您没有该模块的操作权限！',
								showCancel: false
							})
							return false
						}
						uni.navigateTo({
							url: '../locationInventory/index'
						})
						break
					case 'locationAdjustment':
						if (this.F4 == 0) {
							uni.showModal({
								content: '对不起，您没有该模块的操作权限！',
								showCancel: false
							})
							return false
						}
						uni.navigateTo({
							url: '../locationAdjustment/index'
						})
						break
					case 'materiaOrder':
						if (this.F5 == 0) {
							uni.showModal({
								content: '对不起，您没有该模块的操作权限！',
								showCancel: false
							})
							return false
						}
						uni.navigateTo({
							url: '../materiaOrder/order'
						})
						break
					case 'deliverGoods':
						if (this.F6 == 0) {
							uni.showModal({
								content: '对不起，您没有该模块的操作权限！',
								showCancel: false
							})
							return false
						}
						uni.navigateTo({
							url: '../deliverGoods/order'
						})
						break
					case 'stockQuery':
						if (this.F7 == 0) {
							uni.showModal({
								content: '对不起，您没有该模块的操作权限！',
								showCancel: false
							})
							return false
						}
						uni.navigateTo({
							url: '../stockQuery/order'
						})
						break
				}
			}
		}
	}
</script>

<style>
	.container {}

	.moduleItem {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		text-align: center;
	}

	.moduleItem text {
		margin-top: 10px;
		color: #555555;
	}

	image {
		width: 55%;
		height: 55%;
		margin: 10px auto 0 auto;
	}
</style>
