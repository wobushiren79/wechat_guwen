Page({
  data: {
    show: false,
    list_show: true,
    xuyao: '不需要发票',
    levelId:false,
    levelType:'',
    levelName:'',
    orderType:1

  },
  bind_list: function () {
    var that = this;
    that.setData({
      list_show: (!that.data.list_show)
    })
  },
  onLoad: function () {
    var that = this
    //取出JSESSIONID
    wx.getStorage({
      key: 'JSESSIONID',
      success: function (res) {
        that.setData({
          JSESSIONID: res.data
        })
      },
    })


    //是否职业顾问
    wx.getStorage({
      key: 'amateurLevel',
      success: function (res) {
        if (res.data == null) {
          that.setData({
            levelId: 0,
            orderType:2
          })
        } else {
          that.setData({
            levelId: res.data[0].systemLevel.id,
            orderType:2,
            levelName : res.data[0].systemLevel.levelName,
            levelType : res.data[0].systemLevel.levelType
            
          })
        }
      },
      fail: function () {
        that.setData({
          levelId: false,
          orderType: 1
        })
      }
    })
    //取出渠道
    wx.getStorage({
      key: 'channel',
      success: function (r) {
        var channel_id = r.data.id
        that.setData({
          channel_id: r.data.id,
        })
      }
    })
    // 取出购物车数据
    wx.getStorage({
      key: 'formData',
      success: function (res) {
        var formData = res.data
        // console.log(res.data)
        //缓存结算列表
        wx.setStorageSync('getdatalist', formData)
        // wx.getStorageSync(key)
        var goodsnumber = formData.length
        //顾问总金额
        var dviser_Price = 0
        for (var i in formData) {
          dviser_Price += formData[i].adviser_price * formData[i].specNum
          
        }
        that.setData({
          formData: formData,
          goodsnumber: goodsnumber,
          dviser_Price: dviser_Price
        })
        //取出分类
        wx.getStorage({
          key: 'class_name',
          success: function (ress) {
            that.setData({
              class_name: ress.data
            })
          }
        })
        //取出总价格
        wx.getStorage({
          key: 'totla_price',
          success: function (r) {
            that.setData({
              totla_price: r.data
            })
          }
        })
      }
    })
  },
  onShow: function () {
    var that = this
    //取出客户信息
    wx.getStorage({
      key: 'kehu',
      success: function (r) {
        that.setData({
          kehu: r.data,
          show: true
        })
      },
      fail:function(){
        kehu:false
      }
    })
    //取出发票信息
    wx.getStorage({
      key: 'fapiao',
      success: function (r) {
        if (r.data.needInvoice == 0) {
          that.setData({
            fapiao: r.data,
            xuyao: '不需要发票'
          })
        } else {
          that.setData({
            fapiao: r.data,
            xuyao: '需要发票'
          })
        }
      }
    })
  },
  bindFormSubmit: function (e) {
    wx.showLoading({
      title: '请稍后',
      // mask: true,
    })
    var that = this
    var r = /^\+?[1-9][0-9]*$/;　　//正整数
    var JSESSIONID = that.data.JSESSIONID
    var orderdata = {}
    var getdata = {}
    var goodsOrder = {}
    var goodsOrderItems = []
    var goodsPackages=[]
    var goodsInvoice = {}
    var goodsServiceInfo = {}
    //渠道
    // var channel_id=that.data.channel_id
    var channel_id = 2
    //购物车数据
    var formData = that.data.formData
    //分类数据
    var class_name = that.data.class_name
    //总单价
    var totla_price = that.data.totla_price
    var levelId = that.data.levelId
    //客户信息
    var kehu = that.data.kehu
    if (kehu) {
      //发票信息
      var fapiao = that.data.fapiao
      //渠道ID
      goodsOrder.orderChannel = channel_id
      //关联人id
      goodsOrder.connectId = ''
      //下单备注
      goodsOrder.orderComment = e.detail.value.orderComment
      goodsOrder.customerName = kehu.contact
      goodsOrder.customerPhone = kehu.contactPhone
      // goodsOrder.test = 1111111111111111111
      //是否职业顾问
      // wx.getStorage({
      //   key: 'amateurLevel',
      //   success: function(res) {
      //     goodsOrder.orderType=2
      //     if (res.data == null){
      //     }else{
      //        goodsOrder.levelName = res.data[0].systemLevel.levelName
      //       goodsOrder.levelType = res.data[0].systemLevel.levelType
      //       goodsOrder.levelId = res.data[0].systemLevel.id
      //     }
      //   },
      //   fail:function(){
      //     goodsOrder.orderType = 1
      //   }
      // })
      goodsOrder.levelName = that.data.levelName
      goodsOrder.levelType = that.data.levelType
      goodsOrder.levelId = that.data.levelId
      goodsOrder.orderType = that.data.orderType
      //是否需要发票
      if (fapiao) {
        goodsOrder.needInvoice = fapiao.needInvoice
      } else {
        goodsOrder.needInvoice = 0
      }

      //订单总金额
      var num4 = r.test(parseFloat(totla_price))
      if (num4) {
        goodsOrder.showTotalPrice = parseFloat(totla_price) * 100
      } else {
        var start = totla_price.toString().indexOf('.');
        var b = totla_price.toString().substring(start + 1)
        if (b.length > 1) {
          goodsOrder.showTotalPrice = parseFloat(totla_price.toString().replace('.', '')) 
        } else {
          goodsOrder.showTotalPrice = parseFloat(totla_price.toString().replace('.', '') + '0')
        }
      }
      //顾问总金额
      var totalPrice = that.data.dviser_Price
      goodsOrder.totalPrice = totalPrice*100
      getdata.goodsOrder = goodsOrder
      // console.log(formData)
      //商品ID
      for (var i in formData) {
        if (formData[i].is_package == 1){
          var packagelist = {}
          var goodsOrderItemss=[]
          for (var j in formData[i].goods){
            var goodsList = {}
            goodsList.goodsId = formData[i].goods[j].goods_id
            goodsList.goodsSpecId = formData[i].goods[j].goods_spec_id
            goodsList.classifyAttrId = formData[i].goods[j].class_attr_id
            goodsList.classifyId = formData[i].goods[j].goods_class_id
            goodsList.specOrderedNum = formData[i].goods[j].goods_spec_number
            goodsList.specOrderedVolume = formData[i].goods[j].spec_name
            goodsList.specAlias = formData[i].goods[j].spec_alias
            goodsList.currentDiscount = 1
            goodsList.specOrderedAttr = formData[i].goods[j].name
            goodsList.specNumber = formData[i].goods[j].goods_number
            goodsList.titleImg = formData[i].goods[j].title_img
            goodsList.unit = formData[i].goods[j].unit
            goodsList.specName = formData[i].goods[j].spec_name
            goodsOrderItemss.push(goodsList)
          }
          packagelist.goodsOrderItems = goodsOrderItemss
          packagelist.packageId = parseInt(formData[i].package_id)
          packagelist.packageSpecId = parseInt(formData[i].spec_id)
          if (levelId != false) {
            if (levelId == 0){
              packagelist.commissionRatio = 0
            }else{
              if (formData[i].commission ==null){
              packagelist.commissionRatio = 0
            }else{
            for (var p in formData[i].commission) {
              if (formData[i].commission[p].amateur_id == levelId) {
                packagelist.commissionRatio = formData[i].commission[p].commission
              }
            }
            }
          }
          } else {
            packagelist.commissionRatio = false
          }
          var num2 = r.test(parseFloat(formData[i].spec_price))
          if (num2) {
            packagelist.specOrderedPrice = parseFloat(formData[i].spec_price) * 100
          } else {
            var start = formData[i].spec_price.indexOf('.');
            var b = formData[i].spec_price.substring(start + 1)
            if (b.length > 1) {
              packagelist.specOrderedPrice = parseFloat(formData[i].spec_price.replace('.', ''))
            } else {
              packagelist.specOrderedPrice = parseFloat(formData[i].spec_price.replace('.', '') + '0')
            }
          }
          packagelist.specOrderedNum = parseInt(formData[i].specNum)
          packagelist.specOrderedVolume = formData[i].package_name
          packagelist.specAlias = formData[i].spec_alias
          packagelist.currentDiscount = 1
          packagelist.specOrderedAttr = formData[i].class_name
          packagelist.titleImg = formData[i].title_img
          packagelist.unit = formData[i].unit
          packagelist.specName = formData[i].spec_name
          //  goodslist.ementPrice = parseFloat(formData[i].ement_price)
          var num1 = r.test(parseFloat(formData[i].ement_price))
          if (num1) {
            packagelist.ement_price = parseFloat(formData[i].ement_price) * 100
          } else {
            var start = formData[i].ement_price.indexOf('.');
            var b = formData[i].ement_price.substring(start + 1)
            if (b.length > 1) {
              packagelist.ement_price = parseFloat(formData[i].ement_price.replace('.', ''))
            } else {
              packagelist.ement_price = parseFloat(formData[i].ement_price.replace('.', '') + '0')
            }
          }
          // goodslist.adviserPrice = parseFloat(formData[i].adviser_price)
          var num = r.test(parseFloat(formData[i].adviser_price))
          if (num) {
            packagelist.adviserPrice = parseFloat(formData[i].adviser_price) * 100
          } else {
            var start = formData[i].adviser_price.indexOf('.');
            var b = formData[i].adviser_price.substring(start + 1)
            var d = b.length
            if (b.length > 1) {
              packagelist.adviserPrice = parseFloat(formData[i].adviser_price.replace('.', ''))
            } else {
              packagelist.adviserPrice = parseFloat(formData[i].adviser_price.replace('.', '') + '0')
            }
          }
          packagelist.specNumber = formData[i].package_number
          packagelist.classifyId = parseInt(formData[i].package_class_id)
          packagelist.classifyAttrId = parseInt(formData[i].class_attr_id)
          goodsPackages.push(packagelist)
        }else{
        var goodslist = {}
        
        if (levelId != false) {
          if (levelId == 0) {
            goodslist.commissionRatio = 0
          } else {
            if (formData[i].commission==null) {
              goodslist.commissionRatio = 0
            } else {
          for (var o in formData[i].commission) {
            if (formData[i].commission[o].amateur_id == levelId) {
              goodslist.commissionRatio = formData[i].commission[o].commission
            }
          }
            }
          }
        } else {
          goodslist.commissionRatio = false
        }


        goodslist.goodsId = parseInt(formData[i].goods_id)
        goodslist.goodsSpecId = parseInt(formData[i].spec_id)
        var num2 = r.test(parseFloat(formData[i].spec_price))
        if (num2) {
          goodslist.specOrderedPrice = parseFloat(formData[i].spec_price) * 100
        } else {
          var start = formData[i].spec_price.indexOf('.');
          var b = formData[i].spec_price.substring(start + 1)
          if (b.length > 1) {
            goodslist.specOrderedPrice = parseFloat(formData[i].spec_price.replace('.', ''))
          } else {
            goodslist.specOrderedPrice = parseFloat(formData[i].spec_price.replace('.', '') + '0')
          }
        }
        goodslist.specOrderedNum = parseInt(formData[i].specNum)
        goodslist.specOrderedVolume = formData[i].goods_name
        goodslist.specAlias = formData[i].spec_alias
        goodslist.currentDiscount = 1
        goodslist.specOrderedAttr = formData[i].class_name
        goodslist.titleImg = formData[i].title_img
        goodslist.unit = formData[i].unit
        goodslist.specName = formData[i].spec_name
      //  goodslist.ementPrice = parseFloat(formData[i].ement_price)
        var num1 = r.test(parseFloat(formData[i].ement_price))
        if (num1) {
          goodslist.ement_price = parseFloat(formData[i].ement_price) * 100
        } else {
          var start = formData[i].ement_price.indexOf('.');
          var b = formData[i].ement_price.substring(start + 1)
          if (b.length > 1) {
            goodslist.ement_price = parseFloat(formData[i].ement_price.replace('.', ''))
          } else {
            goodslist.ement_price = parseFloat(formData[i].ement_price.replace('.', '') + '0')
          }
        }
       // goodslist.adviserPrice = parseFloat(formData[i].adviser_price)
        var num = r.test(parseFloat(formData[i].adviser_price))
        if (num){
          goodslist.adviserPrice = parseFloat(formData[i].adviser_price)*100
        }else{
          var start=formData[i].adviser_price.indexOf('.');
          var b =formData[i].adviser_price.substring(start+1)
          var d = b.length
          if (b.length > 1){
            goodslist.adviserPrice = parseFloat(formData[i].adviser_price.replace('.', ''))
          }else{
            goodslist.adviserPrice = parseFloat(formData[i].adviser_price.replace('.', '')+'0')
          }
        }
        goodslist.specNumber = formData[i].goods_number
        goodslist.classifyId = parseInt(formData[i].goods_class_id)
        goodslist.classifyAttrId = parseInt(formData[i].class_attr_id)
        goodsOrderItems.push(goodslist)
        // console.log(goodslist)
      }
      }
      getdata.goodsOrderItems = goodsOrderItems
      getdata.goodsPackages = goodsPackages
      //发票信息组装
      if (fapiao) {
        goodsInvoice.titleType = fapiao.titleType
        goodsInvoice.title = fapiao.title
        goodsInvoice.companyTaxId = fapiao.companyTaxId
        goodsInvoice.invoiceRemark = fapiao.invoiceRemark
        goodsInvoice.receiptName = fapiao.receiptName
        goodsInvoice.receiptPhone = fapiao.receiptPhone
        goodsInvoice.receiptLocation = fapiao.receiptLocation
      }
      getdata.goodsInvoice = goodsInvoice
      if (kehu) {
        goodsServiceInfo.serviceWay = kehu.serviceWay
        goodsServiceInfo.selfDelivery = kehu.selfDelivery
        goodsServiceInfo.selfDeliveryTime = kehu.selfDeliveryTime
        goodsServiceInfo.bookTime = kehu.bookTime
        goodsServiceInfo.contact = kehu.contact
        goodsServiceInfo.contactPhone = kehu.contactPhone
        goodsServiceInfo.serviceLocation = kehu.serviceLocation

      }
      getdata.goodsServiceInfo = goodsServiceInfo
      orderdata = { content: getdata }
      var OrderData = JSON.stringify(orderdata)
      // console.log(orderdata)
      var javaApi = getApp().globalData.javaApi
      // console.log(OrderData)
      wx.request({
        url: javaApi + 'api/goods/order/save',
        method: "POST",
        data: OrderData,
        header: {
          // "Content-Type": "application/x-www-form-urlencodeed",
          'content-type': 'application/json',
          "Cookie": JSESSIONID
        },
        success: function (res) {
          if (res.data.code == 1000) {
            wx.reLaunch({
              url: '../service_goods_order/service_goods_order?orderId=' + res.data.content.orderId
            })
          } else {
            wx.showToast({
              title: res.data.message,
              image: '../../images/icon_info.png',
              // mask: true,
              duration: 2000
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '未填服务信息',
        image: '../../images/icon_info.png',
        // mask: true,
        duration: 2000
      })
    }
    // console.log(orderdata)
  },
  price: function () {
    var price = this.data.price
    this.setData({
      price: !price
    })
  },
  // prices:function(){
  //   this.setData({
  //     price:false
  //   })
  // }

});
