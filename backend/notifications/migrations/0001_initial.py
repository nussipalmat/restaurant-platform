from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notification_type', models.CharField(choices=[('ORDER', 'Order Update'), ('RESERVATION', 'Reservation Update'), ('PAYMENT', 'Payment Update'), ('PROMOTION', 'Promotion'), ('REVIEW', 'Review'), ('SYSTEM', 'System'), ('ALERT', 'Alert')], max_length=20)),
                ('title', models.CharField(max_length=200)),
                ('message', models.TextField()),
                ('data', models.JSONField(blank=True, default=dict)),
                ('is_read', models.BooleanField(default=False)),
                ('sent_email', models.BooleanField(default=False)),
                ('sent_sms', models.BooleanField(default=False)),
                ('sent_push', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('read_at', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'notifications',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='NotificationSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email_order_updates', models.BooleanField(default=True)),
                ('email_reservation_updates', models.BooleanField(default=True)),
                ('email_promotions', models.BooleanField(default=True)),
                ('email_newsletter', models.BooleanField(default=False)),
                ('sms_order_updates', models.BooleanField(default=False)),
                ('sms_reservation_reminders', models.BooleanField(default=False)),
                ('push_enabled', models.BooleanField(default=True)),
                ('push_order_updates', models.BooleanField(default=True)),
                ('push_promotions', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'notification_settings',
            },
        ),
    ]
