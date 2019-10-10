#!/usr/bin/python
# -*- coding: UTF-8 -*-

from Log import *
from rh_const import *

LOGTAG = "Utils"
class Utils:
    def __init__(self):
        pass

    '''
    get rh id of web content from db's rh_id
    '''
    @staticmethod
    def get_rh_id_from_db(rh_id):
        return rh_id + 10000000

    '''
    get db's rh id from rh_id of web content
    '''
    @staticmethod
    def get_rh_id_from_web_content(rh_id):
        return rh_id - 10000000

    """
    获取ip地址
    """
    @staticmethod
    def getIpAddress(request):
        ip = request.META.get("HTTP_X_FORWARDED_FOR", "")
        if not ip:
            ip = request.META.get('REMOTE_ADDR', "")
        client_ip = ip.split(",")[-1].strip()
        if not client_ip:
            client_ip = ""
        return client_ip

    '''
    @staticmethod
    def getIntUserType(userType):
        intType = USER_TYPE_WEIXIN
        if userType == ETYPE_WEAPP:
            intType = USER_TYPE_WEIXIN
        elif userType == ETYPE_H5:
            intType = USER_TYPE_H5
        elif userType == ETYPE_ALIPAY:
            intType = USER_TYPE_ALIPAY

        return intType
    '''
