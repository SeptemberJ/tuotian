<template>
	<view class="container">
		<view class="dbitem">
			<view class="itemBar">
				<view>工单号：</view>
				<view>{{ order.FICMOBillNo }}</view>
			</view>
			<view class="itemBar">
				<view>发料日期：</view>
				<view>{{ order.FDate }}</view>
			</view>
			<view class="itemBar">
				<view>领料单号：</view>
				<view>{{ order.FBillNo }}</view>
			</view>
		</view>
		<view class="lineData">
			<scroll-view scroll-x="true" scroll="scroll">
				<view class="columnTitWrap">
					<view class="columnTit">
						<text>序号</text>
						<text>物料代码</text>
						<text>名称</text>
						<text>规格</text>
						<text>实发数量</text>
						<text>校对标记</text>
					</view>
				</view>
				<view class="lineItem" v-for="(item, idx) in lineData" :key="idx">
					<text>{{ idx + 1 }}</text>
					<text>{{ item.FNumber }}</text>
					<text>{{ item.FName}}</text>
					<text>{{ item.FModel}}</text>
					<text>{{ item.FAuxQty}}</text>
					<text v-if="item.FSign == 'Y'">{{ item.FSign}}</text>
					<button v-if="item.FSign != 'Y'" type="primary" @click="scan(idx)" style="width:80px;margin:5px 0;line-height: 30px;">扫码</button>
				</view>
			</scroll-view>
		</view>
		<view style="clear: both;"></view>
		<button class="submitBt" :loading="loading" @click="submit">提 交</button>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import { combineRequsetData } from '../../utils/util.js'
	import { mainUrl } from '../../utils/url.js'
	export default {
		data() {
			return {
				order: {},
				lineData: [],
				loading: false,
			}
		},
		components: {
			uniPopup
		},
		onLoad(options) {
			let order = JSON.parse(options.orderInfo)
			this.order = order
			this.getLineData(order.FICMOBillNo, order.FBillNo)
		},
		methods: {
			scan (idx) {
				// let FNumber = '1.02.1.26795-08-08LTZ'
				// var tmpData = '<FICMOBillNo>' + this.order.FICMOBillNo + '</FICMOBillNo>'
				// 	tmpData += '<FBillNo>' + this.order.FBillNo + '</FBillNo>'
				// 	tmpData += '<FNumber>' + FNumber + '</FNumber>'
				// uni.request({
				// 	url: mainUrl,
				// 	method: 'POST',
				// 	data: combineRequsetData('sign', tmpData),
				// 	header:{
				// 		'Content-Type':'text/xml'
				// 	},
				// 	success: (res) => {
				// 		if (res.data[0].code == '1') {
				// 			this.lineData[idx].FSign = 'Y'
				// 		} else {
				// 			uni.showModal({
				// 				content: '不存在此物料',
				// 				showCancel: false
				// 			});
				// 		}
				// 	},
				// 	fail: (err) => {
				// 		console.log('request fail', err);
				// 		uni.showModal({
				// 			content: err.errMsg,
				// 			showCancel: false
				// 		});
				// 	}
				// })
				uni.scanCode({
				    onlyFromCamera: false,
				    success: (res) => {
						console.log(res.result)
						var tmpData = '<FICMOBillNo>' + this.order.FICMOBillNo + '</FICMOBillNo>'
							tmpData += '<FBillNo>' + this.order.FBillNo + '</FBillNo>'
							tmpData += '<FNumber>' + res.result + '</FNumber>'
						uni.request({
							url: mainUrl,
							method: 'POST',
							data: combineRequsetData('sign', tmpData),
							header:{
								'Content-Type':'text/xml'
							},
							success: (res) => {
								if (res.data[0].code == '1') {
									this.lineData[idx].FSign = 'Y'
								} else {
									uni.showModal({
										content: '不存在此物料',
										showCancel: false
									});
								}
							},
							fail: (err) => {
								console.log('request fail', err);
								uni.showModal({
									content: err.errMsg,
									showCancel: false
								});
							}
						})
				    },
					fail: (err) => {
						console.log(err)
					}
				})
			},
			checkSign (item) {
				return item.FSign != 'Y'
			},
			submit () {
				let filterArr = this.lineData.filter(this.checkSign)
				if (filterArr.length > 0) {
					uni.showModal({
						content: '当前还存在未校验的单子!',
						showCancel: false
					})
					return false
				}
				this.loading = true
				var tmpData = '<FBillNo>' + this.order.FBillNo + '</FBillNo>'
					tmpData += '<FICMOBillNo>' + this.order.FICMOBillNo + '</FICMOBillNo>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('check_24', tmpData),
					header:{
						'Content-Type':'text/xml'
					},
					success: (res) => {
						switch (res.data[0].code) {
							case '1':
								uni.showToast({
									title: '提交成功!',
									icon: 'success',
									mask: true,
									duration: 1500
								})
								setTimeout(() => {uni.navigateBack()}, 1500)
							break
							default:
								uni.showModal({
									content: '提交失败!',
									showCancel: false
								});
							break
						}
						
					},
					fail: (err) => {
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
					},
					complete: () => {
						this.loading = false
					}
				})
			},
			getLineData (FICMOBillNo, FBillNo) {
				var tmpData = "<FSQL>select * from Z_ICStockBill_24Detail where FICMOBillNo='" + FICMOBillNo +"' and FBillNo='"+ FBillNo + "'</FSQL>"
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('JA_LIST', tmpData),
					header:{
						'Content-Type':'text/xml'
					},
					success: (res) => {
						if (res.data.length > 0) {
							this.lineData = res.data
						}
					},
					fail: (err) => {
						console.log('request fail', err);
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
					}
				});
			}
		}
	}
