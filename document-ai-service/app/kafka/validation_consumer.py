import json

from confluent_kafka import Consumer

from app.kafka.config import (
    KAFKA_BOOTSTRAP_SERVER,
    DOCUMENT_EXTRACTED_TOPIC
)

from app.validation.validation_service import (
    validate_extracted_document
)


consumer = Consumer({

    "bootstrap.servers":
        KAFKA_BOOTSTRAP_SERVER,

    "group.id":
        "ai-validation-service",

    "auto.offset.reset":
        "earliest",

    "enable.auto.commit":
        False
})


def start_validation_consumer():

    consumer.subscribe(
        [
            DOCUMENT_EXTRACTED_TOPIC
        ]
    )


    print(
        "Validation Kafka consumer started"
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

                raw_message = (
                    message
                    .value()
                    .decode("utf-8")
                )


                data = json.loads(
                    raw_message
                )


                print(
                    "Received document.extracted"
                )


                result = validate_extracted_document(
                    data
                )


                print(
                    "Validation result:"
                )


                print(
                    result.model_dump_json(
                        indent=4
                    )
                )


                consumer.commit(
                    message=message
                )


            except Exception as error:

                print(
                    "Validation failed:",
                    error
                )


    finally:

        consumer.close()