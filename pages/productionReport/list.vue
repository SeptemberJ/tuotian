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
				<text>{{ order.FDate }}</text>
				<text>{{ order.FBillNo }}</text>
				<text>{{ order.FName }}</text>
			</view>
		</view>
		<view class="submitBlock">
			<button class="submitBt" @click="submit">提 交</button>
		</view>
		<movable-area style="width: 100%;height: calc(100vh - 45px);position: absolute;top: 45px;">
			<movable-view :x="x" :y="y" direction="all" @click="scan" @change="onChange" class="dotScan">扫 码</movable-view>
		</movable-area>
		<uni-popup ref="popup" type="dialog" message="提示" :maskClick="false" style="z-index:999">
			<view style="width: 300px;height:135px;display:flex;flex-direction: column;background: #fff;position: relative;z-index:9999;border-radius: 15px;overflow: hidden;">
				<text style="width: 90%;height: 30px;margin:10px auto;display: block;line-height: 30px;">提示</text>
				<input class="uni-input" v-model="FPack" focus placeholder="请输入打包号" style="padding: 0 10px;"/>
				<view style="width: 100%;height: 30px;margin-top: 20px;display: block;">
					<button type="default" @click="close" style="width: 50%;float: left;border:0;">取消</button>
					<button type="warn" :loading="loading" @click="confirm" style="width: 50%;border: 0;">提交</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import { combineRequsetData } from '../../utils/util.js'
	import { mainUrl } from '../../utils/url.js'
	export default {
		data() {
			return {
				loading: false,
				x: 0,
				y: 200,
				FPack: '',
				orderList: []
			}
		},
		components: {
			uniPopup,
			uniPopupDialog
		},
		onShow () {
			// this.orderList = []
		},
		methods: {
			close () {
				this.$refs.popup.close()
			},
			scan () {
				// var tmpData = "<FSQL>select * from Z_ICMO where FBillNo='" + 'WORK-212709' + "'</FSQL>"
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
				// 			this.orderList = [...this.orderList, ...res.data]
				// 			// this.orderList = [...res.data, ...res.data, ...res.data, ...res.data, ...res.data, ...res.data, ...res.data, ...res.data, ...res.data, ...res.data, ...res.data, ...res.data, ...res.data,]
				// 		}
				// 	},
				// 	fail: (err) => {
				// 		console.log('request fail', err)
				// 	}
				// })
				uni.scanCode({
				    onlyFromCamera: false,
				    success: (res) => {
						console.log('res.result', res.result)
						var tmpData = "<FSQL>select * from Z_ICMO where FBillNo='" + res.result + "'</FSQL>"
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
									this.orderList = [...this.orderList, ...res.data]
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
				this.$refs.popup.open()
			},
			confirm () {
				if (this.orderList.length == 0) {
					uni.showModal({
						content: '请先扫码录入订单!',
						showCancel: false
					})
					return false
				}
				if (!this.FPack) {
					uni.showModal({
						content: '请输入打包号!',
						showCancel: false
					})
					return false
				}
				let data = this.orderList.map(item => {
					return {
						FBillNO: item.FBillNo,
						FAuxQty: item.FAuxQty,
						FStockID: item.FStockID,
						FPack: this.FPack
					}
				})
				console.log(data)
				this.loading = true
				var tmpData = '<FJSON>' + JSON.stringify({items: data}) + '</FJSON>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('ICMO', tmpData),
					header:{
						'Content-Type':'text/xml'
					},
					success: (res) => {
						if (res.data[0].code == 1) {
							uni.showToast({
								title: '提交成功!',
								icon: 'success',
								mask: true,
								duration: 1500
							})
							this.$refs.popup.close()
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
	.tabBar{
		width: 100%;
		height: 45px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #1196DB;
		color: #ffffff;
		position: fixed;
		z-index: 999;
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
		margin-bottom: 70px;
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
		z-index: 99;
	}
	.submitBt{
		color: #ffffff;
		background: #FF0000;
		border: 0;
		border-radius: 0;
	}
</style>
