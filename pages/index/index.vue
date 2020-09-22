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
	import { combineRequsetData } from '../../utils/util.js'
	import { mainUrl } from '../../utils/url.js'
	import { mapMutations } from 'vuex'
	export default {
		data() {
			return {
				loading: false,
				account: 'maxiaojuan',
				password: '123456',
			}
		},
		methods: {
			...mapMutations(['updateUserInfo']),
			login() {
				if (!this.account || !this.password) {
					uni.showModal({
						content: '请输入账户信息！',
						showCancel: false
					});
					return false
				}
				this.loading =  true
				var tmpData = '<fuserno>' + this.account + '</fuserno>'
					tmpData += '<fuserpsw>' + this.password + '</fuserpsw>'
				uni.request({
					url: mainUrl,
					method: 'POST',
					data: combineRequsetData('ja_login', tmpData),
					header:{
						'Content-Type':'text/xml;charset=utf-8'
					},
					success: (res) => {
						let Info = res.data[0]
						if (Info.code == 1) {
							this.updateUserInfo(this.account)
							uni.redirectTo({
								url: '../module/index?F1=' + Info.F1 + '&F2=' + Info.F2 + '&F3=' + Info.F3 + '&F4=' + Info.F4 + '&F5=' + Info.F5 + '&F6=' + Info.F6 + '&F7=' + Info.F7
							})
						} else {
							uni.showModal({
								content: '用户名或密码错误！',
								showCancel: false
							});
						}
					},
					fail: (err) => {
						console.log('request fail', err)
					},
					complete: () => {
						this.loading = false
					}
				})
				// uni.redirectTo({
				// 	url: '../module/index'
				// })
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
		width: 146px;
		height: 46px;
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
