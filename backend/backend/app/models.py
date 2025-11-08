from django.db import models
import uuid
# Create your models here.
class Organizator(models.Model):
    nume = models.CharField(max_length=100)
    email = models.EmailField()
    def __str__(self):
        return self.nume

class Locatie(models.Model):
    adresa = models.CharField(max_length=255)
    oras = models.CharField(max_length=100)
    judet = models.CharField(max_length=100)
    cod_postal = models.CharField(max_length=10, null=True, default="000000")
    def __str__(self):
        return f"{self.adresa}, {self.oras}"