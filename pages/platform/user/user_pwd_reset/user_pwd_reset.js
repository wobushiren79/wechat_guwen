var platformHttp = require("../../../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../../../utils/ToastUtil.js");
var content;
Page({
  data: {
    second: 60,
    selected: false,
    selected1: true,

    value1: '殡仪服務',
    value2: "公墓服務",
    logo_src: "/images/logo.png",
    systemType: 2,
    value3: '',
    value4: ''
  },
  onLoad: function () {
    content = this;
  },
  phoneData: function (e) {
    if (e.detail.value.mobile == "") {
      toastUtil.showToast("手机号不能为空");
      return
    }
    sendSmsCode(e.detail.value.mobile)
  },
  formSubmit: function (e) {
    if (e.detail.value.keys == '') {
      toastUtil.showToast("新密码不能为空");
      return;
    }
    if (e.detail.value.mobile == '') {
      toastUtil.showToast("手机号不能为空");
      return;
    }
    if (e.detail.value.msgCode == '') {
      toastUtil.showToast("验证码不能为空");
      return;
    }
    changeForPassWord(e.detail.value.keys, e.detail.value.mobile, e.detail.value.msgCode);
  }



})

/**
 * 修改密码
 */
function changeForPassWord(newPwd, mobile, smsCode) {
  var changeRequest = {
    keys: newPwd,
    mobile: mobile,
    msgCode: smsCode
  }
  var changeCallBack = {
    success: function (data, res) {
      wx.showModal({
        title: '重置密码提示',
        content: '重置密码成功',
        showCancel: false,
        success: function (o) {
          if (o.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    },
    fail: function (data, res) {
      toastUtil.showToast(data);
    }
  }
  platformHttp.changeForPassWord(changeRequest, changeCallBack);
}

/**
 * 发送短信
 */
function sendSmsCode(mobile) {
  var sendReuqest = {
    mobile: mobile
  }
  var sendCallBack = {
    success: function (data, res) {
      content.setData({
        selected: true,
        selected1: false,
        xianshi: true,
        second: 60,
      })
      countdown();
      toastUtil.showToast("发送成功");
    },
    fail: function (data, res) {
      toastUtil.showToast(data);
    }
  }
  platformHttp.changeForPassWord(sendReuqest, sendCallBack);
}

function countdown() {
  var second = content.data.second;
  if (second == 0) {
    content.setData({
      selected: false,
      selected1: true,
      second: 60,
    });
    return;
  }
  var time = setTimeout(function () {
    content.setData({
      second: second - 1
    });
    countdown(content);
  }
    , 1000)
}
