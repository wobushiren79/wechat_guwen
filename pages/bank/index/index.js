Page({
    data: {
      usableMoney:'0.00'
    },
  onShow:function(){
    this.onLoad()
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
  }
});
