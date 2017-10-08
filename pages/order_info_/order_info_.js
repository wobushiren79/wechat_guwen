Page({
    data: {

      orderNum:0,

      GmOrderData: [{

        }],
    },
    onLoad: function (options) {
      var GmUrl = getApp().globalData.GmUrl
      var that=this
      var bespeakId = options.bespeakId
      var content = { content: { "bespeakId": bespeakId} }
      var DataContent = JSON.stringify(content)
      // 取出緩存登錄信息
      wx.getStorage({
        key: 'Gmlogin',
        success: function (res) {
          wx.request({
            url: GmUrl + 'marketing/order/buycemetery/get',
            method: "POST",
            data: DataContent,
            header: {
              "Content-Type": "application/x-www-form-urlencodeed",
              "Cookie": "sid=" + res.data.content.sessionId
            },
            success:function(res){
              // console.log(res.data.content)
              if (res.data.code == 1000) {
                // console.log(res)
                // for (var i in res.data.content){
                //   var orderNum = res.data.content[i].orderNum
                // }
                   that.setData({
                     orderNum: res.data.content.orderNum,
                     cemeteryName: res.data.content.cemeteryName,
                     tombName: res.data.content.tombName,
                     parkName: res.data.content.parkName,
                     num: res.data.content.num,
                     planSale: res.data.content.planSale,
                     moneyDeposit: res.data.content.moneyDeposit,
                     saleMoney: res.data.content.saleMoney,
                     cemeteryReceive: res.data.content.cemeteryReceive,
                     freeService: res.data.content.freeService,
                     cemeterySales: res.data.content.cemeterySales,
                     choiceService: res.data.content.choiceService,
                     payRemarks: res.data.content.payRemarks,
                     rowNumber: res.data.content.rowNumber,
                     orderId: res.data.content.orderId
                   })
              }else{
                wx.showToast({
                  title: res.data.message,
                  image: '../../images/icon_info.png',
                  duration: 3000
                })
              }
            }
          })
          }
        })
    },

});
