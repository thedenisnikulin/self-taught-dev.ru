# Generated by Django 3.0.8 on 2020-08-05 17:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stdapp', '0003_auto_20200804_1643'),
    ]

    operations = [
        migrations.CreateModel(
            name='PromoCode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
            ],
        ),
    ]
