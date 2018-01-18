var goodsPHPHttp = require("../../utils/http/RequestForPHPGoods.js");
var goodsHttp = require("../../utils/http/RequestForGoods.js");
var platformHttp = require("../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../utils/ToastUtil.js");
var storageKey = require("../../utils/storage/StorageKey.js");
var pageUtil = require("../../utils/PageUtil.js");
var checkPermissions = require("../../utils/CheckPermissions.js");
var content;
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
var amateurLevel;
var channelId;
var goodsId;
var packageId;

Page({
  data: {
    goods_number: 1,
    // 是否出现焦点
    indicatorDots: true,
    // 是否自动播放
    autoplay: false,
    // 自动播放间隔时间
    interval: 5000,
    // 滑动动画时间
    duration: 500,
    userInfo: {},
    isShow: false,
    hasCommission: false
  },
  onShareAppMessage: function () {
    var pathUrl = "";
    if (goodsId) {
      pathUrl = '/pages/service_content/service_content?goods_id=' + goodsId + "&channel_id=" + channelId
    } else if (packageId) {
      pathUrl = '/pages/service_content/service_content?package_id=' + goodsId + "&channel_id=" + channelId
    }
    return {
      title: '圆满人生公共殡葬服务平台',
      // path: '/pages/service_forward/service_forward?goods_id='+goods_id,
      path: pathUrl,
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
          image: '../../images/icon_info.png',
          // mask:true,
          duration: 2000
        })
      }
    }
  },

  onShow: function (e) {
    //功能显示，只有顾问和非职业顾问才能继续操作
    wx.getStorage({
      key: storageKey.PLATFORM_RESOURCE_CODES,
      success: function (res) {
        if (res && res.data)
          for (var i in res.data) {
            if (res.data[i] == "goods.advisor" || res.data[i] == "goods.advisor.amateur") {
              content.setData({
                isShow: true
              })
              getShoppingCartNumber();
              return
            }
          }
      },
    })

    getGoodsDetails(channelId, goodsId, packageId);
  },

  onLoad: function (e) {
    content = this;
    // channelId = wx.getStorageSync(storageKey.GOODS_CHANNEL).id;
    channelId = e.channel_id
    goodsId = e.goods_id
    packageId = e.package_id
  },
  popup: function () {
    content.setData({
      popup: true
    })
  },
  popup_close: function () {
    this.setData({
      popup: false
    })
  },
  //选择规格
  xuanzhe: function (e) {
    var that = this
    var goods_spec = that.data.goods_spec
    var xuanzhedata = goods_spec[e.target.dataset.index]
    var spec_price = goods_spec[e.target.dataset.index].spec_price
    that.setData({
      xuanzhe: e.target.dataset.index,
      xuanzhedata: xuanzhedata,
      goods_number: 1,
      spec_price: spec_price
    })
  },
  //点击数量添加
  add: function (e) {
    var that = this
    that.setData({
      goods_number: e.target.dataset.goods_number + 1,
    })
  },
  //点击数量减少
  reduce: function (e) {
    var that = this
    var goods_number = e.target.dataset.goods_number
    if (goods_number == 1) {
      that.setData({
        goods_number: goods_number,
      })
    } else {
      that.setData({
        goods_number: goods_number - 1,
      })
    }

  },
  /**
   * 直接购买
   */
  purchase: function () {
    var goods_number = content.data.goods_number
    var xuanzhedata = content.data.xuanzhedata
    xuanzhedata.number = goods_number
    var LocalUrl = getApp().globalData.LocalUrl
    var getDetailsRequest = {}

    getDetailsRequest.channelId = xuanzhedata.channel_id
    if (xuanzhedata.goods_id) {
      getDetailsRequest.goodsId = xuanzhedata.goods_id
      getDetailsRequest.goodsSpecId = xuanzhedata.goods_spec_id
    } else {
      getDetailsRequest.packageId = xuanzhedata.package_id
      getDetailsRequest.packageSpecId = xuanzhedata.package_spec_id
    }
    getGoodsSpecDetails(getDetailsRequest, goods_number)
  },
  /**
   * 加入购物车
   */
  cart: function () {
    var goods_number = content.data.goods_number
    var Goodsdata = content.data.xuanzhedata
    var setlist = content.data.list
    var spec_attr_id = content.data.spec_attr_id
    var goods_cate_id = content.data.goods_cate_id
    var formdata = {}
    if (setlist.is_package == 1) {
      formdata.goodsId = Goodsdata.package_id
      formdata.goodsSpecId = Goodsdata.package_spec_id
    } else {
      formdata.goodsId = Goodsdata.goods_id
      formdata.goodsSpecId = Goodsdata.goods_spec_id
    }

    formdata.classifyAttrId = spec_attr_id
    formdata.classifyId = goods_cate_id
    formdata.specNum = goods_number
    formdata.channelId = Goodsdata.channel_id
    formdata.isPackage = setlist.is_package

    var requestData = {
      list: [formdata]
    }
    addGoodsShopping(requestData);
  },

  /**
   * 购物车列表
   */
  cartlist: function () {
    //頁面跳轉
    wx.navigateTo({
      url: '../service_buy/service_buy'
    })
  }
})

