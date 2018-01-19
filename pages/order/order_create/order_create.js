var platformHttp = require("../../../utils/http/RequestForPlatform.js");
var orderCenterHttp = require("../../../utils/http/RequestForOrderCenter.js");
var toastUtil = require("../../../utils/ToastUtil.js");
var checkPermissions = require("../../../utils/CheckPermissions.js");
var content;
var checkTools = require("../../../utils/CheckTools.js");
Page({
  data: {
    GmList: [
      ' ',
    ],
    businessType_a: 0,
    asda:true,
    businessType_chat: 0,
    ChatList: [
      '看墓',
      '回送客户',
      '门店',
      '接灰',
      '其他'
    ],
    businessType_type: 0,
    types: [
      '殡仪',
      '公墓',
      '其他'
    ],
    zhidianData: [
      '自行',
      '需要派车'
    ],
    businessType_b: 0,
    customerAddressNew: '',
    yuansan: true,
    paiche: false
  },
  onLoad: function () {
    content = this;
    var nowDate = getApp().formatData()
    var nowTime = getApp().formatTime()
    content.setData({
      date: nowDate,
      time: nowTime
    })

    getCemeteryList()
  },
  //验证空选项
  notNull: function (e) {
    if (e.detail.value == '') {
      wx.showToast({
        title: '不能为空',
        image: '/images/icon_info.png',
        duration: 2000
      })
    }
  },

  // 预约日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      dates: this.data.dates ? this.data.dates : e.detail.value
    })
  },
  // 预约时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value,
      datess: this.data.datess ? this.data.datess : e.detail.value
    })
  },
  // 预约用车日期
  bindTimeChangess: function (e) {
    this.setData({
      datess: e.detail.value
    })
  },
  //预约用车时间
  bindDateChanges: function (e) {
    this.setData({
      dates: e.detail.value
    })
  },
  // 参观公墓
  bindPickerChange_a: function (e) {
    // if (e.target.dataset.name == '院山'){
    var GmName = this.data.GmList
    // console.log(GmName)
    this.setData({
      businessType_a: e.detail.value,
      GmName: GmName[e.detail.value],
    })
  },
  //预约类型
  bindPickerChange_type: function (e) {
    var that = this
    if (e.detail.value == 1) {
      that.setData({
        businessType_type: e.detail.value,
        typeName: that.data.types[e.detail.value],
        yuy_type: true
      })
    } else {
      that.setData({
        businessType_type: e.detail.value,
        typeName: that.data.types[e.detail.value],
        yuy_type: false
      })
    }
  },
  //用车理由
  bindPickerChange_chat: function (e) {
    this.setData({
      businessType_chat: e.detail.value,
      // ChatName: e.target.dataset.name,
      // yuansan: true
    })
  },
  // 交通方式
  bindPickerChange_b: function (e) {
    for (var i in e.target.dataset.name) {
      if (i == e.detail.value) {
        var jiaotong = e.target.dataset.name[i]
      }
    }
    if (e.detail.value == 1) {
      this.setData({
        businessType_b: e.detail.value,
        jiaotong: jiaotong,
        paiche: true
      })
    } else {
      this.setData({
        businessType_b: e.detail.value,
        jiaotong: jiaotong,
        paiche: false
      })
    }
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
  //客户地址
  Location: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        var Address = res.address
        that.setData({
          customerAddressNew: Address
        })
      }
    })
  },
  formSubmit: function (e) {
    var that = this

    // var GmUrl = getApp().globalData.GmUrl
    var orderCenterUrl = getApp().globalData.orderCenterUrl
    //console.log(e.detail.value)
    var ContentData = {}
    // ContentData.personNum = e.detail.value.personNum ? e.detail.value.personNum:0
    ContentData.contactName = e.detail.value.contactName
    ContentData.contactPhone = e.detail.value.contactPhone
    ContentData.orderDescribe = e.detail.value.orderDescribe
    ContentData.address = e.detail.value.address
    var businessType_b = that.data.businessType_b
    ContentData.appointmentTime = that.data.date + ' ' + that.data.time + ':00'
    var businessType_a = that.data.businessType_a
    var gmList = that.data.gmList
    ContentData.planCemeteryId = gmList[businessType_a].id
    ContentData.planCemeteryLocation = gmList[businessType_a].name
    var gongmId = gmList[businessType_a].id
    var zhidianData = that.data.zhidianData
    // for(var i in zhidian){
    ContentData.trafficWay = zhidianData[businessType_b]

    // }
    ContentData.orderType = that.data.businessType_type
    var get_data = {}
    // get_data.reason = e.detail.value.reason
    get_data.seats = e.detail.value.seats
    // get_data.proposerName = e.detail.value.proposerName
    // get_data.proposerMobile = e.detail.value.proposerMobile
    get_data.connecterName = e.detail.value.connecterName
    get_data.connecterMobile = e.detail.value.connecterMobile
    get_data.remark = e.detail.value.remark
    var nweData = that.data.dates == undefined ? that.data.date : that.data.dates
    var nweTime = that.data.datess == undefined ? that.data.time : that.data.datess
    get_data.preDate = nweData + ' ' + nweTime + ':00'
    get_data.location = e.detail.value.location
    get_data.reason = that.data.ChatList[that.data.businessType_chat]
    get_data.targetLocation = e.detail.value.targetLocation

    if (ContentData.contactName.length == 0) {
      toastUtil.showToast("客户姓名必填")
      return
    }
    // if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(ContentData.contactPhone))) {
    //   toastUtil.showToast("电话不正确")
    //   return
    // }
    if (ContentData.appointmentTime.length == 0) {
      toastUtil.showToast("没有服务日期")
      return
    }
    if (ContentData.address.length == 0) {
      toastUtil.showToast("没有客户地址")
      return
    }
    if (ContentData.trafficWay =="需要派车") {
      ContentData.carApplyLog = get_data
      if (!get_data.preDate || get_data.preDate.length == 0) {
        toastUtil.showToast("没有用车时间")
        return
      }
      if (!get_data.connecterName || get_data.connecterName.length == 0) {
        toastUtil.showToast("没有用车人")
        return
      }
      if (!get_data.connecterMobile || !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(get_data.connecterMobile))) {
        toastUtil.showToast("电话不正确")
        return
      }
      if (!get_data.seats || get_data.seats.length == 0) {
        toastUtil.showToast("乘车人数<1")
        return
      }
      if (!get_data.targetLocation || get_data.targetLocation.length == 0) {
        toastUtil.showToast("没有目的地")
        return
      }
    }
    createOrder(ContentData);
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
    if (!checkTools.checkMobile(sMobile)) {
      toastUtil.showToast('号码不正确');
    }
  }
});

/**
 * 获取公墓列表
 */
function getCemeteryList() {
  var queryCemeteryListRequest = {
    systemIndex: 1
  }
  var queryCemeteryListCallBack = {
    success: function (data, res) {
      if (data == null || data.length == 0) {
        toastUtil.showToast("公墓列表为空");
        return
      }
      var GmList = []
      for (var i in data) {
        GmList.push(data[i].name)
        GmName: data[0]
      }
      content.setData({
        GmList: GmList,
        gmList: data,
        GmName: GmList[0],
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("查询公墓失败");
    }
  }
  platformHttp.queryCemeterySubsysListBySysEnumId(queryCemeteryListRequest, queryCemeteryListCallBack);
}


/**
 * 创建工单
 */
function createOrder(createOrderData) {
  var createOrderCallBack = {
    success: function () {
      wx.redirectTo({
        url: '/pages/order/cashback/cashback_list_wait/cashback_list_wait',
      })
    },
    fail: function (data, res) {
      toastUtil.showToast(data)
    }
  }
  orderCenterHttp.createOrder(createOrderData, createOrderCallBack);
}