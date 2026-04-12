from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_remove_dine_in_order_type'),
        ('reservations', '0004_reservation_unique_table_booking_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='reservation',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='orders',
                to='reservations.reservation',
            ),
        ),
    ]
