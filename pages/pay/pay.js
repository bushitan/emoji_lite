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
        clickNum: 0,
        isPayIng:false,

    },

    // 点击支付按钮
    clickBoss() {
        GP.setData({
            isPayIng:true
        })
        wx.showToast({
            title: '订单提交中',
            icon: 'loading',
            // duration: 2000
        })
        API.Request({
            'url': API.WX_CREATE,
            success: function (res) {
                var wx_dict = res.data.wx_dict
                GP.wxPay(wx_dict) //微信支付，调取支付接口
            },
            complete:function(){
                // wx.hideLoading()
            }
        })
    },

    // 微信支付
    wxPay(object) {
        wx.showLoading({
            title: '支付中',
        })
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
                GP.payFail(res)
            },
        })
    },
    // 支付失败
    payFail(res){
        // APP.login()
        GP.setData({
            isPayIng: false
        })
        wx.showModal({
            title: '支付失败',
            content:'您取消了支付,请重试，若已被扣钱，请联系客服',
            showCancel: "false",
            confirmText: "知道了",
            success: function () {
                // wx.navigateBack({})
            }
        })
        wx.hideLoading()

    },
    // 支付成功
    paySuccess(){
        // APP.login()
        wx.setStorageSync(IS_SHOW_INIT, true)
        GP.setData({
            isPayIng: false
        })
        wx.hideLoading()
        wx.showModal({
            title: '支付成功',
            showCancel: "false",
            confirmText: "返回首页",
            success:function(){
                wx.navigateBack({})
            }
        })


    },




    onLoad: function (options) {
        GP = this
        // if (APP.globalData.isLogin == true)
        //     GP.onInit(options)
        // else
        //     APP.login(options)
    },

    onInit(options) {
        wx.navigateBack({
            
        })
        // wx.switchTab({
        //     url: '../index/index',
        // })
    },


    // 分享成功
    shareSucess() {
        var new_clic = 2
        wx.setStorageSync(LAST_CLICK_NUM, GP.data.clickNum + new_clic)
        GP.setData({
            clickNum: GP.data.clickNum + new_clic
        })
        wx.showModal({
            title: '获得' + 2 + "次",
            content: '转发的次数仅限当天可用噢！',
            showCancel: "false",
            confirmText: "知道了",
        })

    },


    onShareAppMessage() {
        return {
            title: '讨红包，一定要谢谢老板喔！',
            path: '/pages/index/index',
            success: function (res) {
                GP.shareSucess()
            },
        }
    },







})
