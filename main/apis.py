
import json
import stripe
import datetime
from django.contrib.auth.models import User
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt , csrf_protect
from django.contrib.auth import login, logout , authenticate
from django.core.validators import validate_email
from django.shortcuts import render , HttpResponse, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods

from rest_framework.parsers import JSONParser , FormParser , MultiPartParser
from rest_framework.decorators import parser_classes
import re
import os
import random
from django.conf import settings

import io
from django.core.files.base import File 
from django.utils import timezone
import smtplib
import ssl
from email.message import EmailMessage

from background_task.models import *

from main.models import user_detail , room , room_photo , customer, advancePayment, bank_detail , userqueries , inqiery , customerqueries






stripe.api_key = settings.STRIPE_SECRET_KEY
endpoint_secret = settings.ENDP_SECRET

otpcode = "972358"




'''

kindly note that @csrf_exempt is used for testing environment.
while in production, everything has to be right.

'''


@csrf_protect
def log_in(request):
    if request.method == "POST":
        data = json.load(request)
        username = data['username']
        password = data['password']
        if data['username'] and data['password']:
            user = authenticate(username=data[
                'username'], password=data['password'])
            if user:
                login(request, user)
                print(user.user_detail.role)
                return JsonResponse({"cause": "", "data":{"role" : user.user_detail.role}, "code": 200, "detail": "successful login"}, safe=False)
            else:
                return JsonResponse({"cause": "invalid creadential", "data": "", "code": 404, "detail": "user not found"}, safe=False)
        else:
            return JsonResponse({"cause": "", "data": "", "code": 406, "detail": "please fill valid data"}, safe=False)
        
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


@csrf_exempt
def signup(request):
    if request.method == "POST":
        invalid_fields = []
        data = json.load(request)
        fullname = data['fullname']
        email = data['email']
        username = data['username']
        password = data['password']
        role = data['role']
        try:
            validate_email(email)
            if fullname == "":
                fullname = email[:email.find('@')]
        except:
            invalid_fields.append("email")

        if username == "":
            invalid_fields.append("username")
        if password == "" :
            invalid_fields.append("password")

        if len(invalid_fields) == 0:
            print("all right")
            userobj = User.objects.create(username = username, last_name= fullname , password = password , email = email , first_name = fullname )
            if role == "1":
                mobile = data['mobile']
                address = data['address']
                pincode = data['pincode']
                if len(re.findall(r'[7-9]{1}[0-9]{9}',data['mobile'])) == 0 or data['mobile'] == "" :
                    invalid_fields.append("mobile") 
                if address == "":
                    invalid_fields.append("address") 
                if len(re.findall(r'[0-9]{6}',data['pincode'])) == 0 or data['pincode'] == "":
                    invalid_fields.append("pincode") 
                if len(invalid_fields) == 0:
                    user_detail_obj = userobj.user_detail
                    user_detail_obj.mobile = mobile
                    user_detail_obj.address = address
                    user_detail_obj.pincode = pincode
                    user_detail_obj.role = "landlord"
                    user_detail_obj.save()
                else:
                    userobj.delete()
                    return JsonResponse({"cause": "", "data":{"invalid_field" : invalid_fields}, "code": 406, "detail": "invalid data"}, safe=False)

            return JsonResponse({"cause": "", "data":"", "code": 200, "detail": "successful signup"}, safe=False)
                    
        else:
            return JsonResponse({"cause": "", "data":{"invalid_field" : invalid_fields}, "code": 406, "detail": "invalid data"}, safe=False)
            
            
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


