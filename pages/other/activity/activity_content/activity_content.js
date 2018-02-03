
var content;
var id;
Page({
  data: {


  },
  onLoad: function (options) {
    content = this;
    var optionId = options.id
    content.setData({
      url:getApp().globalData.AppUrl + 'Home/index/sifts?id=' + optionId
    })
  },
});