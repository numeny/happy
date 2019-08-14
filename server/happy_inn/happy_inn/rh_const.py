# -*- coding: utf-8 -*-

# error code
RetCode_Key = 'ret'
RetUserName_Key = 'username'
RetUserId_Key = 'userid'

ErrorCode_OK = 0
ErrorCode_UnknownError = -9999

ErrorCode_RhIdNotInput = -1
ErrorCode_RhIdNoExist = -2

# error code for login/register
ErrorCode_LoginUserName = -1000
ErrorCode_LoginPassword = -1001
ErrorCode_UserNotExisted = -1002
ErrorCode_UserExisted = -1003
ErrorCode_PasswordWrong = -1004
ErrorCode_FailToRegisterUser = -1005

# error code for add/delete user's favorite resthome
ErrorCode_ErrorUsername = -1100
ErrorCode_ErrorRhid = -1101

ErrorCode_Param = 1200

RH_NUM_PER_PAGE = 20

IMG_SERVER_HOST="http://127.0.0.1"
IMGS_PATH="images"
DEFAULT_IMG = "default.jpg"
