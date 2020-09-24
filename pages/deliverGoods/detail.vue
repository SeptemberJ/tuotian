<template>
	<view class="container">
		<!-- <view class="dbitem">
			<view class="itemBar">
				<view>发货单号：</view>
				<view>{{ order.FBillNo }}</view>
			</view>
			<view class="itemBar">
				<view>客户名称：</view>
				<view>{{ order.FCust }}</view>
			</view>
			<view class="itemBar">
				<view>发货日期：</view>
				<view>{{ order.FDate }}</view>
			</view>
		</view> -->
		<view class="lineData">
			<scroll-view scroll-x="true" scroll="scroll">
				<view class="columnTitWrap">
					<view class="columnTit">
						<text>序号</text>
						<text>标记</text>
						<text>规格</text>
						<text>数量</text>
						<text>库存</text>
						<text>单位</text>
						<text>发货仓库</text>
						<text>发货仓位</text>
						<text>物料代码</text>
						<text>物料名称</text>
					</view>
				</view>
				<view class="lineItem" v-for="(item, idx) in lineData" :key="idx">
					<text>{{ idx + 1 }}</text>
					<text>{{ item.FBiao}}</text>
					<text>{{ item.FModel }}</text>
					<text :class="{'colorRed': item.FAuxQty > item.FQty}">{{ item.FAuxQty }}</text>
					<text>{{ item.FQty }}</text>
					<text>{{ item.FUnit }}</text>
					<text>{{ item.FStock }}</text>
					<text>{{ item.FSP }}</text>
					<text>{{ item.FNumber }}</text>
					<text>{{ item.FName }}</text>
				</view>
			</scroll-view>
		</view>
		<view style="clear: both;"></view>
		<!-- <picker @change="sureChangeType" :value="typeIndex" :range="typeOptions">
			<button class="submitBt" :loading="loading">提 交{{scanResult}}</button>
		</picker> -->
		
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog type="input" mode="base" content="" message="成功消息" title="类型选择" :duration="2000" :before-close="true" @close="close" @confirm="confirm">
				<view style="padding: 0 10px 5px 10px;">
					<radio-group @change="sureChangeType" style="margin: 0 0 20px 0;">
						<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in typeOptions" :key="item.value">
							<radio :value="item.value" :checked="index == typeIndex" />{{item.label}}
						</label>
					</radio-group>
					<view v-if="typeIndex == 1" style="margin: 10px 0;">
						仓库：
						<view style="display: inline-block;">
							<picker @change="FStockPickerChange" :value="indexFStock" :range="FStocksOptions" range-key="FName">
								<view>{{ stockFName }}</view>
							</picker>
						</view>
					</view>
					<view v-if="typeIndex == 1" style="margin: 10px 0;">
						仓库仓位码：{{orderNo}}
					</view>
				</view>
			</uni-popup-dialog>
		</uni-popup>
		<button class="submitBt" :loading="loading" @click="checkSubmit">提 交</button>
		<scan-code></scan-code>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import scanCode from "@/components/scan-code/scan-code.vue"
	import { combineRequsetData } from '../../utils/util.js'
	import { mainUrl } from '../../utils/url.js'
	import {  mapState,  mapMutations } from 'vuex'
	
	export default {
		data() {
			return {
				order: {},
				FInterIDs: [],
				lineData: [],
				indexFStock: 0,
				x: 0,
				y: 200,
				loading: false,
				typeIndex: 0,
				isScanNo: false, // 是否是提交时候的扫码
				FStocksOptions: [],
				typeOptions: [{label: '销售出库', value: '0'}, {label: '调拨单', value: '1'}],
				orderNo: '请先扫码',
				stockFName: '请选择', // 选择的仓库名称
				stockFNumber: '', // 选择的仓库代码
				scanResult: 'wu',
				ins: 'wu'
			}
		},
		components: {
			uniPopup,
			uniPopupDialog,
			scanCode
		},
		computed: {
			...mapState(['fuserno'])  
		},
		onLoad(options) {
			this.FInterIDs = options.FInterIDs.split(',')
			// let order = JSON.parse(options.orderInfo)
			// this.order = order
		},
		onShow () {
			var _this = this
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器  
			uni.$on('scancodedate',(data) => {  
				_this.broadcastBackInfo(data.code)
			})
			this.getStockData()
			this.getLineData()
			this.stockClear()
		},
		methods: {
			sureChangeType (event) {
				this.typeIndex = event.detail.value
			},
			close () {
				this.$refs.popup.close()
				this.isScanNo = false
				this.typeIndex = 0
				this.orderNo = '请先扫码'
				this.stockFName = '请选择'
				this.stockFNumber = '' 
			},
			FStockPickerChange (e) {
				this.stockFName = this.FStocksOptions[e.target.value].FName
				this.stockFNumber = this.FStocksOptions[e.target.value].FNumber
				this.indexFStock = e.target.value
			},
			checkSubmit () {
				let filterArr = this.lineData.filter(this.checkSign)
				if (filterArr.length > 0) {
					uni.showModal({
						content: '存在已标记但未更新仓库仓位信息的单子!',
						showCancel: false
					})
					return false
				}
				let Data = []
				let hasMax = false
				this.lineData.map(item => {
					if (item.FBiao == 'Y') {
						Data.push({
							FInterID: item.FEntryID,
							FEntryID: item.FInterID,
							FAuxQty: item.FAuxQty
						})
						if (item.FAuxQty > item.FQty) {
							hasMax = true
						}
					}
				})
				if (Data.length == 0) {
					uni.showModal({
						content: '至少标记一条记录!',
						showCancel: false
					})
					return false
				}
				if (hasMax) {
					uni.showModal({
						content: '数量不能大于库存!',
						showCancel: false
					})
					return false
				}
				this.$refs.popup.open()
				this.isScanNo = true
				this.typeIndex = 0
				this.orderNo = '请先扫码'
			},
			confirm (done, value) {
				if (this.typeIndex == 1) {
					if (this.orderNo === '请先扫码' || this.stockFName == '请选择') {
						uni.showModal({
							content: '请先将仓库或仓位码填写完整!',
							showCancel: false
						})
					} else {
						this.submit()
					}
				} else {
					this.submit()
				}
			},
			broadcastBackInfo (result) {
				if (this.isScanNo) {
					this.orderNo = result
				} else {
					var tmpData = '<FResult>' + result + '</FResult>'
					uni.request({
						url: mainUrl,
						method: 'POST',
						data: combineRequsetData('SEOutStock_FSP', tmpData),
						header:{
							'Content-Type':'text/xml; charset=utf-8'
						},
						success: (res) => {
							if (res.data[0].code == 0) {
								// 物料标签 标记的扫码
								this.mark(result)
							} else {
								// 更新仓库仓位
								this.updateStock(result)
							}
						},
						fail: (err) => {
							console.log('request fail', err)
							// uni.showModal({
							// 	content: err.errMsg,
							// 	showCancel: false
							// })
						},
						complete: () => {
						}
					})
				}
			},
			mark (result) {
				let FInterIDs = []
				this.FInterIDs.map(FInterID => {
					FInterIDs.push({
						FInterID: FInterID
					})
				})
				var tmpData = '<FJson>' + JSON.stringify({items: FInterIDs}) + '</FJson>'
					tmpData += '<FNumber><![CDATA[' + result + ']]></FNumber>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('SEOutStock_Sign', tmpData),
					header:{
						'Content-Type':'text/xml'
					},
					success: (res) => {
						if (res.data[0].code == '1') {
							this.getLineData()
						} else {
							uni.showModal({
								content: '不存在此物料',
								showCancel: false
							})
						}
					},
					fail: (err) => {
						console.log('request fail', err)
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						})
					}
				})
			},
			updateStock (result) {
				let StockData = []
				this.lineData.map(item => {
					if (item.FBiao == 'Y' && item.FSP == '') {
						StockData.push({
							FStock: item.FStock,
							FSP: result,
							FItemID: item.FItemID
						})
					}
				})
				let FInterIDs = []
				this.FInterIDs.map(FInterID => {
					FInterIDs.push({
						FInterID: FInterID
					})
				})
				var tmpData = '<FJson><![CDATA[' + JSON.stringify({items: StockData}) + ']]></FJson>'
					tmpData += '<FJsonBT><![CDATA[' + JSON.stringify({items: FInterIDs}) + ']]></FJsonBT>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('SEOutStock_Stock', tmpData),
					header:{
						'Content-Type':'text/xml;charset=utf-8'
					},
					success: (res) => {
						if (res.data[0].code == '1') {
							this.getLineData()
						} else {
							uni.showModal({
								content: '更新仓位信息失败',
								showCancel: false
							})
						}
					},
					fail: (err) => {
						console.log('request fail', err)
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						})
					}
				})
			},
			broadcastBackInfo0 (result) {
				this.scanResult = result
				if (this.isScanNo) {
					// 提交的扫码
					if (result.indexOf('[') == -1) {
						uni.showModal({
							content: '您扫的不是仓库仓位码!',
							showCancel: false
						})
					} else {
						this.orderNo = result
					}
				} else {
					// 标记的扫码
					if (result.indexOf('&') != -1) {
						// 标记
						let FNumber = result.split('&')[0]
						let FEntryID = result.split('&')[1]
						var tmpData = '<FBillNO>' + this.order.FBillNo + '</FBillNO>'
							tmpData += '<FEntryID>' + FEntryID + '</FEntryID>'
							tmpData += '<FNumber>' + FNumber + '</FNumber>'
							
						uni.request({
							url: mainUrl,
							method: 'POST',
							data: combineRequsetData('SEOutStock_Sign', tmpData),
							header:{
								'Content-Type':'text/xml'
							},
							success: (res) => {
								if (res.data[0].code == '1') {
									this.getLineData(this.order.FBillNo)
								} else {
									uni.showModal({
										content: '不存在此物料',
										showCancel: false
									})
								}
							},
							fail: (err) => {
								console.log('request fail', err)
								uni.showModal({
									content: err.errMsg,
									showCancel: false
								})
							}
						})
					}
					// 更新仓库仓位
					if (result.indexOf('[') != -1) {
						// 标记
						let FStock = result.split('[')[0]
						let FSP = result.split('[')[1]
						let StockData = []
						this.lineData.map(item => {
							if (item.FBiao == 'Y' && item.FStock == '' && item.FSP == '') {
								StockData.push({
									FStock: FStock,
									FSP: FSP,
									FEntryID: item.FEntryID
									// FBillNO: item.FBillNo,
									// FEntryID: item.FEntryID
								})
							}
						})
						var tmpData = '<FJson><![CDATA[' + JSON.stringify({items: StockData}) + ']]></FJson>'
						uni.request({
							url: mainUrl,
							method: 'POST',
							data: combineRequsetData('SEOutStock_Stock', tmpData),
							header:{
								'Content-Type':'text/xml;charset=utf-8'
							},
							success: (res) => {
								if (res.data[0].code == '1') {
									this.getLineData(this.order.FBillNo)
								} else {
									uni.showModal({
										content: '更新仓位信息失败',
										showCancel: false
									})
								}
							},
							fail: (err) => {
								console.log('request fail', err)
								uni.showModal({
									content: err.errMsg,
									showCancel: false
								})
							}
						})
					}
				}
			},
			checkSign (item) {
				return item.FBiao == 'Y' && item.FStock == '' && item.FSP == ''
			},
			submit () {
				let Data = []
				this.lineData.map(item => {
					if (item.FBiao == 'Y') {
						Data.push({
							FItemID: item.FItemID,
							FAuxQty: item.FAuxQty
						})
					}
				})
				let FInterIDs = []
				this.FInterIDs.map(FInterID => {
					FInterIDs.push({
						FInterID: FInterID
					})
				})
				var tmpData = '<FJson><![CDATA[' + JSON.stringify({items: Data}) + ']]></FJson>'
					tmpData += '<FJsonBT><![CDATA[' + JSON.stringify({items: FInterIDs}) + ']]></FJsonBT>'
					tmpData += '<FType><![CDATA[' + (this.typeIndex == 0 ? '销售出库' : '调拨单') + ']]></FType>'
					tmpData += '<FStock><![CDATA[' + (this.typeIndex == 0 ? '' : this.stockFNumber) + ']]></FStock>'
					tmpData += '<FSP><![CDATA[' + (this.typeIndex == 0 ? '' : this.orderNo) + ']]></FSP>'
					tmpData += '<fuserno>' + this.fuserno + '</fuserno>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('SEOutStock_Check', tmpData),
					header:{
						'Content-Type':'text/xml;charset=utf-8'
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
			getLineData () {
				let FInterIDs = []
				this.FInterIDs.map(FInterID => {
					FInterIDs.push({
						FInterID: FInterID
					})
				})
				var tmpData = '<FJson>' + JSON.stringify({items: FInterIDs}) +'</FJson>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('SEOutStock_Select', tmpData),
					header:{
						'Content-Type':'text/xml'
					},
					success: (res) => {
						this.lineData = res.data
					},
					fail: (err) => {
						console.log('request fail', err);
						// uni.showModal({
						// 	content: err.errMsg,
						// 	showCancel: false
						// });
					},
					complete: () => {
						this.loading = false;
						uni.stopPullDownRefresh();
					}
				})
			},
			getLineData0 (FBillNo) {
				var tmpData = "<FSQL>select * from z_SEOutStockEntry where fbillno='" + FBillNo + "'</FSQL>"
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
						})
					}
				})
			},
			stockClear () {
				let FInterIDs = []
				this.FInterIDs.map(FInterID => {
					FInterIDs.push({
						FInterID: FInterID
					})
				})
				var tmpData = '<FJson>' + JSON.stringify({items: FInterIDs}) + '</FJson>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('SEOutStock_Clear', tmpData),
					header:{
						'Content-Type':'text/xml; charset=utf-8'
					},
					success: (res) => {
						if (res.data[0].code != 1) {
							uni.showModal({
								content: 'clear失败',
								showCancel: false
							})
						}
						this.getLineData(this.order.FBillNo)
					},
					fail: (err) => {
						console.log('request fail', err)
						// uni.showModal({
						// 	content: err.errMsg,
						// 	showCancel: false
						// })
					},
					complete: () => {
					}
				})
			},
			getStockData () {
				var tmpData = '<FSQL>select * from Z_Stock</FSQL>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('JA_LIST', tmpData),
					header:{
						'Content-Type':'text/xml'
					},
					success: (res) => {
						this.FStocksOptions = res.data
					},
					fail: (err) => {
						console.log('request fail', err);
						// uni.showModal({
						// 	content: err.errMsg,
						// 	showCancel: false
						// });
					},
					complete: () => {
						this.loading = false;
						uni.stopPullDownRefresh();
					}
				})
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
		/* height: 30px;
		line-height: 30px; */
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
		position: relative;
		/* z-index: 998; */
	}
	.columnTitWrap{
		background: #C0C0C0;
	}
	.columnTit{
		width: 1145px;
		height: 30px;
		background: #C0C0C0;
	}
	.columnTit text{
		width: 150px;
		height: 30px;
		/* padding: 0 10px; */
		line-height: 30px;
		display: inline-block;
		font-weight: 400;
	}
	.columnTit text:nth-of-type(1){
		width: 45px;
	}
	.columnTit text:nth-of-type(2){
		width: 60px;
	}
	.columnTit text:nth-of-type(3){
		width: 400px;
	}
	.columnTit text:nth-of-type(4){
		width: 60px;
	}
	.columnTit text:nth-of-type(5){
		width: 60px;
	}
	.columnTit text:nth-of-type(6){
		width: 60px;
	}
	.columnTit text:nth-of-type(7){
		width: 80px;
	}
	.columnTit text:nth-of-type(8){
		width: 80px;
	}
	.lineItem{
		min-width: 1145px;
		margin-bottom: 10px;
		display: flex;
		align-items: center;
		border-bottom: 1px dashed #555555;
	}
	.lineItem text{
		width: 150px;
		/* padding: 0 10px; */
		display: inline-block;
		font-weight: 400;
	}
	.lineItem text:nth-of-type(1){
		width: 45px;
	}
	.lineItem text:nth-of-type(2){
		width: 60px;
	}
	.lineItem text:nth-of-type(3){
		width: 400px;
	}
	.lineItem text:nth-of-type(4){
		width: 60px;
	}
	.lineItem text:nth-of-type(5){
		width: 60px;
	}
	.lineItem text:nth-of-type(6){
		width: 60px;
	}
	.lineItem text:nth-of-type(7){
		width: 80px;
	}
	.lineItem text:nth-of-type(8){
		width: 80px;
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
	.uni-label-pointer{
		margin-right: 10px;
	}
</style>
