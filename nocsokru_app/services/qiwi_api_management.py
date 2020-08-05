import json
from urllib import request
import datetime
# local
from config import QIWI_SECRET, QIWI_THEME_CODE, QIWI_DEFAULT_AMOUNT
from ..models import PromoCode


class QiwiApiManager:
    @staticmethod
    def create_request(bill_id: str, method: str) -> request.Request:
        r = request.Request(f"https://api.qiwi.com/partner/bill/v1/bills/{bill_id}", method=method)
        r.add_header('Authorization',
                     f'Bearer {QIWI_SECRET}')
        r.add_header('Content-Type', 'application/json')
        r.add_header('Accept', 'application/json')
        return r

    @staticmethod
    def bill(bill_id: str, promocode: str = None) -> str:
        r = QiwiApiManager.create_request(bill_id, 'PUT')
        amount = QIWI_DEFAULT_AMOUNT
        if promocode:
            for p in PromoCode.objects.all():
                if p.text == promocode:
                    amount = p.amount
        expires_in_week = (datetime.datetime.now() + datetime.timedelta(days=7)).astimezone().replace(microsecond=0).isoformat()
        data = request.urlopen(r, data=bytes(
            json.dumps({
                "amount": {
                    "currency": "RUB",
                    "value": amount
                },
                "comment": "Рад сотрудничать!",
                "expirationDateTime": expires_in_week,
                "customer": {},
                "customFields": {
                    "themeCode": QIWI_THEME_CODE
                }
            }).encode()
        )).read()
        data = json.loads(data)
        return data['payUrl']

    @staticmethod
    def is_paid(bill_id: str) -> bool:
        r = QiwiApiManager.create_request(bill_id, 'GET')
        data = request.urlopen(r).read()
        data = json.loads(data)
        status = data['status']['value']
        print(status)
        if status == "PAID":
            return True
        return False
