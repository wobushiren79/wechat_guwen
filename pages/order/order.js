Page({
  data: {
    num: "5",
    money: "98520",
    nameTitle_a: "套餐名称",
    consultId:0,
    MainData: ['套餐一', '套餐二'],
    businessType_a: 0,
    TotalPrice:0,
    Funeralss:{},


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
    var TotalPrice=0
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
    var Total_Price=[]
    for(var i in MainData_c){
        Total_Price.push(MainData_c[i].price)
    }
    //console.log(Total_Price)
    for(var i in Total_Price){
     TotalPrice+=Total_Price[i]
    }
    //console.log(TotalPrice)
    this.setData({
      businessType_a: e.detail.value,
      nameTitle_b: MainData_c,
      TotalPrice:TotalPrice
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
   // console.log(FuneralData_a)
    this.setData({
      businessType_c: e.detail.value,
      FuneralData_a_b_c: FuneralData_a_b_c
    })
  },

  bindPickerChange_c_c: function (e) {
    var n = e.detail.value
    var TotalPrice=parseFloat(this.data.TotalPrice)
    var name = e.target.dataset.name
    var Funeralss = this.data.Funeralss
    var FuneralData_a_b_c = this.data.FuneralData_a_b_c
    var DataName_b = []
    var dataname = this.data.DataName_a
    console.log(Funeralss)
    if (dataname) {
      DataName_b = dataname
    }
    for (var i in name) {
      var DataName = name[n]
    }
    console.log(DataName)
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

    console.log(Tmp)
    if (Tmp != null) {
      DataName_b.push(Tmp)
    }
    var Total_Price=[]
    for(var i in DataName_b){
        Total_Price.push=DataName_b[i].price
      }
    for(var i in Total_Price){
        TotalPrice+=Total_Price[i]
    }
    // console.log(tmp)
    // console.log(Tmp)
    // console.log(DataName)

    // console.log(DataName_b)
    this.setData({
      //businessType_c_c: e.detail.value,
      DataName_a: DataName_b,
      TotalPrice:TotalPrice
    })
  },
  DataName_aDel:function(e){
    var that = this
    var TotalPrice=parseFloat(that.data.TotalPrice)
    var DataName_a=that.data.DataName_a
    var id=e.target.dataset.id
    var DataName_A=[]
    var Total_Price=''
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function(res) {
        if (res.confirm) {
          for(var i in DataName_a){
            if(id != DataName_a[i].id){
                DataName_A.push(DataName_a[i])
            }else if(id == DataName_a[i].id){
               Total_Price=DataName_a[i].price
            }
          }
          TotalPrice=TotalPrice-Total_Price
          that.setData({
            DataName_a:DataName_A,
            TotalPrice:TotalPrice
          })
        } else if (res.cancel) {
          that.setData({
            DataName_a:DataName_a
          })
      }
      }
    })
  },
  bindPickerChange_e: function (e) {
    var that = this;
    var TotalPrice=parseFloat(that.data.TotalPrice)
    var Total_Price=''
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
                  for(var i in DataCategory_b){
                    Total_Price=DataCategory_b[i].price
                  }
                  TotalPrice+=Total_Price
                  that.setData({
                    //businessType_e: e.detail.value,
                    DataCategory: DataCategory_b,
                    TotalPrice:TotalPrice
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
    var TotalPrice=parseFloat(this.data.TotalPrice)
    var Total_Price=''
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
    for(var i in Cdata){
      if(Cdata[i].id == id){
       Total_Price=Cdata[i].price
      }
    }
    //console.log(Total_Price)
    TotalPrice-=Total_Price
      this.setData({
         DataCategory:Cdata,
         TotalPrice:TotalPrice
      })
  },
  Top:function(e){
    var id = e.target.dataset.id
    var Cdata=this.data.DataCategory
    var TotalPrice=parseFloat(this.data.TotalPrice)
    var Total_Price=''
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
    for(var i in Cdata){
      if(Cdata[i].id == id){
        Total_Price=Cdata[i].price
      }
      
    }
    //console.log(Total_Price)
    TotalPrice+=Total_Price
      this.setData({
         DataCategory:Cdata,
         TotalPrice:TotalPrice
         
      })
  },
  del:function(e){
    var that = this
    var id=e.target.dataset.k
    var TotalPrice=parseFloat(this.data.TotalPrice)
    var Total_Price=''
    var Cdata=that.data.DataCategory
    var cdata=[]
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function(res) {
        if (res.confirm) {
          for(var i in Cdata){
              if(id !=Cdata[i].id){
                cdata.push(Cdata[i])
              }
          }
          for(var i in Cdata){
            if(id == Cdata[i].id){
             Total_Price=Cdata[i].price*Cdata[i].count
            }

          }
         // console.log(Total_Price)
          TotalPrice-=Total_Price
            that.setData({
              DataCategory:cdata,
              TotalPrice:TotalPrice
            })
        } else if (res.cancel) {
          that.setData({
            DataCategory:Cdata
             })
        }
      }
    })
  },
  onLoad: function (options) {

    var that = this
    //获取前页面传递的consultId
    var consultId=options.consultId
    //获取全局变量   接口通用前缀
    var RouteUrl = getApp().globalData.RouteUrl
    //总价格
    var TotalPrice=parseFloat(that.data.TotalPrice)
    var Total_Price=[]
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
              //取出所以显示在页面的价格
              for(var i in MainData_c){
                  Total_Price.push(MainData_c[i].price)
              }
              for(var i in Total_Price){
                  TotalPrice+=parseFloat(Total_Price[i]);
              }
              //console.log(Total_Price)
              that.setData({
                MainData: MainsData,
                Mains: Mains,
                nameTitle_b: MainData_c,
                TotalPrice:TotalPrice,
                consultId:consultId
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
              var Funeralss=res.data.content.funerals
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
                Funeralss:Funeralss
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
              that.setData({
                category: category,
                CategoryName: CategoryName,
              })
            }
          }
        })
      }
    });

  },
  formSubmit: function (e) {
   var that = this
   var TotalPrice=that.data.TotalPrice   // 订单总价格
   var nameTitle_b=that.data.nameTitle_b  // 主套餐数据
   var FuneralData_a_b_c=that.data.FuneralData_a_b_c
   var DataName_a=that.data.DataName_a  // 套餐产品数据
   var DataCategory=that.data.DataCategory  //增值产品
   var consultId=that.data.consultId   //获取前页面传递的查询ID
   var ContentData={"content":{}}
        ContentData.content.consultId=consultId;  //装入查询ID
        for(var i in nameTitle_b){
           ContentData.content.setmealCemetery= nameTitle_b[0].categoryId  //装入主套餐ID
        }
        for(var i in FuneralData_a_b_c){

        }
        console.log(FuneralData_a_b_c)
        console.log(DataName_a)
        console.log(DataCategory)
        console.log(ContentData)

  //  }else{
  //     wx.showToast({
  //       title: '',
  //       duration: 2000
  //     })
  //  }
  }
});
