import json
from urllib import request

def set_api_request(bill_id: str, method: str) -> request.Request:
    r = request.Request(f"https://api.qiwi.com/partner/bill/v1/bills/{bill_id}", method=method)
    r.add_header('Authorization',
                 'Bearer eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6IjZ5c2xyNy0wMCIsInVzZXJfaWQiOiI3OTUyNzg2NjIwNyIsInNlY3JldCI6IjM2YWQ1ZGZjYzVkYzI2MWFmYjgwMmJkOTU2NGFmZGM3NzIzYTRlYmFjNmEyNGE5Njc5MzkzOWU5ZWZlNTBjNmMifX0=')
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
            "comment": "Найс бро",
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

