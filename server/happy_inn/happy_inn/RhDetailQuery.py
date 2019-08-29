#!/usr/bin/python
# -*- coding: UTF-8 -*-
import sys
from json_response import JsonResponse

from rh.models import rh

sys.path.append("./")
sys.path.append("../")

from Log import *
# ErroCode_* .etc
from rh_const import *

from DbQuery import *
from Utils import *

class RhDetailQuery:
    LOGTAT = "RhDetailQuery"
    def __init__(self, rh_id):
        try:
            self.rh_id = Utils.get_rh_id_from_web_content(int(rh_id))
        except ValueError:
            pass

    @staticmethod
    def get_rh_location_id(record):
        municipality = [u'北京市', u'上海市', u'天津市', u'重庆市']
        if record.rh_privince in municipality:
            province = ''
        else:
            province = record.rh_privince
        record.rh_location_id = province + record.rh_city + record.rh_area

    def get_data_from_rh_id(self):
        response = {}
        db = rh.objects.filter(id=self.rh_id)
        if len(db) <= 0:
            response[RetCode_Key] = str(ErroCode_RhIdNoExist)
            return response
        response[RetCode_Key] = str(ErrorCode_OK)

        # FIXME, should not query only one
        record = db[0]
        # FIXME, show image
        # update_title_image(record)
        RhDetailQuery.get_rh_location_id(record)
        response['record'] = DbQuery.get_all_colume_from_one_record(record)
        return response
