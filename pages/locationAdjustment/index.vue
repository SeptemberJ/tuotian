<template>
	<view class="container">
		<scroll-view scroll-x="true" scroll="scroll">
			<view class="tabBarWrap">
				<view class="tabBar">
					<!-- <text>序号</text>
					<text>物料代码</text>
					<text>物料名称</text>
					<text>规格</text>
					<text>单位</text>
					<text>调出仓库</text>
					<text>调出货位</text>
					<text>调出数量</text>
					<text>调入仓库</text>
					<text>调入货位</text>
					<text>调入数量</text>
					<text>操作</text> -->
					
					<text>操作</text>
					<text>规格</text>
					<text>调入仓库</text>
					<text>调入货位</text>
					<text>调入数量</text>
					<text>调出仓库</text>
					<text>调出货位</text>
					<text>调出数量</text>
					<text>物料代码</text>
					<text>物料名称</text>
					<text>单位</text>
				</view>
			</view>
			<view class="orderWrap">
				<view class="orderList">
					<view class="order" v-for="(order, idx) in orderList" :key="idx">
						<text><button type="primary" @click="remove(idx)" style="width:70px;float: left;line-height: 30px;background: #FF0000;">移除</button></text>
						<text>{{ order.FModel }}</text>
						<text>
							<picker @change="FStockPickerChange" :value="indexFStock" :range="FStocksOptions" range-key="FName">
								<view>{{ order.FDCStock }}</view>
							</picker>
						<!-- {{ order.FDCStock }} -->
						</text>
						<text>{{ order.FDCSP }}</text>
						<text>{{ order.FQty }}</text>
						<text>{{ order.FStockNumber }}</text>
						<text>{{ order.FSP }}</text>
						<text><input :class="{'uni-input': true, 'colorRed': order.FAuxqty != order.FQty}" type="number" v-model="order.FAuxqty" @blur="changeNumber(idx, order)" style="border-bottom: 1px solid #ccc;" /></text>
						<text>{{ order.FNUMBER }}</text>
						<text>{{ order.FName }}</text>
						<text>{{ order.FUnit }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="submitBlock">
			<button class="submitBt" :loading="loading" @click="submit">提 交</button>
		</view>
		<scan-code></scan-code>
	</view>
</template>

<script>
	import { combineRequsetData } from '../../utils/util.js'
	import scanCode from "@/components/scan-code/scan-code.vue"
	import { mainUrl } from '../../utils/url.js'
	import {  mapState,  mapMutations } from 'vuex'
	
	export default {
		data() {
			return {
				loading: false,
				orderList: [],
				FStocksOptions: [],
				indexFStock: 0
			}
		},
		components: {
			scanCode
		},
		computed: {
			...mapState(['fuserno'])  
		},
		onShow () {
			// this.scanMateriel()
			var _this = this
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器  
			uni.$on('scancodedate',(data) => {  
				_this.broadcastBackInfo(data.code)
			})
			this.getStockData()
		},
		methods: {
			changeNumber (idx, order) {
				// if (Number(event.target.value) > Number(order.FQty)) {
				// 	uni.showModal({
				// 		content: '调出数量不能大于调入数量！',
				// 		showCancel: false
				// 	})
				// 	this.orderList[idx].FAuxqty = order.FQty
				// }
			},
			remove (idx) {
				this.orderList.splice(idx, 1)
			},
			broadcastBackInfo (result) {
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
							this.materia(result)
						} else {
							// 更新仓库仓位
							this.orderList.map(item => {
								item.FDCSP = result
							})
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
				// 物料
				
			},
			materia (result) {
				var tmpData = "<FSQL>select FStockNumber,FSP,FQty,FItemID,FNUMBER,FName,FModel,FUnit from Z_ICInventory WHERE FNUMBER='" + result + "'</FSQL>"
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
								content: '无该物料信息！',
								showCancel: false
							});
						} else {
							this.orderList = res.data.map(item => {
								item.FAuxqty = item.FQty
								item.FSCStock = item.FStockNumber
								item.FSCSP = item.FSP
								item.FDCStock = '请选择'
								item.FDCSP = ''
								return item
							})
						}
					},
					fail: (err) => {
						console.log('request fail', err)
					}
				})
			},
			submit () {
				let hasM = false
				let hasEmptyStock = false
				let hasEmptyFDCSP = false
				this.orderList.map(item => {
					if (item.FAuxqty > item.FQty){
						hasM = true
					}
					if (item.FDCStock == '请选择'){
						hasEmptyStock = true
					}
					if (item.FDCSP == ''){
						hasEmptyFDCSP = true
					}
				})
				if (hasM) {
					uni.showModal({
						content: '调出数量不能大于调入数量,请确认您的数据！',
						showCancel: false
					})
					return false
				}
				if (hasEmptyStock) {
					uni.showModal({
						content: '请选择调入仓库！',
						showCancel: false
					})
					return false
				}
				if (hasEmptyFDCSP) {
					uni.showModal({
						content: '请扫描调入货位！',
						showCancel: false
					})
					return false
				}
				this.loading = true
				var tmpData = '<FJson><![CDATA[' + JSON.stringify({items: this.orderList}) + ']]></FJson>'
					tmpData += '<fuserno>' + this.fuserno + '</fuserno>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('check_41', tmpData),
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
			FStockPickerChange (e) {
				this.indexFStock = e.target.value
				this.orderList.map(item => {
					item.FDCStock = this.FStocksOptions[e.target.value].FName
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
	}
	.tabBarWrap{
		background: #1196DB;
	}
	.tabBar{
		width: 1655px;
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
		text-align: left;
	}
	.tabBar text {
		width: 150px;
	}
	.tabBar text:nth-of-type(1) {
		width: 100px;
	}
	.tabBar text:nth-of-type(2) {
		width: 550px;
	}
	.tabBar text:nth-of-type(3) {
		width: 100px;
	}
	.tabBar text:nth-of-type(4) {
		width: 100px;
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
	.tabBar text:nth-of-type(8) {
		width: 100px;
	}
	.tabBar text:nth-of-type(11) {
		width: 55px;
	}
	.orderWrap{
		width: 1655px;
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
		width: 150px;
	}
	.order text:nth-of-type(1) {
		width: 100px;
	}
	.order text:nth-of-type(2) {
		width: 550px;
	}
	.order text:nth-of-type(3) {
		width: 100px;
	}
	.order text:nth-of-type(4) {
		width: 100px;
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
	.order text:nth-of-type(8) {
		width: 100px;
	}
	.order text:nth-of-type(11) {
		width: 55px;
	}
	.dotScan {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: #1196DB;
		font-size: 12px;
		color: #ffffff;
		z-index: 999;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.bgOrange {
		background: darkorange;
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
	.colorRed{
		color: #FF0000;
	}
</style>
