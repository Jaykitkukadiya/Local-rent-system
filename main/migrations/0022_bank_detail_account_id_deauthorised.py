# Generated by Django 3.2.6 on 2022-04-03 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0021_auto_20220403_1136'),
    ]

    operations = [
        migrations.AddField(
            model_name='bank_detail',
            name='account_id_deauthorised',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
