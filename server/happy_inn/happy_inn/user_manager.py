# -*- coding: utf-8 -*-
import json
import sys

from django.http import HttpResponse
from django.contrib.auth import authenticate
from json_response import JsonResponse
 
from rh.models import rh



from django.contrib.auth.models import User
#from rh.models import User
from django.core.exceptions import ObjectDoesNotExist


sys.path.append("./")
sys.path.append("../")

# ErroCode_* .etc
from rh_const import *

from QueryParam import *
from RhDetailQuery import *
from RhListQuery import *
from AreaQuery import *

from settings import *

default_img = "/static/images/default.jpg"
LOGTAG = "RhData"

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

    print(username)
    print(password)

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
    pass

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

    print(username)
    print(password)

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
