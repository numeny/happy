import scrapy
import logging
import time

logger = logging.getLogger('QuotesSpider')

class GanjiSpider(scrapy.Spider):
    name = "ganji"

    headers = {
        "Referer": "http://bj.ganji.com/",
    }

    def start_requests(self):
        urls = [
             # 'http://bj.ganji.com/ershoufang/40064971033632x.shtml?ding=https://short.58.com/zd_p/ff55cdd7-9aa4-44a9-8b23-9f1e0b96b84f/?target=dc-16-xgk_psfegvimob_54495207488983q-feykn&end=end',
             # 'http://bj.ganji.com/changping/ershoufang/',
             'http://bj.ganji.com/ershoufang/',
             # 'http://bj.ganji.com/chaoyang/ershoufang/',
             # 'http://bj.ganji.com/ershoufang/40221271863197x.shtml?ding=https://short.58.com/zd_p/6bae7902-aeb8-47e4-97e1-021e4e74921b/?target=dc-16-xgk_psfegvimob_54337307698720q-feykn&end=end',
        ]
        for url in urls:
            # time.sleep(30)
            logger.warning('logger.warning, start_requests, start request url ');
            logger.warning('start_requests, start request url %s' % url);
            self.log('start_requests, start request url %s' % url)
            yield scrapy.Request(url=url, headers=self.headers,  callback=self.parseCityToZone)

    def parseCityToZone(self, response):
        '''
        page = response.url.split("/")[-2]
        filename = 'quotes-%s.html' % page
        '''
        filename = '/tmp/city'
        new_urls = response.xpath('//dd/div/ul[@class="f-clear"]/li/a/@href').extract()
        with open(filename, 'wb') as f:
            idx = 0
            for i in new_urls:
                self.log('parseCityToZone, time.sleep(30)')
                time.sleep(30)
                j = i
                if i.startswith('\/\/'):
                    j = 'http' + i 
                f.write(j)
                logger.warning('parseCityToZone, start request url %s' % j);
                f.write("\n")
                idx = idx + 1
                if idx == 1:
                    self.log('parseCityToZone, start request url %s' % j)
                    yield scrapy.Request(url=j, headers=self.headers, callback=self.parseZonePage)
        self.log('Saved file %s' % filename)

    def parseZonePage(self, response):
        filename = '/tmp/zone'
        new_urls = response.xpath('//dl/dd[@class="dd-item title"]/a/@href').extract()
        with open(filename, 'wb') as f:
            idx = 0
            for i in new_urls:
                time.sleep(30)
                if i.startswith('\/\/'):
                    i = 'http' + i 
                f.write(i)
                f.write("\n")
                idx = idx + 1
                if idx == 1:
                    self.log('parseZonePage, time.sleep(30)')
                    self.log('parseZonePage, start request url %s' % i)
                    yield scrapy.Request(url=i, headers=self.headers, callback=self.parseHouseDetailPage)
        self.log('Saved file %s' % filename)

    def parseHouseDetailPage(self, response):
        filename = '/tmp/house'
        phones = response.xpath('//div/div[@class="phone"]/a/text()').extract()
        with open(filename, 'wb') as f:
            for i in phones:
                # time.sleep(30)
                f.write(i)
                f.write("\n")
                self.log('parseHouseDetailPage, parsed phone: %s' % i)
        self.log('Saved file %s' % filename)
