# -*- coding: utf-8 -*-
import json
import sys

from django.contrib.auth import authenticate
from json_response import JsonResponse
 
#from django.contrib.auth.models import User
from rh.models import RhUser
from django.core.exceptions import ObjectDoesNotExist
from django.core.exceptions import MultipleObjectsReturned
from django.db import IntegrityError
from django.db.models import Q

from rh.models import favorite

sys.path.append("./")
sys.path.append("../")

# ErroCode_* .etc
from rh_const import *
from common import *
from settings import *
from Log import *
from Utils import *
from FavoriteDb import *

LOGTAG = 'user_manager'

# only for h5
def login(request):
    response = {}
    if "username" not in request.GET or request.GET["username"] == '':
        response[RetCode_Key] = ErrorCode_LoginUserName
        return JsonResponse(response)
    if "password" not in request.GET or request.GET["password"] == '':
        response[RetCode_Key] = ErrorCode_LoginPassword
        return JsonResponse(response)

    username = request.GET["username"]
    password = request.GET["password"]

    Log.d(LOGTAG, 'login, username: ' + username)
    Log.d(LOGTAG, 'login, password: ' + password)

    try:
        user = RhUser.objects.get(username=username)
    except ObjectDoesNotExist:
        response[RetCode_Key] = ErrorCode_UserNotExisted
        return JsonResponse(response)

    if user is None:
        response[RetCode_Key] = ErrorCode_UserNotExisted
        return JsonResponse(response)

    user = authenticate(username=username, password=password)

    if user is None:
        response[RetCode_Key] = ErrorCode_PasswordWrong
        return JsonResponse(response)

    response[RetCode_Key] = ErrorCode_OK
    # response[RetUserName_Key] = username
    response[RetUserId_Key] = user.id

    request.session[SESSION_KEY_UID] = user.id
    uid = request.session[SESSION_KEY_UID]
    Log.d(LOGTAG, 'login, uid: ' + str(uid))

    return JsonResponse(response)

# only for h5
def logout(request):
    Log.d(LOGTAG, 'logout')
    request.session.clear()
    return JsonResponse({RetCode_Key: ErrorCode_OK})

# only for weixin
#FIXME, will be deleted
def getUidFromUnionidForWeixin(response, unionid):
    try:
        user = RhUser.objects.get(unionid=unionid)
    except ObjectDoesNotExist:
        response[RetCode_Key] = ErrorCode_UserNotExisted
        return -1

    if user is None:
        response[RetCode_Key] = ErrorCode_UserNotExisted
        return -1

    response[RetCode_Key] = ErrorCode_OK
    return user.id

# only for weixin
# return: ret[RetCode_Key] = ErrorCode_OK 
#                            ErrorCode_FailToRegisterUser
#                            ErrorCode_UserExisted
#         ret[RetUserId_Key] = user id
def registerUserForWeixin(unionid):
    Log.d(LOGTAG, 'registerUserForWeixin, unionid: ' + unionid)
    ret = {}
    try:
        # FIXME, unionid saved as username
        user = RhUser.objects.get(username=unionid)
    except ObjectDoesNotExist:
        Log.d(LOGTAG, 'registerUserForWeixin, ObjectDoesNotExist')
        try:
            # FIXME, unionid saved as username andunionid
            user = RhUser.objects.create_user(username=unionid,
                unionid=unionid, user_type=USER_TYPE_WEIXIN)
            if user is None:
                Log.e(LOGTAG, 'Create user record fail! unionid: ' + unionid)
                ret[RetCode_Key] = ErrorCode_FailToRegisterUser
                return ret

            Log.e(LOGTAG, 'registerUserForWeixin! create OK, uid: ' + str(user.id))
            ret[RetCode_Key] = ErrorCode_OK
            ret[RetUserId_Key] = user.id
            return ret
        except IntegrityError:
            Log.e(LOGTAG, 'Create user record fail! unionid: ' + unionid)
            ret[RetCode_Key] = ErrorCode_FailToRegisterUser
            return ret

    Log.e(LOGTAG, 'registerUserForWeixin! ErrorCode_UserExisted')
    ret[RetCode_Key] = ErrorCode_UserExisted
    ret[RetUserId_Key] = user.id
    return ret

# only for h5
def registerUser(request):
    response = {}
    if "username" not in request.GET or request.GET["username"] == '':
        response[RetCode_Key] = ErrorCode_LoginUserName
        return JsonResponse(response)
    if "password" not in request.GET or request.GET["password"] == '':
        response[RetCode_Key] = ErrorCode_LoginPassword
        return JsonResponse(response)

    username = request.GET["username"]
    password = request.GET["password"]

    Log.d(LOGTAG, 'registerUser, username: ' + username)
    Log.d(LOGTAG, 'registerUser, password: ' + password)

    try:
        user = RhUser.objects.get(username=username)
    except ObjectDoesNotExist:
        user = RhUser.objects.create_user(
                username=username, password=password, user_type=USER_TYPE_H5)
        if user is None:
            response[RetCode_Key] = ErrorCode_FailToRegisterUser
            return JsonResponse(response)

        response[RetCode_Key] = ErrorCode_OK
        return JsonResponse(response)

    response[RetCode_Key] = ErrorCode_UserExisted
    return JsonResponse(response)


