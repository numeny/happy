# -*- coding: utf-8 -*-
import os
import sys
from datetime import datetime 

sys.path.append("./")
sys.path.append("../")

# FIXME
#from . import settings

class Log:
    # DEBUG = settings.DEBUG
    DEBUG = True
    sStartRecordTime = datetime.utcnow()
    PERFORMANCE_TEST_CAL_FROM_START = True

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

    @staticmethod
    def m(tag, message, startRecord=False):
        if not Log.DEBUG:
            return
        if startRecord:
            timeInterval = 0
        else:
            timeInterval = (datetime.utcnow() - Log.sStartRecordTime).microseconds

        if Log.PERFORMANCE_TEST_CAL_FROM_START:
            if startRecord:
                Log.sStartRecordTime = datetime.utcnow()
        else:
            Log.sStartRecordTime = datetime.utcnow()

        print("[Info][%s]: %s, interval: %d" %
                (tag, message, timeInterval))
