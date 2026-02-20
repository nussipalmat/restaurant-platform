import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('promotions', '0001_initial'),
        ('restaurants', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='promotion',
            name='restaurant',
            field=models.ForeignKey(blank=True, help_text='Leave blank for platform-wide promotions', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='promotions', to='restaurants.restaurant'),
        ),
    ]
