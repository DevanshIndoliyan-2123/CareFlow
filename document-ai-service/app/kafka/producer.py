import json

from confluent_kafka import Producer

from app.kafka.config import (
    KAFKA_BOOTSTRAP_SERVER,
    DOCUMENT_EXTRACTED_TOPIC
)


producer = Producer({

    "bootstrap.servers":
        KAFKA_BOOTSTRAP_SERVER

})


def delivery_report(
        error,
        message
):

    if error is not None:

        print(
            "Kafka delivery failed:",
            error
        )

    else:

        print(
            "Kafka message delivered:",
            f"topic={message.topic()}, "
            f"partition={message.partition()}, "
            f"offset={message.offset()}"
        )



def publish_extracted_document(
        data: dict
):
    """
    Publishes the frozen document.extracted
    Kafka event.
    """

    message = json.dumps(
        data
    )


    producer.produce(

        topic=DOCUMENT_EXTRACTED_TOPIC,

        value=message.encode(
            "utf-8"
        ),

        callback=delivery_report
    )


    producer.flush()


    print(
        "Published document.extracted"
    )