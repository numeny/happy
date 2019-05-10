# -*- coding: utf-8 -*-
import json
import sys

from django.http import HttpResponse
from json_response import JsonResponse
 
from rh.models import rh

sys.path.append("./")
sys.path.append("../")

# ErroCode_* .etc
from rh_const import *

from QueryParam import *
from RhDetailQuery import *
from RhListQuery import *

from settings import *

default_img = "/static/images/default.jpg"
LOGTAG = "RhData"

def hello(request):
    return JsonResponse("Hello world ! ")
    # return HttpResponse("Hello world ! ")

# 数据库操作
def testdb(request):
    # 初始化
    response = ""
    response1 = ""
    
    
    # 通过objects这个模型管理器的all()获得所有数据行，相当于SQL中的SELECT * FROM
    list = rh.objects.all()
        
    response = list[0].rh_name
    return JsonResponse({'rh_name': response, 'ret': 'ok'})

def get_rh_detail(request):
    if "rhid" not in request.GET:
        response = {}
        response[RetCode_Key] = str(ErroCode_RhIdNotInput)
        return JsonResponse(response)
    # get_data_from_rh_id(response, request.GET['rhid'])
    detail_query = RhDetailQuery(request.GET['rhid'])
    return JsonResponse(detail_query.get_data_from_rh_id())
    '''
    if "user_name" in request.session:
        response["user_name"] = request.session['user_name']
    else:
        request.session['user_name'] = "admin"
    response["session_key"] = request.session.session_key
    '''

def show_rh_list(request):
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
    # FIXME
    rh_list_query = RhListQuery(query_param)
    response = rh_list_query.get_rh_list()

    response['has_located'] = request.session.get('has_located', 'n')
    response['geolocation_province'] = request.session.get('geolocation_province', '')
    response['geolocation_city'] = request.session.get('geolocation_city', '')
    if Log.DEBUG:
        response['message'] = response['message'] + ", session_key: "+ str(request.session.session_key)
    '''
    print "show_rh_list-9"
    return JsonResponse({'a': "Hello world ! "})
    '''
    return JsonResponse(response)
