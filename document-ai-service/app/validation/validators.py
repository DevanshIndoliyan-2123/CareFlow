from app.validation.models import (
    ValidationIssue
)


def validate_document_id(
        data: dict
):

    issues = []

    document_id = data.get(
        "documentId"
    )

    if not document_id:

        issues.append(
            ValidationIssue(
                field="documentId",
                message="Document ID is missing",
                severity="ERROR"
            )
        )

    return issues


def validate_user_id(
        data: dict
):

    issues = []

    user_id = data.get(
        "userId"
    )

    if not user_id:

        issues.append(
            ValidationIssue(
                field="userId",
                message="User ID is missing",
                severity="ERROR"
            )
        )

    return issues


def validate_patient(
        data: dict
):

    issues = []

    patient = data.get(
        "patient"
    )

    if not patient:

        issues.append(
            ValidationIssue(
                field="patient",
                message="Patient information is missing",
                severity="ERROR"
            )
        )

        return issues


    if not patient.get("name"):

        issues.append(
            ValidationIssue(
                field="patient.name",
                message="Patient name is missing",
                severity="ERROR"
            )
        )

    return issues


def validate_provider(
        data: dict
):

    issues = []

    provider = data.get(
        "provider"
    )

    if not provider:

        issues.append(
            ValidationIssue(
                field="provider",
                message="Provider information is missing",
                severity="ERROR"
            )
        )

        return issues


    if not provider.get("name"):

        issues.append(
            ValidationIssue(
                field="provider.name",
                message="Provider name is missing",
                severity="ERROR"
            )
        )

    return issues


def validate_diagnosis(
        data: dict
):

    issues = []

    diagnosis = data.get(
        "diagnosis"
    )


    if diagnosis is None:

        issues.append(
            ValidationIssue(
                field="diagnosis",
                message="Diagnosis field is missing",
                severity="ERROR"
            )
        )

        return issues


    if not isinstance(
        diagnosis,
        list
    ):

        issues.append(
            ValidationIssue(
                field="diagnosis",
                message="Diagnosis must be a list",
                severity="ERROR"
            )
        )

        return issues


    if len(diagnosis) == 0:

        issues.append(
            ValidationIssue(
                field="diagnosis",
                message="No diagnosis or clinical findings extracted",
                severity="WARNING"
            )
        )


    for index, item in enumerate(
        diagnosis
    ):

        if not isinstance(
            item,
            dict
        ):

            issues.append(
                ValidationIssue(
                    field=f"diagnosis[{index}]",
                    message="Diagnosis item must be an object",
                    severity="ERROR"
                )
            )

            continue


        if not item.get("name"):

            issues.append(
                ValidationIssue(
                    field=f"diagnosis[{index}].name",
                    message="Diagnosis name is missing",
                    severity="ERROR"
                )
            )


    return issues


def validate_confidence(
        data: dict
):

    issues = []

    confidence = data.get(
        "confidence"
    )


    if confidence is None:

        issues.append(
            ValidationIssue(
                field="confidence",
                message="AI confidence is missing",
                severity="WARNING"
            )
        )

        return issues


    if not isinstance(
        confidence,
        (int, float)
    ):

        issues.append(
            ValidationIssue(
                field="confidence",
                message="Confidence must be numeric",
                severity="ERROR"
            )
        )

        return issues


    if confidence < 0 or confidence > 1:

        issues.append(
            ValidationIssue(
                field="confidence",
                message="Confidence must be between 0 and 1",
                severity="ERROR"
            )
        )

    elif confidence < 0.80:

        issues.append(
            ValidationIssue(
                field="confidence",
                message="AI confidence is below the review threshold",
                severity="WARNING"
            )
        )


    return issues