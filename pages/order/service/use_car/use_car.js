var orderCenterHttp = require("../../../utils/http/RequestForOrderCenter.js")
var toastUtil = require("../../../utils/ToastUtil.js");
var pageUtil = require("../../../utils/PageUtil.js");
var content;
Page({
  data: {
    businessType_chat: 0,
    ChatList: [
      '看墓',
      '回送客户',
      '门店',
      '接灰',
      '其他'
    ],
    customerAddressNew: '',
    yuansan: true,
    paiche: false
  },
  //验证空选项
  notNull: function (e) {
    if (e.detail.value == '') {
      wx.showToast({
        title: '不能为空',
        image: '../../../images/icon_info.png',
        duration: 2000
      })
    }
  },

  // 预约用车日期
  bindTimeChangess: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  //预约用车时间
  bindDateChanges: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //用车理由
  bindPickerChange_chat: function (e) {
    this.setData({
      businessType_chat: e.detail.value,
    })
  },
  //上车地点
  top_chat: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        var Address = res.address
        that.setData({
          top_chat: Address
        })
      }
    })
  },
  //目标地址
  spot: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        var Address = res.address
        that.setData({
          spot: Address
        })
      }
    })
  },
  formSubmit: function (e) {
    var r = /^\+?[1-9][0-9]*$/;　　//正整数 
    var ContentData = {}
    ContentData.busiId = content.data.orderId
    ContentData.seats = e.detail.value.seats
    // get_data.proposerName = e.detail.value.proposerName
    // get_data.proposerMobile = e.detail.value.proposerMobile
    ContentData.connecterName = e.detail.value.connecterName
    ContentData.connecterMobile = e.detail.value.connecterMobile
    ContentData.remark = e.detail.value.remark
    if (content.data.date && content.data.time){
      ContentData.preDate = content.data.date + ' ' + content.data.time + ':00'
    }
    ContentData.location = e.detail.value.location
    ContentData.reason = content.data.ChatList[content.data.businessType_chat]
    ContentData.targetLocation = e.detail.value.targetLocation

    createCarOrder(ContentData);
  },
  Cname: function (e) {
    this.setData({
      Cname: e.detail.value
    })
  },
  Clocation: function (e) {
    this.setData({
      top_chat: e.detail.value
    })
  },
  //调用手机号码方法验证手机号码
  checktels: function (e) {
    this.checkMobile(e.detail.value)
  },
  //调用手机号码方法验证手机号码
  checktel: function (e) {
    this.checkMobile(e.detail.value)
    this.setData({
      checkMobile: e.detail.value
    })
  },
  //手机号码验证
  checkMobile: function (sMobile) {
    if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(sMobile))) {
      wx.showToast({
        title: '号码不正确',
        image: '../../../images/icon_info.png',
        duration: 2000
      })
    } else {

    }
  },
  onShow: function () {
    var orderId = content.data.orderId;
    getCarInfo(orderId)
  },
  onLoad: function (e) {
    content = this;
    content.setData({
      orderId: e.orderId
    })
  }
});


/**
 * 获取用车详情
 */
function getCarInfo(orderId) {
  var getRequest = {
    orderId: orderId
  }
  var getCallBack = {
    success: function (data, res) {
      if (data.isCanCreate == 1) {
        if (data.listCarApplyLog.length > 0) {
          content.setData({
            web_data: data.listCarApplyLog[0],
            orderId: orderId
          })
        } else {
          wx.hideLoading()
          content.setData({
            web_data: false,
            orderId: orderId
          })
        }
      } else {
        wx.showModal({
          title: '圆满人生提示您',
          content: '此单现在不能发起用车申请',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    },
    fail: function () {

    }
  }
  orderCenterHttp.getCarInfo(getRequest, getCallBack)
}

/**
 * 创建用车申请
 */
function createCarOrder(createRequst) {
  if (!createRequst.preDate || createRequst.preDate.length == 0) {
    toastUtil.showToast("没有用车时间")
    return
  }
  if (!createRequst.connecterName || createRequst.connecterName.length == 0) {
    toastUtil.showToast("没有用车人")
    return
  }
  if (!createRequst.connecterMobile || !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(createRequst.connecterMobile))) {
    toastUtil.showToast("电话不正确")
    return
  }
  if (!createRequst.seats || createRequst.seats.length == 0) {
    toastUtil.showToast("乘车人数<1")
    return
  }
  if (!createRequst.targetLocation || createRequst.targetLocation.length == 0) {
    toastUtil.showToast("没有目的地")
    return
  }
  var createCallBack = {
    success: function (data, res) {
      wx.navigateBack({
        delta: 1
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("创建失败");
    }
  }
  orderCenterHttp.createCarOrder(createRequst, createCallBack)
}