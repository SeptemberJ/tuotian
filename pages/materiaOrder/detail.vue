<template>
	<view class="container">
		<view class="lineData">
			<scroll-view scroll-x="true" scroll="scroll">
				<view class="columnTitWrap">
					<view class="columnTit">
						<!-- <text>序号</text>
						<text>物料代码</text>
						<text>名称</text>
						<text>规格</text>
						<text>单位</text>
						<text>实发数量</text>
						<text>校对标记</text> -->
						<text>校对标记</text>
						<text>规格</text>
						<text>实发数量</text>
						<text>物料代码</text>
						<text>名称</text>
						<text>单位</text>
					</view>
				</view>
				<view class="lineItem" v-for="(item, idx) in lineData" :key="idx">
					<text>{{ item.FSign}}</text>
					<text>{{ item.FModel}}</text>
					<text>{{ item.FAuxQty}}</text>
					<text>{{ item.FNumber }}</text>
					<text>{{ item.FName}}</text>
					<text>{{ item.FUnit}}</text>
				</view>
			</scroll-view>
		</view>
		<view style="clear: both;"></view>
		<button class="submitBt" :loading="loading" @click="submit">提 交</button>
		<scan-code></scan-code>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import scanCode from "@/components/scan-code/scan-code.vue"
	import { combineRequsetData } from '../../utils/util.js'
	import { mainUrl } from '../../utils/url.js'
	import {  mapState,  mapMutations } from 'vuex'
	
	export default {
		data() {
			return {
				FJson: [],
				lineData: [],
				x: 0,
				y: 200,
				loading: false,
			}
		},
		components: {
			uniPopup,
			scanCode
		},
		computed: {
			...mapState(['fuserno'])  
		},
		onLoad(options) {
			this.FJson = JSON.parse(options.data)
		},
		onShow () {
			var _this = this
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器  
			uni.$on('scancodedate',(data) => {  
				_this.broadcastBackInfo(data.code)
			})
			this.getLineData()
		},
		methods: {
			broadcastBackInfo (result) {
				var tmpData = '<FJson>' + JSON.stringify({items: this.FJson}) + '</FJson>'
					tmpData += '<FNumber>' + result + '</FNumber>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('sign', tmpData),
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
						console.log('request fail', err);
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						})
					}
				})
			},
			checkSign (item) {
				return item.FSign != 'Y'
			},
			submit () {
				let filterArr = this.lineData.filter(this.checkSign)
				if (filterArr.length > 0) {
					uni.showModal({
						content: '当前还存在未校验的单子!',
						showCancel: false
					})
					return false
				}
				this.loading = true
				var tmpData = '<FJson>' + JSON.stringify({items: this.FJson}) + '</FJson>'
					tmpData += '<fuserno>' + this.fuserno + '</fuserno>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('check_24', tmpData),
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
			getLineData () {
				var tmpData = '<FJson>' + JSON.stringify({items: this.FJson}) +'</FJson>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('Select_24', tmpData),
					header:{
						'Content-Type':'text/xml'
					},
					success: (res) => {
						console.log('Select_24', res.data)
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
		height: 30px;
		line-height: 30px;
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
		width: 840px;
		height: 30px;
		background: #C0C0C0;
	}
	.columnTit text{
		width: 200px;
		height: 30px;
		/* padding: 0 10px; */
		line-height: 30px;
		display: inline-block;
		font-weight: 400;
	}
	.columnTit text:nth-of-type(1){
		width: 80px;
	}
	.columnTit text:nth-of-type(3){
		width: 80px;
	}
	.columnTit text:nth-of-type(6){
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
		width: 200px;
		/* padding: 0 10px; */
		display: inline-block;
		font-weight: 400;
	}
	.lineItem text:nth-of-type(1){
		width: 80px;
	}
	.lineItem text:nth-of-type(3){
		width: 80px;
	}
	.lineItem text:nth-of-type(6){
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
		z-index: 999;
		color: #ffffff;
		background: #FF0000;
		border: 0;
		border-radius: 0;
	}
</style>
