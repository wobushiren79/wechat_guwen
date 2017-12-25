
//手机号码验证
function checkMobile(input) {
  if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(input))) {
    return false;
  } else {
    return true;
  }
}

//判断字符串是否为数字
function checkRate(input) {
  var re = /^[0-9]+.?[0-9]*$/;
  if (!re.test(input)) {
    return false;
  }
  return true;
}

//判断字符串是否为正整数
function checkIntNumber(input) {
  if (!(/(^[1-9]\d*$)/.test(num))) {
    return false;
  } else {
    return true;
  }
}


//判断字符串是否为价格
function checkMoney(input) {
  var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
  if (reg.test(input)) {
    return true;
  } else {
    return false;
  }
}

module.exports.checkMobile = checkMobile;
module.exports.checkRate = checkRate;
module.exports.checkIntNumber = checkIntNumber;
module.exports.checkMoney = checkMoney;