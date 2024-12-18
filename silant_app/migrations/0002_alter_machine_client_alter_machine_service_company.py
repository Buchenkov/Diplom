# Generated by Django 5.1.4 on 2024-12-10 18:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('silant_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='machine',
            name='client',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='machines', to='silant_app.client'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='service_company',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='machines', to='silant_app.servicecompany'),
        ),
    ]