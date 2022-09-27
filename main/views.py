from django.shortcuts import render , HttpResponse, redirect
from .models import *
import json
import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt , csrf_protect
import stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

from django.contrib.auth.decorators import login_required 
from django.views.decorators.http import require_http_methods

# background task imports
from background_task import background
from django.contrib.auth.models import User

# email imports
import smtplib
import ssl
from email.message import EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags



# background tasks
@background(schedule=10800)
def freerooms(room_id, payobjid):
    roomobj = room.objects.filter(id = int(room_id)).first()
    payobj = advancePayment.objects.filter(id = int(payobjid)).first()
    roomobj.status = "free"
    payobj.is_expire = "1"
    roomobj.save()
    payobj.save()




stripe.api_key = settings.STRIPE_SECRET_KEY


def login(request):
    if str(request.user) == "AnonymousUser":
        print(request.user)
        return render(request , 'login.html')
    else:
        return redirect("/landlord/dashboard/")

def home(request):
    
    return render(request , 'home.html')
def searchplaces(request):
    pure_data_collection = []
    room_location_data = []
    for obj in user_detail.objects.all():
        pure_data = {}
        if (obj.user_detail.first_name != "" or  obj.user_detail.first_name != None ) and (obj.user_detail.last_name != "" or obj.user_detail.last_name != None):
            pure_data["username"] = f"{obj.user_detail.first_name} {obj.user_detail.last_name}"
        else:
            pure_data["username"] = obj.user_detail.username
        print(obj.user_detail.last_name)
        pure_data["user_id"] = str(obj.id)
        pure_data["address"] = obj.address
        pure_data["pincode"] = obj.pincode
        pure_data["mobile"] = obj.mobile
        pure_data["location"] = str(obj.location)
        pure_data['rooms'] = []
        for roomobj in obj.user_detail.room_set.all().filter(status = "free"):
            print(roomobj.room_name)
            pure_data_rooms = {
                "id" : str(roomobj.id),
                "name" : roomobj.room_name,
                "price" : roomobj.avg_price,
                "rating" : roomobj.rate,
                "facility" : roomobj.facility,
                "photos" : [],
            }
            for photoobj in roomobj.room_photo_set.all():
                pure_data_rooms["photos"].append(str(photoobj.image))
            pure_data['rooms'].append(pure_data_rooms)

        pure_data_collection.append(pure_data)


        room_location_data.append(obj.location)


    print(pure_data_collection)


    print(room_location_data)
    return render(request , 'search.html' , {"room_location_data" : room_location_data , "room_data" : pure_data_collection , 'public': settings.STRIPE_PUBLISHABLE_KEY})

def add_room(request):
    return render(request , 'add_room.html')

def advance_book(request, room_id):
    return HttpResponse(room_id)


# issue: email is not visible properly in gmail only code has been showed insted of html page
# def sendconfirmmail(data , inqobj , roomobj, paymentobj):
#     data = {}
#     data["custemail"] = inqobj.email
#     if roomobj.user_detail.first_name != "" and roomobj.user_detail.last_name != "":
#         data["roomownername"] = f"{roomobj.user_detail.first_name} {roomobj.user_detail.last_name}"
#     else:
#         data["roomownername"] = roomobj.user_detail.username
#     data["roomowneremail"] = roomobj.user_detail.email
#     data["roomownermobile"] = roomobj.user_detail.user_detail.mobile
#     data["roomowneraddr"] = roomobj.user_detail.user_detail.address
#     data["roomowneraddrletlong"] = roomobj.user_detail.user_detail.location
#     data["roomname"] = roomobj.room_name
#     data["duedatetime"] = str(paymentobj.datetime)

#     data["payment_id"] = paymentobj.payment_id
#     data["payment_status"]  = "success"
#     data["payment_amount"] = str(paymentobj.amount)
#     data["paymentdatetime"] = str(paymentobj.datetime)

