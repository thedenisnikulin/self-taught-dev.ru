from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
from django.core import serializers
from urllib import request, parse
import json
import hashlib
# local
from .services.hh import get_hh_jobs, without_degree, prepare_jobs
from .services import qiwi_api_managment as qiwi_api


def main(req: HttpRequest):
    if req.method == 'GET':
        jobs, pages = get_hh_jobs()
        jobs = without_degree(jobs)
        jobs = prepare_jobs(jobs)
        context = {'jobs': json.dumps(jobs), 'pages': pages}
        return render(req, 'index.html', context)


def load_jobs(req: HttpRequest):
    if req.method == 'POST':
        req_body = json.loads(req.body.decode('utf-8'))
        tags = req_body['tags']
        page = req_body['page']
        # get jobs by hhru api
        jobs, pages = get_hh_jobs(tags, page)
        # we need only jobs that don't require a degree
        jobs = without_degree(jobs)
        # make jobs look prettier
        jobs = prepare_jobs(jobs)
        [print(j['city']) for j in jobs]
        return HttpResponse(json.dumps({'jobs': jobs, 'pages': pages}))


def create_job(req: HttpRequest):
    if req.method == "GET":
        return render(req, 'hiring.html')
    elif req.method == "POST":
        bill_id = json.loads(req.body.decode('utf-8'))
        # bill_id = hashlib.sha256(str(job).encode()).hexdigest()
        print(bill_id)
        redirect_url = f'{req.scheme}://{req.get_host()}/jobs/verify?id={bill_id}'
        print(redirect_url)
        pay_url = f"{qiwi_api.bill(bill_id)}&{parse.urlencode({'successUrl': redirect_url, 'allowedPaySources': 'qw'})}"
        return HttpResponse(json.dumps({'payUrl': qiwi_api.bill(bill_id)}))


def verify_job(req: HttpRequest):
    if req.method == 'GET':
        bill_id = req.GET.get('id')
        print(bill_id)
        if qiwi_api.is_paid(bill_id):
            # do some database logic
            pass
        return HttpResponse(json.dumps({'is_paid': qiwi_api.is_paid(bill_id)}))
    elif req.method == "POST":
        bill_id = json.loads(req.body.decode('utf-8'))
        print(bill_id)
        is_paid = qiwi_api.is_paid(bill_id)
        return HttpResponse(json.dumps({'is_paid': is_paid}))