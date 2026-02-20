import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_number', models.CharField(editable=False, max_length=50, unique=True)),
                ('order_type', models.CharField(choices=[('DELIVERY', 'Delivery'), ('PICKUP', 'Pickup'), ('DINE_IN', 'Dine In')], default='DELIVERY', max_length=20)),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('CONFIRMED', 'Confirmed'), ('PREPARING', 'Preparing'), ('READY', 'Ready for Pickup'), ('OUT_FOR_DELIVERY', 'Out for Delivery'), ('DELIVERED', 'Delivered'), ('CANCELLED', 'Cancelled'), ('REFUNDED', 'Refunded')], default='PENDING', max_length=20)),
                ('delivery_instructions', models.TextField(blank=True)),
                ('subtotal', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('tax', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('delivery_fee', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('discount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('total', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('payment_method', models.CharField(choices=[('CARD', 'Credit/Debit Card'), ('CASH', 'Cash'), ('WALLET', 'Digital Wallet')], default='CARD', max_length=20)),
                ('is_paid', models.BooleanField(default=False)),
                ('estimated_delivery_time', models.DateTimeField(blank=True, null=True)),
                ('delivered_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('cancellation_reason', models.TextField(blank=True)),
                ('cancelled_at', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'orders',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('subtotal', models.DecimalField(decimal_places=2, max_digits=10)),
                ('special_instructions', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'order_items',
            },
        ),
    ]
