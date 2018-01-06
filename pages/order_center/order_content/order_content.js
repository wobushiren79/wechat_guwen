var orderCenterHttp = require("../../../utils/http/RequestForOrderCenter.js")
var toastUtil = require("../../../utils/ToastUtil.js");
var pageUtil = require("../../../utils/PageUtil.js");
var content;
Page({
    data: {
      icon:"../../images/dog_chang.jpg",
      icon2: "../../images/dog.png",
      goods_cells:false
    },
    bind_goods:function(e){
      this.setData({
        goods_cells: !this.data.goods_cells
      })
    },
    onLoad: function (e) {
      content = this;
      getOrderDetails(e.orderId)
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
      var goodsList=[]
      for (var i in data.listGoodsDetailResponse){
        for (var j in data.listGoodsDetailResponse[i].goodsOrderItemList){
          goodsList.push(data.listGoodsDetailResponse[i].goodsOrderItemList[j])
         }
        for (var j in data.listGoodsDetailResponse[i].goodsPackages) {
          goodsList.push(data.listGoodsDetailResponse[i].goodsPackages[j])
        }
      }
      content.setData({
        content: data,
        get_data: get_data,
        orderId: orderId,
        goodsList: goodsList
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("获取详情失败");
    }
  }
  orderCenterHttp.detailsAll(getRequest, getCallBack);
}