Page({
  data: {
    array: ['套餐一', '套餐二'],
    businessType: 0,
    name1: '姚財武空',
    name2: '鄧紫棋',
    name3: '元芳',
    list1:'套餐一'
  },
  bindPickerChange: function (e) {
    //console.log(e.detail.value)
    var that = this
    if(e.detail.value == 0){
          that.setData({
            name1: '姚財武', name2: '鄧紫棋', name3: '元芳',
            list1:'套餐一',
            businessType: e.detail.value
          })
    }else{
          that.setData({
            name1: '元芳', name2: '鄧紫棋', name3: '姚財武',
            list1:'套餐二',
            businessType: e.detail.value
          })
    }

  }

  //  formSubmit:function(e){
  //      var ContentData=e.detail.value;

  //      if(this.data.businessType == 0){
  //         ContentData.businessType = 1
  //      }else if(this.data.businessType == 1){
  //          ContentData.businessType = 2
  //      }     
  //      console.log(ContentData)
  // // 取出緩存登錄信息
  // wx.getStorage({
  //   key: 'logindata',
  //     success: function(msg) {
  //     // console.log(ContentData)
  //      var forData={content:ContentData};
  //      //转换字符串
  //      var ForData=JSON.stringify(forData);
  //       wx.request({
  //         url: 'http://115.28.163.211:7080/shianlife-adviser-1.0-SNAPSHOT/consult/add', 
  //         method:"POST",
  //         data: ForData,
  //         header: {
  //            "Content-Type":"application/x-www-form-urlencodeed",
  //            "Cookie":"sid="+msg.data.content.sessionId
  //         },
  //         success: function(res) {
  //           //console.log(res.data)
  //           if(res.data.code == 1000 &&res.data.message == '操作成功'){
  //               //console.log(res.data.content.consultId)
  //             //操作成功返回consultId進行緩存
  //             wx.setStorageSync('consultId',res.data.content.consultId);
  //             //頁面跳轉
  //             // wx.navigateTo({
  //             //      url: '',
  //             //  })
  //               // console.log(res.data)
  //           }else{
  //             console.log(res.data.message)
  //           }
  //         }
  //       })
  //     }
  // })
  //  },
  //  formData:function(e){
  //      var ContentData=e.detail.value;

  //      if(this.data.businessType == 0){
  //         ContentData.businessType = 1
  //      }else if(this.data.businessType == 1){
  //          ContentData.businessType = 2
  //      }     
  // // 取出緩存登錄信息
  // wx.getStorage({
  //   key: 'logindata',
  //     success: function(msg) {
  //     // console.log(ContentData)
  //      var forData={content:ContentData};
  //      //转换字符串
  //      var ForData=JSON.stringify(forData);
  //       wx.request({
  //         url: 'http://115.28.163.211:7080/shianlife-adviser-1.0-SNAPSHOT/consult/add', 
  //         method:"POST",
  //         data: ForData,
  //         header: {
  //            "Content-Type":"application/x-www-form-urlencodeed",
  //            "Cookie":"sid="+msg.data.content.sessionId
  //         },
  //         success: function(res) {
  //           //console.log(res.data)
  //           if(res.data.code == 1000 &&res.data.message == '操作成功'){
  //               console.log('進入淺談');
  //             // that.globalData.indexdata=res.data
  //             //登錄信息緩存
  //             // wx.setStorageSync('logindata',res.data)
  //             //頁面跳轉
  //             wx.navigateTo({
  //                  url: '../list/list'
  //              });
  //               // console.log(res.data)
  //           }else{
  //             console.log(res.data.message)
  //           }
  //         }
  //       })
  //     }
  // })
  //  }
});
