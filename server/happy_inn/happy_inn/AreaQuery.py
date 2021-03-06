#!/usr/bin/python
# -*- coding: UTF-8 -*-
import sys

from rh.models import city

sys.path.append("./")
sys.path.append("../")

#from . import Log
from Log import *
# ErroCode_* .etc

g_area_map = {}
class AreaQuery:
    LOGTAT = "AreaQuery"

    @staticmethod
    def initIfNeccesary():
        global g_area_map
        if g_area_map is not None and len(g_area_map) != 0:
            return
        #FIXME, get cities from where? rh or city's db
        areas = city.objects.order_by('privince', 'city', 'area').values('privince', 'city', 'area').distinct()
        for r in areas:
            if len(r['privince']) == 0 or len(r['city']) == 0 or len(r['area']) == 0:
                ''' FIXME
                print("city's field is null. [%s] [%s] [%s]"\
                    % (r['privince'].encode('utf-8'), r['city'].encode('utf-8'), r['area'].encode('utf-8')))
                '''
                continue;
            if 'privince' not in g_area_map:
                privince_map = {}
                g_area_map.setdefault(r['privince'], privince_map)
            privince_map = g_area_map.get(r['privince'])

            if 'city' not in privince_map:
                city_list = []
                privince_map.setdefault(r['city'], city_list)
            city_list = privince_map.get(r['city'])
            city_list.append(r['area'])

    @staticmethod
    def getAreaList(privince, city):
        global g_area_map

        AreaQuery.initIfNeccesary()

        if privince is None or len(privince) == 0:
            return g_area_map.keys()


        if privince not in g_area_map:
            #print("Error: area map has no privince[%s]" % privince)
            return []

        privince_map = g_area_map.get(privince)
        if city is None or len(city) == 0:
            return privince_map.keys()

        if city not in privince_map:
            #print("Error: area map has no privince[%s] city[%s] " % (privince, city))
            return []

        return privince_map.get(city)
