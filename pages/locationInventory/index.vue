<template>
	<view class="container">
		<scroll-view scroll-x="true" scroll="scroll">
			<view class="tabBarWrap">
				<view class="tabBar">
					<text>序号</text>
					<text>物料代码</text>
					<text>物料名称</text>
					<text>规格</text>
					<text>单位</text>
					<text>账目库存</text>
					<text>盘点数量</text>
					<text>备注</text>
				</view>
			</view>
			<view class="orderWrap">
				<view class="orderList">
					<view class="order" v-for="(order, idx) in orderList" :key="idx" @click="toDetail(order)">
						<text>{{ idx + 1 }}</text>
						<text>{{ order.FNumber }}</text>
						<text>{{ order.FName }}</text>
						<text>{{ order.FModel }}</text>
						<text>{{ order.FUnit }}</text>
						<text>{{ order.FQty }}</text>
						<text><input class="uni-input" type="number" v-model="order.FAuxQty" /></text>
						<text><input class="uni-input" type="text" v-model="order.FNote" /></text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="submitBlock">
			<button class="submitBt" :loading="loading" @click="submit">提 交</button>
		</view>
		<movable-area style="width: 100%;height: calc(100vh - 45px);position: absolute;top: 45px;">
			<movable-view :x="x" :y="y" direction="all" @click="scan" @change="onChange" class="dotScan">扫 码</movable-view>
		</movable-area>
	</view>
</template>

<script>
	import { combineRequsetData } from '../../utils/util.js'
	import { mainUrl } from '../../utils/url.js'
	export default {
		data() {
			return {
				loading: false,
				x: 0,
				y: 200,
				orderList: []
			}
		},
		onShow () {
			// this.orderList = []
		},
		methods: {
			scan () {
				// let result = '007[K4-4'
				// let FStock = result.split('[')[0]
				// let FSP = result.split('[')[1]
				// var tmpData = "<FSQL>select FNumber,FName,FModel,FUnit,FQty,FItemID from Z_ICInventory WHERE FStockNumber='" +  FStock + "' and FSP='" + FSP + "'</FSQL>"
				// uni.request({
				// 	url: mainUrl,
				// 	method: 'POST',
				// 	data: combineRequsetData('JA_LIST', tmpData),
				// 	header:{
				// 		'Content-Type':'text/xml'
				// 	},
				// 	success: (res) => {
				// 		if (res.data.length == 0) {
				// 			uni.showModal({
				// 				content: '无该单号信息！',
				// 				showCancel: false
				// 			});
				// 		} else {
				// 			this.orderList = res.data.map(item => {
				// 				item.FAuxQtyMust = item.FQty
				// 				item.FAuxQty = ''
				// 				item.FNote = ''
				// 				item.FStock = FStock
				// 				item.FSP = FSP
				// 				return item
				// 			})
				// 		}
				// 	},
				// 	fail: (err) => {
				// 		console.log('request fail', err)
				// 	}
				// })
				uni.scanCode({
				    onlyFromCamera: false,
				    success: (res) => {
						let FStock = res.result.split('[')[0]
						let FSP = res.result.split('[')[1]
						console.log('res.result', res.result)
						var tmpData = "<FSQL>select FNumber,FName,FModel,FUnit,FQty,FItemID from Z_ICInventory WHERE FStockNumber='" +  FStock + "' and FSP='" + FSP + "'</FSQL>"
						uni.request({
							url: mainUrl,
							method: 'POST',
							data: combineRequsetData('JA_LIST', tmpData),
							header:{
								'Content-Type':'text/xml'
							},
							success: (res) => {
								if (res.data.length == 0) {
									uni.showModal({
										content: '无该单号信息！',
										showCancel: false
									});
								} else {
									this.orderList = res.data.map(item => {
										item.FAuxQtyMust = item.FQty
										item.FAuxQty = ''
										item.FNote = ''
										item.FStock = FStock
										item.FSP = FSP
										return item
									})
								}
							},
							fail: (err) => {
								console.log('request fail', err)
							}
						})
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			toDetail (order) {
				uni.navigateTo({
					url: './order?FBillNo=' + order.FBillNo
				})
			},
			submit () {
				this.loading = true
				var tmpData = '<FJson><![CDATA[' + JSON.stringify({items: this.orderList}) + ']]></FJson>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('check_4043', tmpData),
					header:{
						'Content-Type':'text/xml;charset=utf-8'
					},
					success: (res) => {
						if (res.data[0].code == 1) {
							uni.showToast({
								title: '提交成功!',
								icon: 'success',
								mask: true,
								duration: 1500
							})
							this.orderList = []
						} else {
							uni.showModal({
								content: '提交失败!',
								showCancel: false
							})
						}
					},
					fail: (err) => {
						console.log('request fail', err)
					},
					complete: () => {
						this.loading = false
					}
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
	.tabBarWrap{
		background: #1196DB;
	}
	.tabBar{
		width: 945px;
		height: 45px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #1196DB;
		color: #ffffff;
		/* position: fixed; */
		z-index: 999;
	}
	text{
		padding: 0 5px;
		text-align: center;
	}
	.tabBar text {
		width: 200px;
	}
	.tabBar text:nth-of-type(1) {
		width: 45px;
	}
	.tabBar text:nth-of-type(5) {
		width: 100px;
	}
	.tabBar text:nth-of-type(6) {
		width: 100px;
	}
	.tabBar text:nth-of-type(7) {
		width: 100px;
	}
	.orderWrap{
		width: 945px;
		height: calc(100vh - 45px - 80px);
		overflow: scroll;
	}
	.orderList{
		display: flex;
		overflow: scroll;
		flex-direction: column;
		position: relative;
		z-index: 998;
	}
	.order{
		width: 100%;
		height: 45px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-bottom: 1px solid #eeeeee;
	}
	.order text {
		width: 200px;
	}
	.order text:nth-of-type(1) {
		width: 45px;
	}
	.order text:nth-of-type(5) {
		width: 100px;
	}
	.order text:nth-of-type(6) {
		width: 100px;
	}
	.order text:nth-of-type(7) {
		width: 100px;
	}
	.dotScan {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: #1196DB;
		font-size: 14px;
		color: #ffffff;
		text-align: center;
		line-height: 50px;
		z-index: 999;
	}
	.submitBlock{
		width: 100%;
		height: 50px;
		position: fixed;
		bottom: 0;
		z-index: 9999;
	}
	.submitBt{
		color: #ffffff;
		background: #FF0000;
		border: 0;
		border-radius: 0;
	}
</style>
