import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DailySalesReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('total_orders', models.IntegerField(default=0)),
                ('completed_orders', models.IntegerField(default=0)),
                ('cancelled_orders', models.IntegerField(default=0)),
                ('gross_revenue', models.DecimalField(decimal_places=2, default=0.0, max_digits=12)),
                ('net_revenue', models.DecimalField(decimal_places=2, default=0.0, max_digits=12)),
                ('tax_collected', models.DecimalField(decimal_places=2, default=0.0, max_digits=12)),
                ('delivery_fees', models.DecimalField(decimal_places=2, default=0.0, max_digits=12)),
                ('discounts_given', models.DecimalField(decimal_places=2, default=0.0, max_digits=12)),
                ('average_order_value', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('unique_customers', models.IntegerField(default=0)),
                ('new_customers', models.IntegerField(default=0)),
                ('returning_customers', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'daily_sales_reports',
                'ordering': ['-date'],
            },
        ),
        migrations.CreateModel(
            name='PopularItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('period_start', models.DateField()),
                ('period_end', models.DateField()),
                ('order_count', models.IntegerField(default=0)),
                ('revenue_generated', models.DecimalField(decimal_places=2, default=0.0, max_digits=12)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'popular_items',
                'ordering': ['-order_count'],
            },
        ),
        migrations.CreateModel(
            name='RevenueTrend',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('period', models.CharField(choices=[('DAILY', 'Daily'), ('WEEKLY', 'Weekly'), ('MONTHLY', 'Monthly'), ('YEARLY', 'Yearly')], max_length=10)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('revenue', models.DecimalField(decimal_places=2, max_digits=12, validators=[django.core.validators.MinValueValidator(0)])),
                ('order_count', models.IntegerField(default=0)),
                ('customer_count', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'revenue_trends',
                'ordering': ['-start_date'],
            },
        ),
    ]
