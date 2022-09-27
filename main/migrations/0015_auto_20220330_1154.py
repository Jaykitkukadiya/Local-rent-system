# Generated by Django 3.2 on 2022-03-30 06:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0014_advancepayment_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='advancepayment',
            name='is_expire',
            field=models.CharField(choices=[('1', '1'), ('0', '0')], default='0', max_length=10),
        ),
        migrations.AlterField(
            model_name='room',
            name='status',
            field=models.CharField(choices=[('occupied', 'occupied'), ('free', 'free'), ('blocked', 'blocked')], default='free', max_length=10),
        ),
    ]
