Page({
    data: {



        array: [{


            "personNum": '人数',
            "cem": "公墓",
            "time": "2017-05-02",
            "traffic": "交通方式",
            "person": "公墓接待",
            "timeCem": "2017-02-02",
            "timeMoney": "2017-01-01",
            "cemName": "公墓名称",

            "consultId": '咨询ID',
            "consultStatus": '咨询状态',//1：未接单，2：已接单，3：已下单，4：洽谈失败，5：洽谈成功
            "customerAddress": "客户联系地址",
            "customerMobile": "客户联系电话",
            "customerName": "客户姓名",
            "description": "备注",
            "consultAssignId": '咨询指派ID',
            "orderId": '订单ID',//当未下过订单时, 该值为null
            "orderNum": "订单编号",
            "orderStatus": '订单状态',//1：未处理，2：待服务，3：已接受，4：服务派单中，5：结束派单，6：已确认，7：服务完成
            "agentmanName": "经办人姓名",
            "agentmanMobile": "经办人电话",
            "usageCurAddress": "使用者当前所在地",
            "performerName": "执行顾问",
            "performerMobile": "执行顾问电话",
            "hasPrepay": false,//定金是否已支付
            "showEditOrder": false,//是否显示[编辑订单]
            "showOrderDetail": false,//是否显示[订单详情]
            "promiseTime": 1461252140309,
            // "showAcceptOrReject":false,//是否显示[接单
            "showFinishTalk": false,//是否显示[结束洽谈]
            "showSwitch2waitService": false //是否显示[及時服务]
        }],
    },

    onLoad: function (options) {
      var GmUrl = getApp().globalData.GmUrl
      var that = this
      var orderId = options.orderId
      var content = { content: { "orderId": orderId } }
      var DataContent = JSON.stringify(content)
      // 取出緩存登錄信息
      wx.getStorage({
        key: 'Gmlogin',
        success: function (res) {
          //使用者接口
          wx.request({
            url: GmUrl + 'marketing/order/deadinfo/get',
            method: "POST",
            data: DataContent,
            header: {
              "Content-Type": "application/x-www-form-urlencodeed",
              "Cookie": "sid=" + res.data.content.sessionId
            },
            success: function (res) {
              // console.log(res.data.content)
              if (res.data.code == 1000) {
                // console.log(res)
                // for (var i in res.data.content){
                //   var orderNum = res.data.content[i].orderNum
                // }
                that.setData({
                  deadmanOneName: res.data.content.deadmanOneName,
                  deadmanOneAge: res.data.content.deadmanOneAge,
                  deadmanOneSex: res.data.content.deadmanOneSex,
                  deadmanOneState: res.data.content.deadmanOneState,
                  deadmanOneCardId: res.data.content.deadmanOneCardId,
                  deadmanOneDeadTime: res.data.content.deadmanOneDeadTime,
                  deadmanTwoName: res.data.content.deadmanTwoName,
                  deadmanTwoAge: res.data.content.deadmanTwoAge,
                  deadmanTwoSex: res.data.content.deadmanTwoSex,
                  deadmanTwoState: res.data.content.deadmanTwoState,
                  deadmanTwoCardId: res.data.content.deadmanTwoCardId,
                  deadmanTwoDeadTime: res.data.content.deadmanTwoDeadTime,
                  remarks: res.data.content.remark,
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  duration: 3000
                })
              }
            }
          })
      //经办人资料接口
          wx.request({
            url: GmUrl + 'marketing/order/agentinfo/get',
            method: "POST",
            data: DataContent,
            header: {
              "Content-Type": "application/x-www-form-urlencodeed",
              "Cookie": "sid=" + res.data.content.sessionId
            },
            success: function (res) {
              // console.log(res.data.content)
              if (res.data.code == 1000) {
                // console.log(res)
                // for (var i in res.data.content){
                //   var orderNum = res.data.content[i].orderNum
                // }
                that.setData({
                  agentmanName: res.data.content.agentmanName,
                  agentmanPhone: res.data.content.agentmanPhone,
                  relation: res.data.content.relation,
                  agentmanLocation: res.data.content.agentmanLocation,
                  agentmanCardId: res.data.content.agentmanCardId,
                  agentmanEmail: res.data.content.agentmanEmail,
                  remark: res.data.content.remark,
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
    },

});
