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
		</uni-grid>
	</view>
</template>

<script>
	import uniGrid from "../..//components/uni-grid/uni-grid.vue"
	import uniGridItem from "../../components/uni-grid-item/uni-grid-item.vue"
	export default {
		data() {
			return {
			}
		},
		components: {
			uniGrid,
			uniGridItem
		},
		methods: {
			toModule(kind) {
				switch (kind) {
					case 'productionReport':
						uni.navigateTo({
							url: '../productionReport/list'
						})
						break
					case 'warehousing':
						uni.navigateTo({
							url: '../warehousing/order'
						})
						break
					case 'inventory':
						uni.navigateTo({
							url: '../locationInventory/index'
						})
						break
					case 'locationAdjustment':
						uni.navigateTo({
							url: '../locationAdjustment/index'
						})
						break
					case 'materiaOrder':
						uni.navigateTo({
							url: '../materiaOrder/order'
						})
						break
				}
			}
		}
	}
</script>

<style>
	.container {
	}
	.moduleItem{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		text-align: center;
	}
	.moduleItem text{
		margin-top: 10px;
		color: #555555;
	}
	image{
		width: 55%;
		height: 55%;
		margin: 10px auto 0 auto;
	}
</style>