#     # try:
#     with smtplib.SMTP("smtp.gmail.com", 587) as server:
#         server.ehlo()
#         server.starttls()
#         server.ehlo()
#         server.login(settings.EMAIL_ADDRESS, settings.EMAIL_PASSWORD )
#         msg = EmailMessage()
#         msg['Subject'] = "locallease CONFIRMATION"
#         msg['From'] = "chachamehta33@gmail.com"
#         msg['to'] = data["custemail"]
#         texthtml = render_to_string("test.html" , data)
#         textht = strip_tags(texthtml)
#         msg.add_alternative(textht)
#         server.send_message(msg)
#         flag = 0
#     # except:
#     #     flag = 1
#     #     print("email error")
                

@csrf_exempt
def room_booked(request):   
    session = dict(stripe.checkout.Session.retrieve(request.GET['session_id']))
    roomobj = room.objects.filter(id = session["metadata"]["room_id"] ).first()
    inqobj  = inqiery.objects.filter(jwttoken = session["metadata"]["jwt"]).first()
    # save payment details
    if len(advancePayment.objects.filter(payment_id = request.GET['session_id'])) == 0:
        paymentdetailobj = advancePayment.objects.create(
            payment_id = session['payment_intent'],
            amount = int(session["amount_total"])/100,
            inqiery = inqiery.objects.filter(jwttoken = session["metadata"]["jwt"]).first(),
            room = roomobj,
            is_expire = "0",
            status = "success"
        )
        roomobj.status = "blocked"
        paymentdetailobj.expire_task_id  =freerooms(roomobj.id , paymentdetailobj.id).id
        roomobj.save()
        paymentdetailobj.save()



        # issue occured

        # send mail for confirmation to both customer and landlord
        # ....
        # sendconfirmmail(session , inqobj , roomobj , paymentdetailobj )



        return render(request , "advance_payment_success_process.html" , {
            "payment_id" : request.GET['session_id'] ,
            "amount" : int(session["amount_total"])/100,
            "email" : inqiery.objects.filter(jwttoken = session["metadata"]["jwt"]).first().email,
            "jwt" : session["metadata"]["jwt"],
            })
    else:
        return redirect("/")
def room_booking_cancelled(request):
    return HttpResponse("room booking failed")

def user_dashboard(request , toc = None):
    print(toc)
    if toc != " " and toc != "" and toc != None:
        userobj = inqiery.objects.filter(jwttoken=toc)
        if len(userobj) == 1:
            return render(request , 'user_dashboard.html' , {"userobj" : userobj.first()})
        else:
            return redirect("/")
    else:
        return redirect("/")

@login_required(login_url="/login/")
def landlord_dashboard(request):
    paydata = []
    roomname = []
    for roomobj in request.user.room_set.all():
        roomname.append(roomobj)
        for payobj in roomobj.advancepayment_set.all():
            paydata.append(payobj)
    return render(request , 'landlord_dashboard.html', {"user" : request.user , "room_data" :  room.objects.filter(user_detail = request.user), "payment_data" : reversed(paydata) , "roomname" : roomname})




@csrf_exempt
def bank_link_endp(request , acc_id ):
    # original one
    # bankobj = bank_detail.objects.filter(account_id = acc_id ).first()
    # return HttpResponse(f"account status = {bankobj.onboarding_completed} ////// data as response {stripe.Account.retrieve(acc_id)}")

    # temprory for testing
    bankobj = bank_detail.objects.filter(account_id = acc_id ).first()
    datax = {
        "acc_id" : acc_id,
        "onboarding_status" : bankobj.onboarding_completed
    }
    return render(request , "onboardinghandler.html" , datax)


@csrf_exempt
def bank_link_refresh_endp(request , acc_id):
    # print(acc_id)
    # delobj = stripe.Account.delete(acc_id)
    # return HttpResponse(f"deletation reoprt : {delobj}")


    bankobj = bank_detail.objects.filter(account_id = acc_id ).first()
    datax = {
        "acc_id" : acc_id,
        "onboarding_status" : bankobj.onboarding_completed
    }
    return render(request , "onboardinghandler.html" , datax)