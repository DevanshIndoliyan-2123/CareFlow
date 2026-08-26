from app.services.extraction_pipeline import (
    build_extracted_document
)


event = {

    "eventId": "EVT-001",

    "documentId": "DOC-10001",

    "userId": "USER-001",

    "originalFilename":
        "medical-report.pdf",

    "contentType":
        "application/pdf",

    "fileSize":
        123456,

    "storagePath":
        "documents/DOC-10001.pdf",

    "uploadedAt":
        "2026-08-25T16:30:00Z"
}


llm_result = {

    "patient": {

        "name":
            "DOE, JOHN",

        "dateOfBirth":
            None
    },

    "provider": {

        "name":
            None,

        "npi":
            None
    },

    "doctor": {

        "name":
            "DR. DAVID LIVESEY",

        "npi":
            None
    },

    "visit": {

        "date":
            None,

        "type":
            "RADIOLOGY"
    },

    "diagnosis": [

        {

            "code":
                None,

            "description":
                "Extensive tissue loss involving the right temporal and occipital region"
        }

    ],

    "confidence":
        0.98
}


result = build_extracted_document(
    event,
    llm_result
)


print(
    result
)