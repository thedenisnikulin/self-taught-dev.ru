import unittest
import re
# local
from services.hh_api_management import HeadHunterApiManager


class TestHeadHunterApiManager(unittest.TestCase):
    def setUp(self) -> None:
        self.jobs, self.pages = HeadHunterApiManager.get_jobs()

    def test_prepare_tags(self):
        pattern = r'^.+(AND).+(AND).+$'
        result = HeadHunterApiManager.prepare_tags({
            'tech': ['java', 'javascript'],
            'type': ['backend'],
            'city': 'Санкт-Петербург'
        })
        self.assertTrue(bool(re.match(pattern, result)))

    def test_get_jobs(self):
        self.assertEqual(type(self.pages), int)
        self.assertEqual(type(self.jobs), list)
        for r_job in self.jobs:
            self.assertEqual(type(r_job), dict)
        self.assertEqual(len(list(self.jobs[0].keys())), 24)

    def test_get_job(self):
        result_job = HeadHunterApiManager.get_job('https://hh.ru/vacancy/38278662')
        for v in result_job.values():
            self.assertIsNotNone(v)

    def test_without_degree(self):
        result_without_degree = HeadHunterApiManager.without_degree(self.jobs)
        avoid: list = ['высшее', 'образование', 'вуз', 'профильное', 'студент']
        for j in result_without_degree:
            expr: bool = not any([r in str(j) for r in avoid])
            self.assertTrue(expr)

    def test_prepare_jobs(self):
        result_prepared_jobs = HeadHunterApiManager.prepare_jobs(self.jobs)
        for j in result_prepared_jobs:
            [self.assertIsNotNone(p_j) for p_j in j.values()]




if __name__ == '__main__':
    unittest.main()
