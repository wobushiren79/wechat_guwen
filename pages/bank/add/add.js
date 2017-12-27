var RequestForPlatformm = require('../../../utils/http/RequestForPlatform.js');
var toastUtil = require("../../../utils/ToastUtil.js");
var storageKey = require("../../../utils/storage/StorageKey.js");
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
    var content={}
    content.cardNo = e.detail.value
    var getRequest = content
    var getCallBack={
      success:function(opt){
              var bankName = opt.bankName
              that.setData({
                bankName: bankName
              })
      },
      fail:function(){
        toastUtil.showToast("获取失败");
      }
    }
    RequestForPlatformm.queryCardBins(getRequest, getCallBack)
  },
  formSubmit:function(e){
    var that=this
    var get_data = e.detail.value
    get_data.isDefault = 0
    var platform = getApp().globalData.platform
    if (get_data.accountName.length == 0 || get_data.cardNo.length == 0 || get_data.bankName == undefined || get_data.bankName.length == 0){
      toastUtil.showToast("不能为空");
    }else{
      var getRequest = get_data
      var getCallBack={
        success:function(opt){
          toastUtil.showToast("添加成功");
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 3000)
        },
        fail:function(){
          toastUtil.showToast("获取失败");
        }
      }
      RequestForPlatformm.addingCard(getRequest, getCallBack);
    }
  }
})
