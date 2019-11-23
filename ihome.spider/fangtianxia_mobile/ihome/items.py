# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy

class IhomeItem(scrapy.Item):
    # define the fields for your item here like:
    province = scrapy.Field()
    city = scrapy.Field()
    zone = scrapy.Field()
    name = scrapy.Field()
    phone = scrapy.Field()
    company = scrapy.Field()
