<template>
	<view class="container">
		<view v-if="loading"><uni-loading :height1="100" :loadModal="loading"></uni-loading></view>
		<view v-if="!loading && orderList.length == 0" style="text-align: center;background-color: #f5f5f5;padding-top: 40px;">
			<image src="../../static/wushuju.png" style="width: 128px;height: 84px;margin: 0 auto 20px auto;display: block;"></image>
			<text style="color: #666;">暂无数据</text>
		</view>
		<view v-if="!loading && orderList.length > 0" class="dbitem" v-for="order in orderList" @click="toDetail(order)">
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
			<view class="itemBar">
				<view>物料代码：</view>
				<view>{{ order.FNumber}}</view>
			</view>
			<view class="itemBar">
				<view>物料名称：</view>
				<view>{{ order.FName}}</view>
			</view>
			<view class="itemBar">
				<view>规格型号：</view>
				<view>{{ order.FModel}}</view>
			</view>
			<view class="itemBar">
				<view>单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位：</view>
				<view>{{ order.FUnit}}</view>
			</view>
			<view class="itemBar">
				<view>收料数量：</view>
				<view>{{ order.FAuxQty}}</view>
			</view>
			<view class="itemBar">
				<view>批&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</view>
				<view>{{ order.FBatchNo}}</view>
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
				FInterID: null,
				orderList: [],
				loading: true
			}
		},
		onLoad(options) {
			this.FInterID = options.FInterID
		},
		onShow () {
			this.getList()
		},
		onPullDownRefresh() {
			this.loading = true
			this.orderList = []
			this.getList()
		},
		methods: {
			toDetail (order) {
				uni.navigateTo({
				    url: './detail?order=' + JSON.stringify(order)
				});
			},
			getList () {
				var tmpData = '<FSQL>select * from z_POInStock where FInterID=' + this.FInterID + '</FSQL>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('JA_LIST', tmpData),
					header:{
						'Content-Type':'text/xml'
					},
					success: (res) => {
						console.log(res.data)
						this.orderList = res.data
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
</style>
