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
						<text>{{ order.FDCStock }}</text>
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
		<!-- <movable-area style="width: 100%;height: calc(100vh - 45px);position: absolute;top: 45px;">
			<movable-view :x="x" :y="y" direction="all" @click="scanMateriel " @change="onChange" class="dotScan">物料<br/>扫码</movable-view>
			<movable-view :x="x2" :y="y2" direction="all" @click="scanStock" @change="onChange" class="dotScan bgOrange">仓库<br/>扫码</movable-view>
		</movable-area> -->
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
				x: 0,
				y: 200,
				x2: 0,
				y2: 300,
				orderList: []
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
				if (result.indexOf('[') == -1) {
					// 物料
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
									item.FDCStock = ''
									item.FDCSP = ''
									return item
								})
							}
						},
						fail: (err) => {
							console.log('request fail', err)
						}
					})
				} else {
					// 仓库
					let FStock = result.split('[')[0]
					let FSP = result.split('[')[1]
					this.orderList.map(item => {
						item.FDCStock = FStock
						item.FDCSP = FSP
					})
				}
			},
			scanMateriel () {
				let FNUMBER = '1.03.J5TB-04SPZ'
				var tmpData = "<FSQL>select FStockNumber,FSP,FQty,FItemID,FNUMBER,FName,FModel,FUnit from Z_ICInventory WHERE FNUMBER='" + FNUMBER + "'</FSQL>"
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
								item.FDCStock = ''
								item.FDCSP = ''
								return item
							})
						}
					},
					fail: (err) => {
						console.log('request fail', err)
					}
				})
				// uni.scanCode({
				//     onlyFromCamera: false,
				//     success: (res) => {
				// 		var tmpData = "<FSQL>select FStockNumber,FSP,FQty,FItemID,FNUMBER,FName,FModel,FUnit from Z_ICInventory WHERE FNUMBER='" + res.result + "'</FSQL>"
				// 		uni.request({
				// 			url: mainUrl,
				// 			method: 'POST',
				// 			data: combineRequsetData('JA_LIST', tmpData),
				// 			header:{
				// 				'Content-Type':'text/xml'
				// 			},
				// 			success: (res) => {
				// 				if (res.data.length == 0) {
				// 					uni.showModal({
				// 						content: '无该物料信息！',
				// 						showCancel: false
				// 					});
				// 				} else {
				// 					this.orderList = res.data.map(item => {
				// 						item.FAuxqty = item.FQty
				// 						item.FSCStock = item.FStockNumber
				// 						item.FSCSP = item.FSP
				// 						item.FDCStock = ''
				// 						item.FDCSP = ''
				// 						return item
				// 					})
				// 				}
				// 			},
				// 			fail: (err) => {
				// 				console.log('request fail', err)
				// 			}
				// 		})
				// 	},
				// 	fail: (err) => {
				// 		console.log(err)
				// 	}
				// })
			},
			scanStock (order) {
				// let result = '002[B1-4'
				// let FStock = result.split('[')[0]
				// let FSP = result.split('[')[1]
				// this.orderList.map(item => {
				// 	item.FDCStock = FStock
				// 	item.FDCSP = FSP
				// })
				uni.scanCode({
				    onlyFromCamera: false,
				    success: (res) => {
						let FStock = res.result.split('[')[0]
						let FSP = res.result.split('[')[1]
						console.log('res.result', res.result)
						this.orderList.map(item => {
							item.FDCStock = FStock
							item.FDCSP = FSP
						})
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			submit () {
				let hasM = false
				this.orderList.map(item => {
					if (item.FAuxqty > item.FQty){
						hasM = true
					}
				})
				if (hasM) {
					uni.showModal({
						content: '调出数量不能大于调入数量,请确认您的数据！',
						showCancel: false
					})
				} else {
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
				}
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
