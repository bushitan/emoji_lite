//app.js
var API = require('utils/api.js');
var Key = require('utils/key.js');
var GP
App({

    globalData: {
        pagePrivate: null,
        pagePublic: null,
        windowWidth: null,
        windowHeight: null,
        isLogin: false,
    }, 

    onLaunch: function () {

        var that = this
        GP = this
        var _pixelRatio, _windowWidth, _windowHeight
        wx.getSystemInfo({
            success: function (res) {
                GP.globalData.windowWidth = res.windowWidth
                GP.globalData.windowHeight = res.windowHeight
                console.log(res.windowWidth, res.windowHeight, res.pixelRatio)
            }
        })

        // GP.login()
    },
    login: function (options) {
        console.log("session:", wx.getStorageSync('session'))
        wx.login
            ({
                success: function (res) {

                    var _session = wx.getStorageSync('session')
                    if (!_session) //检查session,不存在，为false
                        _session = "false"
                    console.log(res.code, _session)
                    GP.loginRequest(res.code, _session, options )
                }
            });
    },

    loginRequest(js_code, session, options){

        wx.showLoading({title: '登陆中',})
        wx.request
            ({
                url: API.USER_LOGIN,

                method: "GET",
                // method: "POST",
                // header: {
                //     'content-type': 'application/x-www-form-urlencoded'
                // },
                data: {
                    js_code: js_code,
                    session: session,
                },
                success: function (res) {
                    console.log(res)
                    GP.successBack(res)
                    wx.showToast({
                        title:"登陆成功",
                    })
                },
                fail: function (res) {
                    console.log(res)
                    GP.failBack(res)
                },
                complete:function(res){
                    console.log(res)
                    wx.hideLoading()
                },
            })
    },

    successBack(res){
        wx.setStorageSync('session', res.data.session)
        //Todo 初始化页面、目录
        // var options = res.data.user_dict
        getCurrentPages()[0].onInit(res.data.user_dict)
        GP.globalData.isLogin = true

    },

    failBack(){
        wx.showModal({
            title: '网络连接失败，是否重新登陆？',
            content: '请确认网络是否正常',
            confirmText: "重新登陆",
            success: function (res) {
                if (res.confirm) {
                    GP.login()
                }
            }
        })
    },
})