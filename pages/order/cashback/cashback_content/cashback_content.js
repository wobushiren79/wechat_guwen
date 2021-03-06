var orderCenterHttp = require("../../../../utils/http/RequestForOrderCenter.js")
var toastUtil = require("../../../../utils/ToastUtil.js");
var storageKey = require("../../../../utils/storage/StorageKey.js");
var pageUtil = require("../../../../utils/PageUtil.js");
var modalUtil = require("../../../../utils/ModalUtil.js");
var content;
Page({
  data: {
    icon: "/images/dog_chang.jpg",
    icon2: "/images/dog.png",
    goods_cells: false,
    orderTotalPrice: "0",
    commissionTotalPrice: "0",
    realCommissionTotalPrice: "0"
  },
  bind_goods: function (e) {
    this.setData({
      goods_cells: !this.data.goods_cells
    })
  },
  onLoad: function (e) {
    content = this;
    getOrderDetails(e.orderId)
  },
  commissionRemark: function (e) {
    modalUtil.showModal("提成备注", e.currentTarget.dataset.remark)
  }
});
/**
 * 获取工单详情
 */
function getOrderDetails(orderId) {
  var getRequest = {
    orderId: orderId
  }
  var getCallBack = {
    success: function (data, res) {
      var get_data = []
      for (var i in data.listPerformRecord) {
        get_data.push(data.listPerformRecord[i].performPic.split(","))
      }
      var goodsList = []
      var orderTotalPrice = 0;
      var commissionTotalPrice = 0;
      var orderTotalPriceReal = 0;
      if (data.listGoodsDetailResponse)
        for (var i in data.listGoodsDetailResponse) {
          if (data.listGoodsDetailResponse[i].goodsOrderItemList)
            for (var j in data.listGoodsDetailResponse[i].goodsOrderItemList) {
              var goodsOrderItem = data.listGoodsDetailResponse[i].goodsOrderItemList[j];
              var goodsOrderItemPrice = goodsOrderItem.specOrderedPrice / 100;
              var goodsOrderItemId = goodsOrderItem.id;
              var goodsItemNum = goodsOrderItem.specOrderedNum;
              var commissionRatio = levelHandle(data.listGoodsDetailResponse[i].goodsOrderItemLevels, goodsOrderItemId, null);
              orderTotalPrice += goodsOrderItemPrice
              commissionTotalPrice += (goodsOrderItemPrice * commissionRatio * goodsItemNum)
              goodsOrderItem.commissionRatio = Math.round(commissionRatio * 100);
              goodsOrderItem.commissionPrice = goodsOrderItemPrice * goodsOrderItem.commissionRatio/100;
              goodsOrderItem.isPackage = 0;
              goodsList.push(goodsOrderItem)
            }
          if (data.listGoodsDetailResponse[i].goodsPackages)
            for (var j in data.listGoodsDetailResponse[i].goodsPackages) {
              var goodsPackageItem = data.listGoodsDetailResponse[i].goodsPackages[j];
              var goodsPackagePrice = goodsPackageItem.specOrderedPrice / 100;
              var goodsPackageId = goodsPackageItem.id;
              var goodsPackageNum = goodsPackageItem.specOrderedNum;
              var commissionRatio = levelHandle(data.listGoodsDetailResponse[i].goodsOrderItemLevels, null, goodsPackageId);
              orderTotalPrice += goodsPackagePrice;
              commissionTotalPrice += (goodsPackagePrice * commissionRatio * goodsPackageNum)
              goodsPackageItem.commissionRatio = Math.round(commissionRatio * 100);
              goodsPackageItem.commissionPrice = goodsPackagePrice * goodsPackageItem.commissionRatio / 100;
              goodsPackageItem.isPackage = 1;
              goodsList.push(goodsPackageItem)
            }

        }
      var realCommissionTotalPrice = 0;
      var commissionRemark = null;
      if (data.workOrderUserFinances) {
        for (var i in data.workOrderUserFinances) {
          if (data.workOrderUserFinances[i].userId == wx.getStorageSync(storageKey.PLATFORM_USER_ID)) {
            if (data.workOrderUserFinances[i].priceRelateReal != null) {
              realCommissionTotalPrice += (data.workOrderUserFinances[i].priceRelateReal / 100);
            }
            commissionRemark = data.workOrderUserFinances[i].financeRemark;
          }
        }
      }
      //应提成金额
      commissionTotalPrice = Math.round(commissionTotalPrice * 100) / 100;
      //订单金额
      orderTotalPrice = Math.round(orderTotalPrice * 100) / 100;
      //实际提成金额
      realCommissionTotalPrice = Math.round(realCommissionTotalPrice * 100) / 100;
      //实际订单金额
      if (data.workOrderFinance != null && data.workOrderFinance.financeConfirm == 1)
        orderTotalPriceReal = Math.round(data.workOrderFinance.orderTotalPriceReal * 100) / 10000;

      content.setData({
        content: data,
        get_data: get_data,
        orderId: orderId,
        goodsList: goodsList,
        orderTotalPrice: orderTotalPrice,
        commissionTotalPrice: commissionTotalPrice,
        realCommissionTotalPrice: realCommissionTotalPrice,
        commissionRemark: commissionRemark,
        orderTotalPriceReal: orderTotalPriceReal
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("获取详情失败");
    }
  }
  orderCenterHttp.detailsAll(getRequest, getCallBack);
}


/**
 * 级别显示处理
 */
function levelHandle(levelRq, goodsItemId, packageId) {
  if (!levelRq || levelRq.length <= 0) {
    return 0;
  }
  // var levelData = wx.getStorageSync(storageKey.AMATEUR_LEVEL)
  // if (levelData && levelData.length > 0) {
  var levelList = new Array();
  // for (var i in levelData) {
  for (var f in levelRq) {
    if (
      // levelData[i].systemLevel.levelType == levelRq[f].levelType
      // && levelData[i].systemLevel.levelName == levelRq[f].levelName&&
      levelRq[f].levelType == "orderC.build" && levelRq[f].valid == 1) {
      if (goodsItemId && goodsItemId == levelRq[f].goodsItemId) {
        return levelRq[f].commissionRatio;
      }
      if (packageId && packageId == levelRq[f].goodsPackageId) {
        return levelRq[f].commissionRatio;
      }
    }
  }
  // }
  return 0;
  // } else {
  //   return 0;
  // }
}