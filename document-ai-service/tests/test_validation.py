from app.validation.validation_service import (
    validate_extracted_document
)


document = {

    "documentId": "DOC-10001",

    "userId": "USER-001",

    "patient": {
        "name": "DOE, JOHN"
    },

    "provider": {
        "name": ""
    },

    "doctor": "RADIOLOGIST, ADMIN",

    "diagnosis": [

        {
            "name":
            "Extensive tissue loss right temporal/occipital region",

            "code": ""
        }

    ],

    "confidence": 0.65
}


result = validate_extracted_document(
    document
)


print(
    result.model_dump_json(
        indent=4
    )
)