var goodsPHPHttp = require("../../../../utils/http/RequestForPHPGoods.js");
var goodsHttp = require("../../../../utils/http/RequestForGoods.js");
var platformHttp = require("../../../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../../../utils/ToastUtil.js");
var storageKey = require("../../../../utils/storage/StorageKey.js");
var pageUtil = require("../../../../utils/PageUtil.js");
var checkPermissions = require("../../../../utils/CheckPermissions.js");
var content;

var serviceWay = 0;
Page({
  data: {
    show: false,
    list_show: true,
    xuyao: '不需要发票',
    levelId: false,
    levelType: '',
    levelName: '',
    orderType: 1,
    date: "请选择日期",
    time: "请选择时间",
    btn_1: true
  },
  onUnload: function () {
    wx.removeStorageSync(storageKey.ORDER_CENTER_DETAIL)
  },
  bind_list: function () {
    var that = this;
    that.setData({
      list_show: (!that.data.list_show)
    })
  },
  // 及时服务和预约服务
  bind_btn_1: function () {
    serviceWay = 0;
    this.setData({
      btn_1: true,
      btn_2: false
    })
  },
  bind_btn_2: function () {
    serviceWay = 1;
    this.setData({
      btn_1: false,
      btn_2: true
    })
  },
  bindDateChange: function (e) {
    console.log("1")
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  onLoad: function () {
    wx.removeStorageSync(storageKey.ORDER_CENTER_DETAIL)
    serviceWay = 0;
    content = this;
    content.setData({
      channel_id: wx.getStorageSync(storageKey.GOODS_CHANNEL),
    })

    // 取出购物车数据
    getFormData();
  },
  onShow: function () {
    //获取默认地址
    findDefaultAddress();
    //取出客户信息
    // getServiceInfo();
    //取出发票信息
    getInvoiceInfo();
    //取出关联工单信息
    getOrderCenterDetail();
  },


  bindFormSubmit: function (e) {
    if (!checkPermissions.hasGoodsAdvisorAmateur() && !checkPermissions.hasGoodsAdvisor()) {
      toastUtil.showToast("没有权限下单");
      return;
    };
    var that = this
    var r = /^\+?[1-9][0-9]*$/;　　//正整数
    var orderdata = {}
    var getdata = {}
    var goodsOrder = {}
    var goodsOrderItems = []
    var goodsPackages = []
    var goodsInvoice = {}
    var goodsServiceInfo = {}
    //渠道
    // var channel_id=that.data.channel_id
    var channel_id = 2
    //购物车数据
    var formData = that.data.formData
    //分类数据
    var class_name = that.data.class_name
    //总单价
    var totla_price = that.data.totla_price
    //客户信息
    var defaultAddress = that.data.defaultAddress;
    if (defaultAddress == null || defaultAddress.length == 0) {
      toastUtil.showToast("没有选择地址");
      return;
    }
    //发票信息
    var fapiao = that.data.fapiao
    //渠道ID
    goodsOrder.orderChannel = channel_id
    //关联人id
    goodsOrder.connectId = ''
    //下单备注
    goodsOrder.orderComment = e.detail.value.orderComment
    goodsOrder.customerName = defaultAddress.recipientName
    goodsOrder.customerPhone = defaultAddress.recipientPhone

    if (checkPermissions.hasGoodsAdvisorAmateur()) {
      //非职业顾问下单
      goodsOrder.orderType = 2
    };
    if (checkPermissions.hasGoodsAdvisor()) {
      //职业顾问下单
      goodsOrder.orderType = 1
    };


    if (!that.data.orderCenterDetail) {
      toastUtil.showToast("没有关联工单");
      return
    }
    goodsOrder.relateWorkId = that.data.orderCenterDetail.workOrder.id
    //是否需要发票
    if (fapiao) {
      goodsOrder.needInvoice = fapiao.needInvoice
    } else {
      goodsOrder.needInvoice = 0
    }

    //订单总金额
    var num4 = r.test(parseFloat(totla_price))
    if (num4) {
      goodsOrder.showTotalPrice = parseFloat(totla_price) * 100
    } else {
      var start = totla_price.toString().indexOf('.');
      var b = totla_price.toString().substring(start + 1)
      if (b.length > 1) {
        goodsOrder.showTotalPrice = parseFloat(totla_price.toString().replace('.', ''))
      } else {
        goodsOrder.showTotalPrice = parseFloat(totla_price.toString().replace('.', '') + '0')
      }
    }
    //顾问总金额
    var totalPrice = that.data.dviser_Price
    goodsOrder.totalPrice = totalPrice * 100
    getdata.goodsOrder = goodsOrder
    // console.log(formData)
    //商品ID
    for (var i in formData) {
      if (formData[i].is_package == 1) {
        var packagelist = {}
        var goodsOrderItemss = []
        for (var j in formData[i].goods) {
          var goodsList = {}
          goodsList.goodsId = formData[i].goods[j].goods_id
          goodsList.goodsSpecId = formData[i].goods[j].goods_spec_id
          goodsList.classifyAttrId = formData[i].goods[j].class_attr_id
          goodsList.classifyId = formData[i].goods[j].goods_class_id
          goodsList.specOrderedNum = formData[i].goods[j].goods_spec_number
          goodsList.specOrderedVolume = formData[i].goods[j].spec_name
          goodsList.specAlias = formData[i].goods[j].spec_alias
          goodsList.currentDiscount = 1
          goodsList.specOrderedAttr = formData[i].goods[j].name
          goodsList.specNumber = formData[i].goods[j].goods_number
          goodsList.titleImg = formData[i].goods[j].title_img
          goodsList.unit = formData[i].goods[j].unit
          goodsList.specName = formData[i].goods[j].spec_name
          goodsOrderItemss.push(goodsList)
        }
        packagelist.goodsOrderItems = goodsOrderItemss
        packagelist.packageId = parseInt(formData[i].package_id)
        packagelist.packageSpecId = parseInt(formData[i].spec_id)

        var num2 = r.test(parseFloat(formData[i].spec_price))
        if (num2) {
          packagelist.specOrderedPrice = parseFloat(formData[i].spec_price) * 100
        } else {
          var start = formData[i].spec_price.indexOf('.');
          var b = formData[i].spec_price.substring(start + 1)
          if (b.length > 1) {
            packagelist.specOrderedPrice = parseFloat(formData[i].spec_price.replace('.', ''))
          } else {
            packagelist.specOrderedPrice = parseFloat(formData[i].spec_price.replace('.', '') + '0')
          }
        }
        packagelist.specOrderedNum = parseInt(formData[i].specNum)
        packagelist.specOrderedVolume = formData[i].package_name
        packagelist.specAlias = formData[i].spec_alias
        packagelist.currentDiscount = 1
        packagelist.specOrderedAttr = formData[i].class_name
        packagelist.titleImg = formData[i].title_img
        packagelist.unit = formData[i].unit
        packagelist.specName = formData[i].spec_name
        //提成级别
        var listGoodsOrderItemsLevel = new Array();
        // var listCommission = levelHandle(formData[i].commission)
        var listCommission = formData[i].commission
        if (listCommission != null)
          for (var h in listCommission) {
            var goodsOrderItemsLevel = new Object();
            var commissionItem = listCommission[h];
            goodsOrderItemsLevel.levelName = commissionItem.levelName;
            goodsOrderItemsLevel.levelType = commissionItem.type;
            goodsOrderItemsLevel.levelId = commissionItem.amateur_id;
            goodsOrderItemsLevel.commissionRatio = commissionItem.commission;
            listGoodsOrderItemsLevel.push(goodsOrderItemsLevel);
          }
        packagelist.listGoodsOrderItemsLevel = listGoodsOrderItemsLevel
        //  goodslist.ementPrice = parseFloat(formData[i].ement_price)
        var num1 = r.test(parseFloat(formData[i].ement_price))
        if (num1) {
          packagelist.ement_price = parseFloat(formData[i].ement_price) * 100
        } else {
          var start = formData[i].ement_price.indexOf('.');
          var b = formData[i].ement_price.substring(start + 1)
          if (b.length > 1) {
            packagelist.ement_price = parseFloat(formData[i].ement_price.replace('.', ''))
          } else {
            packagelist.ement_price = parseFloat(formData[i].ement_price.replace('.', '') + '0')
          }
        }
        // goodslist.adviserPrice = parseFloat(formData[i].adviser_price)
        var num = r.test(parseFloat(formData[i].adviser_price))
        if (num) {
          packagelist.adviserPrice = parseFloat(formData[i].adviser_price) * 100
        } else {
          var start = formData[i].adviser_price.indexOf('.');
          var b = formData[i].adviser_price.substring(start + 1)
          var d = b.length
          if (b.length > 1) {
            packagelist.adviserPrice = parseFloat(formData[i].adviser_price.replace('.', ''))
          } else {
            packagelist.adviserPrice = parseFloat(formData[i].adviser_price.replace('.', '') + '0')
          }
        }
        packagelist.specNumber = formData[i].package_number
        packagelist.classifyId = parseInt(formData[i].package_class_id)
        packagelist.classifyAttrId = parseInt(formData[i].class_attr_id)
        goodsPackages.push(packagelist)
      } else {
        var goodslist = {}

        goodslist.goodsId = parseInt(formData[i].goods_id)
        goodslist.goodsSpecId = parseInt(formData[i].spec_id)
        var num2 = r.test(parseFloat(formData[i].spec_price))
        if (num2) {
          goodslist.specOrderedPrice = parseFloat(formData[i].spec_price) * 100
        } else {
          var start = formData[i].spec_price.indexOf('.');
          var b = formData[i].spec_price.substring(start + 1)
          if (b.length > 1) {
            goodslist.specOrderedPrice = parseFloat(formData[i].spec_price.replace('.', ''))
          } else {
            goodslist.specOrderedPrice = parseFloat(formData[i].spec_price.replace('.', '') + '0')
          }
        }
        goodslist.specOrderedNum = parseInt(formData[i].specNum)
        goodslist.specOrderedVolume = formData[i].goods_name
        goodslist.specAlias = formData[i].spec_alias
        goodslist.currentDiscount = 1
        goodslist.specOrderedAttr = formData[i].class_name
        goodslist.titleImg = formData[i].title_img
        goodslist.unit = formData[i].unit
        goodslist.specName = formData[i].spec_name
        //提成级别
        var listGoodsOrderItemsLevel = new Array();
        // var listCommission = levelHandle(formData[i].commission)
        var listCommission = formData[i].commission
        if (listCommission != null)
          for (var h in listCommission) {
            var goodsOrderItemsLevel = new Object();
            var commissionItem = listCommission[h];
            goodsOrderItemsLevel.levelName = commissionItem.levelName;
            goodsOrderItemsLevel.levelType = commissionItem.type;
            goodsOrderItemsLevel.levelId = commissionItem.amateur_id;
            goodsOrderItemsLevel.commissionRatio = commissionItem.commission;
            listGoodsOrderItemsLevel.push(goodsOrderItemsLevel);
          }
        goodslist.listGoodsOrderItemsLevel = listGoodsOrderItemsLevel
        //  goodslist.ementPrice = parseFloat(formData[i].ement_price)
        var num1 = r.test(parseFloat(formData[i].ement_price))
        if (num1) {
          goodslist.ement_price = parseFloat(formData[i].ement_price) * 100
        } else {
          var start = formData[i].ement_price.indexOf('.');
          var b = formData[i].ement_price.substring(start + 1)
          if (b.length > 1) {
            goodslist.ement_price = parseFloat(formData[i].ement_price.replace('.', ''))
          } else {
            goodslist.ement_price = parseFloat(formData[i].ement_price.replace('.', '') + '0')
          }
        }
        // goodslist.adviserPrice = parseFloat(formData[i].adviser_price)
        var num = r.test(parseFloat(formData[i].adviser_price))
        if (num) {
          goodslist.adviserPrice = parseFloat(formData[i].adviser_price) * 100
        } else {
          var start = formData[i].adviser_price.indexOf('.');
          var b = formData[i].adviser_price.substring(start + 1)
          var d = b.length
          if (b.length > 1) {
            goodslist.adviserPrice = parseFloat(formData[i].adviser_price.replace('.', ''))
          } else {
            goodslist.adviserPrice = parseFloat(formData[i].adviser_price.replace('.', '') + '0')
          }
        }
        goodslist.specNumber = formData[i].goods_number
        goodslist.classifyId = parseInt(formData[i].goods_class_id)
        goodslist.classifyAttrId = parseInt(formData[i].class_attr_id)
        goodsOrderItems.push(goodslist)
        // console.log(goodslist)
      }
    }
    getdata.goodsOrderItems = goodsOrderItems
    getdata.goodsPackages = goodsPackages
    //发票信息组装
    if (fapiao) {
      goodsInvoice.titleType = fapiao.titleType
      goodsInvoice.title = fapiao.title
      goodsInvoice.companyTaxId = fapiao.companyTaxId
      goodsInvoice.invoiceRemark = fapiao.invoiceRemark
      goodsInvoice.receiptName = fapiao.receiptName
      goodsInvoice.receiptPhone = fapiao.receiptPhone
      goodsInvoice.receiptLocation = fapiao.receiptLocation
    }
    getdata.goodsInvoice = goodsInvoice
    if (defaultAddress) {
      goodsServiceInfo.serviceWay = serviceWay;
      if (serviceWay == 1) {
        // goodsServiceInfo.selfDelivery = kehu.selfDelivery
        // goodsServiceInfo.selfDeliveryTime = kehu.selfDeliveryTime
        if (content.data.date.indexOf("日期") >= 0 || content.data.time.indexOf("时间") >= 0) {
          toastUtil.showToast("没有选择时间");
          return;
        }
        var bookTime = content.data.date + " " + content.data.time + ":00";
        goodsServiceInfo.bookTime = bookTime;
      }
      goodsServiceInfo.contact = defaultAddress.recipientName
      goodsServiceInfo.contactPhone = defaultAddress.recipientPhone
      goodsServiceInfo.serviceLocation = defaultAddress.address

    }
    getdata.goodsServiceInfo = goodsServiceInfo

    //关联此单的角色
    var listUserLevel = getAllUserLevel();
    getdata.listUserLevel = listUserLevel;

    // 创建订单
    createGoodsOrder(getdata)

  },
  price: function () {
    var price = this.data.price
    this.setData({
      price: !price
    })
  },
});


/**
 * 创建订单
 */
function createGoodsOrder(createRequest) {
  var createCallBack = {
    success: function (data, res) {
      wx.redirectTo({
        url: '/pages/goods/order/order_goods_submit/order_goods_submit?orderId=' + data.orderId
      })
    },
    fail: function (data, res) {
      toastUtil.showToast(data);
    }
  }
  goodsHttp.createGoodsOrder(createRequest, createCallBack)
}

/**
 * 获取服务信息
 */
function getServiceInfo() {
  var serviceInfo = wx.getStorageSync(storageKey.GOODS_ORDER_SERVICE_INFO);
  if (serviceInfo)
    content.setData({
      kehu: serviceInfo,
      show: true
    })
}

/**
 * 获取发票信息
 */
function getInvoiceInfo() {
  var invoiceInfo = wx.getStorageSync(storageKey.GOODS_ORDER_INVOICE_INFO);
  var showInvoice = new Array();
  if (invoiceInfo.receiptName) {
    showInvoice.push({
      name: "收件人",
      content: invoiceInfo.receiptName
    })
  }
  if (invoiceInfo.receiptPhone) {
    showInvoice.push({
      name: "收件人电话",
      content: invoiceInfo.receiptPhone
    })
  }
  if (invoiceInfo.receiptLocation) {
    showInvoice.push({
      name: "收件人地址",
      content: invoiceInfo.receiptLocation
    })
  }
  if (invoiceInfo.titleType) {
    if (invoiceInfo.titleType == 1) {
      if (invoiceInfo.title)
        showInvoice.push({
          name: "公司",
          content: invoiceInfo.title
        })
    } else {
      showInvoice.push({
        name: "个人",
        content: invoiceInfo.title
      })
    }
  }
  if (invoiceInfo.companyTaxId) {
    showInvoice.push({
      name: "税号",
      content: invoiceInfo.companyTaxId
    })
  }
  if (invoiceInfo.invoiceRemark) {
    showInvoice.push({
      name: "备注",
      content: invoiceInfo.invoiceRemark
    })
  }

  if (invoiceInfo) {
    content.setData({
      invoiceInfo: showInvoice,
      fapiao: invoiceInfo,
      xuyao: '需要发票'
    })
  } else {
    content.setData({
      invoiceInfo: showInvoice,
      xuyao: '不需要发票'
    })
  }
}

/**
 * 获取提交商品
 */
function getFormData() {
  var formData = wx.getStorageSync(storageKey.GOODS_ORDER_FORMDATA);
  var goodsNumber = 0;
  var advisorTotalPrice = 0;
  var customerTotalPrice = 0;
  var className = new Array();
  for (var i in formData) {
    goodsNumber += formData[i].specNum;
    advisorTotalPrice += formData[i].adviser_price * formData[i].specNum
    customerTotalPrice += formData[i].spec_price * formData[i].specNum
    className.push(formData[i].class_name);
  }
  content.setData({
    formData: formData,
    goodsnumber: goodsNumber,
    dviser_Price: advisorTotalPrice,
    totla_price: customerTotalPrice,
    class_name: Array.from(new Set(className)),
  })

}

/**
 * 获取默认地址
 */
function findDefaultAddress() {
  var findDefaultAddressCallBack = {
    success: function (data, res) {
      data.addressStr = data.address.split(",").join("");
      content.setData({
        defaultAddress: data
      })
    },
    fail: function () {
      toastUtil.showToast("获取地址失败");
    }
  }
  goodsHttp.findServiceInfoDefaultAddress(null, findDefaultAddressCallBack)
}

function getOrderCenterDetail() {
  var orderCenterDetail = wx.getStorageSync(storageKey.ORDER_CENTER_DETAIL);
  if (orderCenterDetail && orderCenterDetail.workOrder) {
    content.setData({
      orderCenterDetail: orderCenterDetail
    })
    var userBuildId;
    if (orderCenterDetail.workOrder.orderBelongUserId != null) {
      userBuildId = orderCenterDetail.workOrder.orderBelongUserId;
    } else {
      userBuildId = orderCenterDetail.workOrder.createdBy;
    }
    getUserLevel(userBuildId);
  }
}

/**
 * 级别处理
 */
// function levelHandle(commission) {
//   if (!commission || commission.length <= 0 ) {
//     return null;
//   }
//   var levelData = wx.getStorageSync(storageKey.AMATEUR_LEVEL)
//   if (levelData && levelData.length > 0) {
//     var levelList = new Array();
//     for (var i in levelData) {
//       for (var f in commission) {
//         if (levelData[i].systemLevel.id == commission[f].amateur_id) {
//           levelList.push(commission[f]);
//         }
//       }
//     }
//     return levelList;
//   }
// }

/**
 * 获取此下单关联的角色
 */
function getAllUserLevel() {
  var listUserLevel = new Array();
  // var userId = wx.getStorageSync(storageKey.PLATFORM_USER_ID);
  // var levelData = wx.getStorageSync(storageKey.AMATEUR_LEVEL);
  // if (levelData && levelData.length > 0) {
  //   for (var i in levelData) {
  //     var userLevel = {
  //       levelId: levelData[i].systemLevel.id,
  //       levelType: levelData[i].systemLevel.levelType,
  //       levelName: levelData[i].systemLevel.levelName,
  //       userId: userId
  //     }
  //     listUserLevel.push(userLevel);
  //   }
  // }

  var buildLevelData = content.data.buildUserLevel;
  if (buildLevelData == null || buildLevelData.systemLevel == null) {
    return listUserLevel
  }
  var orderCenterDetail = content.data.orderCenterDetail;
  if (orderCenterDetail && orderCenterDetail.workOrder) {
    var userLevel = {
      levelId: buildLevelData.systemLevel.id,
      levelType: buildLevelData.systemLevel.levelType,
      levelName: buildLevelData.systemLevel.levelName
    }
    if (orderCenterDetail.workOrder.orderBelongUserId != null) {
      userLevel.userId = orderCenterDetail.workOrder.orderBelongUserId;
    } else {
      userLevel.userId = orderCenterDetail.workOrder.createdBy;
    }
    listUserLevel.push(userLevel);
  }
  return listUserLevel;
}

/**
 * 查询用户级别
 */
function getUserLevel(userId) {
  var queryLevelRequest = {
    userIds: [userId]
  }
  var queryLevelCallBack = {
    success: function (data, res) {
      if (data.resultList && data.resultList.length > 0)
        for (var i in data.resultList) {
          if (data.resultList[i].systemLevel.levelType == "orderC.build") {
            content.setData({
              buildUserLevel: data.resultList[i]
            })
          }
        }
    },
    fail: function (data, res) {
      toastUtil.showToast("查询级别失败");
    }
  }
  platformHttp.queryUserLevel(queryLevelRequest, queryLevelCallBack);
}
