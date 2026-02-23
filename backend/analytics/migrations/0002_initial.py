import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('analytics', '0001_initial'),
        ('menu', '0001_initial'),
        ('restaurants', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='dailysalesreport',
            name='restaurant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='daily_reports', to='restaurants.restaurant'),
        ),
        migrations.AddField(
            model_name='popularitem',
            name='menu_item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='menu.menuitem'),
        ),
        migrations.AddField(
            model_name='popularitem',
            name='restaurant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='popular_items', to='restaurants.restaurant'),
        ),
        migrations.AddField(
            model_name='revenuetrend',
            name='restaurant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='revenue_trends', to='restaurants.restaurant'),
        ),
        migrations.AlterUniqueTogether(
            name='dailysalesreport',
            unique_together={('restaurant', 'date')},
        ),
    ]
