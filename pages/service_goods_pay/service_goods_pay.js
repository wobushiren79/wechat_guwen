//获取应用实例
var QR = require("../../utils/qrcode.js");
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    chaxun:false,
    num: 20170202020202,
    money: 0,
    codeUrl: '',
    maskHidden: true,
    imagePath: '',
    placeholder: 'http://m.e-funeral.cn'//默认二维码生成文本
  },
  onReady: function () {
    var size = this.setCanvasSize();//动态设置画布大小
    var initUrl = this.data.placeholder;
    this.createQrCode(initUrl, "mycanvas", size.w, size.h);
  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 150 / 150;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url, canvasId, cavW, cavH);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log("********" + tempFilePath);
        that.setData({
          imagePath: tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  bind_moda: function () {
    var content = {}
    var that = this
    var orderId = {}
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
            // mask: true,
          })
          var JSESSIONID = that.data.JSESSIONID
          if (JSESSIONID) {
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
                  wx.redirectTo({
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
  orver:function(){
    wx.showLoading({
      title: '查询中...',
      icon: 'loading',
    });
    var that=this
    var JSESSIONID = that.data.JSESSIONID
    var javaApi = getApp().globalData.javaApi
    var content = {}
    content.id = that.data.orderId
    var setData={}
    setData.content = content
    wx.request({
      url: javaApi + 'api/goods/order/findFinanceDetailById',
      method: "POST",
      data: setData,
      header: {
        // "Content-Type": "application/x-www-form-urlencodeed",
        'content-type': 'application/json',
        "Cookie": JSESSIONID
      },
      success: function (da) {
        if(da.data.code == 1000){
          var paymentStatus = da.data.content.paymentStatus
          if (paymentStatus == 0){
            wx.showModal({
              title: '圆满人生提示您',
              content: '订单未支付',
              confirmText:'返回首页',
              success: function (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            wx.hideLoading()
          }else{
            wx.showModal({
              title: '圆满人生提示您',
              content: '订单已支付成功',
              confirmText: '返回首页',
              success: function (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            wx.hideLoading()
          }
        }
        wx.hideLoading()
        // console.log(da)
      },
      })
// console.log('查询支付结果')
  },
  wechats:function(){
    wx.showLoading({
      title: '生成中...',
      icon: 'loading',
    });
    var that = this
    var LocalUrl = getApp().globalData.LocalUrl
    var orderId = that.data.orderId
    // var QR = require("../../utils/yaqrcode.js");
    var totalPrice = that.data.totalPrice
    var showTotalPrice = that.data.showTotalPrice
    var orderNumber = that.data.orderNumber
    var javaApi = getApp().globalData.javaApi
    var JSESSIONID = that.data.JSESSIONID
    var content = {}
    content.orderId = orderId
    content.total_fee = showTotalPrice
    wx.login({
      success: function (e) {
        content.code = e.code
        //  console.log(e.code)
        wx.request({
          url: LocalUrl + 'Weixing/token_code',
          method: "POST",
          data: content,
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            // "Cookie": "sid=" + res.data.content.sessionId
          },
          success: function (res) {
            if (res.data.code == 1000) {
              // var imgData = QR.createQrCodeImg(res.data.list, { size: 300 });
              var codeUrl = res.data.list
              var coedData=res.data.data
                  that.setData({
                    codeUrl: codeUrl,
                    coedData: coedData,
                    isShowImg:true
                  })


              var orderId = that.data.orderId
              var out_trade_no = res.data.out_trade_no;
              var setData = {}
              var sett = {}
              sett.orderId = orderId
              sett.outTradeNo = out_trade_no
              setData.content = sett
              wx.request({
                url: javaApi + 'api/goods/order/updateOutTradeNo',
                method: "POST",
                data: setData,
                header: {
                  // "Content-Type": "application/x-www-form-urlencodeed",
                  'content-type': 'application/json',
                  "Cookie": JSESSIONID
                },
                success: function (da) {
                  if (da.data.code == 1000) {
                    var st = setTimeout(function () {
                      var size = that.setCanvasSize();
                      var codeUrl = that.data.codeUrl
                      //绘制二维码
                      that.createQrCode(codeUrl, "mycanvas", size.w, size.h);
                      that.setData({
                        maskHidden: true
                      });
                      clearTimeout(st);
                    }, 2000)
                    that.setData({
                      chaxun:true
                    })
                    wx.hideLoading()
                  } else {
                    wx.hideLoading()
                    wx.showToast({
                      title: res.data.message,
                      image: '../../images/icon_info.png',
                      duration: 3000
                    })
                  }
                }
              })
            }else{
              wx.hideLoading()
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

  wechat: function () {
    var that = this
    var LocalUrl = getApp().globalData.LocalUrl
    var orderId = that.data.orderId
    var totalPrice = that.data.totalPrice
    var showTotalPrice = that.data.showTotalPrice
    var orderNumber = that.data.orderNumber
    var javaApi = getApp().globalData.javaApi
    var JSESSIONID = that.data.JSESSIONID
    var content = {}
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
              // var orderId = that.data.orderId
              var out_trade_no = res.data.out_trade_no;
              var setData = {}
              var sett = {}
              sett.orderId = orderId
              sett.outTradeNo = out_trade_no
              setData.content = sett
              wx.request({
                url: javaApi + 'api/goods/order/updateOutTradeNo',
                method: "POST",
                data: setData,
                header: {
                  // "Content-Type": "application/x-www-form-urlencodeed",
                  'content-type': 'application/json',
                  "Cookie": JSESSIONID
                },
                success: function (da) {
                  // console.log(res)
                  if (da.data.code == 1000) {
                    wx.requestPayment({
                      'timeStamp': '' + res.data.list.timeStamp + '',
                      'nonceStr': res.data.list.nonceStr,
                      'package': res.data.list.package,
                      'signType': res.data.list.signType,
                      'paySign': res.data.list.paySign,
                      'success': function (res) {
                        if (res.errMsg == 'requestPayment:ok') {
                          wx.redirectTo({
                            url: '../service_goods_pay_succeed/service_goods_pay_succeed'
                          })
                        }else{
                          wx.showToast({
                            // title: '系统繁忙,请稍后再试',
                            title: '系统繁忙,请稍后再试',
                            image: '../../images/icon_info.png',
                            duration: 3000
                          })
                        }
                      },
                      'fail': function (res) {
                        if (res.errMsg == 'requestPayment:fail') {
                          wx.navigateTo({
                            url: '../service_goods_pay_error/service_goods_pay_error'
                          })
                        }
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '系统繁忙,请稍后再试',
                      image: '../../images/icon_info.png',
                      duration: 3000
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  onLoad: function (evet) {
    var that = this
    var JSESSIONID = ''
    //是否职业顾问
    wx.getStorage({
      key: 'amateurLevel',
      success: function (res) {
        that.setData({
          amateurLevel: true
        })
      },
      fail: function () {
        if (evet.store == 1){
          that.setData({
            amateurLevel: true
          })
        }else{
          that.setData({
            amateurLevel: false
          })
        }
      }
    })
    wx.getStorage({
      key: 'JSESSIONID',
      success: function (res) {
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
            // console.log(res)
            if (res.data.code == 1000) {
              // var orderNumber = res.data.content.orderNumber
              that.setData({
                showTotalPrice: res.data.content.orderPrice,
                totalPrice: res.data.content.orderPrice,
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
  }
})
