from app.models.medical_document import (
    ExtractedMedicalDocument
)


def test_extracted_document_contract():

    data = {

        "eventId": "EVT-001",

        "documentId": "DOC-10001",

        "userId": "USER-001",

        "extractionStatus": "COMPLETED",

        "patient": {
            "name": "DOE, JOHN",
            "dateOfBirth": None
        },

        "provider": {
            "name": "ABC MEDICAL CENTER",
            "npi": None
        },

        "doctor": {
            "name": "DR. DAVID LIVESEY",
            "npi": None
        },

        "visit": {
            "date": None,
            "type": None
        },

        "diagnosis": [

            {
                "code": None,
                "description":
                    "Extensive tissue loss right temporal region"
            }

        ],

        "confidence": 0.95,

        "extractedAt":
            "2026-08-25T16:31:30Z"
    }


    result = ExtractedMedicalDocument(
        **data
    )


    assert result.documentId == "DOC-10001"

    assert result.userId == "USER-001"

    assert result.extractionStatus == "COMPLETED"

    assert result.confidence == 0.95

    assert len(result.diagnosis) == 1