
<template>  
    <view class="content"></view>  
</template>  

<script>  
var main,receiver,filter;    
var _codeQueryTag = false;    
export default {  
    data() {  
        return {  
            scanCode: ''  
        }  
    },  
    created: function (option) {  
        this.initScan()  
        this.startScan();    
    },    
    onHide:function(){    
        this.stopScan();    
    },  
    destroyed:function(){    
        /*页面退出时一定要卸载监听,否则下次进来时会重复，造成扫一次出2个以上的结果*/    
        this.stopScan();    
    },    
    methods: {  
        initScan() {
			console.log('init start---')
            let _this = this;  
            main = plus.android.runtimeMainActivity();//获取activity  
			console.log('main---')
            var IntentFilter = plus.android.importClass('android.content.IntentFilter');   
            filter = new IntentFilter();    
            filter.addAction("android.intent.action.SCANRESULT"); // 换你的广播动作  
            receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver',{  
            onReceive : function(context, intent) {  
				plus.android.importClass(intent);
				let code = intent.getStringExtra("value");
                _this.queryCode(code);
            }});    
        },    
        startScan(){    
            main.registerReceiver(receiver,filter);  
        },    
        stopScan(){  
            main.unregisterReceiver(receiver);    
        },    
        queryCode: function(code){  
            //防重复  
            if(_codeQueryTag)return false;    
            _codeQueryTag = true;    
            setTimeout(function(){    
                _codeQueryTag = false;    
            },150);  
            var id = code  
            console.log('id:', id)  
            uni.$emit('scancodedate',{code:id})  
        }  
    }  
}  
</script>  

<style>  
    page {  
        background-color: #efeff4;  
    }  
    .content {  
        text-align: center;  
    }  
</style>