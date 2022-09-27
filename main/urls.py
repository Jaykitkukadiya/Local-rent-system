from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login),
    path('add_housing/', views.add_room),
    path('user/dashboard/<str:toc>/', views.user_dashboard),
    path('landlord/dashboard/', views.landlord_dashboard),
    path('home/search/', views.searchplaces),
    path('book/<int:room_id>/', views.advance_book),
    path('room_booking_cancelled/', views.room_booking_cancelled),
    path('room_booked/', views.room_booked),
    path('bank/link/endpoint/<str:acc_id>/', views.bank_link_endp),
    path('bank/link/refresh/endpoint/<str:acc_id>/', views.bank_link_refresh_endp),
    path('room_booked/', views.room_booked),
    path('', views.home),
]