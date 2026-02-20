import os

from django.core.asgi import get_asgi_application

from .celery import app as celery_app

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_asgi_application()

__all__ = ('celery_app', 'application')
