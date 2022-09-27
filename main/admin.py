from django.contrib import admin
from .models import user_detail , room , room_photo , customer,bank_detail ,userqueries, customerqueries , inqiery,advancePayment
# Register your models here.

admin.site.register(user_detail)
admin.site.register(room)
admin.site.register(room_photo)
admin.site.register(customer)
admin.site.register(userqueries)
admin.site.register(customerqueries)
admin.site.register(inqiery)
admin.site.register(advancePayment) 
admin.site.register(bank_detail) 