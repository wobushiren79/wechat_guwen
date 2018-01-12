var orderCenterHttp = require("../../../utils/http/RequestForOrderCenter.js")
var toastUtil = require("../../../utils/ToastUtil.js");
var pageUtil = require("../../../utils/PageUtil.js");
var checkTools = require("../../../utils/CheckTools.js")
var content;
Page({
  data: {
    icon: "../../../images/dog_chang.jpg",
    icon2: "../../../images/dog.png",
    tab_0: 0,
    tab_1: 0,
    tab_2: 0,
    tab: 0,
    popup_img: false,
    name:[],
    call:false
  },
  tel: function (e) {
    var tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel, //仅为示例，并非真实的电话号码
      complete: function (res) {
        console.log(res)
      },
    })
  },
  bind_tel: function () {
    var that=this
    var tel_call= that.data.tel_call
    wx.showActionSheet({
      itemList: that.data.name,
      success: function (res) {
        wx.makePhoneCall({
          phoneNumber: tel_call[res.tapIndex]
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  bind_popup_img: function (e) {
    var imgurl = e.currentTarget.dataset.imgurl
    this.setData({
      mask: true,
      popup_img: true,
      imgurl: imgurl
    })
  },
  bind_popup_close: function () {
    this.setData({
      mask: false,
      popup_img: false
    })
  },

  onLoad: function (e) {
    content = this;
    // console.log(e.call)
    if (e.call){
       content.setData({
         call:true
       })
    }
    getOrderDetails(e.orderId)
  },
  bind_tab:function(e){
    this.setData({
      tab: e.currentTarget.dataset.tab 
    })
  },
  bind_tab_0: function (e) {
    // var that=this
    // console.log()
    if (this.data.tab_0 == e.currentTarget.dataset.index){
      this.setData({
        tab_0: 1000000
      })
    }else{
      // console.log(222222)
      this.setData({
        tab_0: e.currentTarget.dataset.index
      })
    }
  },

  bind_tab_1: function (e) {
    if (this.data.tab_1 == e.currentTarget.dataset.index) {
      this.setData({
        tab_1: 1000000
      })
    } else {
      this.setData({
        tab_1: e.currentTarget.dataset.index
      })
    }
  },
  bind_tab_2: function (e) {
    if (this.data.tab_2 == e.currentTarget.dataset.index) {
      this.setData({
        tab_2: 1000000
      })
    } else {
      this.setData({
        tab_2: e.currentTarget.dataset.index
      })
    }
  }
});
/**
 * 获取工单详情
 */
function getOrderDetails(orderId) {
  var getRequest = {
    orderId: orderId
  }
  var getCallBack = {
    success: function (data, res) {
      var get_data = []
      for (var i in data.listPerformRecord) {
        get_data.push(data.listPerformRecord[i].performPic.split(","))
      }
      var GoodsList=[]
      var name=[]
      var tel_call=[]
      if (data.customerInfo.agentName && data.customerInfo.agentPhone){
        name.push('经办人-'+data.customerInfo.agentName + ':' + data.customerInfo.agentPhone)
        tel_call.push(data.customerInfo.agentPhone)
      }
      if (data.customerInfo.contactName && data.customerInfo.contactPhone){
        name.push('联系人-'+data.customerInfo.contactName + ':' + data.customerInfo.contactPhone)
        tel_call.push(data.customerInfo.contactPhone)
      }
      name.push('圆满人生-客服:966188')
      tel_call.push('966188')
      console.log(tel_call)
      console.log(name)
      content.setData({
        content: data,
        get_data: get_data,
        orderId: orderId,
        GoodsList: GoodsList,
        name: name,
        tel_call: tel_call
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("获取详情失败");
    }
  }
  orderCenterHttp.getOrderDetails(getRequest, getCallBack);
}