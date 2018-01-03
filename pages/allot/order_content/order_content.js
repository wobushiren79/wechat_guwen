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
    popup_img: false
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
  bind_popup_img: function (e) {
    var imgurl = e.currentTarget.dataset.imgurl
    this.setData({
      popup_img: true,
      imgurl: imgurl
    })
  },
  bind_popup_close: function () {
    this.setData({
      popup_img: false
    })
  },
  onLoad: function (e) {
    content = this;
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
      tab_0:10000
    }else{
      this.setData({
        tab_0: e.currentTarget.dataset.index
      })
    }
  },

  bind_tab_1: function (e) {
    if (this.data.tab_1 == e.currentTarget.dataset.index) {
      tab_1: 10000
    } else {
      this.setData({
        tab_1: e.currentTarget.dataset.index
      })
    }
  },
  bind_tab_2: function (e) {
    if (this.data.tab_2 == e.currentTarget.dataset.index) {
      tab_2: 10000
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
      // if (data.listGoodsDetailResponse != '' || data.listGoodsDetailResponse != null || data.listGoodsDetailResponse){
      //   for (var i in data.listGoodsDetailResponse){
      //     if (data.listGoodsDetailResponse[i].goodsOrderItemList){
      //       for (var j in data.listGoodsDetailResponse[i].goodsOrderItemList){
      //         GoodsList.push(data.listGoodsDetailResponse[i].goodsOrderItemList[j])
      //       }
      //     } else if (data.listGoodsDetailResponse[i].goodsPackages){
      //       for (var j in data.listGoodsDetailResponse[i].goodsPackages) {
      //         GoodsList.push(data.listGoodsDetailResponse[i].goodsPackages[j])
      //       }
      //     }else{
      //       continue
      //     }

      //   }
      // }
      // console.log(GoodsList)
      content.setData({
        content: data,
        get_data: get_data,
        orderId: orderId,
        GoodsList: GoodsList
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("获取详情失败");
    }
  }
  orderCenterHttp.getOrderDetails(getRequest, getCallBack);
}