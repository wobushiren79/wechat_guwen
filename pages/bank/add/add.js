
Page({
  data: {
    // bankName: ["中国银行 ", "中国工商银行 ", "中国招商银行", "中国农业银行", "中国建设银行 ", "中国光大银行 ", "中国交通银行", "中国民生银行", "中国邮政储蓄银行","其他"],
    // bankIndex: 0
  },

  bindBank: function (e) {
    // console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      bankIndex: e.detail.value
    })
  },
  bankName:function(e){
    var that=this
    wx.showLoading({
      title: '请稍后',
      // mask:true,
    })
    // console.log(e.detail.value)
    var platform = getApp().globalData.platform
    var content={}
    var get_data={}
    content.cardNo = e.detail.value
    get_data.content = content
    wx.getStorage({
      key: 'ptjssessionid',
      success: function (res) {
        wx.request({
          url: platform + 'api/bankcard/queryCardBins',
          // url: 'http://192.168.0.199:8080/api/credit/checkin',
          method: "POST",
          data: get_data,
          header: {
            'content-type': 'application/json',
            "Cookie": 'JSESSIONID=' + res.data
          },
          success: function (opt) {
            if (opt.data.code == 1000) {
              var bankName = opt.data.content.bankName
              that.setData({
                bankName: bankName
              })
              wx.hideLoading()
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
  },
  formSubmit:function(e){
    var that=this
    wx.showLoading({
      title: '请稍后',
      mask:true,
    })
    var bankName = that.data.bankName
    var get_data = e.detail.value
    get_data.bankName = bankName
    get_data.isDefault = 0
    var get_content={}
    get_content.content = get_data
    var platform = getApp().globalData.platform
    if (get_data.accountName.length == 0 || get_data.cardNo.length == 0 || get_data.bankName== undefined){
      wx.hideLoading()
      wx.showToast({
        title: '不能为空',
        image: '../../../images/icon_info.png',
        duration: 3000,
      })
    }else{
      wx.getStorage({
        key: 'ptjssessionid',
        success: function (res) {
          wx.request({
            url: platform + 'api/bankcard/addingCard',
            // url: 'http://192.168.0.199:8080/api/credit/checkin',
            method: "POST",
            data: get_content,
            header: {
              'content-type': 'application/json',
              "Cookie": 'JSESSIONID=' + res.data
            },
            success: function (opt) {
              if (opt.data.code == 1000) {
                wx.hideLoading()
                wx.showToast({
                  title: '添加成功',
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
    }
  }
})
