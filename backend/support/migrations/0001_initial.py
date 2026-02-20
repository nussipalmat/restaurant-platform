from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SupportTicket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ticket_number', models.CharField(editable=False, max_length=50, unique=True)),
                ('category', models.CharField(choices=[('ORDER', 'Order Issue'), ('PAYMENT', 'Payment Issue'), ('RESERVATION', 'Reservation Issue'), ('ACCOUNT', 'Account Issue'), ('TECHNICAL', 'Technical Issue'), ('FEEDBACK', 'Feedback'), ('OTHER', 'Other')], max_length=20)),
                ('subject', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('status', models.CharField(choices=[('OPEN', 'Open'), ('IN_PROGRESS', 'In Progress'), ('WAITING_CUSTOMER', 'Waiting for Customer'), ('RESOLVED', 'Resolved'), ('CLOSED', 'Closed')], default='OPEN', max_length=20)),
                ('priority', models.CharField(choices=[('LOW', 'Low'), ('MEDIUM', 'Medium'), ('HIGH', 'High'), ('URGENT', 'Urgent')], default='MEDIUM', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('resolved_at', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'support_tickets',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='TicketComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.TextField()),
                ('is_staff_response', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'ticket_comments',
                'ordering': ['created_at'],
            },
        ),
    ]
