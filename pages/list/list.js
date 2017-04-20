Page({
    data: {
           array:[{
                "consultId":'咨询ID',
                "consultStatus":'咨询状态',//1：未接单，2：已接单，3：已下单，4：洽谈失败，5：洽谈成功
                "customerAddress":"客户联系地址",
                "customerMobile":"客户联系电话",
                "customerName":"客户姓名",
                "description":"备注",
                "consultAssignId":'咨询指派ID',
                "orderId":'订单ID',//当未下过订单时, 该值为null
                "orderNum":"订单编号",
                "orderStatus":'订单状态',//1：未处理，2：待服务，3：已接受，4：服务派单中，5：结束派单，6：已确认，7：服务完成
                "agentmanName":"经办人姓名",
                "agentmanMobile":"经办人电话",
                "usageCurAddress":"使用者当前所在地",
                "performerName":"执行顾问",
                "performerMobile":"执行顾问电话",
                "hasPrepay":false,//定金是否已支付
                "showEditOrder":false,//是否显示[编辑订单]
                "showOrderDetail":false,//是否显示[订单详情]
                "promiseTime":1461252140309,
               // "showAcceptOrReject":false,//是否显示[接单
                "showFinishTalk":false,//是否显示[结束洽谈]
                "showSwitch2waitService":false //是否显示[及時服务]
           }],
         pageNum:0,
         pageSize:2,
         Length:0
        // hidden:false
    },
    onPullDownRefresh(){
         var that = this
        var RouteUrl=getApp().globalData.RouteUrl
        var unm=that.data.pageNum
        var size=that.data.pageSize
        var  PageNums={content:{ "pageNum": unm,"pageSize": size}}
        var PageNum=JSON.stringify(PageNums)
    　　wx.showNavigationBarLoading() //在标题栏中显示加载
        wx.setNavigationBarTitle({
          title: '刷新中!!!!!'
        })
            this.setData({
                   // pageSize:this.data.pageSize+2,
                    hidden:true
                 })

        // 取出緩存登錄信息
        wx.getStorage({
        key: 'logindata',
            success: function(res) {
            //  console.log(res.data)
            //console.log(PageNum)
            wx.request({
                        url: RouteUrl+'order/list/talk', 
                        method:"POST",
                        data: PageNum,
                        header: {
                            "Content-Type":"application/x-www-form-urlencodeed",
                            "Cookie":"sid="+res.data.content.sessionId
                        },
                        success: function(res) {
                            if(res.data.code == 1000){ 
                            var TalkData=res.data.content.items 
                            //console.log(TalkData)
                            var Length=TalkData.length
                                that.setData({
                                    array:TalkData,
                                    Length:Length
                                })
                            }else{
                                wx.showToast({
                                    title: res.data.message,
                                    duration: 3000
                                })
                            }  
                        },
                        complete: function() {
                                that.setData({
                                    hidden:false    
                                })
                            wx.setNavigationBarTitle({
                            title: '订单列表'
                            })
                          wx.hideNavigationBarLoading() //完成停止加载
                          wx.stopPullDownRefresh() //停止下拉刷新
                        }
            })
            }
        })
    },
    //上拉添加记录条数
    onReachBottom(){
    　　//console.log('--------下拉刷新-------')
    　　wx.showNavigationBarLoading() //在标题栏中显示加载
        wx.setNavigationBarTitle({
          title: '加载中!!!!!'
        })
                  
            this.setData({
                    pageSize:this.data.pageSize+2,
                    hidden:true
                 })
        var unm=this.data.pageNum
        var size=this.data.pageSize
        var RouteUrl=getApp().globalData.RouteUrl
        var  PageNums={content:{ "pageNum": unm,"pageSize": size}}
        var PageNum=JSON.stringify(PageNums)    
        var that = this 
        // 取出緩存登錄信息
        wx.getStorage({
        key: 'logindata',
            success: function(res) {
            //  console.log(res.data)
            //console.log(PageNum)
            wx.request({
                        url: RouteUrl+'order/list/talk', 
                        method:"POST",
                        data: PageNum,
                        header: {
                            "Content-Type":"application/x-www-form-urlencodeed",
                            "Cookie":"sid="+res.data.content.sessionId
                        },
                        success: function(res) {
                            
                            if(res.data.code == 1000){ 
                            var TalkData=res.data.content.items 
                            //console.log(TalkData)
                            var Length=TalkData.length
                                that.setData({
                                    array:TalkData,
                                    Length:Length,
                                    
                                })
                            }else{
                                wx.showToast({
                                    title: res.data.message,
                                    duration: 3000
                                })
                            }  
                        },
                        complete: function() {
                                that.setData({
                                    hidden:false    
                                })
                            wx.setNavigationBarTitle({
                            title: '订单列表'
                            })
                          wx.hideNavigationBarLoading() //完成停止加载
                          wx.stopPullDownRefresh() //停止下拉刷新
                        }
            })
            }
        })  
    },
    //点击客户电话拨打客户电话
    phone:function(e){
     var tel= e.target.dataset.tel
        wx.makePhoneCall({
        phoneNumber: tel, //仅为示例，并非真实的电话号码
        complete: function (res){
          console.log(res)
        },
        })
    },
    onLoad: function () {
        var RouteUrl=getApp().globalData.RouteUrl
        var that = this
        var unm=that.data.pageNum
        var size=that.data.pageSize
        var  PageNums={content:{ "pageNum": unm,"pageSize": size}}
        var PageNum=JSON.stringify(PageNums)
        // 取出緩存登錄信息
        wx.getStorage({
        key: 'logindata',
            success: function(res) {
            //  console.log(res.data)
            //console.log(PageNum)
            wx.request({
                        url: RouteUrl+'order/list/talk', 
                        method:"POST",
                        data: PageNum,
                        header: {
                            "Content-Type":"application/x-www-form-urlencodeed",
                            "Cookie":"sid="+res.data.content.sessionId
                        },
                        success: function(res) {
                            
                            if(res.data.code == 1000){ 
                            var TalkData=res.data.content.items 
                            //console.log(TalkData)
                            var Length=TalkData.length
                                that.setData({
                                    array:TalkData,
                                    Length:Length
                                })
                            }else{
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
});
