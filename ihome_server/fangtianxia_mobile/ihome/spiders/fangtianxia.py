import scrapy
import logging
import time
import json

import signal

def handler(signum, frame):
    print "will exit!"
    exit(0)

signal.signal(signal.SIGINT, handler)

logger = logging.getLogger('FangtianxiaSpider')

REQUEST_DURATION = 30
# avoid two request sent simutaniously in parseCityToZone and parseZonePage
REQUEST_DURATION_1 = 39
REQUEST_DURATION_2 = 5
IsDebugOneRecord = True
SAVE_FILE_PATH = '/tmp/file/'

class FangtianxiaSpider(scrapy.Spider):
    name = "fang"

    headers = {
        "Referer": "https://m.fang.com/esf/bj/",
    }

    mUrl = ''

    def start_requests(self):
        urls = [
            # 'https://m.fang.com/esf/bj/FAGT_440511869.html?listtype=1&listsub=2',
            'https://m.fang.com/esf/bj_12/?purpose=%E4%BD%8F%E5%AE%85',
        ]
        for url in urls:
            # time.sleep(REQUEST_DURATION)
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
                    logger.debug('parseCityToZone-2, time.sleep(30) , start %d request url %s' % (idx, url))
                    time.sleep(REQUEST_DURATION_1)
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
                if not IsDebugOneRecord or IsDebugOneRecord and (idx == 1 or idx == 2):
                    f.write(url)
                    f.write("\n")
                    logger.debug('parseZonePage-2, time.sleep(30) , start %d request url %s' % (idx, url))
                    time.sleep(REQUEST_DURATION_2)
                    yield scrapy.Request(url=url, headers=self.headers, callback=self.parseHouseDetailPage)

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
                    time.sleep(REQUEST_DURATION_2)
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
