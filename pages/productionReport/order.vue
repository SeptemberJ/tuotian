<template>
	<view class="container">
		<view class="columnItem">
			<text>工单日期</text>
			<text>{{ date }}</text>
		</view>
		<view class="columnItem">
			<text>工单号</text>
			<text>{{ orderNo }}</text>
		</view>
		<view class="columnItem">
			<text>产品名称</text>
			<text>{{ production }}</text>
		</view>
		<view class="columnItem">
			<text>规格型号</text>
			<text>{{ model }}</text>
		</view>
		<view class="columnItem">
			<text>单位</text>
			<text>{{ unit }}</text>
		</view>
		<view class="columnItem">
			<text>计划生产数量</text>
			<text>{{ plantNumber }}</text>
		</view>
		<view class="columnItem">
			<text>实作数量</text>
			<text><input class="uni-input" type="number" v-model="number" placeholder="请输入数量"/></text>
		</view>
		<button class="loginBt" :loading="loading" @click="submit">提 交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				date: '2020-06-01',
				orderNo: 'WORK00001',
				production: '电脑',
				model: 'MODEL123456',
				unit: '件',
				plantNumber: 10000,
				number: ''
			}
		},
		onLoad(options) {
			let order = JSON.parse(options.order)
		},
		methods: {
			submit () {
				if (this.number == '') {
					uni.showModal({
						content: '请输入实作数量！',
						showCancel: false
					});
				}
			}
		}
	}
</script>

<style>
	.container {
		padding:0 10px;
	}
	.columnItem{
		width: 100%;
		height: 35px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.columnItem text:last-of-type{
		color: #999999;
	}
	.columnItem input{
		text-align: right;
		border-bottom: 1px solid red;
		color: red;
		font-weight: bold;
	}
	.uni-input-placeholder{
		font-weight: normal;
		color: red;
	}
	.loginBt{
		width: 80%;
		text-align: center;
		border: 1px solid #ffffff;
		border-radius: 25px;
		background: #1196DB;
		color: #ffffff;
		margin: 40px auto 10px auto;
	}
</style>
