from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
import json
# local
from .services.hh_api_management import HeadHunterApiManager
from .services.qiwi_api_management import QiwiApiManager
from .models import PaidVacancy


def index(req: HttpRequest):
	if req.method == 'GET':
		vacancies, pages = HeadHunterApiManager.get_vacancies()
		vacancies = HeadHunterApiManager.filter_degree(vacancies)
		vacancies = HeadHunterApiManager.prettify_vacancies(vacancies)
		paid_vacancies = []
		for v in PaidVacancy.objects.all():
			paid_vacancies.append(v.serialize())
		context = {'vacancies': json.dumps(vacancies), 'paid': json.dumps(paid_vacancies), 'pages': pages}
		return render(req, 'index.html', context)


def load_vacancies(req: HttpRequest):
	if req.method == 'POST':
		req_body = json.loads(req.body.decode('utf-8'))
		tags = req_body['tags']
		page = req_body['page']
		# get jobs by hhru api
		vacancies, pages = HeadHunterApiManager.get_vacancies(tags, page)
		# we need only jobs that don't require a degree
		vacancies = HeadHunterApiManager.filter_degree(vacancies)
		# make jobs look prettier
		vacancies = HeadHunterApiManager.prettify_vacancies(vacancies)
		# prepare paid vacancies
		paid_vacancies = []
		tags_list = []
		tags_list.extend(tags['tech'])
		tags_list.extend(tags['type'])
		tags_list = [t.lower() for t in tags_list]
		for v in PaidVacancy.objects.all():
			for tag in json.loads(v.tags.lower()).values():
				if any(t in tag for t in tags_list) or v.city == tags['city']:
					paid_vacancies.append(v.serialize())
					break
		return HttpResponse(json.dumps({'vacancies': vacancies, 'paid': paid_vacancies, 'pages': pages}))


def create_bill(req: HttpRequest):
	if req.method == "GET":
		return render(req, 'hiring.html')
	elif req.method == "POST":
		req_body = json.loads(req.body.decode('utf-8'))
		bill_id = req_body['billId']
		promocode = req_body['promocode']
		qiwiapi = QiwiApiManager(bill_id, "PUT")
		pay_url = qiwiapi.bill(promocode)
		return HttpResponse(json.dumps({'payUrl': pay_url}))


def verify_bill(req: HttpRequest):
	if req.method == "POST":
		bill_id = json.loads(req.body.decode('utf-8'))
		qiwiapi = QiwiApiManager(bill_id, "GET")
		is_paid = qiwiapi.is_paid()
		return HttpResponse(json.dumps({'isPaid': is_paid}))


def get_vacancy_by_link(req: HttpRequest):
	if req.method == "POST":
		req_body = json.loads(req.body.decode('utf-8'))
		vacancy_link = req_body['vacancyLink']
		vacancy = HeadHunterApiManager.get_vacancy(vacancy_link)
		return HttpResponse(json.dumps({'vacancy': vacancy}))


def create_vacancy(req: HttpRequest):
	if req.method == "POST":
		req_body = json.loads(req.body.decode('utf-8'))
		new_vacancy = PaidVacancy(
			name=req_body['name'],
			employer=req_body['employer'],
			employer_logo=req_body['employer_logo'],
			city=req_body['tags']['city'],
			tags=json.dumps({
				'tech': req_body['tags']['tech'], 
				'type': req_body['tags']['type']}),
			url=req_body['url'],
			date=req_body['date'],
			color=req_body['color']
		)
		new_vacancy.save()
		return HttpResponse(status=204)
