// pages/platform/user_info/user_info.js
var toastUtil = require("../../../utils/ToastUtil.js");
var fileUploadUtil = require("../../../utils/http/RequestForFile.js");
var platformHttp = require("../../../utils/http/RequestForPlatform.js");
var storageKey = require("../../../utils/storage/StorageKey.js");
var formValideTool = require('../../../utils/formValidateTool.js');
var content;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		//   性别
		genderArray: [
			{ index: 0, txt: '-未选择-', code: 'unselect', isCheck: true },
			{ index: 1, txt: '男', code: 'male', isCheck: false },
			{ index: 2, txt: '女', code: 'female', isCheck: false },
			{ index: 3, txt: '保密', code: 'secret', isCheck: false }
		],
		genderIndex: 0,
		genderCode: null,
		//   genderTxt: "-未选择-",
		//   genderChosing: false,
		//   itemChosing: false,
		//   圆梦师
		//   dreamMasterSeeing: false,
		dreamMasterClassKey: "dreamMaster",
		isDreamMaster: false,
		dreamMasterClass: null,
		dreamerAuthImgUrl: null,
		//   身份证-正反面
		isIdCardAuth: false,
		idCardPositiveKey: "positive",
		idCardPositiveImgUrl: null,
		idCardPositiveImgTmpPath: null,
		idCardSideKey: "side",
		idCardSideImgUrl: null,
		idCardSideImgTmpPath: null,
		//  用户信息
		userId: null,
		userBaseInfoObj: null,
		userExtraInfoObj: null,
		isFormContentSub: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		content = this;
		var userIdValue = wx.getStorageSync(storageKey.PLATFORM_USER_ID);
		content.setData({ userId: userIdValue });
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		// 用户信息-基础
		queryUserInfoForBase();
		// 用户信息 - 附加
		queryUserInfoForExtra();
		// 用户级别-圆梦师
		queryUserLevelForDreamer();
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},
	/**
	 * 性别-可选（停用）
	 */
	genderChanging: function () {
		content.setData({
			genderChosing: true,
			itemChosing: true
		});
	},
	/**
	 * 性别2-选中（停用）
	 */
	genderSelect: function (e) {
		var code = e.detail.value;
		var genders = content.data.genderArray;
		var txt = null;
		for (var i in genders) {
			var obj = genders[i];
			if (code != obj.code) {
				continue;
			} else if (code == obj.code) {
				txt = obj.txt;
				break;
			}
		}
		if (code == 'unselect') {
			code = null;
		}
		content.setData({
			genderCode: code,
			genderTxt: txt,
			genderChosing: false,
			itemChosing: false
		});
	},
	/**
	 * 性别3-返回（停用）
	 */
	genderBack: function () {
		content.setData({
			genderChosing: false,
			itemChosing: false
		});
	},
	/**
	 * 性别
	 */
	genderChange: function (e) {
		var index = parseInt(e.detail.value);
		var item = content.data.genderArray[index];
		var code = item.code;
		if (index == 0) {
			code = null;
		}

		content.setData({
			genderIndex: index,
			genderCode: code
		});
	},
	/**
	 * 身份证-认证查看
	 */
	idCardSee: function () {
		var cardAuth= content.data.isIdCardAuth;
		var userName= content.data.userBaseInfoObj.name;
		var cardNumber= content.data.userExtraInfoObj.identityCardNumber;
		var pagePath = "/pages/platform/user_info_idcard/user_info_idcard";
		if (!cardAuth) {
			toastUtil.showToast('证件未审核');
			return;
		}
		//   参数1
		var params = "?userName=";
		// params += "小朋友";
		params += userName;
		//   参数2
		params += "&cardNo=";
		// params += "510015201801016622";
		params += cardNumber;

		pagePath += params;

		wx.navigateTo({
			url: pagePath
		});
	},
	/**
	 * 圆梦师-查看
	 */
	dreamMasterSee: function () {
		//   content.setData({
		// 	  dreamMasterSeeing: false,
		// 	  itemChosing: false
		//   });
		var isDreamMaster = content.data.isDreamMaster;
		var dreamerImgUrl = content.data.dreamerAuthImgUrl;
		var pagePath = "/pages/platform/user_info_dreamer/user_info_dreamer";
		if (!isDreamMaster) {
			toastUtil.showToast('你不是圆梦师');
			return;
		} else if (dreamerImgUrl == null || dreamerImgUrl.length == 0) {
			toastUtil.showToast('证书未匹配');
			return;
		}
		//   参数1
		var params = "?dreamerImgUrl=";
		// params += "/images/succeed.png";		
		params += dreamerImgUrl;

		pagePath += params;
		wx.navigateTo({
			url: pagePath
		});
	},
	/**
	 * 圆梦师2-返回
	 */
	dreamMasterBack: function () {
		content.setData({
			dreamMasterSeeing: false,
			itemChosing: false
		});
	},
	/**
	 * 身份证照片-删除
	 */
	deleImg: function (e) {
		var obj = e.target.dataset;
		var imgPos = obj.imgpos;
		content.deleCardItemTemp(imgPos);
	},
	deleCardItemTemp: function (imgPos) {
		var positiveKey = content.data.idCardPositiveKey;
		var cardSideKey = content.data.idCardSideKey;
		var objData = {};
		if (imgPos == positiveKey) {
			objData.idCardPositiveImgUrl = null;
			objData.idCardPositiveImgTmpPath = null;
		} else if (imgPos == cardSideKey) {
			objData.idCardSideImgUrl = null;
			objData.idCardSideImgTmpPath = null;
		}
		content.setData(objData);
	},
	/**
	 * 身份证照片-获取
	 */
	choseImg: function (e) {
		var obj = e.target.dataset;
		var imgPos = obj.imgpos;
		var objParams = {
			count: 1,
			sizeType: ['original'],
			sourceType: ['camera'],
			success: function (res) {
				var tempFilePaths = res.tempFilePaths;
				if (tempFilePaths == null || tempFilePaths.length != 1) {
					toastUtil.showToast('请重试');
				}
				content.fileUpload(imgPos, tempFilePaths[0]);
			},
			fail: function (res) {
				toastUtil.showToast('请重试');
			}
		};
		wx.chooseImage(objParams);
	},
	/**
	 * 文件-上传
	 */
	fileUpload: function (imgPos, tempFilePath) {
		var fileNamePrefix = getApp().globalData.uploadFileNamePrefix;
		wx.showLoading({
			title: '上传中...',
			mask: true
		});
		var respObj = {
			success: function (data, resp) {
				var respData = JSON.parse(resp.data);
				content.fileUploadSucc(imgPos, tempFilePath, fileNamePrefix, respData);
			},
			fail: function (data, res) {
				wx.hideLoading();
				var msg = '上传失败';
				toastUtil.showToast(msg);

				content.deleCardItemTemp(imgPos);
			}
		};
		fileUploadUtil.uploadFileByQiniu(tempFilePath, fileNamePrefix, respObj);
	},
	fileUploadSucc: function (imgPos, tempFilePath, fileNamePrefix, respData) {
		wx.hideLoading();
		if (respData.code != 1000) {
			var msg = '上传失败';
			toastUtil.showToast(msg);
			return;
		}
		var remoteFilePath = respData.content.nameMap[fileNamePrefix];

		var positiveKey = content.data.idCardPositiveKey;
		var cardSideKey = content.data.idCardSideKey;
		var objData = {};
		if (imgPos == positiveKey) {
			objData.idCardPositiveImgUrl= remoteFilePath;
			objData.idCardPositiveImgTmpPath= tempFilePath;			
		} else if (imgPos == cardSideKey) {
			objData.idCardSideImgUrl= remoteFilePath;
			objData.idCardSideImgTmpPath= tempFilePath;
		}
		content.setData(objData);
	},
	formDataRequireWire: function () {
		var requireFormData = [];
		requireFormData.push(formValideTool.formValideWireObj('name', '姓名,未填入'));
		requireFormData.push(formValideTool.formValideWireObj('gender', '性别,未选择'));
		requireFormData.push(formValideTool.formValideWireObj('email', '电子邮箱未填入'));
		return requireFormData;
	},
	formSub: function (e) {
		var formDataObj = e.detail.value;

		var userId = content.data.userId;
		var genderCode = content.data.genderCode;
		var cardAuth = content.data.isIdCardAuth;
		var cardPositiveImgUrl = content.data.idCardPositiveImgUrl;
		var cardSideImgUrl = content.data.idCardSideImgUrl;

		formDataObj.userId = userId;
		formDataObj.gender = genderCode;
		formDataObj.identityCardFacadePic = cardPositiveImgUrl;
		formDataObj.identityCardObversePic = cardSideImgUrl;

		var formDataRequire = content.formDataRequireWire();
		if (!cardAuth) {
			formDataRequire.push(formValideTool.formValideWireObj('identityCardNumber', '证件号未填入'));
			formDataRequire.push(formValideTool.formValideWireObj('identityCardFacadePic', '证件正面未上传'));
			formDataRequire.push(formValideTool.formValideWireObj('identityCardObversePic', '证件反面未上传'));
		}
		var isFill = formValideTool.formValideRequireData(formDataObj, formDataRequire);
		if (!isFill) {
			return;
		}
		var cardNumber = formDataObj.identityCardNumber;
		if (cardNumber.length != 18 && cardNumber.length != 15) {
			toastUtil.showToast('证件号不正确');
			return;
		}

		content.setData({ isFormContentSub: true });
		var callBack = {
			success: function (data, res) {
				wx.hideLoading();
				toastUtil.showToastReWrite('操作成功', null, function () {
					setTimeout(function () {
						wx.navigateBack({
							delta: 1
						});
					}, 500);
				}, 'success');
			},
			fail: function (data, res) {
				wx.hideLoading();
				content.setData({ isFormContentSub: false });
				toastUtil.showToastReWrite('提交失败', 'icon_info');
			}
		};
		wx.showLoading({
			title: '提交中...',
			mask: true
		});
		platformHttp.storeUserInfoForExtraByUserId(formDataObj, callBack);
	}
});
/**
 * 图片路径前缀
 */
