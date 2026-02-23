import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('inventory', '0001_initial'),
        ('restaurants', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='inventoryitem',
            name='restaurant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='inventory_items', to='restaurants.restaurant'),
        ),
        migrations.AddField(
            model_name='stockmovement',
            name='inventory_item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movements', to='inventory.inventoryitem'),
        ),
    ]
