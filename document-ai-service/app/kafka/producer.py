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



def publish_extracted_document(
        data:dict
):


    producer.produce(

        DOCUMENT_EXTRACTED_TOPIC,

        json.dumps(data)

    )


    producer.flush()