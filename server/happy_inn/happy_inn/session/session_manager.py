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
class SessionManager:
    LOGTAT = "RhListQuery"
    def __init__(self, query_param):
        self.sessionId_ = -1
        self.sessionId_ = -1

   def isLogin(self, sessionId):
        pass

   def getUid(self, openid):
       return -1

    def __init__(self, query_param):
        self.sessionId_ = -1
        self.sessionId_ = -1

