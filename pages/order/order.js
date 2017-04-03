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


    array_e: ['花圈', '告别仪式'],
    businessType_e: 0,
    nameTitle_e: "增值服务名称",
    Mains: '',
    MainData_b: '',

  },
  bindPickerChange_a: function (e) {
    // console.log(e.detail.value)
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
    //console.log(MainData_c)
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
    console.log(FuneralData_a_a)
    // var FuneralData_a_b=[]
    // for(var i in FuneralData_a_a){
    //   FuneralData_a_b[i]=FuneralData_a_a[i].productItems
    //     //  for(var j in FuneralData_a_a[i].productItems){
    //     //        //FuneralData_a_b[i]=FuneralData_a_a[i]
    //     //           FuneralData_a_b[i]=FuneralData_a_a[i].productItems[j];
    //     //  }
    // }

    var FuneralData_a_b_c=[]
    for(var i in FuneralData_a_a){
          FuneralData_a_b_c[i]=FuneralData_a_a[i]

          for(var j in FuneralData_a_a[i].productItems){
          FuneralData_a_b_c[i].productItems.push (FuneralData_a_a[i].productItems[j].name)
          }
    }

    // for(var i in FuneralData_a_b){
    //     // FuneralData_a_b_c.push(FuneralData_a_b[i].name)
    //     for(var j in FuneralData_a_b[i]){
    //       FuneralData_a_b_c.push(FuneralData_a_b[i][j])
    //     }
    // }
    console.log(FuneralData_a_b_c)
    // console.log(FuneralData_a_b_c)
    this.setData({
      businessType_c: e.detail.value,
      FuneralData_a_b_c: FuneralData_a_b_c,
      //FuneralData_a_b:FuneralData_a_b
    })
  },

  bindPickerChange_c_c:function(e){
    var businessType_c_c=e.detail.value
    var FuneralData_c_c = []
    for (var i in Funeral) {
      FuneralData_c_c = Funeral[businessType_c_c].productItems;
      break;
      //productItems
    }
    console.log(FuneralData_c_c)
    this.setData({
      businessType_d: e.detail.value
    })
  },
  bindPickerChange_d: function (e) {

    this.setData({
      businessType_d: e.detail.value
    })
  },
  bindPickerChange_e: function (e) {
    //console.log(e.detail.value)
    this.setData({
      businessType_e: e.detail.value
    })
  },
  onLoad: function (options) {
    var that = this
    // 取出緩存登錄信息
    wx.getStorage({
      key: 'logindata',
      success: function (msg) {
        //  请求主套餐数据
        wx.request({
          url: 'http://115.28.163.211:7080/shianlife-adviser-1.0-SNAPSHOT/setmeal/main/get',
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
          url: 'http://115.28.163.211:7080/shianlife-adviser-1.0-SNAPSHOT/setmeal/funeral/get',
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
      }
    });

  },
  formSubmit: function (e) {
    var ContentData = e.detail.value;
    if (this.data.businessType == 0) {
      ContentData.businessType = 1
    } else if (this.data.businessType == 1) {
      ContentData.businessType = 2
    }
    // 取出緩存登錄信息
    wx.getStorage({
      key: 'logindata',
      success: function (msg) {
        // console.log(ContentData)
        var forData = { content: ContentData };
        //转换字符串
        var ForData = JSON.stringify(forData);
        wx.request({
          url: 'http://115.28.163.211:7080/shianlife-adviser-1.0-SNAPSHOT/setmeal/main/get',
          method: "POST",
          data: ForData,
          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            "Cookie": "sid=" + msg.data.content.sessionId
          },
          success: function (res) {
            //console.log(res.data)
            if (res.data.code == 1000 && res.data.message == '操作成功') {
              //console.log(res.data.content.consultId)
              //操作成功返回consultId進行緩存
              wx.setStorageSync('consultId', res.data.content.consultId);
              //頁面跳轉
              // wx.navigateTo({
              //      url: '',
              //  })
              // console.log(res.data)
            } else {
              console.log(res.data.message)
            }
          }
        })
      }
    })
  }
});
