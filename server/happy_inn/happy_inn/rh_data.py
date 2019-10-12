# -*- coding: utf-8 -*-
import json
import os
import sys

from django.http import HttpResponse
from json_response import JsonResponse
 
from rh.models import rh

sys.path.append("./")
sys.path.append("../")

# for mac os, FIXME
sys.path.append(os.getcwd()+"/happy_inn/happy_inn/")
sys.path.append(os.getcwd()+"/happy_inn/")
sys.path.append("./happy_inn/happy_inn/")
sys.path.append("./happy_inn/")
sys.path.append("../happy_inn/")
sys.path.append("../happy_inn/happy_inn/")

# ErroCode_* .etc
from rh_const import *

from QueryParam import *
from RhDetailQuery import *
from RhListQuery import *
from AreaQuery import *
from user_manager import *
from Utils import *
from UserStat import *

from settings import *

LOGTAG = "RhData"

# 数据库操作
def testdb(request):
    # 初始化
    response = ""
    response1 = ""
    
    
    # 通过objects这个模型管理器的all()获得所有数据行，相当于SQL中的SELECT * FROM
    list = rh.objects.all()
        
    response = list[0].rh_name
    return JsonResponse({'rh_name': response, 'ret': 'ok'})

def getRhDetail(request):
    if "rhid" not in request.GET:
        response = {}
        response[RetCode_Key] = str(ErroCode_RhIdNotInput)
        return JsonResponse(response)
    # get_data_from_rh_id(response, request.GET['rhid'])
    detail_query = RhDetailQuery(request.GET['rhid'])
    # userIp, clientType, userId, visitTime, location, function, param
    ipAddr = Utils.getIpAddress(request)
    '''
    UserStat.addVisitRequest(request, 'rhdetail',
            "rhid=" + str(detail_query.getIntRhId()))
    '''
    ret = detail_query.get_data_from_rh_id()

    return JsonResponse(ret)

def showRhList(request):
    # return JsonResponse('hello')
    Log.m(LOGTAG, 'showRhList, start', True)

    query_param = QueryParam()

    if "prov" in request.GET:
        query_param.province = request.GET['prov']
    if "city" in request.GET:
        query_param.city = request.GET['city']
    if "area" in request.GET:
        query_param.area = request.GET['area']
    if "min_price" in request.GET:
        try:
            query_param.minprice = int(request.GET['min_price'])
        except ValueError:
            pass
    if "max_price" in request.GET:
        try:
            query_param.maxprice = int(request.GET['max_price'])
        except ValueError:
            pass
    if "min_bed" in request.GET:
        try:
            query_param.minbed = int(request.GET['min_bed'])
        except ValueError:
            pass

    if "max_bed" in request.GET:
        try:
            query_param.maxbed = int(request.GET['max_bed'])
        except ValueError:
            pass
    if "type" in request.GET:
        query_param.str_type = request.GET['type']
    if "prop" in request.GET:
        query_param.prop = request.GET['prop']
    if "page" in request.GET:
        try:
            query_param.page = int(request.GET['page'])
        except ValueError:
            pass
    if "searchKey" in request.GET:
        query_param.searchKey = request.GET['searchKey']

    Log.m(LOGTAG, 'showRhList, start-1')
    response = {}
    if "favList" in request.GET:
        Log.i(LOGTAG, 'Requesting user favorite rh list!')

        # get uid from request
        uid = getUid(request, response)
        if response[RetCode_Key] != ErrorCode_OK:
            Log.e(LOGTAG, 'Request has error when get uid on changing user favorite rh!')
            return JsonResponse(response)
        if uid is None:
            Log.e(LOGTAG, 'User not login in!')
            response[RetCode_Key] = ErrorCode_NotLogin
            response[RetCode_Data] = []
            return JsonResponse(response)
        query_param.favList = (request.GET["favList"] == 't')
        Log.i(LOGTAG, 'Requesting user favorite rh, favList: ' + str(query_param.favList))
        query_param.uid = uid
        Log.i(LOGTAG, 'Requesting user favorite rh, uid: ' + str(query_param.uid))

    Log.m(LOGTAG, 'showRhList, start-2')
    # FIXME
    rh_list_query = RhListQuery(query_param)
    response = rh_list_query.get_rh_list()

    Log.m(LOGTAG, 'showRhList, end')
    return JsonResponse(response)

def areaList(request):
    prov = ""
    city = ""
    if 'prov' in request.GET:
        prov = request.GET['prov']

    if 'city' in request.GET:
        city = request.GET['city']

    area_list = AreaQuery.getAreaList(prov, city)
    if area_list is None:
        area_list = []

    # for python3.0
    area_list_1 = []
    for elem in area_list:
        area_list_1.append(elem)

    return JsonResponse(area_list_1)
