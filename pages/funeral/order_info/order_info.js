Page({
    data: {
        array_a: ['健康', '病危', '去世'],
        businessType_a: 0,
        array_b: ['亲属', '其他', '儿子', '女儿', '孙子', '孙女', '朋友', '母亲','父亲'],
        businessType_b: 0,
        array_c: ['简版', '常规', '定制','其他'],
        businessType_c: 0,
        array_d: ['洽谈失败', '预约二次洽谈'],
        businessType_d: 0,
        consultId:0,
        date:''
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
    onLoad: function (options) {
        var consultId=options.consultId
        this.setData({
            consultId:consultId
        })
    },
    formData: function (e) {
        var consultId=this.data.consultId
        var ContentData = e.detail.value
        var RouteUrl = getApp().globalData.RouteUrl
        var health=this.data.businessType_a
        var relation=this.data.businessType_b
        var project=this.data.businessType_c
        var result=this.data.businessType_d
        var resultTime=this.data.date
        if(health == 0){
           health='健康'
        }else if(health == 1){
           health='病危'
        }else if(health == 2){
           health='去世'
        }
        if(relation == 0){
           relation='亲属'
        }else if(relation == 1){
           relation='其他'
        }else if(relation == 2){
           relation='儿子'
        }else if(relation ==3){
           relation='女儿'
        }else if(relation == 4){
           relation='孙子'
        }else if(relation == 5){
           relation='孙女'
        }else if(relation == 6){
           relation='朋友'
        }else if(relation == 7){
           relation='母亲'
        }else if(relation == 8){
           relation='父亲'
        }
        if(project == 0){
           project='简版'
        }else if(project == 1){
           project='常规'
        }else if(project == 2){
           project='定制'
        }else if(project == 3){
           project='其他'
        }
        if(result == 0){
           result=false
        }else if(result == 1){
           result=true
        }
        ContentData.consultId=consultId
        ContentData.health=health
        ContentData.relation=relation
        ContentData.project=project
        ContentData.result=result
        ContentData.resultTime=resultTime    
        // 取出緩存登錄信息
        wx.getStorage({
            key: 'logindata',
            success: function (msg) {
                // console.log(ContentData)
                var forData = { content: ContentData }
                
                //转换字符串
                var ForData = JSON.stringify(forData)
                // console.log(ForData)
                wx.request({
                    url: RouteUrl+'customer/talkfail/save',
                    method: "POST",
                    data: ForData,
                    header: {
                        "Content-Type": "application/x-www-form-urlencodeed",
                        "Cookie": "sid=" + msg.data.content.sessionId
                    },
                    success: function (res) {
                        // console.log(res.data)
                        if (res.data.code == 1000 && res.data.message == '操作成功') {
                            //頁面跳轉
                            wx.redirectTo({
                                url: '../list/list'
                            })
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
    }
});
