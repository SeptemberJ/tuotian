<script>
export default {
};
</script>

<style>
text {
	font-size: 14px;
}
uni-radio .uni-radio-input{
	width: 15px !important;
	height: 15px !important;
}
.colorRed{
	color: #FF0000;
}
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
</style>
