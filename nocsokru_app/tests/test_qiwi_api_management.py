import unittest
from urllib import request
import re
# local
from services.qiwi_api_management import QiwiApiManager


class TestQiwiApiManager(unittest.TestCase):
    def setUp(self) -> None:
        self.bill_id = 'testing'

    def test_create_request(self):
        result_request = QiwiApiManager.create_request(self.bill_id, 'GET')
        self.assertEqual(type(result_request), request.Request)
        self.assertEqual(result_request.full_url, f'https://api.qiwi.com/partner/bill/v1/bills/{self.bill_id}')

    def test_bill(self):
        result_pay_url = QiwiApiManager.bill(self.bill_id)
        pattern = r'(https://oplata\.qiwi\.com/form/\?invoice_uid)=.+'
        self.assertTrue(bool(re.match(pattern, result_pay_url)))

    def test_is_paid(self):
        result_is_paid = QiwiApiManager.is_paid(self.bill_id)
        self.assertFalse(result_is_paid)