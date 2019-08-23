# -*- coding: utf-8 -*-
import json
import sys
import urllib

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
from user_manager import *

LOGTAG = 'weapp_login'

def weixinlogin_test(request):
    Log.e(LOGTAG, 'weixinlogin_test')
    response = {}
    if "unionid" not in request.GET or request.GET["unionid"] == '':
        response[RetCode_Key] = ErrorCode_WeixinLoginNoCode
        return JsonResponse(response)

    unionid = request.GET["unionid"]
    Log.e(LOGTAG, 'Weixin login, weixin unionid: ' + unionid)

    response = registerUserForWeixin(unionid)
    return JsonResponse(response)

def weixinlogin(request):
    response = {}
    if "code" not in request.GET or request.GET["code"] == '':
        response[RetCode_Key] = ErrorCode_WeixinLoginNoCode
        return JsonResponse(response)

    weixinCode = request.GET["code"]
    Log.d(LOGTAG, 'Weixin login, weixinCode: ' + weixinCode)

    # url = 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code 
    # url = 'http://www.baidu.com'
    url = ('https://api.weixin.qq.com/sns/jscode2session?appid='
            + 'wx0075bca25e961250'
            + '&secret=' + 'e724fb3262ef839384db4417e99f40d7'
            + '&js_code=' + weixinCode
            + '&grant_type=authorization_code')
    try: 
        response = urllib.request.urlopen(url)
        response = urllib.request.urlopen(url, timeout=1.0)
    except urllib.error.URLError as e:
        if isinstance(e.reason,socket.timeout):
            response[RetCode_Key] = ErrorCode_WeixinServerError
            Log.e(LOGTAG, 'Fail to requesting unionid of weixin, code: ' + weixinCode)
            return JsonResponse(response)

    # wx0075bca25e961250
    # b96f3b34e596f414744d56cd8081d2ed
    print(response.read())
    print(type(response.read().decode('utf-8')))
    print(response.read().decode('utf-8'))
    Log.d(LOGTAG, 'weixinCode: ' + weixinCode)
    return JsonResponse(response)
