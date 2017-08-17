
Page({
  data: {
   
  },
 bind_call: function () {
    wx.makePhoneCall({
      phoneNumber: '966188', //仅为示例，并非真实的电话号码
      fail: function (res) {
        wx.showToast({
          title: '拨打电话失败',
          duration: 3000
        })
      }
    })
  },
})
