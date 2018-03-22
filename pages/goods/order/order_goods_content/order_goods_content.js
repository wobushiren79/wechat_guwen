var goodsPHPHttp = require("../../../../utils/http/RequestForPHPGoods.js");
var goodsHttp = require("../../../../utils/http/RequestForGoods.js");
var platformHttp = require("../../../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../../../utils/ToastUtil.js");
var storageKey = require("../../../../utils/storage/StorageKey.js");
var pageUtil = require("../../../../utils/PageUtil.js");
var checkPermissions = require("../../../../utils/CheckPermissions.js");
var content;

Page({
  data: {
    list_show: true,
    img_wrap: false,
    popup: false,
    package_a: false,
    mask:false
  },
  bind_list: function () {
    var that = this;
    that.setData({
      list_show: (!that.data.list_show)
    })
  },
  bind_img: function () {
    var that = this;
    that.setData({
      img_wrap: (!that.data.img_wrap)
    })
  },
  kehuphone: function () {
    callPhone('966188')
  },
  makePhone: function (e) {
    var phone = e.currentTarget.dataset.phone;
    callPhone(phone)
  },
  popup_close: function () {
    this.setData({
      popup: false,
      mask:false,
      package_a: false,
    })
  },
  package_b: function () {
    this.setData({
      get_goodsItemPerforms: [],
      package_a: false
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
        content.setData({
          amateurLevel: false
        })
      }
    })

    var orderId = evet.orderid
    getGoodsOrderDetails(orderId)
  },
  packages: function (e) {
    var that = this
    wx.showLoading({
      title: '请稍后',
    })
    var get_goodsItemPerforms = []
    var id = e.currentTarget.dataset.id
    var goodsItemPerforms = that.data.listData
    for (var i in goodsItemPerforms.goodsPackages) {
      if (goodsItemPerforms.goodsPackages[i].id == id) {
        get_goodsItemPerforms = goodsItemPerforms.goodsPackages[i].goodsItemPerforms
      }
    }
    that.setData({
      get_goodsItemPerforms: get_goodsItemPerforms,
      package_a: true
    })
    wx.hideLoading()
  },
  zhixing: function (e) {
    var performId = e.currentTarget.dataset.id
    findPerformInfoByPerformId(performId)
  }
});


/**
 * 订单详情
 */
function getGoodsOrderDetails(orderId) {
  var getRequest = {
    id: orderId
  }
  var getCallBack = {
    success: function (data, res) {
      var levelList = levelHandle(data.goodsOrderItemLevels, data.goodsItemPerforms, data.goodsPackages);
      content.setData({
        listData: data,
        levelData: levelList,
        orderId: orderId
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("获取详情失败");
    }
  }
  goodsHttp.getGoodsOrderDetails(getRequest, getCallBack)
}


/**
 * 获取执行详情
 */
function findPerformInfoByPerformId(performId) {
  var findRequest = {
    performId: performId
  }
  var findCallBack = {
    success: function (data, res) {
      content.setData({
        zhixing: data,
        popup: true,
        mask:true
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("获取详情失败");
    }
  }

 goodsHttp.findPerformInfoByPerformId(findRequest, findCallBack);
}

/**
 * 级别处理
 */
function levelHandle(levelRq, goodsItems, goodsPackages) {
  if (!levelRq || levelRq.length <= 0) {
    return null;
  }
  var levelData = wx.getStorageSync(storageKey.AMATEUR_LEVEL)
  if (levelData && levelData.length > 0) {
    var levelList = new Array();
    for (var i in levelData) {
      for (var f in levelRq) {
        if (levelData[i].systemLevel.id == levelRq[f].levelId) {
          levelList.push(levelRq[f]);
        }
      }
    }
    for (var i in levelList) {
      var commissionPrice = 0;
      if (goodsItems != null) {
        for (var f in goodsItems) {
          if (levelList[i].goodsItemId != null && levelList[i].goodsItemId == goodsItems[f].id) {
            commissionPrice += (goodsItems[f].specOrderedPrice * goodsItems[f].specOrderedNum * levelList[i].commissionRatio);
          }
        }
      }

      if (goodsPackages != null) {
        for (var f in goodsPackages) {
          if (levelList[i].goodsPackageId != null && levelList[i].goodsPackageId == goodsPackages[f].id) {
            commissionPrice += (goodsPackages[f].specOrderedPrice * goodsPackages[f].specOrderedNum * levelList[i].commissionRatio);
          }
        }
      }
      levelList[i].commissionPrice = commissionPrice;
    }
    return levelList;
  }
}

/**
 * 打电话
 */
function callPhone(phone) {
  if (phone == null)
    return
  wx.makePhoneCall({
    phoneNumber: phone,
  })
}