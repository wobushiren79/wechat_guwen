Page({
    data: {
           array:[{
                customerName: "姚财武",
                promiseTime: "2017-02-02 16:59",
                customerAddress: "某某某某某某某某某某某某某某某某某某",
                description: "这里是备注",   
                customerMobile:'电话',
                consultId:'查询id', 
                orderId:'订单id'  
           }]
    },
    onLoad: function () {
        var that = this
        // 取出緩存登錄信息
        wx.getStorage({
        key: 'logindata',
            success: function(res) {
            //  console.log(res.data)
           var  PageNums={content:{ "pageNum": 0,"pageSize": 2}}
            var PageNum=JSON.stringify(PageNums)
            //console.log(PageNum)
            wx.request({
                        url: 'http://115.28.163.211:7080/shianlife-adviser-1.0-SNAPSHOT/order/list/talk', 
                        method:"POST",
                        data: PageNum,
                        
                        
                        header: {
                            "Content-Type":"application/x-www-form-urlencodeed",
                            "Cookie":"sid="+res.data.content.sessionId
                        },
                        success: function(res) {
                            //console.log(res.data)
                            if(res.data.code == 1000){ 
                            var TalkData=res.data.content.items
                                that.setData({
                                    array:TalkData
                                })
                            }  
                        }
            })
            }
        })
    }
});
