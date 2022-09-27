from django import template
from main.models import *
import datetime

register = template.Library()

@register.simple_tag
def getfilter(roomobj , field):
    lst = roomobj.customer_set.filter(status = "occupied")
    if len(lst) >= 1:
        return getattr(lst.first(),field)
    else: 
        return None

@register.simple_tag
def getdate(payobj):
    return datetime.datetime.fromtimestamp(datetime.datetime.timestamp(payobj.datetime)).strftime("%d %b %Y %H:%M:%S")
@register.simple_tag
def getpayvalidity(payobj):
    payment_validity = ""
    if payobj.is_expire == "0":
        payment_validity = "active"
    elif payobj.is_expire == "1":
        payment_validity = "expired"
    elif payobj.is_expire == "2":
        payment_validity = "availed"
    elif payobj.is_expire == "3":
        payment_validity = "suspended"
    return payment_validity