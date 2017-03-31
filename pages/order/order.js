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
    }],
    nameContent_b: [{
        "categoryId": "categoryId",
        "count": "数量",
        "id": "id",
        "name": "名字",
        "price": "价格",
        "specification": "尺寸",
        "unit": "单位"
    }],

    array_c: ['套餐一', '套餐二'],
    businessType_c: 0,
    nameTitle_c: "套餐名称",

    array_d: ['寿衣1', '寿衣2'],
    businessType_d: 0,
    nameTitle_d: "寿衣全套",

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
      MainData_b=Mains[id].ctgItems;
      break;
    }
    console.log(MainData_b)
    //  var aaa=[];
    // for (var j in MainData_b) {
    //   for(var k in MainData_b[j].productItems){

    //     aaa.push(MainData_b[j].productItems[k])
    //   }
    //   //  aaa = MainData_b.productItems[j].count;
    //   //  aaa = MainData_b.productItems[j].id;
    //     // MainData_b[cid] = MainData_b[0].id,
    //     // MainData_b[cname] = MainData_b[0].name,
    //     // MainData_b[price] = MainData_b[0].price,
    //     // MainData_b[specification] = MainData_b[0].specification,
    //     // MainData_b[unit] = MainData_b[0].unit
    // }
    //console.log(MainData_b)
    // console.log(aaa)
    this.setData({
      businessType_a: e.detail.value,
      nameTitle_b: MainData_b
      //nameContent_b:aaa
    })
  //  console.log(this.data.nameContent_b)
  },
  bindPickerChange_c: function (e) {
    //console.log(e.detail.value)
    this.setData({
      businessType_c: e.detail.value
    })
  },
  bindPickerChange_d: function (e) {
    //console.log(e.detail.value)
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
        // console.log(ContentData)
        // var forData = { content: "" };
        //转换字符串
        //var ForData = JSON.stringify(forData);
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
              var mains = res.data.content.mains;
              var MainsData = [];
              // var IdData=[];
              for (var i in mains) {
                var cur = mains[i]
                var obj = { name: cur.name, id: cur.id }
                //  MainsData.push(obj);
                MainsData.push(cur.name);
                //  IdData.push(cur.id)
              }
              //console.log(MainsData)
              that.setData({
                MainData: MainsData,
                Mains: mains
                // businessType_a:IdData
                //hidden:true
              })
              //console.log(that.data.MainData)
              //操作成功返回consultId進行緩存
              // wx.setStorageSync('consultId', res.data.content.consultId);
              //頁面跳轉
              // wx.navigateTo({
              //      url: '',
              //  })
              // console.log(res.data)
            }
          }
        })
      }
    })
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
  },
  formData: function (e) {
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
          url: 'http://115.28.163.211:7080/shianlife-adviser-1.0-SNAPSHOT/consult/add',
          method: "POST",
          data: ForData,
          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            "Cookie": "sid=" + msg.data.content.sessionId
          },
          success: function (res) {
            //console.log(res.data)
            if (res.data.code == 1000 && res.data.message == '操作成功') {
              console.log('進入淺談');
              // that.globalData.indexdata=res.data
              //登錄信息緩存
              // wx.setStorageSync('logindata',res.data)
              //頁面跳轉
              wx.navigateTo({
                url: '../list/list'
              });
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
