# Generated by Django 5.1.4 on 2024-12-17 14:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('silant_app', '0004_alter_reclamation_downtime_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reclamation',
            name='spare_parts',
            field=models.TextField(blank=True, null=True),
        ),
    ]
