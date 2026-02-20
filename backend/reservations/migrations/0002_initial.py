import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('reservations', '0001_initial'),
        ('restaurants', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='restaurant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reservations', to='restaurants.restaurant'),
        ),
        migrations.AddField(
            model_name='reservation',
            name='table',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reservations', to='restaurants.table'),
        ),
    ]
