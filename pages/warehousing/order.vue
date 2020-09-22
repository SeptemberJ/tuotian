<template>
	<view class="container">
		<view class="searchBar">
			<input class="uni-input" v-model="FSupply" placeholder="输入供应商名称" />
			<input class="uni-input" v-model="FBillNo" placeholder="输入收料单号" />
			<button class="searchBt" type="primary" size="mini" @click="search">搜索</button>
			<button class="searchBt" type="primary" size="mini" @click="sureCheck">确认</button>
		</view>
		<view v-if="loading"><uni-loading :height1="100" :loadModal="loading"></uni-loading></view>
		<view v-if="!loading && orderList.length == 0" style="text-align: center;background-color: #f5f5f5;padding-top: 40px;">
			<image src="../../static/wushuju.png" style="width: 128px;height: 84px;margin: 0 auto 20px auto;display: block;"></image>
			<text style="color: #666;">暂无数据</text>
		</view>
		<view v-if="!loading && orderList.length > 0" :class="{ dbitem: true, activeBg: order.checked}" v-for="(order, idx) in orderList"  @click="checkedChange(order, idx)">
			<view class="itemBar" style="padding-left: 0;border-left: 4px solid #6190e8;margin-bottom: 5px;">
				<view><text style="padding-left: 6px;">供应商名称：</text></view>
				<view>{{ order.FSupply}}</view>
			</view>
			<view class="itemBar">
				<view>收料单号：</view>
				<view>{{ order.FBillNo}}</view>
			</view>
			<view class="itemBar">
				<view>收料日期：</view>
				<view>{{ order.FDate}}</view>
			</view>
		</view>
		<view style="clear: both;"></view>
	</view>
</template>

<script>
	import { combineRequsetData } from '../../utils/util.js'
	import uniLoading from '@/components/loading/loading.vue'
	import { mainUrl } from '../../utils/url.js'
	export default {
		components: {
			uniLoading
		},
		data() {
			return {
				checkedFSupply: null, // 选中的order的FSupply
				FInterIDs: [], // 选中的FInterID
				orderList: [],
				loading: false,
				FSupply: '',
				FBillNo: ''
			}
		},
		onShow () {
			// this.getList()
		},
		onPullDownRefresh() {
			this.loading = true
			this.orderList = []
			this.getList()
		},
		watch: {
			FInterIDs: function (val) {
				if (val.length == 0) {
					this.checkedFSupply = null
				}
			}
		},
		methods: {
			sureCheck () {
				if (this.FInterIDs.length == 0) {
					uni.showModal({
						content: '请先选择单子!',
						showCancel: false
					})
				} else {
					this.toList(this.FInterIDs)
				}
			},
			checkedChange (order, idx) {
				if (!this.checkedFSupply) {
					this.orderList[idx].checked = true
					this.FInterIDs.push(order.FInterID)
					this.checkedFSupply = order.FSupply
				} else {
					if (!order.checked) {
						if (this.checkedFSupply == order.FSupply) {
							this.orderList[idx].checked = !order.checked
							this.FInterIDs.push(order.FInterID)
						} else {
							uni.showModal({
								content: '所选择单子的供应商必须一致!',
								showCancel: false
							})
						}
					} else {
						// 取消勾选
						this.orderList[idx].checked = !order.checked
						let index = this.FInterIDs.indexOf(order.FInterID)
						this.FInterIDs.splice(index, 1)
					}
				}
			},
			search () {
				if (!this.FSupply && !this.FBillNo) {
					uni.showModal({
						content: '请输入查询的供应商名称或收料单号!',
						showCancel: false
					})
				} else {
					this.getList()
				}
			},
			toList (FInterIDs) {
				uni.navigateTo({
				    url: './list?FInterIDs=' + FInterIDs
				});
			},
			getList () {
				var tmpData = "<FSQL><![CDATA[select distinct FSupply,FBillNo,FDate,FInterID from z_POInStock where FSupply like '%" + this.FSupply + "%' and FBillNo like '%" + this.FBillNo + "%' order by FBillNo]]></FSQL>"
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('JA_LIST', tmpData),
					header:{
						'Content-Type':'text/xml; charset=utf-8'
					},
					success: (res) => {
						console.log(res.data)
						this.orderList = res.data.map(item => {
							item.checked = false
							return item
						})
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
				});
			}
		}
	}
</script>

<style>
	.container {
		/* padding: 0 0 20px 0; */
		min-height: 100vh;
		font-size: 14px;
		line-height: 24px;
		background-color: #F5F5F5;
		text-align: center;
	}
	.dbitem{
		width: 100%;
		padding: 10px 0;
		background-color: #ffffff;
		margin-bottom: 20px;
		float: left;
	}
	.itemBar{
		width: calc(100% - 20px);
		padding: 0 10px;
		float: left;
	}
	.itemBar view:nth-of-type(1){
		float: left;
		width: 30%;
		color: #333333;
		font-weight: 500;
		text-align: left;
	}
	.itemBar view:nth-of-type(2){
		float: left;
		width: 70%;
		color: #999999;
		text-align: right;
	}
	.activeBg{
		background-color: #6190e8;
		color: #FFFFFF;
	}
	.activeBg .itemBar view:nth-of-type(1){
		color: #FFFFFF;
	}
	.activeBg .itemBar view:nth-of-type(2){
		color: #FFFFFF;
	}
	.searchBar{
		width: 100%;
		height: 45px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
		margin-bottom: 20px;
	}
	.searchBar input{
		width: 25%;
		padding: 5px 5px;
		display: inline-block;
		border: 1px solid #eee;
		border-radius: 20px;
		margin-left: 20px;
		font-size: 12px;
	}
	.searchBt{
		margin-left: 10px;
	}
</style>
