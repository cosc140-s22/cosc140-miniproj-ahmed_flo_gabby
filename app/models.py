from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.

class Tag(models.Model):
  name = models.CharField(blank=False, max_length=20)
  def __str__(self):
    return f"{self.name}"

class Site(models.Model):
	title = models.CharField(max_length = 1000, blank=False)
	description = models.TextField(blank=True)
	location = models.TextField(blank=False)
	tags = models.ManyToManyField(Tag)

	def random_img(self):
		img_query = self.siteimage_set.all()
		if(img_query.exists()):
			return img_query.order_by("?")[0]
		else:
			None

	def get_tags(self):
		tag_query = self.tags.all()
		if(tag_query.exists()):
			return tag_query.order_by("name")
		else:
			None
		
	def __str__(self):
		return self.title

	
class SiteImage(models.Model):
  image = models.ImageField(blank=False, null=False, upload_to="images")
  caption= models.CharField(max_length=50,blank=True)
  site = models.ForeignKey(Site, on_delete=models.CASCADE)

  def __str__(self):
    if self.caption==None:
      return f"{self.site}"
    else:
	    return f"{self.site}: {self.caption}"

class Review(models.Model):
  rating = models.IntegerField(blank=False, validators=[MinValueValidator(1),MaxValueValidator(5)])
  comment = models.TextField(blank=True)
  site = models.ForeignKey(Site, on_delete=models.CASCADE)
  def __str__(self):
    if self.comment==None:
      return f"{self.site}: {self.rating} stars"
    else:
      return f"{self.site}: {self.rating} stars --- {self.comment}"