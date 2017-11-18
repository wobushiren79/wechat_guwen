Page({
    data: {
      usableMoney:'0.00'
    },
  onShow:function(){
    this.onLoad()
  },
  dele: function () {
    wx.clearStorageSync()
    //跳转登录页面
    wx.reLaunch({
      url: '../../login/login',
    })

  },
  onLoad: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      // mask:true,
    })
    wx.getUserInfo({
      success: function (res) {
        // success
        that.setData({
          nickName: res.userInfo.nickName,
          userInfoAvatar: res.userInfo.avatarUrl
        })
      },
      fail: function () {
        // fail
        console.log("获取失败！")
      },
    })
    var platform = getApp().globalData.platform
    wx.getStorage({
      key: 'ptjssessionid',
      success: function (res) {
        wx.request({
          url: platform + 'api/wallet/getWallet',
          // url: 'http://192.168.0.199:8080/api/credit/checkin',
          method: "POST",
          data: '',
          header: {
            'content-type': 'application/json',
            "Cookie": 'JSESSIONID=' + res.data
          },
          success:function(opt){
            if (opt.data.code == 1000){
              var usableMoney = opt.data.content.usableMoney/100
              that.setData({
                usableMoney: getApp().ProcessingPrice(usableMoney)
              })
              wx.hideLoading()
            }else{
              wx.hideLoading()
              wx.showToast({
                title: opt.data.message,
                image: '../../../images/icon_info.png',
                duration: 3000,
              })
            }
          },
          fail:function(){
            wx.hideLoading()
            wx.showToast({
              title: '网络错误',
              image: '../../../images/icon_info.png',
              duration: 3000,
            })
          }
          })
      }
    })
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
            if (dat.data.code) {
              if (dat.data.code == 1000) {
                that.setData({
                  usableCredit: dat.data.content.usableCredit,
                  canCheckin: dat.data.content.canCheckin,
                })
              } else {
                wx.showToast({
                  title: dat.data.message,
                  duration: 2000,
                  image: '../../images/icon_info.png',
                  // mask: true,
                })
              }
            } else {
              //跳转登录页面
              wx.reLaunch({
                url: '/pages/login/login',
              })
            }
          },
          fail: function () {
            //跳转登录页面
            wx.reLaunch({
              url: '/pages/login/login',
            })
          }
        })
      }
    })
  }
});
