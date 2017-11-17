Page({
  data: {
    pageSize: 3,
    pageNumber: 0

  },
  onLoad: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    //是否职业顾问
    wx.getStorage({
      key: 'amateurLevel',
      success: function (res) {
        that.setData({
          amateurLevel: true
        })
      },
      fail: function () {
        that.setData({
          amateurLevel: false
        })
      }
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
    var contents = { 'orderStatus': [10] }
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
        if (res.data.code == 1000) {
          var list = res.data.content.content
          if (list.length == pageSize) {
            that.setData({
              list: list,
              pageSize: pageSize + 2,
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
            image: '../../images/icon_info.png',
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
        console.log(res)
      },
    })
  },
  //下拉添加记录条数
  onReachBottom() {
    var that = this
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var JSESSIONID = that.data.JSESSIONID
    var content = {}
    var javaApi = getApp().globalData.javaApi
    // content.content = { 'payStatus':0}
    var contents = { 'orderStatus': [10] }
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
              pageSize: pageSize + 2,
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
            image: '../../images/icon_info.png',
            duration: 2000
          })
        }
      }
    })
  },
});
