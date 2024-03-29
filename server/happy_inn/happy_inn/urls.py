"""happy_inn URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views 1. Add an import:  from other_app.views import Home 2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home') Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin

from . import rh_data
from . import user_manager
from . import weapp_login

urlpatterns = [
    url(r'^get_rh_detail', rh_data.getRhDetail),
    url(r'^show_rh_list', rh_data.showRhList),
    url(r'^arealist', rh_data.areaList),

    url(r'^login', user_manager.login),
    url(r'^logout', user_manager.logout),
    url(r'^registerUser', user_manager.registerUser),
    url(r'^cf', user_manager.changeUserFavoriteRh),
    url(r'^gfl', user_manager.getUserFavoriteList),

    url(r'^weixinlogin', weapp_login.weixinlogin),
    url(r'^weixinlogin_test', weapp_login.weixinlogin_test),

    url(r'^admin/', admin.site.urls),
    url(r'^testdb', rh_data.testdb),
]
