from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
from django.core import serializers
from urllib import request, parse
import json
import hashlib
# local
from .services import hh
from .services import qiwi_api_managment as qiwi_api
from .models import PaidVacancy


def index(req: HttpRequest):
    if req.method == 'GET':
        jobs, pages = hh.get_hh_jobs()
        jobs = hh.without_degree(jobs)
        jobs = hh.prepare_jobs(jobs)
        paid_vacancies = []
        for v in PaidVacancy.objects.all():
            paid_vacancies.append(v.serialize())
        print(paid_vacancies)
        context = {'jobs': json.dumps(jobs), 'paid': json.dumps(paid_vacancies), 'pages': pages}
        return render(req, 'index.html', context)


def load_jobs(req: HttpRequest):
    if req.method == 'POST':
        req_body = json.loads(req.body.decode('utf-8'))
        tags = req_body['tags']
        page = req_body['page']
        # get jobs by hhru api
        jobs, pages = hh.get_hh_jobs(tags, page)
        # we need only jobs that don't require a degree
        jobs = hh.without_degree(jobs)
        # make jobs look prettier
        jobs = hh.prepare_jobs(jobs)
        # prepare paid vacancies
        paid_vacancies = []
        tags_list = []
        tags_list.extend(tags['tech'])
        tags_list.extend(tags['type'])
        tags_list = [t.lower() for t in tags_list]
        for v in PaidVacancy.objects.all():
            for tag in json.loads(v.tags.lower()).values():
                print(tag)
                if any(t in tag for t in tags_list) or v.city == tags['city']:
                    paid_vacancies.append(v.serialize())
                    break
        print(len(paid_vacancies))
        return HttpResponse(json.dumps({'jobs': jobs, 'paid': paid_vacancies, 'pages': pages}))


def create_bill(req: HttpRequest):
    if req.method == "GET":
        return render(req, 'hiring.html')
    elif req.method == "POST":
        bill_id = json.loads(req.body.decode('utf-8'))
        pay_url = qiwi_api.bill(bill_id)
        return HttpResponse(json.dumps({'payUrl': pay_url}))


def verify_bill(req: HttpRequest):
    if req.method == "POST":
        bill_id = json.loads(req.body.decode('utf-8'))
        print(bill_id)
        is_paid = qiwi_api.is_paid(bill_id)
        return HttpResponse(json.dumps({'isPaid': is_paid}))


def get_job_by_link(req: HttpRequest):
    if req.method == "POST":
        req_body = json.loads(req.body.decode('utf-8'))
        job_link = req_body['jobLink']
        job = hh.get_hh_job(job_link)
        return HttpResponse(json.dumps({'job': job}))


def create_job(req: HttpRequest):
    if req.method == "POST":
        req_body = json.loads(req.body.decode('utf-8'))
        new_vacancy = PaidVacancy(
            name=req_body['name'],
            employer=req_body['employer'],
            employer_logo=req_body['employer_logo'],
            city=req_body['tags']['city'],
            tags=json.dumps({'tech': req_body['tags']['tech'], 'type': req_body['tags']['type']}),
            url=req_body['url'],
            date=req_body['date'],
            color='#FFFFFF'
        )
        new_vacancy.save()
        return HttpResponse()