</script>

<style>
	.container {
		padding: 20 0 20px 0;
		font-size: 14px;
		line-height: 24px;
	}
	.dbitem{
		width: 100%;
		padding: 10px 0;
		background-color: #ffffff;
		float: left;
	}
	.itemBar{
		width: calc(100% - 20px);
		height: 30px;
		line-height: 30px;
		padding: 0 10px;
		float: left;
	}
	.itemBar view:nth-of-type(1){
		float: left;
		width: 32%;
		color: #333333;
		font-weight: 500;
	}
	.itemBar view:nth-of-type(2){
		float: left;
		width: 68%;
		color: #999999;
		text-align: right;
	}
	.lineData{
	}
	.columnTitWrap{
		background: #C0C0C0;
	}
	.columnTit{
		width: 855px;
		height: 30px;
		background: #C0C0C0;
	}
	.columnTit text{
		width: 200px;
		height: 30px;
		/* padding: 0 10px; */
		line-height: 30px;
		display: inline-block;
		font-weight: 400;
	}
	.columnTit text:nth-of-type(1){
		width: 45px;
		padding-left: 5px;
	}
	.columnTit text:nth-of-type(5){
		width: 100px;
	}
	.columnTit text:nth-of-type(6){
		width: 100px;
	}
	.lineItem{
		min-width: 855px;
		margin-bottom: 10px;
		display: flex;
		align-items: center;
		border-bottom: 1px dashed #555555;
	}
	.lineItem text{
		width: 200px;
		/* padding: 0 10px; */
		display: inline-block;
		font-weight: 400;
	}
	.lineItem text:nth-of-type(1){
		width: 45px;
		padding-left: 5px;
	}
	.lineItem text:nth-of-type(5){
		width: 100px;
	}
	.lineItem text:nth-of-type(6){
		width: 100px;
	}
	.submitBt{
		width: 100%;
		height: 50px;
		position: fixed;
		bottom: 0;
		z-index: 99;
		color: #ffffff;
		background: #FF0000;
		border: 0;
		border-radius: 0;
	}
</style>