@csrf_exempt
@parser_classes([MultiPartParser , FormParser])
def add_room(request):
    if request.method == "POST":
        invalid_field = []
        if request.POST["room_name"] == "":
            invalid_field.append("room_name")
        if request.POST["facilities"] == "":
            invalid_field.append("facilities")
        if request.POST["price"] == "":
            invalid_field.append("price")
        if len(request.FILES) == 0:
            invalid_field.append("Images")

        if len(invalid_field) == 0:
            roomobj = room.objects.create(
                user_detail = request.user,
                room_name = request.POST["room_name"],
                facility = request.POST["facilities"],
                avg_price = request.POST["price"],
            )
            for img in request.FILES:
                data = request.FILES[img]

                room_photo_obj = room_photo.objects.create(
                    room = roomobj,
                )
                with io.BytesIO(request.FILES[img].read()) as stream:
                    django_file = File(stream)
                    room_photo_obj.image.save(img, django_file)
                room_photo_obj.save()
            
            return JsonResponse({"cause": "", "data":"", "code": 200, "detail": "room added successfully"}, safe=False)
        elif len(invalid_field) > 0:
            return JsonResponse({"cause": "", "data":{"invalid_field" : invalid_field}, "code": 406, "detail": "invalid data"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


@csrf_exempt
@parser_classes([MultiPartParser , FormParser])
def updateLandlordDetails(request):
    if request.method == "POST":
        invalid_field = []
        isMobileExist = "mobile" in request.POST.keys()
        isEmailExist = "email" in request.POST.keys()
        isLocExist = "location" in request.POST.keys()
        if isMobileExist and request.POST["mobile"] == "":
            invalid_field.append("mobile")
        if isEmailExist and request.POST["email"] == "":
            invalid_field.append("email")
        if isLocExist and request.POST["location"] == "":
            invalid_field.append("location")

        print(request.POST["location"])
        if len(invalid_field) == 0: 

            userobj = request.user;
            userdetailobj = userobj.user_detail;

            if len(request.FILES) != 0:
                profile_img_name = list(request.FILES.keys())[0];
                oldfile = str(userdetailobj.profileImg)
                with io.BytesIO(request.FILES[profile_img_name].read()) as stream:
                    django_file = File(stream)
                    userdetailobj.profileImg.save(profile_img_name, django_file)

            if  isMobileExist:
                userdetailobj.mobile = request.POST["mobile"] 
            if  isEmailExist:
                userobj.email =request.POST["email"]
            if  isLocExist:
                userdetailobj.location =request.POST["location"]

            userobj.save()
            userdetailobj.save()
            try:
                os.remove(os.path.join(settings.MEDIA_ROOT, oldfile))
            except:
                print("no file found")
            
            return JsonResponse({"cause": "", "data":"", "code": 200, "detail": "profile updates successfully"}, safe=False)
        elif len(invalid_field) > 0:
            return JsonResponse({"cause": "", "data":{"invalid_field" : invalid_field}, "code": 406, "detail": "invalid data"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


@csrf_exempt
def deallocate_room(request):
    if request.method == "POST":
        data = json.load(request)
        invalid_field = []
        print(data)
        if data["room_id"] == "":
            invalid_field.append("room_id")
        if len(invalid_field) == 0:
            rum = room.objects.filter(id = int(data["room_id"])).first()
            cust = rum.customer_set.filter(status = "occupied").first()
            
            if rum.n_time_occupied == "1":
                rum.rate = data["rate"]
            else:
                rum.rate = int(( int(float(rum.rate)) + int(data["rate"]) ) / 2)
                print(rum.rate)
            cust.status = "free" 
            rum.save()
            cust.save()  #signal fired
            return JsonResponse({"cause": "", "data":"", "code": 200, "detail": "room deallocation successfully"}, safe=False)
        else:
            return JsonResponse({"cause": "room id not present", "data":invalid_field, "code": 406, "detail": "room id not present"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


def initiaterefund(payid):
    payobj = advancePayment.objects.filter(id = payid).first()
    payint = stripe.PaymentIntent.retrieve(payobj.payment_id)
    chargeid = payint.charges.data[0].id
    acc_id = payint.transfer_data.destination
    flag = 1
    # refund_amount = int((float(payobj.amount)) - ((float(payobj.amount))*settings.CANCEL_CHARGE))
    try:
        print(acc_id)
        print(chargeid)
        data = stripe.Refund.create(charge=chargeid,
                refund_application_fee=True,
                reverse_transfer=True,)
        print(data)
        payobj.status = "refunded"
        payobj.refund_status = data["status"]
        payobj.refund_id = data["id"]
        payobj.is_expire = "3"
    except:
        flag = 0
        print("refund already been initiated ")
    
    if flag == 1:
        payobj.save()

@csrf_exempt
def unblock_room_landlord(request):
    if request.method == "POST":
        data = json.load(request)
        if data["room_id"] != "":
            roomobj = room.objects.filter(id = int(data["room_id"])).first()
            roomobj.status = "free"
            roomobj.save()
            payobj = roomobj.advancepayment_set.all().filter(is_expire = "0").first()
            Task.objects.filter(id=int(payobj.expire_task_id)).delete()
            initiaterefund(payobj.id)
            return JsonResponse({"cause": "", "data":"", "code":200, "detail":"room unblocked successfully"}, safe=False)
        else:
            return JsonResponse({"cause": "room id not present", "data":invalid_field, "code": 406, "detail": "room id not present"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


@csrf_exempt
@parser_classes([MultiPartParser , FormParser])
def allocate_room(request):
    if request.method == "POST":
        # all details are compulsory
        customerobj = customer.objects.create(
            room = room.objects.filter(id = int(request.POST['roomid'])).first(),
            name = request.POST["name"],
            document_type = request.POST["document_type"],
            document = request.FILES["documentt"],
            staytime = request.POST["staytime"],
            price_payed = request.POST["price"],
        )
        return JsonResponse({"cause": "", "data":"", "code": 200, "detail": "room allocation successfully"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


@csrf_exempt
def contactQuery(request):
    if request.method == "POST":
        data = json.load(request)
        invalid_field = []
        if data["email"] == "" or not re.search('^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$',data["email"]):
            invalid_field.append("email")
        if data["subject"] == "":
            invalid_field.append("subject")
        if data["message"] == "" :
            invalid_field.append("message")

        if len(invalid_field) == 0:
            todaysquery = userqueries.objects.filter(user_detail = request.user , date__gte=timezone.now().replace(hour=0, minute=0, second=0), date__lte=timezone.now().replace(hour=23, minute=59, second=59) )
            if len(todaysquery) < 20:
                userqueries.objects.create(
                    user_detail =request.user , subject = data["subject"] , message = data["message"] , email = data["email"]
                )
                return JsonResponse({"cause": "", "data":"", "code": 200, "detail": "response recorded successfully"}, safe=False)
            else:
                return JsonResponse({"cause": "", "data":"", "code": 429, "detail": "you exceeded todays limit of 5 queries"}, safe=False)
        else:
            return JsonResponse({"cause": "invalid data", "data":invalid_field, "code": 406, "detail": "email validation error or some data are missing"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


@csrf_exempt
def contactQueryCustomer(request):
    if request.method == "POST":
        data = json.load(request)
        inqobj = inqiery.objects.filter(jwttoken = data["jwttoken"]).first()
        print(inqobj)
        invalid_field = []
        if data["email"] == "" or not re.search('^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$',data["email"]):
            invalid_field.append("email")
        if data["subject"] == "":
            invalid_field.append("subject")
        if data["message"] == "" :
            invalid_field.append("message")

        if len(invalid_field) == 0:
            todaysquery = customerqueries.objects.filter(user_detail = inqobj , date__gte=timezone.now().replace(hour=0, minute=0, second=0), date__lte=timezone.now().replace(hour=23, minute=59, second=59) )
            if len(todaysquery) < 20:
                customerqueries.objects.create(
                    user_detail =inqobj , subject = data["subject"] , message = data["message"] , email = data["email"]
                )
                return JsonResponse({"cause": "", "data":"", "code": 200, "detail": "response recorded successfully"}, safe=False)
            else:
                return JsonResponse({"cause": "", "data":"", "code": 429, "detail": "you exceeded todays limit of 20 queries"}, safe=False)
        else:
            return JsonResponse({"cause": "invalid data", "data":invalid_field, "code": 406, "detail": "email validation error or some data are missing"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


@csrf_exempt
def sendAuthEmail(request):
    if request.method == "POST":
        data = json.load(request)
        invalid_field = []
        if data["email"] == "" or not re.search('^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$',data["email"]) or "+" in data["email"].split("@")[0]:
            invalid_field.append("email")
        
        print(data["email"])
        if len(invalid_field) == 0:
            if "issocial" in data.keys():
                inqobj = inqiery.objects.filter(email = data['email'])
                if len(inqobj) == 0:
                    inqobj = inqiery.objects.create(
                        email = data['email'],
                        isverified = 1,
                        status = "subscribed",
                        socialtoken = data['token']
                        )
                    inqobj.save()
                else:
                    inqobj = inqobj.first()
                return JsonResponse({"cause": "", "data":{"jtoken" : inqobj.jwttoken}, "code": 200, "detail": "email sent successfully"}, safe=False)
            else:
                otpcode = ""
                for _ in range(1,7):
                    otpcode += str(random.choices([0,1,2,3,4,5,6,7,8,9,'q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'])[0])
                
                otpcode = str(otpcode)
                flag = 0
                try:
                    with smtplib.SMTP("smtp.gmail.com", 587) as server:
                        server.ehlo()
                        server.starttls()
                        server.ehlo()
                        server.login(settings.EMAIL_ADDRESS, settings.EMAIL_PASSWORD )
                        msg = EmailMessage()
                        msg['Subject'] = "locallease Verification Process.."
                        msg['From'] = "chachamehta33@gmail.com"
                        msg['to'] = data["email"]
                        msg.add_alternative(str("""
                                                                <!DOCTYPE html>

                                                                <html lang="en-GB" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

                                                                <head>
                                                                <title></title>
                                                                <meta charset="utf-8" />
                                                                <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                                                                <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
                                                                <!--[if !mso]><!-->
                                                                <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css" />
                                                                <!--<![endif]-->
                                                                <style>
                                                                    * {
                                                                    box-sizing: border-box;
                                                                    }
                                                                    
                                                                    body {
                                                                    margin: 0;
                                                                    padding: 0;
                                                                    }
                                                                    
                                                                    a[x-apple-data-detectors] {
                                                                    color: inherit !important;
                                                                    text-decoration: inherit !important;
                                                                    }
                                                                    
                                                                    #MessageViewBody a {
                                                                    color: inherit;
                                                                    text-decoration: none;
                                                                    }
                                                                    
                                                                    p {
                                                                    line-height: inherit
                                                                    }
                                                                    
                                                                    @media (max-width:630px) {
                                                                    .icons-inner {
                                                                        text-align: center;
                                                                    }
                                                                    .icons-inner td {
                                                                        margin: 0 auto;
                                                                    }
                                                                    .row-content {
                                                                        width: 100% !important;
                                                                    }
                                                                    .stack .column {
                                                                        width: 100%;
                                                                        display: block;
                                                                    }
                                                                    }
                                                                </style>
                                                                </head>

                                                                <body style="background: url('https://lh3.googleusercontent.com/pw/AM-JKLULfakg34lCgYrrIgSiVl9knP5j_S6m1Yb-dWah1hw_lZV27iOvboOjlNA1Wg9ya0CqrOC4k9IC1BIfxTKqlW74mBZ3KTYsfMKrKUR4CxFU0YumQT9S7UHqeKGniuohVQzbJ2k3tZzc0c30poP4jvez=w1920-h603-no'); display: grid; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
                                                                <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; " width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td>
                                                                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                                            <tbody>
                                                                            <tr>
                                                                                <td>
                                                                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 610px;" width="610">
                                                                                    <tbody>
                                                                                    <tr>
                                                                                        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                                                                        <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                                                            <tr>
                                                                                            <td style="width:100%;">
                                                                                                <div align="center"><img alt="Image of a burger with ''Loved it?'' text over it" src="https://lh3.googleusercontent.com/pw/AM-JKLUMhm0teXK2Pef22vcpf5OeONR5dXEIyqS-NQ3-0KD8QaUd9IV7vTGVogTL_RwzUJMbGIVof5R7E-7Hz41_LNCv4kGvDL8wfd7P8Y2yxtNasosxgw-qCcIILaXVcb2g3bpK4zKgFoI2h-MraxY_DT9s=w1920-h799-no" style="display: block; height: auto; border: 0; width: 100%; max-width: 100%;" /></div>
                                                                                            </td>
                                                                                            </tr>
                                                                                            <tr>

                                                                                            <td style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                                <div align="center" style="line-height:10px;    margin: 50px 0px 0px 0px;"><img alt="Image of a burger with ''Loved it?'' text over it" src="https://lh3.googleusercontent.com/pw/AM-JKLX0dLDfsFJXjPW2ZuG1ztjMpPfx3W2vVEDynRQGVyjUjVTmgJmcRSum2vl9ApHhxnBg6hz6pBtyVEwHWP2UBb2nLIljZU5OGx9rJsKHp7m9TfNA3qwGbh1jsSs-ll_EEbtv_Xr8zho6aUxtJ-JNZGNZ=w1874-h937-no" style="display: block; height: auto; border: 0; width: 214px; max-width: 100%;" title="Image of a burger with ''Loved it?'' text over it"
                                                                                                    width="214" /></div>
                                                                                            </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        <table border="0" cellpadding="0" cellspacing="0" class="heading_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                                                            <tr>
                                                                                            <td style="padding-left:20px;padding-right:20px;text-align:center;width:100%;padding-top:10px;">
                                                                                                <h1 style="margin: 0; color: #232323; direction: ltr; font-family: 'Roboto', Tahoma, Verdana, Segoe, sans-serif; font-size: 41px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"></h1>
                                                                                            </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                                                                            <tr>
                                                                                            <td style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:15px;">
                                                                                                <div style="font-family: sans-serif">
                                                                                                <div style="font-size: 14px; mso-line-height-alt: 16.8px; color: #2a3940; line-height: 1.2; font-family: 'Roboto', Tahoma, Verdana, Segoe, sans-serif;">
                                                                                                    <p style="margin: 0; font-size: 18px; text-align: center;"><span style="font-size:18px;">We hope you are doing good!</span></p>
                                                                                                    <p style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 16.8px;"> </p>
                                                                                                    <p style="margin: 0; font-size: 18px; text-align: center;"><span style="font-size:18px;">Thank you for choosing us. </span></p>
                                                                                                    <p style="margin: 0; font-size: 18px; text-align: center;"><span style="font-size:18px;">This will helps us improve our services and give</span></p>
                                                                                                    <p style="margin: 0; font-size: 18px; text-align: center;"><span style="font-size:18px;"> our beloved customers a better experience using our website.</span></p>
                                                                                                    <p style="margin: 0; font-size: 18px; text-align: center;"><span style="font-size:18px;"><br/>Every word counts!</span></p>
                                                                                                    <p style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 16.8px;"> </p>
                                                                                                    <p style="margin: 0; font-size: 18px; text-align: center;">Here is your one time password.</p>
                                                                                                </div>
                                                                                                </div>
                                                                                            </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        <table border="0" cellpadding="0" cellspacing="0" class="button_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                                                            <tr>
                                                                                            <td style="padding-bottom:30px;padding-left:10px;padding-right:10px;padding-top:30px;text-align:center;">
                                                                                                <div align="center">
                                                                                                <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:56px;width:130px;v-text-anchor:middle;" arcsize="9%" stroke="false" fillcolor="#0c7cf3"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Tahoma, Verdana, sans-serif; font-size:18px"><![endif]--><a href="www.example.com" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#0c7cf3;border-radius:5px;width:auto;border-top:0px solid #8a3b8f;border-right:0px solid #8a3b8f;border-bottom:0px solid #8a3b8f;border-left:0px solid #8a3b8f;padding-top:10px;padding-bottom:10px;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"
                                                                                                    target="_blank"><span style="padding-left:35px;padding-right:35px;font-size:18px;display:inline-block;letter-spacing:normal;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span data-mce-style="font-size: 18px; line-height: 36px;" style="font-size: 18px; line-height: 36px;">""" + otpcode + """</span></span></span></a>
                                                                                                <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                                                </div>
                                                                                            </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        <table border="0" cellpadding="0" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                                                            <tr>
                                                                                            <td style="padding-bottom:30px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                                                                                <div align="center">
                                                                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="95%">
                                                                                                    <tr>
                                                                                                    <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 2px solid #E8E8E8;"><span> </span></td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                                </div>
                                                                                            </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        <table border="0" cellpadding="10" cellspacing="0" class="social_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                                                            <tr>
                                                                                            <td>
                                                                                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="184px">
                                                                                                <tr>
                                                                                                    <td style="padding:0 7px 0 7px;">
                                                                                                    <a href="https://www.facebook.com/" target="_blank"><img alt="Facebook" height="32" src="https://lh3.googleusercontent.com/pw/AM-JKLXN_7Yh-MkCRItzyMwdkNzF_Vem_r5k9PMTwbrdNDsNOswyb-GXNTZzGfvaHPuYnKI8vpGpGlf0adLD3LzqGDxplY5nBjPRB1e1wxSUJ9_LQswd-U6WAAYKSUbtcTJ1B4kW5ncBWTntOewpiEYvo_Yw=s64-no" style="display: block; height: auto; border: 0;" title="facebook" width="32" /></a>
                                                                                                    </td>
                                                                                                    <td style="padding:0 7px 0 7px;">
                                                                                                    <a href="https://www.twitter.com/" target="_blank"><img alt="Twitter" height="32" src="https://lh3.googleusercontent.com/pw/AM-JKLX4V39UYyhPP-ypsHGuB4haEtWPCvaMlCGTN4RFqE_igqeSQAK5CGzAnyUocTK_9AnG3eDQB8trkIoUWRMGDeNsN3wIfkCZqKbxRUcptPHQzzkY8ZzCO36y7v_jh38NutnDN4RSiAZVCxVeJGie5sXf=s64-no" style="display: block; height: auto; border: 0;" title="twitter" width="32" /></a>
                                                                                                    </td>
                                                                                                    <td style="padding:0 7px 0 7px;">
                                                                                                    <a href="https://www.linkedin.com/" target="_blank"><img alt="Linkedin" height="32" src="https://lh3.googleusercontent.com/pw/AM-JKLU0z6q3fYia9PLV3xGql_Z8Z2z7MGIUQU78sjL3WRMwESdbLmVD6Ma8ADys2XoHfwoxu3xp8knGoy4zEpC9vUysSYOgD1fnNO_ERfLcXzn_klbhF9LLgZ3yuQwrj8QpLd4dISnmJGbes2mWVfQBcd7o=s64-no" style="display: block; height: auto; border: 0;" title="linkedin" width="32" /></a>
                                                                                                    </td>
                                                                                                    <td style="padding:0 7px 0 7px;">
                                                                                                    <a href="https://www.instagram.com/" target="_blank"><img alt="Instagram" height="32" src="https://lh3.googleusercontent.com/pw/AM-JKLWqd-Oy7h7H7KsEyuFs8FOxW7NCP8ltQU3gF_MOW2M9DXQPPXlVotWNOU99qN6QTGLW0hTIqSUx4i1U3gDlUpSnUmyxgilKjF2dUf3iIw1BB6UltSE22tALWA-BynEqONkn7vGNCBv2z-WCDWK96s1z=s64-no" style="display: block; height: auto; border: 0;" title="instagram" width="32" /></a>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                </table>
                                                                                            </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        <table border="0" cellpadding="10" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                                                                            <tr>
                                                                                            <td>
                                                                                                <div style="font-family: sans-serif">
                                                                                                <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #66787f; line-height: 1.2; font-family: 'Roboto', Tahoma, Verdana, Segoe, sans-serif;">
                                                                                                    <p style="margin: 0; font-size: 14px; text-align: center;"><a href="" rel="noopener" style="text-decoration: underline; color: #0068a5;" target="_blank">Contact Us</a> | <a href="" rel="noopener" style="text-decoration: underline; color: #0068a5;" target="_blank">Unsubscribe</a></p>
                                                                                                </div>
                                                                                                </div>
                                                                                            </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                                </td>
                                                                            </tr>
                                                                            </tbody>
                                                                        </table>

                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                                <!-- End -->
                                                                </body>

                                                                </html>
                                                                """), subtype='html'
                        )
                        server.send_message(msg)
                    flag = 0
                except:
                    flag = 1
                if flag == 0 :
                    inqobj = inqiery.objects.filter(email = data['email'])
                    if len(inqobj) == 1:
                        inqobj = inqobj.first()
                        inqobj.otp = otpcode
                        inqobj.save()
                    elif len(inqobj) == 0:
                        inqiery.objects.create(
                            email = data['email'],
                            otp = otpcode
                        )
                    return JsonResponse({"cause": "", "data":"", "code": 200, "detail": "email sent successfully"}, safe=False)
                elif flag == 1:
                    return JsonResponse({"cause": "", "data":"", "code": 503, "detail": "error occured in sending email"}, safe=False)

        else:
            return JsonResponse({"cause": "invalid data", "data":invalid_field, "code": 406, "detail": "email validation error or some data are missing"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)



def payment_details_customer(request):

    if request.method == "POST":
        data = json.load(request)
        jwttoken = data["jwttoken"]
        payment_objects = inqiery.objects.filter(jwttoken= jwttoken).first().advancepayment_set.all()
        data = []
        for payobj in payment_objects:
            payment_validity = ""
            if payobj.is_expire == "0":
                payment_validity = "active"
            elif payobj.is_expire == "1":
                payment_validity = "expired"
            elif payobj.is_expire == "2":
                payment_validity = "availed"
            elif payobj.is_expire == "3":
                payment_validity = "suspended"
            data.append({
                "payobj_id" : payobj.id,
                "payment_id" : payobj.payment_id,
                "amount" : payobj.amount,
                "status" : payobj.status,
                "date_time" : datetime.datetime.fromtimestamp(datetime.datetime.timestamp(payobj.datetime)).strftime("%d %b %Y %H:%M:%S") ,
                "is_expire" : payment_validity,
                "room_id" : payobj.room.id
            })
        return JsonResponse({"cause": "", "data":[ele for ele in reversed(data)], "code": 200, "detail": "payment detail grabbed"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)

def payment_details_landlord(request):

    if request.method == "POST":
        data = json.load(request)
        jwttoken = data["jwttoken"]
        payment_objects = inqiery.objects.filter(jwttoken= jwttoken).first().advancepayment_set.all()
        data = []
        for payobj in payment_objects:
            payment_validity = ""
            if payobj.is_expire == "0":
                payment_validity = "active"
            elif payobj.is_expire == "1":
                payment_validity = "expired"
            elif payobj.is_expire == "2":
                payment_validity = "availed"
            elif payobj.is_expire == "3":
                payment_validity = "suspended"
            data.append({
                "payobj_id" : payobj.id,
                "payment_id" : payobj.payment_id,
                "amount" : payobj.amount,
                "status" : payobj.status,
                "date_time" : datetime.datetime.fromtimestamp(datetime.datetime.timestamp(payobj.datetime)).strftime("%d %b %Y %H:%M:%S") ,
                "is_expire" : payment_validity,
                "room_id" : payobj.room.id
            })
        return JsonResponse({"cause": "", "data":[ele for ele in reversed(data)], "code": 200, "detail": "payment detail grabbed"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)

@login_required(login_url="/login/")
def blocked_room_detail_landlord(request):

    if request.method == "POST":
        data = json.load(request)
        userobj = request.user 
        roomobj = room.objects.filter(id = int(data["room_id"])).first()
        paymentobj = roomobj.advancepayment_set.filter(is_expire = "0").first()
        inqobj = paymentobj.inqiery
        data_to_send = {
            "email" : inqobj.email,
            "fst_date" : datetime.datetime.fromtimestamp(datetime.datetime.timestamp(paymentobj.datetime)).strftime("%d %b %Y %H:%M:%S"), 
            "lst_date" : datetime.datetime.fromtimestamp(datetime.datetime.timestamp(paymentobj.datetime) + 10800).strftime("%d %b %Y %H:%M:%S"), 
            "amount" : paymentobj.amount,
            "payment_id" : paymentobj.payment_id
        }
        return JsonResponse({"cause": "", "data":data_to_send, "code": 200, "detail": "room detail grabbed"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)



def payment_details_customer_report(request):

    if request.method == "POST":
        data = json.load(request)
        jwttoken = data["jwttoken"]
        payment_objects = inqiery.objects.filter(jwttoken= jwttoken).first().advancepayment_set.all()
        paymentobj = advancePayment.objects.filter(id = data["payobj_id"]).first()
        if paymentobj in payment_objects :
            # send mail here
            return JsonResponse({"cause": "", "data":"", "code": 200, "detail": "report has been sent to your email address."}, safe=False)
        else:
            return JsonResponse({"cause": "", "data":"", "code": 404, "detail": "you are not allow to get report."}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


@login_required(login_url="/login/")
def payment_details_landlord_report(request):

    if request.method == "POST":
        data = json.load(request)
        roomobjs = request.user.room_set.all()
        payment_objects = []
        for roomobj in roomobjs:
            payment_objects += roomobj.advancepayment_set.all()
        
        print(payment_objects)
        paymentobj = advancePayment.objects.filter(id = data["payobj_id"]).first()
        if paymentobj in payment_objects :
            # send mail here
            return JsonResponse({"cause": "", "data":"", "code": 200, "detail": "report has been sent to your email address."}, safe=False)
        else:
            return JsonResponse({"cause": "", "data":"", "code": 404, "detail": "you are not allow to get report."}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)

@login_required(login_url="/login/")
def bank_connect(request):
    if request.method == "POST":
        data = json.load(request)
        acc_id=""
        print("a")
        if "acc_id" not in data.keys():
            print("b")
            if request.user.user_detail.bank_detail.account_id == None or request.user.user_detail.bank_detail.account_id == "":
                print("f")
                stripe_account = stripe.Account.create(type="standard")
                bankobj = bank_detail.objects.filter(bank_detail = request.user.user_detail).first()
                bankobj.account_id = stripe_account.id
                bankobj.onboarding_completed = "1"
                bankobj.save()
                acc_id = stripe_account.id
            else:
                print("c")
                acc_id = request.user.user_detail.bank_detail.account_id
        elif "acc_id" in data.keys():
            print("d")
            acc_id = data["acc_id"]

        acobj = stripe.AccountLink.create(account=acc_id ,
                type='account_onboarding' , 
                return_url=f"{request.scheme}://{request.get_host()}/bank/link/endpoint/{acc_id}" , 
                refresh_url = f"{request.scheme}://{request.get_host()}/bank/link/refresh/endpoint/{acc_id}/")
        return JsonResponse({"cause": "", "data":{'url' : acobj['url']}, "code": 200, "detail": "redirecting...."}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)
    

@login_required(login_url="/login/")
def bank_unlink(request):
    if request.method == "POST":
        data = json.load(request)
        if request.user.user_detail.bank_detail.account_id == None or request.user.user_detail.bank_detail.account_id == "":
            return JsonResponse({"cause": "", "data":"", "code": 406, "detail": "No Account is Registered yet"}, safe=False)
        else:
            flag = 1
            bankobj = request.user.user_detail.bank_detail
            bankobj.account_id_deauthorised = bankobj.account_id
            try: 
                stripe.OAuth.deauthorize(client_id = settings.CLIENT_ID ,stripe_user_id=request.user.user_detail.bank_detail.account_id)
            except:
                flag = 0
                return JsonResponse({"cause": "", "data":{'url' : acobj['url']}, "code": 400, "detail": "Some error occured."}, safe=False)
            bankobj.onboarding_completed = "0"
            bankobj.account_id = None
            bankobj.save()
            return JsonResponse({"cause": "", "data":"", "code": 200, "detail": "Account Unlinked successful"}, safe=False)
            
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)
    

@login_required(login_url="/login/")
def payment_filter_landlord(request):
    if request.method == "POST":
        data = json.load(request)
        filterdata = data["filter_data"]
        print(filterdata)
        userobj = request.user
        roomobjs = userobj.room_set.all()
        print("total room")
        print(roomobjs)
        data_to_send = []
        objs = []
        if "name_filter" in filterdata.keys():
            roomobjs = roomobjs.filter(id = int(filterdata['name_filter']['data']))
            print("filter room")
            print(roomobjs)

        for roomobj in roomobjs:
            payobjs = roomobj.advancepayment_set.all()
            if "validity_filter" in filterdata.keys():
                payobjs = payobjs.filter(is_expire = filterdata['validity_filter']['data'])
                print("validity is_expire payobjs")
                print(payobjs)
            if "status_filter" in filterdata.keys():
                payobjs = payobjs.filter(status = filterdata['status_filter']['data'])
                print("status payobjs")
                print(payobjs)
            if "time_filter" in filterdata.keys():
                if filterdata['time_filter']['type'] == "date":
                    payobjs = payobjs.filter(datetime__range=[datetime.datetime.fromtimestamp(filterdata['time_filter']["data"][0] / 1000) , datetime.datetime.fromtimestamp(filterdata['time_filter']["data"][1] / 1000)])
                    print("date payobjs")
                    print(payobjs)
                elif filterdata['time_filter']['type'] == "fixed":
                    # print(payobjs)
                    payobjs = payobjs.filter(datetime__gte=datetime.datetime.now()-datetime.timedelta(days=int(filterdata['time_filter']["data"])))
                    print("fix payobjs")
                    print(payobjs)
            objs += payobjs
        
        for obj in objs:
            payment_validity = ""
            if obj.is_expire == "0":
                payment_validity = "active"
            elif obj.is_expire == "1":
                payment_validity = "expired"
            elif obj.is_expire == "2":
                payment_validity = "availed"
            elif obj.is_expire == "3":
                payment_validity = "suspended"
            data_to_send.append({
                "pay_id" : obj.id,
                "datetime" : datetime.datetime.fromtimestamp(datetime.datetime.timestamp(obj.datetime)).strftime("%d %b %Y %H:%M:%S"), 
                "payment_id" : obj.payment_id,
                "room_name" : obj.room.room_name,
                "amount" : obj.amount,
                "status" : obj.status,
                "validity" : payment_validity
            })
        
        return JsonResponse({"cause": "", "data":data_to_send, "code": 200, "detail": "filter applyed successfully"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


def customer_room_detail(request):
    if request.method == "POST":
        data = json.load(request)
        if(data["mode"] == 1): #1 panding 2 expired 3 completed
            data_to_send = []
            jwttoken = data["jwttoken"]
            payment_objects = inqiery.objects.filter(jwttoken= jwttoken).first().advancepayment_set.filter(status = "success")
            # payment_objects = inqiery.objects.filter(jwttoken= jwttoken).first().advancepayment_set.all().filter(is_expire = "0")
            for paymentobj in payment_objects :
                roomobj = paymentobj.room
                dataobj = {
                    "is_expire" : paymentobj.is_expire ,
                    "address" : roomobj.user_detail.user_detail.address,
                    "duedate" : datetime.datetime.fromtimestamp(datetime.datetime.timestamp(paymentobj.datetime) + 10800).strftime("%d %b %Y %H:%M:%S"),
                    "location" : roomobj.user_detail.user_detail.location,
                    "owner_name" : roomobj.user_detail.username,
                    "owner_contact" : roomobj.user_detail.user_detail.mobile,
                    "owner_email" : roomobj.user_detail.email,
                    "room_name" : roomobj.room_name,
                    "room_rate" : roomobj.rate,
                    "room_price" : roomobj.avg_price,
                    "advance_payment" : paymentobj.amount,
                    "room_status" : roomobj.status,
                    "room_id": roomobj.id,
                    "pay_id": paymentobj.id,
                    "facility" : roomobj.facility,
                    "photos" : list()
                }
                for photos in roomobj.room_photo_set.all():
                    dataobj["photos"].append(str(photos.image))
                
                data_to_send.append(dataobj)
            return JsonResponse({"cause": "", "data":data_to_send, "code": 200, "detail": "room detail grabbed."}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


@csrf_exempt
def authAuthEmail(request):
    if request.method == "POST":
        data = json.load(request)
        invalid_field = []
        print(len(data['otp']))
        if data["otp"] == "" or len(data['otp']) != 6:
            invalid_field.append("otp")

        if len(invalid_field) == 0:
            inqobj = inqiery.objects.filter(email = data['email'])
            if len(inqobj) == 0:
                return JsonResponse({"cause": "", "data":"", "code": 404, "detail": "email not found"}, safe=False)
            else:
                inqobj = inqobj.first()
            if data["otp"] == inqobj.otp:   
                inqobj.isverified = 1
                inqobj.status = "subscribed"
                inqobj.otp = "not yet generated"
                inqobj.save()
                return JsonResponse({"cause": "", "data":{"jtoken" : inqobj.jwttoken}, "code": 200, "detail": "email is now verified"}, safe=False)
            else:
                return JsonResponse({"cause": "", "data":"", "code": 422, "detail": "invalid otp"}, safe=False)
        else:
            return JsonResponse({"cause": "invalid data", "data":invalid_field, "code": 406, "detail": "invalid otp"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)



def stripe_session(request):
    if request.method == "POST":
        data = json.load(request)
        roomobj = room.objects.get(id = int(data["room_id"]))
        domain_url = 'http://127.0.0.1:8000/'
        # try:
           
        # ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
        checkout_session = stripe.checkout.Session.create(
            success_url=domain_url + 'room_booked?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=domain_url + 'room_booking_cancelled/',
            payment_method_types=['card'],
            mode='payment',
            metadata= {
                'name': f'Custom Product',
                'room_id' : int(data["room_id"]),
                'jwt' : data["jwttoken"]
            },
            line_items=[
                {
                    'name': f'room_id_{roomobj.id}',
                    'quantity': 1,
                    'currency': 'INR',
                    'amount': f'{ int(int(int(roomobj.avg_price) / 2)*100) }',
                }
            ],
            payment_intent_data={
                'application_fee_amount': f'{int((int(int(roomobj.avg_price) / 2)*100) * settings.COMMISSION_CHARGE)}',
                'transfer_data': {
                'destination': roomobj.user_detail.user_detail.bank_detail.account_id,
                },
            },
        )
        print(int(int(roomobj.avg_price) / 2))
        print(checkout_session)

        return JsonResponse({'sessionId': checkout_session['id']})
        # except Exception as e:
        #     return JsonResponse({'error': str(e)})
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)






# stripe apis

@login_required(login_url = "/login/")
def bank_retrive_detail(request):
    if request.method == "POST":
        acc_id = request.user.user_detail.bank_detail.account_id
        if acc_id == "" or acc_id == None:
            return JsonResponse({"cause": "", "data":"", "code": 406, "detail": "No Account is Registered yet"}, safe=False)
        else:
            data = stripe.Account.retrieve(acc_id)
            balanceobj = stripe.Balance.retrieve(stripe_account=acc_id)
            tr_history = stripe.Transfer.list("destination"== acc_id)

            tr_data = {}
            list_of_tr = []
            for trobj in tr_history['data']:
                custnamer_nm = advancePayment.objects.filter(payment_id = trobj.transfer_group[6:] ).first().inqiery.email
                list_of_tr.append({
                    "payment_id" : trobj.transfer_group[6:],
                    "cust_name" : custnamer_nm,
                })
                if trobj.reversed == False:
                    refundobj = {}
                else: 
                    refundobj =  {
                        "amount" : trobj.reversals.data[0].amount/100 ,
                        "created" : trobj.reversals.data[0].created ,
                        "currency" : trobj.reversals.data[0].currency ,
                        "refund_id" : trobj.reversals.data[0].source_refund ,
                    }
                tr_data[trobj.transfer_group[6:]] ={
                    "customer_name" : custnamer_nm,
                    "amount" : trobj.amount / 100,
                    "currency" : trobj.currency,
                    "created" : trobj.created,
                    "is_reversed" : trobj.reversed,
                    "Payment_id" : trobj.transfer_group[6:],
                    "refund_data" : refundobj,
                    "fees" : settings.COMMISSION_CHARGE,
                }
            bankdata = {}
            list_of_bank  = []
            for bankobj in data.external_accounts.data:
                list_of_bank.append({
                    "external_account_id" : bankobj.id,
                    "bank_name" : bankobj.bank_name,
                })
                bankdata[bankobj.id] = {
                    "external_account_id" : bankobj.id,
                    "account_holder_name" : bankobj.account_holder_name,
                    "bank_name" : bankobj.bank_name,
                    "account_number" : bankobj.last4,
                    "routing_number" : bankobj.routing_number,
                    "country" : bankobj.country,
                    "currency" : bankobj.currency,
                }
            data_to_send = {
                "acc_id" : data.id,
                "list_of_bank" : list_of_bank,
                "bankdata" : bankdata,
                "created_at" : data.created,
                "support_email" : data.email,
                "support_phone" : data.business_profile.support_phone,
                "Statement_Descriptor" : data.business_profile.url,
                "Payout_Descriptor" : data.settings.payouts.statement_descriptor,
                "Payout_Schedule" : data.settings.payouts.schedule,
                "payout_enable" : data.payouts_enabled,
                "payout_method" : data.type,
                "available_bl" : balanceobj.available[0].amount / 100,
                "panding_bl" : balanceobj.pending[0].amount / 100,
                "tr_data" : tr_data,   
                "list_of_tr" : list_of_tr, 
            }
            print(data_to_send)
            return JsonResponse({"cause": "", "data": data_to_send, "code": 200, "detail": "data fetched successfully"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


# this is a basic listener which listen events of account.update in stripe when
# some account connect with our account using stripe connect


@csrf_exempt
@require_http_methods(["POST"])
def bank_connect_listener(request):
    print(request.user)
    event = None
    payload = request.body
    sig_header = request.headers['STRIPE_SIGNATURE']

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        raise e
    except stripe.error.SignatureVerificationError as e:
        raise e

    # Handle the event
    if event['type'] == 'account.updated':
        account = event['data']['object']
        print(account['id'])
        if account["charges_enabled"] == True:
            bankobj = bank_detail.objects.filter(account_id = account['id'] ).first()
            bankobj.onboarding_completed = "2"
            bankobj.save()
            print("on boarding completed")
        elif account["charges_enabled"] == False:
            print("on boarding is under process or failed")
    else:
        print('Unhandled event type {}'.format(event['type']))

    return HttpResponse("ok")

endpoint_secret_refund = 'whsec_WI2YFSFc5gMZFfaC0x0YzkWvZc7UPZ4R'
@csrf_exempt
@require_http_methods(["POST"])
def refund_webhook(request):
    event = None
    payload = request.body
    sig_header = request.headers['STRIPE_SIGNATURE']

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret_refund
        )
    except ValueError as e:
        raise e
    except stripe.error.SignatureVerificationError as e:
        raise e

    # Handle the event
    if event['type'] == 'charge.refunded':
        charge = event['data']['object']
        print(f" this is refund obj : {charge}")
    else:
        print('Unhandled event type {}'.format(event['type']))

    return HttpResponse("ok")