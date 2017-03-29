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
    },
    onLoad: function () {
        var that = this
        var  PageNums={content:{ "pageNum": 0,"pageSize": 20}}
        var PageNum=JSON.stringify(PageNums)
        // 取出緩存登錄信息
        wx.getStorage({
        key: 'logindata',
            success: function(res) {
            //  console.log(res.data)
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
                            
                            if(res.data.code == 1000){ 
                            var TalkData=res.data.content.items 
                            //console.log(TalkData)
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
