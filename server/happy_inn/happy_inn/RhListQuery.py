#!/usr/bin/python
# -*- coding: UTF-8 -*-
import sys
from json_response import JsonResponse
from django.db.models import Q

from rh.models import rh

sys.path.append("./")
sys.path.append("../")

from Log import *
# ErroCode_* .etc
from rh_const import *

from QueryParam import *
from DbQuery import *

class RhListQuery:
    LOGTAT = "RhListQuery"
    def __init__(self, query_param):
        self.query_param = query_param

    def update_title_image(self, record):
        found_img = False
        if len(record.rh_title_image) > 0:
            record.rh_title_image = "title/" + record.rh_title_image
            found_img = True
        else:
            if len(record.rh_images) > 0:
                first_img = record.rh_images.split(',')
                if len(first_img) > 0:
                    record.rh_title_image = first_img[0]
                    found_img = True
        if found_img:
            record.rh_title_image = ("%s/%s/%d/%s" % (IMG_SERVER_HOST, IMGS_PATH, record.id, record.rh_title_image))
        else:
            record.rh_title_image = ("%s/%s/%s" % (IMG_SERVER_HOST, IMGS_PATH, DEFAULT_IMG))

    def get_filter(self, response):
        all_filter = Q()
        if len(self.query_param.province) != 0:
            all_filter = all_filter & Q(rh_privince__startswith=self.query_param.province)
            response['curr_province'] = self.query_param.province
            print(response['curr_province'])
        if len(self.query_param.city) != 0:
            all_filter = all_filter & Q(rh_city__startswith=self.query_param.city)
            response['curr_city'] = self.query_param.city
            print(response['curr_city'])
        if len(self.query_param.area) != 0:
            all_filter = all_filter & Q(rh_area__startswith=self.query_param.area)
            response['curr_area'] = self.query_param.area
            print(response['curr_area'])

        if self.query_param.hasPriceQuery():
            price_filter = RhListQuery.get_price_q_query(self.query_param.minprice, self.query_param.maxprice)
            all_filter = all_filter & price_filter

        if self.query_param.hasBedNumQuery():
            bednum_filter = RhListQuery.get_bednum_q_query(self.query_param.minbed, self.query_param.maxbed)
            all_filter = all_filter & bednum_filter

        if len(self.query_param.str_type) != 0 and self.query_param.str_type != '0':
            str_type_filter = RhListQuery.get_type_q_query(self.query_param.str_type)
            all_filter = all_filter & str_type_filter

        if len(self.query_param.prop) != 0 and self.query_param.prop != '0':
            prop_filter = RhListQuery.get_prop_q_query(self.query_param.prop)
            all_filter = all_filter & prop_filter

        # only display ylxxw's records
        all_filter = all_filter & RhListQuery.get_only_ylxxw_records_query()

        return all_filter

    def get_rh_list(self):
        global RH_NUM_PER_PAGE
        # FIXME, should not query all DB
        # db = rh.objects.filter(Q(rh_area__endswith="门头沟区"))
        response = {}
        all_filter = self.get_filter(response)

        records = rh.objects.filter(all_filter).order_by('-rh_bednum_int', 'rh_name', 'rh_ylw_id')
        record_num = records.count()
        page_num = record_num / RH_NUM_PER_PAGE
        if record_num % RH_NUM_PER_PAGE > 0:
            page_num = page_num + 1

        page_idx = self.query_param.page

        result_record = records[((page_idx - 1) * RH_NUM_PER_PAGE) : (page_idx * RH_NUM_PER_PAGE)]

        response['records'] = DbQuery.get_breif_colume_from_records(result_record)
        if page_idx < page_num:
            response['record_num'] = RH_NUM_PER_PAGE
        else:
            response['record_num'] = (record_num - RH_NUM_PER_PAGE * (page_idx - 1))
        response['page_num'] = page_num
        response['curr_page'] = str(page_idx)

        if self.query_param.hasPriceQuery():
            response['curr_minprice'] = str(self.query_param.minprice)
            response['curr_maxprice'] = str(self.query_param.maxprice)

        if self.query_param.hasBedNumQuery():
            response['curr_minbed'] = str(self.query_param.minbed)
            response['curr_maxbed'] = str(self.query_param.maxbed)

        if len(self.query_param.str_type) == 0:
            response['curr_type'] = '0'
        else:
            response['curr_type'] = self.query_param.str_type

        if len(self.query_param.prop) == 0:
            response['curr_prop'] = '0'
        else:
            response['curr_prop'] = self.query_param.prop

        if Log.DEBUG:
            response['message'] = "province: " + self.query_param.province
            response['message'] = response['message'] + ", city: " + self.query_param.city
            response['message'] = response['message'] + ", area: "+ self.query_param.area
            response['message'] = response['message'] + ", page_idx: "+ str(page_idx)
            response['message'] = response['message'] + ", page_num: "+ str(page_num)
            response['message'] = response['message'] + ", records_num: "+ str(record_num)
            response['message'] = response['message'] + ", minprice: "+ str(self.query_param.minprice)
            response['message'] = response['message'] + ", maxprice: "+ str(self.query_param.maxprice)
            response['message'] = response['message'] + ", minbed: "+ str(self.query_param.minbed)
            response['message'] = response['message'] + ", maxbed: "+ str(self.query_param.maxbed)
            response['message'] = response['message'] + ", str_type: " + str(self.query_param.str_type)
            response['message'] = response['message'] + ", prop: "+ str(self.query_param.prop)
            Log.e(RhListQuery.LOGTAT, response['message'])
        return response

    @staticmethod
    def get_price_q_query(minprice, maxprice):
        return (Q(rh_charges_min__gte=minprice) & Q(rh_charges_min__lte=maxprice)) | (Q(rh_charges_max__gte=minprice) & Q(rh_charges_max__lte=maxprice))

    @staticmethod
    def get_bednum_q_query(minbednum, maxbednum):
        return Q(rh_bednum_int__gte=minbednum) & Q(rh_bednum_int__lte=maxbednum)

    @staticmethod
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

    @staticmethod
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

    # only display ylxxw's records
    @staticmethod
    def get_only_ylxxw_records_query():
        return Q(rh_ylw_id__startswith="ff")
