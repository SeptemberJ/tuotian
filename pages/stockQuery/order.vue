<template>
	<view class="container">
		<view class="lineData">
			<scroll-view scroll-x="true" scroll="scroll">
				<view class="columnTitWrap">
					<view class="columnTit">
						<text>仓库</text>
						<text>仓位</text>
						<text>库存</text>
						<text>规格</text>
						<text>物料名称</text>
						<text>物料代码</text>
						<text>单位</text>
					</view>
				</view>
				<view class="lineItem" v-for="(item, idx) in lineData" :key="idx">
					<text>{{ item.FStockName}}</text>
					<text>{{ item.FSP}}</text>
					<text>{{ item.FQty}}</text>
					<text>{{ item.FModel }}</text>
					<text>{{ item.FName}}</text>
					<text>{{ item.FNumber}}</text>
					<text>{{ item.FUnit}}</text>
				</view>
			</scroll-view>
		</view>
		<view style="clear: both;"></view>
		<scan-code></scan-code>
	</view>
</template>

<script>
	import scanCode from "@/components/scan-code/scan-code.vue"
	import { combineRequsetData } from '../../utils/util.js'
	import uniLoading from '@/components/loading/loading.vue'
	import { mainUrl } from '../../utils/url.js'
	export default {
		components: {
			uniLoading,
			scanCode
		},
		data() {
			return {
				lineData: [],
				loading: false
			}
		},
		onShow () {
			var _this = this
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器
			uni.$on('scancodedate',(data) => {
				_this.broadcastBackInfo(data.code)
			})
		},
		onPullDownRefresh() {
		},
		methods: {
			broadcastBackInfo (result) {
				this.getList(result)
			},
			getList (result) {
				var tmpData = "<FSQL>select * from Z_ICInventory where FNumber='" + result +"'</FSQL>"
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('JA_LIST', tmpData),
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
	.lineData{
		position: relative;
		/* z-index: 998; */
	}
	.columnTitWrap{
		background: #C0C0C0;
	}
	.columnTit{
		width: 840px;
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
	.columnTit text:nth-of-type(2){
		width: 80px;
	}
	.columnTit text:nth-of-type(3){
		width: 80px;
	}
	.columnTit text:nth-of-type(7){
		width: 80px;
	}
	.lineItem{
		min-width: 840px;
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
	.lineItem text:nth-of-type(2){
		width: 80px;
	}
	.lineItem text:nth-of-type(3){
		width: 80px;
	}
	.lineItem text:nth-of-type(7){
		width: 80px;
	}
</style>