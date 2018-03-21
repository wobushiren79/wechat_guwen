//获取应用实例
var QR = require("../../../../utils/qrcode.js");
var util = require('../../../../utils/util.js')
var goodsHttp = require("../../../../utils/http/RequestForGoods.js");
var goodsPHPHttp = require("../../../../utils/http/RequestForPHPGoods.js");
var toastUtil = require("../../../../utils/ToastUtil.js");
var orderCenterHttp = require("../../../../utils/http/RequestForOrderCenter.js")
var PAYWAY_BY_QR_CODE = "PAYWAY_BY_QR_CODE";//二维码支付
var PAYWAY_BY_WECHAT = "PAYWAY_BY_WECHAT";//微信支付
var content;
var app = getApp()
var addPrice=0;
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
    deposit_price:0.00,
    getDeposit:0.00,
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
   * 抵扣定金计算改变支付订单金额
   */
  inpu:function(e){
    content=this
    if (content.data.deposit_price == 0){
      toastUtil.showToast("无可用定金");
      return ''
    }
    if (e.detail.value > content.data.deposit_price){
      content.setData({
        price: content.data.orderPrice,
      })
      toastUtil.showToast("定金过大");
      return ''
      // setTimeout(function () {
      //   //要延时执行的代码  
      // }, 1000) //延迟时间 这里是1秒
    }
    if (content.data.orderPrice < e.detail.value){
      content.setData({
        price: content.data.orderPrice 
      })
      toastUtil.showToast("定金过大");
      return ''
    }
    if (!e.detail.value == ''){
      var price = app.accuracyCalculation('-', 2, content.data.orderPrice , e.detail.value) 
      content.setData({
        price: price,
        getDeposit: e.detail.value
      })
    }else{
      content.setData({
        price: content.data.orderPrice,
      })
    }
  },
  /**
   * 线下支付
   */
  bind_moda: function () {
    content=this
    wx.showModal({
      title: '确认线下支付',
      content: '点击确认后，使用线下支付方式，包括现金刷卡收取等',
      success: function (res) {
        if (res.confirm) {
          var requestData = {}
          requestData.orderId = content.data.relateWorkId
          requestData.deposit = app.accuracyCalculation('*', 2, content.data.getDeposit, 100)
          requestData.paymentWay = 'offlinePay'
          requestData.relateType = 1
          requestData.relateId = content.data.orderId
          var price = app.accuracyCalculation('*', 2, content.data.price, 100)
          lockDeposit(requestData, price, 0)
        }
      }
    })
  },
  /**
   * 微信二维码支付
   */
  wechats: function () {
    content = this
    var requestData = {}
    requestData.orderId = content.data.relateWorkId
    requestData.deposit = app.accuracyCalculation('*', 2, content.data.getDeposit, 100)
    requestData.paymentWay = 'wechatPay'
    requestData.relateType = 1
    requestData.relateId = content.data.orderId
    var price = app.accuracyCalculation('*', 2, content.data.price, 100)
    lockDeposit(requestData, price,1)
  },

  /**
   *  调用微信自己的支付
   */
  wechat: function () {
    content = this
    var requestData = {}
    requestData.orderId = content.data.relateWorkId
    requestData.deposit = app.accuracyCalculation('*', 2, content.data.getDeposit, 100)
    requestData.paymentWay = 'wechatPay'
    requestData.relateType = 1
    requestData.relateId = content.data.orderId
    var price = app.accuracyCalculation('*', 2, content.data.price, 100)
    lockDeposit(requestData, price, 1)
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
    detailsByRelateid(evet.orderId)

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
      var orderPrice = app.accuracyCalculation('/', 2, data.orderPrice, 100)
      // debugger
      content.setData({
        price: orderPrice,
        showTotalPrice: data.showTotalPrice,
        totalPrice: data.showTotalPrice,
        orderPrice: orderPrice,
        orderNumber: data.orderNumber,
        orderId: orderId,
        relateWorkId: data.relateWorkId
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
  goodsHttp.payOffLine(payRequest, payCallBack);

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
                url: '/pages/goods/order/order_goods_pay_succeed/order_goods_pay_succeed'
              })
            } else {
              toastUtil.showToast("系统繁忙");
            }
          },
          'fail': function (res) {
            if (res.errMsg == 'requestPayment:fail') {
              wx.navigateTo({
                url: '/pages/goods/order/order_goods_pay_error/order_goods_pay_error'
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
  if (payPrice !=0){
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
  }else{
    toastUtil.showToast("支付为0");
    setTimeout(function () {
      toastUtil.showToast("请在线下");
    }, 1000) //延迟时间 这里是1秒 
  }
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
/**
 * 查询定金详情
 */
function detailsByRelateid(orderId) {
  var order_id = {}
  order_id.relateId = orderId
  order_id.relateType=1
  var createOrderCallBack = {
    success: function (data) {
      // debugger
      if (data.depositPaymentRecordList != undefined && data.depositPaymentRecordList.length > 0 && data.depositPaymentRecordList[0].relateBusinessId == orderId && data.depositPaymentRecordList[0].relateBusinessType == 'goods'){
        var deposit_price = app.accuracyCalculation('/', 2, data.depositSummary.availableDeposit, 100) + app.accuracyCalculation('/', 2, data.depositPaymentRecordList[0].deposit, 100)
        // debugger
        content.setData({
          deposit_price: deposit_price,  
          centerOrderId: data.depositSummary.orderId,
        })
      }else{
        if (data.depositSummary.availableDeposit){
          var deposit_price = app.accuracyCalculation('/', 2, data.depositSummary.availableDeposit, 100)
          content.setData({
            deposit_price: deposit_price,
            centerOrderId: data.depositSummary.orderId
          })
        }
      }

    },
    fail: function (data, res) {
      toastUtil.showToast(data)
    }
  }
  orderCenterHttp.detailsByRelateid(order_id, createOrderCallBack);
}
/**
 * 使用定金(绑定)
 */
function lockDeposit(orderId, payPrice,code) {
  var createOrderCallBack = {
    success: function (data) {
      // console.log(data)
      if (data == '锁定成功'){
        if (code  == 0){
          payOffLine(orderId.relateId, payPrice)
        }
        if (code == 1){
          wx.login({
            success: function (e) {
              wechatPay(orderId.relateId, payPrice, e.code, PAYWAY_BY_QR_CODE)
            }
          })
        }
      }else{
        toastUtil.showToast(data)
      }
       
    },
    fail: function (data, res) {
      toastUtil.showToast(data)
    }
  }
  goodsHttp.lockDeposit(orderId, createOrderCallBack);
}