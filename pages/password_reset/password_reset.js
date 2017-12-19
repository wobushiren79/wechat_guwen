
Page({
  data: {
    second: 60,
    selected: false,
    selected1: true,

    value1: '殡仪服務',
    value2: "公墓服務",
    logo_src: "../../images/logo.png",
    systemType: 2,
    value3: '',
    value4: ''
  },
  // getphone: function (e) {
  //   this.setData({
  //     selected: true,
  //     selected1: false,
  // //   });
  //   countdown(this);
  // },
  onLoad: function () {

  },
  phoneData:function(e){
    var that=this
    wx.showLoading({
      title: '请稍后',
    })
    if (e.detail.value.mobile != ""){
      // that.setData({
        // selected: true,
        // selected1: false,
        //xianshi: true,
      // })
      
      var get_data = {}
      get_data.content = e.detail.value
      //发短信接口
      wx.request({
        url: 'https://platform.shianlife.cn/api/usersInfo/forgetKeys',
        method: "POST",
        data: get_data,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 1000) {
            wx.hideLoading()
            that.setData({
              selected: true,
              selected1: false,
              xianshi: true,
              second: 60,
            })
            countdown(that)
            wx.showToast({
              title: '发送成功',
              duration: 3000,
              // mask:true
            })
          } else if (res.data.code == 1006) {
            wx.showToast({
              title: res.data.message,
              image: '../../images/icon_info.png',
              duration: 3000,
              // mask:true
            })
          } else {
            wx.showToast({
              title: res.data.message,
              image: '../../images/icon_info.png',
              duration: 3000,
              // mask:true
            })
          }
        },
        file:function(opt){
          wx.hideLoading()
          wx.showToast({
            title: '系统错误',
            image: '../../images/icon_info.png',
            duration: 3000,
            // mask:true
          })
        }
      })
    }else{
      wx.showToast({
        title: '号码不能为空',
        image: '../../images/icon_info.png',
        duration: 3000,
        // mask:true
      })
    }

  },
  formSubmit:function(e){
    var that = this
    wx.showLoading({
      title: '请稍后',
    })
    console.log(e.detail.value)
    if (e.detail.value.keys != '' && e.detail.value.mobile != '' && e.detail.value.msgCode != ''){
      var get_data = {}
      get_data.content = e.detail.value
      //重置平台密码接口
      wx.request({
        url: 'https://platform.shianlife.cn/api/usersInfo/forgetKeys',
        method: "POST",
        data: get_data,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          // console.log(getCurrentPages())
          // if (res.data.code == 1000) {
          //   wx.request({
          //     // url: 'https://platform.shianlife.cn/api/usersInfo/forgetKeys',
          //     url: 'https://t-cemetery-api.shianlife.cn/shianlife-advisor-cemetery-1.0-SNAPSHOT/modifyAccountPwd',
          //     method: "POST",
          //     data: get_data,
          //     header: {
          //       'content-type': 'application/json'
          //     },
          //     success:function(opt){
          //       console.log(opt)
          if (res.data.code == 1000){
                  wx.showModal({
                    title: '重置密码提示',
                    content: '重置密码成功',
                    showCancel: false,
                    success: function (o) {
                      if (o.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (o.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }else{
                  wx.showToast({
                    title: res.data.message,
                    image: '../../images/icon_info.png',
                    duration: 3000,
                    // mask:true
                  })
                }
              }
            })
        //   }else{
        //     wx.showToast({
        //       title: res.data.message,
        //       image: '../../images/icon_info.png',
        //       duration: 3000,
        //       // mask:true
        //     })
        //   }
        // }
        // })
    } else if (e.detail.value.keys == ''){
      wx.showToast({
        title: '新密码不能为空',
        image: '../../images/icon_info.png',
        duration: 3000,
        // mask:true
      })
    } else if (e.detail.value.mobile == '') {
      wx.showToast({
        title: '手机号不能为空',
        image: '../../images/icon_info.png',
        duration: 3000,
        // mask:true
      })
    } else if (e.detail.value.msgCode == '') {
      wx.showToast({
        title: '验证码不能为空',
        image: '../../images/icon_info.png',
        duration: 3000,
        // mask:true
      })
    }
  }



})

function countdown(that) {
  console.log(that.data.second);
  var second = that.data.second;
  if (second == 0) {
    // console.log("Time Out...");
    that.setData({
      selected: false,
      selected1: true,
      second: 60,
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }
    , 1000)
}
