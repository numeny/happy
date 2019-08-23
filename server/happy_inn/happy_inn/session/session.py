#!/usr/bin/python
# -*- coding: UTF-8 -*-
from Log import *

class Session(object):
    LOGTAT = "Session"

    def __init__(self):
        self.__sessionId = -1
        self.__uid = -1
