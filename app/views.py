from django.http import HttpRequest
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from .models import Site, SiteImage
from django.contrib.auth.decorators import login_required
from .forms import ReviewForm
import re
import requests

def get_post_code(address):
    post_code_regex = "[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}"
    return re.findall(post_code_regex,address)

def get_lat_lon(address, session):
    post_code = get_post_code(address)
    search =  address if len(post_code)==0 else post_code[0]
    if(session.get(F'{search}-lat')==None or session.get(F'{search}-lon')==None):
        data = requests.get(F"https://nominatim.openstreetmap.org/search?q={search}&format=json").json()
        if(len(data) > 0):
            '''
                Store API requests in session to avoid searching places already found
            '''
            session[F'{search}-lat'] = data[0]["lat"]
            session[F'{search}-lon'] = data[0]["lon"]
    return (session.get(F'{search}-lat'), session.get(F'{search}-lon'))

def index(request:HttpRequest):
    sites = Site.objects.all().order_by('title')

    search_req = request.GET.get('search')
    tag_req = request.GET.get('tag')

    if (tag_req):
        sites = sites.filter(tags__name=tag_req)

    if (search_req):
        if (search_req.startswith("#")):
            '''
				If a search begins with # search for it as a tag name
			'''
            return redirect(F"{reverse('index')}?tag={search_req[1:]}")
        else:
            '''
				Searches by title, description, and location
			'''
            sites = sites.filter(title__icontains=search_req) | sites.filter(
                description__icontains=search_req) | sites.filter(
                    location__icontains=search_req)

    colors = [['red', 'green', 'blue', 'yellow'][i % 4]
              for i in range(len(sites))]

    context = {"sites": zip(sites, colors), "tag_req": tag_req}

    return render(request, 'app/index.html', context)

def random_image(request):
    img:SiteImage = SiteImage.objects.order_by("?").first()
    return redirect(img.image.url)

def details(request, site_id):
    site = get_object_or_404(Site, pk=site_id)
    images = site.siteimage_set.all()
    reviews = site.review_set.all()
    context = {
        'site': site,
        'images': images if images.exists() else None,
        'reviews': reviews if reviews.exists() else None
    }

    lat,lon = get_lat_lon(site.location, request.session)
    if(lat and lon):
        if(request.GET.get('lat')==lat and request.GET.get('lon')==lon):
            return render(request, 'app/show.html', context)
        else:
            url = F"/sites/{site_id}?lat={lat}&lon={lon}"
            return redirect(url)
    else:
        return render(request, 'app/show.html', context)

@login_required
def create_review(request, site_id):
    site = get_object_or_404(Site, pk=site_id)
    if (request.method == 'POST'):
        form = ReviewForm(request.POST)
        if form.is_valid():
            site.review_set.create(rating=form.cleaned_data['rating'],
                                   comment=form.cleaned_data['comment'],
                                   user=request.user)
            return redirect('details', site.id)
            
    context = {'site': site, 'ratings':range(1,6)}
    return render(request, 'app/review.html', context)