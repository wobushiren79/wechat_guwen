var goodsPHPHttp = require("../../../../utils/http/RequestForPHPGoods.js");
var goodsHttp = require("../../../../utils/http/RequestForGoods.js");
var platformHttp = require("../../../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../../../utils/ToastUtil.js");
var storageKey = require("../../../../utils/storage/StorageKey.js");
var checkPermissions = require("../../../../utils/CheckPermissions.js");

var content;

var shoppingList;
Page({

  data: {
    edit: true,
    totla_price: 0,
  },
  bind_edit: function () {
    this.setData({
      edit: false,
      over: true
    })
  },
  bind_over: function () {
    this.setData({
      edit: true,
      over: false
    })
  },

  onShow: function () {
    var channelId = wx.getStorageSync(storageKey.GOODS_CHANNEL).id;
    getGoodsShoppingList(channelId)
  },
  onLoad: function () {
    content = this;
  },

  //点击减少数量
  reduce: function (e) {
    var shoppingCartId = e.currentTarget.dataset.id;
    var formData = content.data.formData
    var goodsNumber;
    for (var i in formData) {
      if (formData[i].id == shoppingCartId) {
        goodsNumber = formData[i].specNum - 1;
      }
    }
    updateShoppingCartGoodsNumber(shoppingCartId, goodsNumber)
  },
  //点击数量添加
  add: function (e) {
    var shoppingCartId = e.currentTarget.dataset.id;
    var formData = content.data.formData
    var goodsNumber;
    for (var i in formData) {
      if (formData[i].id == shoppingCartId) {
        goodsNumber = formData[i].specNum + 1;
      }
    }
    updateShoppingCartGoodsNumber(shoppingCartId, goodsNumber)
  },

  /**
 * 删除
 */
  del: function (e) {
    var shoppingId = e.target.dataset.id
    var index = e.target.dataset.index
    removeShoppingCartGoods(shoppingId, index);
  },

  /**
   * 更改数量
   */
  EventHandle: function (e) {
    var shoppingCartId = e.currentTarget.dataset.id;
    var goodsNumber = e.detail.value;
    updateShoppingCartGoodsNumber(shoppingCartId, goodsNumber)
  },
  /**
   * checkbox选择事件
   */
  check: function (e) {
    var isSelect = e.target.dataset.select;
    var shoppingId = e.target.dataset.id
    var formData = content.data.formData
    for (var i in formData) {
      if (formData[i].id == shoppingId) {
        formData[i].isSelect = !isSelect
      }
    }
    content.setData({
      formData: formData
    })
    changPrice();
  },
  /**
   * 提交数据 
   */
  formSubmit: function () {
    var oldFormData = content.data.formData
    var newFormData = new Array();
    for (var i in oldFormData) {
      if (oldFormData[i].isSelect) {
        newFormData.push(oldFormData[i]);
      }
    }
    if (newFormData.length == 0) {
      toastUtil.showToast("没有选择商品")
      return
    }

    var totla_price = content.data.totla_price
    //结算购物车数据
    wx.setStorageSync('formData', newFormData)
    //总价格
    wx.setStorageSync('totla_price', totla_price)
    wx.redirectTo({
      url: '/pages/goods/order/order_goods_write_orderinfo/order_goods_write_orderinfo'
    })
  },


})

/**
 * 获取购物车列表
 */
function getGoodsShoppingList(channelId) {
  var getShoppingListRequest = {
    pageSize: 1000,
    pageNumber: 1,
    content: { channelId: channelId }
  }
  var getShoppingListCallBack = {
    success: function (data, res) {
      shoppingList = data.content
      var userId = wx.getStorageSync(storageKey.PLATFORM_USER_ID)
      var goodsId = ''
      var channelId = ''
      var goodsSpecId = ''
      var packageId = ''
      var packageSpecId = ''
      for (var i in shoppingList) {
        if (i == 0) {
          if (shoppingList[i]['isPackage'] == 0) {
            goodsId += shoppingList[i]['goodsId'] + ','
            channelId += shoppingList[i]['channelId'] + ','
            goodsSpecId += shoppingList[i]['goodsSpecId'] + ','
          }
          if (shoppingList[i]['isPackage'] == 1) {
            packageSpecId += shoppingList[i]['goodsSpecId'] + ','
            packageId += shoppingList[i]['goodsId'] + ','
            channelId += shoppingList[i]['channelId'] + ','
          }

        } else {
          if (shoppingList[i]['isPackage'] == 0) {
            goodsId += shoppingList[i]['goodsId'] + ','
            channelId += shoppingList[i]['channelId'] + ','
            goodsSpecId += shoppingList[i]['goodsSpecId'] + ','
          }
          if (shoppingList[i]['isPackage'] == 1) {
            packageSpecId += shoppingList[i]['goodsSpecId'] + ','
            packageId += shoppingList[i]['goodsId'] + ','
            channelId += shoppingList[i]['channelId'] + ','
          }
        }
      }
      var str = new Object();
      str.goodsId = goodsId
      str.channelId = channelId
      str.goodsSpecId = goodsSpecId
      str.packageSpecId = packageSpecId
      str.packageId = packageId
      str.userId = userId
      findListGoodsDetails(str)
    },
    fail: function () {
      toastUtil.showToast("获取列表失败");
    }
  }
  goodsHttp.getGoodsShoppingList(getShoppingListRequest, getShoppingListCallBack);
}


