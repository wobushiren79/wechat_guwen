Page({
    data: {

    },
  jiage1:function(){
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var LocalUrl = getApp().globalData.LocalUrl
    var listdata = this.data.channel
   var that=this
   wx.request({
     url: LocalUrl + 'Goods/jiage1',
     method: "POST",
     data: listdata,
     header: {
       "Content-Type": "application/x-www-form-urlencoded",
       // "Cookie": "sid=" + res.data.content.sessionId
     },
     success: function (res) {
       if (res.data.code == 1000) {
         var list = res.data.list
         that.setData({
           list: list,
           xiaoliang: false,
           jiage:1
         })
         wx.hideLoading()
       } else {
         wx.showToast({
           title: res.data.message,
           duration: 2000
         })
       }
     }
   })
  },
  jiage2: function () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var LocalUrl = getApp().globalData.LocalUrl
    var listdata = this.data.channel
    var that = this
    wx.request({
      url: LocalUrl + 'Goods/jiage2',
      method: "POST",
      data: listdata,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Cookie": "sid=" + res.data.content.sessionId
      },
      success: function (res) {
        if (res.data.code == 1000) {
          var list = res.data.list
          that.setData({
            list: list,
            xiaoliang: false,
            jiage: 0
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: res.data.message,
            duration: 2000
          })
        }
      }
    })
  },
  xiaoliang: function () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var LocalUrl = getApp().globalData.LocalUrl
    var listdata = this.data.channel
    var that = this
    wx.request({
      url: LocalUrl + 'Goods/goods',
      method: "POST",
      data: listdata,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Cookie": "sid=" + res.data.content.sessionId
      },
      success: function (res) {
        if (res.data.code == 1000) {
          var list = res.data.list
          that.setData({
            list: list,
            xiaoliang: true,
            jiage: 3
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: res.data.message,
            duration: 2000
          })
        }
      }
    })
  },
onLoad: function (e) {
    var that = this
    var LocalUrl = getApp().globalData.LocalUrl
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    // wx.getStorage({
    //   key: 'JSESSIONID',
    //   success: function(res) {
    //     that.setData({
    //       JSESSIONID: JSESSIONID
    //     })
    //   },
    // })
    // 取出渠道信息
    wx.getStorage({
      key: 'channel',
      success: function (res) {
        var channel = {}
        channel.channel_id = res.data.id
        channel.id = e.id
        //查询分类接口
        wx.request({
          url: LocalUrl + 'Goods/goods',
          method: "POST",
          data: channel,
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            // "Cookie": "sid=" + res.data.content.sessionId
          },
          success: function (res) {
            if (res.data.code == 1000) {
              var list = res.data.list
              that.setData({
                list: list,
                xiaoliang: true,
                channel: channel
              })
              wx.hideLoading()
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 2000
              })
            }
          }
        })
      },
      fail: function () {
        //如果获取缓存不成功就跳转登录页面
        wx.redirectTo({
          url: '../index/index',
        })
      }
    })
  }
});