function imgUrlPrefixHandle(imgUrl) {
	var fileRemotePrefix = getApp().globalData.qiniuFilePathPrefix;
	if (imgUrl == null || imgUrl.length == 0) {
		return null;
	}
	if (imgUrl.indexOf("http://") == -1) {
		imgUrl = fileRemotePrefix.concat(imgUrl);
	}
	return imgUrl;
}

/**
 * 用户信息-基础
 */
function queryUserInfoForBase() {
	var userId = content.data.userId;
	var params = {};
	params.userId = userId;
	var callBack = {
		success: function (data, res) {
			content.setData({
				userBaseInfoObj: data
			});
		},
		fail: function (data, res) {
			content.setData({
				userBaseInfoObj: null
			});
		}
	};
	platformHttp.queryUserInfoById(params, callBack);
}

/**
 * 用户信息 - 附加
 */
function queryUserInfoForExtra() {
	var userId = content.data.userId;
	var params = {};
	params.userId = userId;
	var callBack = {
		success: function (data, res) {
			queryUserInfoForExtraHandle(data);
		},
		fail: function (data, res) {
			content.setData({
				genderIndex: 0,
				genderCode: null,
				idCardPositiveImgUrl: null,
				idCardSideImgUrl: null,
				userExtraInfoObj: null
			});
		}
	};
	platformHttp.queryUserInfoForExtraByUserId(params, callBack);
}
/**
 * 用户附加信息--返回处理
 */
