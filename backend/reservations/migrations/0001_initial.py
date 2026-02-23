import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reservation_date', models.DateField()),
                ('reservation_time', models.TimeField()),
                ('guests_count', models.IntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('CONFIRMED', 'Confirmed'), ('SEATED', 'Seated'), ('COMPLETED', 'Completed'), ('CANCELLED', 'Cancelled'), ('NO_SHOW', 'No Show')], default='PENDING', max_length=20)),
                ('special_requests', models.TextField(blank=True)),
                ('phone', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=254)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('cancelled_at', models.DateTimeField(blank=True, null=True)),
                ('cancellation_reason', models.TextField(blank=True)),
            ],
            options={
                'db_table': 'reservations',
                'ordering': ['-reservation_date', '-reservation_time'],
            },
        ),
    ]
