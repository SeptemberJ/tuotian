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
			<text>
			<picker @change="bindPickerChange" :value="indexW" :range="wareList" range-key="FName">
				<view class="uni-input" style="color: #FF0000;">{{wareList[indexW].FName}}</view>
			</picker>
			</text>
		</view>
		<!-- <view class="columnItem">
			<text>仓库内码</text>
			<text>{{ wareId }}</text>
		</view> -->
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
				wareList: [],
				indexW: 0,
				wareName: '',
				wareId: ''
			}
		},
		onLoad(options) {
			this.getDetail(options.FBillNo)
			// let order = JSON.parse(options.order)
			// this.date = order.FDate
			// this.FBillNo = order.FBillNo
			// this.production = order.FName
			// this.model = order.FModel
			// this.unit = order.FUnit
			// this.plantNumber = order.FAuxQty
			// this.number = order.FAuxQty
			// this.wareId = order.FStockID
			// let curWare = await this.getWare(order.FStockID)
			// console.log('curWare---', curWare)
			// this.wareName = curWare[0].FName
			// this.indexW = curWare[0].idx
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
				let data = {
					items: [{
						FBillNO: this.FBillNo,
						FAuxQty: this.number,
						FStockID: this.wareId
					}]
				}
				this.loading = true
				var tmpData = '<FJSON>' + JSON.stringify(data) + '</FJSON>'
				// var tmpData = '<FBillNO>' + this.FBillNo + '</FBillNO>'
				// 	tmpData += '<FAuxQty>' + this.number + '</FAuxQty>'
				// 	tmpData += '<FStockID>' + this.wareId + '</FStockID>'
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
							setTimeout(() => {
								uni.navigateBack()
							}, 1500)
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
			bindPickerChange (e) {
				this.indexW = e.target.value
				this.wareId = this.wareList[e.target.value].FItemID
			},
			filterWare (ware) {
				return ware.FItemID == this.wareId
			},
			getDetail (FBillNo) {
				var tmpData = "<FSQL>select * from Z_ICMO where FBillNo='" + FBillNo + "'</FSQL>"
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
							console.log(res.data)
							let order = res.data[0]
							this.date = order.FDate
							this.FBillNo = order.FBillNo
							this.production = order.FName
							this.model = order.FModel
							this.unit = order.FUnit
							this.plantNumber = order.FAuxQty
							this.number = order.FAuxQty
							this.wareId = order.FStockID
							this.getWare(order.FStockID)
						}
					},
					fail: (err) => {
						console.log('request fail', err)
					}
				})
			},
			getWare (FStockID) {
				return new Promise((resolve, reject) => {
					var tmpData = '<FSQL>select FItemID,FName from t_stock where FDeleted=0</FSQL>'
					uni.request({
						url: mainUrl,
						method: 'POST',
						data: combineRequsetData('JA_LIST', tmpData),
						header:{
							'Content-Type':'text/xml'
						},
						success: (res) => {
							console.log('wareList', res.data)
							this.wareList = res.data.map((item, idx) => {
								item.idx = idx
								return item
							})
							let curWare = res.data.filter(this.filterWare)
							this.wareName = curWare[0].FName
							this.indexW = curWare[0].idx
							resolve(curWare)
						},
						fail: (err) => {
							console.log('request fail', err);
							// uni.showModal({
							// 	content: err.errMsg,
							// 	showCancel: false
							// });
						}
					})
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
