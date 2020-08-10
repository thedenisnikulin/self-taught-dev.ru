from typing import Tuple
from urllib import request, parse
import json
# local
from .constants import URL, VACANCY_TAGS


class HeadHunterApiManager:
    @staticmethod
    def prepare_tags(tags: dict) -> str:
        for k in tags.keys():
            # to lower case
            tags[k] = [t.lower() for t in tags[k]] if type(tags[k]) is list else tags[k].lower()
        # AND & OR - operators from hh.ru api
        type_tag = f"({' OR '.join(tags['type'])})" if ('type' in tags.keys()) and (len(tags['type']) != 0) else ''
        tech_tag = f"({' OR '.join(tags['tech'])})" if ('tech' in tags.keys()) and (len(tags['tech']) != 0) else ''
        city_tag = tags['city']
        # if both are empty, just fill in 'developer', 'cos we don't want to have an empty query
        if type_tag + tech_tag + city_tag == '':
            type_tag = 'developer OR разработчик OR программист'

        return f"{type_tag} AND {tech_tag} AND {city_tag}"

    @staticmethod
    def get_vacancies(tags=None, page: int = 1) -> Tuple[list, int]:
        if tags is None:
            tags = {'type': ['developer', 'разработчик', 'программист'], 'city': ''}
        vacancies = []  # vacancies to be received
        pages = 1  # pages to be received
        querystring = dict()  # querystring that we will construct

        # prepare tags
        tags_str = HeadHunterApiManager.prepare_tags(tags)

        # update querystring according to hh.ru api specification
        querystring['text'] = tags_str  # set text
        querystring['page'] = page  # set page
        querystring['per_page'] = 10  # 10 vacancies per page by default
        querystring['specialization'] = 1  # specialization - "Информационные технологии, интернет, телеком" (id = 1)
        # encode querystring
        querystring = parse.urlencode(querystring)
        # send request to hh.ru api and get data
        with request.urlopen(f'{URL}/vacancies?{querystring}') as response:
            data = response.read()
            data = json.loads(data)
            vacancies.extend(data['items'])
            pages = int(data['pages'])
        return vacancies, pages

    @staticmethod
    def get_vacancy(link: str) -> dict:
        vacancy_id = link.split('/')[-1]
        vacancy = {}
        with request.urlopen(f'{URL}/vacancies/{vacancy_id}') as response:
            data = response.read()
            vacancy = json.loads(data)
        try:
            vacancy_requirements = vacancy['snippet']['requirement']
        except KeyError:
            vacancy_requirements = ''
        type_tags = set([tag for tag, aliases in VACANCY_TAGS['type'].items()
                         for alias in aliases if alias in (vacancy['name'] + vacancy_requirements).lower()])
        tech_tags = set([tag for tag, aliases in VACANCY_TAGS['tech'].items()
                         for alias in aliases if alias in (vacancy['name'] + vacancy_requirements).lower()])
        return {
            'name': vacancy['name'],
            'employer': vacancy['employer']['name'],
            'employer_logo': vacancy['employer']['logo_urls']['original'] if vacancy['employer'][
                                                                             'logo_urls'] is not None else '/static/img/nophoto.png',
            'tags': {'type': list(type_tags), 'tech': list(tech_tags), 'city': vacancy['area']['name']},
            # back to list to make JSON serialization easier
            'url': vacancy['alternate_url'],
            'date': vacancy['published_at'][:10],
        }

    @staticmethod
    def filter_degree(vacancies: list):
        no_degree_vacancies = []
        avoid = ['высшее', 'образование', 'вуз', 'профильное', 'студент', 'бакалавр', 'bachelor', 'магистр']
        for vacancy in vacancies:
            requirements = vacancy['snippet']['requirement']
            try:
                requirements = requirements.lower()
                description = ''
                with request.urlopen(vacancy['url']) as response:
                    description = json.loads(response.read())['description']
                if not any([r in requirements + description for r in avoid]):
                    no_degree_vacancies.append(vacancy)
            except AttributeError:
                # since not every vacancy on hh.ru has requirements,
                # we can just skip ones without them
                pass
        return no_degree_vacancies

    @staticmethod
    def prettify_vacancies(vacancies: list):
        prettified = []
        for vacancy in vacancies:
            # get a set of tags that vacancy's name may contain. (we use set to exclude repetitive ones)
            type_tags = set([tag for tag, aliases in VACANCY_TAGS['type'].items()  # None to str if None
                             for alias in aliases if alias in (vacancy['name'] + str(vacancy['snippet']['requirement'])).lower()])
            tech_tags = set([tag for tag, aliases in VACANCY_TAGS['tech'].items()
                             for alias in aliases if alias in (vacancy['name'] + str(vacancy['snippet']['requirement'])).lower()])
            prettified.append({
                'name': vacancy['name'],
                'employer': vacancy['employer']['name'],
                'employer_logo': vacancy['employer']['logo_urls']['original'] if vacancy['employer']['logo_urls'] is not None else '/static/img/nophoto.png',
                'tags': {'type': list(type_tags), 'tech': list(tech_tags), 'city': vacancy['area']['name']},
                # back to list to make JSON serialization easier
                'url': vacancy['alternate_url'],
                'date': vacancy['published_at'][:10],
            })
        return prettified
