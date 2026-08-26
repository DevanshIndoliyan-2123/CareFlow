import json


from langchain_groq import ChatGroq


from app.core.config import settings


from app.models.medical_document import (
    Patient,
    Provider,
    Doctor,
    Visit,
    Diagnosis
)


llm = ChatGroq(

    groq_api_key=settings.GROQ_API_KEY,

    model_name="openai/gpt-oss-120b",

    temperature=0

)


EXTRACTION_PROMPT = """
You are a medical document information extraction system.

Your job is to extract structured information from the
provided medical document.

IMPORTANT RULES:

1. Extract ONLY information explicitly present in the document.
2. NEVER invent or hallucinate information.
3. If information is not present, return null.
4. Do not infer an NPI.
5. Do not infer a diagnosis code.
6. Do not infer dates.
7. Do not infer patient information.
8. Preserve the meaning of medical findings.
9. Return ONLY valid JSON.
10. Do not include markdown.
11. Do not include ```json.
12. Do not include explanations outside the JSON.

Return EXACTLY this structure:

{
  "patient": {
    "name": null,
    "dateOfBirth": null
  },

  "provider": {
    "name": null,
    "npi": null
  },

  "doctor": {
    "name": null,
    "npi": null
  },

  "visit": {
    "date": null,
    "type": null
  },

  "diagnosis": [
    {
      "code": null,
      "description": ""
    }
  ],

  "confidence": 0.0
}


FIELD RULES:

PATIENT

patient.name:
The patient's full name exactly as present in the document.

patient.dateOfBirth:
Extract only if the patient's date of birth is explicitly
present in the document.

If it is not present, return null.


PROVIDER

provider.name:
The hospital, medical center, clinic, healthcare organization,
or provider organization explicitly associated with the document.

provider.npi:
Extract only if an NPI is explicitly present in the document.

NEVER generate or infer an NPI.

If not present, return null.


DOCTOR

doctor.name:
The physician, doctor, radiologist, surgeon, or other clinician
explicitly identified in the document.

doctor.npi:
Extract only if explicitly present.

NEVER generate or infer an NPI.

If not present, return null.


VISIT

visit.date:
Extract the relevant visit, encounter, report, procedure,
or service date if explicitly present.

If there is no relevant date, return null.

visit.type:
Only extract a visit type if supported by the document.

Possible examples include:

OUTPATIENT
INPATIENT
EMERGENCY
RADIOLOGY
FOLLOW_UP

Do not infer a visit type.


DIAGNOSIS

diagnosis:
Extract diagnoses, findings, impressions, or other clinically
relevant medical findings explicitly present in the document.

Each diagnosis must have:

code:
An ICD-10-CM or other medical code only if explicitly present.

If no code is present, return null.

description:
The corresponding diagnosis or clinical finding.

Do not invent diagnoses.

Do not convert a finding into a diagnosis unless the document
explicitly presents it as a diagnosis or clinical finding.


CONFIDENCE

confidence:
A number between 0 and 1 representing confidence in the
overall extraction quality.

Do not use percentages.

For example:

0.95

not:

95


DOCUMENT:

{document_text}
"""


def _clean_json_response(
        content: str
) -> str:
    """
    Removes accidental markdown code fences from
    the LLM response.

    Example:

    ```json
    {...}
    ```

    becomes:

    {...}
    """

    content = content.strip()


    if content.startswith(
        "```json"
    ):

        content = content[
            len("```json"):
        ]


    elif content.startswith(
        "```"
    ):

        content = content[
            len("```"):
        ]


    if content.endswith(
        "```"
    ):

        content = content[
            :-len("```")
        ]


    return content.strip()


def _normalize_result(
        result: dict
) -> dict:
    """
    Ensures that the LLM response has the expected
    nested object structure before it reaches the
    Pydantic/Kafka contract.
    """

    patient = result.get(
        "patient"
    )

    if not isinstance(
        patient,
        dict
    ):

        patient = {}


    provider = result.get(
        "provider"
    )

    if not isinstance(
        provider,
        dict
    ):

        provider = {}


    doctor = result.get(
        "doctor"
    )

    if not isinstance(
        doctor,
        dict
    ):

        doctor = {}


    visit = result.get(
        "visit"
    )

    if not isinstance(
        visit,
        dict
    ):

        visit = {}


    diagnosis = result.get(
        "diagnosis"
    )

    if not isinstance(
        diagnosis,
        list
    ):

        diagnosis = []


    normalized_diagnosis = []


    for item in diagnosis:

        if not isinstance(
            item,
            dict
        ):

            continue


        normalized_diagnosis.append({

            "code": item.get(
                "code"
            ),

            "description": item.get(
                "description",
                ""
            )

        })


    return {

        "patient": {

            "name": patient.get(
                "name"
            ),

            "dateOfBirth": patient.get(
                "dateOfBirth"
            )

        },


        "provider": {

            "name": provider.get(
                "name"
            ),

            "npi": provider.get(
                "npi"
            )

        },


        "doctor": {

            "name": doctor.get(
                "name"
            ),

            "npi": doctor.get(
                "npi"
            )

        },


        "visit": {

            "date": visit.get(
                "date"
            ),

            "type": visit.get(
                "type"
            )

        },


        "diagnosis":
            normalized_diagnosis,


        "confidence":
            result.get(
                "confidence",
                0.0
            )

    }


def extract_medical_entities(
        text: str
):
    """
    Extracts structured medical information
    from document text using GPT-OSS-120B
    through Groq.
    """

    if not text or not text.strip():

        raise ValueError(
            "Document text is empty"
        )


    prompt = EXTRACTION_PROMPT.replace(
        "{document_text}",
        text
    )


    try:

        response = llm.invoke(
            prompt
        )

    except Exception as error:

        raise RuntimeError(
            f"LLM extraction failed: {error}"
        ) from error


    content = response.content


    if not content:

        raise ValueError(
            "LLM returned an empty response"
        )


    content = _clean_json_response(
        content
    )


    try:

        result = json.loads(
            content
        )

    except json.JSONDecodeError as error:

        print(
            "Invalid JSON returned by LLM:"
        )

        print(
            content
        )

        raise ValueError(
            "LLM returned invalid JSON"
        ) from error


    if not isinstance(
        result,
        dict
    ):

        raise ValueError(
            "LLM response must be a JSON object"
        )


    result = _normalize_result(
        result
    )


    confidence = result.get(
        "confidence"
    )


    if not isinstance(
        confidence,
        (int, float)
    ):

        result["confidence"] = 0.0

    else:

        result["confidence"] = max(
            0.0,
            min(
                1.0,
                float(confidence)
            )
        )


    return result