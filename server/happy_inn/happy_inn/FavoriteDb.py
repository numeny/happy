#!/usr/bin/python
# -*- coding: UTF-8 -*-
import sys
from json_response import JsonResponse

from rh.models import favorite

sys.path.append("./")
sys.path.append("../")

from Log import *
# ErroCode_* .etc
from rh_const import *

from Utils import *

from django.core.exceptions import ObjectDoesNotExist
from django.core.exceptions import MultipleObjectsReturned
from django.db.models import Q

class FavoriteDb:
    LOGTAT = "RhDetailQuery"
    def __init__(self, uid):
        self.uid = uid

    @staticmethod
    def getFavoriteList(uid, favRhIdList):
        if favRhIdList is None:
            return ErrorCode_Param

        try:
            favRecords = favorite.objects.filter(Q(uid=uid)).order_by('rhId')
        except ObjectDoesNotExist:
            Log.d(LOGTAG, 'getUserFavoriteList, ObjectDoesNotExist')
            return ErrorCode_NoData
        except MultipleObjectsReturned:
            pass
        if favRecords is None:
            return ErrorCode_NoData

        FavoriteDb.get_fav_list_from_records(favRhIdList, favRecords)
        return ErrorCode_OK

    def getFavoriteListForWeb(self, favRhIdList):
        if favRhIdList is None:
            return ErrorCode_Param

        try:
            favRecords = favorite.objects.filter(Q(uid=self.uid))
        except ObjectDoesNotExist:
            Log.d(LOGTAG, 'getUserFavoriteList, ObjectDoesNotExist')
            return ErrorCode_NoData
        except MultipleObjectsReturned:
            pass
        if favRecords is None:
            return ErrorCode_NoData

        FavoriteDb.get_fav_list_from_records_with_web_rhid(favRhIdList, favRecords)
        return ErrorCode_OK

    @staticmethod
    def get_fav_list_from_records(ret_array, records):
        if ret_array is None:
            return ErrorCode_Param

        for record in records:
            ret_array.append(record.rhId)

        return ErrorCode_OK

    @staticmethod
    def get_fav_list_from_records_with_web_rhid(ret_array, records):
        if ret_array is None:
            return ErrorCode_Param

        for record in records:
            ret_array.append(Utils.get_rh_id_from_db(record.rhId))

        return ErrorCode_OK
