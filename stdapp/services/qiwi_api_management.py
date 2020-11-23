import json
import urllib
import datetime
# local
from config import QIWI_SECRET, QIWI_THEME_CODE, QIWI_DEFAULT_AMOUNT
from ..models import PromoCode

class QiwiApiManager:
	def __init__(self, bill_id: str, method: str):
		self.request = urllib.request.Request(
			url=f"https://api.qiwi.com/partner/bill/v1/bills/{bill_id}", 
			method=method)
		self.request.add_header('Authorization',f'Bearer {QIWI_SECRET}')
		self.request.add_header('Content-Type', 'application/json')
		self.request.add_header('Accept', 'application/json')
	
	def bill(self, promocode: str = None) -> str:
		amount = QIWI_DEFAULT_AMOUNT
		if promocode:
			for p in PromoCode.objects.all():
				if p.text == promocode:
					amount = p.amount
					break
		expires_in_week = (
			datetime.datetime.now() + datetime.timedelta(days=7)
			).astimezone().replace(microsecond=0).isoformat()
		data = urllib.request.urlopen(self.request, data=bytes(
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
	
	def is_paid(self) -> bool:
		data = urllib.request.urlopen(self.request).read()
		data = json.loads(data)
		status = data['status']['value']
		if status == "PAID":
			return True
		return False
