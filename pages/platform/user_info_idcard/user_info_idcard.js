// pages/platform/user_info_idcard/user_info_idcard.js
var content;
Page({

  /**
   * 页面的初始数据
   */
  data: {
	idCardUserName:"",
	idCardNo:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  content=this;
	  var userName = options.userName;
	  var cardNo = options.cardNo;
	  var numberSpell = cardNo.substr(0, 4);
	  for (var i = 0; i < 12; i++) {
		  numberSpell += "*";
	  }
	  numberSpell += cardNo.substr(cardNo.length - 2, cardNo.length - 1);
	  console.log(numberSpell.length);
	  content.setData({
		  idCardUserName: userName,
		  idCardNo: numberSpell
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
  idCardBack:function(){
	  wx.navigateBack({
		  delta: 1
	  });
  }
})