function queryUserInfoForExtraHandle(userExtraData) {
	var genderItems = content.data.genderArray;
	var positiveImgUrl = null;
	var positiveImgTemp = null;
	var sideImgUrl = null;
	var sideImgTemp = null;
	var dreamerImgUrl = null;
	var genderIndex = 0;
	var genderCode = null;
	var cardAuth = false;	
	if (userExtraData != null) {
		genderCode = userExtraData.gender;
// 图片前缀
		cardAuth = userExtraData.identityCardAuth;
		positiveImgUrl = userExtraData.identityCardFacadePic;
		positiveImgTemp = imgUrlPrefixHandle(positiveImgUrl);
		sideImgUrl = userExtraData.identityCardObversePic;
		sideImgTemp = imgUrlPrefixHandle(sideImgUrl);

		if (userExtraData.dreamerAuthImgUrl != null) {
			dreamerImgUrl = imgUrlPrefixHandle(userExtraData.dreamerAuthImgUrl);
		}
	}
	// 性别-集元素下标
	for (var i = 0; i < genderItems.length; i++) {
		var item = genderItems[i];
		if (genderCode == null) {
			break;
		} else if (genderCode == item.code) {
			genderIndex = i;
			break;
		}
	}
	content.setData({
		genderIndex: genderIndex,
		genderCode: genderCode,
		dreamerAuthImgUrl: dreamerImgUrl,
		isIdCardAuth: cardAuth,
		idCardPositiveImgUrl: positiveImgUrl,
		idCardPositiveImgTmpPath: positiveImgTemp,
		idCardSideImgUrl: sideImgUrl,
		idCardSideImgTmpPath: sideImgTemp,
		userExtraInfoObj: userExtraData
	});
}

/**
 * 查询用户级别-圆梦师
 */
function queryUserLevelForDreamer() {
	var userId = content.data.userId;
	var params = {};
	params.userIds = [userId];
	var callBack = {
		success: function (data, res) {
			queryUserLevelForDreamerHandle(data.resultList);
		},
		fail: function (data, res) {
			content.setData({
				isDreamMaster: false
			});
		}
	};
	platformHttp.queryUserLevel(params, callBack);
}
/**
 * 查询用户级别-圆梦师--返回处理
 */
function queryUserLevelForDreamerHandle(userLevelData) {
	var isDreamMaster = false;
	var dreamMasterClass = "";
	if (userLevelData != null && userLevelData.length != 0) {
		var classKey = content.data.dreamMasterClassKey;
		for (var i in userLevelData) {
			var levelObj = userLevelData[i];
			if (levelObj == null || levelObj.systemLevel == null ||
				classKey != levelObj.systemLevel.levelType) {
				continue;
			} else if (levelObj.systemLevel.levelType == classKey) {
				dreamMasterClass = levelObj.systemLevel.levelName + "级";
				isDreamMaster = true;
				break;
			}
		}
	}
	content.setData({
		isDreamMaster: isDreamMaster,
		dreamMasterClass: dreamMasterClass
	});
}