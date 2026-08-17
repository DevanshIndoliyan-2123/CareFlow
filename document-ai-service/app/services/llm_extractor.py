import json


from langchain_groq import ChatGroq


from app.core.config import settings



llm = ChatGroq(

    groq_api_key=settings.GROQ_API_KEY,

    model_name="openai/gpt-oss-120b",

    temperature=0

)



def extract_medical_entities(text:str):

    prompt = f"""

You are a healthcare document extraction AI.


Extract information from the medical document.


Return ONLY JSON.


Schema:


{{
 "patient":
 {{
    "name":""
 }},

 "provider":
 {{
    "name":""
 }},

 "doctor":"",

 "diagnosis":
 [
    {{
       "name":"",
       "code":""
    }}
 ],

 "confidence":0
 }}


Document:


{text}


"""


    response = llm.invoke(

        prompt

    )


    content = response.content



    return json.loads(

        content

    )