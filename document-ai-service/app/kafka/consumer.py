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
    "earliest"

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



    while True:


        message = consumer.poll(
            1.0
        )


        if message is None:
            continue



        if message.error():

            print(
                message.error()
            )

            continue



        data = json.loads(

            message.value().decode("utf-8")

        )



        print(
            "Received:",
            data
        )


        result = (
            process_document_from_path(
                data
            )
        )


        publish_extracted_document(
            result
        )