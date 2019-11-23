#!/bin/bash

export IHOME_SCRAPY_PATH=`pwd`

alias cdfang="cd ${IHOME_SCRAPY_PATH}/fangtianxia_mobile/ihome/"

function sfang() {
  cd ${IHOME_SCRAPY_PATH}/fangtianxia_mobile/ihome/
  scrapy crawl fang
}
