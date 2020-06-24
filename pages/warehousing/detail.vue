<template>
	<view class="container">
		<view class="dbitem">
			<view class="itemBar">
				<view>供应商名称：</view>
				<view>{{ FSupply}}</view>
			</view>
			<view class="itemBar">
				<view>收料单号：</view>
				<view>{{ FBillNo}}</view>
			</view>
			<view class="itemBar">
				<view>收料日期：</view>
				<view>{{ FDate}}</view>
			</view>
			<view class="itemBar" @click="seeStockInfo" style="background: #F5F5F5;">
				<view>物料代码：</view>
				<view>{{ FNumber}}</view>
			</view>
			<view class="itemBar" @click="seeStockInfo" style="background: #F5F5F5;">
				<view>物料名称：</view>
				<view>{{ FName}}</view>
			</view>
			<view class="itemBar">
				<view>规格型号：</view>
				<view>{{ FModel}}</view>
			</view>
			<view class="itemBar">
				<view>单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位：</view>
				<view>{{ FUnit}}</view>
			</view>
			<view class="itemBar">
				<view>收料数量：</view>
				<view>{{ FAuxQty}}</view>
			</view>
			<view class="itemBar">
				<view>批&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</view>
				<view>{{ FBatchNo}}</view>
			</view>
		</view>
		<view class="lineData">
			<scroll-view scroll-x="true" scroll="scroll">
				<view class="columnTit">
					<text>物料代码</text>
					<text>名称</text>
					<text>规格</text>
					<text>单位</text>
					<text>应收</text>
					<text>实收</text>
					<text>仓库</text>
					<text>仓位</text>
					<text>批次</text>
				</view>
				<view class="lineItem" v-for="(item, idx) in lineData" :key="idx">
					<text>{{item.FNumber}}</text>
					<text>{{item.FName}}</text>
					<text>{{item.FModel}}</text>
					<text>{{item.FUnit}}</text>
					<text>{{item.FAuxqtyMust}}</text>
					<text><input class="uni-input" type="number" v-model="item.FAuxqty" @blur="updateNumber($event, idx)"/></text>
					<text>{{item.FStock}}</text>
					<text>{{item.FSP}}</text>
					<text>{{item.FBatchNo}}</text>
				</view>
			</scroll-view>
		</view>
		<view style="clear: both;"></view>
		<!-- <button type="primary" @click="scan" style="width:150px; margin:30px auto;">扫码</button> -->
		<view class="operationBar">
			<!-- <button type="secondary" @click="save(false)" :loading="loadingZC" style="border: 2px solid darkorange;color: darkorange;background: #fff;">暂存</button> -->
			<button type="primary" @click="scan" style="width:100px;">扫码</button>
			<button type="warn" @click="submit" :loading="loading" style="border: 2px solid darkorange;background: darkorange;color: #fff;">提交</button>
		</view>
		<!-- stocInfo -->
		<uni-popup ref="popup" type="bottom">
			<view class="StockBlock">
				<view class="StockTit">
					<text>仓库名称</text>
					<text>仓库代码</text>
					<text>库位</text>
					<text>库存</text>
				</view>
				<view class="StockMain">
					<view style="width: 100%;display: flex;justify-content: space-between;" v-for="(stock, idx) in StockInfo" :key="idx">
						<text>{{ stock.FStockName }}</text>
						<text>{{ stock.FStockNumber }}</text>
						<text>{{ stock.FSP }}</text>
						<text>{{ stock.FQty }}</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import { combineRequsetData } from '../../utils/util.js'
	import { mainUrl } from '../../utils/url.js'
	import {  mapState,  mapMutations } from 'vuex'
	
	export default {
		data() {
			return {
				FAuxqtyMust: 0,
				cumulative: 0,
				orderInfo: {},
				FInterID: '',
				FEntryID: '',
				FSupply: '',
				FBillNo: '',
				FDate: '',
				FNumber: '',
				FName: '',
				FModel: '',
				FUnit: '',
				FAuxQty: '',
				FBatchNo: '',
				lineData: [],
				lineItem: {},
				loadingZC: false,
				loading: false,
				StockInfo: []
			}
		},
		components: {
			uniPopup
		},
		computed: {
			...mapState(['fuserno'])  
		},
		onLoad(options) {
			let order = JSON.parse(options.order)
			this.orderInfo = order
			this.FAuxqtyMust = order.FAuxQty
			this.FSupply = order.FSupply
			this.FBillNo = order.FBillNo
			this.FDate = order.FDate
			this.FNumber = order.FNumber
			this.FName = order.FName
			this.FModel = order.FModel
			this.FUnit = order.FUnit
			this.FAuxQty = order.FAuxQty
			this.FBatchNo = order.FBatchNo
			this.FInterID = order.FInterID
			this.FEntryID = order.FEntryID
			// this.lineData.push({...order, ...{FAuxqtyMust: order.FAuxQty, FAuxqty: '', FStock: '', FSP: ''}})
			// this.getDetail(order.FInterID, order.FEntryID)
		},
		methods: {
			// 查看库存信息
			seeStockInfo () {
				var tmpData = "<FSQL>select FStockNumber,FStockName,FSP,FQty from Z_ICInventory WHERE FNUMBER='" + this.FNumber + "'" + '</FSQL>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('JA_LIST', tmpData),
					header:{
						'Content-Type':'text/xml'
					},
					success: (res) => {
						if (res.data.length > 0) {
							this.StockInfo = res.data
							this.$refs.popup.open()
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
			},
			scan () {
				if (this.FAuxqtyMust == this.cumulative) {
					uni.showModal({
						content: '累计实收已经达到应收数量',
						showCancel: false
					})
				} else {
					// let result = {FAuxqtyMust: this.FAuxqtyMust, FAuxqty: this.FAuxqtyMust - this.cumulative, FStock: '002', FSP: 'A1-2'}
					// this.lineData.push({...this.orderInfo, ...result})
					// this.updateNumber()
					uni.scanCode({
					    onlyFromCamera: false,
					    success: (res) => {
							console.log(res.result)
							let resultArr = res.result.split('[')
							// console.log(resultArr)
							if (resultArr[0] && resultArr[1]) {
								let resultArr = res.result.split('[')
								let result = {FAuxqtyMust: this.FAuxqtyMust, FAuxqty: this.FAuxqtyMust - this.cumulative, FStock: resultArr[0], FSP: resultArr[1]}
								this.checkIfNormalStock(result)
								// this.lineData.push({...this.orderInfo, ...result})
								// this.updateNumber()
							} else {
								uni.showModal({
									content: '请确认您的二维码!',
									showCancel: false
								});
							}
					    },
						fail: (err) => {
							console.log(err)
						}
					})
				}
			},
			checkIfNormalStock (result) {
				var tmpData = "<FSQL>select FStockNumber,FStockName,FSP,FQty from Z_ICInventory WHERE FNUMBER='" + this.FNumber + "' and FStockNumber='" + result.FStock + "' and FSP='" +result.FSP + "'</FSQL>"
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('JA_LIST', tmpData),
					header:{
						'Content-Type':'text/xml'
					},
					success: (res) => {
						if (res.data.length == 0) {
							// 不是常用货位确认是否显示
							uni.showModal({
								content: '不是常用货位,请确认',
								success: (res) => {
									if (res.confirm) {
										this.lineData.push({...this.orderInfo, ...result})
										this.updateNumber()
									} else if (res.cancel) {
									}
								}
							});
						} else {
							// 常用货位直接添加显示
							this.lineData.push({...this.orderInfo, ...result})
							this.updateNumber()
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
			updateNumber (e, idx) {
				if (!e) {
					let total = 0
					this.lineData.map(item => {
						total += Number(item.FAuxqty)
					})
					this.cumulative = total
				} else {
					let curTotal = 0
					this.lineData.map(item => {
						curTotal += Number(item.FAuxqty)
					})
					if (this.FAuxqtyMust < curTotal) {
						uni.showModal({
							content: '请检查输入的实收数量,累计实收数量应该小于等于应收数量。',
							showCancel: false
						});
						this.lineData[idx].FAuxqty = this.FAuxqtyMust - (curTotal - Number(e.detail.value))// this.FAuxqtyMust - this.cumulative
					} else {
						let total = 0
						this.lineData.map(item => {
							total += Number(item.FAuxqty)
						})
						this.cumulative = total
					}
				}
			},
			changeNumber (e, idx) {
				if (this.FAuxqtyMust - this.cumulative <= Number(e.detail.value)) {
					uni.showModal({
						content: '请检查输入的实收数量,累计实收数量应该小于等于应收数量。',
						showCancel: false
					});
					this.lineData[idx].FAuxqty = this.cumulative
				} else {
					let total = 0
					this.lineData.map(item => {
						total += Number(item.FAuxqty)
					})
					this.cumulative = total
				}
			},
			save (hideTips) {
				return new Promise((resolve, reject) => {
					if (!hideTips) {
						this.loadingZC = true
					}
					var tmpData = '<FInterID>' + this.FInterID + '</FInterID>'
						tmpData += '<FEntryID>' + this.FEntryID + '</FEntryID>'
						tmpData += '<FJson>' + JSON.stringify({items: this.lineData}) + '</FJson>'
					uni.request({
						url: mainUrl,
						method: 'POST',
						data: combineRequsetData('save', tmpData),
						header:{
							'Content-Type':'text/xml'
						},
						success: (res) => {
							switch (res.data[0].code) {
								case '1':
									if (!hideTips) {
										uni.showToast({
											title: '暂存成功!',
											icon: 'success',
											mask: true,
											duration: 1500
										})
									}
									resolve(1)
								break
								default:
									if (!hideTips) {
										uni.showModal({
											content: '暂存失败!',
											showCancel: false
										});
									}
									resolve(0)
								break
							}
							
						},
						fail: (err) => {
							uni.showModal({
								content: err.errMsg,
								showCancel: false
							});
							resolve(0)
						},
						complete: () => {
							this.loadingZC = false
						}
					})
				})
			},
			async submit () {
				// let result = await this.save(true)
				// if (result == 0) {
				// 	uni.showModal({
				// 		content: '暂存失败!',
				// 		showCancel: false
				// 	});
				// 	return false
				// }
				if (this.cumulative < this.FAuxqtyMust) {
					uni.showModal({
						content: '累计实收数量应该等于应收数量!',
						showCancel: false
					});
					return false
				}
				this.loading = true
				// var tmpData = '<FInterID>' + this.FInterID + '</FInterID>'
				// 	tmpData += '<FEntryID>' + this.FEntryID + '</FEntryID>'
				var tmpData = '<FInterID>' + this.FInterID + '</FInterID>'
					tmpData += '<FEntryID>' + this.FEntryID + '</FEntryID>'
					tmpData += '<FJson>' + JSON.stringify({items: this.lineData}) + '</FJson>',
					tmpData += '<fuserno>' + this.fuserno + '</fuserno>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('check', tmpData),
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
			getDetail (FInterID, FEntryID) {
				var tmpData = '<FSQL>select FSupply,FBillNo,FDate,FNumber,FName,FModel,FUnit,FBatchNo,FAuxqtyMust,a.FAuxqty,FStock,FSP,b.FInterID,b.FEntryID from z_POInStock_tempentry a inner join z_POInStock b on a.finterid=b.finterid and a.fentryid=b.fentryid where a.finterid=' + FInterID + ' and a.fentryid='+ FEntryID + '</FSQL>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('JA_LIST', tmpData),
					header:{
						'Content-Type':'text/xml'
					},
					success: (res) => {
						if (res.data.length > 0) {
							this.lineData = [...this.lineData, ...res.data]
							res.data.map(item => {
								this.cumulative += Number(item.FAuxqty)
							})
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
		width: 100%;
		float: left;
	}
	.columnTit{
		width: 1410px;
		height: 30px;
		background: #C0C0C0;
	}
	.columnTit text{
		height: 30px;
		padding: 0 10px;
		line-height: 30px;
		display: inline-block;
		font-weight: 400;
	}
	.columnTit text:nth-of-type(1){
		width: 250px;
	}
	.columnTit text:nth-of-type(2){
		width: 130px;
	}
	.columnTit text:nth-of-type(3){
		width: 220px;
	}
	.columnTit text:nth-of-type(4){
		width: 80px;
	}
	.columnTit text:nth-of-type(5){
		width: 100px;
	}
	.columnTit text:nth-of-type(6){
		width: 100px;
	}
	.columnTit text:nth-of-type(7){
		width: 100px;
	}
	.columnTit text:nth-of-type(8){
		width: 100px;
	}
	.columnTit text:nth-of-type(9){
		width: 150px;
	}
	.lineItem{
		width: 1410px;
		margin-bottom: 10px;
		display: flex;
		align-items: center;
	}
	.lineItem text{
		padding: 0 10px;
		display: inline-block;
		font-weight: 400;
	}
	.lineItem text:nth-of-type(1){
		width: 250px;
	}
	.lineItem text:nth-of-type(2){
		width: 130px;
	}
	.lineItem text:nth-of-type(3){
		width: 220px;
	}
	.lineItem text:nth-of-type(4){
		width: 80px;
	}
	.lineItem text:nth-of-type(5){
		width: 100px;
	}
	.lineItem text:nth-of-type(6){
		width: 100px;
	}
	.lineItem text:nth-of-type(7){
		width: 100px;
	}
	.lineItem text:nth-of-type(8){
		width: 100px;
	}
	.lineItem text:nth-of-type(9){
		width: 150px;
	}
	.operationBar{
		width: 100%;
		margin: 30px 0;
		text-align: center;
	}
	.operationBar button{
		width: 100px;
		margin: 0 20px;
		display: inline-block;
	}
	.StockBlock{
		background: #ffffff;
	}
	.StockTit{
		width: 100%;
		height: 30px;
		display: flex;
		align-items: center;
		background: #F5F5F5;
	}
	.StockTit text{
		width: 25%;
		text-align: center;
	}
	.StockMain{
		padding: 0 15px 20px 15px;
	}
	.StockMain text{
		width: 25%;
		text-align: center;
	}
</style>
