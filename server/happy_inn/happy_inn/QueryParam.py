#!/usr/bin/python
# -*- coding: UTF-8 -*-
from Log import *

class QueryParam:
    LOGTAT = "QueryParam"
    MIN_PRICE = 0
    MAX_PRICE = 100000000
    MIN_BED_NUM = 0
    MAX_BED_NUM = 10000000
    DEFAULT_PAGE = 1

    def __init__(self):
        self.province = ""
        self.city = ""
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

    '''
    def __init__(self, province, city, area,
           min_price, max_price, min_bed, max_bed,
           str_type, prop, page):
       self.province = province
       self.city = city
       self.area = area
       self.minprice = minprice
       self.maxprice = maxprice
       self.minbed = minbed
       self.maxbed = maxbed
       self.strtype = strtype
       self.prop = prop
       self.page = page
    '''

    def hasBedNumQuery(self):
        return (self.minbed != QueryParam.MIN_BED_NUM) | (self.maxbed != QueryParam.MAX_BED_NUM)

    def hasPriceQuery(self):
        return (self.minprice != QueryParam.MIN_PRICE) | (self.maxprice != QueryParam.MAX_PRICE)

    def prt(self):
        if Log.DEBUG:
            message = " QueryParam.province : " + self.province
            message = message + " city : " + self.city
            message = message + " area : " + self.area
            message = message + " minprice : " + str(self.minprice)
            message = message + " maxprice : " + str(self.maxprice)
            message = message + " minbed : " + str(self.minbed)
            message = message + " maxbed : " + str(self.maxbed)
            message = message + " strtype : " + self.str_type
            message = message + " prop : " + self.prop
            message = message + " page : " + str(self.page)
            message = message + " searchKey : " + str(self.searchKey)
            message = message + " favList : " + str(self.favList)
            message = message + " uid : " + str(self.uid)
            Log.d(QueryParam.LOGTAT, message)