/**
 * 获取列表商品详情
 */
function findListGoodsDetails(requestData) {
  var findListGoodsDetailsCallBack = {
    success: function (data, res) {
      var goodsDetailsList = res.data.list
      var class_name = res.data.class_name
      var totla_price = 0
      var formData = []
      for (var j in goodsDetailsList) {
        for (var i in shoppingList) {
          if ((shoppingList[i].goodsId == parseInt(goodsDetailsList[j].goods_id)
            && shoppingList[i].goodsSpecId == parseInt(goodsDetailsList[j].spec_id)
            && shoppingList[i].channelId == parseInt(goodsDetailsList[j].channel_id))
            || (shoppingList[i].goodsId == parseInt(goodsDetailsList[j].package_id)
              && shoppingList[i].goodsSpecId == parseInt(goodsDetailsList[j].spec_id)
              && shoppingList[i].channelId == parseInt(goodsDetailsList[j].channel_id))) {
            goodsDetailsList[j].id = shoppingList[i].id
            goodsDetailsList[j].specNum = shoppingList[i].specNum
            totla_price += parseInt(shoppingList[i].specNum) * parseFloat(goodsDetailsList[j].spec_price)
            goodsDetailsList[j].isSelect = true;
            formData.push(goodsDetailsList[j])
          }
        }
      }
      //分类名称
      wx.setStorageSync('class_name', class_name)
      //缓存购物车列表
      wx.setStorageSync('getdatalist', formData)
      content.setData({
        class_name: class_name,
        formData: formData
      })
      changPrice();
    },
    fail: function () {
      toastUtil.showToast("获取列表失败");
    }
  }
  goodsPHPHttp.findGoodsDetails(requestData, findListGoodsDetailsCallBack);
}

/**
 * 修改购物车商品数量
 */
function updateShoppingCartGoodsNumber(shoppingId, goodsNumber) {
  if (!shoppingId || !goodsNumber) {
    toastUtil.showToast("数据错误");
    return
  }
  if (isNaN(goodsNumber)) {
    toastUtil.showToast("数量格式错误");
    return;
  }
  if (goodsNumber <= 0) {
    toastUtil.showToast("数量小于1");
    return
  }
  var upShoppingCartRequest = {
    id: shoppingId,
    specNum: goodsNumber
  }
  var upShoppingCartCallBack = {
    success: function (data, res) {
      var formData = content.data.formData;
      for (var i in formData) {
        if (formData[i].id == shoppingId) {
          formData[i].specNum = goodsNumber;
        }
      }
      content.setData({
        formData: formData
      })
      changPrice();
    },
    fail: function (data, res) {
      toastUtil.showToast("更改数量失败");
    }
  }
  goodsHttp.upShopingCartNum(upShoppingCartRequest, upShoppingCartCallBack);
}

/**
 * 删除购物车商品
 */
function removeShoppingCartGoods(shoppingId, index) {
  var removeRequest = {
    shoppingCartIds: [shoppingId]
  }
  var removeCallBack = {
    success: function (data, res) {
      var formData = content.data.formData;
      delete formData[index]
      content.setData({
        formData: formData
      })
      changPrice();
    },
    fail: function (data, res) {
      toastUtil.showToast("删除失败");
    }
  }
  goodsHttp.removeShoppingCartGoods(removeRequest, removeCallBack);
}

/**
  * 改变价钱
  */
function changPrice() {
  var totalPrice = 0;
  var formData = content.data.formData;
  for (var i in formData) {
    if (formData[i].isSelect)
      totalPrice += (formData[i].specNum * formData[i].spec_price);
  }
  content.setData({
    totla_price: totalPrice
  })
}