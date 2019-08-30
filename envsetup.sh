#!/bin/bash

export HAPPY_PATH=`pwd`
#echo "HAPPY_PATH: $HAPPY_PATH'"
export HAPPY_CLIENT_PATH="$HAPPY_PATH/test10"
export HAPPY_SERVER_PATH="$HAPPY_PATH/server/happy_inn"

alias cdhappy="cd $HAPPY_PATH"
alias cdclient="cd $HAPPY_CLIENT_PATH"
alias cdserver="cd $HAPPY_SERVER_PATH"

# export PATH=$PATH:$HAPPY_PATH/tools/bin/

function kill.process {
    if [[ `uname -a` =~ "Darwin" ]];then
        # mac os
        ps -ax | grep $1 |  awk '{print $1}' | xargs kill -9
    else
        # linux
        ps -aX | grep $1 |  awk '{print $1}' | xargs kill -9
    fi
}

function ps.process {
    if [[ `uname -a` =~ "Darwin" ]];then
        # mac os
        ps -ax | grep $1
    else
        # linux
        ps -aX | grep $1
    fi
}

function kill.adb {
  kill.process "logcat"
}

function ps.adb {
  ps.process "logcat"
}

function kill.npm {
  kill.process "npm"
}

function ps.npm {
  ps.process "npm"
}

function kill.runserver {
  kill.process "runserver"
}

function ps.runserver {
  ps.process "runserver"
}

function run.npm.h5 {
  ps.process "runserver"
}


export NPM_PORT_CONF=node_modules/@tarojs/webpack-runner/dist/config/devServer.conf.js

function rand() {
  min=$1
  max=$(($2-$min+1))
  num=$(($RANDOM+1000000000)) #增加一个10位的数再求余
  echo $(($num%$max+$min))
}
 
function run.npm.h5() {
  run.npm h5
}

function run.npm.weapp() {
  run.npm weapp
}

function run.npm() {
  rnd=$(rand 1 100)
  #echo $rnd
  rnd1=$(expr 10000 + $rnd)
  #echo $rnd1
  echo $rnd1 > /tmp/curr_port
  sed -i "s/port: .*/port: ${rnd1},/g" $HAPPY_CLIENT_PATH/$NPM_PORT_CONF
  cd $HAPPY_CLIENT_PATH
  npm run dev:$1&
}

function runserver() {
  cd $HAPPY_SERVER_PATH
  python manage.py runserver 0.0.0.0:8001&
}
