var QR = require("../../../utils/qrcode.js");
var util = require('../../../utils/util.js')
Page({
    data: {
        num: 20170202020202,
        money: 0,
        codeUrl: '',
        maskHidden: true,
        imagePath: '',
        placeholder: 'http://m.e-funeral.cn'//默认二维码生成文本
    },
    onReady: function () {
        var size = this.setCanvasSize();//动态设置画布大小
        var initUrl = this.data.placeholder;
        this.createQrCode(initUrl, "mycanvas", size.w, size.h);
    },
    //适配不同屏幕大小的canvas
    setCanvasSize: function () {
        var size = {};
        try {
            var res = wx.getSystemInfoSync();
            var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
            var width = res.windowWidth / scale;
            var height = width;//canvas画布为正方形
            size.w = width;
            size.h = height;
        } catch (e) {
            // Do something when catch error
            console.log("获取设备信息失败" + e);
        }
        return size;
    },
    createQrCode: function (url, canvasId, cavW, cavH) {
        //调用插件中的draw方法，绘制二维码图片
        QR.qrApi.draw(url, canvasId, cavW, cavH);

    },
    //获取临时缓存照片路径，存入data中
    canvasToTempImage: function () {
        var that = this;
        wx.canvasToTempFilePath({
            canvasId: 'mycanvas',
            success: function (res) {
                var tempFilePath = res.tempFilePath;
                console.log("********" + tempFilePath);
                that.setData({
                    imagePath: tempFilePath,
                });
            },
            fail: function (res) {
                console.log(res);
            }
        });
    },
    onLoad: function (options) {
        var that = this
        var money = options.money
        var orderId = options.orderId
        var payId = options.payId
        //获取全局变量   接口通用前缀
        var RouteUrl = getApp().globalData.RouteUrl
        wx.getStorage({
            key: 'logindata',
            success: function (msg) {
                var ContentData = {}
                ContentData.orderId = orderId
                ContentData.money = money
                ContentData.payId = payId

                var forData = { content: ContentData }
                //转换字符串
                var ForData = JSON.stringify(forData)
                //初始化二次修改
                wx.request({
                    url: RouteUrl + 'pay/weixin/createScanUrl',
                    method: "POST",
                    data: ForData,
                    header: {
                        "Content-Type": "application/x-www-form-urlencodeed",
                        "Cookie": "sid=" + msg.data.content.sessionId
                    },
                    success: function (res) {
                        //console.log(res.data)
                        if (res.data.code == 1000 && res.data.message == '操作成功') {
                            var codeUrl = res.data.content.codeUrl
                            //console.log(codeUrl)
                            that.setData({
                                maskHidden: false,
                                codeUrl: codeUrl
                            });
                            wx.showToast({
                                title: '生成中...',
                                icon: 'loading',
                                duration: 2000
                            });
                            var st = setTimeout(function () {
                                wx.hideToast()
                                var size = that.setCanvasSize();
                                //绘制二维码
                                that.createQrCode(codeUrl, "mycanvas", size.w, size.h);
                                that.setData({
                                    maskHidden: true
                                });
                                clearTimeout(st);
                            }, 2000)
                        } else {
                            wx.showToast({
                                title: res.data.message,
                                image: '/images/icon_info.png',
                                duration: 3000
                            })
                        }

                    }
                })
            }
        })
        that.setData({
            money: money
        })
    },
  previewImg:function(){
      console.log(111111)
  }
    
});