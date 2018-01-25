var phpAppHttp = require("../../../../utils/http/RequestForPHPApp.js");
var pageUtil = require("../../../../utils/PageUtil.js");
var toastUtil = require("../../../../utils/ToastUtil.js");
var content;
var pageSize;
var pageNumber;
var listData;
Page({
  data: {
    Length: 0
  },
  onLoad: function () {
    content = this
    pageSize = 4;
    pageNumber = 0;
    listData = new Array();
    getActivityList();

  },

  //下拉添加记录条数
  onReachBottom: function () {
    getActivityList();
  }
})


/**
 * 获取活动数据
 */
function getActivityList() {
  // var listRequest = pageUtil.getPageData();
  var listRequest = {
    pagerNumber: pageNumber,
    number: pageSize
  }
  listRequest.type = 1;
  var listCallBack = {
    success: function (data, res) {
      pageNumber++;
      var siftdata = res.data.content.items
      if (siftdata && siftdata.length > 0) {
        for (var i in siftdata) {
          listData.push(siftdata[i]);
        }
      }
      var Length = siftdata.length
      listData
      content.setData({
        siftdata: listData,
        Length: Length
      })
    },
    fail: function (data, res) {
    }
  }
  phpAppHttp.getActivityList(listRequest, listCallBack);
}