Page({
  data: {
    pageSize:3
  },
  tel: function (e) {
    var tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel, //仅为示例，并非真实的电话号码
      complete: function (res) {
        console.log(res)
      },
    })
  },
  // onShow: function () {
  //   this.onLoad()
  // },
  //下拉刷新页面
  onPullDownRefresh: function () {
    var e={}
    e.orderId = this.data.orderId
    this.onLoad(e)
    wx.stopPullDownRefresh()
  },
  //上拉添加记录条数
  onReachBottom() {
    var that = this
    wx.showLoading({
      title: '请稍后',
    })
    var orderCenterUrl = getApp().globalData.orderCenterUrl
    var orderCenter = that.data.orderCenter
    var get_content = {}
    var content = {}
    var getdata = {}
    getdata.orderId = that.data.orderId
    content.params = getdata
    content.pageSize = that.data.pageSize
    content.pageNumber = 1
    get_content.content = content
    wx.request({
      url: orderCenterUrl + 'api/car/list',
      data: get_content,
      header: {
        'content-type': 'application/json',
        "Cookie": orderCenter
      },
      method: 'POST',
      dataType: 'json',
      success: function (opt) {
        // console.log(res.data)
        if (opt.data.code == 1000) {
          wx.hideLoading()
          if (opt.data.content.listCarApplyLog.length > 0) {
            that.setData({
              dateList: opt.data.content.listCarApplyLog,
              pageSize: that.data.pageSize + 3,
            })
          } else {
            dateList: false
          }
        } else {
          wx.hideLoading()
          wx.showModal({
            title: opt.data.message,
            content: '是否返回重新登录',
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../../login/login',
                })
              } else if (res.cancel) {

              }
            }
          })
        }
      },
      fail: function (res) {
        wx.reLaunch({
          url: '../../login/login',
        })
      },
    })
  },
  onLoad: function (e) {
    // console.log(e.orderId)
    var that = this
    // var orderId=e.orderId
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var orderCenterUrl = getApp().globalData.orderCenterUrl
    var get_content = {}
    var content = {}
    var getdata = {}
    getdata.orderId =e.orderId
    content.params = getdata
    content.pageSize = that.data.pageSize
    content.pageNumber = 1
    get_content.content = content
    // console.log(get_content)
    //取出单项登录权限
    wx.getStorage({
      key: 'orderCenter',
      success: function (res) {
        var orderCenter = res.data
        wx.request({
          url: orderCenterUrl + 'api/car/list',
          data: get_content,
          header: {
            'content-type': 'application/json',
            "Cookie": orderCenter
          },
          method: 'POST',
          dataType: 'json',
          success: function (opt) {
            // console.log(opt.data)
            if (opt.data.code == 1000){
              wx.hideLoading()
              if (opt.data.content.listCarApplyLog.length>0){

                   that.setData({
                     dateList: opt.data.content.listCarApplyLog,
                     pageSize: that.data.pageSize+3,
                     orderId: e.orderId
                   })
                }else{
                dateList:false
                }
            }else{
              wx.hideLoading()
              wx.showModal({
                title: opt.data.message,
                content: '是否返回重新登录',
                success: function (res) {
                  if (res.confirm) {
                    wx.reLaunch({
                      url: '../../login/login',
                    })
                  } else if (res.cancel) {

                  }
                }
              })
            }
          },
          fail: function (res) {
            wx.reLaunch({
              url: '../../login/login',
            })
          },
        })
      }
    })
  },
});
