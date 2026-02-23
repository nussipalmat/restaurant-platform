import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='InventoryItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('sku', models.CharField(blank=True, max_length=50)),
                ('category', models.CharField(max_length=100)),
                ('current_quantity', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('minimum_quantity', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('unit', models.CharField(choices=[('KG', 'Kilogram'), ('G', 'Gram'), ('L', 'Liter'), ('ML', 'Milliliter'), ('PIECE', 'Piece'), ('BOX', 'Box'), ('PACK', 'Pack')], default='PIECE', max_length=10)),
                ('unit_cost', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('supplier_name', models.CharField(blank=True, max_length=200)),
                ('supplier_contact', models.CharField(blank=True, max_length=100)),
                ('last_restocked', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'inventory_items',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='StockMovement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('movement_type', models.CharField(choices=[('RESTOCK', 'Restock'), ('USAGE', 'Usage'), ('ADJUSTMENT', 'Adjustment'), ('WASTE', 'Waste')], max_length=20)),
                ('quantity', models.DecimalField(decimal_places=2, max_digits=10)),
                ('previous_quantity', models.DecimalField(decimal_places=2, max_digits=10)),
                ('new_quantity', models.DecimalField(decimal_places=2, max_digits=10)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'stock_movements',
                'ordering': ['-created_at'],
            },
        ),
    ]
