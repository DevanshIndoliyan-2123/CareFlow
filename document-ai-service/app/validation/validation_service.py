from app.validation.models import (
    ValidationResult
)

from app.validation.validators import (
    validate_document_id,
    validate_user_id,
    validate_patient,
    validate_provider,
    validate_diagnosis,
    validate_confidence
)


def validate_extracted_document(
        data: dict
):

    issues = []


    issues.extend(
        validate_document_id(data)
    )

    issues.extend(
        validate_user_id(data)
    )

    issues.extend(
        validate_patient(data)
    )

    issues.extend(
        validate_provider(data)
    )

    issues.extend(
        validate_diagnosis(data)
    )

    issues.extend(
        validate_confidence(data)
    )


    has_error = any(
        issue.severity == "ERROR"
        for issue in issues
    )


    requires_manual_review = any(
        issue.severity == "WARNING"
        for issue in issues
    )


    return ValidationResult(

        documentId=data.get(
            "documentId",
            ""
        ),

        userId=data.get(
            "userId"
        ),

        valid=not has_error,

        requiresManualReview=(
            requires_manual_review
        ),

        confidence=data.get(
            "confidence"
        ),

        issues=issues
    )