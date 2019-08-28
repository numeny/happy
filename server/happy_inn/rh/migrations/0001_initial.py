# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2019-08-28 02:36
from __future__ import unicode_literals

import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0008_alter_user_username_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='RhUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.ASCIIUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=30, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=30, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('user_type', models.IntegerField(default=0)),
                ('unionid', models.TextField(default='')),
                ('openid', models.TextField(default='')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='city',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('privince', models.TextField()),
                ('city', models.TextField()),
                ('area', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='favorite',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uid', models.IntegerField(default=0)),
                ('rhId', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='rh',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rh_name', models.TextField()),
                ('rh_phone', models.TextField()),
                ('rh_mobile', models.TextField()),
                ('rh_email', models.TextField()),
                ('rh_postcode', models.TextField()),
                ('rh_location_id', models.TextField()),
                ('rh_type', models.TextField()),
                ('rh_factory_property', models.TextField()),
                ('rh_person_in_charge', models.TextField()),
                ('rh_establishment_time', models.TextField()),
                ('rh_floor_surface', models.TextField()),
                ('rh_building_area', models.TextField()),
                ('rh_bednum', models.TextField()),
                ('rh_staff_num', models.TextField()),
                ('rh_for_persons', models.TextField()),
                ('rh_charges_extent', models.TextField()),
                ('rh_special_services', models.TextField()),
                ('rh_contact_person', models.TextField()),
                ('rh_address', models.TextField()),
                ('rh_url', models.TextField()),
                ('rh_transportation', models.TextField()),
                ('rh_inst_intro', models.TextField()),
                ('rh_inst_charge', models.TextField()),
                ('rh_facilities', models.TextField()),
                ('rh_service_content', models.TextField()),
                ('rh_inst_notes', models.TextField()),
                ('rh_ylw_id', models.TextField()),
                ('rh_privince', models.TextField()),
                ('rh_city', models.TextField()),
                ('rh_area', models.TextField()),
                ('rh_title_image', models.TextField(default='')),
                ('rh_images', models.TextField(default='')),
                ('rh_charges_min', models.IntegerField(default=0)),
                ('rh_charges_max', models.IntegerField(default=1000000)),
                ('rh_bednum_int', models.IntegerField(default=0)),
            ],
        ),
    ]
