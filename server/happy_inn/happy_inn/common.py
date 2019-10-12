# -*- coding: utf-8 -*-
from rh_const import *

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
