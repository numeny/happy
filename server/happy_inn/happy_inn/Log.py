# -*- coding: utf-8 -*-
import os
import sys

sys.path.append("./")
sys.path.append("../")

# FIXME
#from . import settings

class Log:
    # DEBUG = settings.DEBUG
    DEBUG = True

    @staticmethod
    def e(tag, message):
        print("[Error][%s]: %s" % (tag, message))

    @staticmethod
    def w(tag, message):
        if Log.DEBUG:
            print("[Warning][%s]: %s" % (tag, message))

    @staticmethod
    def d(tag, message):
        if Log.DEBUG:
            print("[Debug][%s]: %s" % (tag, message))

    @staticmethod
    def i(tag, message):
        if Log.DEBUG:
            print("[Info][%s]: %s" % (tag, message))
