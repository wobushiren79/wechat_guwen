Page({
  data: {
    pageSize: 3,
    pageNumber: 0

  },
  onLoad: function (e) {
    var that = this
    var storeId = e.storeId
    wx.showLoading({
      title: '加载中',
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
    // content.content = { 'orderStatus':0}
    var contents = {}
    contents.orderStatus =[0] 
    contents.storeId = storeId 
    // contents.checkOrder=0
    var page = {}
    var pageSize = that.data.pageSize
    page.content = contents
    page.pageSize = pageSize
    page.pageNumber = 0
    content.content = page
    wx.request({
      url: javaApi + 'api/goods/order/list',
      method: "POST",
      data: content,
      header: {
        // "Content-Type": "application/x-www-form-urlencodeed",
        'content-type': 'application/json',
        "Cookie": JSESSIONID
      },

      success: function (res) {
        // console.log(res)
        if (res.data.code == 1000) {
          var list = res.data.content.content
          if (list.length == pageSize) {
            that.setData({
              list: list,
              pageSize: pageSize + 2,
              storeId: storeId
            })
            wx.hideLoading()
          } else {
            that.setData({
              list: list,
              pageSize: pageSize,
              xinshi: true,
              storeId: storeId
            })
            wx.hideLoading()
          }
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../../images/icon_info.png',
            duration: 2000
          })
        }
      }
    })
      },
    })
  },
  tel: function (e) {
    var tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel, //仅为示例，并非真实的电话号码
      complete: function (res) {
        // console.log(res)
      },
    })
  },
  //下拉添加记录条数
  onReachBottom() {
    var that = this
    var storeId = that.data.storeId
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var JSESSIONID = that.data.JSESSIONID
    var content = {}
    var javaApi = getApp().globalData.javaApi
    // content.content = { 'payStatus':0}
    var contents = {}
    contents.orderStatus = [0]
    contents.storeId = storeId 
    // contents.checkOrder = 0
    var page = {}
    var pageSize = that.data.pageSize
    page.content = contents
    page.pageSize = pageSize
    page.pageNumber = 0
    content.content = page
    wx.request({
      url: javaApi + 'api/goods/order/list',
      method: "POST",
      data: content,
      header: {
        // "Content-Type": "application/x-www-form-urlencodeed",
        'content-type': 'application/json',
        "Cookie": JSESSIONID
      },

      success: function (res) {
        if (res.data.code == 1000) {
          var list = res.data.content.content
          if (list.length == pageSize) {
            that.setData({
              list: list,
              pageSize: pageSize + 2
            })
            wx.hideLoading()
          } else {
            that.setData({
              list: list,
              pageSize: pageSize,
              xinshi: true
            })
            wx.hideLoading()
          }

        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../../images/icon_info.png',
            duration: 2000
          })
        }
      }
    })
  },
  queren: function (e) {
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../../service_goods_order/service_goods_order?orderId=' + orderId
    })
  },
  //修改价格
  EditPrice: function (e) {
    var that = this
    var pages = getCurrentPages()
    var path = pages[pages.length - 1].route
    var orderId = e.currentTarget.dataset.orderid
    var price = e.currentTarget.dataset.price
    var storeId = that.data.storeId
    wx.navigateTo({
      url: '../edit_price/edit_price?orderId=' + orderId + '&price=' + price + '&path=' + path + '&storeId=' + storeId,
    })
  }
});
