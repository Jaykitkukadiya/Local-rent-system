# Generated by Django 3.2.6 on 2022-01-14 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_auto_20211126_1622'),
    ]

    operations = [
        migrations.AddField(
            model_name='user_detail',
            name='profileImg',
            field=models.ImageField(default='/static/icon/default_profile_img.svg', upload_to='landloard_profile_imgs/'),
        ),
    ]