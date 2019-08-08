# -*- coding: utf-8 -*-
import json
import sys

from django.http import HttpResponse
from json_response import JsonResponse
 
from rh.models import rh

sys.path.append("./")
sys.path.append("../")

# ErroCode_* .etc
from rh_const import *

from QueryParam import *
from RhDetailQuery import *
from RhListQuery import *
from AreaQuery import *

from settings import *

default_img = "/static/images/default.jpg"
LOGTAG = "RhData"

def login(request):
    if "username" in request.GET:
        print(request.GET["username"])
    if "password" in request.GET:
        print(request.GET["password"])
    return JsonResponse("Hello world ! ")

def registerUser(request):
    if "username" in request.GET:
        print(request.GET["username"])
    if "password" in request.GET:
        print(request.GET["password"])
    return JsonResponse("Hello world ! ")
