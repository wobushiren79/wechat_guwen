
Page({
  
  data:{
    edit: true,
    totla_price:0,
  },
  bind_edit: function () {
    this.setData({
      edit: false,
      over: true
    })
  },
  bind_over: function () {
    this.setData({
      edit: true,
      over: false
    })
  },
  onLoad:function(){
    var that=this
    var JSESSIONID=''
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    // 取出殡仪登录信息
    wx.getStorage({
      key: 'JSESSIONID',
      success: function (res) {
        JSESSIONID=res.data
      }
      })
    var LocalUrl = getApp().globalData.LocalUrl
    var javaApi = getApp().globalData.javaApi
    // 取出渠道信息
    wx.getStorage({
      key: 'channel',
      success: function (res) {
        var channel_id=res.data.id
        var content={}
        content.pageSize = 1000
        content.pageNumber=0
        var contents={}
        contents.channelId = channel_id
        content.content = contents
        var ForData = { content: content}
        wx.request({
          url: javaApi + 'api/goods/shopping/list',
          method: "POST",
          data: ForData,
          header: {
            'content-type': 'application/json',
            "Cookie": JSESSIONID
          },
          success: function (res) {
            if (res.data.code == 1000) {
              var list=res.data.content.content
              var goodsId=''
              var channelId=''
              var goodsSpecId = ''
              var packageId=''
              var packageSpecId=''
              for (var i in list){
                if(i==0){
                  if (list[i]['isPackage'] == 0){
                    goodsId += list[i]['goodsId']+','
                    channelId += list[i]['channelId'] + ','
                    goodsSpecId += list[i]['goodsSpecId'] + ','
                  }
                  if (list[i]['isPackage'] == 1){
                    packageSpecId += list[i]['goodsSpecId'] + ','
                    packageId += list[i]['goodsId'] + ','
                    channelId += list[i]['channelId'] + ','
                  }

                }else{
                  if (list[i]['isPackage'] == 0) {
                    goodsId += list[i]['goodsId'] + ','
                    channelId += list[i]['channelId'] + ','
                    goodsSpecId += list[i]['goodsSpecId'] + ','
                  }
                  if (list[i]['isPackage'] == 1) {
                    packageSpecId += list[i]['goodsSpecId'] + ','
                    packageId += list[i]['goodsId'] + ','
                    channelId += list[i]['channelId'] + ','
                  }
                }
                var str={}
                str.goodsId = goodsId
                str.channelId = channelId
                str.goodsSpecId = goodsSpecId
                str.packageSpecId = packageSpecId
                str.packageId = packageId
              }
              wx.request({
                url: LocalUrl + 'Getgoods/getattrgoods',
                method: "POST",
                data: str,
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                success: function (res) {
                  if (res.data.code == 1000){
                       var listt=res.data.list
                       var class_name = res.data.class_name
                       var totla_price = that.data.totla_price
                         var getdata=[]
                         for (var j in listt) {
                         for(var i in list){
                           if (list[i].goodsId == parseInt(listt[j].goods_id) && list[i].goodsSpecId == parseInt(listt[j].spec_id) && list[i].channelId == parseInt(listt[j].channel_id) || list[i].goodsId == parseInt(listt[j].package_id) && list[i].goodsSpecId == parseInt(listt[j].spec_id) && list[i].channelId == parseInt(listt[j].channel_id)){
                                listt[j].id = list[i].id
                                listt[j].specNum = list[i].specNum
                                totla_price += parseInt(list[i].specNum) * parseFloat(listt[j].spec_price)
                                getdata.push(listt[j])
                                 }
                            }
                         }
                         var formData = getdata
                        //  console.log(formData)
                         //分类名称
                         wx.setStorageSync('class_name', class_name)
                         //缓存购物车列表
                         wx.setStorageSync('getdatalist', getdata)
                       that.setData({
                         getdata: getdata,
                         class_name: class_name,
                         totla_price: totla_price,
                         formData: formData,
                         pageSize: that.data.pageSize+2,
                         JSESSIONID: JSESSIONID
                       })

                       wx.hideLoading()
                  }else{
                    wx.showToast({
                      title: res.data.message,
                      image: '../../images/icon_info.png',
                      duration: 2000
                    })
                  }
                }

                })
              // //頁面跳轉
              // wx.redirectTo({
              //   url: '../service_buy/service_buy'
              // })
            }else{
              wx.showToast({
                title: res.data.message,
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  //点击减少数量
  reduce:function(e){
    var that=this
    var JSESSIONID = that.data.JSESSIONID
    var r = /^\+?[1-9][0-9]*$/;　　//正整数
    wx.showLoading({
      title: '请稍后',
    })
    var javaApi = getApp().globalData.javaApi
    var id = e.target.dataset.id
    var index = e.target.dataset.index
    var totla_price = that.data.totla_price
    var getdata = that.data.getdata
    var formData = that.data.formData
    var content = {}
    var getcontent = {}
    if (formData[index].id == id) {
      if (parseFloat(formData[index].specNum) > 1){
        content.specNum = parseFloat(formData[index].specNum) - 1
        formData[index].specNum = parseFloat(formData[index].specNum) - 1
        getdata[index].specNum = parseFloat(getdata[index].specNum) - 1
        totla_price -= parseFloat(formData[index].spec_price)
        if (!r.test(totla_price)) {
          if (totla_price.toString().split(".")[1].length > 3) {
            totla_price = parseFloat(totla_price.toFixed(2))
          }
        }
        // console.log(totla_price)
        content.id = id
        getcontent.content = content
        wx.request({
          url: javaApi + 'api/goods/shopping/updateShopingNum',
          method: "POST",
          data: getcontent,
          header: {
            'content-type': 'application/json',
            "Cookie": JSESSIONID
          },
          success: function (res) {
            if (res.data.code == 1000) {
              that.setData({
                totla_price: totla_price,
                getdata: getdata,
                formData: formData
              })
              wx.hideLoading()
            } else {
              wx.showToast({
                title: res.data.message,
                image: '../../images/icon_info.png',
                duration: 2000
              })
            }
          }
        })
      }else{
        wx.showToast({
          title: '商品数量不能小于一',
          image: '../../images/icon_info.png',
          duration: 2000
        })
      }

    }

  },
  //点击数量添加
  add:function(e){
    var that=this
    var JSESSIONID = that.data.JSESSIONID
    var r = /^\+?[1-9][0-9]*$/;　　//正整数
    wx.showLoading({
      title: '请稍后',
    })
    var javaApi = getApp().globalData.javaApi
    var id = e.target.dataset.id
    var index = e.target.dataset.index
    var totla_price = that.data.totla_price
    var getdata = that.data.getdata
    var formData = that.data.formData
    var content={}
    var getcontent={}
    if (formData[index].id == id) {
      content.specNum = parseFloat(formData[index].specNum) + 1
        formData[index].specNum = parseFloat(formData[index].specNum) + 1
        getdata[index].specNum = parseFloat(getdata[index].specNum) + 1
        totla_price +=parseFloat(formData[index].spec_price)
        if (!r.test(totla_price)) {
          if (totla_price.toString().split(".")[1].length > 3) {
            totla_price = parseFloat(totla_price.toFixed(2))
          }
        }
        // console.log(totla_price)
        content.id = id
        getcontent.content = content
        wx.request({
          url: javaApi + 'api/goods/shopping/updateShopingNum',
          method: "POST",
          data: getcontent,
          header: {
            'content-type': 'application/json',
            "Cookie": JSESSIONID
          },
          success: function (res) {
            if (res.data.code == 1000) {
              that.setData({
                totla_price: totla_price,
                getdata: getdata,
                formData: formData
              })
              wx.hideLoading()
            } else {
              wx.showToast({
                title: res.data.message,
                image: '../../images/icon_info.png',
                duration: 2000
              })
            }
          }
        })
    }
  },
  EventHandle:function(e){
    var that = this
    var JSESSIONID = that.data.JSESSIONID
    var r = /^\+?[1-9][0-9]*$/;　　//正整数
    wx.showLoading({
      title: '请稍后',
    })
    var javaApi = getApp().globalData.javaApi
    var index=e.target.dataset.index
    var id=e.target.dataset.id
    var specNum=e.detail.value
    var totla_price = that.data.totla_price
    var getdata = that.data.getdata
    var formData = that.data.formData
    var content = {}
    var getcontent = {}
    if (formData[index].id == id) {
      if (specNum != '' && specNum > 0){
        totla_price -= parseFloat(formData[index].specNum) * parseFloat(formData[index].spec_price)
        formData[index].specNum = parseFloat(specNum)
        getdata[index].specNum = parseFloat(specNum)
        totla_price += parseFloat(formData[index].specNum) * parseFloat(formData[index].spec_price)
        if (!r.test(totla_price)){
        if (totla_price.toString().split(".")[1].length > 3) {
          totla_price = parseFloat(totla_price.toFixed(2))
        }
        }
        console.log(totla_price)
        content.id = id
        content.specNum = specNum
        getcontent.content = content
        wx.request({
          url: javaApi + 'api/goods/shopping/updateShopingNum',
          method: "POST",
          data: getcontent,
          // dataType: json,
          header: {
            // "Content-Type": "application/x-www-form-urlencoded",
            'content-type': 'application/json',
            "Cookie": JSESSIONID
          },
          success: function (res) {
            if (res.data.code == 1000) {
              that.setData({
                totla_price: totla_price,
                getdata: getdata,
                formData: formData
              })
              wx.hideLoading()
            } else {
              wx.showToast({
                title: res.data.message,
                image: '../../images/icon_info.png',
                duration: 2000
              })
            }
          }
        })
      }else{
        wx.showToast({
          title: '数量请大于0',
          image: '../../images/icon_info.png',
          duration: 2000
        })
      }
    }
    that.setData({
      totla_price: totla_price,
      getdata: getdata,
      formData: formData
    })
  },
  formSubmit:function(){
    var that=this
    var JSESSIONID = that.data.JSESSIONID
   var  formData =[]
   var dataa= that.data.formData
   var totla_price = that.data.totla_price
   for (var i in dataa){
     var datab = {}
      datab=dataa[i]
      formData.push(datab)
   }
   //结算购物车数据
   wx.setStorageSync('formData', formData)
   //总价格
   wx.setStorageSync('totla_price', totla_price)
   if (formData.length <= 0){
     wx.showToast({
       title: '你未选择结算商品',
       image: '../../images/icon_info.png',
       duration: 2000
     })
   }else{
     wx.navigateTo({
       url: '../service_money/service_money'
     })
   }
  },
  check:function(e){
    wx.showLoading({
      title: '请稍后',
    })
    var that=this
    var id = e.target.dataset.id
    var index = e.target.dataset.index
    var totla_price = that.data.totla_price
    var getdata = that.data.getdata
    var formData = that.data.formData
    var isCon=''
    for (var i in formData){
      if (formData[index] ||formData[i].id == id) {
        isCon = true
      } else {
        isCon = false
      }
      continue;
    }
      if (isCon == true){
        totla_price -= parseFloat(formData[index].specNum) * parseFloat(formData[index].spec_price)
        delete formData[index]
        
    }else{
          if (getdata[index].id == id){
            formData[index]=getdata[index]
                totla_price += parseFloat(getdata[index].specNum) * parseFloat(getdata[index].spec_price)
      }
    }
    that.setData({
      formData: formData,
      totla_price: totla_price
    })
    wx.hideLoading()
  },
  del:function(e){
    var that = this
    var r = /^\+?[1-9][0-9]*$/;　　//正整数
    var JSESSIONID = that.data.JSESSIONID
    wx.showLoading({
      title: '请稍后',
    })
    var javaApi = getApp().globalData.javaApi
    var id = e.target.dataset.id
    var index = e.target.dataset.index
    var totla_price = that.data.totla_price
    var getdata = that.data.getdata
    var formData = that.data.formData
    if (formData[index].id == id){
        totla_price -= parseFloat(formData[index].specNum) * parseFloat(formData[index].spec_price)
        if (!r.test(totla_price)) {
          if (totla_price.toString().split(".")[1].length > 3) {
            totla_price = parseFloat(totla_price.toFixed(2))
          }
        }
        // console.log(totla_price)
        delete formData[index]
        delete getdata[index]
      }
    var ForData={}
    ForData.content = { 'shoppingCartIds':[id]}
    wx.request({
      url: javaApi + 'api/goods/shopping/remove',
      method: "POST",
      data: ForData,
      header: {
        'content-type': 'application/json',
        "Cookie": JSESSIONID
      },
      success: function (res) {
           if (res.data.code == 1000){
             that.setData({
               formData: formData,
               getdata: getdata,
               totla_price: totla_price
             })
             wx.hideLoading()
           }
      }
      })
  }
  
})  