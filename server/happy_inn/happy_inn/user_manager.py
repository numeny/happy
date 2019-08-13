# -*- coding: utf-8 -*-
import json
import sys

from django.contrib.auth import authenticate
from json_response import JsonResponse
 
from django.contrib.auth.models import User
#from rh.models import User
from django.core.exceptions import ObjectDoesNotExist


sys.path.append("./")
sys.path.append("../")

# ErroCode_* .etc
from rh_const import *
from settings import *
from Log import *

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
    Log.d('logout')
    request.session.clear()
    return JsonResponse({RetCode_Key, ErrorCode_OK})

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

    Log.d('username: ' + username)
    Log.d('password: ' + username)

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
