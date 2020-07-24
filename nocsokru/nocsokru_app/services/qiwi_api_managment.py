import json
from urllib import request
# local
from ..config import QIWI_SECRET
# TODO make a class of it
def set_api_request(bill_id: str, method: str) -> request.Request:
    r = request.Request(f"https://api.qiwi.com/partner/bill/v1/bills/{bill_id}", method=method)
    r.add_header('Authorization',
                 f'Bearer {QIWI_SECRET}')
    r.add_header('Content-Type', 'application/json')
    r.add_header('Accept', 'application/json')
    return r


def bill(bill_id: str) -> str:
    r = set_api_request(bill_id, 'PUT')
    data = request.urlopen(r, data=bytes(
        json.dumps({
            "amount": {
                "currency": "RUB",
                "value": "1.00"
            },
            "comment": "Рад сотрудничать!",
            # TODO generic date
            "expirationDateTime": "2020-09-10T09:02:00+03:00",
            "customer": {},
            "customFields": {
                "themeCode": "Denys-NE7by9tG8n"
            }
        }).encode()
    )).read()
    data = json.loads(data)
    return data['payUrl']


def is_paid(bill_id: str) -> bool:
    r = set_api_request(bill_id, 'GET')
    data = request.urlopen(r).read()
    data = json.loads(data)
    status = data['status']['value']
    print(status)
    if status == "PAID":
        return True
    return False
