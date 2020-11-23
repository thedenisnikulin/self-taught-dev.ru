from typing import Tuple
from urllib import request, parse
import json
# local
from .constants import URL, VACANCY_TAGS


class HeadHunterApiManager:
	@staticmethod
	def prepare_tags(tags: dict) -> str:
		if (len(tags.get("tech", [])) \
				+ len(tags.get("type", [])) \
				+ len(tags.get("city", "")) == 0):
			# If no tags, set default.
			return "developer or разработчик or программист"

		type_tags = ""
		tech_tags = ""
		city_tag = ""

		for k in tags.keys():
			# Lowercase tags.
			if type(tags[k]) is list:
				tags[k] = [t.lower() for t in tags[k]]
			else:
				tags[k] = tags[k].lower()

		# Make a string out of dict.
		# Will look like "(a OR b) AND (c OR d) AND e". 
		# AND & OR - operators from hh.ru api.
		if ('type' in tags.keys()) and (len(tags['type']) != 0):
			type_tags ="({})".format(' OR '.join(tags['type']))

		if ('tech' in tags.keys()) and (len(tags['tech']) != 0):
			tech_tags = "({})".format(' OR '.join(tags['tech']))

		city_tag = tags['city']

		return f"{type_tags} AND {tech_tags} AND {city_tag}"

	@staticmethod
	def get_vacancies(tags=None, page: int = 1) -> Tuple[list, int]:
		if tags is None:
			tags = {'type': ['developer', 'разработчик', 'программист'], 'city': ''}
		vacancies = []          # Vacancies to be received.
		pages = 1               # Pages to be received.
		querystring = dict()    # Querystring that we will construct.

		# Update querystring according to hh.ru api specification.
		querystring['text'] = HeadHunterApiManager.prepare_tags(tags)
		querystring['page'] = page
		querystring['per_page'] = 10  # 10 vacancies per page by default.
		# "Информационные технологии, интернет, телеком" (id = 1).
		querystring['specialization'] = 1

		# Encode querystring.
		querystring = parse.urlencode(querystring)
		# Send request to hh.ru api and get data.
		with request.urlopen(f'{URL}/vacancies?{querystring}') as response:
			data = response.read()
			data = json.loads(data)
			vacancies = data.get("items", [])
			pages = int(data['pages'])
		return (vacancies, pages)

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

		raw = (vacancy['name'] + vacancy_requirements).lower()
		# This code is pretty messy and unreadable here (I'm reading & refactoring it 
		# after ~5 months after I initially wrote it, and personally I want to get a 
		# time machine to prevent myself from writing this piece of crap), but what it 
		# actually does is picking tags out of raw text (name of vacancy + requirements)
		# and making a set out of it ('cos a set excludes any duplicates).
		type_tags = set([tag for tag, aliases in VACANCY_TAGS['type'].items()
			for alias in aliases if alias in raw])
		tech_tags = set([tag for tag, aliases in VACANCY_TAGS['tech'].items()
			for alias in aliases if alias in raw])

		employer_logo = ""

		if vacancy['employer']['logo_urls']:
			employer_logo = vacancy['employer']['logo_urls']['original']
		else:
			employer_logo = '/static/img/nophoto.png'

		return {
			'name': vacancy['name'],
			'employer': vacancy['employer']['name'],
			'employer_logo': employer_logo,
			'tags': {
				# Back to list to make JSON serialization easier.
				'type': list(type_tags),
				'tech': list(tech_tags),
				'city': vacancy['area']['name']
			},
			'url': vacancy['alternate_url'],
			'date': vacancy['published_at'][:10],
		}

	@staticmethod
	def filter_degree(vacancies: list):
		no_degree_vacancies = []
		avoid = ['высшее', 'образование', 'вуз', 'профильное',
				'студент', 'бакалавр', 'bachelor', 'магистр']
		for vacancy in vacancies:
			requirements = vacancy['snippet']['requirement']
			try:
				requirements = requirements.lower()
			except AttributeError:
				# Since not all vacancies on hh.ru has requirements,
				# we can just skip ones without them.
				continue
			description = ''
			with request.urlopen(vacancy['url']) as response:
				description = json.loads(response.read())['description']
			if not any([r in (requirements + description) for r in avoid]):
				no_degree_vacancies.append(vacancy)

		return no_degree_vacancies

	@staticmethod
	def prettify_vacancies(vacancies: list):
		prettified = []
		for vacancy in vacancies:
			raw = (vacancy['name'] + str(vacancy['snippet']['requirement'])).lower()

			type_tags = set([tag for tag, aliases in VACANCY_TAGS['type'].items()
				for alias in aliases if alias in raw])
			tech_tags = set([tag for tag, aliases in VACANCY_TAGS['tech'].items()
				for alias in aliases if alias in raw])
			
			employer_logo = ""

			if vacancy['employer']['logo_urls']:
				employer_logo = vacancy['employer']['logo_urls']['original']
			else:
				employer_logo = '/static/img/nophoto.png'

			prettified.append({
				'name': vacancy['name'],
				'employer': vacancy['employer']['name'],
				'employer_logo': employer_logo,
				'tags': {
					'type': list(type_tags), 
					'tech': list(tech_tags), 
					'city': vacancy['area']['name']
				},
				'url': vacancy['alternate_url'],
				'date': vacancy['published_at'][:10],
			})
		return prettified
