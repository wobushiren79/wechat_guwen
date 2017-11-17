Page({
    data: {

    },
    defaultBankCard: function (e) {
      var that=this
      var pid=that.data.pid
      wx.showLoading({
        title: '请稍后',
        // mask:true,
      })
      var platform = getApp().globalData.platform
      var content={}
      var get_data={}
      content.bankCardId= e.target.dataset.id
      get_data.content = content
      wx.getStorage({
        key: 'ptjssessionid',
        success: function (res) {
          wx.request({
            url: platform + 'api/bankcard/settingDefaultCard',
            // url: 'http://192.168.0.199:8080/api/credit/checkin',
            method: "POST",
            data: get_data,
            header: {
              'content-type': 'application/json',
              "Cookie": 'JSESSIONID=' + res.data
            },
            success: function (opt) {
              if (opt.data.code == 1000) {
                wx.hideLoading()
                wx.showToast({
                  title: '设置成功',
                  duration: 2000,
                })
                if(pid == 1){
                  setTimeout(function () {
                    wx.navigateBack({
                      delta:1
                    })
                  }, 2000)
                }
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: opt.data.message,
                  image: '../../../images/icon_info.png',
                  duration: 3000,
                })
              }
            },
            fail: function () {
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
      // console.log(e.target.dataset.id)
    },
    onShow: function (){
      var that=this
      var vent={}
      vent.pid = that.data.pid
      that.onLoad(vent)
   },
  onLoad: function (vent) {
    var that = this;
    var pid =vent.pid
    wx.showLoading({
      title: '加载中',
      // mask:true,
    })
    var platform = getApp().globalData.platform
    wx.getStorage({
      key: 'ptjssessionid',
      success: function (res) {
        wx.request({
          url: platform + 'api/bankcard/queryCardInfoForList',
          // url: 'http://192.168.0.199:8080/api/credit/checkin',
          method: "POST",
          data: '',
          header: {
            'content-type': 'application/json',
            "Cookie": 'JSESSIONID=' + res.data
          },
          success: function (opt) {
            if (opt.data.code == 1000) {
              // console.log(opt.data.content)
              var defaultBankCard = opt.data.content.defaultBankCard
              if (defaultBankCard){
              defaultBankCard.cardNo = defaultBankCard.cardNo.substring(0, 4) + '****' + defaultBankCard.cardNo.substring(defaultBankCard.cardNo.length - 4)
              }
              var userBankCardList = opt.data.content.userBankCardList
              if (userBankCardList){
              for (var i in userBankCardList){
                userBankCardList[i].cardNo = userBankCardList[i].cardNo.substring(0, 4) + '****' + userBankCardList[i].cardNo.substring(userBankCardList[i].cardNo.length - 4)
              }
              }
              
                     that.setData({
                       defaultBankCard: defaultBankCard,
                       userBankCardList: userBankCardList,
                       pid: pid
                     })
                     wx.hideLoading()
            } else {
              wx.hideLoading()
              wx.showToast({
                title: opt.data.message,
                image: '../../images/icon_info.png',
                duration: 3000,
              })
            }
            // console.log(opt)
          },
          fail: function () {
            wx.hideLoading()
            wx.showToast({
              title: '网络错误',
              image: '../../images/icon_info.png',
              duration: 3000,
            })
          }
        })
      }
    })
  }
});