''' Get uid '''
def getUid(request, response):
    if "etype" not in request.GET:
        Log.e(LOGTAG, 'Request has no parameter of etype when get uid from request!')
        response[RetCode_Key] = ErrorCode_Param
        return -1

    if request.GET["etype"] == ETYPE_H5:
        if request.session.get(SESSION_KEY_UID, default=None) is None:
            response[RetCode_Key] = ErrorCode_NotLogin
            return -1
        uid = request.session[SESSION_KEY_UID]
    elif request.GET["etype"] == ETYPE_WEAPP:
        # TODO, should not only use unionid to identify user's session
        # we should add session id to identify it
        if "uid" not in request.GET or request.GET["uid"] == '':
            Log.e(LOGTAG, 'Request has no parameter of uid when get uid from request for weapp!')
            response[RetCode_Key] = ErrorCode_Param
            return JsonResponse(response)
        # unionid = request.GET["unionid"]
        # TODO, FIXME
        # SessionManager.getUid(unionid)
        # uid = getUidFromUnionidForWeixin(response, unionid)
        # if response[RetCode_Key] != ErrorCode_OK:
        #     return -1
        try:
            uid = int(request.GET["uid"])
        except ValueError:
            Log.e(LOGTAG, 'Request has error parameter of uid!')
            response[RetCode_Key] = ErrorCode_Param
            return JsonResponse(response)

    response[RetCode_Key] = ErrorCode_OK
    return uid

# for h5 and weapp
def changeUserFavoriteRh(request):
    Log.d(LOGTAG, 'changeUserFavoriteRh')
    response = {}

    if "rhId" not in request.GET or request.GET["rhId"] == '':
        response[RetCode_Key] = ErrorCode_Param
        return JsonResponse(response)
    if "f" not in request.GET or request.GET["f"] == '':
        response[RetCode_Key] = ErrorCode_Param
        return JsonResponse(response)

    f = (request.GET["f"] == 't')
    try:
        rhId = int(request.GET["rhId"])
        rhId = Utils.get_rh_id_from_web_content(rhId)
    except ValueError:
        Log.e(LOGTAG, 'Request has error parameter of rhId when change user favorite rh!')
        response[RetCode_Key] = ErrorCode_Param
        return JsonResponse(response)

    # get uid from request
    uid = getUid(request, response)
    if response[RetCode_Key] != ErrorCode_OK:
        Log.e(LOGTAG, 'Request has error when get uid on changing user favorite rh!')
        return JsonResponse(response)

    Log.d(LOGTAG, 'uid: ' + str(uid))
    Log.d(LOGTAG, 'rhId: ' + str(rhId))
    Log.d(LOGTAG, 'favorite: ' + request.GET["f"])
    favRecord = None
    try:
        favRecord = favorite.objects.get(uid=uid, rhId=rhId)
    except ObjectDoesNotExist:
        Log.d(LOGTAG, 'changeUserFavoriteRh, ObjectDoesNotExist')
        pass

    if favRecord is None:
        Log.d(LOGTAG, 'changeUserFavoriteRh, favRecord is None')
        if f:
            Log.d(LOGTAG, 'changeUserFavoriteRh, f')
            newFavRecord = favorite(uid=uid, rhId=rhId)
            newFavRecord.save()
    else:
        Log.d(LOGTAG, 'changeUserFavoriteRh, favRecord is not None')
        if not f:
            Log.d(LOGTAG, 'changeUserFavoriteRh, not f')
            favRecord.delete()

    response[RetCode_Key] = ErrorCode_OK
    return JsonResponse(response)

def getUserFavoriteList(request):
    Log.d(LOGTAG, 'getUserFavoriteList')
    response = {}

    # get uid from request
    uid = getUid(request, response)
    if response[RetCode_Key] != ErrorCode_OK:
        Log.e(LOGTAG, 'Request has error when get uid on changing user favorite rh!')
        return JsonResponse(response)
    Log.d(LOGTAG, 'uid: ' + str(uid))

    favList = []
    favDb = FavoriteDb(uid)
    response[RetCode_Key] = favDb.getFavoriteListForWeb(favList)
    response[RetCode_Data] = favList
    Log.d(LOGTAG, 'getUserFavoriteList, ret: ' + getErrorString(response[RetCode_Key]) + ', data: ' + str(response[RetCode_Data]))
    return JsonResponse(response)
