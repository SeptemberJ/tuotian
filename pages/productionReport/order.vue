<template>
	<view class="container">
		<view class="columnItem">
			<text>工单日期</text>
			<text>{{ date }}</text>
		</view>
		<view class="columnItem">
			<text>工单号</text>
			<text>{{ FBillNo }}</text>
		</view>
		<view class="columnItem">
			<text>产品名称</text>
			<text>{{ production }}</text>
		</view>
		<view class="columnItem">
			<text>规格型号</text>
			<text>{{ model }}</text>
		</view>
		<view class="columnItem">
			<text>单位</text>
			<text>{{ unit }}</text>
		</view>
		<view class="columnItem">
			<text>计划生产数量</text>
			<text>{{ plantNumber }}</text>
		</view>
		<view class="columnItem">
			<text>实作数量</text>
			<text><input class="uni-input" type="number" v-model="number" placeholder="请输入数量"/></text>
		</view>
		<view class="columnItem">
			<text>仓库名称</text>
			<text>{{ wareName }}</text>
		</view>
		<view class="columnItem">
			<text>仓库内码</text>
			<text><input class="uni-input" v-model="wareId" placeholder="请输入仓库内码"/></text>
		</view>
		<button class="loginBt" :loading="loading" @click="submit">提 交</button>
	</view>
</template>

<script>
	import { combineRequsetData } from '../../utils/util.js'
	import { mainUrl } from '../../utils/url.js'
	export default {
		data() {
			return {
				loading: false,
				FStockID: '',
				date: '',
				FBillNo: '',
				production: '',
				model: '',
				unit: '',
				plantNumber: '',
				number: '',
				wareName: '',
				wareId: ''
			}
		},
		onLoad(options) {
			let order = JSON.parse(options.order)
			this.date = order.FDate
			this.FBillNo = order.FBillNo
			this.production = order.FName
			this.model = order.FModel
			this.unit = order.FUnit
			this.plantNumber = order.FAuxQty
			this.number = order.FAuxQty
			this.getWare(order.FStockID)
		},
		methods: {
			submit () {
				if (this.number == '') {
					uni.showModal({
						content: '请输入实作数量！',
						showCancel: false
					})
					return false
				}
				if (this.number == 0 || this.number > this.plantNumber) {
					uni.showModal({
						content: '实作数量应大于0小于计划生产数量！',
						showCancel: false
					})
					return false
				}
				if (this.wareId == '') {
					uni.showModal({
						content: '请输入仓库内码！',
						showCancel: false
					})
					return false
				}
				this.loading = true
				var tmpData = "<FSQL>exec Z_ICStockBill_2 '" + this.FBillNo + "'," + this.number + ',' + this.wareId + '</FSQL>'
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
			getWare (FStockID) {
				var tmpData = '<FSQL>select FItemID,FName from t_stock where FDeleted=0 and fitemid=' + FStockID + '</FSQL>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('JA_LIST', tmpData),
					header:{
						'Content-Type':'text/xml'
					},
					success: (res) => {
						this.wareName = res.data[0].FName
						this.wareId = res.data[0].FItemID
					},
					fail: (err) => {
						console.log('request fail', err);
						// uni.showModal({
						// 	content: err.errMsg,
						// 	showCancel: false
						// });
					}
				})
			}
		}
	}
</script>

<style>
	.container {
		padding:0 10px;
	}
	.columnItem{
		width: 100%;
		height: 35px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.columnItem text:first-of-type{
		width: 100px;
	}
	.columnItem text:last-of-type{
		color: #999999;
		text-align: right;
	}
	.columnItem input{
		text-align: right;
		border-bottom: 1px solid red;
		color: red;
		font-weight: bold;
	}
	.uni-input-placeholder{
		font-weight: normal;
		color: red;
	}
	.loginBt{
		width: 80%;
		text-align: center;
		border: 1px solid #ffffff;
		border-radius: 25px;
		background: #1196DB;
		color: #ffffff;
		margin: 40px auto 10px auto;
	}
</style>
