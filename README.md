                              USER
                               |
                               |
                     Upload Medical Document
                               |
                               |
                               ▼

                     API Gateway (Spring Cloud)
                               |
                               |
       ---------------------------------------------------
       |                                                 |
       ▼                                                 ▼

 Identity Service                              Document Service
 Spring Boot                                  Spring Boot

 - Authentication                             - Upload PDF/Image
 - JWT                                        - Metadata
 - User profile                               - Document storage
                                              
                                                        |
                                                        |
                                                        ▼

                                               Kafka Event Bus

                                               document.uploaded


                                                        |
                                                        |
        ----------------------------------------------------------------
        |                         |                                    |
        ▼                         ▼                                    ▼


 Document AI Service       Provider Registry Service        Verification Service

 Python FastAPI            Spring Boot                    Spring Boot

 - OCR                     - Hospital lookup              - Workflow engine
 - LLM extraction          - NPI validation               - Status management
 - Medical entities        - Provider endpoint            - Verification rules


        |
        |
        ▼

 extracted.medical.info


        |
        |
        ▼


              Communication Service

              Spring Boot

              ------------------------

              FHIR Client
              Email Gateway
              Secure Messaging

              ------------------------


                         |
                         |
                         ▼


                 Hospital / Provider System


                 FHIR Server

                 (Mock Epic/Cerner)


                         |
                         |
                         ▼


                 Verification Response


                         |
                         |
                         ▼


                    Kafka Event


              verification.completed


                         |
                         |
                         ▼


              Verification Result Service


                         |
                         |
                         ▼


                       USER

                  VERIFIED / INVALID