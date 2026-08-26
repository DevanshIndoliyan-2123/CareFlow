from pydantic import BaseModel, Field


class Patient(BaseModel):
    name: str | None = None
    dateOfBirth: str | None = None


class Provider(BaseModel):
    name: str | None = None
    npi: str | None = None


class Doctor(BaseModel):
    name: str | None = None
    npi: str | None = None


class Visit(BaseModel):
    date: str | None = None
    type: str | None = None


class Diagnosis(BaseModel):
    code: str | None = None
    description: str


class ExtractedMedicalDocument(BaseModel):

    eventId: str

    documentId: str

    userId: str

    extractionStatus: str

    patient: Patient

    provider: Provider

    doctor: Doctor

    visit: Visit

    diagnosis: list[Diagnosis]

    confidence: float = Field(
        ge=0,
        le=1
    )

    extractedAt: str