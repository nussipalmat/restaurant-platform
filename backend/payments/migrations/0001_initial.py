import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('currency', models.CharField(default='USD', max_length=3)),
                ('payment_method', models.CharField(choices=[('CARD', 'Credit/Debit Card'), ('STRIPE', 'Stripe'), ('CASH', 'Cash'), ('WALLET', 'Digital Wallet')], max_length=20)),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('PROCESSING', 'Processing'), ('SUCCEEDED', 'Succeeded'), ('FAILED', 'Failed'), ('REFUNDED', 'Refunded'), ('PARTIALLY_REFUNDED', 'Partially Refunded')], default='PENDING', max_length=20)),
                ('stripe_payment_intent_id', models.CharField(blank=True, max_length=255)),
                ('stripe_charge_id', models.CharField(blank=True, max_length=255)),
                ('client_secret', models.CharField(blank=True, max_length=255)),
                ('refund_amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('refund_reason', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('paid_at', models.DateTimeField(blank=True, null=True)),
                ('refunded_at', models.DateTimeField(blank=True, null=True)),
                ('order', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='payment', to='orders.order')),
            ],
            options={
                'db_table': 'payments',
                'ordering': ['-created_at'],
            },
        ),
    ]
