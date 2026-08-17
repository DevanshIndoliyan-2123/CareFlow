from pydantic import BaseModel



class Diagnosis(BaseModel):

    name:str

    code:str | None



class Provider(BaseModel):

    name:str



class Patient(BaseModel):

    name:str



class MedicalDocument(BaseModel):

    documentId:str

    patient:Patient

    provider:Provider

    diagnosis:list[Diagnosis]

    doctor:str | None

    confidence:float