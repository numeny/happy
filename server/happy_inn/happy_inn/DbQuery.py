#!/usr/bin/python
# -*- coding: UTF-8 -*-
from Log import *
from Utils import *

class DbQuery:

    def __init__(self):
        pass

    @staticmethod
    def get_all_colume_from_one_record(record):
        ret_map = {}
        ret_map['id'] = Utils.get_rh_id_from_db(record.id)
        ret_map['name'] = record.rh_name
        ret_map['phone'] = record.rh_phone
        ret_map['mobile'] = record.rh_mobile
        ret_map['email'] = record.rh_email
        ret_map['postcode'] = record.rh_postcode
        ret_map['location_id'] = record.rh_location_id
        ret_map['type'] = record.rh_type
        ret_map['factory_property'] = record.rh_factory_property
        ret_map['person_in_charge'] = record.rh_person_in_charge
        ret_map['establishment_time'] = record.rh_establishment_time
        ret_map['floor_surface'] = record.rh_floor_surface
        ret_map['building_area'] = record.rh_building_area
        ret_map['bednum'] = record.rh_bednum
        ret_map['staff_num'] = record.rh_staff_num
        ret_map['for_persons'] = record.rh_for_persons
        ret_map['charges_extent'] = record.rh_charges_extent
        ret_map['special_services'] = record.rh_special_services
        ret_map['contact_person'] = record.rh_contact_person
        ret_map['address'] = record.rh_address
        ret_map['url'] = record.rh_url
        ret_map['transportation'] = record.rh_transportation
        ret_map['inst_intro'] = record.rh_inst_intro
        ret_map['inst_charge'] = record.rh_inst_charge
        ret_map['facilities'] = record.rh_facilities
        ret_map['service_content'] = record.rh_service_content
        ret_map['inst_notes'] = record.rh_inst_notes
        ret_map['ylw_id'] = record.rh_ylw_id
        ret_map['province'] = record.rh_privince
        ret_map['city'] = record.rh_city
        ret_map['area'] = record.rh_area
        ret_map['title_image'] = record.rh_title_image
        ret_map['images'] = record.rh_images
        ret_map['charges_min'] = record.rh_charges_min
        ret_map['charges_max'] = record.rh_charges_max
        ret_map['bednum_int'] = record.rh_bednum_int
        return ret_map

    @staticmethod
    def get_all_colume_from_records(records):
        ret_array = []
        for record in records:
            ret_array.append(DbQuery.get_all_colume_from_one_record(record))
        return ret_array
