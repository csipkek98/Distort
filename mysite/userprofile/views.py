from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

@login_required
def profile(request, name):
    user = User.objects.get(username=name)

    return render(request, 'profile.html',{'user':user})