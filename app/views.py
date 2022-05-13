from django.http import HttpRequest
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from .models import Site

# Create your views here.
def index(request:HttpRequest):
	sites = Site.objects.all().order_by('title')	
	
	search_req = request.GET.get('search')
	tag_req = request.GET.get('tag')
	
	if(tag_req):
		sites = sites.filter(tags__name=tag_req)
	
	if(search_req):
		if(search_req.startswith("#")):
			'''
				If a search begins with # search for it as a tag name
			'''
			return redirect(F"{reverse('index')}?tag={search_req[1:]}")
		else:
			'''
				Searches by title first, description second, and then location last
			'''
			filtered = sites.filter(title__icontains=search_req)
			if(filtered.exists):
				sites = filtered
			else:
				filtered = sites.filter(description__icontains=search_req)
				if(filtered.exists()):
					sites = filtered
				else:
					filtered = sites.filter(location__icontains=search_req)
					if(filtered.exists()):
						sites = filtered
	
	colors = [['red','green','blue','yellow'][i%4] for i in range(len(sites))]
	
	context = {
		"sites":zip(sites,colors)
	}
	
	return render(request, 'app/index.html', context)

def details(request,site_id):
	site = get_object_or_404(Site,pk=site_id)
	images = site.siteimage_set.all()
	reviews = site.review_set.all()
	context = { 
		'site':site, 
		'images': images if images.exists() else None, 
		'reviews': reviews if reviews.exists() else None
	}
	return render(request,'app/show.html',context)