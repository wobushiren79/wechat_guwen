//获取应用实例
var tcity = require("../../utils/citys.js");

var app = getApp()
Page({
  data: {
  
  },
  bind_moda:function(){
    var content = {}
    var that=this
    var orderId={}
    orderId.orderId = that.data.orderId
    orderId.actualPayment = that.data.totalPrice
    content.content = orderId
    var javaApi = getApp().globalData.javaApi
    wx.showModal({
      title: '确认线下支付',
      content: '点击确认后，使用线下支付方式，包括现金刷卡收取等',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍后',
            mask: true,
          })
          var JSESSIONID = that.data.JSESSIONID
          if (JSESSIONID){
            wx.request({
              url: javaApi + 'api/goods/order/offlinePayment',
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
                  wx.navigateTo({
                    url: '../service_goods_pay_succeed/service_goods_pay_succeed'
                  })
                } else {
                  wx.navigateTo({
                    url: '../service_goods_pay_error/service_goods_pay_error'
                  })
                }
              }
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  wechat:function(){
    var that=this
    var LocalUrl = getApp().globalData.LocalUrl
    var orderId = that.data.orderId
    var totalPrice = that.data.totalPrice
    var showTotalPrice = that.data.showTotalPrice
    var orderNumber = that.data.orderNumber
    var javaApi = getApp().globalData.javaApi
    var JSESSIONID = that.data.JSESSIONID
    var content={}
    content.orderId = orderId
    content.total_fee = totalPrice
    wx.login({
      success: function (e) {
        content.code = e.code
        //  console.log(e.code)
        wx.request({
          url: LocalUrl + 'Weixing/token',
          method: "POST",
          data: content,
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            // "Cookie": "sid=" + res.data.content.sessionId
          },
          success: function (res) {
            if (res.data.code == 1000) {
              wx.requestPayment({
                'timeStamp': '' + res.data.list.timeStamp + '',
                'nonceStr': res.data.list.nonceStr,
                'package': res.data.list.package,
                'signType': res.data.list.signType,
                'paySign': res.data.list.paySign,
                'success': function (res) {
                  console.log(res)
                  if (res.errMsg == 'requestPayment:ok'){
                    var setData={}
                    var sett={}
                    sett.orderId = orderId
                    sett.actualPayment = totalPrice
                    setData.content = sett
                    wx.request({
                      url: javaApi + 'api/goods/order/wechatPayment',
                      method: "POST",
                      data: setData,
                      header: {
                        // "Content-Type": "application/x-www-form-urlencodeed",
                        'content-type': 'application/json',
                        "Cookie": JSESSIONID
                      },

                      success: function (res) {
                        // console.log(res)
                        if (res.data.code == 1000) {
                          wx.navigateTo({
                            url: '../service_goods_pay_succeed/service_goods_pay_succeed'
                          })
                        } else {
                          wx.showToast({
                            title: '通知平台失败,请通知平台客户',
                            duration: 3000
                          })
                        }
                      }
                    })
                  }
                },
                'fail': function (res) {
                    console.log(res)
                    if (res.errMsg == 'requestPayment:fail') {
                      wx.navigateTo({
                        url: '../service_goods_pay_error/service_goods_pay_error'
                      })
                  }
                }
              })
            }
            //   else {
            //    wx.showToast({
            //      title: res.data.message,
            //      duration: 2000
            //    })
            //  }
          }
        })
      }
    })
  },
  onLoad: function (evet) {
    var that = this
    var JSESSIONID = ''
    wx.getStorage({
      key: 'JSESSIONID',
      success: function(res) {
        JSESSIONID = res.data
        that.setData({
          JSESSIONID: JSESSIONID
        })
    var orderId = evet.orderId
    var content = {}
    var javaApi = getApp().globalData.javaApi
    content.content = { 'orderId': parseInt(orderId) }
    // console.log(content)
    wx.request({
      url: javaApi + 'api/goods/order/findById',
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
  }
})
