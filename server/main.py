"""
FastAPI application entry point for Flow ML.
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import BaseMLException
from app.api.v1 import (
    pipelines,
    genai_pipelines,
    secrets,
    projects,
    datasets,
    auth_student,
    genai,
    tasks,
    sharing,
    custom_apps,
    gamification,
)
from app.mentor import router as mentor_router
from app.utils.cleanup import start_cleanup_loop
from app.db.session import init_db
from pathlib import Path
import asyncio


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown logic.
    """
    # Startup
    logger.info(f"Environment: {settings.ENVIRONMENT}")

    # Ensure all DB tables exist (idempotent — creates only missing tables)
    init_db()
    logger.info("Database tables initialized")

    # Create necessary directories
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    Path(settings.MODEL_ARTIFACTS_DIR).mkdir(parents=True, exist_ok=True)

    # Start periodic storage cleanup in the background
    cleanup_task = None
    if settings.CLEANUP_ENABLED:
        cleanup_task = asyncio.create_task(start_cleanup_loop())
        logger.info("Storage cleanup scheduler started")

    logger.info("Application startup complete")

    yield

    # Shutdown
    if cleanup_task is not None:
        cleanup_task.cancel()
        try:
            await cleanup_task
        except asyncio.CancelledError:
            pass
    logger.info("Shutting down application")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-ready ML platform for Linear & Logistic Regression",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,  
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],  
)

# GZIP compression middleware - compress responses > 1KB
app.add_middleware(GZipMiddleware, minimum_size=1000)


# Exception handlers


@app.exception_handler(BaseMLException)
async def ml_exception_handler(request: Request, exc: BaseMLException):
    """Handle ML-specific exceptions with detailed error messages."""
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content=exc.to_dict())


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors with student-friendly messages."""
    errors = []
    for error in exc.errors():
        errors.append(
            {
                "field": ".".join(str(loc) for loc in error["loc"]),
                "message": error["msg"],
                "type": error["type"],
            }
        )

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "ValidationError",
            "message": "Input validation failed",
            "details": errors,
            "suggestion": "Check the API documentation for correct request format.",
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    logger.opt(exception=True).error("Unexpected error: {}", repr(exc))

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "message": "An unexpected error occurred",
            "details": {"error": str(exc)} if settings.DEBUG else {},
            "suggestion": "Please email us at support@flowml.com.",
        },
    )


# Routes
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
    }


# Include routers
app.include_router(auth_student.router, prefix=settings.API_V1_PREFIX)
app.include_router(pipelines.router, prefix=settings.API_V1_PREFIX)
app.include_router(datasets.router, prefix=settings.API_V1_PREFIX)
app.include_router(tasks.router, prefix=settings.API_V1_PREFIX)  

# AI Mentor routes
app.include_router(mentor_router.router, prefix=settings.API_V1_PREFIX)

# GenAI routes
app.include_router(
    genai_pipelines.router, prefix=settings.API_V1_PREFIX + "/genai", tags=["GenAI Pipelines"]
)
 
app.include_router(secrets.router, prefix=settings.API_V1_PREFIX + "/genai", tags=["API Secrets"])
app.include_router(genai.router, prefix=settings.API_V1_PREFIX)
app.include_router(projects.router, prefix=settings.API_V1_PREFIX)
app.include_router(
    sharing.router, prefix=settings.API_V1_PREFIX + "/projects", tags=["Project Sharing"]
)
app.include_router(
    custom_apps.router, prefix=settings.API_V1_PREFIX + "/custom-apps", tags=["Custom Apps"]
)
app.include_router(gamification.router, prefix=settings.API_V1_PREFIX)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=3003,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
