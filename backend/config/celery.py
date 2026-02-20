import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('restaurant_platform')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'auto-cancel-unpaid-orders': {
        'task': 'orders.tasks.auto_cancel_unpaid_orders',
        'schedule': crontab(minute='*/15'),
    },
    'mark-no-show-reservations': {
        'task': 'reservations.tasks.mark_no_show_reservations',
        'schedule': crontab(minute='0', hour='*'),
    },
    'check-low-stock': {
        'task': 'inventory.tasks.check_low_stock_alerts',
        'schedule': crontab(minute='0', hour='9'),
    },
    'generate-daily-reports': {
        'task': 'analytics.tasks.generate_daily_reports',
        'schedule': crontab(minute='30', hour='0'),
    },
}

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')