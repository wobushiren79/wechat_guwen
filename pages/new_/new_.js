Page({
  data: {
    GmList: [],
    businessType_a: 0,

    zhidianData: [],
    businessType_b: 0,
    customerAddressNew:'',
  },
  // 预约时间
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 参观公墓
  bindPickerChange_a: function (e) {
    this.setData({
      businessType_a: e.detail.value,
      GmName:e.target.dataset.name
    })
  },
  // 交通方式
  bindPickerChange_b: function (e) {
    for(var i in e.target.dataset.name){
      if (i == e.detail.value){
        var jiaotong = e.target.dataset.name[i]
      }
    }
    this.setData({
      businessType_b: e.detail.value,
      jiaotong:jiaotong
    })
  },
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
    var GmUrl = getApp().globalData.GmUrl
    //console.log(e.detail.value)
    var ContentData = e.detail.value
    var businessType_b = this.data.businessType_b
    ContentData.promiseTime=this.data.date+' 00:00'
      var businessType_a = this.data.businessType_a
      var gmList = this.data.gmList
      for (var i in gmList){
        ContentData.planCemeteryId = gmList[businessType_a].id
        ContentData.planCemeteryLocation = gmList[businessType_a].name
      }
    var zhidian=this.data.zhidian
    for(var i in zhidian){
      ContentData.trafficWay = zhidian[businessType_b].text
      
    }
    // console.log(ContentData)
    if (ContentData.customerName != '' && ContentData.promiseTime != '' && ContentData.planCemeteryLocation != '' && ContentData.trafficWay != '' && ContentData.planCemeteryId != '' && ContentData.personNum != '' && ContentData.customerLocation != '' && ContentData.customerMobile !='') {
    // 取出緩存登錄信息
    wx.getStorage({
      key: 'Gmlogin',
      success: function (msg) {
        // console.log(ContentData)
        var forData = { content: ContentData }
        // console.log(forData)
        //转换字符串
        var ForData = JSON.stringify(forData)
        // console.log(ForData)
        wx.request({
          url: GmUrl +'marketing/bespeak/build/save',
          method: "POST",
          data: ForData,
          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            "Cookie": "sid=" + msg.data.content.sessionId
          },
          success: function (res) {
          //  console.log(res)
            if (res.data.code == 1000 ) {
              // //console.log(res.data.content.consultId)
              // //操作成功返回consultId進行緩存
              // wx.setStorageSync('consultId', res.data.content.consultId)
              // //頁面跳轉
              wx.redirectTo({
                url: '../list_/list_',
               })
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 2000
              })
            }
          }
        })
      }
    })
    // } else if (ContentData.customerName != '' ){
    //   wx.showToast({
    //     title: '客户姓名不能为空',
    //     duration: 2000
    //   })
    } else{
      wx.showToast({
        title: '所有文本框都是必填项',
        duration: 2000
      })
    }
    // else if (ContentData.promiseTime != '') {
    //   wx.showToast({
    //     title: '预约时间不能为空',
    //     duration: 2000
    //   })
    // } else if (ContentData.planCemeteryId != '') {
    //   wx.showToast({
    //     title: '预约公墓名称不能为空',
    //     duration: 2000
    //   })
    // } else if (ContentData.trafficWay != '') {
    //   wx.showToast({
    //     title: '交通方式不能为空',
    //     duration: 2000
    //   })
    // } else if (ContentData.personNum != '') {
    //   wx.showToast({
    //     title: '参观人数不能为空',
    //     duration: 2000
    //   })
    // } else if (ContentData.customerLocation != '') {
    //   wx.showToast({
    //     title: '客户地址不能为空',
    //     duration: 2000
    //   })
    // } else if (ContentData.customerMobile != '') {
    //   wx.showToast({
    //     title: '客户电话不能为空',
    //     duration: 2000
    //   })
    // }
  },
  onLoad: function () {
    var that = this
    var that = this
    var GmUrl = getApp().globalData.GmUrl
    var Contentdata = { content: { dictCode: 'consultTrafficWay'}}
    var ContentData = JSON.stringify(Contentdata)
    //请求字典接口和公墓接口
    wx.getStorage({
      key: 'Gmlogin',
      success: function (res) {
        //字典接口
        wx.request({
          url: GmUrl+'marketing/dict/items/list',
          method: "POST",
          data: ContentData,

          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            "Cookie": "sid=" + res.data.content.sessionId
          },
          success: function (res) {
            if (res.data.code == 1000) {
              var zhidianData=[]
              var zhidian=res.data.content.items
              for(var i in zhidian){
               zhidianData.push(zhidian[i].text)
              }
              that.setData({
                zhidian: zhidian,
                zhidianData:zhidianData
              })
            }
          }
        })
        //查询公墓接口
        wx.request({
          url: GmUrl + 'marketing/cemetery/findByCemeteryList',
          method: "POST",
          data: "{\"content\":{}}",

          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            "Cookie": "sid=" + res.data.content.sessionId
          },
          success: function (res) {
            if (res.data.code == 1000) {
              var gmList=res.data.content.list
              var GmList=[]
              for(var i in gmList){
                GmList.push(gmList[i].name)
              }
              that.setData({
                GmList:GmList,
                gmList: gmList
              })
              // console.log(res.data.content.list)
              // console.log(GmList)
              // var zhidianData = []
              // var zhidian = res.data.content.items
              // for (var i in zhidian) {
              //   zhidianData.push(zhidian[i].text)
              // }
              // that.setData({
              //   zhidian: zhidian,
              //   zhidianData: zhidianData
              // })
            }
          }
        })
      },
    })
  }
});
