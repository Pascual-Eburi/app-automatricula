# Generated by Django 3.1.7 on 2023-04-22 16:53

import apps.student.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('institute', '0005_auto_20230417_0332'),
        ('modality', '0001_initial'),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='user.useraccount')),
                ('photo', models.ImageField(blank=True, max_length=500, null=True, upload_to=apps.student.models.student_photo_directory)),
                ('dob', models.DateField()),
                ('village', models.CharField(max_length=100)),
                ('school_report', models.FileField(max_length=500, upload_to=apps.student.models.school_report_directory)),
                ('gender', models.CharField(choices=[('masculino', 'Masculino'), ('femenino', 'Femenino')], default='masculino', max_length=10)),
                ('high_school_grade', models.DecimalField(decimal_places=2, max_digits=4)),
                ('doc_type', models.CharField(choices=[('dip', 'DIP'), ('pasaporte', 'Pasaporte'), ('otro', 'Otro')], default='dip', max_length=20)),
                ('doc_number', models.CharField(max_length=10)),
                ('institute', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='institute.institute')),
                ('modality', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='modality.modality')),
            ],
        ),
    ]