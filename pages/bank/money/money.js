
Page({
  data: {
    second: 60,
    selected: false,
    selected1: true,
    systemType: 2,
    value3: '',
    value4: ''
  },
  money:function(e){
    // console.log(e.detail.value)
    this.setData({
      money: e.detail.value
    })
  },
  onShow: function () {
    this.onLoad()
  },
  onLoad: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
      // mask:true,
    })
    var platform = getApp().globalData.platform
    wx.getStorage({
      key: 'ptjssessionid',
      success: function (res) {
        wx.request({
          url: platform + 'api/bankcard/cashingInit',
          // url: 'http://192.168.0.199:8080/api/credit/checkin',
          method: "POST",
          data: '',
          header: {
            'content-type': 'application/json',
            "Cookie": 'JSESSIONID=' + res.data
          },
          success: function (opt) {
            if (opt.data.code == 1000) {
              // console.log(opt)
              // var usableMoney = opt.data.content.usableMoney
              var defaultBankCard = opt.data.content.defaultBankCard
              if (defaultBankCard){
                //取前四位 defaultBankCard.cardNo.substring(0, 4) + '****' + 
              defaultBankCard.cardNo = defaultBankCard.cardNo.substring(defaultBankCard.cardNo.length - 4)
              var usableMoney = opt.data.content.usableMoney / 100
              that.setData({
                usableMoney: getApp().ProcessingPrice(usableMoney),
                mobile: opt.data.content.mobile,
                defaultBankCard: defaultBankCard,
                bankCardId: defaultBankCard.id
              })
              wx.hideLoading()
              }else{
                var usableMoney = opt.data.content.usableMoney / 100
                that.setData({
                  usableMoney: getApp().ProcessingPrice(usableMoney),
                  mobile: opt.data.content.mobile,
                  defaultBankCard: defaultBankCard,
                  // bankCardId: defaultBankCard.id
                })
                wx.hideLoading()
              }
              // wx.hideLoading()
            } else {
              wx.hideLoading()
              wx.showToast({
                title: opt.data.message,
                image: '../../../images/icon_info.png',
                duration: 3000,
              })
            }
            // console.log(opt)
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
  },
  phoneData: function (e) {
    var that = this
    wx.showLoading({
      title: '请稍后',
    })
    var GmUrl = getApp().globalData.GmUrl
    if (that.data.mobile != "") {
      var get_data = {}
      var content = {}
      get_data.phone = that.data.mobile
      content.content = get_data
      // marketing / wechat / sms
      //发短信接口
      wx.request({
        url: GmUrl + 'marketing/wechat/sms',
        method: "POST",
        data: content,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 1000) {
            var msgCode = res.data.content
            // console.log(msgCode)
            wx.hideLoading()
            that.setData({
              selected: true,
              selected1: false,
              xianshi: true,
              second: 60,
              msgCode: msgCode
            })
            countdown(that)
            wx.showToast({
              title: '发送成功',
              duration: 3000,
              // mask:true
            })
            wx.hideLoading()
          } else if (res.data.code == 1006) {
            wx.hideLoading()
            wx.showToast({
              title: res.data.message,
              image: '../../../images/icon_info.png',
              duration: 3000,
              // mask:true
            })
          } else {
            wx.hideLoading()
            wx.showToast({
              title: res.data.message,
              image: '../../../images/icon_info.png',
              duration: 3000,
              // mask:true
            })
          }
        },
        file: function (opt) {
          wx.hideLoading()
          wx.showToast({
            title: '系统错误',
            image: '../../../images/icon_info.png',
            duration: 3000,
            // mask:true
          })
        }
      })
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '号码不能为空',
        image: '../../../images/icon_info.png',
        duration: 3000,
        // mask:true
      })
    }

  },
  formSubmit: function (e) {
    var that = this
    wx.showLoading({
      title: '请稍后',
      mask:true,
    })
    var platform = getApp().globalData.platform
    var msgCode = that.data.msgCode
    var get_data = e.detail.value
    if (get_data.getMoney != '') {
      if (getApp().AmountVerification(get_data.getMoney)) {
      if (get_data.getMoney <= that.data.usableMoney){
      get_data.bankCardId = that.data.bankCardId
      if (get_data.msgCode == msgCode) {
        if (get_data.getMoney != '' || get_data.getMoney.length > 0) {
          if (get_data.bankCardId != undefined || get_data.bankCardId != undefined) {
            get_data.cashMoney = parseFloat(get_data.getMoney) * 100
            var content = {}
            content.content = get_data
            wx.getStorage({
              key: 'ptjssessionid',
              success: function (res) {
                wx.request({
                  url: platform + 'api/bankcard/applyCash',
                  // url: 'http://192.168.0.199:8080/api/credit/checkin',
                  method: "POST",
                  data: content,
                  header: {
                    'content-type': 'application/json',
                    "Cookie": 'JSESSIONID=' + res.data
                  },
                  success: function (aaa) {
                    if (aaa.data.code == 1000) {
                      wx.hideLoading()
                      that.setData({
                        disabled:true
                      })
                      wx.showToast({
                        title: '申请成功',
                        duration: 3000,
                      })
                      setTimeout(function () {
                        wx.navigateBack({
                          delta: 1
                        })
                      }, 3000)
                    } else {
                      wx.hideLoading()
                      wx.showToast({
                        title: aaa.data.message,
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
              },
              fail: function () {
                wx.hideLoading()
                wx.showToast({
                  title: '网络忙',
                  image: '../../../images/icon_info.png',
                  duration: 3000,
                })
              }
            })
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '银行卡为空',
              image: '../../../images/icon_info.png',
              duration: 3000,
            })
          }
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '金额为空',
            image: '../../../images/icon_info.png',
            duration: 3000,
            // mask:true
          })
        }
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '验证码错误',
          image: '../../../images/icon_info.png',
          duration: 3000,
          // mask:true
        })
      }
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '金额过大',
            image: '../../../images/icon_info.png',
            duration: 3000,
            // mask:true
          })
        }
    }else{
      wx.hideLoading()
      wx.showToast({
        title: '金额错误',
        image: '../../../images/icon_info.png',
        duration: 3000,
        // mask:true
      })
    }
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '金额为空',
        image: '../../../images/icon_info.png',
        duration: 3000,
        // mask:true
      })
    }
  }
})

function countdown(that) {
  // console.log(that.data.second);
  var second = that.data.second;
  if (second == 0) {
    // console.log("Time Out...");
    that.setData({
      selected: false,
      selected1: true,
      second: 60,
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }
    , 1000)
}
