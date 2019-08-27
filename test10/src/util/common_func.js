import Taro from '@tarojs/taro';
import { update, addFavList } from '../actions/counter'
// import { useDispatch } from '@tarojs/redux'

import { SERVER_HOST, STORAGE_KEY_LOGIN, STORAGE_VALUE_LOGIN_SUCCESS, STORAGE_KEY_USER_ID } from './const'

import { ErrorStringArray, ErrorCode_UnknownError, ErrorCode_OK, ErrorCode_NotLogin } from './error_code'

export const CommonFunc = {
  getErrorString: function(error_id) {
    for (var i = 0; i < ErrorStringArray.length; i++) {
      if (ErrorStringArray[i][0] === error_id) {
        return ErrorStringArray[i][1]
      }
    }
    return '错误!'
  },

  setInterval: function(callback) {
    const timeId = setInterval(() => {
        callback()
        clearInterval(timeId)
    }, 1000);
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
        Taro.setStorageSync({
            key: STORAGE_KEY_USER_ID,
            data: uid,
        })
        let uid2 = Taro.getStorageSync(STORAGE_KEY_USER_ID)

        console.error('saveLoginStorage: uid: ' + uid)
        console.error('saveLoginStorage: uid2: ' + uid2)
        console.error(CommonFunc.getLoginedInfoSync())
        resolve(res)
      }).catch(error => {
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
    }).then({
    }).catch(error => {
      console.error('cant logout on server!')
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

  // should called after logined
  getUserFavList: function() {
    const promise = new Promise(function(resolve, reject) {
      let url = (SERVER_HOST + '/gfl' + '?etype=' + CommonFunc.getTaroEnv())
      if (CommonFunc.getTaroEnv() === 'weapp') {
        // FIXME
        url += '&uid=' + CommonFunc.getLoginedInfoSync()
      }
      Taro.request({
        url: url,
        credentials: 'include', // request with cookies etc.
      }).then(res => {
        if (CommonFunc.isNotLogin(res.data.ret)) {
          console.log('getUserFavList-1, fail, not login')
          // CommonFunc.openLoginPage()
          return Promise.reject({error: 'not login'})
        }
        if (!CommonFunc.isSuccess(res.data.ret)) {
          return Promise.reject({error: 'get favorite list error!'})
        }
        console.log('getUserFavList, success, data: '
                + res.data.data)
        resolve(res.data.data)
        // const dispatch = useDispatch()
        // dispatch(update(res.data))
      }).catch(error => {
        console.log('getUserFavList, error: ' + error)
        // resolve even if error
        resolve([])
      })
    })

    return promise
  },

  // res.data.ret : return code
  // res.data.userid : return user id
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
        console.error('login, save login storage success, res: ' + res)
        console.error(res)
        Taro.navigateBack();
        return CommonFunc.getUserFavList()
      }).then(res => {
        // res => rhFavList
        console.log('login, update user fav list success, will navigateBack')
        // FIMXE, rhFavList is forward to login page to update rhFavList on redux's store
        // because h5 do not support dispatch's calling from user
        resolve(res)
      }).catch(error => {
        reject(error)
        console.log('login, error: ' + error)
      })
    })

    return promise
  },

  // for weixin test
  loginForWeixin: function(unionid) {
    const promise = new Promise(function(resolve, reject) {
      Taro.login().then(res => {
        if (!res.code) {
          return Promise.reject({errorCode: ErrorCode_CantGetWeixinCode})
        }
        console.log('登录成功！' + res.code)
        //发起网络请求
        return Taro.request({
          url: SERVER_HOST + '/weixinlogin?code=' + res.code,
          data: {
            code: res.code
          },
          credentials: 'include', // request with cookies etc.
        })
      /*
      }).then(res => {
        Taro.request({
          url: SERVER_HOST + '/weixinlogin_test?unionid=' + unionid,
          credentials: 'include', // request with cookies etc.
      */
      }).then(res => {
        console.log('loginForWeixin, success!')
        console.log(res)
        return CommonFunc.onLoginSuccess(res)
      }).then(res => {
          // res => rhFavList
          console.log('login, update user fav list success, will navigateBack')
          // FIMXE, rhFavList is forward to login page to update rhFavList on redux's store
          // because h5 do not support dispatch's calling from user
          resolve(res)
      }).catch(error => {
          console.log('loginForWeixin')
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
          console.log('login, update user fav list success, will navigateBack')
          // FIMXE, rhFavList is forward to login page to update rhFavList on redux's store
          // because h5 do not support dispatch's calling from user
          resolve(res)
      }).catch(error => {
          reject(error)
          console.log('login, error: ' + error)
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

          CommonFunc.setInterval(() => {
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
    console.error('requestRhList: prov: '
        + prov + ', city: ' + city)
    let addedUrl = (prov.length > 0) ? ('?prov=' + prov) : ''
    if(city.length > 0) {
      addedUrl = addedUrl + (addedUrl.length > 0 ? '&' : '?') + 'city=' + city
    }

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

    console.error('requestRhList: url: ' + url)
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
      return Taro.request({
        url: SERVER_HOST + '/registerUser?username=' + username + "&password=" + password,
        credentials: 'include', // request with cookies etc.
      }).then(res => {
        Taro.showToast({title: CommonFunc.getErrorString(res.data.ret)})
        if (!CommonFunc.isSuccess(res.data.ret)) {
          return Promise.reject({error: 'register failed!'})
        }
        resolve(res)
        CommonFunc.setInterval(() => {
          Taro.navigateBack()
        })
      }).catch(error => {
        reject(error)
      })
    })

    return promise
  },


  requestCityData: function(prov) {
    let url = SERVER_HOST + '/arealist' + ((prov.length > 0) ? ("?prov=" + prov) : "")
    return Taro.request({
      url: url,
    })
  },

  checkUsername: function(username) {
    if (username.length === 0) {
      Taro.showToast({title: '请输入用户名！'})
      return false
    }
    return true
  },

  checkPassword: function(password) {
    if (password.length === 0) {
      Taro.showToast({title: '请输入密码！'})
      return false
    }

    if (!CommonFunc.checkPasswd(password)) {
      Taro.showToast({title: '密码复杂度不够，请重新设置！'})
      return false
    }
    return true
  },

  checkPassword2: function(password, password2) {
    if (password.length === 0) {
      Taro.showToast({title: '请输入密码！'})
      return false
    }
    if (password2.length === 0) {
      Taro.showToast({title: '请再次输入密码！'})
      return false
    }
    if (password != password2) {
      Taro.showToast({title: '两次输入密码不一致！'})
      return false;
    }
    if (!CommonFunc.checkPasswd(password)) {
      Taro.showToast({title: '密码复杂度不够，请重新设置！'})
      return false
    }
    return true;
  },

  checkPasswd: function(passwd) {
    /* FIXME
    if(passwd.length < 6) {
      return false
    }
    var ls = 0;
    if (passwd.match(/([a-z])+/)) {
      ls++;
    }
    if (passwd.match(/([0-9])+/)) {
      ls++;  
    }
    if (passwd.match(/([A-Z])+/)) {
      ls++;
    }
    if (passwd.match(/[^a-zA-Z0-9]+/)) {
       ls++;
    }
    */
    return true
  },

  getCurrCity: function() {
    const promise = new Promise(function(resolve, reject) {
      Taro.getLocation().then(res => {
          console.log("Taro.getLocation(), success, latitude: "
              + res.latitude + ', longitude: ' + res.longitude)
          return CommonFunc.getCurrCityImpl(res.longitude, res.latitude)
        }).then(res => {
          if (res.data.province.length <= 0
              || res.data.city.length <= 0) {
            return
          }
          console.log("CommonFunc.getCurrCity, province: "
              + res.data.province + ", city: " + res.data.city)
          resolve(res)
        }).catch(error => {
          console.error("getCurrCity, error")
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
        if (CommonFunc.isArray(city)) {
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

  isInstanceOf: function(thisVar, varType) {
    return Object.prototype.toString.call(thisVar)
            === "[object " + varType + "]"
  },

  isString: function(thisVar) {
    return CommonFunc.isInstanceOf(thisVar, 'String')
  },

  isArray: function(thisVar) {
    return CommonFunc.isInstanceOf(thisVar, 'Array')
  },
}
