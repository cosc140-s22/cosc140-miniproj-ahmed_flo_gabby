from django.shortcuts import get_object_or_404, render
from .models import Site

# Create your views here.
def index(request):
	sites = Site.objects.all().order_by('title')	
	colors = [['red','green','blue','yellow'][i%4] for i in range(len(sites))]
	if(request.GET.get('tag')):
		sites = sites.filter(tags__name=request.GET.get('tag'))
	return render(request, 'app/index.html', context={"sites":zip(sites,colors)})

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