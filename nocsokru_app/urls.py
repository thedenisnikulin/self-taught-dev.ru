from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('jobs/load', views.load_jobs, name='load_jobs'),
    path('jobs/create', views.create_job, name='create_job'),
    path('jobs/generate', views.get_job_by_link, name='generate'),
    path('bills/create', views.create_bill, name='create_bill'),
    path('bills/verify', views.verify_bill, name='verify_bill'),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)