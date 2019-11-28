# -*- coding: utf-8 -*-

import json

SAVE_FILE_PATH='./'
FILE_NAME='agents_bj'

class DataHandler():
    def __init__(self):
        self.phones_seen = set()
        self.handledData = []
        self.handlAllData()

    def handlAllData(self):
        allData = []
        with open(SAVE_FILE_PATH + FILE_NAME, 'r') as f:
            lines = f.readlines()
            idx = 0
            for line in lines:
                idx = idx + 1
                try:
                    rec_dict = json.loads(line)
                except ValueError:
                    print('[Error] Not json Data !')
                    continue

                if 'phone' in rec_dict:
                    if rec_dict['phone'] in self.phones_seen:
                        # print('[Warning] Drop line [%d], phone: %s' % (idx, rec_dict['phone']))
                        # print(rec_dict)
                        pass
                    else:
                        self.phones_seen.add(rec_dict['phone'])
                        self.handledData.append(rec_dict)
                        # print(rec_dict['phone'])
                else:
                    print('[Error]line %d has no key of "phone"!' % idx)

    def getAllPhones(self):
        return self.phones_seen

    def printAllPhones(self):
        for idx, phone in enumerate(self.phones_seen):
            print(phone)

    def printAllHandledData2(self, zone):
        print('Zone: %s\n' % zone)
        i = 0
        str_line = ''
        for idx, line in enumerate(self.handledData):
            if 'phone' in line:
                if 'zone' in line and line['zone'].encode('utf8') == zone:
                    str_line = str_line + line['phone'].encode('utf8') + ', '
                    i = i + 1
                    if i % 10 == 0:
                        print('%d' % (i/10))
                        print(str_line)
                        str_line = ''
            else:
                print('[Error]line %d has no key of "phone"!' % idx)
        if i % 10 != 0:
            print('%d' % (i/10+1))
            print(str_line)

    def printAllHandledData(self, phone_only):
        print('All zone data: phone_only %d \n' % phone_only)
        for idx, line in enumerate(self.handledData):
            if 'phone' in line:
                if phone_only:
                    print(line['phone'].encode('utf8'))
                else:
                    print(line)
            else:
                print('[Error]line %d has no key of "phone"!' % idx)

handler = DataHandler()
# handler.printAllPhones()
# handler.printAllHandledData(True)
handler.printAllHandledData2('海淀')
