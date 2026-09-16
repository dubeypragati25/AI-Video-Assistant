from dotenv import load_dotenv
from groq import Groq

from langchain_core.runnables import RunnableLambda

from core.vector_stores import (
    build_vector_store,
    load_vector_store,
    get_retriever
)

import os

load_dotenv()


MODEL_NAME = "openai/gpt-oss-120b"


def get_llm():
    return Groq(
        api_key=os.getenv("GROQ_API_KEY")
    )


def generate_response(
    client,
    system_instruction: str,
    context: str,
    question: str
) -> str:

    prompt = f"""
Context from meeting transcript:

{context}

User question:

{question}
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": system_instruction
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_completion_tokens=2048,
        include_reasoning=False
    )

    return response.choices[0].message.content


def format_docs(docs):
    return "\n\n".join(
        [doc.page_content for doc in docs]
    )


def build_rag_chain(transcript: str, meeting_id: str):

    collection_name = f"meeting_{meeting_id}"

    vector_store = build_vector_store(
        transcript,
        collection_name=collection_name
    )

    retriever = get_retriever(
        vector_store,
        k=4
    )

    client = get_llm()

    system_instruction = """
You are an expert meeting assistant.

Answer the user's question based ONLY on the meeting transcript
context provided.

If the answer is not found in the context, say:

"I could not find this information in the meeting transcript."

Always be concise and precise.

If quoting someone, mention it clearly.
"""

    def rag_function(question):

        docs = retriever.invoke(question)

        context = format_docs(docs)

        return generate_response(
            client,
            system_instruction,
            context,
            question
        )

    return RunnableLambda(rag_function)


def load_rag_chain(meeting_id: str):

    collection_name = f"meeting_{meeting_id}"

    vector_store = load_vector_store(
        collection_name=collection_name
    )

    retriever = get_retriever(
        vector_store,
        k=4
    )

    client = get_llm()

    system_instruction = """
You are an expert meeting assistant.

Answer the user's question based ONLY on the meeting transcript
context provided.

If the answer is not found in the context, say:

"I could not find this information in the meeting transcript."

Always be concise and precise.

If quoting someone, mention it clearly.
"""

    def rag_function(question):

        docs = retriever.invoke(question)

        context = format_docs(docs)

        return generate_response(
            client,
            system_instruction,
            context,
            question
        )

    return RunnableLambda(rag_function)


def ask_question(rag_chain, question: str) -> str:

    print(f"Question : {question}")

    answer = rag_chain.invoke(question)

    print(f"answer : {answer}")

    return answer