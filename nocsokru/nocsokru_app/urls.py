from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.main, name='index'),
    path('jobs/load', views.load_jobs, name='load_jobs'),
    path('jobs/create', views.create_job, name='create_job'),
    path('jobs/verify', views.verify_job, name='verify_job'),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)