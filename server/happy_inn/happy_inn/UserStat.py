#!/usr/bin/python
# -*- coding: UTF-8 -*-
import json
import sys

from django.contrib.auth import authenticate
from json_response import JsonResponse

sys.path.append("./")
sys.path.append("../")

from userstat.models import userstat

from Log import *
# ErroCode_* .etc
from rh_const import *

from Utils import *

class UserStat:
    LOGTAG = 'UserStat'
    def __init__(self):
        pass

    @staticmethod
    def addVisitRequest(request, visit_func, visit_param):
        etype = ''
        if ETYPE_KEY in request.GET:
            etype = request.GET[ETYPE_KEY]
        elif ETYPE_KEY in request.POST:
            etype = request.POST[ETYPE_KEY]

        user_ip=Utils.getIpAddress(request)

        # create visit record
        userstat(user_ip=user_ip, user_type=etype,
                visit_func=visit_func, visit_param=visit_param)
        newFavRecord.save()
