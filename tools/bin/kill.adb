#!/bin/bash
ps -aX | grep "db shell logcat" |  awk '{print $1}' | xargs kill -9
