Page({
    data: {
        showTopTips: false,

        radioItems: [
            // {name: 'Pos机支付', value: '0'},
            // {name: '现金支付', value: '1'},
            { name: '微信支付', value: '2', checked: true },
            // {name: '支付宝支付', value: '3'}

        ],

        money: 0,
        orderId: 0,
        isAgree: false,
        payId:0,
    },
    onLoad: function (options) {
        var that = this
        var orderId = options.orderId
        //console.log(orderId)
        //获取全局变量   接口通用前缀
        var RouteUrl = getApp().globalData.RouteUrl
        var money = that.data.money
        var payId=0
        wx.getStorage({
            key: 'logindata',
            success: function (msg) {
                var ContentData = {}
                ContentData.orderId = orderId
                var forData = { content: ContentData }
                //转换字符串
                var ForData = JSON.stringify(forData)
                //初始化二次修改
                wx.request({
                    url: RouteUrl + 'pay/prepay/create',
                    method: "POST",
                    data: ForData,
                    header: {
                        "Content-Type": "application/x-www-form-urlencodeed",
                        "Cookie": "sid=" + msg.data.content.sessionId
                    },
                    success: function (res) {
                    //    console.log(res.data)
                        if (res.data.code == 1000 && res.data.message == '操作成功') {
                            that.setData({
                                money: res.data.content.actualAmount,
                                payId:res.data.content.payId,
                                orderId: orderId
                            })
                        }else{
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

    },
    radioChange: function (e) {
        //console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        this.setData({
            radioItems: radioItems
        });
    },
    formSubmit: function (e) {
        var that = this
        var money = that.data.money
        var orderId = that.data.orderId
        var payId=that.data.payId
        //頁面跳轉
        wx.redirectTo({
            url: '../pay_b/pay_b?money='+money+'&orderId='+orderId+'&payId='+payId
        })
    }

});