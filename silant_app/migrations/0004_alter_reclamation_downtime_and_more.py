# Generated by Django 5.1.4 on 2024-12-17 13:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('silant_app', '0003_bridgea_bridgeb_engine_modelmashine_transmission_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reclamation',
            name='downtime',
            field=models.IntegerField(editable=False, verbose_name='Время простоя'),
        ),
        migrations.AlterField(
            model_name='reclamation',
            name='failure_date',
            field=models.DateField(verbose_name='Дата отказа'),
        ),
        migrations.AlterField(
            model_name='reclamation',
            name='restoration_date',
            field=models.DateField(verbose_name='Дата восстановления'),
        ),
    ]