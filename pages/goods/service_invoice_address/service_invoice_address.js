//获取应用实例
var tcity = require("../../utils/citys.js");
var storageKey=require("../../utils/storage/StorageKey.js");
var toastUtil=require("../../utils/ToastUtil.js");
var checkTools=require("../../utils/CheckTools.js");
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
    need: false,
    head: false
  },

  bindChange: function (e) {
    var that = this
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      console.log('province no ');
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
      console.log('city no');
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
      // console.log('county no');
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

  // 需不需要发票
  bind_need: function (e) {
    var that = this
    var need_val = e.target.dataset.need
    console.log(need_val)
    if (need_val == 1) {
      this.setData({
        need: true
      })
    } else {
      this.setData({
        need: false
      })
    }
  },
  // 需不需要抬头
  bind_head: function (e) {
    var that = this
    var head_val = e.target.dataset.head
    // console.log(head_val)
    if (head_val == 1) {
      this.setData({
        head: true
      })
    } else {
      this.setData({
        head: false
      })
    }
  },



  onLoad: function () {
    content = this;
    var that = this;
    tcity.init(that);
    var cityData = that.data.cityData;
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

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,

      // 输入框初始化显示 四川省-成都市-锦江区
      'province': cityData[22].name,
      'city': cityData[22].sub[0].name,
      'county': cityData[22].sub[0].sub[1].name,
      footer: true
    })
  },


  formSubmit: function (e) {
    var invoiceInfo = e.detail.value;
    var submitInvoice = new Object();
    //是否需要发票
    var need = content.data.need
    if (need) {
      //需要
      submitInvoice.needInvoice = 1
      //发票抬头类型
      var head = content.data.head
      if (head) {
        submitInvoice.titleType = 1
        if (!invoiceInfo.title || invoiceInfo.title.length == 0) {
          toastUtil.showToast("没有单位名称");
          return
        }
        submitInvoice.title = invoiceInfo.title ;
        submitInvoice.invoiceRemark = invoiceInfo.invoiceRemark;
        submitInvoice.companyTaxId = invoiceInfo.companyTaxId;
      } else {
        submitInvoice.titleType = 0
      }
      if (!invoiceInfo.receiptName || invoiceInfo.receiptName.length==0){
        toastUtil.showToast("没有收件人");
        return
      }
      if (!invoiceInfo.receiptPhone || invoiceInfo.receiptPhone.length == 0) {
        toastUtil.showToast("没有电话");
        return
      }
      if (!checkTools.checkMobile(invoiceInfo.receiptPhone)) {
        toastUtil.showToast("电话格式错误");
        return
      }
      if (!invoiceInfo.location || invoiceInfo.location.length == 0) {
        toastUtil.showToast("没有详细地址");
        return
      }
      submitInvoice.receiptName = invoiceInfo.receiptName;
      submitInvoice.receiptPhone = invoiceInfo.receiptPhone;
      submitInvoice.receiptLocation = invoiceInfo.receiptLocation + "  " + invoiceInfo.location
    } else {
      //不需要
      submitInvoice.needInvoice = 0
    }
    //客户发票信息
    wx.setStorageSync(storageKey.GOODS_ORDER_INVOICE_INFO, submitInvoice);
    wx.navigateBack({
      delta:1
    })
  }
})
