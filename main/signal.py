from django.dispatch import receiver
from django.contrib.auth.models import User
from django.db.models.signals import post_save , pre_save
from .models import user_detail , room , room_photo , customer , bank_detail 
from background_task.models import *


@receiver( post_save ,sender = User)
def user_save(sender , instance , created , **kwargs):
    if created:
        user_d = user_detail.objects.create(
            user_detail = instance
        )
        bank_detail.objects.create(
            bank_detail = user_d,
            onboarding_completed = "0",
        )
@receiver( post_save ,sender = customer)
def user_save(sender , instance , created , **kwargs):
    if created:
        # if new customer arrived and then we just have to create customer object
        # after create customer obj
        roomobj = instance.room
        payobj = roomobj.advancepayment_set.all().filter(is_expire = "0").first()
        if payobj != None:
            payobj.customer = instance
            payobj.is_expire = "2"
            Task.objects.filter(id=int(payobj.expire_task_id)).delete()
            payobj.save()
        # change avg price based on n time occupied
        if roomobj.n_time_occupied == "0":
            # intial setting 
            roomobj.avg_price = instance.price_payed
        else:
            roomobj.avg_price = int(int(int(float(roomobj.avg_price)) + int(instance.price_payed)) / 2)

        # change n time occupied number due to room occupied once again
        roomobj.n_time_occupied = (int(roomobj.n_time_occupied) + 1)

        #finally change status
        roomobj.status = "occupied"
        roomobj.save()

    else:
        roomobj = instance.room
        # while customer gets free we have to deallocate room by change their status
        if 'status' in kwargs["update_fields"] and instance.status == "free":
            roomobj.status = "free"
            roomobj.save()
