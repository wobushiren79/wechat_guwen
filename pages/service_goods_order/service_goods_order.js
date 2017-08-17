
Page({
  data: {
   
  },
  onLoad:function(evet){
    var that=this
    // var JSESSIONID=''
    wx.getStorage({
      key: 'JSESSIONID',
      success: function(res) {
        
       var JSESSIONID = res.data
        // that.setData({
        //   JSESSIONID: JSESSIONID
        // })

    var orderId = evet.orderId
    var content = {}
    var javaApi = getApp().globalData.javaApi
    content.content = { 'orderId':parseInt(orderId)}
    console.log(content)
    console.log(JSESSIONID)
    wx.request({
      url: javaApi + 'api/goods/order/findById',
      method: "POST",
      data: content,
      header: {
        // "Content-Type": "application/x-www-form-urlencodeed",
        'content-type': 'application/json',
        "Cookie":JSESSIONID
      },
      
      success: function (res) {
        
        console.log(res)
        if (res.data.code == 1000) {
          // var orderNumber = res.data.content.orderNumber
          that.setData({
            showTotalPrice: res.data.content.showTotalPrice,
            totalPrice: res.data.content.totalPrice,
            orderNumber: res.data.content.orderNumber,
            orderId: orderId
          })
        } else {
          wx.showToast({
            title: res.data.message,
            duration: 2000
          })
        }
      }
    })
      },
    })
  },
  fukuang: function (e) {
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../service_goods_pay/service_goods_pay?orderId=' + orderId
    })
  }
 
})
