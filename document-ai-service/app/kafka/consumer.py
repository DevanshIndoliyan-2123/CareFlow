import json

from confluent_kafka import Consumer

from app.kafka.config import (
    KAFKA_BOOTSTRAP_SERVER,
    DOCUMENT_UPLOADED_TOPIC
)

from app.services.extraction_pipeline import (
    process_document_from_path
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

    # Don't automatically acknowledge
    # the message before processing.

    "enable.auto.commit":
    False
})


def start_consumer():

    consumer.subscribe(
        [
            DOCUMENT_UPLOADED_TOPIC
        ]
    )


    print(
        "Kafka consumer started"
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

                # Decode Kafka bytes

                raw_message = (
                    message
                    .value()
                    .decode("utf-8")
                )


                print(
                    "RAW MESSAGE:"
                )

                print(
                    raw_message
                )


                # Convert JSON -> Python dict

                data = json.loads(
                    raw_message
                )


                print(
                    "Received document.uploaded:"
                )

                print(
                    data
                )


                # Process document

                result = (
                    process_document_from_path(
                        data
                    )
                )


                print(
                    "Extraction result:"
                )

                print(
                    result
                )


                # Publish extracted result

                publish_extracted_document(
                    result
                )


                # Commit ONLY after successful processing

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

                print(
                    "Message will not be processed."
                )


                # We commit malformed messages
                # so they don't repeatedly poison
                # the consumer.

                consumer.commit(
                    message=message
                )


            except Exception as error:

                print(
                    "Document processing failed:",
                    error
                )

                print(
                    "Kafka message was NOT committed."
                )

                # We intentionally don't commit.
                #
                # This allows us to retry the message
                # later.


    finally:

        consumer.close()

        print(
            "Kafka consumer closed"
        )