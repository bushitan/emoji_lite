//index.js
//获取应用实例
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');
var APP = getApp()
var GP

var LAST_DAY = "last_day"
var LAST_CLICK_NUM = "last_click_num"
var LAST_TIME_STAMP = "last_time_stamp"
var IS_SHOW_INIT = "is_show_init"
Page({
    data: {
        isTodayFirstLogin:false,
        isVip:false,
        clickNum:0,
        coverList: [
            { image_url: 'http://img.12xiong.top/emoji_default.gif' },
            // { image_url: 'http://qiniu.308308.com/hx_245_2018_01_18_08_47_14.jpg' },
            // { image_url: 'http://qiniu.308308.com/hx_245_2018_01_18_08_47_14.jpg' },
            // { image_url: 'http://qiniu.308308.com/hx_245_2018_01_18_08_47_14.jpg' },
            // { image_url: 'http://qiniu.308308.com/hx_245_2018_01_18_08_47_14.jpg' },
        ],
        isShowPayBtn:false,
    },
    // 点击表情
    clickEmoji(e){
        if (GP.data.isVip == true){
            var image_url = e.currentTarget.dataset.image_url
            wx.previewImage({
                urls: [image_url],
            })
            return 
        } else if (GP.data.clickNum <= 0 ){
            wx.showModal({
                title: '温馨提示',
                content: '今日的浏览次数已经用完，转发可获得次数',
                showCancel:"false",
            })
            return 
        } else {
            var image_url = e.currentTarget.dataset.image_url
            wx.previewImage({
                urls: [image_url],
            })

            wx.setStorageSync(LAST_CLICK_NUM, GP.data.clickNum - 1)
            GP.setData({
                clickNum: GP.data.clickNum - 1
            })
        }

    },

    // 点击支付按钮
    clickBoss() {
        wx.navigateTo({
            url: '../pay/pay',
        })
    },

    // 微信支付
    wxPay(object) {
        wx.requestPayment({
            'timeStamp': object.timeStamp,
            'nonceStr': object.nonceStr,
            'package': object.package,
            'signType': 'MD5',
            'paySign': object.paySign,
            'success': function (res) {
                console.log(res)
                GP.paySuccess()
            },
            'fail': function (res) {
                console.log(res)
                GP.payFail()
            }
        })
    },



    // 分享成功
    shareSucess() {
        var new_clic = 2
        wx.setStorageSync(LAST_CLICK_NUM, GP.data.clickNum + new_clic)
        GP.setData({
            clickNum: GP.data.clickNum + new_clic
        })

        if (GP.data.isVip == true)
            wx.showModal({
                title: '谢谢老板',
                content: '会员' + GP.data.uuid + '，感谢您的分享，祝您狗年福旺财旺、红包抢到手软！^_^！',
                showCancel: "false",
                confirmText: "知道了",
            })
        else 
            wx.showModal({
                title: '获得' + 2 + "次",
                content: '用户'+GP.data.uuid+'，感谢您的分享，转发的次数仅限当天可用噢！',
                showCancel: "false",
                confirmText: "知道了",
            })

    },




    onShareAppMessage(){
        return {
            title: '讨红包，一定要谢谢老板喔！',
            path: '/pages/index/index',
            success: function (res) {
                GP.shareSucess()
            },
        }
    },



    onShow(){

        var _is_show_init = wx.getStorageSync(IS_SHOW_INIT)
        if (_is_show_init == true){
            APP.login()
            wx.setStorageSync(IS_SHOW_INIT,false)
        }
    },
    onLoad: function (options) {
        GP = this
        if (APP.globalData.isLogin == true)
            GP.onInit(options)
        else
            APP.login(options)
        API.Request({
            'url': API.IMAGE_GET_LIST,
            success: function (res) {
                GP.setData({
                    coverList: res.data.cover_list
                })
            }
        })
    },

    isResetClickNum(day_num){
        var _current_timestamp = (new Date()).valueOf();
        var _last_timestamp = wx.getStorageSync(LAST_TIME_STAMP)

        // 第一次进入
        if (_last_timestamp == "") {
            wx.setStorageSync(LAST_TIME_STAMP, _current_timestamp)
            wx.setStorageSync(LAST_CLICK_NUM, 5)
            GP.setData({
                clickNum:5,
            })
            return 
        }
        if (_current_timestamp - _last_timestamp > 43200000 ){ //12个小时
            wx.setStorageSync(LAST_TIME_STAMP, _current_timestamp)
            wx.setStorageSync(LAST_CLICK_NUM, 5)
            GP.setData({
                clickNum: 5,
            })
        }
        else{
            var _click_num = wx.getStorageSync(LAST_CLICK_NUM)
            GP.setData({
                clickNum: _click_num,
            })
        }
    },

    onInit(options) {
        console.log(options)
        GP.setData({
            isVip: options.is_vip,
            uuid: options.uuid,
            isShowPayBtn: options.show_pay,
            vipDeadline:  options.vip_deadline
            // day_num: options.day_num,
        })
        
        GP.isResetClickNum()
        // 获取最新图片

        
    },

})
