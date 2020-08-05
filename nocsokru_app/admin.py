from django.contrib import admin
# local
from .models import PaidVacancy, PromoCode

# Register your models here.
admin.site.register(PaidVacancy)
admin.site.register(PromoCode)