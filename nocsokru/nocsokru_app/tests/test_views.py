from django.test import TestCase
from django.urls import reverse
import json


class TestViews(TestCase):
    def setUp(self):
        pass

    def test_index(self):
        url = reverse('')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'index.html')
        print(response.body)
        print(response.GET)