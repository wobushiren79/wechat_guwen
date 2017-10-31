Page({
  data: {
    pageSize:2,
    valid:[0]
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
  //下拉刷新页面
  onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh()
  },
  onShow:function(){
    this.onLoad()
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
    getdata.listType = 1
    content.params = getdata
    content.pageSize = that.data.pageSize
    content.pageNumber = 1
    get_content.content = content
    wx.request({
      url: orderCenterUrl + 'api/performer/list',
      data: get_content,
      header: {
        'content-type': 'application/json',
        "Cookie": orderCenter
      },
      method: 'POST',
      dataType: 'json',
      success: function (opt) {
        if (opt.data.code == 1000) {
          var listdata = opt.data.content.content
          var updateTime = []
          for (var i in listdata) {
            for (var j in listdata[i].listOrderStatusChange) {
              if (listdata[i].listOrderStatusChange[j].updataStatus == 2) {
                updateTime.push(listdata[i].listOrderStatusChange[j].updateTime)
                break;
              }
            }
          }
          if (opt.data.content.content.length < that.data.pageSize) {
            that.setData({
              listdata: opt.data.content.content,
              orderCenter: orderCenter,
              pageSize: that.data.pageSize,
              notNumber: true,
              updateTime: updateTime
            })
          } else {
            that.setData({
              listdata: opt.data.content.content,
              orderCenter: orderCenter,
              pageSize: that.data.pageSize + 2,
              notNumber: false,
              updateTime: updateTime
            })
          }
          wx.hideLoading()
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
  onLoad:function(){
    var that = this
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var orderCenterUrl = getApp().globalData.orderCenterUrl
    var get_content={}
    var content={}
    var getdata={}
    getdata.listType=1
    content.params = getdata
    content.pageSize = that.data.pageSize
    content.pageNumber = 1
    get_content.content = content
    //取出单项登录权限
    wx.getStorage({
      key: 'orderCenter',
      success: function (res) {
        var orderCenter=res.data
        wx.request({
          url: orderCenterUrl +'api/performer/list',
          data: get_content,
          header: {
            'content-type': 'application/json',
            "Cookie": orderCenter
          },
          method: 'POST',
          dataType: 'json',
          success: function(opt) {
            // console.log(opt.data)
            if (opt.data.code == 1000){
              var listdata = opt.data.content.content
              var updateTime = []
              for (var i in listdata) {
                for (var j in listdata[i].listOrderStatusChange) {
                  if (listdata[i].listOrderStatusChange[j].updataStatus == 2) {
                    updateTime.push(listdata[i].listOrderStatusChange[j].updateTime)
                    break;
                  }
                }
              }
              if (opt.data.content.content.length < that.data.pageSize){
                that.setData({
                  listdata: opt.data.content.content,
                  orderCenter: orderCenter,
                  pageSize: that.data.pageSize,
                  notNumber:true,
                  updateTime: updateTime
                })
              }else{
              that.setData({
                listdata: opt.data.content.content,
                orderCenter: orderCenter,
                pageSize: that.data.pageSize+2,
                notNumber: false,
                updateTime: updateTime
              })
              }
              wx.hideLoading()
            }else{
              wx.hideLoading()
              wx.showModal({
                title: opt.data.message,
                content:'是否返回重新登录',
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
          fail: function(res) {
            wx.reLaunch({
              url: '../../login/login',
            })
          },
        })
      }
      })
  },
  orsers:function(evet){
    var that = this
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var valid = that.data.valid
    var orderCenterUrl = getApp().globalData.orderCenterUrl
    var orderCenter = that.data.orderCenter
    // console.log(evet.target.dataset.orderid)
    var content={}
    var get_data={}
    get_data.orderId = evet.target.dataset.orderid
    content.content = get_data
    console.log(content)
    wx.request({
      url: orderCenterUrl +'api/performer/accept',
      data: content,
      header: {
        'content-type': 'application/json',
        "Cookie": orderCenter
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        // console.log(res.data.valid)
        if (res.data.code == 1000) {
          that.onLoad()
          // //頁面跳轉
          // wx.redirectTo({
          //   url: '../allot/order_list_wait/order_list_wait',
          // })
          wx.showModal({
            title: '圆满人生提示您',
            content: res.data.message,
            confirmText: '跳转处理',
            cancelText: '返回列表',
            success: function (res) {
              if (res.confirm) {
                //頁面跳轉
                wx.redirectTo({
                  url: '/pages/allot/order_list_processing/order_list_processing',
                })
              } else if (res.cancel) {
                // wx.navigateBack({
                //   delta: 1
                // })
              }
            }
          })
          wx.hideLoading()
        } else {
          wx.hideLoading()
          wx.showModal({
            title: res.data.message,
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
      fail: function(res) {
        wx.reLaunch({
          url: '../../login/login',
        })
      },
    })
  }
});
