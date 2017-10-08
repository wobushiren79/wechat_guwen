Page({
    data: {

    },
    onLoad: function (options) {
        var consultId = options.consultId
        var orderId = options.orderId
        var RouteUrl = getApp().globalData.RouteUrl
        var ContentData = {}
        //ContentData.orderId = orderId
        ContentData.consultId = consultId
        wx.getStorage({
            key: 'logindata',
            success: function (msg) {
                // console.log(ContentData)
                var forData = { content: ContentData }
                //转换字符串
                var ForData = JSON.stringify(forData)
                wx.request({
                    url: RouteUrl + 'consult/switch2waitService',
                    method: "POST",
                    data: ForData,
                    header: {
                        "Content-Type": "application/x-www-form-urlencodeed",
                        "Cookie": "sid=" + msg.data.content.sessionId
                    },
                    success: function (res) {
                        if (res.data.code == 1000 && res.data.message == '操作成功') {
                            //頁面跳轉
                            wx.redirectTo({
                                url: '../list/list'
                            })
                        } else {
                            wx.showToast({
                                title: res.data.message,
                                image: '../../images/icon_info.png',
                                duration: 5000
                            })
                            //頁面跳轉
                            wx.redirectTo({
                                url: '../list/list'
                            })
                        }
                    }
                })
            }
        })
    }
})