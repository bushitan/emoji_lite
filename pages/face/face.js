// pages/face/face.js

var API = require('../../utils/api.js');
var Base64 = require('../../utils/image_base.js');
var APP = getApp()

var GP

var templateList = [
    {
        "base64": Base64.qiaofeng,
        "rectangle": "86,151,89,89",
        "width": 500,
        "height": 311,
        "cache":"",
        "name":'乔峰',
    },
    {
        "base64": Base64.linghc,
        "rectangle": "67,230,55,55",
        "width": 500,
        "height": 333,
        "cache": "",
        "name": '令狐冲',
    }, 
    {
        "base64": Base64.dongfbb,
        "rectangle": "62,181,98,98",
        "width": 500,
        "height": 265,
        "cache": "",
        "name": '东方不败',
    },
    {
        "base64": Base64.yangg,
        "rectangle": "68,97,106,106",
        "width": 500,
        "height": 334,
        "cache": "",
        "name": '杨过',
    },
    {
        "base64": Base64.xiaoln,
        "rectangle": "112,257,99,99",
        "width": 500,
        "height": 334,
        "cache": "",
        "name": '小龙女',
    },
    {
        "base64": Base64.duany,
        "rectangle": "216,137,153,153",
        "width": 500,
        "height": 615,
        "cache": "",
        "name": '段誉',

    },
    {
        "base64": Base64.wangyy,
        "rectangle": "180,158,148,148",
        "width": 500,
        "height": 675,
        "cache": "",
        "name": '王语嫣',
    },
    {
        "base64": Base64.xuz,
        "rectangle": "105,118,123,123",
        "width": 500,
        "height": 383,
        "cache": "",
        "name": '虚竹',
    },
]

Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: templateList,
        mixResult:"../../images/click.jpg",
        uploadLock:false, //上传锁
        chooseImage:"", //当前选择的头像
        templateIndex: 0, //模板位置
        makeLandmark: "", //待合成图片
        width:0,
        height:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        APP.login(options)
        // var obj = wx.getStorageSync("base")
        // console.log(obj.result)
        // GP.setData({
        //     makeLandmark: "data:image/jpg;base64," + obj.result
        // })
        // wx.previewImage({
        //     urls: [obj.result],
        // })
    },
    onInit(){},

    chooseImage(){
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                console.log(res.tempFilePaths[0])
                // var imagePath = res.tempFilePaths[0]
                GP.setData({
                    chooseImage: res.tempFilePaths[0],
                    list: [
                        {
                            "base64": Base64.qiaofeng,
                            "rectangle": "86,151,89,89",
                            "width": 500,
                            "height": 311,
                            "cache": "",
                            "name": '乔峰',
                        },
                        {
                            "base64": Base64.linghc,
                            "rectangle": "67,230,55,55",
                            "width": 500,
                            "height": 333,
                            "cache": "",
                            "name": '令狐冲',
                        },
                        {
                            "base64": Base64.dongfbb,
                            "rectangle": "62,181,98,98",
                            "width": 500,
                            "height": 265,
                            "cache": "",
                            "name": '东方不败',
                        },
                        {
                            "base64": Base64.yangg,
                            "rectangle": "68,97,106,106",
                            "width": 500,
                            "height": 334,
                            "cache": "",
                            "name": '杨过',
                        },
                        {
                            "base64": Base64.xiaoln,
                            "rectangle": "112,257,99,99",
                            "width": 500,
                            "height": 334,
                            "cache": "",
                            "name": '小龙女',
                        },
                        {
                            "base64": Base64.duany,
                            "rectangle": "216,137,153,153",
                            "width": 500,
                            "height": 615,
                            "cache": "",
                            "name": '段誉',

                        },
                        {
                            "base64": Base64.wangyy,
                            "rectangle": "180,158,148,148",
                            "width": 500,
                            "height": 675,
                            "cache": "",
                            "name": '王语嫣',
                        },
                        {
                            "base64": Base64.xuz,
                            "rectangle": "105,118,123,123",
                            "width": 500,
                            "height": 383,
                            "cache": "",
                            "name": '虚竹',
                        },
                    ],//初始化列表
                })
                GP.faceMix(res.tempFilePaths[0], GP.data.list[GP.data.templateIndex])

            },
        })
    },

    faceMix(imagePath,templateImage){
        wx.showLoading({
            title: '合成中...',
        })
        GP.setData({
            uploadFile: true,
        })
        wx.uploadFile({
            url: 'https://api-cn.faceplusplus.com/imagepp/v1/mergeface',
            // url:"https://api-cn.faceplusplus.com/humanbodypp/v1/skeleton",
            filePath: imagePath,
            name: 'merge_file',
            header: {
                'content-type': 'multipart/form-data'
            },
            formData: {
                // "api_key": "i4cuDvu1W7gPRDJyUMdGkwTLlnawyqaj",
                // "api_secret": "S1W4Dcdv8f93KRe8SnqXpMNWd89Rr7Q9",
                "api_key": "y-IDakOn3S3kW0vPX2kzg8sLrZtNLyb5",
                "api_secret": "dSNBrCEpLcEA0gemfPHetg8G26UEIBkh",
                "template_base64": templateImage.base64,
                "template_rectangle": templateImage.rectangle,
            },
            success: (res) => {
                var obj = JSON.parse(res.data)
                // console.log(obj)
                // wx.setStorageSync("base", obj)
                var mixImage = "data:image/jpg;base64," + obj.result
                var tempList =GP.data.list
                tempList[GP.data.templateIndex].cache = mixImage
                GP.setData({
                    mixResult: mixImage,
                    list: tempList,
                })
            },
            fail: (res) => {
                console.log(res)
                wx.showModal({
                    title: '网络连接失败，请重试',
                    showCancel: false,
                })
            },
            complete: (res) => {
                wx.hideLoading()
                GP.setData({
                    uploadFile:false,
                })
            },
        })
    },

    //切换模板
    clickTemplate(e) {
        //上传中
        if(GP.data.uploadFile)
            return       

        var template_index = e.currentTarget.dataset.template_index 
        GP.setData({
            templateIndex: template_index
        })
        if (GP.data.chooseImage == ""){
            wx.showToast({
                title: '请先上传头像',
                icon:'loading',
            })
            return 
        }
        
        if (GP.data.list[GP.data.templateIndex].cache == "") //没有缓存
            GP.faceMix(GP.data.chooseImage, GP.data.list[GP.data.templateIndex])
        else
            GP.setData({
                mixResult : GP.data.list[GP.data.templateIndex].cache,
            })
    },
    //下载图片
    clickDown(){
        if (GP.data.mixResult == "../../images/click.jpg"){
            wx.showModal({
                title: '请先上传头像',
                showCancel:false,
            })
            return 
        }
        wx.previewImage({
            urls: [GP.data.mixResult],
        })


        // GP.setData({
        //     width: GP.data.list[GP.data.templateIndex].width,
        //     height: GP.data.list[GP.data.templateIndex].height,
        // })

        // setTimeout( function(){

        //     GP.setData({
        //         makeLandmark: GP.data.mixResult,
        //     })
        // } ,500)
    },

    shang(){
        API.Request({
            'url': API.WX_CREATE,
            success: function (res) {
                var wx_dict = res.data.wx_dict
                GP.wxPay(wx_dict) //微信支付，调取支付接口
            },
            complete: function () {
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
                // GP.paySuccess()
                wx.showModal({
                    title: '谢谢老板',
                    content: '有人的地方就有江湖',
                })
            },
            'fail': function (res) {
                console.log(res)
                wx.hideLoading()
                // GP.payFail(res)
            },
            'complete':function(res){
                wx.hideLoading()
            }
        })
    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title:"一键变身金庸笔下的大侠"
        }
    }
})