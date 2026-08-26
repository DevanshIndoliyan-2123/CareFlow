from app.services.llm_extractor import (
    extract_medical_entities
)


sample_text = """
PATIENT: DOE, JOHN

MRI BRAIN REPORT

PHYSICIAN:
DR. DAVID LIVESEY

RADIOLOGIST:
RADIOLOGIST, ADMIN

FINDINGS:

Extensive tissue loss involving the right
temporal and occipital region with ex vacuo
prominence of the right lateral ventricle.

Subtle focal defects in the periventricular
white matter probably due to superimposed
small vessel ischemic disease.
"""


result = extract_medical_entities(
    sample_text
)


print(result)