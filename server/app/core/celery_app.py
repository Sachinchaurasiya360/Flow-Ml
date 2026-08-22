"""
Celery configuration for background tasks.
"""

from celery import Celery
from app.core.config import settings

# Create Celery app
celery_app = Celery("flow_ml", broker=settings.REDIS_URL, backend=settings.REDIS_URL)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=60 * 60,  # 60 minutes (increased for long training jobs)
    task_soft_time_limit=55 * 60,  # 55 minutes soft limit (graceful shutdown)
    worker_prefetch_multiplier=1,
    result_expires=3600,  # Results expire after 1 hour
)

# Auto-discover tasks
celery_app.autodiscover_tasks(["app.tasks"])
