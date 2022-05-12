from django.shortcuts import redirect
from django.urls import path, re_path, reverse_lazy
from . import views

def root_redirect(request):
    return redirect(reverse_lazy('index'))

urlpatterns = [
    path('sites', views.index, name='index'),
    path('sites/<int:site_id>',views.details,name='details'),
    path('', root_redirect)
]