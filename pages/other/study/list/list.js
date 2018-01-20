var appPHPHttp = require("../../../../utils/http/RequestForPHPApp.js")
var content;
var pageSize;
var pageNumber ;
var helpType ;
var listHelp;
Page({
  data: {
  },
  onLoad: function (e) {
    pageSize = 20;
    pageNumber = 0;
    helpType = 0;
    listHelp = new Array();
    content=this;
    helpType = e.type;
    getHelpList(helpType)
  },
  onReachBottom :function() {
    getHelpList(helpType)
  },
});



/**
 * 获取帮助列表
 */
function getHelpList(helpType) {
  var getListRequest = {
    pagerNumber: pageNumber,
    number: pageSize
  }
  if (helpType && helpType != 0) {
    getListRequest.type = helpType;
  }
  var getListCallBack = {
    success: function (data, res) {
      if (data.items && data.items.length > 0) {
        for (var i in data.items) {
          listHelp.push(data.items[i]);
        }
      }
      pageNumber++;
      content.setData({
        listHelp: listHelp
      })
    },
    fail: function (data, res) {

    }
  }
  appPHPHttp.getHelpList(getListRequest, getListCallBack)
}