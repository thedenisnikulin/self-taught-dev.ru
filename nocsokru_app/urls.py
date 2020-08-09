from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('vacancies/load', views.load_vacancies, name='load_vacancies'),
    path('vacancies/create', views.create_vacancy, name='create_vacancy'),
    path('vacancies/getbylink', views.get_vacancy_by_link, name='getbylink'),
    path('bills/create', views.create_bill, name='create_bill'),
    path('bills/verify', views.verify_bill, name='verify_bill'),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)