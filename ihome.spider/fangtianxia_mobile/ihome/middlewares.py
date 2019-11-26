# -*- coding: utf-8 -*-

# Define here the models for your spider middleware
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/spider-middleware.html

import logging
import re
import selenium
import time

from scrapy import signals
from scrapy.http.response.html import HtmlResponse
from selenium import webdriver

logger = logging.getLogger('IhomeDownloaderMiddleware')

class IhomeSpiderMiddleware(object):
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the spider middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_spider_input(self, response, spider):
        # Called for each response that goes through the spider
        # middleware and into the spider.

        # Should return None or raise an exception.
        return None

    def process_spider_output(self, response, result, spider):
        # Called with the results returned from the Spider, after
        # it has processed the response.

        # Must return an iterable of Request, dict or Item objects.
        for i in result:
            yield i

    def process_spider_exception(self, response, exception, spider):
        # Called when a spider or process_spider_input() method
        # (from other spider middleware) raises an exception.

        # Should return either None or an iterable of Response, dict
        # or Item objects.
        pass

    def process_start_requests(self, start_requests, spider):
        # Called with the start requests of the spider, and works
        # similarly to the process_spider_output() method, except
        # that it doesn’t have a response associated.

        # Must return only requests (not items).
        for r in start_requests:
            yield r

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)


class IhomeDownloaderMiddleware(object):
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the downloader middleware does not modify the
    # passed objects.

    def __init__(self):
        option = webdriver.ChromeOptions()
        # option.add_argument('--user-data-dir=/Users/macs/Library/Application Support/Google/Chrome/Default')
        # option.add_argument('--user-data-dir=/Users/macs/tmp/Default')
        option.add_argument('--user-agent=iphone')
        self.driver = webdriver.Chrome(chrome_options=option,
            executable_path='/home/bdg/ssd/dl/chromium/taro/chromium_68/happy/ihome.spider/fangtianxia_mobile/tools/chromedriver_linux64/chromedriver')
            # mac os
            # executable_path='/Users/macs/tools/chromedriver/chromedriver')
        

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def scrollToBottom(self):
      # js控制浏览器滚动到底部js
        js = """
        function scrollToBottom() {
          // var t = document.body.clientHeight;
          var t = document.getElementsByTagName("body")[0].scrollHeight;
          window.scroll({top:t, left:0, behavior:'smooth' });
        };
        scrollToBottom()
        """
        # headless无界面模式
        # chrome_options.add_argument("--headless")
        # 执行js滚动浏览器窗口到底部
        self.driver.execute_script(js)
        time.sleep(2)
      
    def closeDownloadAppWindow(self):
        try:
            tags_btn = self.driver.find_element_by_xpath("//div[@class='main']/div/div/p[@class='goOn']")
            tags_btn.click()
            # time.sleep(1)
        except:
            pass

    def clickLoadMoreView(self):
        try:
            tags_btn = self.driver.find_element_by_xpath("//div[@class='main']/div[@id='drag']/span")
            tags_btn.click()
            time.sleep(2)
            logger.debug('bdg, clickLoadMoreView ! OK');
        except:
            logger.debug('bdg, clickLoadMoreView ! No Element');
            pass

    def hasLoadMoreView(self):
        logger.debug('bdg, hasLoadMoreView start');
        try:
            tags_btn = self.driver.find_element_by_xpath("//div[@class='main']/div[@id='drag' and @style='display: none;']/span")
        except selenium.common.exceptions.NoSuchElementException:
            try:
                tags_btn = self.driver.find_element_by_xpath("//div[@class='main']/div[@id='drag']/span")
            except selenium.common.exceptions.NoSuchElementException:
                logger.debug('bdg, hasLoadMoreView-1 False');
                return False
            except Exception:
                logger.debug('bdg, hasLoadMoreView-2 False');
                return False
            if tags_btn != None:
                logger.debug('bdg, hasLoadMoreView-9 True');
                return True
            else:
                logger.debug('bdg, hasLoadMoreView-4 False');
                return False
        else:
            logger.debug('bdg, hasLoadMoreView-3 False');
            return False

    def loadAllData(self):
        logger.debug('bdg, loadAllData start');
        self.closeDownloadAppWindow()
        self.clickLoadMoreView()
        self.closeDownloadAppWindow()
        for idx in range(1, 100):
            logger.debug('bdg, loadAllData, scroll idx %s' % idx);
            self.scrollToBottom()
            self.closeDownloadAppWindow()
            if not self.hasLoadMoreView():
                break
        '''
        '''

    def process_request(self, request, spider):
        # Called for each request that goes through the downloader
        # middleware.

        # Must either:
        # - return None: continue processing this request
        # - or return a Response object
        # - or return a Request object
        # - or raise IgnoreRequest: process_exception() methods of
        #   installed downloader middleware will be called

        # 'd1c2652' in 'https://m.fang.com/agent/bj/d1c2652/'
        logger.debug('bdg, start_requests, start request url %s' % request.url);
        if re.search(r'd[0-9]+c[0-9]+', request.url) == None:
            return None
        logger.debug('bdg, start_requests, start request continuely url %s' % request.url);
        self.driver.get(request.url)
        time.sleep(3)

        self.loadAllData()

        source = self.driver.page_source
        response = HtmlResponse(url=self.driver.current_url,body=source,request=request,encoding='utf-8')
        return response

    def process_response(self, request, response, spider):
        # Called with the response returned from the downloader.

        # Must either;
        # - return a Response object
        # - return a Request object
        # - or raise IgnoreRequest
        return response

    def process_exception(self, request, exception, spider):
        # Called when a download handler or a process_request()
        # (from other downloader middleware) raises an exception.

        # Must either:
        # - return None: continue processing this exception
        # - return a Response object: stops process_exception() chain
        # - return a Request object: stops process_exception() chain
        pass

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)
