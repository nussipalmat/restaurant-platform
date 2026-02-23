import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('slug', models.SlugField(max_length=250, unique=True)),
                ('description', models.TextField()),
                ('cuisine_type', models.JSONField(default=list)),
                ('price_range', models.CharField(choices=[('$', 'Budget'), ('$$', 'Moderate'), ('$$$', 'Expensive'), ('$$$$', 'Very Expensive')], default='$$', max_length=5)),
                ('phone', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=254)),
                ('website', models.URLField(blank=True)),
                ('street_address', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=100)),
                ('state', models.CharField(max_length=100)),
                ('postal_code', models.CharField(max_length=20)),
                ('country', models.CharField(default='USA', max_length=100)),
                ('latitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
                ('longitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
                ('business_hours', models.JSONField(default=dict)),
                ('status', models.CharField(choices=[('PENDING', 'Pending Approval'), ('ACTIVE', 'Active'), ('INACTIVE', 'Inactive'), ('SUSPENDED', 'Suspended')], default='PENDING', max_length=20)),
                ('is_accepting_orders', models.BooleanField(default=True)),
                ('average_rating', models.DecimalField(decimal_places=2, default=0.0, max_digits=3)),
                ('total_reviews', models.IntegerField(default=0)),
                ('features', models.JSONField(default=list)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='restaurants/logos/')),
                ('cover_image', models.ImageField(blank=True, null=True, upload_to='restaurants/covers/')),
                ('delivery_fee', models.DecimalField(decimal_places=2, default=0.0, max_digits=6)),
                ('minimum_order', models.DecimalField(decimal_places=2, default=0.0, max_digits=8)),
                ('estimated_delivery_time', models.IntegerField(default=30, help_text='In minutes')),
                ('tax_rate', models.DecimalField(decimal_places=2, default=0.0, max_digits=4)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'restaurants',
                'ordering': ['-average_rating', '-created_at'],
            },
        ),
        migrations.CreateModel(
            name='RestaurantImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='restaurants/gallery/')),
                ('caption', models.CharField(blank=True, max_length=200)),
                ('order', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'restaurant_images',
                'ordering': ['order', '-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('title', models.CharField(blank=True, max_length=200)),
                ('comment', models.TextField()),
                ('food_rating', models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('service_rating', models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('ambiance_rating', models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('is_verified_purchase', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'reviews',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Table',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('table_number', models.CharField(max_length=20)),
                ('capacity', models.IntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('is_available', models.BooleanField(default=True)),
                ('location', models.CharField(blank=True, max_length=50)),
            ],
            options={
                'db_table': 'restaurant_tables',
                'ordering': ['table_number'],
            },
        ),
    ]
