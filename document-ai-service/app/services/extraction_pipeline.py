import os
import tempfile

from datetime import datetime, timezone

from fastapi import UploadFile

from app.services.pdf_parser import (
    extract_text_from_pdf
)

from app.services.llm_extractor import (
    extract_medical_entities
)

from app.models.medical_document import (
    ExtractedMedicalDocument
)


async def process_document(
        document_id: str,
        file: UploadFile
):
    """
    Used by the REST API.

    Receives an uploaded PDF file,
    extracts text,
    sends it to the LLM,
    validates the extracted structure,
    and returns the result.

    This endpoint is mainly useful for direct/manual testing.

    The production Kafka flow uses:
        process_document_from_bytes()
    """

    if not document_id:
        raise ValueError(
            "Document ID is required"
        )

    if not file:
        raise ValueError(
            "Document file is required"
        )

    file_content = await file.read()

    if not file_content:
        raise ValueError(
            "Uploaded document is empty"
        )

    temp_path = None

    try:

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp_file:

            temp_file.write(
                file_content
            )

            temp_path = temp_file.name

        print(
            f"Processing uploaded document: {document_id}"
        )

        # -----------------------------------------
        # PDF TEXT EXTRACTION
        # -----------------------------------------

        extracted_text = extract_text_from_pdf(
            temp_path
        )

        if not extracted_text or not extracted_text.strip():

            raise ValueError(
                "No text could be extracted from the PDF"
            )

        print(
            "PDF text extraction completed"
        )

        # -----------------------------------------
        # LLM EXTRACTION
        # -----------------------------------------

        llm_result = extract_medical_entities(
            extracted_text
        )

        print(
            "AI extraction completed"
        )

        # -----------------------------------------
        # BUILD CONTRACT
        # -----------------------------------------

        result = build_extracted_document(
            event={
                "eventId": f"REST-{document_id}",
                "documentId": document_id,
                "userId": "REST-USER"
            },
            llm_result=llm_result
        )

        return result

    finally:

        if (
            temp_path
            and os.path.exists(temp_path)
        ):

            os.remove(temp_path)


def process_document_from_bytes(
        event: dict,
        file_content: bytes
):
    """
    Used by the Kafka consumer.

    The document has already been downloaded
    from the Document Service.

    Expected event:

    {
        "eventId": "EVT-001",
        "documentId": "DOC-10001",
        "userId": "USER-001",
        "originalFilename": "medical-report.pdf",
        "contentType": "application/pdf",
        "fileSize": 123456,
        "storagePath": "documents/DOC-10001.pdf",
        "uploadedAt": "2026-08-25T16:30:00Z"
    }

    Returns the frozen document.extracted event.
    """

    if not isinstance(event, dict):
        raise ValueError(
            "Kafka event must be a dictionary"
        )

    document_id = event.get(
        "documentId"
    )

    user_id = event.get(
        "userId"
    )

    event_id = event.get(
        "eventId"
    )

    # -----------------------------------------
    # VALIDATE EVENT METADATA
    # -----------------------------------------

    if not event_id:

        raise ValueError(
            "eventId missing in Kafka event"
        )

    if not document_id:

        raise ValueError(
            "documentId missing in Kafka event"
        )

    if not user_id:

        raise ValueError(
            "userId missing in Kafka event"
        )

    # -----------------------------------------
    # VALIDATE DOCUMENT
    # -----------------------------------------

    if not file_content:

        raise ValueError(
            "Downloaded document is empty"
        )

    if not isinstance(
        file_content,
        bytes
    ):

        raise ValueError(
            "Downloaded document must be bytes"
        )

    temp_path = None

    try:

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp_file:

            temp_file.write(
                file_content
            )

            temp_path = temp_file.name

        print(
            f"Processing Kafka document: {document_id}"
        )

        print(
            f"Downloaded bytes: {len(file_content)}"
        )

        # -----------------------------------------
        # PDF TEXT EXTRACTION
        # -----------------------------------------

        extracted_text = extract_text_from_pdf(
            temp_path
        )

        if not extracted_text or not extracted_text.strip():

            raise ValueError(
                "No text could be extracted from the PDF"
            )

        print(
            "PDF text extraction completed"
        )

        # -----------------------------------------
        # LLM EXTRACTION
        # -----------------------------------------

        llm_result = extract_medical_entities(
            extracted_text
        )

        print(
            "AI extraction completed"
        )

        # -----------------------------------------
        # BUILD FROZEN KAFKA CONTRACT
        # -----------------------------------------

        result = build_extracted_document(
            event=event,
            llm_result=llm_result
        )

        print(
            "document.extracted contract validated"
        )

        return result

    finally:

        if (
            temp_path
            and os.path.exists(temp_path)
        ):

            os.remove(temp_path)


def build_extracted_document(
        event: dict,
        llm_result: dict
):
    """
    Converts raw LLM output into the frozen
    document.extracted Kafka contract.

    Frozen contract:

    {
        "eventId": "...",
        "documentId": "...",
        "userId": "...",
        "extractionStatus": "COMPLETED",
        "patient": {},
        "provider": {},
        "doctor": {},
        "visit": {},
        "diagnosis": [],
        "confidence": 0.95,
        "extractedAt": "..."
    }
    """

    if not isinstance(
        event,
        dict
    ):

        raise ValueError(
            "Event must be a dictionary"
        )

    if not isinstance(
        llm_result,
        dict
    ):

        raise ValueError(
            "LLM result must be a dictionary"
        )

    # -----------------------------------------
    # REQUIRED EVENT FIELDS
    # -----------------------------------------

    event_id = event.get(
        "eventId"
    )

    document_id = event.get(
        "documentId"
    )

    user_id = event.get(
        "userId"
    )

    if not event_id:

        raise ValueError(
            "eventId missing"
        )

    if not document_id:

        raise ValueError(
            "documentId missing"
        )

    if not user_id:

        raise ValueError(
            "userId missing"
        )

    # -----------------------------------------
    # BUILD EXTRACTION EVENT
    # -----------------------------------------

    result = {

        "eventId": event_id,

        "documentId": document_id,

        "userId": user_id,

        "extractionStatus": "COMPLETED",

        "patient": llm_result.get(
            "patient",
            {}
        ),

        "provider": llm_result.get(
            "provider",
            {}
        ),

        "doctor": llm_result.get(
            "doctor",
            {}
        ),

        "visit": llm_result.get(
            "visit",
            {}
        ),

        "diagnosis": llm_result.get(
            "diagnosis",
            []
        ),

        "confidence": llm_result.get(
            "confidence",
            0.0
        ),

        "extractedAt": (
            datetime.now(
                timezone.utc
            ).isoformat()
        )
    }

    # -----------------------------------------
    # PYDANTIC CONTRACT VALIDATION
    # -----------------------------------------

    validated = ExtractedMedicalDocument(
        **result
    )

    return validated.model_dump()