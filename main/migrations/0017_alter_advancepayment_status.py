# Generated by Django 3.2 on 2022-03-31 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0016_alter_advancepayment_is_expire'),
    ]

    operations = [
        migrations.AlterField(
            model_name='advancepayment',
            name='status',
            field=models.CharField(choices=[('success', 'success'), ('fail', 'fail')], default='fail', max_length=10),
        ),
    ]
