from django.db import models
# local
from .services.hh import job_tag_aliases

# Create your models here.
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
        type_tags = set([tag for tag, aliases in job_tag_aliases['type'].items()
                         for alias in aliases if alias in self.tags.lower()])
        tech_tags = set([tag for tag, aliases in job_tag_aliases['tech'].items()
                         for alias in aliases if alias in self.tags.lower()])
        return {
            'name': self.name,
            'employer': self.employer,
            'employer_logo': self.employer_logo,
            'city': self.city,
            'tags': {'type': list(type_tags), 'tech': list(tech_tags)},
            'url': self.url,
            'date': self.date,
            'color': self.color
        }