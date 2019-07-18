#!/usr/bin/python
# -*- coding: UTF-8 -*-
from Log import *

IMG_SERVER_HOST = "http://10.129.192.204"
IMGS_ROOT_PATH = IMG_SERVER_HOST + "/images"

class DbUtils:
    LOGTAT = "DbUtils"
    def __init__(self):
        pass

    '''
    get title image path of web content (include host) from db's db record
    '''
    @staticmethod
    def get_title_image(record):
        found_img = False
        rh_title_image = ""
        if len(record.rh_title_image) > 0:
            rh_title_image = "title/" + record.rh_title_image
            found_img = True
        else:
            if len(record.rh_images) > 0:
                first_img = record.rh_images.split(',')
                if len(first_img) > 0:
                    rh_title_image = first_img[0]
                    found_img = True
        if found_img:
            rh_title_image = ("%s/%d/%s" % (IMGS_ROOT_PATH, record.id, rh_title_image))
        if Log.DEBUG:
            Log.d(DbUtils.LOGTAT, "rh_title_image: " + rh_title_image)
        return rh_title_image
