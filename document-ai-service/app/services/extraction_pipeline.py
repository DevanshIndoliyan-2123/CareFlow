import os
import tempfile

from fastapi import UploadFile

from app.services.pdf_parser import (
    extract_text_from_pdf
)

from app.services.llm_extractor import (
    extract_medical_entities
)


async def process_document(
        document_id: str,
        file: UploadFile
):
    """
    Used by the REST API.

    Receives an uploaded PDF file,
    extracts text, sends it to the LLM,
    and returns the extracted medical information.
    """

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


        # Extract text from PDF

        extracted_text = extract_text_from_pdf(
            temp_path
        )


        if not extracted_text.strip():

            raise ValueError(
                "No text could be extracted from the PDF"
            )


        print(
            "PDF text extraction completed"
        )


        # Extract medical information using LLM

        result = extract_medical_entities(
            extracted_text
        )


        print(
            "AI extraction completed"
        )


        # Add document ID

        result["documentId"] = document_id


        return result


    finally:

        if temp_path and os.path.exists(temp_path):

            os.remove(temp_path)


def process_document_from_path(
        message: dict
):
    """
    Used by the Kafka consumer.

    Expected Kafka event:

    {
        "documentId": "DOC-10001",
        "filePath": "C:/Users/devan/Downloads/MRI_Report.pdf",
        "userId": "USER-001"
    }
    """

    document_id = message.get(
        "documentId"
    )

    file_path = message.get(
        "filePath"
    )

    user_id = message.get(
        "userId"
    )


    # Validate document ID

    if not document_id:

        raise ValueError(
            "documentId missing in Kafka event"
        )


    # Validate file path

    if not file_path:

        raise ValueError(
            "filePath missing in Kafka event"
        )


    # Validate file exists

    if not os.path.isfile(file_path):

        raise FileNotFoundError(
            f"Document not found: {file_path}"
        )


    print(
        f"Processing Kafka document: {document_id}"
    )

    print(
        f"File path: {file_path}"
    )


    # Extract text

    extracted_text = extract_text_from_pdf(
        file_path
    )


    if not extracted_text.strip():

        raise ValueError(
            "No text could be extracted from the PDF"
        )


    print(
        "PDF text extraction completed"
    )


    # LLM extraction

    result = extract_medical_entities(
        extracted_text
    )


    print(
        "AI extraction completed"
    )


    # Add metadata

    result["documentId"] = document_id

    result["userId"] = user_id


    return result