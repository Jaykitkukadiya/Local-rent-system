from django.db import models
from django.contrib.auth.models import User
from django.db.models.base import Model
from django.db.models.enums import Choices
import jwt
from django.conf import settings
# Create your models here.




class user_detail(models.Model):
    role = (("user","user"),("landlord","landlord"))

    user_detail = models.OneToOneField(User , on_delete= models.CASCADE)
    profileImg = models.ImageField(upload_to="landloard_profile_imgs/" , default= "/static/icon/default_profile_img.svg")
    mobile = models.CharField(max_length= 10 ,blank=True)
    address = models.TextField(blank=True)
    location = models.CharField(max_length= 100 ,blank=True)
    pincode = models.CharField(max_length= 6 ,blank=True)
    role = models.CharField(max_length= 10 , choices=role, default="landlord")

    def save(self, *args, **kwargs):
        if self.pk:
            # If self.pk is not None then it's an update.
            cls = self.__class__
            old = cls.objects.get(pk=self.pk)
            # This will get the current model state since super().save() isn't called yet.
            new = self  # This gets the newly instantiated Mode object with the new values.
            changed_fields = []
            for field in cls._meta.get_fields():
                field_name = field.name
                try:
                    if getattr(old, field_name) != getattr(new, field_name):
                        changed_fields.append(field_name)
                except Exception as ex:  # Catch field does not exist exception
                    pass
            kwargs['update_fields'] = changed_fields
        super().save(*args, **kwargs)



class bank_detail(models.Model):
    onboard_status = (("0","0"),("1","1"),("2","2"))
    # 0 not initiated
    # 1 not ac generated
    # 2 not on boarding completed
    bank_detail = models.OneToOneField(user_detail , on_delete= models.CASCADE)
    account_id = models.CharField(max_length = 200 , blank=True , null=True)
    onboarding_completed = models.CharField(max_length=2 , choices=onboard_status , default= "0")
    account_id_deauthorised = models.CharField(max_length = 200 , blank=True , null=True)

class room(models.Model):
    status = (("occupied","occupied"),("free","free"),("blocked","blocked"))
    user_detail = models.ForeignKey(User , on_delete=models.CASCADE)
    room_name = models.CharField(max_length = 200)
    facility = models.CharField(max_length= 1000 ,blank=True)
    avg_price = models.CharField(max_length = 7)
    rate = models.CharField(max_length=1 , default= "3")
    n_time_occupied = models.CharField(max_length=10 , default= "0")
    status = models.CharField(max_length=10 , choices=status , default= "free")

    def save(self, *args, **kwargs):
        if self.pk:
            # If self.pk is not None then it's an update.
            cls = self.__class__
            old = cls.objects.get(pk=self.pk)
            # This will get the current model state since super().save() isn't called yet.
            new = self  # This gets the newly instantiated Mode object with the new values.
            changed_fields = []
            for field in cls._meta.get_fields():
                field_name = field.name
                try:
                    if getattr(old, field_name) != getattr(new, field_name):
                        changed_fields.append(field_name)
                except Exception as ex:  # Catch field does not exist exception
                    pass
            kwargs['update_fields'] = changed_fields
        super().save(*args, **kwargs)
class userqueries(models.Model):
    status = (("unanswered","unanswered"),("answered","answered"))
    user_detail = models.ForeignKey(User , on_delete=models.CASCADE)
    subject = models.CharField(max_length = 200 , blank=True)
    message = models.CharField(max_length= 1000 ,blank=True)
    email = models.CharField(max_length = 70 , blank=True)
    reply = models.CharField(max_length= 1000 ,blank=True)
    status = models.CharField(max_length=10 , choices=status , default= "unanswered")
    date = models.DateTimeField(auto_now_add = True)


    
class room_photo(models.Model):
    room = models.ForeignKey(room , on_delete=models.CASCADE)
    image = models.ImageField( upload_to="room_photos/")

    def save(self, *args, **kwargs):
        if self.pk:
            # If self.pk is not None then it's an update.
            cls = self.__class__
            old = cls.objects.get(pk=self.pk)
            # This will get the current model state since super().save() isn't called yet.
            new = self  # This gets the newly instantiated Mode object with the new values.
            changed_fields = []
            for field in cls._meta.get_fields():
                field_name = field.name
                try:
                    if getattr(old, field_name) != getattr(new, field_name):
                        changed_fields.append(field_name)
                except Exception as ex:  # Catch field does not exist exception
                    pass
            kwargs['update_fields'] = changed_fields
        super().save(*args, **kwargs)


