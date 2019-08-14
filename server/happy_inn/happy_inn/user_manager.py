# -*- coding: utf-8 -*-
import json
import sys

from django.contrib.auth import authenticate
from json_response import JsonResponse
 
from django.contrib.auth.models import User
#from rh.models import User
from django.core.exceptions import ObjectDoesNotExist

from rh.models import favorite

sys.path.append("./")
sys.path.append("../")

# ErroCode_* .etc
from rh_const import *
from settings import *
from Log import *
from Utils import *

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

    request.session['user_id'] = user.id

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
    if "uid" not in request.GET or request.GET["uid"] == '':
        response[RetCode_Key] = ErrorCode_Param
        return JsonResponse(response)
    if "rhId" not in request.GET or request.GET["rhId"] == '':
        response[RetCode_Key] = ErrorCode_Param
        return JsonResponse(response)
    if "f" not in request.GET or request.GET["f"] == '':
        response[RetCode_Key] = ErrorCode_Param
        return JsonResponse(response)

    uid = request.GET["uid"]
    f = (request.GET["f"] == 't')
    rhId = request.GET["rhId"]
    try:
        rhId = Utils.get_rh_id_from_web_content(int(rhId))
    except ValueError:
        pass

    Log.d(LOGTAG, 'uid: ' + uid)
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
