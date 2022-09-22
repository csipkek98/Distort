from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.contrib import messages
import json

@login_required
def profile(request, name):
    user = User.objects.get(username=name)
    if request.method == "POST":
        response = {"message":"","username":user.username,"status":""}
        profile_changed = False
        body_unicode = request.body.decode('utf-8')
        user_data = json.loads(json.loads(body_unicode))
        if user_data["username"] != "" and user_data["username"] != user.username:
            try:
                data = User.objects.get(username=user_data["username"])
                response["message"] = "Username already in use, choose another!"
                response["status"] = "failed"
                return JsonResponse(response)
            except:
                user.username = user_data["username"]
                user.save()
                profile_changed = True
        if user_data["email"] != user.email:
            try:
                data = User.objects.get(email=user_data["email"])
                response["message"] = "E-mail already in use, choose another!"
                response["status"] = "failed"
                return JsonResponse(response)
            except:
                user.email = user_data["email"]
                user.save()
                profile_changed = True
        if user_data["firstname"] != user.first_name:
            user.first_name = user_data["firstname"]
            user.save()
            profile_changed = True
        if user_data["lastname"] != user.last_name:
            user.last_name = user_data["lastname"]
            user.save()
            profile_changed = True
        if profile_changed:
            response["username"] = user.username
            response["message"] = f"Profile succesfully updated for {user.username}!"
            response["status"] = "success"
        return JsonResponse(response)
    else:
        return render(request, 'profile.html',{'user':user})