/**
 * 获取商品详情
 */
function getGoodsDetails(channelId, goodsId, packageId) {
  var findGoodsInfoRequest = new Object();
  if (!channelId) {
    toastUtil.showToast("channelId为空");
    return
  }
  if (goodsId)
    findGoodsInfoRequest.goods_id = goodsId;
  if (packageId)
    findGoodsInfoRequest.package_id = packageId;

  findGoodsInfoRequest.channel_id = channelId;

  var findGoodsInfoCallBack = {
    success: function (data, res) {
      var list = res.data.list
      levelHandle(list.commission);
      if (list.is_package == 0) {
        var goods_cate_id = res.data.list.goods_cate_id
      } else {
        var goods_cate_id = res.data.list.package_cate_id
      }
      WxParse.wxParse('descrip_detail', 'html', list.descrip_detail, content, );
      var hasSpec = false;
      var showData = {
        list: list,
        channel: channelId,
        amateurLevel: parseFloat(amateurLevel),
        xuanzhe: 0,
        goods_number: 1,
        goods_cate_id: goods_cate_id,
        spec_attr_id: res.data.list.spec_attr_id,
      }
      if (goodsId)
        showData.goods_id = goodsId;
      if (packageId)
        showData.goods_id = packageId;

      if (res.data.list.specprice.length > 0) {
        showData.xuanzhedata = res.data.list.specprice[0];
        showData.spec_price = res.data.list.specprice[0].spec_price;
        showData.goods_spec = res.data.list.specprice;
        showData.chatxian = true;
      } else {
        showData.chatxian = false;
      }
      content.setData(showData)
    },
    fail: function () {
      toastUtil.showToast("获取详情失败");
    }
  }

  goodsPHPHttp.findGoodsInfo(findGoodsInfoRequest, findGoodsInfoCallBack);
}

/**
 * 获取购物车数量
 */
function getShoppingCartNumber() {
  var shoppingCartNumberCallBack = {
    success: function (data, res) {
      var shoppingTotalNumber = data.shoppingTotalNumber
      content.setData({
        shoppingTotalNumber: shoppingTotalNumber
      })
    },

  }
  var requestData = {
    channelId: 1
  }
  goodsHttp.getShoppingNumber(requestData, shoppingCartNumberCallBack);
}

/**
 * 加入购物车
 */
function addGoodsShopping(addShoppingCartRequest) {
  var addShoppingCartCallBack = {
    success: function () {
      toastUtil.showToast("加入成功");
      getShoppingCartNumber();
    },
    fail: function () {
      toastUtil.showToast("加入失败");
    }
  }
  goodsHttp.addGoodsShopping(addShoppingCartRequest, addShoppingCartCallBack);
}

/**
 * 获取商品规格详情
 */
function getGoodsSpecDetails(detailsRequest, goodsNumber) {
  var totla_price = 0;
  var detailsCallBack = {
    success: function (data, res) {
      for (var i in res.data.list) {
        res.data.list[i].specNum = goodsNumber
        totla_price += parseFloat(res.data.list[i].specNum) * parseFloat(res.data.list[i].spec_price)
      }
      //结算购物车数据
      wx.setStorageSync('formData', res.data.list)
      //缓存购物车列表
      wx.setStorageSync('getdatalist', res.data.list)
      //总价格
      wx.setStorageSync('totla_price', totla_price)
      wx.navigateTo({
        url: '../service_money/service_money'
      })
    },
    fail: function () {
      toastUtil.showToast("直接购买失败");
    }
  }
  goodsPHPHttp.findGoodsDetails(detailsRequest, detailsCallBack);
}

/**
 * 级别显示处理
 */
function levelHandle(commission){
  if (!commission || commission.length <= 0 ){
    return
  }
  var levelData = wx.getStorageSync(storageKey.AMATEUR_LEVEL)
  if (levelData && levelData.length > 0) {
    var levelList=new Array();
    var hasCommission=false;
    for (var i in levelData) {
      for (var f in commission){
        if (levelData[i].systemLevel.id == commission[f].amateur_id){
          levelData[i].commissionRatio = commission[f].commission; 
          levelData[i].commissionP = Math.round(levelData[i].commissionRatio * 100); 
          levelList.push(levelData[i]);
          hasCommission=true;
        }
      }
    }
    content.setData({
      hasCommission: hasCommission,
      levelList: levelList
    })
  } else {
    content.setData({
      hasCommission: false
    })
  }
}