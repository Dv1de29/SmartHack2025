from django.shortcuts import render,HttpResponse

# Create your views here.
def index(request):
    return HttpResponse("Hello Smarthack!")
def test(request, id):
    return HttpResponse(f"Hello {id}")