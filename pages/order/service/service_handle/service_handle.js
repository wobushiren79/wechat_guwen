var orderCenterHttp = require("../../../../utils/http/RequestForOrderCenter.js")
var toastUtil = require("../../../../utils/ToastUtil.js");
var pageUtil = require("../../../../utils/PageUtil.js");
var checkTools = require("../../../../utils/CheckTools.js")
var content;
var app = getApp();

Page({
  data: {
    files: []
  },
  //调用手机号码方法验证手机号码
  checktel: function (e) {
    this.checkMobile(e.detail.value)
  },
  //手机号码验证
  checkMobile: function (sMobile) {
    var str = checkTools.checkMobile(sMobile)
    if (!str) {
      wx.showToast({
        title: '号码不正确',
        image: '/images/icon_info.png',
        duration: 2000
      })
    }else{
      this.setData({
        agentPhone:str
      })
    } 
  },
  //验证价格
  orderPrice: function (e) {
    this.checkStr(e.detail.value)
  },
  //验证数字和小数组合的字符串
  checkStr: function (str) {
    var that = this
    var re = /^\d+(?=\.{0,1}\d+$|$)/
    if (re.test(str)) {
      that.setData({
        price: true
      })
    } else {
      wx.showToast({
        title: '价格不正确',
        image: '/images/icon_info.png',
        duration: 2000
      })
    }
  },
  //上传图片
  uploadImage: function (e) {
    var that = this
    var GmUrl = getApp().globalData.GmUrl
    var files = that.data.files
    wx.chooseImage({
      count: 1,
      success: function (res) {
        //图片地址
        var tempFilePaths = res.tempFilePaths
        //文件路径
        var tempFiles = res.tempFiles
        wx.showLoading({
          title: '上传中',
          mask: true,
        })
        wx.uploadFile({
          // url: GmUrl+'fileqiniu/upload', //仅为示例，非真实的接口地址
          url: 'https://platform.shianlife.cn/fileqiniu/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],//要上传文件资源的路径
          name: 'file',//文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
          formData: {//HTTP 请求中其他额外的 form data
            'user': 'test'
          },
          success: function (res) {//接口调用成功的回调函数
            // console.log(res)
            var data = JSON.parse(res.data)
            if (data.code == 1000) {
              files.push(data.content.nameMap.file)
              that.setData({
                files: files
              })
              wx.hideLoading()
            } else {
              wx.hideLoading()
              wx.showToast({
                title: '上传失败',
                image: '/images/icon_info.png',
                duration: 3000
              })
            }
          },
          fail: function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '网络错误',
              image: '/images/icon_info.png',
              duration: 3000
            })
          }
        })
      }
    })
  },
  deleteImage: function (e) {
    var that = this
    wx.showLoading({
      title: '请稍后',
      // mask:true,
    })
    var img_url = e.currentTarget.dataset.img
    var filess = that.data.files
    var files = []
    for (var i in filess) {
      if (filess[i] != img_url) {
        files.push(filess[i])
      }
    }
    that.setData({
      files: files
    })
    wx.hideLoading()
  },
  onLoad: function (evet) {
    content = this;
    content.setData({
      orderId: evet.orderId,
    })
    getOrderDetails(evet.orderId)
  },
  //提交审核
  formSubmit: function (e) {
    var get_data = {}
    get_data = e.detail.value
    get_data.orderId = content.data.orderId
    get_data.performStatus = 1
    var fileStr = "";
    for (var i in content.data.files) {
      if (i == 0) {
        fileStr += content.data.files[i]
      } else {
        fileStr += ("," + content.data.files[i])
      }
    }
    get_data.performPic = fileStr;
    dealOrder(get_data);
  },
  //再次处理
  formData: function (e) {
    var get_data = {}
    get_data = e.detail.value
    get_data.orderId = content.data.orderId
    get_data.performStatus = 0
    var fileStr = "";
    for (var i in content.data.files) {
      if (i == 0) {
        fileStr += content.data.files[i]
      } else {
        fileStr += ("," + content.data.files[i])
      }
    }
    get_data.performPic = fileStr;
    dealOrder(get_data);
  },
})

/**
 * 处理工单
 */
function dealOrder(dealRequest) {
  if (!dealRequest) {
    toastUtil.showToast("没有提交数据");
    return
  }
  if (!dealRequest.orderId) {
    toastUtil.showToast("没有orderId");
    return
  }
  if (dealRequest.performStatus == null) {
    toastUtil.showToast("没有performStatus");
    return
  }
  if (!dealRequest.agentName || dealRequest.agentName.length == 0) {
    toastUtil.showToast("经办人未填写");
    return
  }
  if (!dealRequest.agentPhone || dealRequest.agentPhone.length == 0) {
    toastUtil.showToast("电话未填写");
    return
  }
  if (!checkTools.checkMobile(dealRequest.agentPhone)) {
    toastUtil.showToast("电话格式不对");
    return
  }
  if (!dealRequest.serviceTarget) {
    toastUtil.showToast("没有服务对象");
    return
  }
  // if (!dealRequest.orderPrice) {
  //   toastUtil.showToast("没有订单金额");
  //   return
  // }
  // if (!checkTools.checkMoney(dealRequest.orderPrice)) {
  //   toastUtil.showToast("金额格式错误");
  //   return
  // }
  if (!dealRequest.performSummary || dealRequest.performSummary.length == 0) {
    toastUtil.showToast("没有处理结果");
    return
  }
  if (!dealRequest.performPic || dealRequest.performPic.length == 0) {
    toastUtil.showToast("没有服务照片");
    return
  }


  var dealCallBack = {
    success: function (data, res) {
      if (dealRequest.performStatus==0){

        wx.navigateBack({
          delta: 1
        })
      } else if (dealRequest.performStatus == 1) {
       wx.redirectTo({
         url: '/pages/order/service/service_list_audit/service_list_audit',
       })
      }
   
    },
    fail: function (data, res) {
      toastUtil.showToast("提交失败");
    }
  }
  orderCenterHttp.dealOrder(dealRequest, dealCallBack);
}


/**
 * 获取工单详情
 */
function getOrderDetails(orderId) {
  var getRequest = {
    orderId: orderId
  }
  var getCallBack = {
    success: function (data, res) {
      if (data.customerInfo.agentName!=null)
      content.setData({
        agentName: data.customerInfo.agentName
      })
      if (data.customerInfo.agentPhone != null)
      content.setData({
        agentPhone: data.customerInfo.agentPhone
      })
      if (data.customerInfo.serviceTarget != null)
      content.setData({
        serviceTarget: data.customerInfo.serviceTarget
      })
    },
    fail: function (data, res) {
    }
  }
  orderCenterHttp.getOrderDetails(getRequest, getCallBack);
}