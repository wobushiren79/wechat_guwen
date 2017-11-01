//部分参数我就不抽出了，关键是看实现机制
var app = getApp();

Page({
  data: {
    files:[]
  },
  //调用手机号码方法验证手机号码
  checktel: function (e) {
    this.checkMobile(e.detail.value)
  },
  //手机号码验证
  checkMobile: function (sMobile) {
    if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(sMobile))) {
      wx.showToast({
        title: '号码不正确',
        image: '../../../images/icon_info.png',
        duration: 2000
      })
    } else {
     
    }
  },
  //验证价格
  orderPrice:function(e){
    this.checkStr(e.detail.value)
  },
  //验证数字和小数组合的字符串
  checkStr:function(str){
    var that=this
    var re = /^\d+(?=\.{0,1}\d+$|$)/ 
    if (re.test(str)){
      that.setData({
        price:true
      })
    }else{
      wx.showToast({
        title: '价格不正确',
        image: '../../../images/icon_info.png',
        duration: 2000
      })
    }
  },
  //上传图片
  uploadImage: function (e) {
    var that=this
    var GmUrl = getApp().globalData.GmUrl
    var files = that.data.files
    wx.chooseImage({
      count:1,
      success: function (res) {
        //图片地址
        var tempFilePaths = res.tempFilePaths
        //文件路径
        var tempFiles = res.tempFiles
        wx.showLoading({
          title: '上传中',
          mask:true,
        })
        wx.uploadFile({
          // url: GmUrl+'fileqiniu/upload', //仅为示例，非真实的接口地址
          url:'https://t-cemetery-api.shianlife.cn/shianlife-advisor-cemetery-1.0-SNAPSHOT/fileqiniu/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],//要上传文件资源的路径
          name: 'file',//文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
          formData: {//HTTP 请求中其他额外的 form data
            'user': 'test'
          },
          success: function (res) {//接口调用成功的回调函数
          // console.log(res)
          var data = JSON.parse(res.data)
          if(data.code == 1000){
            files.push(data.content.nameMap.file)
            that.setData({
              files: files
            })
            wx.hideLoading()
          }else{
            wx.hideLoading()
            wx.showToast({
              title: '上传失败',
              image: '../../../images/icon_info.png',
              duration: 3000
            })
          }
          },
          fail:function(res){
            wx.hideLoading()
            wx.showToast({
              title: '网络错误',
              image: '../../../images/icon_info.png',
              duration: 3000
            })
          }
        })
      }
    })
  },
  deleteImage:function(e){
    var that=this
    wx.showLoading({
      title: '请稍后',
      // mask:true,
    })
    var img_url=e.currentTarget.dataset.img
    var filess = that.data.files
    var files=[]
    for (var i in filess){
      if (filess[i] != img_url){
        files.push(filess[i])
           }
    }
    that.setData({
      files: files
    })
    wx.hideLoading()
  },
  onLoad: function (evet) {
    var that=this
    //取出分单登录权限
    wx.getStorage({
      key: 'orderCenter',
      success: function (res) {
        that.setData({
          orderId:evet.orderId,
          orderCenter:res.data
        })
      },
      fail:function(res){
        wx.showModal({
          title: '登录超时',
          content: '是否返回重新登录',
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '../../login/login',
              })
            } else if (res.cancel) {

            }
          }
        })
      }
    })
  },
  //提交审核
  formSubmit:function(e){
   var that=this
   wx.showLoading({
     title: '请稍后',
     // mask:true,
   })
   var files = that.data.files
   var content={}
   var get_data={}
   get_data = e.detail.value
   get_data.orderId=that.data.orderId 
   get_data.performStatus=1
   if (that.data.files.length>0){
     get_data.performPic = that.data.files.join(',') 
   }
    content.content = get_data
    var orderCenterUrl = getApp().globalData.orderCenterUrl
    if (get_data.performPic !=='' && get_data.performSummar !== '' && get_data.agentName !== '' && get_data.agentPhone !== '' && get_data.serviceTarget !== '' && get_data.orderPrice !== ''){

      if (that.data.price){
        wx.request({
          url: orderCenterUrl + 'api/performer/dealAgain',
          data: content,
          header: {
            'content-type': 'application/json',
            "Cookie": that.data.orderCenter
          },
          method: 'POST',
          dataType: 'json',
          success: function (opt) {
            // console.log(opt.data)
            if (opt.data.code == 1000) {
              wx.showModal({
                title: '圆满人生提示您',
                content: opt.data.message,
                confirmText: '跳转审核',
                cancelText: '返回列表',
                success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../order_list_audit/order_list_audit',
                    })
                  } else if (res.cancel) {
                    wx.redirectTo({
                      url: '../order_list_wait/order_list_wait',
                    })
                  }
                }
              })
              wx.hideLoading()
            } else {
              wx.hideLoading()
              wx.showModal({
                title: opt.data.message,
                content: '是否返回重新登录',
                success: function (res) {
                  if (res.confirm) {
                    wx.reLaunch({
                      url: '../../login/login',
                    })
                  } else if (res.cancel) {

                  }
                }
              })
            }
          },
          fail: function (res) {
            wx.hideLoading()
            wx.showModal({
              title: '网络错误',
              content: '是否返回重新登录',
              success: function (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../../login/login',
                  })
                } else if (res.cancel) {

                }
              }
            })
          },
        })
    }else{
        wx.hideLoading()
        wx.showToast({
          title: '金额不正确',
          duration: 2000,
          image: '../../../images/icon_info.png',
          // mask: true,
        })
    }

    }else{
      wx.hideLoading()
      wx.showToast({
        title: '不能为空',
        duration: 2000,
        image: '../../../images/icon_info.png',
        // mask: true,
      })
    }
   
   },
  //再次处理
  formData:function(e){
    var that = this
    wx.showLoading({
      title: '请稍后',
      // mask:true,
    })
    var files = that.data.files
    var content = {}
    var get_data = {}
    get_data = e.detail.value
    get_data.orderId = that.data.orderId
    get_data.performStatus = 0
    if (that.data.files.length > 0) {
      get_data.performPic = that.data.files.join(',')
    }
    content.content = get_data
    var orderCenterUrl = getApp().globalData.orderCenterUrl
    if (get_data.performPic !== '' && get_data.performSummar !== '' && get_data.agentName !== '' && get_data.agentPhone !== '' && get_data.serviceTarget !== '' && get_data.orderPrice !== '') {

     if(that.data.price){
       wx.request({
         url: orderCenterUrl + 'api/performer/dealAgain',
         data: content,
         header: {
           'content-type': 'application/json',
           "Cookie": that.data.orderCenter
         },
         method: 'POST',
         dataType: 'json',
         success: function (opt) {
           // console.log(opt.data)
           if (opt.data.code == 1000) {
             wx.showModal({
               title: '圆满人生提示您',
               content: opt.data.message,
               showCancel: false,
               success: function (res) {
                 if (res.confirm) {
                   wx.navigateBack({
                     delta: 1
                   })
                 }
               }
             })
             wx.hideLoading()
           } else {
             wx.hideLoading()
             wx.showModal({
               title: opt.data.message,
               content: '是否返回重新登录',
               success: function (res) {
                 if (res.confirm) {
                   wx.reLaunch({
                     url: '../../login/login',
                   })
                 } else if (res.cancel) {

                 }
               }
             })
           }
         },
         fail: function (res) {
           wx.hideLoading()
           wx.showModal({
             title: '网络错误',
             content: '是否返回重新登录',
             success: function (res) {
               if (res.confirm) {
                 wx.reLaunch({
                   url: '../../login/login',
                 })
               } else if (res.cancel) {

               }
             }
           })
         },
       })
     }else{
       wx.hideLoading()
       wx.showToast({
         title: '金额不正确',
         duration: 2000,
         image: '../../../images/icon_info.png',
         // mask: true,
       })
     }

    } else {
      wx.hideLoading()
      wx.showToast({
        title: '不能为空',
        duration: 2000,
        image: '../../../images/icon_info.png',
        // mask: true,
      })
    }
  },
})
