# -*- coding: utf-8 -*-

# error code
RetCode_Key = 'ret'
RetCode_Data = 'data'
RetUserName_Key = 'username'
RetUserId_Key = 'userid'

ErrorCode_OK = 0
ErrorCode_NOK = -9999
ErrorCode_UnknownError = -9998

ErrorCode_RhIdNotInput = -1
ErrorCode_RhIdNoExist = -2

# error code for login/register
ErrorCode_LoginUserName = -1000
ErrorCode_LoginPassword = -1001
ErrorCode_UserNotExisted = -1002
ErrorCode_UserExisted = -1003
ErrorCode_PasswordWrong = -1004
ErrorCode_FailToRegisterUser = -1005
ErrorCode_NotLogin = -1006

ErrorCode_WeixinLoginNoCode = -1020
ErrorCode_WeixinServerError = -1021


# error code for add/delete user's favorite resthome
ErrorCode_ErrorUsername = -1100
ErrorCode_ErrorRhid = -1101

ErrorCode_NoData = -1102


ErrorCode_Param = 1200

RH_NUM_PER_PAGE = 20

# internal used
SESSION_KEY_UID = 'user_id'

# Client's environment
ETYPE_KEY = 'etype'
ETYPE_WEAPP = 'weapp' # weapp
ETYPE_H5 = 'h5' # h5
ETYPE_ALIPAY = 'alipay' # h5
USER_TYPE_H5 = 0
USER_TYPE_WEIXIN = 1
USER_TYPE_ALIPAY = 2

# weixin appid
WEIXIN_APPID = 'wx0075bca25e961250'
WEIXIN_SECRET = 'e724fb3262ef839384db4417e99f40d7'
