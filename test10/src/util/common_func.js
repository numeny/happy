import Taro from '@tarojs/taro';
import { update, addFavList } from '../actions/counter'
// import { useDispatch } from '@tarojs/redux'

import { SERVER_HOST, STORAGE_KEY_LOGIN, STORAGE_VALUE_LOGIN_SUCCESS, STORAGE_KEY_USER_NAME, STORAGE_KEY_USER_ID } from './const'

import { ErrorStringArray, ErrorCode_UnknownError, ErrorCode_OK, ErrorCode_NotLogin } from './error_code'

export const CommonFunc = {

  getErrorString: function(error_id) {
    for (var i = 0; i < ErrorStringArray.length; i++) {
      if (ErrorStringArray[i][0] == error_id) {
        return ErrorStringArray[i][1]
      }
    }
    return '错误!'
  },

  setInterval: function(callback) {
    const timeId = setInterval(() => {
        callback()
        clearInterval(timeId)
    }, 1500);
  },
  
  isSuccess: function(error_id) {
    return ErrorCode_OK == error_id
  },

  isNotLogin: function(error_id) {
    return ErrorCode_NotLogin == error_id
  },

  // success: userid and username
  getLoginedInfo: function() {
    let logined_username = ''
    const promise = new Promise(function(resolve, reject) {
      Taro.getStorage({ key: STORAGE_KEY_LOGIN })
        .then(res => {
          console.log('getLoginedInfo-getStorage(STORAGE_KEY_LOGIN), success')
          return Taro.getStorage({ key: STORAGE_KEY_USER_NAME })
        }).then(res => {
          console.log('getLoginedInfo-getStorage(STORAGE_KEY_USER_NAME), success, username: ' + res.data)
          logined_username = res.data
          return Taro.getStorage({ key: STORAGE_KEY_USER_ID })
        }).then(res => {
          console.log('getLoginedInfo-getStorage(STORAGE_KEY_USER_NAME), success, userid: ' + res.data)
          resolve({
            userid: res.data,
            username: logined_username,
          })
        }).catch(error => {
          console.log('getLoginedInfo-, not login: ')
          reject({errorCode: ErrorCode_NotLogin})
        })
    })
    return promise
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
      Taro.removeStorage({ key: STORAGE_KEY_LOGIN })
        .then(res => {
          console.log('logout-remove-STORAGE_KEY_LOGIN, success')
          return Taro.removeStorage({ key: STORAGE_KEY_USER_NAME })
        }).then(res => {
          console.log('logout-remove-STORAGE_KEY_USER_NAME, success, res: ' + res)
          resolve({res: 'logout success'})
        }).catch(error => {
          console.log('logout-remove-STORAGE_KEY_USER_NAME, error: ' + error)
          reject({error: 'logout error'})
        })
    })
    return promise
  },

  updateLoginUserFavList: function() {
    const promise = new Promise(function(resolve, reject) {
      let url = (SERVER_HOST + '/gfl' + '?etype=' + process.env.TARO_ENV)
      if (process.env.TARO_ENV === 'weapp') {
        // FIXME
        url += '&openid=' + 'openid'
      }
      Taro.request({
        url: url,
        credentials: 'include', // request with cookies etc.
      }).then(res => {
        if (CommonFunc.isNotLogin(res.data.ret)) {
          console.log('updateLoginUserFavList-1, fail, not login')
          // CommonFunc.openLoginPage()
          return Promise.reject({error: 'not login'})
        }
        if (!CommonFunc.isSuccess(res.data.ret)) {
          return Promise.reject({error: 'get favorite list error!'})
        }
        console.log('updateLoginUserFavList, success, data: '
                + res.data.data)
        resolve(res.data.data)
        // const dispatch = useDispatch()
        // dispatch(update(res.data))
      }).catch(error => {
        console.log('updateLoginUserFavList, error: ' + error)
        // resolve even if error
        resolve([])
      })
    })

    return promise
  },

  login: function(username, password) {
    let logined_userid = 0
    let rhFavList = []
    const promise = new Promise(function(resolve, reject) {
      Taro.request({
        url: SERVER_HOST + '/login?username=' + username + "&password=" + password,
        credentials: 'include', // request with cookies etc.
      }).then(
        res => {
          console.log('login, Taro.request success ret: ' + CommonFunc.getErrorString(res.data.ret))
          // FIXME, delete it
          // if (DEBUG)
          Taro.showToast({title: CommonFunc.getErrorString(res.data.ret)})
          if (!CommonFunc.isSuccess(res.data.ret)) {
            let error_msg = CommonFunc.getErrorString(res.data.ret)
            Taro.showToast({title: error_msg})
            return Promise.reject({error: error_msg})
          }
          logined_userid = res.data.userid
      }).then(res => {
          return CommonFunc.updateLoginUserFavList()
      }).then(res => {
          rhFavList = res
          console.log('login, will setStorage(STORAGE_KEY_LOGIN), res: ' + res)
          console.log('login, will setStorage(STORAGE_KEY_LOGIN), username: '
              + username + ', userid: ' + logined_userid)
          // login success
          return Taro.setStorage({
              key: STORAGE_KEY_LOGIN,
              data: STORAGE_VALUE_LOGIN_SUCCESS,
          })
      }).then(res => {
        console.log('login, will setStorage(STORAGE_KEY_USER_NAME), res: '
            + res + ', username: ' + username)
        return Taro.setStorage({
            key: STORAGE_KEY_USER_NAME,
            data: username,
            // data: '',
        })
      }).then(res => {
        console.log('login, will setStorage(STORAGE_KEY_USER_ID), res: '
            + res + ', userid: ' + logined_userid)
        return Taro.setStorage({
            key: STORAGE_KEY_USER_ID,
            data: logined_userid,
        })
      }).then(res => {
          console.log('login, success, will navigateBack')
          // FIMXE, rhFavList is forward to login page to update rhFavList on redux's store
          // because h5 do not support dispatch's calling from user
          resolve(rhFavList)
          Taro.navigateBack();
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
            + '&etype=' + process.env.TARO_ENV)
      if (process.env.TARO_ENV === 'weapp') {
        // FIXME
        url += '&openid=' + 'openid'
      }
      console.log('changeFav, url: ' + url)
      Taro.request({
        url: (SERVER_HOST + '/cf?uid=' + userId
            + '&rhId=' + rhId
            + '&f=' + (isFavorite?'t':'f')
            + '&etype=' + process.env.TARO_ENV),
        credentials: 'include', // request with cookies etc.
        // method: 'POST',
      }).then(res => {
          console.log('changeFav, success: ' + res.data.ret)
          if (!CommonFunc.isSuccess(res.data.ret)) {
            let error_msg = CommonFunc.getErrorString(res.data.ret)
            console.log('changeFav, error: ' + error_msg)
            Taro.showToast({title: error_msg})
            return Promise.reject({error: error_msg})
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
        if (error.errorCode == ErrorCode_NotLogin) {
          console.log('onFavorite-3, fail, not login')
          Taro.showToast({title: '请先登录！'})

          CommonFunc.setInterval(() => {
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

    Taro.navigateTo({
      url: '/pages/index/index' + addedUrl,
    })
  },

  requestRhList: function(addedUrl) {
    return Taro.request({
      url: SERVER_HOST + '/show_rh_list' + addedUrl,
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
    if (username.length == 0) {
      Taro.showToast({title: '请输入用户名！'})
      return false
    }
    return true
  },

  checkPassword: function(password) {
    if (password.length == 0) {
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
    if (password.length == 0) {
      Taro.showToast({title: '请输入密码！'})
      return false
    }
    if (password2.length == 0) {
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
}
