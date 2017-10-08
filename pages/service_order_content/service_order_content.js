Page({
  data: {
    list_show: false,
    popup: false
  },
  bind_list: function () {
    var that = this;
    that.setData({
      list_show: (!that.data.list_show)
    })
  },
  call_phone: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone, 
      fail: function (res) {
        wx.showToast({
          title: '拨打电话失败',
          image: '../../images/icon_info.png',
          duration: 3000
        })
      }
    })
  },
  kehuphone:function(){
    wx.makePhoneCall({
      phoneNumber: '966188', 
      fail: function (res) {
        wx.showToast({
          title: '拨打电话失败',
          image: '../../images/icon_info.png',
          duration: 3000
        })
      }
    })
  },
  // popup: function () {
  //   var that = this
  //   that.setData({
  //     popup: true
  //   })
  // },
  popup_close: function () {
    this.setData({
      popup: false
    })
  },
  onLoad: function (evet) {
    var that = this
    var orderId = evet.orderid
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var JSESSIONID=''
    wx.getStorage({
      key: 'JSESSIONID',
      success: function(res) {
        JSESSIONID = res.data
        that.setData({
          JSESSIONID: JSESSIONID
        })

    var content = {}
    var javaApi = getApp().globalData.javaApi
    var orderid={}
    orderid.id = orderId
    content.content = orderid
    console.log(content)
    wx.request({
      url: javaApi + 'api/goods/order/findOrderDetailById',
      method: "POST",
      data: content,
      header: {
        // "Content-Type": "application/x-www-form-urlencodeed",
        'content-type': 'application/json',
        "Cookie": JSESSIONID
      },

      success: function (res) {
        console.log(res)
        if (res.data.code == 1000) {
          var listData=res.data.content
          that.setData({
            listData:listData
          })
          wx.hideLoading()
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
  zhixing:function(e){
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var that=this
    var JSESSIONID = that.data.JSESSIONID
    var content = {}
    var javaApi = getApp().globalData.javaApi
    var id =e.currentTarget.dataset.id
    content.content = { 'performId': id}
    wx.request({
      url: javaApi + 'api/goods/order/findPerformInfoByPerformId',
      method: "POST",
      data: content,
      header: {
        // "Content-Type": "application/x-www-form-urlencodeed",
        'content-type': 'application/json',
        "Cookie": JSESSIONID
      },

      success: function (res) {
        console.log(res)
        if (res.data.code == 1000) {
          var listData = res.data.content
          that.setData({
            zhixing: listData,
            popup:true
          })
          wx.hideLoading()
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
  queren: function (e) {
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../service_goods_order/service_goods_order?orderId=' + orderId
    })
  },
  fukuang: function (e) {
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../service_goods_pay/service_goods_pay?orderId=' + orderId
    })
  }
});
