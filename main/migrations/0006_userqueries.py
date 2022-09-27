# Generated by Django 3.2.6 on 2022-01-15 17:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0005_user_detail_profileimg'),
    ]

    operations = [
        migrations.CreateModel(
            name='userqueries',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject', models.CharField(blank=True, max_length=200)),
                ('message', models.CharField(blank=True, max_length=1000)),
                ('email', models.CharField(blank=True, max_length=70)),
                ('reply', models.CharField(blank=True, max_length=1000)),
                ('status', models.CharField(choices=[('unanswered', 'unanswered'), ('answered', 'answered')], default='unanswered', max_length=10)),
                ('user_detail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
