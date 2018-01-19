var cemeteryHttp = require("../../../utils/http/RequestForCemetery.js");
var toastUtil = require("../../../utils/ToastUtil.js");
var pageUtil = require("../../../utils/PageUtil.js")
var content;
Page({
  data: {
    orderNum: 0,
    GmOrderData: [{
    }],
  },
  onLoad: function (options) {
    content = this;
    var bespeakId = options.bespeakId
    getOrderDetails(bespeakId)
  },

});


function getOrderDetails(bespeakId) {
  var getRequest = {
    bespeakId: bespeakId
  }
  var getCallBack = {
    success: function (data, res) {
      content.setData({
        orderNum: data.orderNum,
        cemeteryName: data.cemeteryName,
        tombName: data.tombName,
        parkName: data.parkName,
        num: data.num,
        planSale: data.planSale,
        moneyDeposit: data.moneyDeposit,
        saleMoney: data.saleMoney,
        cemeteryReceive: data.cemeteryReceive,
        freeService: data.freeService,
        cemeterySales: data.cemeterySales,
        choiceService: data.choiceService,
        payRemarks: data.payRemarks,
        rowNumber: data.rowNumber,
        orderId: data.orderId
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("获取详情失败");
    }
  }
  cemeteryHttp.getOrderDetails(getRequest, getCallBack);
}