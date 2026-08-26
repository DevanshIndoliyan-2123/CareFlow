import requests


class DocumentServiceClient:

    def __init__(
            self,
            base_url: str
    ):

        self.base_url = (
            base_url.rstrip("/")
        )


    def download_document(
            self,
            document_id: str
    ) -> bytes:

        url = (
            f"{self.base_url}"
            f"/api/v1/documents/"
            f"{document_id}/download"
        )


        response = requests.get(
            url,
            timeout=30
        )


        response.raise_for_status()


        return response.content