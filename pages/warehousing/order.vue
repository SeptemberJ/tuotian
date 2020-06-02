<template>
	<view class="container">
		<view class="searchBar">
			<input class="uni-input" v-model="FSupply" placeholder="输入供应商名称" />
			<input class="uni-input" v-model="FBillNo" placeholder="输入收料单号" />
			<button type="primary" size="mini" @click="search">搜索</button>
		</view>
		<view v-if="loading"><uni-loading :height1="100" :loadModal="loading"></uni-loading></view>
		<view v-if="!loading && orderList.length == 0" style="text-align: center;background-color: #f5f5f5;padding-top: 40px;">
			<image src="../../static/wushuju.png" style="width: 128px;height: 84px;margin: 0 auto 20px auto;display: block;"></image>
			<text style="color: #666;">暂无数据</text>
		</view>
		<view v-if="!loading && orderList.length > 0" class="dbitem" v-for="order in orderList" @click="toList(order)">
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
				orderList: [],
				loading: true,
				FSupply: '',
				FBillNo: ''
			}
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
			search () {
				this.getList()
			},
			toList (order) {
				uni.navigateTo({
				    url: './list?FInterID=' + order.FInterID
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
						console.log('res.data', res.data)
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
	.searchBar{
		width: 100%;
		height: 45px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #fff;
		margin-bottom: 20px;
	}
	.searchBar input{
		width: 100px;
		padding: 5px 5px;
		display: inline-block;
		border: 1px solid #eee;
		border-radius: 20px;
		margin-left: 20px;
		font-size: 12px;
	}
</style>
