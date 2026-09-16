from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


app = FastAPI(
    title="AI Video Assistant AI API",
    version="1.0.0"
)


# =========================================
# REQUEST MODELS
# =========================================

class MeetingRequest(BaseModel):
    source: str
    language: str = "english"


class AskRequest(BaseModel):
    meeting_id: str
    question: str


# =========================================
# HEALTH CHECK
# =========================================

@app.get("/health")
def health():

    return {
        "success": True,
        "message": "Python AI service is running"
    }


# =========================================
# PROCESS MEETING
# =========================================

@app.post("/process")
def process_meeting(request: MeetingRequest):

    try:

        # Import heavy AI pipeline only when needed
        from main import run_pipeline

        result = run_pipeline(
            request.source,
            request.language
        )

        return {
            "success": True,
            "result": result
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# =========================================
# ASK QUESTION — RAG
# =========================================

@app.post("/ask")
def ask_meeting_question(request: AskRequest):

    try:

        # Validate meeting ID
        if not request.meeting_id.strip():

            raise HTTPException(
                status_code=400,
                detail="Meeting ID is required"
            )

        # Validate question
        if not request.question.strip():

            raise HTTPException(
                status_code=400,
                detail="Question is required"
            )

        # Import RAG modules only when needed
        from core.rag_engine import load_rag_chain, ask_question

        # Load the existing RAG chain
        rag_chain = load_rag_chain(
            request.meeting_id
        )

        # Ask the question using the
        # existing RAG implementation
        answer = ask_question(
            rag_chain,
            request.question
        )

        return {
            "success": True,
            "answer": answer
        }

    except HTTPException:
        raise

    except Exception as error:

        print(
            f"RAG question error: {error}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to answer question"
        )