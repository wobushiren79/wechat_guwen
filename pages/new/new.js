Page({
  data: {
    array: ['紧急', '不紧急'],
    businessType: 0,
    Address: '',
  },
  bindPickerChange: function (e) {
    this.setData({
      businessType: e.detail.value
    })
  },
  formSubmit: function (e) {
    var RouteUrl = getApp().globalData.RouteUrl
    var ContentData = e.detail.value
    if (this.data.businessType == 0) {
      ContentData.businessType = 1
    } else if (this.data.businessType == 1) {
      ContentData.businessType = 2
    }
    if (ContentData.customerName !='' && ContentData.customerMobile != '' && ContentData.customerAddressNew != '') {
      // 取出緩存登錄信息
      wx.getStorage({
        key: 'logindata',
        success: function (msg) {
          // console.log(ContentData)
          var forData = { content: ContentData }
          //转换字符串
          var ForData = JSON.stringify(forData)
          wx.request({
            url: RouteUrl + 'consult/add',
            method: "POST",
            data: ForData,
            header: {
              "Content-Type": "application/x-www-form-urlencodeed",
              "Cookie": "sid=" + msg.data.content.sessionId
            },
            success: function (res) {
              //console.log(res.data)
              if (res.data.code == 1000 && res.data.message == '操作成功') {
                var consultId = res.data.content.consultId
                //頁面跳轉
                wx.redirectTo({
                  url: '../order/order?consultId=' + consultId
                })
              }
            }
          })
        }
      })
    } else if (ContentData.customerName == '') {
      wx.showToast({
        title: '客户姓名不能为空',
        duration: 2000
      })
    } else if (ContentData.customerMobile == '' ) {
      wx.showToast({
        title: '客户电话不能为空',
        duration: 2000
      })
    } else if (ContentData.customerAddressNew == '') {
      wx.showToast({
        title: '客户地址不能为空',
        duration: 2000
      })
    }
  },
  Location: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        var Address = res.address
        that.setData({
          Address: Address
        })
      }
    })

  },
  formData: function (e) {
    var ContentData = e.detail.value
    var YanzData = this.data.YanzData
    var RouteUrl = getApp().globalData.RouteUrl
    if (this.data.businessType == 0) {
      ContentData.businessType = 1
    } else if (this.data.businessType == 1) {
      ContentData.businessType = 2
    }
    if (ContentData.customerName !='' && ContentData.customerMobile != '' && ContentData.customerAddressNew != '') {
      // 取出緩存登錄信息
      wx.getStorage({
        key: 'logindata',
        success: function (msg) {
          // console.log(ContentData)
          var forData = { content: ContentData }
          //转换字符串
          var ForData = JSON.stringify(forData)
          wx.request({
            url: RouteUrl + 'consult/add',
            method: "POST",
            data: ForData,
            header: {
              "Content-Type": "application/x-www-form-urlencodeed",
              "Cookie": "sid=" + msg.data.content.sessionId
            },
            success: function (res) {
              //console.log(res.data)
              if (res.data.code == 1000 && res.data.message == '操作成功') {
                //頁面跳轉
                wx.redirectTo({
                  url: '../list/list'
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  duration: 2000
                })
              }
            }
          })
        }
      })
    } else if (ContentData.customerName == '') {
      wx.showToast({
        title: '客户姓名不能为空',
        duration: 2000
      })
    } else if (ContentData.customerMobile == '' ) {
      wx.showToast({
        title: '客户电话不能为空',
        duration: 2000
      })
    } else if (ContentData.customerAddressNew == '') {
      wx.showToast({
        title: '客户地址不能为空',
        duration: 2000
      })
    }
  }
});
