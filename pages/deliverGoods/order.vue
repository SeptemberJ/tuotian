<template>
	<view class="container">
		<view class="searchBar">
			<input class="uni-input" v-model="FCust" placeholder="客户名称" />
			<input class="uni-input" v-model="FBillNo" placeholder="发货单号" />
			<button class="searchBt" type="primary" size="mini" @click="search">搜索</button>
		</view>
		<view v-if="loading"><uni-loading :height1="100" :loadModal="loading"></uni-loading></view>
		<view v-if="!loading && orderList.length == 0" style="text-align: center;background-color: #f5f5f5;padding-top: 40px;">
			<image src="../../static/wushuju.png" style="width: 128px;height: 84px;margin: 0 auto 20px auto;display: block;"></image>
			<text style="color: #666;">暂无数据</text>
		</view>
		<view v-if="!loading && orderList.length > 0" class="dbitem" v-for="order in orderList" @click="toDetail(order)">
			<view class="itemBar" style="padding-left: 0;border-left: 4px solid #6190e8;margin-bottom: 5px;">
				<view><text style="padding-left: 6px;">客户名称：</text></view>
				<view>{{ order.FCust }}</view>
			</view>
			<view class="itemBar">
				<view>发货单号：</view>
				<view>{{ order.FBillNo }}</view>
			</view>
			<view class="itemBar">
				<view>发货日期：</view>
				<view>{{ order.FDate }}</view>
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
				FCust: '',
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
			toDetail (order) {
				uni.navigateTo({
				    url: './detail?orderInfo=' + JSON.stringify(order)
				});
			},
			getList () {
				var tmpData = "<FSQL><![CDATA[select * from z_SEOutStock where FCust like '%" + this.FCust + "%' and FBillNo like '%" + this.FBillNo + "%']]></FSQL>"
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('JA_LIST', tmpData),
					header:{
						'Content-Type':'text/xml; charset=utf-8'
					},
					success: (res) => {
						this.orderList = res.data
					},
					fail: (err) => {
						console.log('request fail', err)
						// uni.showModal({
						// 	content: err.errMsg,
						// 	showCancel: false
						// })
					},
					complete: () => {
						this.loading = false
						uni.stopPullDownRefresh()
					}
				})
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
		width: 25%;
		color: #333333;
		font-weight: 500;
		text-align: left;
	}
	.itemBar view:nth-of-type(2){
		float: left;
		width: 75%;
		color: #999999;
		text-align: right;
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
		width: 30%;
		padding: 5px 5px;
		display: inline-block;
		border: 1px solid #eee;
		border-radius: 20px;
		margin-left: 20px;
		font-size: 12px;
	}
	.searchBt{
		margin-left: 20px;
	}
</style>
