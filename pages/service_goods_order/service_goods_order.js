
Page({
  data: {
   
  },
  onLoad:function(evet){
    var that=this
    // var JSESSIONID=''
    //是否职业顾问
    wx.getStorage({
      key: 'amateurLevel',
      success: function (res) {
        that.setData({
          amateurLevel:true
        })
      },
      fail:function(){
        that.setData({
          amateurLevel: false
        })
      }
    })
    wx.getStorage({
      key: 'JSESSIONID',
      success: function(res) {
        
       var JSESSIONID = res.data
        that.setData({
          JSESSIONID: JSESSIONID
        })

    var orderId = evet.orderId
    var content = {}
    var javaApi = getApp().globalData.javaApi
    content.content = { 'orderId':parseInt(orderId)}
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
        if (res.data.code == 1000) {
          // console.log(res)
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
            image: '../../images/icon_info.png',
            duration: 2000
          })
        }
      }
    })
      },
    })
  },
  fukuang: function (e) {
    // console.log(1111111111)
    var that=this
    var orderId = e.currentTarget.dataset.orderid
    var JSESSIONID = that.data.JSESSIONID
    var content = {}
    var javaApi = getApp().globalData.javaApi
    content.content = { 'orderId': parseInt(orderId) }
    wx.request({
      url: javaApi + 'api/goods/order/submit',
      method: "POST",
      data: content,
      header: {
        // "Content-Type": "application/x-www-form-urlencodeed",
        'content-type': 'application/json',
        "Cookie": JSESSIONID
      },

      success: function (res) {
        if (res.data.code == 1000) {
          wx.redirectTo({
            url: '../service_goods_pay/service_goods_pay?orderId=' + orderId
          })
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../images/icon_info.png',
            duration: 2000
          })
        }
      }
    })
  }
 
})
