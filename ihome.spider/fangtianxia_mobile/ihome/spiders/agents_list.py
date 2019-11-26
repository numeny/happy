# -*- coding: utf-8 -*-
import logging
import json
import os
import random
import scrapy
import sys
import time

import signal

sys.path.append('..')

def handler(signum, frame):
    print("will exit!")
    exit(0)

signal.signal(signal.SIGINT, handler)

logger = logging.getLogger('FangtianxiaSpider')

REQUEST_DURATION = 30
# avoid two request sent simutaniously in parseCityToZone and parseZonePage
REQUEST_DURATION_1 = 39
REQUEST_DURATION_2 = 5
IsDebugOneRecord = False
SAVE_FILE_PATH = '/tmp/file/'

def sleepRandom():
    time.sleep(REQUEST_DURATION_2 + random.randint(1, 5))

def deleteAllDirAndFile(top):
    for root, dirs, files in os.walk(top, topdown=False):
        for name in files:
            os.remove(os.path.join(root, name))
        for name in dirs:
            os.rmdir(os.path.join(root, name))

class FangPeopleSpider(scrapy.Spider):
    name = "fang"

    headers = {
        "Referer": "https://m.fang.com/esf/bj/",
    }

    mAgentBaseUrl = 'https://m.fang.com/agent/'

    def init(self):
        if os.path.exists(SAVE_FILE_PATH):
            deleteAllDirAndFile(SAVE_FILE_PATH)
        if not os.path.exists(SAVE_FILE_PATH):
            os.makedirs(SAVE_FILE_PATH)

        self.zone_file = open(SAVE_FILE_PATH + 'zones', 'a+');
        self.agent_file = open(SAVE_FILE_PATH + 'agents', 'a+');

    def start_requests(self):
        self.init()

        urls = [
            # 'https://m.fang.com/esf/bj/FAGT_440511869.html?listtype=1&listsub=2',
            # 'https://m.fang.com/agent/bj/',
            'https://m.fang.com/city/hotcity.jsp?city=cs&burl=/esf',
            # 'https://m.fang.com/agent/bj/d1c2652/',
            # 'http://m.fang.com/agent/bj/d1c3114/',
            # 'https://m.fang.com/agent/bj/d1c35/',
            # 'http://m.fang.com/agent/bj/d1c53/',
            # 'http://m.fang.com/agent/bj/d1c2649/',
            # 'http://m.fang.com/agent/bj/d1c2648/',
        ]
        for url in urls:
            sleepRandom()
            logger.debug('logger.debug, start_requests, start request url ');
            logger.debug('start_requests, start request url %s' % url)
            yield scrapy.Request(url=url, headers=self.headers,  callback=self.parseCities)

    def parseCities(self, response):
        cities_selector = response.xpath('//div[@class="tablebox"]/table/tr/td/a[@cncity]/@cncity').extract()
        if len(cities_selector) <= 0:
            logger.error('[Error] parseCities, no any city parsed!')
            return
        logger.debug('parseCities:')
        # logger.debug(cities_selector)
        for idx, city_desc in enumerate(cities_selector):
            city_desc_array = city_desc.split(',')
            if len(city_desc_array) != 2:
                continue
            city = city_desc_array[0]
            city_code = city_desc_array[1]
            if len(city) == 0 or len(city_code) == 0:
                continue
            logger.debug('parseCities-1, city: %s, %s' % (city, city_code))
            if not IsDebugOneRecord or IsDebugOneRecord and (idx == 0):
                sleepRandom()
                yield scrapy.Request(url=self.mAgentBaseUrl + city_code, headers=self.headers,  callback=self.parseCityToZone, meta={'city': city, 'city_code': city_code})


    def parseCityToZone(self, response):
        zones_selector = response.xpath('//section[@id="s_position"]/dl/dd/a[@data-id]')
        zones_id = zones_selector.xpath('@data-id').extract()
        zones_name = zones_selector.xpath('text()').extract()
        logger.debug('parseCityToZone, zones_id ')
        logger.debug(zones_id)
        logger.debug('parseCityToZone, zones_name ')
        logger.debug(zones_name)
        if len(zones_id) !=  len(zones_name):
            logger.error('[Error] parseCityToZone, zones_name and zones_id length is not equal! ')
            return

        try:
            city = response.meta['city']
        except KeyError:
            city = ''

        try:
            city_code = response.meta['city_code']
        except KeyError:
            city_code = ''

        for idx, zone_id in enumerate(zones_id):
            zone_name = zones_name[idx]
            path_xifen_zone = '//dl[@id="xifen_' + zone_id + '"]/dd/a[@data-id]'
            xifen_zones_selector = response.xpath(path_xifen_zone)
            xifen_zones_id = xifen_zones_selector.xpath('@data-id').extract()
            xifen_zones_name = xifen_zones_selector.xpath('text()').extract()
            xifen_zones_url = xifen_zones_selector.xpath('@href').extract()
            if len(xifen_zones_id) != len(xifen_zones_name) or len(xifen_zones_name) != len(xifen_zones_url):
                logger.error('[Error] parseCityToZone-2, xifen_zones_id and xifen_zones_name length is not equal! zone_name: %s' % zone_name)
                return
            request_idx = 0
            for idx2, xifen_zone_id in enumerate(xifen_zones_id):
                xifen_zone_name = xifen_zones_name[idx2]
                xifen_zone_url = xifen_zones_url[idx2]

                data = {}
                data['city'] = city.encode('utf8')
                data['city_code'] = city_code.encode('utf8')
                data['zone'] = zone_name.encode('utf8')
                data['zone_id'] = zone_id.encode('utf8')
                data['xifen_zone_name'] = xifen_zone_name.encode('utf8')
                data['xifen_zone_id'] = xifen_zone_id.encode('utf8')
                data_str = json.dumps(data)
                logger.debug('parseCityToZone, xifen_zone_name: %s' % xifen_zone_name)
                self.zone_file.write(data_str.encode('utf8'))
                self.zone_file.write("\n")
                self.zone_file.flush()

                if xifen_zone_url.startswith('//'):
                    xifen_zone_url = 'http:' + xifen_zone_url

                logger.debug('parseCityToZone, IsDebugOneRecord: %d, idx[%d %d]' % (IsDebugOneRecord, idx, idx2))
                if not IsDebugOneRecord or IsDebugOneRecord and (idx == 0) and (idx2 == 0):
                    sleepRandom()
                    logger.debug('parseCityToZone, start request xifen_zone_name: %s, url: %s' % (xifen_zone_name, xifen_zone_url))
                    yield scrapy.Request(url=xifen_zone_url, headers=self.headers, callback=self.parseAgentListPage, meta={'city': city, 'city_code': city_code, 'zone_name': zone_name, 'xifen_zone_name': xifen_zone_name})
                else:
                    break

    def parseAgentListPage(self, response):
        agents_selector = response.xpath('//ul[@id="content"]/li[@class="New"]')
        if len(agents_selector) <= 0:
            return
        agents_selector = agents_selector[0]
        phones = agents_selector.xpath('//div/a[@class="call"]/@href').extract()
        names = agents_selector.xpath('//div[@class="txt"]/h3/a/text()').extract()
        if len(phones) != len(names):
            logger.error('[Error] parseAgentListPage, phones and names length is not equal![%d %d]' % (len(phones), len(names)))
            return

        try:
            city = response.meta['city']
        except KeyError:
            city = ''

        try:
            city_code = response.meta['city_code']
        except KeyError:
            city_code = ''

        try:
            zone_name = response.meta['zone_name']
        except KeyError:
            zone_name = ''

        try:
            xifen_zone_name = response.meta['xifen_zone_name']
        except KeyError:
            xifen_zone_name = ''

        for idx, phone in enumerate(phones):
            if phone.startswith(u'javascript'):
                continue
            name = names[idx]

            other_infos = agents_selector.xpath('//div[@class="txt"]')[0].xpath('a/p/text()').extract()
            service_zone = other_infos[0]
            company = other_infos[1]

            company_prefix = u'所属公司：'
            if company.startswith(company_prefix):
                company = company[len(company_prefix) : len(company)]

            service_zone_prefix = u'服务商圈：'
            if service_zone.startswith(service_zone_prefix):
                service_zone = service_zone[len(service_zone_prefix) : len(service_zone)]

            phone_prefix = u'tel:'
            if phone.startswith(phone_prefix):
                phone = phone[len(phone_prefix) : len(phone)]

            data = {}
            data['city'] = city.encode('utf8')
            data['city_code'] = city_code.encode('utf8')
            data['zone'] = zone_name.encode('utf8')
            data['xifen_zone'] = xifen_zone_name.encode('utf8')
            data['name'] = name.encode('utf8')
            data['company'] = company.encode('utf8')
            data['phone'] = phone.encode('utf8')
            data['service_zone'] = service_zone.encode('utf8')
            # time.sleep(30)
            data_str = json.dumps(data)
            logger.debug('parseAgentListPage, parsed phone: %s' % data_str)
            self.agent_file.write(data_str.encode('utf8'))
            self.agent_file.write("\n")
            self.agent_file.flush()
