#!/usr/bin/python
# -*- coding: UTF-8 -*-

class Utils:
    LOGTAT = "Utils"
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
