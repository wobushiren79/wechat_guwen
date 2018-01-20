 var goodsPHPHttp = require("../../utils/http/RequestForPHPGoods.js");
var platformHttp = require("../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../utils/ToastUtil.js");
var storageKey = require("../../utils/storage/StorageKey.js");
var checkPermissions = require("../../utils/CheckPermissions.js");
var content;
//获取应用实例
var app = getApp()
Page({
  data: {
    num: '20',
    service: "24",
    money: "240",
    service_num: "7.4",
    icon_service: "/images/index_icon_service.png",
    icon_cem: "/images/index_icon_cem.png",
    icon_plan: "/images/index_icon_plan.png",
    icon_right: "/images/icon_right.png",
    role: '',
    // 是否出现焦点
    indicatorDots_banner: true,
    // 是否自动播放
    autoplay: true,
    // 自动播放间隔时间
    interval_banner: 3000,
    // 滑动动画时间
    duration: 500,
    circular: true,
    vertical: true,
    Gmlogin: 0
  },
  onShow: function () {
    getAllChannel();
    getCreditInfo();
    var that = this
    var platform = getApp().globalData.platform
    getLabelTag();
  },
  onLoad: function () {
    content = this;
  },
  call_phone: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone, //仅为示例，并非真实的电话号码
      fail: function (res) {
        wx.showToast({
          title: '拨打电话失败',
          image: '/images/icon_info.png',
          duration: 3000
        })
      }
    })
  },
  /**
   * 签到
   */
  sign: function () {
    userSign();
  },

  bind_go_c:function(){
    wx.navigateTo({
      url: '/pages/other/mystore/store_list/store_list',
    })
  },


  /**
  * 新建公墓单
  */
  gongmu: function () {
    var hasOrderCenterExecutor = checkPermissions.hasOrderCenterExecutor();
    var hasOrderCenterBuilder = checkPermissions.hasOrderCenterBuilder();
    if (!hasOrderCenterExecutor && !hasOrderCenterBuilder) {
      toastUtil.showToast("没有权限");
      return
    }
    if (hasOrderCenterExecutor && hasOrderCenterBuilder) {
      wx.navigateTo({
        url: '/pages/order/order_create/order_create',
      })
      return
    } else if (hasOrderCenterBuilder && !hasOrderCenterExecutor){
      wx.navigateTo({
        url: '/pages/order/order_create_easy/order_create_easy',
      })
      return
    }else{
      toastUtil.showToast("没有权限");
      return
    }
},
  /**
   * 接单表
   */
  order: function () {
    var hasOrderCenterExecutor = checkPermissions.hasOrderCenterExecutor();
    var hasOrderCenterBuilder = checkPermissions.hasOrderCenterBuilder();
    if (!hasOrderCenterExecutor && !hasOrderCenterBuilder) {
      toastUtil.showToast("没有接单权限");
      return
    }
    if (hasOrderCenterExecutor && hasOrderCenterBuilder){
      wx.navigateTo({
        url: '/pages/order/service/service_list_wait/service_list_wait',
      })
      return
    } else if (!hasOrderCenterBuilder && hasOrderCenterExecutor){
      wx.navigateTo({
        url: '/pages/order/service/service_list_wait/service_list_wait',
      })
      return
    }else{
      toastUtil.showToast("没有接单权限");
      return
    }

  },
  /**
   *  标签切换
   */
  label: function (opt) {
    content.setData({
      label_data: null,
      label_id: opt.currentTarget.dataset.label_id
    })
    getLabelGoods(content.data.channel_id, opt.currentTarget.dataset.label_id)
  },
  onShareAppMessage: function () {
    return {
      title: '圆满人生公共殡葬服务平台',
      path: '/pages/platform/login/login',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
/**
 * 获取所有渠道ID
 */
function getAllChannel() {
  var getChannelCallBack = {
    success: function (data, res) {
      var channel = res.data.list
      for (var i in channel) {
        if (channel[i].name == '单项') {
          content.setData({
            channel_id: channel[i].id
          })
          //缓存渠道信息
          wx.setStorageSync(storageKey.GOODS_CHANNEL, channel[i])
        }
      }
    },
    fail: function (data, res) {
      toastUtil.showToast("获取渠道失败");
    }
  }
  goodsPHPHttp.getChannel(null, getChannelCallBack);
}
/**
 * 查询用户签到情况
 */
function getCreditInfo() {
  var queryCreditCallBack = {
    success: function (data, res) {
      content.setData({
        usableCredit: data.usableCredit,
        canCheckin: data.canCheckin,
      })
    },
    fail: function (data, res) {
    }
  }
  platformHttp.queryCreditInfo(null, queryCreditCallBack);
}
/**
 * 获取推荐商品标签
 */
function getLabelTag() {
  var getLabelTagCallBack = {
    success: function (data, res) {
      if (!res.data.list || res.data.list.length == 0)
        return
      content.setData({
        label_data: null,
        labellist: res.data.list,
        label_id: res.data.list[0].id
      })
      getLabelGoods(content.data.channel_id, res.data.list[0].id)
    }
  }
  goodsPHPHttp.getLabelTag(null, getLabelTagCallBack);
}
/**
 * 获取推荐商品内容
 */
function getLabelGoods(channelId, labelId) {
  var getLabelGoodsRequest = {
    channel_id: channelId,
    lobel_id: labelId
  }
  var getLabelGoodsCallBack = {
    success: function (data, res) {
      if (!res.data.list || res.data.list.length == 0)
        return;
      content.setData({
        label_data: res.data.list,
      })
    }
  }
  goodsPHPHttp.getLabelGoods(getLabelGoodsRequest, getLabelGoodsCallBack);
}
/**
 * 用户签到
 */
function userSign() {
  var userSignCallBack = {
    success: function (data, res) {
      content.setData({
        usableCredit: data.usableCredit,
        keeps: data.keeps,
        canCheckin: false,
      })
      toastUtil.showToastReWrite("签到成功");
    },
    fail: function (data, res) {
      toastUtil.showToast(data);
    }
  }
  platformHttp.userCreditSign(null, userSignCallBack);
}