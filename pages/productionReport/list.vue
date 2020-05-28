<template>
	<view class="container">
		<view class="tabBar">
			<text>序号</text>
			<text>工单日期</text>
			<text>工单号</text>
			<text>产品名称</text>
		</view>
		<view class="orderList">
			<view class="order" v-for="(order, idx) in orderList" :key="idx" @click="toDetail(order)">
				<text>{{ idx + 1 }}</text>
				<text>{{ order.date }}</text>
				<text>{{ order.orderNo }}</text>
				<text>{{ order.production }}</text>
			</view>
		</view>
		<movable-area style="width: 100%;height: calc(100vh - 45px);position: absolute;top: 45px;">
			<movable-view :x="x" :y="y" direction="all" @click="scan" @change="onChange" class="dotScan">扫 码</movable-view>
		</movable-area>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				x: 0,
				y: 200,
				orderList: [{date: '2020-06-01', orderNo: 'WORK001', production: '电脑'}, {date: '2020-06-01', orderNo: 'WORK001', production: '鼠标'}]
			}
		},
		methods: {
			scan () {
				uni.scanCode({
				    onlyFromCamera: false,
				    success: (res) => {
						console.log(res.result)
					},
					fail: (err) => {
						console.log(err)
					},
				})
			},
			toDetail (order) {
				uni.navigateTo({
					url: './order?order=' + JSON.stringify(order)
				})
			},
			onChange (e) {
				// this.old.x = e.detail.x
				// this.old.y = e.detail.y
			}
		}
	}
</script>

<style>
	.container {
	}
	.tabBar{
		width: 100%;
		height: 45px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #1196DB;
		color: #ffffff;
		position: fixed;
		z-index: 99;
	}
	text{
		padding: 0 5px;
		text-align: center;
	}
	.tabBar text:nth-of-type(1) {
		width: 40px;
	}
	.tabBar text:nth-of-type(2) {
		width: 85px;
	}
	.tabBar text:nth-of-type(3) {
		width: 85px;
	}
	.tabBar text:nth-of-type(4) {
		width: calc(100% - 210px - 40px);
	}
	.orderList{
		width: 100%;
		position: relative;
		top: 45px;
		z-index: 99;
		display: flex;
		flex-direction: column;
	}
	.order{
		width: 100%;
		height: 45px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-bottom: 1px solid #eeeeee;
	}
	.order text:nth-of-type(1) {
		width: 40px;
	}
	.order text:nth-of-type(2) {
		width: 85px;
	}
	.order text:nth-of-type(3) {
		width: 85px;
	}
	.order text:nth-of-type(4) {
		width: calc(100% - 210px - 40px);
	}
	.dotScan {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: #1196DB;
		color: #ffffff;
		text-align: center;
		line-height: 50px;
		z-index: 999;
	}
</style>
