import json

from confluent_kafka import Consumer

from app.kafka.config import (
    KAFKA_BOOTSTRAP_SERVER,
    DOCUMENT_UPLOADED_TOPIC
)

from app.services.extraction_pipeline import (
    process_document_from_bytes
)

from app.kafka.producer import (
    publish_extracted_document
)


consumer = Consumer({

    "bootstrap.servers":
        KAFKA_BOOTSTRAP_SERVER,

    "group.id":
        "ai-document-extractor",

    "auto.offset.reset":
        "earliest",

    "enable.auto.commit":
        False
})


def validate_upload_event(
        data: dict
):
    """
    Validates the frozen document.uploaded
    Kafka contract.
    """

    required_fields = [

        "eventId",

        "documentId",

        "userId",

        "originalFilename",

        "contentType",

        "fileSize",

        "storagePath",

        "uploadedAt"

    ]


    for field in required_fields:

        if field not in data:

            raise ValueError(
                f"{field} missing in "
                "document.uploaded event"
            )


    if not data["eventId"]:

        raise ValueError(
            "eventId cannot be empty"
        )


    if not data["documentId"]:

        raise ValueError(
            "documentId cannot be empty"
        )


    if not data["userId"]:

        raise ValueError(
            "userId cannot be empty"
        )


    if not data["storagePath"]:

        raise ValueError(
            "storagePath cannot be empty"
        )



def download_document(
        data: dict
) -> bytes:
    """
    Temporary placeholder.

    This will call Member 2's Document Service
    once the exact download endpoint is confirmed.

    DO NOT use the old filePath approach here.
    """

    raise NotImplementedError(

        "Document download integration is pending. "
        "Ask Member 2 for the exact download endpoint."

    )



def start_consumer():

    consumer.subscribe(
        [
            DOCUMENT_UPLOADED_TOPIC
        ]
    )


    print(
        "Kafka consumer started"
    )


    print(
        f"Listening to topic: "
        f"{DOCUMENT_UPLOADED_TOPIC}"
    )


    try:

        while True:

            message = consumer.poll(
                1.0
            )


            if message is None:

                continue


            if message.error():

                print(
                    "Kafka error:",
                    message.error()
                )

                continue


            try:

                # -----------------------------------------
                # DECODE MESSAGE
                # -----------------------------------------

                raw_message = (
                    message
                    .value()
                    .decode("utf-8")
                )


                print()
                print(
                    "========== RAW KAFKA MESSAGE =========="
                )

                print(
                    raw_message
                )


                # -----------------------------------------
                # JSON PARSING
                # -----------------------------------------

                data = json.loads(
                    raw_message
                )


                print(
                    "======================================="
                )


                print(
                    "Received document.uploaded:"
                )

                print(
                    json.dumps(
                        data,
                        indent=4
                    )
                )


                # -----------------------------------------
                # CONTRACT VALIDATION
                # -----------------------------------------

                validate_upload_event(
                    data
                )


                print(
                    "document.uploaded "
                    "contract validation passed"
                )


                # -----------------------------------------
                # DOWNLOAD DOCUMENT
                # -----------------------------------------

                file_content = (
                    download_document(
                        data
                    )
                )


                # -----------------------------------------
                # AI PROCESSING
                # -----------------------------------------

                result = (
                    process_document_from_bytes(

                        event=data,

                        file_content=file_content

                    )
                )


                print(
                    "Extraction result:"
                )


                print(
                    json.dumps(
                        result,
                        indent=4
                    )
                )


                # -----------------------------------------
                # PUBLISH document.extracted
                # -----------------------------------------

                publish_extracted_document(
                    result
                )


                # -----------------------------------------
                # COMMIT AFTER SUCCESS
                # -----------------------------------------

                consumer.commit(
                    message=message
                )


                print(
                    "Kafka offset committed"
                )


            except json.JSONDecodeError as error:

                print(
                    "Invalid JSON received:",
                    error
                )


                # Malformed event cannot be retried
                # successfully.

                consumer.commit(
                    message=message
                )


            except NotImplementedError as error:

                print(
                    "Integration pending:"
                )

                print(
                    error
                )

                # Don't commit this message.
                #
                # We want to process it once
                # document download integration
                # is implemented.

                continue


            except Exception as error:

                print(
                    "Document processing failed:"
                )

                print(
                    error
                )


                print(
                    "Kafka message was NOT committed."
                )


    finally:

        consumer.close()


        print(
            "Kafka consumer closed"
        )