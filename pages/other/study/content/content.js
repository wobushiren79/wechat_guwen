var content;
var id;
Page({
    data: {


    },
   onLoad:function(e){
     content=this;
      id=e.id;
     content.setData({
       url: getApp().globalData.appPHPUrl +"home/index/helps?id="+id
     })
   }
  , onShareAppMessage: function () {
    var pathUrl = "/pages/other/study/content/content?id=" + id;
    return {
      title: '学习中心',
      path: pathUrl,
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
          image: '/images/icon_info.png',
          // mask:true,
          duration: 2000
        })
      }
    }
  },
});
