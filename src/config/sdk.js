import config from './config';

export default {

	wxSignPackage: null,

	getWxSignPackage(callback) {
		const self = this;
		$.ajax({
			url: '/game/gameAjax/GetSignPackage',
			dataType: 'json',
			type: 'POST',
			async: false,
			data: {
				url: location.href.split('#')[0],
			},
			success(result) {
				const msg = result.data || result.msg;
				self.wxSignPackage = msg;
				if (callback) callback(msg);
			},
			error(xhr, errorType, error) {
                // self.error("返回结果: ", xhr, errorType);
			},
		});
	},

	configWx() {
		console.log('wxSignPackage:', this.wxSignPackage);
        // 这里有个坑。用//api.24haowan.com时，nonceStr是大写。用平台时是：noncestr。切换时记得切换
		if (!this.wxSignPackage.appId || !this.wxSignPackage.timestamp
        || !this.wxSignPackage.nonceStr || !this.wxSignPackage.signature) {
			return false;
		}
            /* 微信接口 */
		wx.config({
			debug: false,
			appId: this.wxSignPackage.appId,
			timestamp: this.wxSignPackage.timestamp,
			nonceStr: this.wxSignPackage.nonceStr,
			signature: this.wxSignPackage.signature,
			jsApiList: [
                    // 所有要调用的 API 都要加到这个列表中
				'onMenuShareTimeline', 'onMenuShareAppMessage', 'hideMenuItems',
                    // 录音相关
				'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice',
			],
		});

		return this;
	},


	getUserOpenid(cb) {
		$.ajax({
			url: '/game/v1/userViewParams',
			async: false,
			dataType: 'json',
			type: 'POST',
			data: {
				game_id: location.href.match(/game_id\/\d+/) ? location.href.match(/game_id\/\d+/)[0].split('/')[1] : -1,
				isTest: 0,
				key: '',
			},
			success(result) {
				const data = result.data;
				if (result.code == 0) {
					cb(data.user_name);
				}
			},
			error(err) {
				console.log(err);
			},
		});
	},
	// 设置微信分享，通过传opts参数支持二次设置分享文案
	setWxShare: (opts, callback) => {
		const shareInfo = config.share();
		opts = opts || {};

		let link = location.href.match(/.*game_id\/\d+/) && location.href.match(/.*game_id\/\d+/)[0]
		// 配置分享信息
		wx.ready(function () {
			// 分享朋友圈
			wx.onMenuShareTimeline({
				title: opts.title || '广州租房小利器来了！', // 分享标题
				link: opts.link || link, // 分享链接
				imgUrl: opts.imgUrl || 'http://24haowan-cdn.shanyougame.com/dingzhi/subway/share.png', // 分享图标
				success: () => {
					if (callback) callback();
				},
				cancel: () => { }
			});
			// 分享朋友
			wx.onMenuShareAppMessage({
				title: opts.title ||'广州租房小利器来了！', // 分享标题
				desc: opts.desc || '广州租房小利器来了！快来一键查询广州地铁站点附近租金', // 分享描述
				link: opts.link || link, // 分享链接
				imgUrl: opts.imgUrl || 'http://24haowan-cdn.shanyougame.com/dingzhi/subway/share.png', // 分享图标
				type: 'link', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: () => {
					if (callback) callback();
				},
				cancel: () => { }
			});
		});
	},
	// 南方app分享设置
	setAppShare: (opts, callback) => {
		opts = opts || {};
		let link = location.href.match(/.*game_id\/\d+/) && location.href.match(/.*game_id\/\d+/)[0]
		// app自定义分享
		let  shareUrl = link;
        let  shareIcon = 'https://24haowan-cdn.shanyougame.com/dingzhi/subway/share.png';
        let  shareTitle = opts.title || '广州租房小利器来了！';
        let  shareDesc = opts.desc || '广州租房小利器来了！快来一键查询广州地铁站点附近租金';

        window.getShareUrl=function() {
            return shareUrl;
        }
        window.getShareDesc=function() {
            return shareDesc;
        }
        window.getShareIcon=function() {
            return shareIcon;
        }
        window.getShareTitle=function() {
            return shareTitle;
        }
        window.getShareObj=function() {
            window.activity.getShareUrl(shareUrl);
            window.activity.getShareDesc(shareDesc);
            window.activity.getShareTitle(shareTitle);
            window.activity.getShareIcon(shareIcon);
        }
	},
	resetWxShare: (opts, callback) => {
		opts = opts || {};
		let link = location.href.match(/.*game_id\/\d+/) && location.href.match(/.*game_id\/\d+/)[0]
		// 分享朋友圈
		wx.onMenuShareTimeline({
			title: opts.title || '广州租房小利器来了！', // 分享标题
			link: opts.link || link, // 分享链接
			imgUrl: opts.imgUrl || 'http://24haowan-cdn.shanyougame.com/dingzhi/subway/share.png', // 分享图标
			success: () => {
				if (callback) callback();
			},
			cancel: () => { }
		});
		// 分享朋友
		wx.onMenuShareAppMessage({
			title: opts.title ||'广州租房小利器来了！', // 分享标题
			desc: opts.desc || '广州租房小利器来了！快来一键查询广州地铁站点附近租金', // 分享描述
			link: opts.link || link, // 分享链接
			imgUrl: opts.imgUrl || 'http://24haowan-cdn.shanyougame.com/dingzhi/subway/share.png', // 分享图标
			type: 'link', // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			success: () => {
				if (callback) callback();
			},
			cancel: () => { }
		});

		// app自定义分享
		let  shareUrl = link;
        let  shareIcon = 'https://24haowan-cdn.shanyougame.com/dingzhi/subway/share.png';
        let  shareTitle = opts.title || '广州租房小利器来了！';
        let  shareDesc = opts.desc || '广州租房小利器来了！快来一键查询广州地铁站点附近租金';

        window.getShareUrl=function() {
            return shareUrl;
        }
        window.getShareDesc=function() {
            return shareDesc;
        }
        window.getShareIcon=function() {
            return shareIcon;
        }
        window.getShareTitle=function() {
            return shareTitle;
        }
        window.getShareObj=function() {
            window.activity.getShareUrl(shareUrl);
            window.activity.getShareDesc(shareDesc);
            window.activity.getShareTitle(shareTitle);
            window.activity.getShareIcon(shareIcon);
        }
	},
	getData: (callback) => {
		$.ajax({
			method: 'GET',
			async: false,
			url: 'http://24haowan-cdn.shanyougame.com/dingzhi/fangzu/subwayData-edit.json',
            dataType: 'json',
			success: (res) => {
				if(callback) callback(res);
				// console.log('sdk', res);
			},
			error: (err) => {
				console.log('err', err)
			}
		})
	}
};
