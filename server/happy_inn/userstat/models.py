# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import django.utils.timezone as timezone

# Create your models here.
class userstat(models.Model):
    user_ip = models.TextField()
    user_type = models.TextField()

    # after login, FIXME, refer to RhUser's unionid/openid
    user_id = models.IntegerField(default=-1)

    visitTime = models.DateTimeField('visit time', default=timezone.now)
    location = models.TextField()
    visit_func = models.TextField()
    visit_param = models.TextField()
