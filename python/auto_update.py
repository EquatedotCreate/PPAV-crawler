#!/usr/bin/env python3

import time
import datetime
import schedule
from parser_info import ParserInfo

def job():
    mongo_uri = 'mongodb://localhost:27017/ppav'
    with open('../config.json') as fp:
        import json
        mongo_uri = json.load(fp)['MONGODB_PATH']

    parser = ParserInfo(mongo_uri)
    parser.parse_start()

def set_schedule():
    #schedule.every().seconds.do(job)
    #schedule.every().minutes.do(job)
    #schedule.every().hour.do(job)
    schedule.every().day.do(job)
    #schedule.every().week.do(job)

if __name__ == '__main__':
    job()
    set_schedule()
    while True:
        print("Time: {}".format(datetime.datetime.now()))
        schedule.run_pending()
        time.sleep(1*60*60*12)  # check schedule per 12 hrs
