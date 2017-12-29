var platformHttp = require("../../utils/http/RequestForPlatform.js");
var orderCenterHttp = require("../../utils/http/RequestForOrderCenter.js");
var toastUtil = require("../../utils/ToastUtil.js");
var content;
var that
Page({
  data: {
    GmList: [
      ' ',
    ],
    businessType_a:0,
    businessType_type: 0,
    asda:true,
    types:[
      '请选择服务类型',
      '殡仪',
      '公墓',
      '其他'
    ],
    businessType_b: 0,
    customerAddressNew:'',
    yuansan:true,
    paiche:false,
    date:'服务日期',
    time:'服务时间'
  },
  //验证空选项
  // notNull:function(e){
  //   if (e.detail.value == ''){
  //     wx.showToast({
  //       title: '不能为空',
  //       image: '../../images/icon_info.png',
  //       duration: 2000
  //     })
  //   }
  // },
  
  // 预约日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
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
  // 预约时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value,
    })
  },
  //预约类型
  bindPickerChange_type: function (e) {
    var that = this
    if (e.detail.value == 2) {
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
    var that=this
    that.setData({
      asda:false,
    })
    var submitData=[]
    submitData = e.detail.value
    submitData.orderType = that.data.businessType_type-1
    submitData.appointmentTime = that.data.date+' '+that.data.time+':00'
    submitData.createUserType = 'onlycreate'
    var gmList = that.data.gmList
    submitData.planCemeteryId = gmList[that.data.businessType_a].id
    submitData.planCemeteryLocation = gmList[that.data.businessType_a].name
    submitData.trafficWay = '自行'
    var gongmId = gmList[that.data.businessType_a].id
    // console.log(content)
    if (submitData.contactName.length == 0) {
      toastUtil.showToast("客户姓名必填")
      return
    }
    if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(submitData.contactPhone))) {
      toastUtil.showToast("电话不正确")
      return
    }
    if (submitData.appointmentTime.length == 0) {
      toastUtil.showToast("没有服务日期")
      return
    }
    if (submitData.address.length == 0) {
      toastUtil.showToast("没有客户地址")
      return
    }
    if (that.data.date =='服务日期') {
      toastUtil.showToast("没有服务日期")
      return
    }
    if (that.data.time == '服务时间') {
      toastUtil.showToast("没有服务时间")
      return
    }
    if (that.data.businessType_type == 0){
      toastUtil.showToast("没有服务类型")
      return
    }
    createOrder(submitData);
    // console.log(content)
  },
  Cname:function(e){
    this.setData({
      Cname: e.detail.value
    })
  },
  Clocation:function(e){
   this.setData({
     top_chat: e.detail.value
   })
  },
  //调用手机号码方法验证手机号码
  checktels:function(e){
    this.checkMobile(e.detail.value)
  },
  //调用手机号码方法验证手机号码
  checktel:function(e){
    this.checkMobile(e.detail.value)
    this.setData({
      checkMobile: e.detail.value
    })
  },
  //手机号码验证
  checkMobile: function (sMobile){
    if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(sMobile))) {
      wx.showToast({
        title: '号码不正确',
        image: '../../images/icon_info.png',
        duration: 2000
      })
    }else{

    } 
  },
  onLoad: function () {
    content=this;
    // that=this
    // var nowDate = getApp().formatData()
    // var nowTime = getApp().formatTime()
    // this.setData({
    //   date: nowDate,
    //   time: nowTime
    // })
    getCemeteryList()
  }
});
/**
 * 创建工单
 */
function createOrder(createOrderData) {
  var createOrderCallBack = {
    success: function () {
      toastUtil.showToastReWrite('新建成功')
        wx.redirectTo({
          url: '/pages/order_center/order_list_wait/order_list_wait',
        })
    },
    fail: function (data, res) {
      toastUtil.showToast(data)
    }
  }
  orderCenterHttp.createOrder(createOrderData, createOrderCallBack);
}
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