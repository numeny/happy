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
IsDebugOneRecord = True
SAVE_FILE_PATH = '/Users/macs/tmp/file/'

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

    mUrl = ''

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
            'https://m.fang.com/agent/bj//',
        ]
        for url in urls:
            sleepRandom()
            logger.debug('logger.debug, start_requests, start request url ');
            logger.debug('start_requests, start request url %s' % url)
            yield scrapy.Request(url=url, headers=self.headers,  callback=self.parseZonePage)

    '''
    def parseCityToZone(self, response):
        logger.debug('parseCityToZone-2, time.sleep(30) , start request phone %s' % (phone))
        with open(SAVE_FILE_PATH + 'city', 'a+') as f:
            idx = 0
            for url in new_urls:
                if url.startswith('//'):
                    url = 'http:' + url
                logger.debug('parseCityToZone-1, start request url %s' % url);
                idx = idx + 1
                # first record is itself
                if not IsDebugOneRecord and idx != 1 or IsDebugOneRecord and idx == 2:
                # if idx == 2:
                    f.write(url)
                    f.write("\n")
                    f.flush()
                    logger.debug('parseCityToZone-2, time.sleep(30) , start %d request url %s' % (idx, url))
                    sleepRandom()
                    yield scrapy.Request(url=url, headers=self.headers, callback=self.parseZonePage)
    '''

    def parseZonePage(self, response):
        zones_selector = response.xpath('//section[@id="s_position"]/dl/dd/a[@data-id]')
        zones_id = zones_selector.xpath('@data-id').extract()
        zones_name = zones_selector.xpath('text()').extract()
        logger.debug('parseCityToZone-2, zones_id ')
        logger.debug(zones_id)
        logger.debug('parseCityToZone-2, zones_name ')
        logger.debug(zones_name)
        if len(zones_id) !=  len(zones_name):
            logger.error('[Error] parseCityToZone-2, zones_name and zones_id length is not equal! ')
            exit(1)
        for idx, zone_id in enumerate(zones_id):
            zone_name = zones_name[idx]
            path_xifen_zone = '//dl[@id="xifen_' + zone_id + '"]/dd/a[@data-id]'
            xifen_zones_selector = response.xpath(path_xifen_zone)
            xifen_zones_id = xifen_zones_selector.xpath('@data-id').extract()
            xifen_zones_name = xifen_zones_selector.xpath('text()').extract()
            xifen_zones_url = xifen_zones_selector.xpath('@href').extract()
            if len(xifen_zones_id) != len(xifen_zones_name) or len(xifen_zones_name) != len(xifen_zones_url):
                logger.error('[Error] parseCityToZone-2, xifen_zones_id and xifen_zones_name length is not equal! zone_name: %s' % zone_name)
                exit(1)
            request_idx = 0
            for idx2, xifen_zone_id in enumerate(xifen_zones_id):
                xifen_zone_name = xifen_zones_name[idx2]
                xifen_zone_url = xifen_zones_url[idx2]

                data = {}
                data['zone'] = zone_name
                data['zone_id'] = zone_id
                data['xifen_zone_name'] = xifen_zone_name
                data['xifen_zone_id'] = xifen_zone_id
                data_str = json.dumps(data)
                logger.debug('parseCityToZone, xifen_zone_name: %s' % xifen_zone_name)
                self.zone_file.write(data_str)
                self.zone_file.write("\n")
                self.zone_file.flush()

                if xifen_zone_url.startswith('//'):
                    xifen_zone_url = 'http:' + xifen_zone_url

                '''
                '''
                if not IsDebugOneRecord or IsDebugOneRecord and (idx == 1) and (idx2 == 1):
                    sleepRandom()
                    # , meta={'zone': zone_name, 'xifen_zone_name': xifen_zone_name}
                    yield scrapy.Request(url=xifen_zone_url, headers=self.headers, callback=self.parseAgentListPage)

    def parseAgentListPage(self, response):
        agents_selector = response.xpath('//ul[@id="content"]/li[@class="New"]')
        phones = agents_selector.xpath('//div/a[@class="call"]/@href').extract()
        names = agents_selector.xpath('//div[@class="txt"]/h3/a/text()').extract()
        if len(phones) != len(names):
            logger.error('[Error] parseAgentListPage, phones and names length is not equal![%d %d %d]' % (len(agents_selector), len(phones), len(names)))
            exit(1)
        for idx, phone in enumerate(phones):
            if phone.startswith('javascript'):
                continue
            name = names[idx]

            other_infos = agents_selector[idx].xpath('//div[@class="txt"]/a/p/text()').extract()
            service_zone = other_infos[0]
            company = other_infos[1]

            data = {}
            tel_prefix = 'tel:'
            if phone.startswith(tel_prefix):
                phone = phone[len(tel_prefix) : (len(phone) - 1)]
            data['phone'] = phone
            data['name'] = name
            data['company'] = company
            data['service_zone'] = service_zone
            # time.sleep(30)
            data_str = json.dumps(data)
            logger.debug('parseAgentListPage, parsed phone: %s' % data_str)
            self.agent_file.write(data_str)
            self.agent_file.write("\n")
            self.agent_file.flush()
