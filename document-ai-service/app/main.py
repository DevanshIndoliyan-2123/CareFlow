from fastapi import FastAPI

import threading



from app.api.routes import router


from app.kafka.consumer import (
    start_consumer
)



app = FastAPI(

    title="CareFlow AI Document Extraction Service",

    version="1.0"

)



app.include_router(

    router,

    prefix="/api/v1"

)



@app.get("/health")
def health():

    return {

        "status":"UP",

        "service":
        "document-ai-service"

    }




@app.on_event("startup")
def startup_event():

    """
    Start Kafka consumer
    when FastAPI starts.
    """


    kafka_thread = threading.Thread(

        target=start_consumer,

        daemon=True

    )


    kafka_thread.start()



    print(
        "Kafka consumer started"
    )