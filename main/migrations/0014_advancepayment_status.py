# Generated by Django 3.2 on 2022-03-29 08:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_alter_customerqueries_user_detail'),
    ]

    operations = [
        migrations.AddField(
            model_name='advancepayment',
            name='status',
            field=models.CharField(choices=[('success', 'success'), ('fail', 'fail'),('refunded', 'refunded')], default='fail', max_length=10),
        ),
    ]