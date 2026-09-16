from dotenv import load_dotenv
from groq import Groq

from langchain_text_splitters import RecursiveCharacterTextSplitter

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
    text: str
) -> str:

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": system_instruction
            },
            {
                "role": "user",
                "content": text
            }
        ],
        temperature=0.3,
        max_completion_tokens=2048,
        include_reasoning=False
    )

    return response.choices[0].message.content


def split_transcript(transcript: str) -> list:

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=3000,
        chunk_overlap=200
    )

    return splitter.split_text(transcript)


def summarize(transcript: str) -> str:

    client = get_llm()

    map_instruction = (
        "Summarize this portion of a meeting transcript concisely."
    )

    chunks = split_transcript(transcript)

    chunk_summaries = [
        generate_response(
            client,
            map_instruction,
            chunk
        )
        for chunk in chunks
    ]

    combined = "\n\n".join(chunk_summaries)

    combined_instruction = (
        "You are an expert meeting summarizer. "
        "Combine these partial summaries into one final professional "
        "meeting summary in bullet points."
    )

    return generate_response(
        client,
        combined_instruction,
        combined
    )


def generate_title(transcript: str) -> str:

    client = get_llm()

    title_instruction = (
        "Based on the meeting transcript, generate a short professional "
        "meeting title (max 8 words). Only return the title, nothing else."
    )

    return generate_response(
        client,
        title_instruction,
        transcript[:2000]
    )