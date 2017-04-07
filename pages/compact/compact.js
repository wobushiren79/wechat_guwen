//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    partyA: '姚财武',
    partyB: "四川世安生命文化有限责任公司",
    deadName: "姚财武",
    deadName: "姚财武",
    deadSex: "男",
    deadId: "1234567891234",
    deadAge: "32",
    deadStatus: "健康",
deadNum:"321",
agentmanName:"张三",
agentmanPhone:"13888888888",
agentmanId:"1234567891234",
agentmanAddress:"中国四川省成都是锦江区颈康路78号",
agentmanEamil:"123456789@qq.com",
agentmanLink:"父子",

address:"中国四川省成都是锦江区颈康路78号",

// 方案信息
plan1:"方案1",
plan2:"灵堂标准用品（标准版）",
plan3:"12312",
plan4:"代办火化",
plan5:"传统标准祭坛",
plan6:"传统鲜花",
plan7:"遗像与灵位",
plan8:"普通花圈",
money1:"3690.0",
money2:"123.0",
money3:"12334.0",
money4:"546.0",
name:"白事顾问XXX"
  },
  bindAgreeChange: function (e) {
        this.setData({
            isAgree: !!e.detail.value.length
        });
    },
  onLoad: function () {
    console.log('onLoad') 
  }

})
