from fastapi import APIRouter
from fastapi import UploadFile, File
from fastapi import HTTPException

from uuid import uuid4


from app.services.extraction_pipeline import process_document



router = APIRouter()



@router.post("/documents/extract")
async def extract_document(

        file: UploadFile = File(...)

):


    if file.content_type != "application/pdf":

        raise HTTPException(

            status_code=400,

            detail="Only PDF files are supported"

        )



    document_id = (
        f"DOC-{uuid4().hex[:10]}"
    )



    result = await process_document(

        document_id,

        file

    )



    return result