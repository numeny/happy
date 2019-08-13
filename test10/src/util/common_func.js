import Taro from '@tarojs/taro';

import { SERVER_HOST, STORAGE_KEY_LOGIN, STORAGE_VALUE_LOGIN_SUCCESS, STORAGE_KEY_USER_NAME, STORAGE_KEY_USER_ID } from './const'

const ErrorCode_OK = 0
const ErrorCode_UnknownError = -9999
const ErrorCode_RhIdNotInput = -1
const ErrorCode_RhIdNoExist = -2

const ErrorCode_LoginUserName = -1000
const ErrorCode_LoginPassword = -1001
const ErrorCode_UserNotExisted = -1002
const ErrorCode_UserExisted = -1003
const ErrorCode_PasswordWrong = -1004
const ErrorCode_FailToRegisterUser = -1005

const ErrorStringArray = [
  [ErrorCode_OK, '成功!'],
  [ErrorCode_UnknownError, '错误！'],
  [ErrorCode_RhIdNotInput, '没有输入养老院ID！'],
  [ErrorCode_RhIdNoExist, '养老院不存在'],
  [ErrorCode_LoginUserName, '登录用户名错误！'],
  [ErrorCode_LoginPassword, '登录密码错误！'],
  [ErrorCode_UserNotExisted, '此用户不存在！'],
  [ErrorCode_UserExisted, '此用户已经存在！'],
  [ErrorCode_PasswordWrong, '密码错误！'],
  [ErrorCode_FailToRegisterUser, '注册用户失败！'],
]

export const CommonFunc = {

  getErrorString: function(error_id) {
    for (var i = 0; i < ErrorStringArray.length; i++) {
      if (ErrorStringArray[i][0] == error_id) {
        return ErrorStringArray[i][1]
      }
    }
    return ErrorStringArray[ErrorCode_UnknownError][1]
  },

  isLoginSuccess: function(error_id) {
    return ErrorCode_OK == error_id
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
          console.log('getLoginedInfo-, error: ' + error)
          console.log(error)
          reject(error)
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

  login: function(username, password) {
    let logined_userid = 0
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
          if (!CommonFunc.isLoginSuccess(res.data.ret)) {
            let error_msg = CommonFunc.getErrorString(res.data.ret)
            Taro.showToast({title: error_msg})
            return Promise.reject({error: error_msg})
          }
          logined_userid = res.data.userid
          console.log('login, will setStorage(STORAGE_KEY_LOGIN), username: ' + username + ', userid: ' + logined_userid)
          // login success
          return Taro.setStorage({
              key: STORAGE_KEY_LOGIN,
              data: STORAGE_VALUE_LOGIN_SUCCESS,
          })
      }).then(res => {
        console.log('login, will setStorage(STORAGE_KEY_USER_NAME), res: ' + res + ', username: ' + username)
        return Taro.setStorage({
            key: STORAGE_KEY_USER_NAME,
            data: username,
            // data: '',
        })
      }).then(res => {
        console.log('login, will setStorage(STORAGE_KEY_USER_ID), res: ' + res + ', userid: ' + logined_userid)
        return Taro.setStorage({
            key: STORAGE_KEY_USER_ID,
            data: logined_userid,
        })
      }).then(
        res => {
          console.log('login, success, will navigateBack')
          resolve(res)
          Taro.navigateBack();
      }).catch(error => {
          reject(error)
          console.log('login, error: ' + error)
      })
    })

    return promise
  },
}
