"""
Core configuration settings for the Visual ML application.
Handles environment variables, database settings, and ML-specific configurations.
"""

from functools import lru_cache
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "Visual ML"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"  # development, staging, production

    # API
    API_V1_PREFIX: str = "/api/v1"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173", "http://34.100.238.183:3003"]

    # Database
    DATABASE_URL: str = (
        "postgresql://neondb_owner:npg_DeO2kXBCWqL6@ep-raspy-art-ahj7menw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    )

    # Default SQLite
    DB_ECHO: bool = False

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # 30 minutes for production
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7  # 7 days for refresh tokens
    COOKIE_DOMAIN: Optional[str] = None  # e.g., ".flowml.xyz" for cross-subdomain cookies

    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: Optional[str] = (
        "http://34.100.238.183:3003/api/v1/auth/student/google/callback"
    )

    # Rate Limiting (for 50k traffic)
    RATE_LIMIT_PER_MINUTE: int = 100
    RATE_LIMIT_PER_HOUR: int = 1000

    # File Upload
    MAX_UPLOAD_SIZE_MB: int = 100
    ALLOWED_EXTENSIONS: set[str] = {".csv", ".txt", ".json"}
    UPLOAD_DIR: str = "./uploads"

    # ML Models
    MODEL_ARTIFACTS_DIR: str = "./models"
    MAX_MODEL_VERSIONS: int = 10
    DEFAULT_TRAIN_TEST_SPLIT: float = 0.2
    DEFAULT_RANDOM_SEED: int = 42

    # Redis Cache (for production scalability)
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    CACHE_TTL: int = 900  # 15 minutes (optimized from 1 hour)
    ENABLE_CACHE: bool = True  # ✅ ENABLED for production

    # Database Connection Pool (for production scalability)
    DB_POOL_SIZE: int = 20  # Max persistent connections
    DB_MAX_OVERFLOW: int = 10  # Allow 10 extra connections
    DB_POOL_TIMEOUT: int = 30  # Wait 30s for connection
    DB_POOL_RECYCLE: int = 3600  # Recycle connections after 1 hour

    # S3/Storage (for production)
    USE_S3: bool = True  # Set to True to enable S3 storage
    S3_BUCKET: Optional[str] = None  # e.g., "flow-ml-datasets"
    S3_REGION: Optional[str] = "us-east-1"  # AWS region
    AWS_ACCESS_KEY_ID: Optional[str] = None  # AWS access key from env
    AWS_SECRET_ACCESS_KEY: Optional[str] = None  # AWS secret key from env
    S3_PRESIGNED_URL_EXPIRY: int = 3600  # Presigned URL expiry in seconds (1 hour)
    S3_USE_DATE_PARTITION: bool = True  # Use date-based folder structure in S3

    # Background Workers (Celery)
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    ENABLE_BACKGROUND_TASKS: bool = False

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"  # json or text

    # ML Performance
    MODEL_CACHE_SIZE: int = 10  # Number of models to keep in memory
    LAZY_LOAD_MODELS: bool = True
    ENABLE_MODEL_WARMUP: bool = False

    # Storage Cleanup
    CLEANUP_ENABLED: bool = True  # Toggle periodic cleanup on/off
    CLEANUP_INTERVAL_HOURS: int = 12  # How often to run cleanup
    UPLOAD_MAX_AGE_HOURS: int = 24  # Delete uploads older than this
    MODEL_MAX_AGE_HOURS: int = 72  # Delete model files older than this

    # Inworld TTS (AI Mentor)
    INWORLD_API_KEY: Optional[str] = None
    INWORLD_WORKSPACE_ID: Optional[str] = None
    INWORLD_CHARACTER_ID: Optional[str] = None

    # Auth Settings
    PASSWORD_MIN_LENGTH: int = 8
    RESET_TOKEN_EXPIRE_MINUTES: int = 30

    # Frontend URL (for OAuth redirects)
    FRONTEND_URL: str = "http://localhost:5173"

    # Admin Credentials
    ADMIN_EMAIL: str = "admin@flowml.com"
    ADMIN_PASSWORD: str = "change-this-password"

    # Brevo Email Service
    BREVO_API_KEY: Optional[str] = ""
    BREVO_SENDER_EMAIL: str = ""
    BREVO_SENDER_NAME: str = "Visual ML"

    # Redis URL for Celery
    REDIS_URL: str = "redis://localhost:6379/0"

    # GenAI (DynaRoute is the only supported provider)
    DYNAROUTE_API_KEY: Optional[str] = None
    HUGGINGFACE_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True
    )


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Uses lru_cache to ensure settings are loaded once.
    """
    return Settings()


# Global settings instance
settings = get_settings()
