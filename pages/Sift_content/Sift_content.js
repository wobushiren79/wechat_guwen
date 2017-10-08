// pages/find/find_.js
var WxParse = require('../../wxParse/wxParse.js');  
Page({
  data: {
    // title: "文章标题文章标题",
    titledata:'',
    time: "2017-12-12",
    author: "圆满人生原创",
    keyword: ['关键词1', '关键词2'],
    num: 0,
    content_bd_text: "文章正文文章正文文章正文文章正文文章正文文章正文"
  },
  onLoad: function (options) {
   
    var that = this;
    var optionId= options.id
    var titledata = options.title
    // console.log(titledata)
    var AppUrl = getApp().globalData.AppUrl + 'Home/index/sifts?id=' + optionId 
    //查询精选详情接口
    wx.request({
      url: AppUrl,
      method: "GET",
      data: '',
      header: {
        // "Content-Type": "application/x-www-form-urlencodeed",
        // "Cookie": "sid=" + res.data.content.sessionId
        "Content-Type": "application/json"  
      },
      success: function (res) {
        var article = res.data
        WxParse.wxParse('article', 'html', article, that,);
        that.setData({
          id:optionId,
          titledata: titledata
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '圆满人生公共殡葬服务平台',
      path: '/pages/Sift_content/Sift_content?id=' + this.data.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})