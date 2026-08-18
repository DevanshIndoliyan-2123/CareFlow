from pydantic import BaseModel, Field


class ValidationIssue(BaseModel):

    field: str

    message: str

    severity: str


class ValidationResult(BaseModel):

    documentId: str

    userId: str | None = None

    valid: bool

    requiresManualReview: bool = False

    confidence: float | None = None

    issues: list[ValidationIssue] = []