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
SAVE_FILE_PATH = '/Users/macs/tmp/file/'

def sleepRandom():
    time.sleep(REQUEST_DURATION_2 + random.randint(1, 5))

def deleteAllDirAndFile(top):
    for root, dirs, files in os.walk(top, topdown=False):
        for name in files:
            os.remove(os.path.join(root, name))
        for name in dirs:
            os.rmdir(os.path.join(root, name))

class FangtianxiaSpider(scrapy.Spider):
    name = "fang2"

    headers = {
        "Referer": "https://m.fang.com/esf/bj/",
    }

    mUrl = ''

    def init(self):
        if os.path.exists(SAVE_FILE_PATH):
            deleteAllDirAndFile(SAVE_FILE_PATH)
        if not os.path.exists(SAVE_FILE_PATH):
            os.makedirs(SAVE_FILE_PATH)

    def start_requests(self):
        self.init()

        urls = [
            # 'https://m.fang.com/esf/bj/FAGT_440511869.html?listtype=1&listsub=2',
            'https://m.fang.com/esf/bj_12/?purpose=%E4%BD%8F%E5%AE%85',
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
        new_urls = response.xpath('//ul[@id="content"]/li/a[@class="listtype"]/@href').extract()
        with open(SAVE_FILE_PATH + 'zone', 'a+') as f:
            idx = 0
            for url in new_urls:
                if url.startswith('//'):
                    url = 'http:' + url
                idx = idx + 1
                logger.debug('parseZonePage-1, start %d request url %s' % (idx, url))
                if not IsDebugOneRecord or IsDebugOneRecord and (idx == 2):
                    f.write('%d: %s\n' % (idx, url))
                    f.flush()
                    logger.debug('parseZonePage-2, time.sleep(30) , start %d request url %s' % (idx, url))
                    # sleepRandom()
                    # yield scrapy.Request(url=url, headers=self.headers, callback=self.parseHouseDetailPage)

        '''
        next_page_urls = response.xpath('//div[@class="f-page"]/div/div/a[@class="next"]/@href').extract()
        with open(SAVE_FILE_PATH + 'next_page', 'a+') as f:
            for url in next_page_urls:
                if url.startswith('//'):
                    url = 'http:' + url
                logger.debug('parseCityToZone-1-next-page, start request url %s' % url);
                idx = idx + 1
                if not IsDebugOneRecord or IsDebugOneRecord and idx == 1:
                    f.write(url)
                    f.write("\n")
                    logger.debug('parseCityToZone-2-next-page, time.sleep(30) , start %d request url %s' % (idx, url))
                    sleepRandom()
                    yield scrapy.Request(url=url, headers=self.headers, callback=self.parseZonePage)
        '''

    def parseHouseDetailPage(self, response):
        phones = response.xpath('//div[@class="floatTel"]/dl/dd/a/@href').extract()
        name = response.xpath('//div[@class="floatTel"]/dl/dt/p[@class="p1"]/text()').extract()
        company = response.xpath('//div[@class="floatTel"]/dl/dt/p[@class="p2"]/text()').extract()
        with open(SAVE_FILE_PATH + 'house', 'a+') as f:
            for phone in phones:
                if phone.startswith('javascript'):
                    continue
                data = {}
                tel_prefix = 'tel:'
                if phone.startswith(tel_prefix):
                    phone = phone[len(tel_prefix) : (len(phone) - 1)]
                data['phone'] = phone
                data['name'] = name
                data['company'] = company
                # time.sleep(30)
                data_str = json.dumps(data)
                logger.debug('parseHouseDetailPage, parsed phone: %s' % data_str)
                f.write(data_str)
                f.write("\n")
                f.flush()
