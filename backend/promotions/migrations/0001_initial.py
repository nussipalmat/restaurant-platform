import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Promotion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50, unique=True)),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('promotion_type', models.CharField(choices=[('PERCENTAGE', 'Percentage Discount'), ('FIXED', 'Fixed Amount Discount'), ('FREE_DELIVERY', 'Free Delivery')], max_length=20)),
                ('discount_percentage', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('discount_amount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('minimum_order_amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('maximum_discount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('usage_limit', models.IntegerField(blank=True, help_text='Total number of times this promo can be used', null=True)),
                ('usage_limit_per_user', models.IntegerField(default=1, help_text='Number of times per user')),
                ('usage_count', models.IntegerField(default=0)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'promotions',
                'ordering': ['-created_at'],
            },
        ),
    ]
