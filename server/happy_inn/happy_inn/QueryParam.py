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
       return self.minbed != QueryParam.MIN_BED_NUM | self.maxbed != QueryParam.MAX_BED_NUM

    def hasPriceQuery(self):
       return self.minprice != QueryParam.MIN_PRICE | self.maxprice != QueryParam.MAX_PRICE

    def prt(self):
      Log.d(QueryParam.LOGTAT, " QueryParam.province : " + self.province)
      Log.d(QueryParam.LOGTAT, " city : " + self.city)
      Log.d(QueryParam.LOGTAT, " area : " + self.area)
      Log.d(QueryParam.LOGTAT, " minprice : " + str(self.minprice))
      Log.d(QueryParam.LOGTAT, " maxprice : " + str(self.maxprice))
      Log.d(QueryParam.LOGTAT, " minbed : " + str(self.minbed))
      Log.d(QueryParam.LOGTAT, " maxbed : " + str(self.maxbed))
      Log.d(QueryParam.LOGTAT, " strtype : " + self.str_type)
      Log.d(QueryParam.LOGTAT, " prop : " + self.prop)
      Log.d(QueryParam.LOGTAT, " page : " + str(self.page))
