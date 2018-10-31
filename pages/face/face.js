// pages/face/face.js

var Base64 = require('../../utils/image_base.js');

var GP

var templateList = [
    {
        "base64": Base64.qiaofeng,
        "rectangle": "86,151,89,89",
        "width": 500,
        "height": 311,
        "cache":"",
    },
    {
        "base64": Base64.linghc,
        "rectangle": "67,230,55,55",
        "width": 500,
        "height": 333,
        "cache": "",
    }, 
    {
        "base64": Base64.yangg,
        "rectangle": "62,181,98,98",
        "width": 500,
        "height": 265,
        "cache": "",
    },
    {
        "base64": Base64.xiaoln,
        "rectangle": "68,97,106,106",
        "width": 500,
        "height": 334,
        "cache": "",
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

        // var obj = wx.getStorageSync("base")
        // console.log(obj.result)
        // GP.setData({
        //     makeLandmark: "data:image/jpg;base64," + obj.result
        // })
        // wx.previewImage({
        //     urls: [obj.result],
        // })
    },

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
                    list: templateList,//初始化列表
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
        GP.setData({
            makeLandmark: GP.data.mixResult,
            width: GP.data.list[GP.data.templateIndex].width,
            height: GP.data.list[GP.data.templateIndex].height,
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})