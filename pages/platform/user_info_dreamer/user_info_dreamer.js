// pages/platform/user_info_dreamer/user_info_dreamer.js
var content;
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  dreamerImgUrl: null   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  content = this;
	  var imgUrl = options.dreamerImgUrl;
	  content.setData({
		  dreamerImgUrl: imgUrl
	  }); 
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
   * 返回
   */
  dreamerBack:function(){
	  wx.navigateBack({
		  delta: 1
	  });
  }
})