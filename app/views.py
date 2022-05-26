from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from .models import Site, SiteImage
from django.contrib.auth.decorators import login_required
from .forms import ReviewForm
from .coords import get_lat_lon

def get_query(session):
    query_string = [F"{key}={session.get(key)}" for key in session.keys()]
    return '&'.join(query_string)


def update_state(params, session, keys):
    if params.get('reset'):
        session.clear()
    
    for key in keys:
        if params.get(key):
            session[key] = params.get(key)

def index(request):
    search_req = request.GET.get('search')
    tag_req = request.GET.get('tag')
    sort = request.GET.get(key='sort',default='title')
    '''
        RESTful search sort
    '''
    search_sort_keys = ['sort','tag','search']
    update_state(request.GET,request.session, search_sort_keys)
    for key in search_sort_keys:
        '''
            Redirect to url with query string that includes all search/sort parameters applied
        '''
        if key in request.session.keys() and key not in request.GET.keys():
            return redirect(F"{reverse('index')}?{get_query(request.session)}")

    sites = Site.objects.all().order_by('title')

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
            sites = sites.filter(title__icontains=search_req) | sites.filter(description__icontains=search_req) | sites.filter(location__icontains=search_req)

    if(sort=='rating'):
        sites =  sorted(list(sites),key=lambda site: site.avg_rating() if site.avg_rating() else 0.0, reverse=True)

    colors = []
    for site in sites:
        r = site.avg_rating()
        if(r):
            if 5>=r>=4:
                colors.append('green')
            elif 4>r>=2:
                colors.append('yellow')
            else:
                colors.append('red')
        else:
            colors.append("")

    context = {"sites": zip(sites, colors), "tag_req": tag_req, 'sort':sort}

    return render(request, 'app/index.html', context)

def random_image(request):
    img:SiteImage = SiteImage.objects.order_by("?").first()
    return redirect(img.image.url)

def details(request, site_id):
    site = get_object_or_404(Site, pk=site_id)
    images = site.siteimage_set.all()
    reviews = site.review_set.all()

    lat,lon = get_lat_lon(site.location, request.session)
    if(lat and lon):
        '''
            Render page with coordinates in query string if coordinates are found
        '''
        if(request.GET.get('lat')==lat and request.GET.get('lon')==lon):
            pass
        else:
            url = F"{reverse(viewname='details',args=[site_id])}?lat={lat}&lon={lon}"
            return redirect(url)
    
    full_rating, partial_rating, empty_rating = 0,0,5
    site_rating = site.avg_rating()
    if(site_rating):
        full_rating, partial_rating = divmod(site_rating,1)
        if(partial_rating >= 0.5):
            partial_rating = 1
        else:
            partial_rating = 0
        full_rating = int(full_rating)
        empty_rating = empty_rating - (full_rating + partial_rating)

    context = {
        'site': site,
        'images': images if images.exists() else None,
        'reviews': reviews if reviews.exists() else None,
        'full_rating':range(full_rating),
        'partial_rating':range(partial_rating),
        'empty_rating': range(empty_rating)
    }
    print(partial_rating)
    return render(request, 'app/details.html', context)

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