import scrapy
import logging
import time
import json

import signal

def handler(signum, frame):
    print "will exit!"
    exit(0)

signal.signal(signal.SIGINT, handler)

logger = logging.getLogger('GanjiSpider')

REQUEST_DURATION = 30
# avoid two request sent simutaniously in parseCityToZone and parseZonePage
REQUEST_DURATION_1 = 39
REQUEST_DURATION_2 = 59
IsDebugOneRecord = False
SAVE_FILE_PATH = '/tmp/file/'

class GanjiSpider(scrapy.Spider):
    name = "ganji"

    headers = {
        "Referer": "http://bj.ganji.com/",
    }

    mUrl = ''

    def start_requests(self):
        urls = [
             # 'http://bj.ganji.com/ershoufang/40064971033632x.shtml?ding=https://short.58.com/zd_p/ff55cdd7-9aa4-44a9-8b23-9f1e0b96b84f/?target=dc-16-xgk_psfegvimob_54495207488983q-feykn&end=end',
             # 'http://bj.ganji.com/changping/ershoufang/',
             'http://bj.ganji.com/ershoufang/',
             # 'http://bj.ganji.com/chaoyang/ershoufang/',
             # 'http://bj.ganji.com/ershoufang/40221271863197x.shtml?ding=https://short.58.com/zd_p/6bae7902-aeb8-47e4-97e1-021e4e74921b/?target=dc-16-xgk_psfegvimob_54337307698720q-feykn&end=end',
        ]
        for url in urls:
            # time.sleep(REQUEST_DURATION)
            logger.debug('logger.debug, start_requests, start request url ');
            logger.debug('start_requests, start request url %s' % url);
            logger.debug('start_requests, start request url %s' % url)
            yield scrapy.Request(url=url, headers=self.headers,  callback=self.parseCityToZone)

    def parseCityToZone(self, response):
        '''
        '''
        new_urls = response.xpath('//dd/div/ul[@class="f-clear"]/li/a/@href').extract()
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
                    logger.debug('parseCityToZone-2, time.sleep(30) , start %d request url %s' % (idx, url))
                    time.sleep(REQUEST_DURATION_1)
                    yield scrapy.Request(url=url, headers=self.headers, callback=self.parseZonePage)

    def parseZonePage(self, response):
        new_urls = response.xpath('//dl/dd[@class="dd-item title"]/a/@href').extract()
        with open(SAVE_FILE_PATH + 'zone', 'a+') as f:
            idx = 0
            for url in new_urls:
                if url.startswith('//'):
                    url = 'http:' + url
                idx = idx + 1
                logger.debug('parseZonePage-1, start %d request url %s' % (idx, url))
                if not IsDebugOneRecord or IsDebugOneRecord and (idx == 1 or idx == 2):
                    f.write(url)
                    f.write("\n")
                    logger.debug('parseZonePage-2, time.sleep(30) , start %d request url %s' % (idx, url))
                    time.sleep(REQUEST_DURATION_2)
                    yield scrapy.Request(url=url, headers=self.headers, callback=self.parseHouseDetailPage)

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
                    time.sleep(REQUEST_DURATION_2)
                    yield scrapy.Request(url=url, headers=self.headers, callback=self.parseZonePage)

    def parseHouseDetailPage(self, response):
        phones = response.xpath('//div/div[@class="phone"]/a/text()').extract()
        name = response.xpath('//div[@class="card-user"]/div/div/div[@class="name"]/a/text()').extract()
        company = response.xpath('//div[@class="user-info-top"]/div[@class="user_other"]/span[@class="company"]/text()').extract()
        with open(SAVE_FILE_PATH + 'house', 'a+') as f:
            for phone in phones:
                data = {}
                data['phone'] = phone
                data['name'] = name
                data['company'] = company
                # time.sleep(30)
                data_str = json.dumps(data)
                logger.debug('parseHouseDetailPage, parsed phone: %s' % data_str)
                f.write(data_str)
                f.write("\n")
                f.flush()
