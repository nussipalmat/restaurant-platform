from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='order_type',
            field=models.CharField(choices=[('DELIVERY', 'Delivery'), ('PICKUP', 'Pickup')], default='DELIVERY', max_length=20),
        ),
    ]
