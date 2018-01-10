var appPHPHttp = require("../../../../utils/http/RequestForPHPApp.js")
var content;
Page({
  data: {

  },
  onLoad: function (e) {
    content = this;
    getHelpList();
  },
  bind_phone: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone, //仅为示例，并非真实的电话号码
      fail: function (res) {
        wx.showToast({
          title: '拨打电话失败',
          image: '/images/icon_info.png',
          duration: 3000
        })
      }
    })
  },
});


/**
 * 获取帮助列表
 */
function getHelpList() {
  var getListRequest={
    pagerNumber:0,
    number:5
  }
  var getListCallBack={
    success:function(data,res){

    },
    fail:function(data,res){

    }
  }
  appPHPHttp.getHelpList(getListRequest, getListCallBack)
}