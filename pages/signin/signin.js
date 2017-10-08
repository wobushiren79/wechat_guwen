// pages/signin/signin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sign:false
  },

  bind_sign: function () {
    this.setData({
      sign: true
    })
  },
  sign: function () {
    wx.showLoading({
      title: '加载中',
      // mask:true,
    })
    var that = this
    var platform = getApp().globalData.platform
    wx.getStorage({
      key: 'ptjssessionid',
      success: function (res) {
        var ptjssessionid = res.data
        // that.setData({
        //   JSESSIONID: JSESSIONID
        // })
        // console.log(JSESSIONID)
        wx.request({
          url: platform + 'api/credit/checkin',
          // url: 'http://192.168.0.199:8080/api/credit/checkin',
          method: "POST",
          data: '',
          header: {
            // "Content-Type": "application/x-www-form-urlencodeed",
            'content-type': 'application/json',
            "Cookie": 'JSESSIONID=' + ptjssessionid
          },

          success: function (dat) {
            if (dat.data.code == 1000) {
              wx.showToast({
                title: '签到成功',
                duration: 2000,
                // mask: true,
              })
              that.setData({
                usableCredit: dat.data.content.usableCredit,
                keeps: dat.data.content.keeps,
                canCheckin:false,
              })
            } else {
              wx.showToast({
                title: dat.data.message,
                image: '../../images/icon_info.png',
                duration: 2000,
                // mask: true,
              })
            }
          }
        })
      }
    })
  },
  onLoad:function(){
    var that=this
    var platform = getApp().globalData.platform
    wx.getStorage({
      key: 'ptjssessionid',
      success: function (res) {
        var ptjssessionid = res.data
        wx.request({
          url: platform + 'api/credit/getCredit',
          // url: 'http://192.168.0.199:8080/api/credit/getCredit',
          method: "POST",
          data: '',
          header: {
            'content-type': 'application/json',
            "Cookie": 'JSESSIONID=' + ptjssessionid
          },

          success: function (dat) {
            if (dat.data.code == 1000) {
              that.setData({
                usableCredit: dat.data.content.usableCredit,
                canCheckin: dat.data.content.canCheckin,
                keeps: dat.data.content.keeps,
              })
            } else {
              wx.showToast({
                title: dat.data.message,
                duration: 2000,
                image: '../../images/icon_info.png',
                // mask: true,
              })
            }
          }
        })
      }
    })
  }

})