class customer(models.Model):
    status = (("occupied","occupied"),("free","free"))
    room = models.ForeignKey(room , on_delete= models.CASCADE) #once define cant change
    name = models.CharField(max_length= 50) #once define cant change
    occupied_time = models.DateTimeField(auto_now_add = True) #once define cant change
    document_type = models.CharField(max_length= 200 , blank="true")#once define cant change
    document = models.FileField(upload_to="documents/" , blank="true") #once define cant change
    price_payed = models.CharField(max_length=7) #once define cant change
    staytime = models.CharField(max_length=5 , default= "1") #can be change
    status = models.CharField(max_length=10 , choices=status , default="occupied") #can be change

    def save(self, *args, **kwargs):
        if self.pk:
            # If self.pk is not None then it's an update.
            cls = self.__class__
            old = cls.objects.get(pk=self.pk)
            # This will get the current model state since super().save() isn't called yet.
            new = self  # This gets the newly instantiated Mode object with the new values.
            changed_fields = []
            for field in cls._meta.get_fields():
                field_name = field.name
                try:
                    if getattr(old, field_name) != getattr(new, field_name):
                        changed_fields.append(field_name)
                except Exception as ex:  # Catch field does not exist exception
                    pass
            kwargs['update_fields'] = changed_fields
        super().save(*args, **kwargs)

    @property
    def fst(self):
        lst = self.__class__.objects.filter(status = "occupied")
        print(lst)
        print("lst")
        if len(lst) >= 1:
            return lst.first()
        else: 
            return None




class inqiery(models.Model):
    email_status = (("subscribed","subscribed"),("unsubscribed","unsubscribed"))
    email_verified_status = (("0","0"),("1","1"))
    email = models.CharField(max_length = 50)
    otp = models.CharField(max_length= 10, blank=True)
    isverified = models.CharField(max_length = 2, choices= email_verified_status , default= 0)
    status = models.CharField(max_length= 15 , choices=email_status, default="unsubscribed")
    jwttoken = models.CharField(max_length = 500, default = "")
    socialtoken = models.CharField(max_length = 500, default = "")
    issocial = models.CharField(max_length=5 , default= "0" , choices= email_verified_status)
    date = models.DateTimeField(auto_now_add = True)

    def create(self, **kwargs):
        """
        Create a new object with the given kwargs, saving it to the database
        and returning the created object.
        """
        obj = self.model(**kwargs)
        self._for_write = True
        obj.save(force_insert=True, using=self.db)
        return obj
    def save(self, *args, **kwargs):
        new = self  # This gets the newly instantiated Mode object with the new values.
        if self.pk:
            # If self.pk is not None then it's an update.
            cls = self.__class__
            old = cls.objects.get(pk=self.pk)
            # This will get the current model state since super().save() isn't called yet.
            changed_fields = []
            for field in cls._meta.get_fields():
                field_name = field.name
                try:
                    if getattr(old, field_name) != getattr(new, field_name):
                        changed_fields.append(field_name)
                except Exception as ex:  # Catch field does not exist exception
                    pass
            kwargs['update_fields'] = changed_fields
            tokenval = jwt.encode({'email': getattr(old, 'email'),'issocial': getattr(old, 'issocial'), 'id': getattr(old, 'id')}, settings.SECRET_KEY, algorithm='HS256')
            self.jwttoken=tokenval
            print(super(inqiery,self))
        super().save()

class customerqueries(models.Model):
    status = (("unanswered","unanswered"),("answered","answered"))
    user_detail = models.ForeignKey(inqiery , on_delete=models.CASCADE)
    subject = models.CharField(max_length = 200 , blank=True)
    message = models.CharField(max_length= 1000 ,blank=True)
    email = models.CharField(max_length = 70 , blank=True)
    reply = models.CharField(max_length= 1000 ,blank=True)
    status = models.CharField(max_length=10 , choices=status , default= "unanswered")
    date = models.DateTimeField(auto_now_add = True)

class advancePayment(models.Model):
    status = (("success","success"),("fail","fail"),('refunded', 'refunded'))
    exp_status = (("3","3"),("2","2"),("1","1"),("0","0"))
    # 1 : active , 2:expired , 3:availed , 4:suspended
    inqiery = models.ForeignKey(inqiery, on_delete=models.DO_NOTHING)
    room = models.ForeignKey(room ,  on_delete=models.DO_NOTHING )
    customer = models.ForeignKey(customer , on_delete = models.DO_NOTHING , null=True)
    payment_id = models.CharField(max_length= 100)
    amount = models.CharField(max_length=10)
    status = models.CharField(max_length=10 , choices=status , default="fail")
    refund_id = models.CharField(max_length= 100 , blank=True,null=True)
    refund_status = models.CharField(max_length= 100 , blank=True,null=True)
    is_expire = models.CharField(max_length=10 , choices=exp_status , default="0")
    expire_task_id = models.CharField(max_length=10)
    datetime = models.DateTimeField(auto_now_add = True)
