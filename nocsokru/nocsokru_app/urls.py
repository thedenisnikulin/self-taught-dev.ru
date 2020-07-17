from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.main, name='index'),
    path('/jobs/load', views.load_jobs)
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)