// pages/order_index/order_index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    //取出分单登录权限
    wx.getStorage({
      key: 'resourceCodes',
      success: function (res) {
        for (var i in res.data) {
          //如果有分单权限
          if (res.data[i] == "orderc.advisor") {
            wx.getStorage({
              key: 'Individual',
              success: function (opt) {
                that.setData({
                  Individual: true
                })
                // var javaApi = getApp().globalData.javaApi
                var orderCenterUrl = getApp().globalData.orderCenterUrl
                var str = opt.data
                wx.request({
                  url: orderCenterUrl + 'login_subsystem_api?KI4SO_SERVER_EC=' + str,
                  method: "GET",
                  data: '',
                  crossDomain: true,
                  header: {
                    'client-Type': 'wechatapp',
                    // "Content-Type": "application/x-www-form-urlencodeed"
                    'content-type': 'application/json'
                  },
                  success: function (ress) {
                    var cookies = ress.header['Set-Cookie']
                    if (cookies) {
                      var end = cookies.indexOf('Path') - 2
                      var start = cookies.indexOf('JSESSIONID')
                      if (start => 0) {
                        var str = cookies.substring(0, end)
                        //缓存单项登录essionid
                        wx.setStorageSync('orderCenter', str)
                        that.setData({
                          orderCenter: true
                        })
                        wx.hideLoading()
                      }

                    }
                  },
                  fail: function () {
                    that.setData({
                      orderCenter: false
                    })
                    wx.hideLoading()
                  }
                })
              },
            })
          }



        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})