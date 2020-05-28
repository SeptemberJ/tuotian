<template>
	<view class="container">
		<view class="logoBar">
			<image src="../../images/logo.png"></image>
			<text>拓天PDA</text>
		</view>
		<view class="loginBox">
			<view class="inputItem">
				<image src="../../images/email.png"></image>
				<input v-model="account" placeholder="账号" />
			</view>
			<view class="line"></view>
			<view class="inputItem">
				<image src="../../images/password.png"></image>
				<input type="password" v-model="password" placeholder="密码" />
			</view>
		</view>
		<button class="loginBt" :loading="loading" @click="login">登 陆</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				account: '',
				password: '',
			}
		},
		methods: {
			login() {
				uni.redirectTo({
					url: '../module/index'
				})
			}
		}
	}
</script>

<style>
	.container {
		width: 100%;
		height: 100vh;
		background-color: rgb(17,150,219);
	}
	.logoBar{
		width: 100%;
		height: 200px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.logoBar image{
		width: 100px;
		height: 100px;
		display: block;
		margin: 0 auto;
	}
	.logoBar text{
		color: #ffffff;
		margin-top: 20px;
	}
	.loginBox{
		width: 90%;
		height: 100px;
		background-color: #ffffff;
		border-radius: 10px;
		margin: 20px auto;
		overflow: hidden;
	}
	.inputItem{
		width: 100%;
		height: 50px;
		display: flex;
		align-items: center;
	}
	.inputItem image{
		width: 35px;
		height: 35px;
		margin: 0 10px;
	}
	.inputItem uni-input{
		width: calc(100% - 50px - 10px - 10px);
	}
	.line{
		width: 90%;
		height: 1px;
		background-color: #1196DB;
		margin: 0 auto;
	}
	.loginBt{
		width: 110px;
		height: 40px;
		line-height: 38px;
		text-align: center;
		border: 1px solid #ffffff;
		border-radius: 25px;
		background: #1196DB;
		color: #ffffff;
		margin: 40px auto 10px auto;
	}
</style>
