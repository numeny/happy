#!/usr/bin/python
# -*- coding: UTF-8 -*-
from Log import *

class Session:
    LOGTAT = "QueryParam"
    MIN_PRICE = 0
    MAX_PRICE = 100000000
    MIN_BED_NUM = 0
    MAX_BED_NUM = 10000000
    DEFAULT_PAGE = 1

    def __init__(self):
        self. = ""
        self.sessionId = ""
        self.area = ""
        self.minprice = QueryParam.MIN_PRICE
        self.maxprice = QueryParam.MAX_PRICE
        self.minbed = QueryParam.MIN_BED_NUM
        self.maxbed = QueryParam.MAX_BED_NUM
        self.str_type = ""
        self.prop = ""
        self.page = QueryParam.DEFAULT_PAGE
        self.searchKey = ""
        self.favList = False
        self.uid = 0
