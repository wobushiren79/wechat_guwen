//获取应用实例
var QR = require("../../../../utils/qrcode.js");
var util = require('../../../../utils/util.js')
var orderCenterHttp = require("../../../../utils/http/RequestForOrderCenter.js");
var goodsPHPHttp = require("../../../../utils/http/RequestForPHPGoods.js");
var toastUtil = require("../../../../utils/ToastUtil.js");

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
    showTotalPrice:0,
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
  bind_moda: function (e) {
    content=this
    if (e.detail.value.deposit== '') {
      toastUtil.showToast("定金不能为空")
      return false
    }
    if (!getApp().AmountVerification(e.detail.value.deposit)){
      toastUtil.showToast("金额不正确")
       return false
    }
    if (e.detail.value.deposit == 0) {
      toastUtil.showToast("定金不能为0")
      return false
    }
    var getData={}
    getData.orderId = content.data.orderId;
    getData.paymentWay ='offlinePay';
    getData.deposit = app.accuracyCalculation('*', 2, e.detail.value.deposit, 100);
    PayTheDepositdeposit(getData)
  },
  /**
   * 微信二维码支付
   */
  wechats: function () {
    var orderId = content.data.orderId
    var payPrice = content.data.orderPrice
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
    var payPrice = content.data.orderPrice
    wx.login({
      success: function (e) {
        wechatPay(orderId, payPrice, e.code, PAYWAY_BY_WECHAT)
      }
    })
  },


  onLoad: function (evet) {
    content = this;
    var orderId = evet.orderId
    content.setData({
      orderId: orderId
    })

  }
})




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
        url: '/pages/goods/order/order_goods_pay_succeed/order_goods_pay_succeed'
      })
    },
    fail: function (data, res) {
      wx.redirectTo({
        url: '/pages/goods/order/order_goods_pay_error/order_goods_pay_error'
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
 * 缴纳定金
 */
function PayTheDepositdeposit(createOrderData) {
  var createOrderCallBack = {
    success: function () {
      content.setData({
        asda: false,
      })
      toastUtil.showToastReWrite('缴纳成功')
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        }) 
      }, 1000) //延迟时间 这里是1秒 
    },
    fail: function (data, res) {
      toastUtil.showToast(data)
    }
  }
  orderCenterHttp.PayTheDepositdeposit(createOrderData, createOrderCallBack);
}
