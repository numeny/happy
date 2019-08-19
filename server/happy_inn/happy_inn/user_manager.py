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

def logout(request):
    Log.d(LOGTAG, 'logout')
    request.session.clear()
    return JsonResponse({RetCode_Key: ErrorCode_OK})

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

def changeUserFavoriteRh(request):
    Log.d(LOGTAG, 'changeUserFavoriteRh')
    response = {}

    if request.session.get(SESSION_KEY_UID, default=None) is None:
        response[RetCode_Key] = ErrorCode_NotLogin
        return JsonResponse(response)

    '''
    if "uid" not in request.GET or request.GET["uid"] == '':
        response[RetCode_Key] = ErrorCode_Param
        return JsonResponse(response)
    '''
    if "rhId" not in request.GET or request.GET["rhId"] == '':
        response[RetCode_Key] = ErrorCode_Param
        return JsonResponse(response)
    if "f" not in request.GET or request.GET["f"] == '':
        response[RetCode_Key] = ErrorCode_Param
        return JsonResponse(response)

    f = (request.GET["f"] == 't')
    rhId = request.GET["rhId"]
    rhId = Utils.get_rh_id_from_web_content(int(rhId))
    uid = request.session[SESSION_KEY_UID]
    '''
    uid = request.GET["uid"]
    try:
        rhId = Utils.get_rh_id_from_web_content(int(rhId))
    except ValueError:
        pass
    '''

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
    if request.session.get(SESSION_KEY_UID, default=None) is None:
        response[RetCode_Key] = ErrorCode_NotLogin
        return JsonResponse(response)

    uid = request.session[SESSION_KEY_UID]
    Log.d(LOGTAG, 'uid: ' + str(uid))

    '''
    try:
        favRecords = favorite.objects.filter(Q(uid=uid))
    except ObjectDoesNotExist:
        Log.d(LOGTAG, 'getUserFavoriteList, ObjectDoesNotExist')
        response[RetCode_Key] = ErrorCode_NoData
        response[RetCode_Data] = []
        return JsonResponse(response)
    except MultipleObjectsReturned:
        pass
    

    if favRecords is None:
        response[RetCode_Key] = ErrorCode_NoData
        response[RetCode_Data] = []
        return JsonResponse(response)

    response[RetCode_Key] = ErrorCode_OK
    response[RetCode_Data] = FavoriteDb.get_fav_list_from_records_with_web_rhid(favRecords)
    Log.d(LOGTAG, 'getUserFavoriteList, data: ' + str(response[RetCode_Data]))
    '''
    favList = []
    favDb = FavoriteDb(uid)
    response[RetCode_Key] = favDb.getFavoriteListForWeb(favList)
    response[RetCode_Data] = favList
    Log.d(LOGTAG, 'getUserFavoriteList, ret: ' + getErrorString(response[RetCode_Key]) + ', data: ' + str(response[RetCode_Data]))
    return JsonResponse(response)
