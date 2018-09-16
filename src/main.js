// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import sdk from './config/sdk';
import {isWeixinBrowser, requestAssets} from './config/util';


Vue.config.productionTip = false;

// 如果想把资源放到项目之外，则加载此方法。
Vue.prototype.requestAssets = requestAssets;
Vue.prototype.ra = requestAssets


if (isWeixinBrowser()) {
    // 微信环境下配置微信权限 需要上到平台才能正常调试微信接口
    // sdk.getWxSignPackage(sdk.configWx.bind(sdk));
    // sdk.setWxShare();
}
sdk.setAppShare();
sdk.getData(res => {
    window.stationData = res;
});

// hwlever 文档详见 https://github.com/HelloWorld20/hwLever
// hwlever.config({
//     cdn: '//24haowan-cdn.shanyougame.com/public/js/vconsole.min.js',
//     entry: 'EasterEgg',
//     vueObj: Vue,
//     debug: process.env.NODE_ENV === 'development',
//     ravenId: '//56d67d26f9854c21a1f8e7b83854fecd@sentry.24haowan.com/12',
//     extraConf: {
//         tags: {
//             from: 'subway_104'
//         }
//     },
//     type: ['shake']
// });

$(document).bind('contextmenu', function (e) {
    e.preventDefault();
})
// 为了在微信内打开时下拉不出现显示网页信息的背景，这样整个页面都没有对滚动的响应
if (isWeixinBrowser()) {
    document.body.ontouchmove = function (e) {
        e.preventDefault();
    }
}

if (process.env.NODE_ENV == 'development') {
    var local = {
        app_uid: null,
        best_score: 0,
        first_play: 1,
        form_info: 0,
        gift_flag: 0,
        headimgurl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLxRQE9mricStrvKSiaxgLhQcEdgZpnzy5jqia2FQMGQZkWlqNmwxzYzvrkrn6zcgibk7D4ro9LTZRDQA/0",
        limit_times: "-1",
        openid: "owh4vvxTa80kEIYGErZvMb9Xw1do",
        play_times: 0,
        rank: 0,
        share_times: 0,
        user_id: "123409",
        user_name: "Leon.W",
    }

    window.game_id = location.href.match(/game_id\/\d+/) ? location.href.match(/game_id\/\d+/)[0].split('/')[1] : -1;
    window.openid = local.openid;
    window.user_name = local.user_name;
    window.headimgurl = local.headimgurl;
    window.formInfo = local.form_info
}

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
        App,
    },
});
