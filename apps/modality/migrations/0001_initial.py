# Generated by Django 3.1.7 on 2023-04-15 11:47

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Modality',
            fields=[
                ('modality_id', models.AutoField(primary_key=True, serialize=False, verbose_name='Id modalidad')),
                ('name', models.CharField(max_length=30, unique=True, verbose_name='Nombre')),
            ],
            options={
                'verbose_name': 'Modalidad',
                'verbose_name_plural': 'Modalidades',
            },
        ),
    ]
