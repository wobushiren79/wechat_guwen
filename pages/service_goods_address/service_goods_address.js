//获取应用实例
var tcity = require("../../utils/citys.js");
var storageKey = require("../../utils/storage/StorageKey.js");
var toastUtil = require("../../utils/ToastUtil.js");
var checkTools = require("../../utils/CheckTools.js");
var content;
var app = getApp()
Page({
  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [22, 0, 1],
    values: [22, 0, 1],
    condition: false,
    footer: true,
    date: "请选择日期",
    time: "请选择时间",
    btn_1: true,
    btn_2: false
  },

  bindChange: function (e) {
    var that = this
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      that.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0],
      })
      return;
    }
    if (val[1] != t[1]) {
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      that.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      that.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }

  },
  open: function () {
    this.setData({
      condition: !this.data.condition,
      // 显示页脚
      footer: this.data.condition
    })
    // console.log(footer)
  },

  // 及时服务和预约服务
  bind_btn_1: function () {
    this.setData({
      btn_1: true,
      btn_2: false
    })
  },
  bind_btn_2: function () {
    this.setData({
      btn_1: false,
      btn_2: true
    })
  },
  bindDateChange: function (e) {
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
    content = this;
    tcity.init(content);
    var cityData = content.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[22].sub[i].name)
    }
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[22].sub[0].sub[i].name)
    }

    content.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[22].name,
      'city': cityData[22].sub[0].name,
      'county': cityData[22].sub[0].sub[1].name,
      footer: true
    })
  },

  /**
   * 提交数据
   */
  formSubmit: function (e) {
    var serviceInfo = e.detail.value;
    if (!serviceInfo.contact || serviceInfo.contact.length == 0) {
      toastUtil.showToast("没有联系人");
      return
    }
    if (!serviceInfo.contactPhone || serviceInfo.contactPhone.length == 0) {
      toastUtil.showToast("没有联系电话");
      return
    }
    if (!checkTools.checkMobile(serviceInfo.contactPhone)) {
      toastUtil.showToast("电话格式错误");
      return
    }
    if (!serviceInfo.location || serviceInfo.location.length == 0) {
      toastUtil.showToast("没有详细地址");
      return
    }
    if (!content.data.btn_1) {
      if (!content.data.date || content.data.date.length == 0 || content.data.date=="请选择日期"){
        toastUtil.showToast("没有选择日期");
        return
      }
      if (!content.data.time || content.data.date.time == 0 || content.data.time == "请选择时间") {
        toastUtil.showToast("没有选择时间");
        return
      }
      serviceInfo.bookTime = content.data.date + ' ' + content.data.time + ':00'
      serviceInfo.serviceWay = 1
    } else {
      serviceInfo.serviceWay = 0
    }
    serviceInfo.serviceLocation = serviceInfo.serviceLocation + '  ' + serviceInfo.location
    // serviceInfo.selfDelivery = ''
    // serviceInfo.selfDeliveryTime = ''
    //客户填写信息
    wx.setStorageSync(storageKey.GOODS_ORDER_SERVICE_INFO, serviceInfo)
    wx.redirectTo({
      url:'../service_money/service_money'
    })
  }

})
