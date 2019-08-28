# -*- coding: utf-8 -*-
import json
import sys
import urllib

from django.contrib.auth import authenticate
from django.http import HttpResponse
from json_response import JsonResponse
 
from django.contrib.auth.models import User
#from rh.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.core.exceptions import MultipleObjectsReturned
from django.db.models import Q

from rh.models import favorite

sys.path.append("./")
sys.path.append("../")
sys.path.append("./weixin")

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
    if "code" not in request.GET or request.GET["code"] == '':
        response[RetCode_Key] = ErrorCode_WeixinLoginNoCode
        return JsonResponse(response)

    unionid = request.GET["code"]
    Log.e(LOGTAG, 'Weixin login, weixin code: ' + unionid)

    response = registerUserForWeixin(unionid)
    return JsonResponse(response)

def weixinlogin(request):
    Log.d(LOGTAG, 'Weixin login!')
    response = {}
    if "code" not in request.GET or request.GET["code"] == '':
        response[RetCode_Key] = ErrorCode_WeixinLoginNoCode
        return JsonResponse(response)

    weixinCode = request.GET["code"]
    Log.d(LOGTAG, 'Weixin login, weixinCode: ' + weixinCode)

    # url = 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code 
    # url = 'http://www.baidu.com'
    url = ('https://api.weixin.qq.com/sns/jscode2session?appid='
            + WEIXIN_APPID
            + '&secret=' + WEIXIN_SECRET
            + '&js_code=' + weixinCode
            + '&grant_type=authorization_code')
    Log.d(LOGTAG, 'Weixin login, url: ' + url)
    try: 
        response = urllib.request.urlopen(url, timeout=5.0)
    except urllib.error.URLError as e:
        if isinstance(e.reason,socket.timeout):
            response[RetCode_Key] = ErrorCode_WeixinServerError
            Log.e(LOGTAG, 'Fail to requesting unionid of weixin on timeout, code: ' + weixinCode)
            return JsonResponse(response)

    if response is None:
        response = {}
        response[RetCode_Key] = ErrorCode_WeixinServerError
        Log.e(LOGTAG, 'Fail to requesting unionid of weixin with none response, code: ' + weixinCode)
        return JsonResponse(response)

    # wx0075bca25e961250
    # b96f3b34e596f414744d56cd8081d2ed
    data_1 = response.read()
    Log.d(LOGTAG, 'Success to requesting unionid of weixin, data: ' + str(data_1))
    response = json.loads(data_1)
    Log.d(LOGTAG, 'Success to requesting unionid of weixin, data.map: ' + str(response))

    if 'openid' not in response or response['openid'] == '' or 'session_key' not in response or response['session_key'] == '':
        response = {}
        response[RetCode_Key] = ErrorCode_WeixinServerError
        Log.e(LOGTAG, 'Fail to requesting openid or sesseion_key of weixin, code: ' + weixinCode)
        return JsonResponse(response)

    # FIXME
    unionid = response['openid']

    ret = registerUserForWeixin(unionid)
    if ret[RetCode_Key] == ErrorCode_UserExisted:
        ret[RetCode_Key] = ErrorCode_OK

    return JsonResponse(ret)
