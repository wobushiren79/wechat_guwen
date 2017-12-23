//获取应用实例
var QR = require("../../utils/qrcode.js");
var util = require('../../utils/util.js')
var goodsHttp = require("../../utils/http/RequestForGoods.js");
var goodsPHPHttp = require("../../utils/http/RequestForPHPGoods.js");
var toastUtil = require("../../utils/ToastUtil.js");

var PAYWAY_BY_QR_CODE = "PAYWAY_BY_QR_CODE";//二维码支付
var PAYWAY_BY_WECHAT = "PAYWAY_BY_WECHAT";//微信支付

var content;
var app = getApp()
Page({
  data: {
    chaxun: false,
    num: 20170202020202,
    money: 0,
    codeUrl: '',
    maskHidden: true,
    imagePath: '',
    orderPrice: 0,
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

  /**
   * 查询结果
   */
  orver: function () {
    var orderId = content.data.orderId
    findFinanceDetailByOrderId(orderId);
  },
  /**
   * 线下支付
   */
  bind_moda: function () {
    payOffLine(content.data.orderId, content.data.totalPrice);
  },
  /**
   * 微信二维码支付
   */
  wechats: function () {
    var orderId = content.data.orderId
    var payPrice = content.data.totalPrice
    wx.login({
      success: function (e) {
        wechatPay(orderId, payPrice, e.code, PAYWAY_BY_QR_CODE)
      }
    })
  },

  /**
   *  调用微信自己的支付
   */
  wechat: function () {
    var orderId = content.data.orderId
    var payPrice = content.data.totalPrice
    wx.login({
      success: function (e) {
        wechatPay(orderId, payPrice, e.code, PAYWAY_BY_WECHAT)
      }
    })
  },


  onLoad: function (evet) {
    content = this;
    //是否职业顾问
    wx.getStorage({
      key: 'amateurLevel',
      success: function (res) {
        content.setData({
          amateurLevel: true
        })
      },
      fail: function () {
        if (evet.store == 1) {
          content.setData({
            amateurLevel: true
          })
        } else {
          content.setData({
            amateurLevel: false
          })
        }
      }
    })
    findGoodsOrderByOrderId(evet.orderId);

  }
})


/**
 * 查询订单详情
 */
function findGoodsOrderByOrderId(orderId) {
  var findRequest = {
    orderId: orderId
  }
  var findCallBack = {
    success: function (data, res) {
      content.setData({
        showTotalPrice: data.orderPrice,
        totalPrice: data.orderPrice,
        orderNumber: data.orderNumber,
        orderId: orderId
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("查询失败")
    }
  }
  goodsHttp.findGoodsOrderByOrderId(findRequest, findCallBack);
}


/**
 * 线下支付
 */
function payOffLine(orderId, payPrice) {
  if (!orderId) {
    toastUtil.showToast("没有orderId")
    return
  }
  if (!payPrice) {
    toastUtil.showToast("没有payPrice")
    return
  }

  var payRequest = {
    orderId: orderId,
    actualPayment: payPrice,
  }
  var payCallBack = {
    success: function (data, res) {
      wx.redirectTo({
        url: '../service_goods_pay_succeed/service_goods_pay_succeed'
      })
    },
    fail: function (data, res) {
      wx.redirectTo({
        url: '../service_goods_pay_error/service_goods_pay_error'
      })
    }
  }
  wx.showModal({
    title: '确认线下支付',
    content: '点击确认后，使用线下支付方式，包括现金刷卡收取等',
    success: function (res) {
      if (res.confirm) {
        goodsHttp.payOffLine(payRequest, payCallBack);
      }
    }
  })
}


/**
 * 关联订单
 */
function updateOutTradeNo(orderId, outTradeNo, payType, payInfo) {
  var upRequest = {
    orderId: orderId,
    outTradeNo: outTradeNo
  }
  var upCallBack = {
    success: function (data, res) {
      if (payType == PAYWAY_BY_QR_CODE) {
        var codeUrl = payInfo.data.list
        var coedData = payInfo.data.data
        var size = content.setCanvasSize();
        content.createQrCode(codeUrl, "mycanvas", size.w, size.h);
        content.setData({
          codeUrl: codeUrl,
          coedData: coedData,
          isShowImg: true,
          chaxun: true,
          maskHidden: true
        })
      } else if (payType == PAYWAY_BY_WECHAT) {
        wx.requestPayment({
          'timeStamp': '' + payInfo.data.list.timeStamp + '',
          'nonceStr': payInfo.data.list.nonceStr,
          'package': payInfo.data.list.package,
          'signType': payInfo.data.list.signType,
          'paySign': payInfo.data.list.paySign,
          'success': function (res) {
            if (res.errMsg == 'requestPayment:ok') {
              wx.redirectTo({
                url: '../service_goods_pay_succeed/service_goods_pay_succeed'
              })
            } else {
              toastUtil.showToast("系统繁忙");
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
      }
    },
    fail: function (data, res) {
      toastUtil.showToast("关联订单失败");
    }
  }
  goodsHttp.updateOutTradeNo(upRequest, upCallBack)

}

/**
 * 统一下单
 */
function wechatPay(orderId, payPrice, code, payType) {
  var payRequest = {
    orderId: orderId,
    total_fee: payPrice,
    code: code
  }
  var payCallBack = {
    success: function (data, res) {
      var outTradeNo = res.data.out_trade_no;
      updateOutTradeNo(orderId, outTradeNo, payType, res)
    },
    fail: function (data, res) {
      toastUtil.showToast("统一下单失败");
    }
  }
  goodsPHPHttp.wechatPay(payRequest, payCallBack);
}

/**
 * 查询财务详情
 */
function findFinanceDetailByOrderId(orderId) {
  var findRequest = {
    id: orderId
  }
  var findCallBack = {
    success: function (data, res) {
      var paymentStatus = data.paymentStatus
      var content = "";
      if (paymentStatus == 0) {
        content = '订单未支付';
      } else {
        content = '订单已支付成功';
      }
      wx.showModal({
        title: "圆满人生提示您",
        content: content,
        confirmText: '确认',
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("查询失败");
    }
  }
  goodsHttp.findFinanceDetailByOrderId(findRequest, findCallBack)
}