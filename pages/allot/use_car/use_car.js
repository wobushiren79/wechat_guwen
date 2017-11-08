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
    var that = this
    wx.showLoading({
      title: '请稍后',
      mask:true
    })
    var r = /^\+?[1-9][0-9]*$/;　　//正整数 
    var orderCenterUrl = getApp().globalData.orderCenterUrl
    // console.log(e.detail.value)
    var content={}
    var ContentData = {}
    ContentData.busiId = that.data.orderId
    ContentData.seats = e.detail.value.seats
    // get_data.proposerName = e.detail.value.proposerName
    // get_data.proposerMobile = e.detail.value.proposerMobile
    ContentData.connecterName = e.detail.value.connecterName
    ContentData.connecterMobile = e.detail.value.connecterMobile
    ContentData.remark = e.detail.value.remark
    ContentData.preDate = that.data.date + ' ' + that.data.time + ':00'
    ContentData.location = e.detail.value.location
    ContentData.reason = that.data.ChatList[that.data.businessType_chat]
    ContentData.targetLocation = e.detail.value.targetLocation
    content.content = ContentData
    // console.log(content)
    if (ContentData.seats.length > 0 && ContentData.connecterName.length > 0 && ContentData.connecterMobile.length > 0 && ContentData.preDate.length > 0 && ContentData.location.length > 0 && ContentData.reason.length > 0 && ContentData.targetLocation.length>0){
      if ((/^1[3|4|5|8][0-9]\d{4,8}$/.test(ContentData.connecterMobile))){
        if (r.test(ContentData.seats)){
          wx.getStorage({
            key: 'orderCenter',
            success: function (msg) {
              //转换字符串
              var ForData = JSON.stringify(content)
              wx.request({
                url: orderCenterUrl +'api/car/create',
                method: "POST",
                data: ForData,
                header: {
                  'content-type': 'application/json',
                  "Cookie": msg.data
                },
                success: function (res) {
                  if (res.data.code == 1000 ) {
                      wx.hideLoading()
                    //頁面跳轉
                    wx.navigateBack({
                      delta:1
                    })
                  } else {
                        wx.hideLoading()
                    wx.showToast({
                      title: res.data.message,
                      image: '../../../images/icon_info.png',
                      duration: 2000
                    })
                  }
                },
                fail: function () {
                  wx.hideLoading()
                  wx.showToast({
                    title: '网络错误',
                    image: '../../../images/icon_info.png',
                    duration: 3000
                  })
                }
              })
            }
          })
           }else{
          wx.hideLoading()
          wx.showToast({
            title: '人数不正确',
            image: '../../../images/icon_info.png',
            duration: 3000
          })   
           }
      }else{
        wx.hideLoading()
        wx.showToast({
          title: '电话不正确',
          image: '../../../images/icon_info.png',
          duration: 3000
        }) 
      }
    }else{
            wx.hideLoading()
            wx.showToast({
              title: '必填为空',
              image: '../../../images/icon_info.png',
              duration: 3000
            })
    }

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
  onLoad: function (e) {
    var that = this
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var orderCenterUrl = getApp().globalData.orderCenterUrl
    var get_content = {}
    var content = {}
    content.orderId = e.orderId
    get_content.content=content
    wx.getStorage({
      key: 'orderCenter',
      success: function (res) {
        wx.request({
          url: orderCenterUrl +'api/car/check',
          method: "POST",
          data: get_content,
          header: {
            'content-type': 'application/json',
            "Cookie": res.data
          },
          success:function(opt){
            if (opt.data.code == 1000){
              if (opt.data.content.isCanCreate  == 1){
                  if (opt.data.content.listCarApplyLog.length>0){
                    wx.hideLoading()
                    that.setData({
                      web_data: opt.data.content.listCarApplyLog[0],
                      orderId: e.orderId
                    })
                  }else{
                    wx.hideLoading()
                    that.setData({
                      web_data: false,
                      orderId: e.orderId
                    })
                  }
                }else{
                wx.hideLoading()
                  wx.showModal({
                    title: '圆满人生提示您',
                    content: '此单现在不能发起用车申请',
                    showCancel:false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      }
                    }
                  })
                }
            }else{
              wx.hideLoading()
              wx.showToast({
                title: opt.data.message,
                image: '../../../images/icon_info.png',
                duration: 3000
              })
            }
          //  console.log(opt)
          }
        })
      },
      fail:function() {
        wx.hideLoading()
        wx.showToast({
          title: '网络错误',
          image: '../../../images/icon_info.png',
          duration: 3000
        })
      }
    })
  }
});
