Page({
  data: {
    num: "5",
    money: "98520",
    nameTitle_a: "套餐名称",

    MainData: ['套餐一', '套餐二'],
    businessType_a: 0,


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
    this.setData({
      businessType_a: e.detail.value,
      nameTitle_b: MainData_c
    })
  },
  bindPickerChange_c: function (e) {
    var Funeral = this.data.Funeral
    var id = e.detail.value
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
    //重新组装对象以满足页面输出格式
    var FuneralData_a_b_c = []
    for (var i in FuneralData_a_a) {
      FuneralData_a_b_c[i] = FuneralData_a_a[i]

      for (var j in FuneralData_a_a[i].productItems) {
        FuneralData_a_b_c[i].productItems[j] = FuneralData_a_a[i].productItems[j].name
      }
    }
    console.log(FuneralData_a)
    this.setData({
      businessType_c: e.detail.value,
      FuneralData_a_b_c: FuneralData_a_b_c
    })
  },

  bindPickerChange_c_c: function (e) {
    var n = e.detail.value
    var name = e.target.dataset.name
    var Funeral = this.data.Funeral
    var FuneralData_a_b_c = this.data.FuneralData_a_b_c
    var DataName_b = []
    var dataname = this.data.DataName_a
    if (dataname) {
      DataName_b = dataname
    }

    for (var i in name) {
      var DataName = name[n]
    }

    // console.log(Funeral)
    var Tmp = []
    if (DataName) {
      for (var i in Funeral) {
        for (var j in Funeral[i].ctgItems) {
          for (var k in Funeral[i].ctgItems[j].productItems) {
            if (Funeral[i].ctgItems[j].productItems[k].name == DataName) {
              Tmp = Funeral[i].ctgItems[j].productItems[k];
              // break;

            }
          }
        }
      }
    }
    if (Tmp) {
      DataName_b.push(Tmp)
    }
    // console.log(tmp)
    // console.log(Tmp)
    // console.log(DataName)

    // console.log(DataName_b)
    this.setData({
      //businessType_c_c: e.detail.value,
      DataName_a: DataName_b
    })
  },
  bindPickerChange_e: function (e) {
    var that = this;
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
                var categorydata = [];
                if (category) {
                  for (var i in category) {
                    if(category[i].count == 0){
                        category[i].count = 1
                        DataCategory_b.push(category[i])
                    }else{
                        DataCategory_b.push(category[i])
                    }
                    
                    
                  };
                  that.setData({
                    //businessType_e: e.detail.value,
                    DataCategory: DataCategory_b
                  });

                };
              };
            }
          });
        }
      });
    };
  },
  Botton:function(e){
    var id= e.target.dataset.id
    var Cdata=this.data.DataCategory
    //console.log(Cdata)
   // var DataCategory=[]
    for(var i in Cdata){
        if(Cdata[i].id == id){
          if(Cdata[i].count !=0 && Cdata[i].count !=1){
             Cdata[i].count = Cdata[i].count-1
             Cdata[i].price = Cdata[i].price
             Cdata[i].specification = Cdata[i].specification
             Cdata[i].unit = Cdata[i].unit
             Cdata[i].id = Cdata[i].id
             Cdata[i].name = Cdata[i].name
          }else{
             Cdata[i].count = Cdata[i].count
             Cdata[i].price = Cdata[i].price
             Cdata[i].specification = Cdata[i].specification
             Cdata[i].unit = Cdata[i].unit
             Cdata[i].id = Cdata[i].id
             Cdata[i].name = Cdata[i].name
          }
        }
    }
      this.setData({
         DataCategory:Cdata
      })
  },
  Top:function(e){
    var id = e.target.dataset.id
    var Cdata=this.data.DataCategory
   // var DataCategory=[]
    for(var i in Cdata){
        if(Cdata[i].id == id){
             Cdata[i].count = Cdata[i].count + 1
             Cdata[i].price = Cdata[i].price 
             Cdata[i].specification = Cdata[i].specification
             Cdata[i].unit = Cdata[i].unit
             Cdata[i].id = Cdata[i].id
             Cdata[i].name = Cdata[i].name
        }
    }
      this.setData({
         DataCategory:Cdata
      })
  },
  del:function(e){
    console.log(e.target.dataset.id)
  },
  onLoad: function (options) {
    var that = this
    var RouteUrl = getApp().globalData.RouteUrl
    // 取出緩存登錄信息
    wx.getStorage({
      key: 'logindata',
      success: function (msg) {
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
              var id = 0
              var MainData_b = []
              for (var i in Mains) {
                MainData_b = Mains[id].ctgItems;
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
              that.setData({
                MainData: MainsData,
                Mains: Mains,
                nameTitle_b: MainData_c
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
              // console.log(Funeral)
              //取出主套餐列表
              var FuneralData = [];
              for (var i in Funeral) {
                var cur = Funeral[i]
                var obj = { name: cur.name, id: cur.id }
                FuneralData.push(cur.name);
              }
              // console.log(FuneralData)
              //var Mains = this.data.Mains
              //初始化主套餐0
              // var id = 0
              // var MainData_b = []
              // for (var i in Mains) {
              //   MainData_b=Mains[id].ctgItems;
              //   break;
              // }
              //取出主套餐详情
              // var MainData_c=[]
              // for(var i in MainData_b){
              //     for(var j in MainData_b[i].productItems){
              //           MainData_c[i]=MainData_b[i]
              //           MainData_c[i].count=MainData_b[i].productItems[j].count
              //           MainData_c[i].productItemsId=MainData_b[i].productItems[j].id
              //           MainData_c[i].productItemsName=MainData_b[i].productItems[j].name
              //           MainData_c[i].price=MainData_b[i].productItems[j].price
              //           MainData_c[i].specification=MainData_b[i].productItems[j].specification
              //           MainData_c[i].unit=MainData_b[i].productItems[j].unit
              //           MainData_c[i].categoryId=MainData_b[i].productItems[j].categoryId
              //     }
              // }
              that.setData({
                FuneralData: FuneralData,
                Funeral: Funeral,
                // nameTitle_b: MainData_c
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
              var category = res.data.content
              if (category) {
                var CategoryName = []
                for (var i in category.ctgItems) {
                  CategoryName.push(category.ctgItems[i].name)
                }
              }
              // console.log(category)
              // console.log(CategoryName)
              that.setData({
                category: category,
                CategoryName: CategoryName,
                // nameTitle_b: MainData_c
              })
            }
          }
        })
      }
    });

  },
  formSubmit: function (e) {
    var ContentData = e.detail.value;
  //   if (this.data.businessType == 0) {
  //     ContentData.businessType = 1
  //   } else if (this.data.businessType == 1) {
  //     ContentData.businessType = 2
  //   }
  //   // 取出緩存登錄信息
  //   wx.getStorage({
  //     key: 'logindata',
  //     success: function (msg) {
  //       // console.log(ContentData)
  //       var forData = { content: ContentData };
  //       //转换字符串
  //       var ForData = JSON.stringify(forData);
  //       wx.request({
  //         url: 'http://115.28.163.211:7080/shianlife-adviser-1.0-SNAPSHOT/setmeal/main/get',
  //         method: "POST",
  //         data: ForData,
  //         header: {
  //           "Content-Type": "application/x-www-form-urlencodeed",
  //           "Cookie": "sid=" + msg.data.content.sessionId
  //         },
  //         success: function (res) {
  //           //console.log(res.data)
  //           if (res.data.code == 1000 && res.data.message == '操作成功') {
  //             //console.log(res.data.content.consultId)
  //             //操作成功返回consultId進行緩存
  //             wx.setStorageSync('consultId', res.data.content.consultId);
  //             //頁面跳轉
  //             // wx.navigateTo({
  //             //      url: '',
  //             //  })
  //             // console.log(res.data)
  //           } else {
  //             console.log(res.data.message)
  //           }
  //         }
  //       })
  //     }
  //   })
  }
});
