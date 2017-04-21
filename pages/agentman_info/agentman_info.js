Page({
  data: {
    array: ['亲属', '儿子', '兄弟', '其他', '母亲', '父亲', '哥哥', '姐姐', '弟弟', '妹妹', '女儿', '孙子', '孙女'],
    businessType: 0,
    consultId: '',
    name: '',  //名字
    cardId: '', //生份证号码
    address: '',
    deadmanLocation: '',
    email: '', //邮箱
    linkInfo: '', //电话
    location: '', //地址
    relation: '',  //治丧地址
    remark: '',  //
    zsLocation: '',//治丧地址
    orderId: 0,
  },
  bindPickerChange: function (e) {
    this.setData({
      businessType: e.detail.value
    })
  },
  Location: function () {
    var that=this
    wx.chooseLocation({
      success: function (res) {
        var Address=res.address
        that.setData({
          location:Address
        })
      }
    })

  },
  zsLocation: function () {
    var that=this
    wx.chooseLocation({
      success: function (res) {
        var Address=res.address
        that.setData({
          zsLocation:Address
        })
      }
    })

  },
  onLoad: function (options) {
    var that = this
    var RouteUrl = getApp().globalData.RouteUrl
    var consultId = options.consultId
    var orderId = options.orderId
    //console.log(orderId)
    var name = ''
    var cardId = ''
    var address = ''
    var deadmanLocation = ''
    var email = ''
    var linkInfo = ''
    var location = ''
    var relation = ''
    var remark = ''
    var zsLocation = ''
    var ContentData = {}
    ContentData.consultId = consultId
    //获取已经有的经办人信息
    wx.getStorage({
      key: 'logindata',
      success: function (msg) {
        // console.log(ContentData)
        var forData = { content: ContentData }
        //转换字符串
        var ForData = JSON.stringify(forData)
        wx.request({
          url: RouteUrl + 'customer/agentman/get',
          method: "POST",
          data: ForData,
          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            "Cookie": "sid=" + msg.data.content.sessionId
          },
          success: function (res) {
            var AgentmanData = res.data.content.consultAgentman
            if (res.data.code == 1000 && res.data.message == '操作成功') {
              // console.log(AgentmanData)
              name = AgentmanData.name
              cardId = AgentmanData.cardId
              address = AgentmanData.address
              deadmanLocation = AgentmanData.deadmanLocation
              email = AgentmanData.email
              linkInfo = AgentmanData.linkInfo
              location = AgentmanData.location
              relation = AgentmanData.relation
              remark = AgentmanData.remark
              zsLocation = AgentmanData.zsLocation
              if (relation == '亲属') {
                relation = 0
              } else if (relation == '儿子') {
                relation = 1
              } else if (relation == '兄弟') {
                relation = 2
              } else if (relation == '其他') {
                relation = 3
              } else if (relation == '母亲') {
                relation = 4
              } else if (relation == '父亲') {
                relation = 5
              } else if (relation == '哥哥') {
                relation = 6
              } else if (relation == '姐姐') {
                relation = 7
              } else if (relation == '弟弟') {
                relation = 8
              } else if (relation == '妹妹') {
                relation = 9
              } else if (relation == '女儿') {
                relation = 10
              } else if (relation == '孙子') {
                relation = 11
              } else if (relation == '孙女') {
                relation = 12
              }
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 3000
              })
            }
            that.setData({
              name: name,
              cardId: cardId,
              address: address,
              deadmanLocation: deadmanLocation,
              email: email,
              linkInfo: linkInfo,
              location: location,
              businessType: relation,
              remark: remark,
              zsLocation: zsLocation
            })
          }
        })
      }
    })
    that.setData({
      consultId: consultId,
      orderId: orderId
    })
  },
  formSubmit: function (e) {
    var ContentData = e.detail.value
    var consultId = this.data.consultId
    var orderId = this.data.orderId
    var RouteUrl = getApp().globalData.RouteUrl
    var relation = this.data.businessType
    if (relation == 0) {
      relation = '亲属'
    } else if (relation == 1) {
      relation = '儿子'
    } else if (relation == 2) {
      relation = '兄弟'
    } else if (relation == 3) {
      relation = '其他'
    } else if (relation == 4) {
      relation = '母亲'
    } else if (relation == 5) {
      relation = '父亲'
    } else if (relation == 6) {
      relation = '哥哥'
    } else if (relation == 7) {
      relation = '姐姐'
    } else if (relation == 8) {
      relation = '弟弟'
    } else if (relation == 9) {
      relation = '妹妹'
    } else if (relation == 10) {
      relation = '女儿'
    } else if (relation == 11) {
      relation = '孙子'
    } else if (relation == 12) {
      relation = '孙女'
    }
    ContentData.relation = relation
    ContentData.consultId = consultId
    //console.log(ContentData)
    // 取出緩存登錄信息
    wx.getStorage({
      key: 'logindata',
      success: function (msg) {
        // console.log(ContentData)
        var forData = { content: ContentData }
        //console.log(forData)
        //转换字符串
        var ForData = JSON.stringify(forData)
        wx.request({
          url: RouteUrl + 'customer/agentman/save',
          method: "POST",
          data: ForData,
          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            "Cookie": "sid=" + msg.data.content.sessionId
          },
          success: function (res) {
            //console.log(res.data)
            if (res.data.code == 1000 && res.data.message == '操作成功') {
              // console.log(11111)
              //頁面跳轉
              wx.redirectTo({
                url: '../compact/compact?consultId=' + consultId + '&orderId=' + orderId
              })
              // console.log(res.data)
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 3000
              })
            }
          }
        })
      }
    })
  },
  formData: function (e) {
    var ContentData = e.detail.value
    var consultId = this.data.consultId
    var orderId = this.data.orderId
    var RouteUrl = getApp().globalData.RouteUrl
    var relation = this.data.businessType
    if (relation == 0) {
      relation = '亲属'
    } else if (relation == 1) {
      relation = '儿子'
    } else if (relation == 2) {
      relation = '兄弟'
    } else if (relation == 3) {
      relation = '其他'
    } else if (relation == 4) {
      relation = '母亲'
    } else if (relation == 5) {
      relation = '父亲'
    } else if (relation == 6) {
      relation = '哥哥'
    } else if (relation == 7) {
      relation = '姐姐'
    } else if (relation == 8) {
      relation = '弟弟'
    } else if (relation == 9) {
      relation = '妹妹'
    } else if (relation == 10) {
      relation = '女儿'
    } else if (relation == 11) {
      relation = '孙子'
    } else if (relation == 12) {
      relation = '孙女'
    }
    ContentData.relation = relation
    ContentData.consultId = consultId
    //console.log(ContentData)
    // 取出緩存登錄信息
    wx.getStorage({
      key: 'logindata',
      success: function (msg) {
        // console.log(ContentData)
        var forData = { content: ContentData }
        //console.log(forData)
        //转换字符串
        var ForData = JSON.stringify(forData)
        wx.request({
          url: RouteUrl + 'customer/agentman/save',
          method: "POST",
          data: ForData,
          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            "Cookie": "sid=" + msg.data.content.sessionId
          },
          success: function (res) {
            //console.log(res.data)
            if (res.data.code == 1000 && res.data.message == '操作成功') {
              // console.log(11111)
              //頁面跳轉
              wx.redirectTo({
                url: '../deadman_info/deadman_info?consultId=' + consultId + '&orderId=' + orderId
              })
              // console.log(res.data)
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 3000
              })
            }
          }
        })
      }
    })
  }
});
