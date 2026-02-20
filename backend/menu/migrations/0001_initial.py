import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MenuCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('order', models.IntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name_plural': 'Menu Categories',
                'db_table': 'menu_categories',
                'ordering': ['order', 'name'],
            },
        ),
        migrations.CreateModel(
            name='MenuItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=8, validators=[django.core.validators.MinValueValidator(0.01)])),
                ('image', models.ImageField(blank=True, null=True, upload_to='menu/items/')),
                ('calories', models.IntegerField(blank=True, null=True)),
                ('allergens', models.JSONField(blank=True, default=list)),
                ('is_available', models.BooleanField(default=True)),
                ('is_vegetarian', models.BooleanField(default=False)),
                ('is_vegan', models.BooleanField(default=False)),
                ('is_gluten_free', models.BooleanField(default=False)),
                ('order_count', models.IntegerField(default=0)),
                ('recipe', models.JSONField(blank=True, default=dict)),
                ('preparation_time', models.IntegerField(default=15, help_text='In minutes')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'menu_items',
                'ordering': ['category', 'name'],
            },
        ),
    ]
