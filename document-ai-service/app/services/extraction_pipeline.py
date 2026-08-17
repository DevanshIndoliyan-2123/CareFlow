import tempfile
import os


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
    Used by REST API upload.
    Receives uploaded PDF file.
    """


    file_content = await file.read()



    with tempfile.NamedTemporaryFile(

            delete=False,

            suffix=".pdf"

    ) as temp_file:


        temp_file.write(
            file_content
        )


        temp_path = temp_file.name



    try:

        extracted_text = extract_text_from_pdf(

            temp_path

        )


        result = extract_medical_entities(

            extracted_text

        )


        result["documentId"] = document_id


        return result



    finally:

        if os.path.exists(temp_path):

            os.remove(temp_path)





def process_document_from_path(
        message: dict
):
    """
    Used by Kafka consumer.

    Receives:

    {
        documentId:
        filePath:
        userId:
    }

    """



    document_id = message.get(
        "documentId"
    )


    file_path = message.get(
        "filePath"
    )



    if not file_path:

        raise Exception(
            "File path missing in Kafka event"
        )



    extracted_text = extract_text_from_pdf(

        file_path

    )



    result = extract_medical_entities(

        extracted_text

    )



    result["documentId"] = document_id



    return result