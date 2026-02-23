import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('developers', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='apikey',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='api_keys', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='apiusagelog',
            name='api_key',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='usage_logs', to='developers.apikey'),
        ),
        migrations.AddField(
            model_name='webhook',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='webhooks', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddIndex(
            model_name='apiusagelog',
            index=models.Index(fields=['api_key', '-created_at'], name='api_usage_l_api_key_5793cc_idx'),
        ),
    ]
