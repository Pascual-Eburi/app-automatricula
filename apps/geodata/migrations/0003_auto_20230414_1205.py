# Generated by Django 3.1.7 on 2023-04-14 12:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('geodata', '0002_auto_20230414_0956'),
    ]

    operations = [
        migrations.AlterField(
            model_name='district',
            name='province_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='districts', to='geodata.province'),
        ),
    ]