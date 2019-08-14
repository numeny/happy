// client's error code
export const ErrorCode_OK = 0
export const ErrorCode_UnknownError = -9999

const ErrorCode_RhIdNotInput = -1
const ErrorCode_RhIdNoExist = -2

const ErrorCode_LoginUserName = -1000
const ErrorCode_LoginPassword = -1001
const ErrorCode_UserNotExisted = -1002
const ErrorCode_UserExisted = -1003
const ErrorCode_PasswordWrong = -1004
const ErrorCode_FailToRegisterUser = -1005

export const ErrorStringArray = [
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
  [ErrorCode_NotLogin, '用户没有登录！'],
]

// used only in client
export const ErrorCode_NotLogin = -5006
