from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
from django.core import serializers
import json
# local
from .services.hh import get_hh_jobs, without_degree, prepare_jobs


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