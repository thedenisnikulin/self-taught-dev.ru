from django.db import models
# local
from .services.constants import VACANCY_TAGS


class PaidVacancy(models.Model):
    name = models.TextField()
    employer = models.TextField()
    employer_logo = models.TextField()
    city = models.TextField()
    tags = models.TextField()
    url = models.TextField()
    date = models.TextField()
    color = models.TextField()

    def serialize(self):
        type_tags = set([tag for tag, aliases in VACANCY_TAGS['type'].items()
                         for alias in aliases if alias in self.tags])
        tech_tags = set([tag for tag, aliases in VACANCY_TAGS['tech'].items()
                         for alias in aliases if alias in self.tags])
        print(self.tags)
        print(tech_tags)
        return {
            'name': self.name,
            'employer': self.employer,
            'employer_logo': self.employer_logo,
            'tags': {'type': list(type_tags), 'tech': list(tech_tags), 'city': self.city},
            'url': self.url,
            'date': self.date,
            'color': self.color
        }


class PromoCode(models.Model):
    text = models.TextField()
    amount = models.TextField()