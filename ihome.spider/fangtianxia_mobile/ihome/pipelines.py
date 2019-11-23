# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html

import json

import my_const

class IhomePipeline(object):
    def __init__(self):
        self.phones_set = set()
        self.file = open(my_const.SAVE_FILE_PATH + DATA_FILE_NAME, 'wb')

    def process_item(self, item, spider):
        if item['phone'] in self.phones_set:
            raise DropItem("Duplicate item found: %s" % item)
        else:
            self.phones_set.add(item['phone'])

            line = json.dumps(dict(item)) + "\n"
            self.file.write(line)
        return item
