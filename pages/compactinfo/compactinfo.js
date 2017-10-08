//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    partyB: "四川世安生命文化有限责任公司",
    orderId: 0,
    adviserName: "",
    agentmanCardId: "",
    agentmanEmail: "",
    agentmanLocation: "",
    agentmanName: "",
    agentmanPhone: "",
    agentmanRelation: "",
    deadmanAge: "",
    deadmanCardId: "",
    deadmanName: "",
    deadmanSex: 1,
    deadmanShoes: "",
    deadmanState: "",
    zsLocation: "",
    orderData: {},
    ztcdata: {},
    tccp: {},
    zjfw: {},
    gongmu: {},
    totalAmount: 0,
    prepayAmount: 0,
    receivableAmount: 0,
    isAgree: false,
    consultId: 0
  },
  bindAgreeChange: function (e) {
    var isAgree = this.data.isAgree
    if (e.detail.value.length > 0) {
      isAgree = true
    } else {
      isAgree = false
    }
    this.setData({
      isAgree: isAgree
    });
  },
  onLoad: function (options) {
    var that = this
    var orderId = options.orderId
    var consultId = options.consultId
    //console.log(orderId)
    var RouteUrl = getApp().globalData.RouteUrl
    var adviserName = ''
    var agentmanCardId = ''
    var agentmanEmail = ''
    var agentmanLocation = ''
    var agentmanName = ''
    var agentmanPhone = ''
    var agentmanRelation = ''
    var deadmanAge = ''
    var deadmanCardId = ''
    var deadmanName = ''
    var deadmanSex = ''
    var deadmanShoes = ''
    var deadmanState = ''
    var zsLocation = ''
    var ContentData = {}
    var OrderData = ''
    var orderData = ''
    var deadmanSexs = ''
    ContentData.orderId = orderId
    ContentData.consultId = consultId
    wx.getStorage({
      key: 'logindata',
      success: function (msg) {
        // console.log(ContentData)
        var forData = { content: ContentData }
        //转换字符串
        var ForData = JSON.stringify(forData)
        wx.request({
          url: RouteUrl + 'customer/talk/contract/get',
          method: "POST",
          data: ForData,
          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            "Cookie": "sid=" + msg.data.content.sessionId
          },
          success: function (res) {
            // console.log(res)
            OrderData = res.data.content
            if (res.data.code == 1000 && res.data.message == '操作成功') {
              adviserName = OrderData.adviserName
              agentmanCardId = OrderData.agentmanCardId
              agentmanEmail = OrderData.agentmanEmail
              agentmanLocation = OrderData.agentmanLocation
              agentmanName = OrderData.agentmanName
              agentmanPhone = OrderData.agentmanPhone
              agentmanRelation = OrderData.agentmanRelation
              deadmanAge = OrderData.deadmanAge
              deadmanCardId = OrderData.deadmanCardId
              deadmanName = OrderData.deadmanName
              deadmanSexs = OrderData.deadmanSex
              if (deadmanSexs == 1) {
                deadmanSex = '未知'
              } else if (deadmanSexs == 2) {
                deadmanSex = '男'
              } else if (deadmanSexs == 3) {
                deadmanSex = '女'
              } else if (deadmanSexs == 4) {
                deadmanSex = '保密'
              }
              deadmanShoes = OrderData.deadmanShoes
              deadmanState = OrderData.deadmanState
              zsLocation = OrderData.zsLocation
              that.setData({
                orderId: orderId,
                consultId: consultId,
                adviserName: adviserName,
                agentmanCardId: agentmanCardId,
                agentmanEmail: agentmanEmail,
                agentmanLocation: agentmanLocation,
                agentmanName: agentmanName,
                agentmanPhone: agentmanPhone,
                agentmanRelation: agentmanRelation,
                deadmanAge: deadmanAge,
                deadmanCardId: deadmanCardId,
                deadmanName: deadmanName,
                deadmanSex: deadmanSex,
                deadmanShoes: deadmanShoes,
                deadmanState: deadmanState,
                zsLocation: zsLocation,
              })
            } else {
              wx.showToast({
                title: res.data.message,
                image: '../../images/icon_info.png',
                // title: '111111',
                duration: 3000
              })
            }
          }
        })
      }
    })

    wx.getStorage({
      key: 'logindata',
      success: function (msg) {
        // console.log(ContentData)
        var forData = { content: ContentData }
        //转换字符串
        var ForData = JSON.stringify(forData)
        wx.request({
          url: RouteUrl + 'setmeal/main/get',
          method: "POST",
          data: ForData,
          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            "Cookie": "sid=" + msg.data.content.sessionId
          },
          success: function (res) {
            orderData = res.data.content.mains
            if (res.data.code == 1000 && res.data.message == '操作成功') {
              that.setData({
                orderData: orderData
              })
            } else {
              wx.showToast({
                title: res.data.message,
                image: '../../images/icon_info.png',
                // title: '22222',
                duration: 3000
              })
            }
          }
        })
      }
    })
    wx.getStorage({
      key: 'logindata',
      success: function (msg) {
        // console.log(ContentData)
        var forData = { content: ContentData }
        //转换字符串
        var ForData = JSON.stringify(forData)
        wx.request({
          url: RouteUrl + 'order/view',
          method: "POST",
          data: ForData,
          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            "Cookie": "sid=" + msg.data.content.sessionId
          },
          success: function (res) {
            var OData = res.data.content.projectItems
            var totalAmount = res.data.content.payInfo.totalAmount
            var OoData = res.data.content
            var prepayAmount = res.data.content.payInfo.prepayAmount
            var receivableAmount = res.data.content.payInfo.receivableAmount
            // console.log(res.data.content)
            // console.log(OoData)
            //console.log(orderData)
            if (res.data.code == 1000 && res.data.message == '操作成功') {
              var ztcdata = {}
              var zjfw = {}
              var tccp = {}
              var gongmu = {}
              for (var i in OData) {
                if (OData[i].name == '主套餐') {
                  ztcdata = OData[i].ctgItems
                } else if (OData[i].name == "殡仪馆") {
                  tccp = OData[i].ctgItems
                }
                else if (OData[i].name == "公墓") {
                  gongmu = OData[i].ctgItems
                } else if (OData[i].name == "增值项目") {
                  zjfw = OData[i].ctgItems
                }
              }

              // console.log(ztcdata)
              that.setData({
                ztcdata: ztcdata,
                tccp: tccp,
                zjfw: zjfw,
                gongmu: gongmu,
                totalAmount: totalAmount,
                prepayAmount: prepayAmount,
                receivableAmount: receivableAmount
              })
            } else {
              wx.showToast({
                title: res.data.message,
                image: '../../images/icon_info.png',
                // title: '33333',
                duration: 3000
              })
            }
          }
        })
      }
    })
    that.setData({

    })
  },
})
