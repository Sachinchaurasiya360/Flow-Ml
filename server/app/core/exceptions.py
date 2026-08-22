"""
Custom exception classes for the Flow ML application.
Provides detailed error messages for students to debug issues.
"""

from typing import Any, Optional, Dict
from fastapi import HTTPException, status


class BaseMLException(Exception):
    """Base exception for all ML-related errors."""

    def __init__(
        self,
        message: str,
        details: Optional[Dict[str, Any]] = None,
        suggestion: Optional[str] = None,
    ):
        self.message = message
        self.details = details or {}
        self.suggestion = suggestion
        super().__init__(self.message)

    def to_dict(self) -> Dict[str, Any]:
        """Convert exception to dictionary for JSON response."""
        response = {
            "error": self.__class__.__name__,
            "message": self.message,
            "details": self.details,
        }
        if self.suggestion:
            response["suggestion"] = self.suggestion
        return response


class ValidationError(BaseMLException):
    """Raised when input validation fails."""

    def __init__(self, field: str, message: str, received_value: Any = None):
        details = {
            "field": field,
            "received_value": str(received_value) if received_value is not None else None,
        }
        suggestion = f"Please check the '{field}' field and ensure it meets the requirements."
        super().__init__(message=message, details=details, suggestion=suggestion)


class DatasetError(BaseMLException):
    """Raised when dataset-related errors occur."""

    pass


class DatasetNotFoundError(DatasetError):
    """Raised when a dataset cannot be found."""

    def __init__(self, dataset_id: str):
        super().__init__(
            message=f"Dataset with ID '{dataset_id}' not found.",
            details={"dataset_id": dataset_id},
            suggestion="Verify the dataset ID exists or upload a new dataset.",
        )


class InvalidDatasetError(DatasetError):
    """Raised when dataset format is invalid."""

    def __init__(self, reason: str, expected_format: Optional[str] = None):
        details = {"reason": reason}
        if expected_format:
            details["expected_format"] = expected_format
        super().__init__(
            message=f"Invalid dataset: {reason}",
            details=details,
            suggestion="Ensure your dataset is properly formatted (CSV with headers).",
        )


class ModelError(BaseMLException):
    """Raised when model-related errors occur."""

    pass


class ModelNotFoundError(ModelError):
    """Raised when a model cannot be found."""

    def __init__(self, model_id: str):
        super().__init__(
            message=f"Model with ID '{model_id}' not found.",
            details={"model_id": model_id},
            suggestion="Train a model first or verify the model ID is correct.",
        )


class ModelTrainingError(ModelError):
    """Raised when model training fails."""

    def __init__(self, algorithm: str, reason: str, traceback: Optional[str] = None):
        details = {
            "algorithm": algorithm,
            "reason": reason,
        }
        if traceback:
            details["traceback"] = traceback

        super().__init__(
            message=f"Model training failed for {algorithm}: {reason}",
            details=details,
            suggestion="Check your data format, ensure target column exists, and verify no NaN values remain.",
        )


class PredictionError(ModelError):
    """Raised when prediction fails."""

    def __init__(self, reason: str, expected_features: Optional[list] = None):
        details = {"reason": reason}
        if expected_features:
            details["expected features"] = expected_features

        super().__init__(
            message=f"Prediction failed: {reason}",
            details=details,
            suggestion="Ensure input features match the model's training features.",
        )


class NodeExecutionError(BaseMLException):
    """Raised when a pipeline node fails to execute."""

    def __init__(self, node_type: str, reason: str, input_data: Optional[Dict] = None):
        details = {
            "node_type": node_type,
            "reason": reason,
        }
        if input_data:
            details["input_summary"] = {k: type(v).__name__ for k, v in input_data.items()}

        super().__init__(
            message=f"Node execution failed [{node_type}]: {reason}",
            details=details,
            suggestion=f"Review the {node_type} node configuration and input data.",
        )


class FileUploadError(BaseMLException):
    """Raised when file upload fails."""

    def __init__(
        self, reason: str, filename: Optional[str] = None, max_size_mb: Optional[int] = None
    ):
        details = {"reason": reason}
        if filename:
            details["filename"] = filename
        if max_size_mb:
            details["max_allowed_size_mb"] = max_size_mb

        super().__init__(
            message=f"File upload failed: {reason}",
            details=details,
            suggestion="Ensure file is CSV format and under size limit.",
        )


class InsufficientDataError(DatasetError):
    """Raised when dataset has insufficient data for training."""

    def __init__(self, rows: int, min_required: int = 10):
        super().__init__(
            message=f"Insufficient data: {rows} rows (minimum {min_required} required).",
            details={"rows": rows, "min_required": min_required},
            suggestion=f"Provide a dataset with at least {min_required} rows.",
        )


class FeatureMismatchError(PredictionError):
    """Raised when prediction features don't match training features."""

    def __init__(self, expected: list, received: list):
        missing = set(expected) - set(received)
        extra = set(received) - set(expected)

        super().__init__(
            reason="Feature mismatch between training and prediction data.",
            expected_features=expected,
        )
        self.details["received_features"] = received
        self.details["missing_features"] = list(missing)
        self.details["extra_features"] = list(extra)
        self.suggestion = f"Ensure prediction data has columns: {', '.join(expected)}"


class UnauthorizedError(HTTPException):
    """Raised when user is not authorized."""

    def __init__(self, detail: str = "Not authorized to perform this action"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
        )


class RateLimitExceeded(HTTPException):
    """Raised when rate limit is exceeded."""

    def __init__(self, retry_after: int = 60):
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please try again later.",
            headers={"Retry-After": str(retry_after)},
        )
