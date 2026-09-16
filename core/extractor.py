from dotenv import load_dotenv
from groq import Groq

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
        temperature=0.2,
        max_completion_tokens=2048,
        include_reasoning=False
    )

    return response.choices[0].message.content


def extract_action_items(transcript: str) -> str:

    client = get_llm()

    instruction = (
        "You are an expert meeting analyst. From the meeting transcript, "
        "extract all action items. For each provide:\n"
        "- Task description\n"
        "- Owner (who is responsible)\n"
        "- Deadline (if mentioned, else write 'Not specified')\n\n"
        "Format as a numbered list. If none found say "
        "'No action items found.'"
    )

    return generate_response(
        client,
        instruction,
        transcript
    )


def extract_key_decisions(transcript: str) -> str:

    client = get_llm()

    instruction = (
        "You are an expert meeting analyst. From the meeting transcript, "
        "extract all key decisions made. Format as a numbered list. "
        "If none found say 'No key decisions found.'"
    )

    return generate_response(
        client,
        instruction,
        transcript
    )


def extract_questions(transcript: str) -> str:

    client = get_llm()

    instruction = (
        "From the meeting transcript, extract all unresolved questions "
        "or topics needing follow-up. Format as a numbered list. "
        "If none found say 'No open questions found.'"
    )

    return generate_response(
        client,
        instruction,
        transcript
    )