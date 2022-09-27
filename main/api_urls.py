from django.contrib import admin
from django.urls import path
from .models import user_detail , room , room_photo , customer 
from . import apis

urlpatterns = [
    path('login/', apis.log_in),
    path('signup/', apis.signup),
    path('add/room/', apis.add_room),
    path('deallocation/room/', apis.deallocate_room),
    path('allocation/room/', apis.allocate_room),
    path('update/landlord/profile/', apis.updateLandlordDetails),
    path('contact/query/', apis.contactQuery),
    path('contact/query/customer/', apis.contactQueryCustomer),
    path('send/authEmail/', apis.sendAuthEmail),
    path('auth/authEmail/', apis.authAuthEmail),
    path('payment/create/session/', apis.stripe_session),
    path('payment/customer/details/', apis.payment_details_customer),
    path('payment/customer/report/', apis.payment_details_customer_report),
    path('payment/landlord/report/', apis.payment_details_landlord_report),
    path('customer/roomdetail/', apis.customer_room_detail),
    path('blocked/roomdetail/', apis.blocked_room_detail_landlord),
    path('unblock/room/', apis.unblock_room_landlord),
    path('payment/filter/landlord/', apis.payment_filter_landlord),
    # path('forgot_password/', apis.reset_password),


    path('bank/detail/retrive/', apis.bank_retrive_detail),
    path('bank/connect/', apis.bank_connect),
    path('bank/unlink/', apis.bank_unlink),
    path('bank/connect/listener', apis.bank_connect_listener),
    path('refund/listener', apis.refund_webhook),

]
