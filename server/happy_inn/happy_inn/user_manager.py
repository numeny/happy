# -*- coding: utf-8 -*-
import json
import sys

from django.contrib.auth import authenticate
from json_response import JsonResponse
 
from django.contrib.auth.models import User
#from rh.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.core.exceptions import MultipleObjectsReturned
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

    Log.d(LOGTAG, 'username: ' + username)
    Log.d(LOGTAG, 'password: ' + username)

    try:
        user = User.objects.get(username=username)
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
    response[RetUserName_Key] = username
    response[RetUserId_Key] = user.id

    request.session[SESSION_KEY_UID] = user.id
    uid = request.session[SESSION_KEY_UID]
    Log.d(LOGTAG, 'login: uid: ' + str(uid))

    return JsonResponse(response)

# only for h5
def logout(request):
    Log.d(LOGTAG, 'logout')
    request.session.clear()
    return JsonResponse({RetCode_Key: ErrorCode_OK})

# only for h5
def registerUser(request):
    '''
    return JsonResponse("hello")
    '''
    response = {}
    if "username" not in request.GET or request.GET["username"] == '':
        response[RetCode_Key] = ErrorCode_LoginUserName
        return JsonResponse(response)
    if "password" not in request.GET or request.GET["password"] == '':
        response[RetCode_Key] = ErrorCode_LoginPassword
        return JsonResponse(response)

    username = request.GET["username"]
    password = request.GET["password"]

    Log.d(LOGTAG, 'username: ' + username)
    Log.d(LOGTAG, 'password: ' + username)

    try:
        user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        user = User.objects.create_user(username, '', password)
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
            return JsonResponse(response)
        uid = request.session[SESSION_KEY_UID]
    elif request.GET["etype"] == ETYPE_WEAPP:
        if "unionid" not in request.GET:
            Log.e(LOGTAG, 'Request has no parameter of unionid when get uid from request for weapp!')
            response[RetCode_Key] = ErrorCode_Param
            return -1
        # TODO, should not only use unionid to identify user's session
        # we should add session id to identify it
        unionid = request.GET["unionid"]
        # TODO, FIXME
        uid = 0 # SessionManager.getUid(unionid)
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
        Log.e(LOGTAG, 'Request has no error parameter of rhId when change user favorite rh!')
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
