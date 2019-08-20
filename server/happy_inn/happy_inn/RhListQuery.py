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
from FavoriteDb import *

LOGTAG = 'RhListQuery'
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

        if len(self.query_param.searchKey) != 0:
            search_key_filter = RhListQuery.get_search_key_q_query(self.query_param.searchKey)
            all_filter = all_filter & search_key_filter

        # only display ylxxw's records
        all_filter = all_filter & RhListQuery.get_only_ylxxw_records_query()

        return all_filter

    def get_rh_list(self):
        if self.query_param.favList:
            return self.get_rh_fav_list()
        else:
            return self.get_rh_list_filter()

    def get_rh_fav_list(self):
        response = {}
        favRhIdList = []
        ret = FavoriteDb.getFavoriteList(self.query_param.uid, favRhIdList)
        response[RetCode_Key] = ret
        if ret is not ErrorCode_OK:
            return response

        '''
        TODO, should refactor this search
        '''
        records = []
        for i, val in enumerate(favRhIdList):
            try:
                r = rh.objects.filter(id=val)
                records.append(DbQuery.get_brief_colume_from_one_record(r[0]))
            except ObjectDoesNotExist:
                if Log.DEBUG:
                    Log.e(LOGTAG, 'rhid[%d] is in favorite.db but not in rh.db!')
                continue
            except Exception as e:
                if Log.DEBUG:
                    Log.e(LOGTAG, 'error on get_rh_fav_list!')
                continue

        record_num = len(records)
        page_num = record_num / RH_NUM_PER_PAGE
        if record_num % RH_NUM_PER_PAGE > 0:
            page_num = page_num + 1

        page_idx = self.query_param.page

        result_record = records[((page_idx - 1) * RH_NUM_PER_PAGE) : (page_idx * RH_NUM_PER_PAGE)]


        response['records'] = result_record
        if page_idx < page_num:
            response['record_num'] = RH_NUM_PER_PAGE
        else:
            response['record_num'] = (record_num - RH_NUM_PER_PAGE * (page_idx - 1))
        response['pageNum'] = page_num
        response['currPage'] = page_idx
        response['totalNum'] = record_num

        if Log.DEBUG:
            self.query_param.prt()
            message = "currPage: "+ str(page_idx)
            message = message + ", pageNum: "+ str(page_num)
            message = message + ", records_num: "+ str(record_num)
            Log.d(RhListQuery.LOGTAT, message)
        return response

    def get_rh_list_filter(self):
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

        response['records'] = DbQuery.get_brief_colume_from_records(result_record)
        if page_idx < page_num:
            response['record_num'] = RH_NUM_PER_PAGE
        else:
            response['record_num'] = (record_num - RH_NUM_PER_PAGE * (page_idx - 1))
        response['pageNum'] = page_num
        response['currPage'] = page_idx
        response['totalNum'] = record_num
        response[RetCode_Key] = ErrorCode_OK

        if Log.DEBUG:
            self.query_param.prt()
            message = "currPage: "+ str(page_idx)
            message = message + ", pageNum: "+ str(page_num)
            message = message + ", records_num: "+ str(record_num)
            Log.d(RhListQuery.LOGTAT, message)
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

    @staticmethod
    def get_search_key_q_query(searchKey):
        Log.e(RhListQuery.LOGTAT, 'get_search_key_q_query')
        Log.e(RhListQuery.LOGTAT, searchKey)
        prop_filter = Q(rh_name__contains=searchKey)
        return prop_filter

    # only display ylxxw's records
    @staticmethod
    def get_only_ylxxw_records_query():
        return Q(rh_ylw_id__startswith="ff")
