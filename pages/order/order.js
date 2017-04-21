Page({
  data: {
    num: "5",
    money: "98520",
    nameTitle_a: "套餐名称",
    consultId: 0,
    MainData: ['套餐一', '套餐二'],
    businessType_a: 0,
    TotalPrice: 0,
    Funeralss: {},
    orderId: 0,


    nameTitle_b: [{
      "name": "标准用品",
      "id": "id",
      "categoryId": "分类id",
      "count": "数量",
      "productItemsId": "id",
      "productItemsName": "名字",
      "price": "价格",
      "specification": "尺寸",
      "unit": "单位"
    }],
    MainData_b: [],
    FuneralData: ['套餐一', '套餐二'],
    Funeral: '',
    businessType_c: 0,
    nameTitle_c: "套餐名称",

    FuneralData_a_a: ['寿衣1', '寿衣2'],
    businessType_d: 0,
    nameTitle_d: "寿衣全套",


    FuneralData_a_b: ['寿衣1', '寿衣2'],
    businessType_c_c: 0,
    DataName_a: '',



    CategoryName: ['花圈', '告别仪式'],
    businessType_e: 0,
    nameTitle_e: "增值服务名称",
    category: '',
    Mains: '',
    MainData_b: '',
    DataCategory: ''

  },
  bindPickerChange_a: function (e) {
    var Mains = this.data.Mains
    var TotalPrice = 0
    var id = e.detail.value
    var MainData_b = []
    for (var i in Mains) {
      MainData_b = Mains[id].ctgItems;
      break;
    }
    var MainData_c = []
    for (var i in MainData_b) {
      for (var j in MainData_b[i].productItems) {
        MainData_c[i] = MainData_b[i]
        MainData_c[i].count = MainData_b[i].productItems[j].count
        MainData_c[i].productItemsId = MainData_b[i].productItems[j].id
        MainData_c[i].productItemsName = MainData_b[i].productItems[j].name
        MainData_c[i].price = MainData_b[i].productItems[j].price
        MainData_c[i].specification = MainData_b[i].productItems[j].specification
        MainData_c[i].unit = MainData_b[i].productItems[j].unit
        MainData_c[i].categoryId = MainData_b[i].productItems[j].categoryId
      }
    }
    var Total_Price = []
    for (var i in MainData_c) {
      Total_Price.push(MainData_c[i].price)
    }
    //console.log(Total_Price)
    for (var i in Total_Price) {
      TotalPrice += Total_Price[i]
    }
    //console.log(TotalPrice)
    this.setData({
      businessType_a: e.detail.value,
      nameTitle_b: MainData_c,
      TotalPrice: TotalPrice
    })
  },
  bindPickerChange_c: function (e) {
    var Funeral = this.data.Funeral
    var id = e.detail.value
    // console.log(id)
    var FuneralData_a = []
    for (var i in Funeral) {
      FuneralData_a = Funeral[id].ctgItems;
      break;
    }
    var FuneralData_a_a = []
    for (var i in FuneralData_a) {
      var cur = FuneralData_a[i]
      FuneralData_a_a.push(cur);
    }
    //console.log(FuneralData_a_a)
    //重新组装对象以满足页面输出格式
    var FuneralData_a_b_c = []
    for (var i in FuneralData_a_a) {
      FuneralData_a_b_c[i] = FuneralData_a_a[i]

      for (var j in FuneralData_a_a[i].productItems) {
        FuneralData_a_b_c[i].productItems[j] = FuneralData_a_a[i].productItems[j].name
      }
    }
   console.log(FuneralData_a_b_c)
    this.setData({
      businessType_c: e.detail.value,
      FuneralData_a_b_c: FuneralData_a_b_c
    })
  },

  bindPickerChange_c_c: function (e) {
    var n = e.detail.value
    var TotalPrice = parseFloat(this.data.TotalPrice)
    var name = e.target.dataset.name
    var Funeralss = this.data.Funeralss
    //console.log(Funeralss)
    var FuneralData_a_b_c = this.data.FuneralData_a_b_c
    var DataName_b = []
    var dataname = this.data.DataName_a
    if (dataname) {
      DataName_b = dataname
    }
    for (var i in name) {
      var DataName = name[n]
    }
    var Tmp = []
    if (DataName) {
      for (var i in Funeralss) {
        for (var j in Funeralss[i].ctgItems) {
          for (var k in Funeralss[i].ctgItems[j].productItems) {
            if (Funeralss[i].ctgItems[j].productItems[k].name == DataName) {
              Tmp = Funeralss[i].ctgItems[j].productItems[k];
              break;
            }
          }
        }
      }
    }
    if (Tmp != null) {
      DataName_b.push(Tmp)
    }
    //console.log(DataName_b)
    var Total_Price = []
    for (var i in DataName_b) {
      if (DataName_b[i].number) {
        Total_Price.push = DataName_b[i].price * DataName_b[i].number
      } else {
        Total_Price.push = DataName_b[i].price * DataName_b[i].count
      }
    }
    for (var i in Total_Price) {
      TotalPrice += Total_Price[i]
    }
    // console.log(tmp)
    // console.log(Tmp)
    // console.log(DataName)

    // console.log(DataName_b)
    this.setData({
      //businessType_c_c: e.detail.value,
      DataName_a: DataName_b,
      TotalPrice: TotalPrice
    })
  },
  DataName_aDel: function (e) {
    var that = this
    var TotalPrice = parseFloat(that.data.TotalPrice)
    var DataName_a = that.data.DataName_a
    var id = e.target.dataset.id
    var DataName_A = []
    var Total_Price = ''
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function (res) {
        if (res.confirm) {
          for (var i in DataName_a) {
            if (id != DataName_a[i].id) {
              DataName_A.push(DataName_a[i])
            } else if (id == DataName_a[i].id) {
              if (DataName_a[i].number) {
                Total_Price = DataName_a[i].price * DataName_a[i].number
              } else {
                Total_Price = DataName_a[i].price * DataName_a[i].count
              }

            }
          }
          TotalPrice = TotalPrice - Total_Price
          that.setData({
            DataName_a: DataName_A,
            TotalPrice: TotalPrice
          })
        } else if (res.cancel) {
          that.setData({
            DataName_a: DataName_a
          })
        }
      }
    })
  },
  bindPickerChange_e: function (e) {
    var that = this;
    var TotalPrice = parseFloat(that.data.TotalPrice)
    var Total_Price = ''
    //接口地址前缀
    var RouteUrl = getApp().globalData.RouteUrl;
    var category = this.data.category;
    var cat = e.detail.value;
    var DataCategory_b = [];
    //console.log(DataCategory_b)
    if (that.data.DataCategory) {
      // console.log(DataCategory_a)
      DataCategory_b = that.data.DataCategory
    }
    // console.log(DataCategory_b)
    var CatId = [];
    for (var i in category.ctgItems) {
      CatId = category.ctgItems[cat].id;
    };
    // var CatIds=[]
    // CatIds.push(CatId)
    if (CatId) {
      // 取出緩存登錄信息
      //console.log(CatId)
      var forData = { content: { ctgId: CatId } };
      //转换字符串
      var ForData = JSON.stringify(forData);
      //console.log(ForData)
      wx.getStorage({
        key: 'logindata',
        success: function (msg) {
          //请求增值服务项目详情
          wx.request({
            url: RouteUrl + 'sku/product/get',
            method: "POST",
            data: ForData,
            header: {
              "Content-Type": "application/x-www-form-urlencodeed",
              "Cookie": "sid=" + msg.data.content.sessionId
            },
            success: function (res) {
              if (res.data.code == 1000 && res.data.message == '操作成功') {
                var category = res.data.content.productItems;
                // console.log(category)
                var categorydata = [];
                if (category) {
                  for (var i in category) {
                    if (category[i].count == 0) {
                      category[i].count = 1
                      category[i].categoryId = CatId
                      DataCategory_b.push(category[i])
                    } else {
                      DataCategory_b.push(category[i])
                    }
                  };
                  for (var i in DataCategory_b) {
                    Total_Price = DataCategory_b[i].price
                  }
                  TotalPrice += Total_Price
                  //console.log(DataCategory_b)
                  that.setData({
                    //businessType_e: e.detail.value,
                    DataCategory: DataCategory_b,
                    TotalPrice: TotalPrice
                  });
                };
              } else {
                wx.showToast({
                  title: res.data.message,
                  duration: 3000
                })
              };
            }
          });
        }
      });
    };
  },
  Botton: function (e) {
    var id = e.target.dataset.id
    var Cdata = this.data.DataCategory
    var TotalPrice = parseFloat(this.data.TotalPrice)
    var Total_Price = ''
    //console.log(Cdata)
    // var DataCategory=[]
    var jian = ''
    for (var i in Cdata) {
      if (Cdata[i].id == id) {
        if (Cdata[i].number) {
          jian = Cdata[i].number
          if (Cdata[i].number != 0 && Cdata[i].number != 1) {
            Cdata[i].number = Cdata[i].number - 1
            Cdata[i].price = Cdata[i].price
            Cdata[i].specification = Cdata[i].specification
            Cdata[i].unit = Cdata[i].unit
            Cdata[i].id = Cdata[i].id
            Cdata[i].name = Cdata[i].name
            Cdata[i].categoryId = Cdata[i].categoryId
            // jian=Cdata[i].number
          } else {
            Cdata[i].number = Cdata[i].number
            Cdata[i].price = Cdata[i].price
            Cdata[i].specification = Cdata[i].specification
            Cdata[i].unit = Cdata[i].unit
            Cdata[i].id = Cdata[i].id
            Cdata[i].name = Cdata[i].name
            Cdata[i].categoryId = Cdata[i].categoryId
            // jian=Cdata[i].number
          }
        } else {
          jian = Cdata[i].count
          if (Cdata[i].count != 0 && Cdata[i].count != 1) {
            Cdata[i].count = Cdata[i].count - 1
            Cdata[i].price = Cdata[i].price
            Cdata[i].specification = Cdata[i].specification
            Cdata[i].unit = Cdata[i].unit
            Cdata[i].id = Cdata[i].id
            Cdata[i].name = Cdata[i].name
            Cdata[i].categoryId = Cdata[i].categoryId
          } else {
            Cdata[i].count = Cdata[i].count
            Cdata[i].price = Cdata[i].price
            Cdata[i].specification = Cdata[i].specification
            Cdata[i].unit = Cdata[i].unit
            Cdata[i].id = Cdata[i].id
            Cdata[i].name = Cdata[i].name
            Cdata[i].categoryId = Cdata[i].categoryId
          }
        }
      }
    }
    for (var i in Cdata) {
      if (Cdata[i].id == id) {
        Total_Price = Cdata[i].price
      }
    }

    // console.log(jian)
    if (jian != 1) {
      TotalPrice -= Total_Price
    }
    this.setData({
      DataCategory: Cdata,
      TotalPrice: TotalPrice
    })
  },
  Top: function (e) {
    var id = e.target.dataset.id
    var Cdata = this.data.DataCategory
    var TotalPrice = parseFloat(this.data.TotalPrice)
    var Total_Price = ''
    // var DataCategory=[]
    for (var i in Cdata) {
      if (Cdata[i].id == id) {
        if (Cdata[i].number) {
          Cdata[i].number = Cdata[i].number + 1
          Cdata[i].price = Cdata[i].price
          Cdata[i].specification = Cdata[i].specification
          Cdata[i].unit = Cdata[i].unit
          Cdata[i].id = Cdata[i].id
          Cdata[i].name = Cdata[i].name
          Cdata[i].categoryId = Cdata[i].categoryId
        } else {
          Cdata[i].count = Cdata[i].count + 1
          Cdata[i].price = Cdata[i].price
          Cdata[i].specification = Cdata[i].specification
          Cdata[i].unit = Cdata[i].unit
          Cdata[i].id = Cdata[i].id
          Cdata[i].name = Cdata[i].name
          Cdata[i].categoryId = Cdata[i].categoryId

        }

      }
    }
    for (var i in Cdata) {
      if (Cdata[i].id == id) {
        Total_Price = Cdata[i].price
      }
    }
    TotalPrice += Total_Price
    this.setData({
      DataCategory: Cdata,
      TotalPrice: TotalPrice
    })
  },
  del: function (e) {
    var that = this
    var id = e.target.dataset.k
    var TotalPrice = parseFloat(this.data.TotalPrice)
    var Total_Price = ''
    var Cdata = that.data.DataCategory
    var cdata = []
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function (res) {
        if (res.confirm) {
          for (var i in Cdata) {
            if (id != Cdata[i].id) {
              cdata.push(Cdata[i])
            }
          }
          for (var i in Cdata) {
            if (id == Cdata[i].id) {
              if (Cdata[i].number) {
                Total_Price = Cdata[i].price * Cdata[i].number
              } else {
                Total_Price = Cdata[i].price * Cdata[i].count
              }
            }
          }
          // console.log(Total_Price)
          TotalPrice -= Total_Price
          that.setData({
            DataCategory: cdata,
            TotalPrice: TotalPrice
          })
        } else if (res.cancel) {
          that.setData({
            DataCategory: Cdata
          })
        }
      }
    })
  },
  onLoad: function (options) {

    var that = this
    //获取前页面传递的consultId
    var consultId = Number(options.consultId)
    //获取前页面传递的orderId
    var orderId = Number(options.orderId)
    if (orderId) {
      that.setData({
        orderId: orderId
      })
    }
    //console.log(consultId)
    //获取全局变量   接口通用前缀
    var RouteUrl = getApp().globalData.RouteUrl
    //总价格
    var TotalPrice = parseFloat(that.data.TotalPrice)
    var Total_Price = []
    var ztcId = 0
    var ByIdData = []
    var ZzIdData = []
    // 取出緩存登錄信息
    wx.getStorage({
      key: 'logindata',
      success: function (msg) {
        var ContentData = {}
        ContentData.orderId = orderId
        // ContentData.consultId=consultId
        var forData = { content: ContentData }
        //转换字符串
        var ForData = JSON.stringify(forData)
        //初始化二次修改
        if (orderId) {
          wx.request({
            url: RouteUrl + 'order/view',
            method: "POST",
            data: ForData,
            header: {
              "Content-Type": "application/x-www-form-urlencodeed",
              "Cookie": "sid=" + msg.data.content.sessionId
            },
            success: function (res) {
              console.log(RouteUrl + 'order/view')
              // console.log(res)
              // console.log(ForData)
              // console.log(orderId)
              if (res.data.code == 1000 && res.data.message == '操作成功') {
                // console.log(res.data.content.projectItems)
                var onLoadData = res.data.content.projectItems
                for (var i in onLoadData) {
                  if (onLoadData[i].name == '主套餐') {
                    var ZtcId = onLoadData[i].ctgItems
                  }
                  if (onLoadData[i].name == "增值项目") {
                    var ZzId = onLoadData[i].ctgItems
                  }
                  // console.log()
                  if (onLoadData[i].name == "殡仪馆") {
                    var ById = onLoadData[i].ctgItems
                  }
                  // console.log(ById)
                }
                if (ZtcId) {
                  for (var i in ZtcId) {
                    if (ZtcId[i].name == "方案定价") {
                      for (var j in ZtcId[i].productItems) {
                        ztcId = ZtcId[i].productItems[j].name
                      }
                    }
                  }
                }
                if (ById) {
                  for (var i in ById) {
                    for (var j in ById[i].productItems) {
                      ByIdData.push(ById[i].productItems[j])
                    }
                  }
                  console.log(ById)
                  var ByIds=[]
                  for(var i in ById){

                  }
                  //取出所以显示在页面的价格
                  for (var i in ByIdData) {
                    Total_Price.push(ByIdData[i].totalPrice)
                  }
                  that.setData({
                    DataName_a: ByIdData,
                   // FuneralData_a_b_c:ById
                    //orderId:orderId
                  })
                }
                if (ZzId) {
                  for (var i in ZzId) {
                    for (var j in ZzId[i].productItems) {
                      ZzIdData.push(ZzId[i].productItems[j])
                    }
                  }
                  //console.log(ZzIdData)
                  //取出所以显示在页面的价格
                  for (var i in ZzIdData) {
                    Total_Price.push(ZzIdData[i].totalPrice)
                  }
                  // TotalPrice+=Total_Price
                  that.setData({
                    DataCategory: ZzIdData
                  })
                }


              } else {
                wx.showToast({
                  title: res.data.message,
                  duration: 3000
                })
              }
            }
          })
        }

        //  请求主套餐数据
        wx.request({
          url: RouteUrl + 'setmeal/main/get',
          method: "POST",
          data: "{\"content\":{}}",
          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            "Cookie": "sid=" + msg.data.content.sessionId
          },
          success: function (res) {
            // console.log(res.data)
            if (res.data.code == 1000 && res.data.message == '操作成功') {
              var Mains = res.data.content.mains;
              // console.log(mains)
              //取出主套餐列表
              var MainsData = [];
              for (var i in Mains) {
                var cur = Mains[i]
                var obj = { name: cur.name, id: cur.id }
                MainsData.push(cur.name);
              }
              //var Mains = this.data.Mains
              //初始化主套餐0
              // console.log(Mains)
              var MainData_b = []
              var MainData_B = ''
              // if(ztcId != null){
              for (var i in Mains) {
                for (var j in Mains[i].ctgItems) {
                  for (var k in Mains[i].ctgItems[j].productItems) {
                    if (Mains[i].ctgItems[j].productItems[k].name == ztcId) {
                      MainData_B = i
                    }
                  }

                }
              }
              // }
              if (MainData_B) {
                MainData_B = MainData_B
                that.setData({
                  businessType_a: MainData_B
                })
              } else {
                MainData_B = 0
                that.setData({
                  businessType_a: MainData_B
                })
              }
              //var id = 0
              for (var i in Mains) {
                MainData_b = Mains[MainData_B].ctgItems;
                break;
              }
              //取出主套餐详情
              var MainData_c = []
              for (var i in MainData_b) {
                for (var j in MainData_b[i].productItems) {
                  MainData_c[i] = MainData_b[i]
                  MainData_c[i].count = MainData_b[i].productItems[j].count
                  MainData_c[i].productItemsId = MainData_b[i].productItems[j].id
                  MainData_c[i].productItemsName = MainData_b[i].productItems[j].name
                  MainData_c[i].price = MainData_b[i].productItems[j].price
                  MainData_c[i].specification = MainData_b[i].productItems[j].specification
                  MainData_c[i].unit = MainData_b[i].productItems[j].unit
                  MainData_c[i].categoryId = MainData_b[i].productItems[j].categoryId
                }
              }
              //取出所以显示在页面的价格
              for (var i in MainData_c) {
                Total_Price.push(MainData_c[i].price)
              }
              for (var i in Total_Price) {
                TotalPrice += parseFloat(Total_Price[i]);
              }
              //console.log(Total_Price)
              that.setData({
                MainData: MainsData,
                Mains: Mains,
                nameTitle_b: MainData_c,
                TotalPrice: TotalPrice,
                consultId: consultId,
                MainData_b: MainData_b
              })
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 3000
              })
            }
          }
        })
        //请求殡仪配套数据
        wx.request({
          url: RouteUrl + 'setmeal/funeral/get',
          method: "POST",
          data: "{\"content\":{}}",
          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            "Cookie": "sid=" + msg.data.content.sessionId
          },
          success: function (res) {
            // console.log(res.data)
            if (res.data.code == 1000 && res.data.message == '操作成功') {
              var Funeral = res.data.content.funerals
              var Funeralss = res.data.content.funerals
              //console.log(Funeral)
              //取出主套餐列表
              var FuneralData = [];
              for (var i in Funeral) {
                var cur = Funeral[i]
                var obj = { name: cur.name, id: cur.id }
                FuneralData.push(cur.name);
              }
              that.setData({
                FuneralData: FuneralData,
                Funeral: Funeral,
                Funeralss: Funeralss
              })
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 3000
              })
            }
          }
        })
        //请求增值服务项目列表
        wx.request({
          url: RouteUrl + 'sku/category/get',
          method: "POST",
          data: "{\"content\":{\"projectId\":4}}",
          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            "Cookie": "sid=" + msg.data.content.sessionId
          },
          success: function (res) {
            if (res.data.code == 1000 && res.data.message == '操作成功') {
              // console.log(res.data.content)
              var category = res.data.content
              if (category) {
                var CategoryName = []
                for (var i in category.ctgItems) {
                  CategoryName.push(category.ctgItems[i].name)
                }
              }
              that.setData({
                category: category,
                CategoryName: CategoryName,
              })
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 3000
              })
            }
          }
        })
      }
    });
  },
  formSubmit: function (e) {
    var that = this
    //获取全局变量   接口通用前缀
    var RouteUrl = getApp().globalData.RouteUrl
    var orderId = that.data.orderId   //获取订单ID
    var Mains = that.data.Mains    //主套餐
    var businessType_a = that.data.businessType_a  // 选择的主套餐K值
    var TotalPrice = that.data.TotalPrice   // 订单总价格
    var nameTitle_b = that.data.nameTitle_b  // 主套餐数据
    var Funeralss = that.data.Funeralss    //殡仪套餐数据
    var FuneralData_a_b_c = that.data.FuneralData_a_b_c
    var DataName_a = that.data.DataName_a  // 殡仪馆商品
    var businessType_c = that.data.businessType_c   //选择殡仪馆商品K值
    var DataCategory = that.data.DataCategory  //增值产品
    var consultId = that.data.consultId   //获取前页面传递的查询ID
    var ContentData = { "content": {} }    //定义接口传递参数
    var setmealMain = 0                 //主套餐id
    var setmealFuneral = 0        //殡仪馆商品ID
    var items = []                //选择的所有商品
    ContentData.content.consultId = consultId;  //装入查询ID
    ContentData.content.orderId = orderId;  //装入查询ID
    // console.log(orderId)
    if (orderId == 0) {   //判断此订单是否是第一次编辑订单
      for (var i in Mains) {
        setmealMain = Mains[businessType_a].id
      }
      ContentData.content.setmealMain = setmealMain   //加入主套餐id
      for (var i in Funeralss) {
        setmealFuneral = Funeralss[businessType_c].id
      }
      ContentData.content.setmealFuneral = setmealFuneral   //加入殡仪馆商品id
      ContentData.content.setmealCemetery = 0
      //ContentData.content.items ={}
      var ztcData = []
      for (var i in nameTitle_b) {
        for (var k in nameTitle_b[i].productItems) {
          var obj = {}
          obj.skuId = nameTitle_b[i].productItems[k].id
          obj.number = nameTitle_b[i].productItems[k].count
          obj.price = nameTitle_b[i].productItems[k].price
          obj.categoryId = nameTitle_b[i].productItems[k].categoryId
          obj.totalPrice = nameTitle_b[i].productItems[k].price * nameTitle_b[i].productItems[k].count
          obj.statusFlag = 1
          obj.projectId = 1
          ztcData.push(obj)
        }

      }
      for (var i in ztcData) {
        items.push(ztcData[i])
      }
      var byData = []
      if (DataName_a) {
        for (var i in DataName_a) {
          var obj = {}
          obj.skuId = DataName_a[i].id
          obj.number = DataName_a[i].count
          obj.price = DataName_a[i].price
          obj.categoryId = DataName_a[i].categoryId
          obj.totalPrice = DataName_a[i].price * DataName_a[i].count
          obj.statusFlag = 1
          obj.projectId = 2
          byData.push(obj)
        }
        for (var i in byData) {
          items.push(byData[i])
        }
      }
      var zzData = []
      // console.log(DataCategory)
      if (DataCategory) {
        for (var i in DataCategory) {
          var obj = {}
          obj.skuId = DataCategory[i].id
          obj.number = DataCategory[i].count
          obj.price = DataCategory[i].price
          obj.totalPrice = DataCategory[i].price * DataCategory[i].count
          obj.categoryId = DataCategory[i].categoryId
          obj.statusFlag = 1
          obj.projectId = 4
          zzData.push(obj)
        }
        for (var i in zzData) {
          items.push(zzData[i])
        }
      }
      ContentData.content.items = items
      wx.getStorage({
        key: 'logindata',
        success: function (msg) {
          var ForData = JSON.stringify(ContentData)
          //console.log(ForData)
          // 初次创建订单
          wx.request({
            url: RouteUrl + 'order/create',
            method: "POST",
            data: ForData,
            header: {
              "Content-Type": "application/x-www-form-urlencodeed",
              "Cookie": "sid=" + msg.data.content.sessionId
            },
            success: function (res) {
              //console.log(res.data)
              if (res.data.code == 1000 && res.data.message == '操作成功') {
                //頁面跳轉
                wx.redirectTo({
                  url: '../list/list'
                })
              } else {   //加入保持编辑订单接口
                wx.showToast({
                  title: res.data.message,
                  duration: 3000
                })
              }
            }
          })
        }
      })
    } else {    //判断此订单是否是第二次编辑订单
      //console.log(ContentData)
      wx.getStorage({
        key: 'logindata',
        success: function (msg) {
          var ForData = JSON.stringify(ContentData)
          //console.log(ForData)
          // 初始化二次修改
          wx.request({
            url: RouteUrl + 'order/view',
            method: "POST",
            data: ForData,
            header: {
              "Content-Type": "application/x-www-form-urlencodeed",
              "Cookie": "sid=" + msg.data.content.sessionId
            },
            success: function (res) {
              //console.log(res.data)
              if (res.data.code == 1000 && res.data.message == '操作成功') {
                var orderData = res.data.content.projectItems
                console.log(res.data.content.projectItems)
                for (var i in orderData) {
                  if (orderData[i].id == 1) {
                    var orderZTC = orderData[i].ctgItems   //已有的主套餐
                  }
                }
                for (var i in orderData) {
                  if (orderData[i].id == 2) {
                    var orderBYG = orderData[i].ctgItems   //已有的殡仪馆商品
                  }
                }
                for (var i in orderData) {
                  if (orderData[i].id == 4) {
                    var orderZZYF = orderData[i].ctgItems   //已有的增值商品
                  }
                }
                var ztcData = []
                for (var i in orderZTC) {
                  for (var k in orderZTC[i].productItems) {
                    var obj = {}
                    if (orderZTC[i].productItems[k].canEdit == true) {
                      //orderZTC[i].productItems[k].statusFlag = 2
                      obj.statusFlag = 2
                      obj.categoryId = orderZTC[i].id
                      obj.id = orderZTC[i].productItems[k].id
                      obj.name = orderZTC[i].productItems[k].name
                      obj.number = orderZTC[i].productItems[k].number
                      obj.price = orderZTC[i].productItems[k].price
                      obj.skuId = orderZTC[i].productItems[k].skuId
                      obj.specification = orderZTC[i].productItems[k].specification
                      obj.totalPrice = orderZTC[i].productItems[k].totalPrice
                      obj.unit = orderZTC[i].productItems[k].unit

                      //  console.log(obj)
                    } else {
                      obj.statusFlag = 1
                      obj.categoryId = orderZTC[i].id
                      obj.id = orderZTC[i].productItems[k].id
                      obj.name = orderZTC[i].productItems[k].name
                      obj.number = orderZTC[i].productItems[k].number
                      obj.price = orderZTC[i].productItems[k].price
                      obj.skuId = orderZTC[i].productItems[k].skuId
                      obj.specification = orderZTC[i].productItems[k].specification
                      obj.totalPrice = orderZTC[i].productItems[k].totalPrice
                      obj.unit = orderZTC[i].productItems[k].unit
                    }
                    ztcData.push(obj)
                  }
                }
                var byData = []
                for (var i in orderBYG) {
                  for (var k in orderBYG[i].productItems) {
                    if (orderBYG[i].productItems[k].canEdit == true) {
                      orderBYG[i].productItems[k].statusFlag = 2
                      orderBYG[i].productItems[k].categoryId=orderBYG[i].id
                      byData.push(orderBYG[i].productItems[k])
                    } else {
                      orderBYG[i].productItems[k].statusFlag = 1
                      orderBYG[i].productItems[k].categoryId=orderBYG[i].id
                      byData.push(orderBYG[i].productItems[k])
                    }
                  }
                }
                var zzData = []
                for (var i in orderZZYF) {
                  for (var k in orderZZYF[i].productItems) {
                    if (orderZZYF[i].productItems[k].canEdit == true) {
                      orderZZYF[i].productItems[k].statusFlag = 2
                      orderZZYF[i].productItems[k].categoryId=orderZZYF[i].id
                      zzData.push(orderZZYF[i].productItems[k])
                    } else {
                      orderZZYF[i].productItems[k].statusFlag = 1
                       orderZZYF[i].productItems[k].categoryId=orderZZYF[i].id
                      zzData.push(orderZZYF[i].productItems[k])
                    }
                  }
                }
                for (var i in ztcData) {
                  items.push(ztcData[i])
                }
                for (var i in byData) {
                  items.push(byData[i])
                }
                for (var i in zzData) {
                  items.push(zzData[i])
                }
                for (var i in Mains) {
                  setmealMain = Mains[businessType_a].id
                }
                ContentData.content.setmealMain = setmealMain   //加入主套餐id
                for (var i in Funeralss) {
                  setmealFuneral = Funeralss[businessType_c].id
                }
                ContentData.content.setmealFuneral = setmealFuneral   //加入殡仪馆商品id
                ContentData.content.setmealCemetery = 0
                //ContentData.content.items ={}
                var ztcData = []
                for (var i in nameTitle_b) {
                  for (var k in nameTitle_b[i].productItems) {
                    var obj = {}
                    if(nameTitle_b[i].productItems[k].number){
                      obj.id = nameTitle_b[i].productItems[k].id
                      obj.skuId = nameTitle_b[i].productItems[k].skuId
                      obj.number = nameTitle_b[i].productItems[k].number
                      obj.price = nameTitle_b[i].productItems[k].price
                      obj.totalPrice = nameTitle_b[i].productItems[k].price *nameTitle_b[i].productItems[k].number
                    }else{
                      obj.skuId = nameTitle_b[i].productItems[k].id
                      obj.number = nameTitle_b[i].productItems[k].count
                      obj.price = nameTitle_b[i].productItems[k].price
                      obj.totalPrice = nameTitle_b[i].productItems[k].price * nameTitle_b[i].productItems[k].count
                    }
                    obj.categoryId = nameTitle_b[i].productItems[k].categoryId
                    obj.statusFlag = 1
                    obj.projectId = 1
                    ztcData.push(obj)
                  }

                }
                for (var i in ztcData) {
                  items.push(ztcData[i])
                }
                var byData = []
                if (DataName_a) {
                  for (var i in DataName_a) {
                    var obj = {}
                    if(DataName_a[i].number){
                      obj.id = DataName_a[i].id
                      obj.skuId = DataName_a[i].skuId
                      obj.number = DataName_a[i].number
                      obj.price = DataName_a[i].price
                      obj.totalPrice = DataName_a[i].price * DataName_a[i].number
                    }else{
                      obj.skuId = DataName_a[i].id
                      obj.number = DataName_a[i].count
                      obj.price = DataName_a[i].price
                      obj.totalPrice = DataName_a[i].price * DataName_a[i].count
                    }
                    obj.categoryId = DataName_a[i].categoryId
                    obj.statusFlag = 1
                    obj.projectId = 2
                    byData.push(obj)
                  }
                  for (var i in byData) {
                    for(var k in items){
                        if(byData[i].skuId != items[k].skuId){
                          byData[i].categoryId=items[k].categoryId
                        }
                    }
                    items.push(byData[i])
                  }
                }
                var zzData = []
                if (DataCategory) {
                  for (var i in DataCategory) {
                    var obj = {}
                    if(DataCategory[i].number){
                      obj.id = DataCategory[i].id
                      obj.skuId = DataCategory[i].skuId
                      obj.number = DataCategory[i].number
                      obj.price = DataCategory[i].price
                      obj.totalPrice = DataCategory[i].price * DataCategory[i].number
                    }else{
                      obj.skuId = DataCategory[i].id
                      obj.number = DataCategory[i].count
                      obj.price = DataCategory[i].price
                      obj.totalPrice = DataCategory[i].price * DataCategory[i].count
                    }
                    obj.categoryId = DataCategory[i].categoryId
                    obj.statusFlag = 1
                    obj.projectId = 4
                    zzData.push(obj)
                  }
                  for (var i in zzData) {
                    for(var k in items){
                        if(zzData[i].skuId == items[k].skuId){
                          zzData[i].categoryId=items[k].categoryId
                        //  items.push(zzData[i])
                        }
                    }
                   items.push(zzData[i])
                  }
                }
                ContentData.content.items = items
                var ForData = JSON.stringify(ContentData)
                // console.log(ContentData)
                // console.log(DataCategory)
                // 多次编辑创建订单
                wx.request({
                  url: RouteUrl + 'order/edit/save',
                  method: "POST",
                  data: ForData,
                  header: {
                    "Content-Type": "application/x-www-form-urlencodeed",
                    "Cookie": "sid=" + msg.data.content.sessionId
                  },
                  success: function (res) {
                    //console.log(res.data)
                    if (res.data.code == 1000 && res.data.message == '操作成功') {
                      //頁面跳轉
                      wx.redirectTo({
                        url: '../list/list'
                      })
                    } else {   
                      wx.showToast({
                        title: res.data.message,
                        duration: 3000
                      })
                    }
                  }
                })
              } else {   //加入保持编辑订单接口
                wx.showToast({
                  title: res.data.message,
                  duration: 3000
                })
              }
            }
          })
        }
      })
    }
  }
});
