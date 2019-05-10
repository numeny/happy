# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class rh(models.Model):
#    name = models.CharField(max_length=20)

#    rh_id INT UNSIGNED AUTO_INCREMENT,\
    rh_name = models.TextField()
    rh_phone = models.TextField()
    rh_mobile = models.TextField()
    rh_email = models.TextField()
    rh_postcode = models.TextField()
    rh_location_id = models.TextField()
    rh_type = models.TextField()
    rh_factory_property = models.TextField()
    rh_person_in_charge = models.TextField()
    rh_establishment_time = models.TextField()
    rh_floor_surface = models.TextField()
    rh_building_area = models.TextField()
    rh_bednum = models.TextField()
    rh_staff_num = models.TextField()
    rh_for_persons = models.TextField()
    rh_charges_extent = models.TextField()
    rh_special_services = models.TextField()
    rh_contact_person = models.TextField()
    rh_address = models.TextField()
    rh_url = models.TextField()
    rh_transportation = models.TextField()
    rh_inst_intro = models.TextField()
    rh_inst_charge = models.TextField()
    rh_facilities = models.TextField()
    rh_service_content = models.TextField()
    rh_inst_notes = models.TextField()
    rh_ylw_id = models.TextField()
    rh_privince = models.TextField()
    rh_city = models.TextField()
    rh_area = models.TextField()
    rh_title_image = models.TextField(default="")
    rh_images = models.TextField(default="")

    rh_charges_min = models.IntegerField(default=0)
    rh_charges_max = models.IntegerField(default=1000000)
    rh_bednum_int = models.IntegerField(default=0)

class city(models.Model):
    privince = models.TextField()
    city = models.TextField()
    area = models.TextField()
