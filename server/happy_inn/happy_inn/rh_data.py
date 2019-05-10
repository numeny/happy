# -*- coding: utf-8 -*-
import json
import sys

from django.db.models import Q
from django.http import HttpResponse
from json_response import JsonResponse
 
from rh.models import rh

sys.path.append("./")
sys.path.append("../")

# ErroCode_* .etc
from rh_const import *

from QueryParam import *
from settings import *

rh_num_per_page = 2
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
    response = {}
    if "rhid" in request.GET:
        get_data_from_rh_id(response, request.GET['rhid'])
    else:
        response[RetCode_Key] = str(ErroCode_RhIdNotInput)
    '''
    if "user_name" in request.session:
        response["user_name"] = request.session['user_name']
    else:
        request.session['user_name'] = "admin"
    response["session_key"] = request.session.session_key
    '''
    return JsonResponse(response)

def get_data_from_rh_id(response, rh_id):
    response['message'] = 'you are querying rh_id: ' + rh_id
    #db = rh.objects.filter(id='2188')
    db = rh.objects.filter(id=rh_id)
    if len(db) <= 0:
        response[RetCode_Key] = str(ErroCode_RhIdNoExist)
        return
    response[RetCode_Key] = str(ErroCode_Ok)

    # FIXME, should not query only one
    record = db[0]
    # FIXME, show image
    # update_title_image(record)
    get_rh_location_id(record)
    response['record'] = get_all_colume_from_one_record(record)
    '''
    imgs = []
    if len(record.rh_images) > 0:
        imgs = record.rh_images.split(',')
        if len(imgs) > 0:
            for idx, r in enumerate(imgs):
                imgs[idx] = imgs[idx].encode('utf-8')
        response['message'] = response['message'] + ", images: " + str(imgs)
    '''


def get_all_colume_from_records(records):
    ret_array = []
    for record in records:
        ret_array.append(get_all_colume_from_one_record(record))
    return ret_array

def get_all_colume_from_one_record(record):
    ret_map = {}
    ret_map['name'] = record.rh_name
    ret_map['phone'] = record.rh_phone
    ret_map['mobile'] = record.rh_mobile
    ret_map['email'] = record.rh_email
    ret_map['postcode'] = record.rh_postcode
    ret_map['location_id'] = record.rh_location_id
    ret_map['type'] = record.rh_type
    ret_map['factory_property'] = record.rh_factory_property
    ret_map['person_in_charge'] = record.rh_person_in_charge
    ret_map['establishment_time'] = record.rh_establishment_time
    ret_map['floor_surface'] = record.rh_floor_surface
    ret_map['building_area'] = record.rh_building_area
    ret_map['bednum'] = record.rh_bednum
    ret_map['staff_num'] = record.rh_staff_num
    ret_map['for_persons'] = record.rh_for_persons
    ret_map['charges_extent'] = record.rh_charges_extent
    ret_map['special_services'] = record.rh_special_services
    ret_map['contact_person'] = record.rh_contact_person
    ret_map['address'] = record.rh_address
    ret_map['url'] = record.rh_url
    ret_map['transportation'] = record.rh_transportation
    ret_map['inst_intro'] = record.rh_inst_intro
    ret_map['inst_charge'] = record.rh_inst_charge
    ret_map['facilities'] = record.rh_facilities
    ret_map['service_content'] = record.rh_service_content
    ret_map['inst_notes'] = record.rh_inst_notes
    ret_map['ylw_id'] = record.rh_ylw_id
    ret_map['province'] = record.rh_privince
    ret_map['city'] = record.rh_city
    ret_map['area'] = record.rh_area
    ret_map['title_image'] = record.rh_title_image
    ret_map['images'] = record.rh_images
    ret_map['charges_min'] = record.rh_charges_min
    ret_map['charges_max'] = record.rh_charges_max
    ret_map['bednum_int'] = record.rh_bednum_int
    return ret_map

