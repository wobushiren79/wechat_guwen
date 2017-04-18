Page({
    data: {
        num: 20170202020202,

        money: 0,
        codeUrl: ''
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
                            console.log(codeUrl)
                            that.setData({
                                codeUrl: codeUrl
                            })
                        } else {
                            wx.showToast({
                                title: res.data.message,
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
    }
});