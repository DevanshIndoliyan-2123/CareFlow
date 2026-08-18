import json

from confluent_kafka import Consumer


consumer = Consumer({

    "bootstrap.servers":
        "localhost:9092",

    "group.id":
        "test-extracted-consumer",

    "auto.offset.reset":
        "earliest"
})


consumer.subscribe(
    [
        "document.extracted"
    ]
)


print(
    "Listening for document.extracted..."
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


        raw_message = (
            message
            .value()
            .decode("utf-8")
        )


        data = json.loads(
            raw_message
        )


        print()
        print(
            "========== DOCUMENT EXTRACTED =========="
        )


        print(
            json.dumps(
                data,
                indent=4
            )
        )


        print(
            "========================================="
        )


finally:

    consumer.close()