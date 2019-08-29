import Taro from '@tarojs/taro';
import { update, addFavList } from '../actions/counter'
// import { useDispatch } from '@tarojs/redux'

import { SERVER_HOST, STORAGE_KEY_LOGIN, STORAGE_VALUE_LOGIN_SUCCESS, STORAGE_KEY_USER_ID } from './const'

import { ErrorStringArray, ErrorCode_UnknownError, ErrorCode_OK, ErrorCode_NotLogin } from './error_code'

import { Util } from './util'

export const CommonFunc = {
  getErrorString: function(error_id) {
    for (var i = 0; i < ErrorStringArray.length; i++) {
      if (ErrorStringArray[i][0] === error_id) {
        return ErrorStringArray[i][1]
      }
    }
    return '错误!'
  },

  isSuccess: function(error_id) {
    return ErrorCode_OK === error_id
  },

  isNotLogin: function(error_id) {
    return ErrorCode_NotLogin === error_id
  },

  // success: userid
  getLoginedInfoSync: function() {
    return Taro.getStorageSync(STORAGE_KEY_USER_ID)
  },

  // success: userid
  getLoginedInfo: function() {
    const promise = new Promise(function(resolve, reject) {
      Taro.getStorage({ key: STORAGE_KEY_LOGIN })
        .then(res => {
          return Taro.getStorage({ key: STORAGE_KEY_USER_ID })
        }).then(res => {
          console.log('getLoginedInfo-getStorage(STORAGE_KEY_USER_ID), success, userid: ' + res.data)
          resolve({
            userid: res.data,
          })
        }).catch(error => {
          console.log('getLoginedInfo-, not login: ')
          reject({errorCode: ErrorCode_NotLogin})
        })
    })
    return promise
  },

  saveLoginStorage: function(uid) {
    const promise = new Promise(function(resolve, reject) {
      Taro.setStorage({
          key: STORAGE_KEY_LOGIN,
          data: STORAGE_VALUE_LOGIN_SUCCESS,
      }).then(res => {
        return Taro.setStorage({
            key: STORAGE_KEY_USER_ID,
            data: uid,
        })
      }).then(res => {
/*FIXME
        Taro.setStorageSync({
            key: STORAGE_KEY_USER_ID,
            data: uid,
        })
*/
        console.log('saveLoginStorage: uid: ' + uid)
        resolve(res)
      }).catch(error => {
        console.log('saveLoginStorage: error: ' + error)
        reject(error)
      })
    })
    return promise
  },

  clearLoginStorage: function() {
    Taro.removeStorage({ key: STORAGE_KEY_LOGIN })
    Taro.removeStorage({ key: STORAGE_KEY_USER_ID })
  },

  logout: function() {
    Taro.request({
        url: SERVER_HOST + '/logout',
        credentials: 'include', // request with cookies etc.
    }).then(res => {
      console.log('logout success on server!')
    }).catch(error => {
      console.error('logout fail on server!')
      console.error(error)
    })

    const promise = new Promise(function(resolve, reject) {
      CommonFunc.clearLoginStorage()
      resolve({ret: ErrorCode_OK})
    })
    return promise
  },

  getTaroEnv: function() {
    return process.env.TARO_ENV
    // return 'weapp'
  },

  isTaroEnvH5: function() {
    return process.env.TARO_ENV === 'h5'
    // return 'weapp'
  },

  // should called after logined
  getUserFavList: function() {
    const promise = new Promise(function(resolve, reject) {
      let url = (SERVER_HOST + '/gfl' + '?etype=' + CommonFunc.getTaroEnv())
      if (CommonFunc.getTaroEnv() === 'weapp') {
        // FIXME
        url += '&uid=' + CommonFunc.getLoginedInfoSync()
      }
      console.log('getUserFavList: url: ' + url)
      Taro.request({
        url: url,
        credentials: 'include', // request with cookies etc.
      }).then(res => {
        if (CommonFunc.isNotLogin(res.data.ret)) {
          console.error('getUserFavList, fail, not login')
          // CommonFunc.openLoginPage()
          return Promise.reject({errorCode: res.data.ret})
        }
        if (!CommonFunc.isSuccess(res.data.ret)) {
          console.error('getUserFavList, fail, error: '
              + CommonFunc.getErrorString(res.data.ret))
          return Promise.reject({errorCode: res.data.ret})
        }
        console.log('getUserFavList, success, data: ' + res.data.data)
        if (!Util.isArray(res.data.data)) {
          console.error('getUserFavList, data is not array')
          return Promise.reject({errorCode: ErrorCode_NOK})
        }
        resolve(res.data.data)
        // const dispatch = useDispatch()
        // dispatch(update(res.data))
      }).catch(error => {
        console.error('getUserFavList, error: ' + error)
        // resolve even if error
        resolve([])
      })
    })

    return promise
  },

  // res.data.ret : return code
  // res.data.userid : return user id
  // return:
  //        res: rhFavList on success
  onLoginSuccess: function(res) {
    const promise = new Promise(function(resolve, reject) {
      console.log('onLoginSuccess ret: ' + CommonFunc.getErrorString(res.data.ret))
      console.log('onLoginSuccess uid: ' + res.data.userid)
      Taro.showToast({title: CommonFunc.getErrorString(res.data.ret)})
      if (!CommonFunc.isSuccess(res.data.ret)) {
        let error_msg = CommonFunc.getErrorString(res.data.ret)
        Taro.showToast({title: error_msg})
        return reject({errorCode: res.data.ret})
      }
      CommonFunc.saveLoginStorage(res.data.userid).then(res => {
        console.log('onLoginSuccess, save login storage success, res: ' + res)
        return CommonFunc.getUserFavList()
      }).then(res => {
        // res => rhFavList
        console.log('onLoginSuccess, update user fav list success!')
        // FIMXE, rhFavList is forward to login page to update rhFavList on redux's store
        // because h5 do not support dispatch's calling from user
        resolve(res)
        Taro.navigateBack();
      }).catch(error => {
        console.log('onLoginSuccess, error: ' + error)
        reject(error)
      })
    })

    return promise
  },

  // for weixin test
  loginForWeixin: function() {
    let rhFavList = []
    const promise = new Promise(function(resolve, reject) {
        console.log('loginForWeixin, start!')
      Taro.login().then(res => {
        if (!res.code) {
          return Promise.reject({errorCode: ErrorCode_CantGetWeixinCode})
        }
        console.log('登录成功！' + res.code)
        return Taro.request({
          url: SERVER_HOST + '/weixinlogin?code=' + res.code,
          data: {
            code: res.code
          },
          credentials: 'include', // request with cookies etc.
        })
      }).then(res => {
        console.log('loginForWeixin, success!')
        return CommonFunc.onLoginSuccess(res)
      }).then(res => {
          // res => rhFavList
          console.log('loginForWeixin update local info success!')
      /* FIXME
          rhFavList = res
          return CommonFunc.getUserInfo()
      }).then(res => {
      */
          // FIXME, rhFavList is forward to login page to update rhFavList on redux's store
          // because h5 do not support dispatch's calling from user
          resolve({
            rhFavList: res,
            // userInfo: res.userInfo
          })
      }).catch(error => {
          console.log('loginForWeixin fail, error:')
          console.log(error)
          reject(error)
      })
    })

    return promise
  },

  login: function(username, password) {
    const promise = new Promise(function(resolve, reject) {
      Taro.request({
        url: SERVER_HOST + '/login?username=' + username + "&password=" + password,
        credentials: 'include', // request with cookies etc.
      }).then(res => {
        return CommonFunc.onLoginSuccess(res)
      }).then(res => {
          // res => rhFavList
          console.log('login, onLoginSuccess success')
          // FIMXE, rhFavList is forward to login page to update rhFavList on redux's store
          // because h5 do not support dispatch's calling from user
          resolve(res)
      }).catch(error => {
          console.log('login, error: ' + error)
          reject(error)
      })
    })

    return promise
  },

  changeFav: function(userId, rhId, isFavorite) {
    let logined_userid = 0
    const promise = new Promise(function(resolve, reject) {
      let url = (SERVER_HOST + '/cf?uid=' + userId
            + '&rhId=' + rhId
            + '&f=' + (isFavorite?'t':'f')
            + '&etype=' + CommonFunc.getTaroEnv())
      console.log('changeFav, url: ' + url)
      Taro.request({
        url: url,
        credentials: 'include', // request with cookies etc.
        // method: 'POST',
      }).then(res => {
          console.log('changeFav, success: ' + res.data.ret)
          if (!CommonFunc.isSuccess(res.data.ret)) {
            let error_msg = CommonFunc.getErrorString(res.data.ret)
            console.log('changeFav, error: ' + error_msg)
            Taro.showToast({title: error_msg})
            return Promise.reject({errorCode: res.data.ret})
          }
          console.log('changeFav, success')
          resolve(res)
      }).catch(error => {
          console.log('changeFav, error: ' + error)
          reject(error)
      })
    })

    return promise
  },

  onFavorite: function(rhId, isFavorite, e) {
    e.stopPropagation()
    const promise = new Promise(function(resolve, reject) {
      CommonFunc.getLoginedInfo().then(res => {
        console.log('onFavorite-1, get login info success, res: ' + res.username)
        return CommonFunc.changeFav(res.userid, rhId, isFavorite)
      }).then(res => {
        console.log('onFavorite-2, res: ' + res)
        resolve(res)
      }).catch(error => {
        console.log('onFavorite-3, fail, error: ' + error)
        if (error.errorCode === ErrorCode_NotLogin) {
          console.log('onFavorite-3, fail, not login')
          Taro.showToast({title: '请先登录！'})
          Util.setInterval(() => {
            CommonFunc.clearLoginStorage()
            CommonFunc.openLoginPage()
          })
        }
        reject(error)
      })
    })
    return promise
  },

  openLoginPage: function() {
    Taro.navigateTo({
      url: '/pages/login/login',
    })
  },

  requestRhListWithCityInfo: function(prov, city) {
    let addedUrl = (prov.length > 0) ? ('?prov=' + prov) : ''
    if(city.length > 0) {
      addedUrl = addedUrl + (addedUrl.length > 0 ? '&' : '?') + 'city=' + city
    }
    console.log('requestRhList: url: ' + addedUrl)

    Taro.navigateTo({
      url: '/pages/index/index' + addedUrl,
    })
  },

  requestRhList: function(addedUrl) {
    let url = SERVER_HOST + '/show_rh_list'
              + addedUrl
              + ((addedUrl.length > 0) ? '&' : '?')
              + 'etype=' + CommonFunc.getTaroEnv()
    if (CommonFunc.getTaroEnv() === 'weapp') {
      // FIXME
      url += ('&uid=' + CommonFunc.getLoginedInfoSync())
    }

    console.log('requestRhList: url: ' + url)
    return Taro.request({
      url: url,
      credentials: 'include', // request with cookies etc.
    })
  },

  requestRhDetail: function(rhId) {
    return Taro.request({
      url: SERVER_HOST + '/get_rh_detail?rhid=' + String(rhId),
      credentials: 'include', // request with cookies etc.
    })
  },

  registerUser: function(username, password) {
    const promise = new Promise(function(resolve, reject) {
      let url = SERVER_HOST + '/registerUser?username=' + username + "&password=" + password
      console.log('registerUser: url: ' + url)
      return Taro.request({
        url: url,
        credentials: 'include', // request with cookies etc.
      }).then(res => {
        Taro.showToast({title: CommonFunc.getErrorString(res.data.ret)})
        if (!CommonFunc.isSuccess(res.data.ret)) {
          return Promise.reject({error: 'register failed!'})
        }
        Util.setInterval(() => {
          Taro.navigateBack()
        })
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })

    return promise
  },

  requestCityData: function(prov) {
    let url = SERVER_HOST + '/arealist' + ((prov.length > 0) ? ("?prov=" + prov) : "")
    console.log('requestCityData: url: ' + url)
    return Taro.request({
      url: url,
    })
  },

  getCurrCityInternal: function() {
    const promise = new Promise(function(resolve, reject) {
      Taro.getLocation().then(res => {
          console.log("getCurrCityInternal, Taro.getLocation() success, latitude: "
              + res.latitude + ', longitude: ' + res.longitude)
          return CommonFunc.getCurrCityImpl(res.longitude, res.latitude)
        }).then(res => {
          if (res.data.province.length <= 0
              || res.data.city.length <= 0) {
            return Promise.reject(res)
          }
          console.log("getCurrCityInternal, province: "
              + res.data.province + ", city: " + res.data.city)
          resolve(res)
        }).catch(error => {
          console.error("getCurrCityInternal, error")
          reject(error)
        })
    })

    return promise
  },

  // @force: true, request authorize again even if user has
  //               denied this authorization ever
  //         false, do not request authorize again if user has
  //               denied this authorization ever
  getCurrCity: function(force) {
    if (!force) {
      const promise = new Promise(function(resolve, reject) {
        CommonFunc.getCurrCityInternal()
          .then(res => {
            resolve(res)
          }).catch(error => {
            console.error(error)
            reject(error)
          })
      })
      return promise
    }

    const promise = new Promise(function(resolve, reject) {
      Taro.openSetting()
        .then(res => {
          if (res.authSetting["scope.userLocation"] != true) {
            return Promise.reject(res)
          }
          return CommonFunc.getCurrCityInternal()
        }).then(res => {
          resolve(res)
        }).catch(error => {
          console.error(error)
          reject(error)
        })
    })

    return promise
  },

  getCurrCityImpl: function(longitude, latitude) {
    // web api of gao de map
    const promise = new Promise(function(resolve, reject) {
      let url = 'https://restapi.amap.com/v3/geocode/regeo?output=json&location='
        + longitude + ', ' + latitude
        + '&key=2b4bc515610655bb54dc9f979a6a857e&radius=1000&extensions=all'
      Taro.request({
          url: url,
          mode: 'cors',
      }).then(res => {
        console.log('getCurrCityImpl success! province: '
            + res.data.regeocode.addressComponent.province
            + ', city: ' + res.data.regeocode.addressComponent.city)
        let province = res.data.regeocode.addressComponent.province
        let city = res.data.regeocode.addressComponent.city
        if (Util.isArray(city)) {
          if (city.length <= 0 || city[0].length <= 0) {
            city = province
          } else {
            city = city[0]
          }
        }
        console.log('getCurrCityImpl success 2! province: '
            + province + ', city: ' + city)
        resolve({
          data: {
            province: province,
            city: city,
          },
        })
        return
      }).catch(error => {
        console.error('getCurrCityImpl error!')
        console.error(error)
        reject(error)
      })
    })

    return promise
  },

  // FIXME, To be deleted
  getUserInfo: function() {
    const promise = new Promise(function(resolve, reject) {
      Taro.getUserInfo().then(res => {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        console.log('getUserInfo success, '
            + ', nickName: ' + userInfo.nickName
            + ', avatarUrl: ' + userInfo.avatarUrl
            + ', gender: ' + userInfo.gender
            + ', country: ' + userInfo.country
            + ', province: ' + userInfo.province
            + ', city: ' + userInfo.city)
        resolve(res)
      }).catch(error => {
        console.error('getUserInfo error!')
        console.error(error)
        reject(error)
      })
      /*
      resolve({
        userInfo: {
          nickName: 'womenshi',
          avatarUrl: 'http://10.129.192.204/images/228/e7f83d4a04f3697ac8a3f347a6fa19fc.jpg',
          gender: '',
          province: '',
          province: '',
          city: '',
          country: '',
        },
      })
      */
    })

    return promise
  },

  requestDecryptPhoneNumber: function(iv, encryptedData) {
    const promise = new Promise(function(resolve, reject) {
      if (iv.length <= 0 || encryptedData.length <= 0) {
        return Promise.reject({errorCode: ErrorCode_NOK})
      }
      const uid = getLoginedInfoSync()
      const url = SERVER_HOST + '/dpn'
            + '?iv=' + iv + '&encryptedData=' + encryptedData
            + '?uid=' + uid
      console.log('requestDecryptPhoneNumber: url: ' + url)
      Taro.request({
        url: url,
      }).then(res => {
        console.log('requestDecryptPhoneNumber success, res: ' + res)
        resolve(res)
        return
      }).catch(error => {
        console.error('requestDecryptPhoneNumber error: ' + error)
        reject(error)
      })
    })

    return promise
  },
}
