Page({
    data: {
        array_a: ['未知', '男', '女', '保密'],
        businessType_a: 0,
        array_b: ['健康', '病危', '去世'],
        businessType_b: 0,
        array_c: ['家属自己准备寿衣', '订单时预留寿衣', '订单时未预留寿衣', '不穿寿衣', '其他'],
        businessType_c: 0,
        array_d: ['健康', '病危', '去世'],
        businessType_d: 0,
        consultId: 0,
        date: 0,   //出生时间
    },
    onLoad: function (options) {
        var that = this
        var consultId = options.consultId
        that.setData({
            consultId: consultId
        })
    },
    bindPickerChange_a: function (e) {
        this.setData({
            businessType_a: e.detail.value
        })
    },
    bindPickerChange_b: function (e) {
        this.setData({
            businessType_b: e.detail.value
        })
    },
    bindPickerChange_c: function (e) {
        this.setData({
            businessType_c: e.detail.value
        })
    },
    bindPickerChange_d: function (e) {
        this.setData({
            businessType_d: e.detail.value
        })
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    formSubmit: function (e) {
        var RouteUrl = getApp().globalData.RouteUrl
        var content = e.detail.value
        var consultId = this.data.consultId
        var clothesData = this.data.businessType_c   //寿衣
        var otherHealth = this.data.businessType_d   //另一半健康状态
        var state = this.data.businessType_b   //使用者健康状态
        var sex = this.data.businessType_a   //性别
        var birthday = this.data.date   //出生日期
        if (sex == 0) {
            sex = 1;
        } else if (sex == 1) {
            sex = 2;
        } else if (sex == 2) {
            sex = 3;
        } else if (sex == 3) {
            sex = 4;
        }
        if (state == 0) {
            state = '健康';
        } else if (state == 1) {
            state = '病危';
        } else if (state == 2) {
            state = '去世';
        }
        if (otherHealth == 0) {
            otherHealth = '健康';
        } else if (otherHealth == 1) {
            otherHealth = '病危';
        } else if (otherHealth == 2) {
            otherHealth = '去世';
        }
        if (clothesData == 0) {
            clothesData = '家属自己准备寿衣';
        } else if (clothesData == 1) {
            clothesData = '订单时预留寿衣';
        } else if (clothesData == 2) {
            clothesData = '订单时未预留寿衣';
        } else if (clothesData == 3) {
            clothesData = '不穿寿衣';
        } else if (clothesData == 4) {
            clothesData = '其他';
        }
        if(!consultId){
            wx.showToast({
                title: '咨询ID不能为空',
                duration: 3000
            })
        }else if(!e.detail.value.name){
            wx.showToast({
                title: '姓名不能为空',
                duration: 3000
            })
        }else if(!e.detail.value.cardId){
            wx.showToast({
                title: '身份证不能为空',
                duration: 3000
            })
        }else if(!e.detail.value.age){
            wx.showToast({
                title: '年龄不能为空',
                duration: 3000
            })
        }else if(!e.detail.value.shoeSize){
            wx.showToast({
                title: '鞋码不能为空',
                duration: 3000
            })
        }else if(!e.detail.value.location){
            wx.showToast({
                title: '地址不能为空',
                duration: 3000
            })
        }else if(consultId && e.detail.value.name && e.detail.value.cardId && e.detail.value.age  && e.detail.value.shoeSize && e.detail.value.location){
            content.clothesData = clothesData
            content.sex = sex
            content.state = state
            content.otherHealth = otherHealth
            content.birthday = birthday
            content.consultId = consultId
            /// console.log(content)
            //验证
            // 取出緩存登錄信息
            wx.getStorage({
                key: 'logindata',
                success: function (msg) {
                    // console.log(ContentData)
                    var forData = { content: content }
                    //转换字符串
                    var ForData = JSON.stringify(forData)
                    wx.request({
                        url: RouteUrl + 'customer/usage/save',
                        method: "POST",
                        data: ForData,
                        header: {
                            "Content-Type": "application/x-www-form-urlencodeed",
                            "Cookie": "sid=" + msg.data.content.sessionId
                        },
                        success: function (res) {
                            if (res.data.code == 1000 && res.data.message == '操作成功') {
                                console.log(res.data)
                                //頁面跳轉
                                // wx.navigateTo({
                                //      url: '../agentman_info/agentman_info',
                                //  })
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
    }
        }
});
