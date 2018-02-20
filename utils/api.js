'use strict';

/* api.js  公共类
    小程序的api接口集合 
 */

// var host_url = 'http://192.168.200.103:8000/emoji/';
// var host_url = 'http://127.0.0.1:8000/emoji/'; 
// var host_url = 'https://www.12xiong.top/emoji/';

// var host_url = 'http://192.168.200.103:8000/hemoji/';
// var host_url = 'http://127.0.0.1:8000/emoji/';
var host_url = 'https://www.12xiong.top/emoji/';
// var host_url = 'https://xcx.308308.com/hemoji/';


function Request(options) {
    // url, data, success, fail, complete

    var data =  options.data
    if (data == undefined)
        data = {}
    data['session'] = wx.getStorageSync("session")  //每个请求都加session
    wx.request
        ({
            url: options.url,
            method: "GET",
            // method: "POST",
            // header: {
            //     'content-type': 'application/x-www-form-urlencoded'
            // },
            // method: "POST",
            // header: {
            //     'content-type': 'application/x-www-form-urlencoded'
            // },
            data: data,
            success: function (res) {
                if (options.success != undefined)
                    options.success(res)
            },
            fail: function (res) {
                if (options.fail != undefined)
                    options.fail(res)
            },
            complete: function (res) {
                if (options.complete != undefined)
                    options.complete(res)
            },
        })
}


module.exports = {
    Request: Request,
    USER_LOGIN: host_url + 'lite/user/login/',

    WX_CREATE: host_url + 'lite/wx/create/',
    WX_CALLBACK: host_url + 'lite/wx/callback/',

    IMAGE_GET_LIST: host_url + 'lite/image/get_list/',

};

