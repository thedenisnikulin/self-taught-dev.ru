from typing import Tuple
from urllib import request, parse
import json

url = "https://api.hh.ru"
job_tag_aliases = {
    'type': {
        'fullstack': ['fullstack', 'full-stack', 'full stack'],
        'frontend': ['frontend', 'front-end', 'фронтенд'],
        'backend': ['backend', 'back-end'],
        'mobile': ['mobile', 'ios', 'android'],
        'junior': ['junior', 'джуниор', 'младший'],
    },
    'tech': {
        'python': ['python'],
        'java': ['java ', 'java/', 'java-', 'java,'],  # those symbols at the end are important not to get JS jobs
        'javascript': ['javascript', 'js'],
        'c#': ['c#', 'с#'],     # some employers use cyrillic 'c', so double check
        'c++': ['c++', 'с++'],  # yet another 'c' double check
        'go': ['go', 'golang'],
        'php': ['php']
    }
}


def prepare_tags(tags: dict) -> str:
    for tag in tags.values():
        # to lower case
        tag = [t.lower() for t in tag]

    # AND & OR - operators from hh.ru api
    type_tag = f"({' OR '.join(tags['type'])})" if ('type' in tags.keys()) and (len(tags['type']) != 0) else ''
    tech_tag = f"({' OR '.join(tags['tech'])})" if ('tech' in tags.keys()) and (len(tags['tech']) != 0) else ''
    city_tag = tags['city']
    print(tags['city'])
    # if both are empty, just fill in 'developer', 'cos we don't want to have an empty query
    if type_tag + tech_tag + city_tag == '':
        type_tag = 'developer OR разработчик OR программист'

    return f"{type_tag} AND {tech_tag} AND {city_tag}"


def get_hh_jobs(tags=None , page: int = 1) -> Tuple[list, int]:
    if tags is None:
        tags = {'type': ['developer OR разработчик OR программист'], 'city': ''}
    jobs = []               # jobs to be received
    pages = 1               # pages to be received
    querystring = dict()    # querystring that we will construct

    # prepare tags
    tags_str = prepare_tags(tags)
    print(tags_str)

    # update querystring according to hh.ru api specification
    querystring['text'] = tags_str      # set text
    querystring['page'] = page          # set page
    querystring['per_page'] = 10        # 10 jobs per page by default
    querystring['specialization'] = 1   # specialization - "Информационные технологии, интернет, телеком" (id = 1)
    # encode querystring
    querystring = parse.urlencode(querystring)
    # send request to hh.ru api and get data
    with request.urlopen(f'{url}/vacancies?{querystring}') as response:
        data = response.read()
        data = json.loads(data)
        jobs.extend(data['items'])
        pages = int(data['pages'])
    return jobs, pages


def without_degree(jobs: list):
    no_degree_jobs = []
    avoid = ['высшее', 'образование', 'вуз', 'профильное', 'студент']
    for job in jobs:
        requirements = job['snippet']['requirement']
        try:
            requirements = requirements.lower()
            description = ''
            with request.urlopen(job['url']) as response:
                description = json.loads(response.read())['description']
            if not any([r in requirements+description for r in avoid]):
                no_degree_jobs.append(job)
        except AttributeError:
            # since not every job posting on hh.ru has requirements,
            # we can just skip ones without it
            pass
    return no_degree_jobs


def prepare_jobs(jobs: list):
    prepared_jobs = []
    for job in jobs:
        # get a set of tags that job name may contain. (we use set to exclude repetitive ones)
        type_tags = set([tag for tag, aliases in job_tag_aliases['type'].items()
                         for alias in aliases if alias in (job['name'] + job['snippet']['requirement']).lower()])
        tech_tags = set([tag for tag, aliases in job_tag_aliases['tech'].items()
                         for alias in aliases if alias in (job['name'] + job['snippet']['requirement']).lower()])
        prepared_jobs.append({
            'name': job['name'],
            'employer': job['employer']['name'],
            'employer_logo': job['employer']['logo_urls']['90'] if job['employer']['logo_urls'] is not None else '/static/nophoto.png',
            'city': job['area']['name'],
            'tags': {'type': list(type_tags), 'tech': list(tech_tags)}, # back to list to make JSON serialization easier
            'url': job['alternate_url'],
            'date': job['published_at'][:10],
        })
    return prepared_jobs