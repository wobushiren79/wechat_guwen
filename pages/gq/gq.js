// pages/C_img/C_img.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onShareAppMessage: function () {
    return {
      title: '圆满人生公共殡葬服务平台国庆活动',
      path: '/pages/gq/gq',
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          duration: 2000,
          // mask: true,
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享成功',
          duration: 2000,
          image: '../../images/icon_info.png',
          // mask: true,
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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