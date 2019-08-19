# -*- coding: utf-8 -*-

# error code
RetCode_Key = 'ret'
RetCode_Data = 'data'
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
ErrorCode_NotLogin = -1006

# error code for add/delete user's favorite resthome
ErrorCode_ErrorUsername = -1100
ErrorCode_ErrorRhid = -1101

ErrorCode_NoData = -1102


ErrorCode_Param = 1200

RH_NUM_PER_PAGE = 20

IMG_SERVER_HOST="http://127.0.0.1"
IMGS_PATH="images"
DEFAULT_IMG = "default.jpg"

# internal used
SESSION_KEY_UID = 'user_id'

def getErrorString(error_code):
    errorStringList = [
        [ErrorCode_OK, 'ErrorCode_OK'],
        [ErrorCode_UnknownError, 'ErrorCode_UnknownError'],
        [ErrorCode_RhIdNotInput, 'ErrorCode_RhIdNotInput'],
        [ErrorCode_RhIdNoExist, 'ErrorCode_RhIdNoExist'],
        [ErrorCode_LoginUserName, 'ErrorCode_LoginUserName'],
        [ErrorCode_LoginPassword, 'ErrorCode_LoginPassword'],
        [ErrorCode_UserNotExisted, 'ErrorCode_UserNotExisted'],
        [ErrorCode_UserExisted, 'ErrorCode_UserExisted'],
        [ErrorCode_PasswordWrong, 'ErrorCode_PasswordWrong'],
        [ErrorCode_FailToRegisterUser, 'ErrorCode_FailToRegisterUser'],
        [ErrorCode_NotLogin, 'ErrorCode_NotLogin'],
        [ErrorCode_ErrorUsername, 'ErrorCode_ErrorUsername'],
        [ErrorCode_ErrorRhid, 'ErrorCode_ErrorRhid'],
        [ErrorCode_NoData, 'ErrorCode_NoData'],
        [ErrorCode_Param, 'ErrorCode_Param'],
    ]
    for i, val in enumerate(errorStringList):
        if error_code == val[0]:
            return val[1]
    return '错误！'
