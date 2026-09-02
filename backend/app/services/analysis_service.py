import uuid

from sqlalchemy.orm import Session

from utils.audio_processor import process_input
from core.transcriber import transcribe_all
from core.summarize import summarize, generate_title
from core.extractor import (
    extract_action_items,
    extract_key_decisions,
    extract_questions,
)
from core.rag_engine import build_rag_chain

from backend.app.database.models import Meeting


rag_sessions = {}


def run_analysis(source: str, language: str, db: Session):

    # Generate a unique ID for this meeting
    meeting_id = str(uuid.uuid4())

    # Existing AI pipeline — DO NOT CHANGE
    chunks = process_input(source)

    transcript = transcribe_all(
        chunks,
        language=language
    )

    title = generate_title(transcript)

    summary = summarize(transcript)

    action_items = extract_action_items(transcript)

    key_decisions = extract_key_decisions(transcript)

    open_questions = extract_questions(transcript)

    # Existing RAG logic
    rag_chain = build_rag_chain(
        transcript,
        meeting_id
    )

    rag_sessions[meeting_id] = rag_chain

    # Save analysis result to PostgreSQL
    meeting = Meeting(
        meeting_id=meeting_id,
        source=source,
        language=language,
        title=title,
        transcript=transcript,
        summary=summary,
        action_items=action_items,
        key_decisions=key_decisions,
        open_questions=open_questions,
    )

    db.add(meeting)
    db.commit()
    db.refresh(meeting)

    return {
        "meeting_id": meeting_id,
        "title": title,
        "transcript": transcript,
        "summary": summary,
        "action_items": action_items,
        "key_decisions": key_decisions,
        "open_questions": open_questions,
    }