def get_rh_list(context, query_param):
    global rh_num_per_page
    # FIXME, should not query all DB
    # db = rh.objects.filter(Q(rh_area__endswith="门头沟区"))
    all_filter = Q()
    if len(query_param.province) != 0:
        all_filter = all_filter & Q(rh_privince__startswith=query_param.province)
        context['curr_province'] = query_param.province
        print(context['curr_province'])
    if len(query_param.city) != 0:
        all_filter = all_filter & Q(rh_city__startswith=query_param.city)
        context['curr_city'] = query_param.city
        print(context['curr_city'])
    if len(query_param.area) != 0:
        all_filter = all_filter & Q(rh_area__startswith=query_param.area)
        context['curr_area'] = query_param.area
        print(context['curr_area'])

    if query_param.hasPriceQuery():
        price_filter = get_price_q_query(query_param.minprice, query_param.maxprice)
        all_filter = all_filter & price_filter

    if query_param.hasBedNumQuery():
        bednum_filter = get_bednum_q_query(query_param.minbed, query_param.maxbed)
        all_filter = all_filter & bednum_filter

    if len(query_param.str_type) != 0 and query_param.str_type != '0':
        str_type_filter = get_type_q_query(query_param.str_type)
        all_filter = all_filter & str_type_filter

    if len(query_param.prop) != 0 and query_param.prop != '0':
        prop_filter = get_prop_q_query(query_param.prop)
        all_filter = all_filter & prop_filter

    records = rh.objects.filter(all_filter).order_by('-rh_bednum_int', 'rh_name', 'rh_ylw_id')
    record_num = records.count()
    page_num = record_num / rh_num_per_page
    if record_num % rh_num_per_page > 0:
        page_num = page_num + 1

    page_idx = query_param.page

    ret_records = []
    result_record = records[((page_idx - 1) * rh_num_per_page) : (page_idx * rh_num_per_page)]

    for idx, r in enumerate(result_record):
        # FIXME, image
        # update_title_image(r)
        # get_rh_location_id(r)
        ret_records.append(r)

    context['records'] = get_all_colume_from_records(ret_records)
    if page_idx < page_num:
        context['record_num'] = rh_num_per_page
    else:
        context['record_num'] = (record_num - rh_num_per_page * (page_idx - 1))
    context['page_num'] = page_num
    context['curr_page'] = str(page_idx)

    if query_param.hasPriceQuery():
        context['curr_minprice'] = str(query_param.minprice)
        context['curr_maxprice'] = str(query_param.maxprice)

    if query_param.hasBedNumQuery():
        context['curr_minbed'] = str(query_param.minbed)
        context['curr_maxbed'] = str(query_param.maxbed)

    if len(query_param.str_type) == 0:
        context['curr_type'] = '0'
    else:
        context['curr_type'] = query_param.str_type

    if len(query_param.prop) == 0:
        context['curr_prop'] = '0'
    else:
        context['curr_prop'] = query_param.prop

    if Log.DEBUG:
        context['message'] = "province: " + query_param.province
        context['message'] = context['message'] + ", city: " + query_param.city
        context['message'] = context['message'] + ", area: "+ query_param.area
        context['message'] = context['message'] + ", page_idx: "+ str(page_idx)
        context['message'] = context['message'] + ", page_num: "+ str(page_num)
        context['message'] = context['message'] + ", records_num: "+ str(record_num)
        context['message'] = context['message'] + ", minprice: "+ str(query_param.minprice)
        context['message'] = context['message'] + ", maxprice: "+ str(query_param.maxprice)
        context['message'] = context['message'] + ", minbed: "+ str(query_param.minbed)
        context['message'] = context['message'] + ", maxbed: "+ str(query_param.maxbed)
        context['message'] = context['message'] + ", str_type: " + str(query_param.str_type)
        context['message'] = context['message'] + ", prop: "+ str(query_param.prop)
        Log.e("", context['message'])

def get_rh_location_id(record):
    record.rh_location_id = record.rh_privince + record.rh_city + record.rh_area

def show_rh_list(request):
    response = {}
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
    get_rh_list(response, query_param)

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

def get_price_q_query(minprice, maxprice):
    return (Q(rh_charges_min__gte=minprice) & Q(rh_charges_min__lte=maxprice)) | (Q(rh_charges_max__gte=minprice) & Q(rh_charges_max__lte=maxprice))

def get_bednum_q_query(minbednum, maxbednum):
    return Q(rh_bednum_int__gte=minbednum) & Q(rh_bednum_int__lt=maxbednum)

def get_type_q_query(str_type):
    if str_type == '1':
        str_type_filter = Q(rh_type__startswith='老年公寓')
    elif str_type == '2':
        str_type_filter = Q(rh_type__startswith='养老照料中心')
    elif str_type == '3':
        str_type_filter = Q(rh_type__startswith='护理院')
    elif str_type == '4':
        str_type_filter = Q(rh_type__startswith='其他')
    else:
        # FIXME
        str_type_filter = None
    return str_type_filter

def get_prop_q_query(prop):
    if prop == '1':
        prop_filter = Q(rh_factory_property__startswith='民营机构')
    elif prop == '2':
        prop_filter = Q(rh_factory_property__startswith='国营机构')
    elif prop == '3':
        prop_filter = Q(rh_factory_property__startswith='公建民营')
    elif prop == '4':
        prop_filter = Q(rh_factory_property__startswith='民办公助')
    elif prop == '5':
        prop_filter = Q(rh_factory_property__startswith='其他')
    else:
        # FIXME
        prop_filter = None
    return prop_filter
