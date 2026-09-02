from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.services.analysis_service import run_analysis, rag_sessions
from backend.app.schemas.analysis import AnalysisResponse
from backend.app.database.dependencies import get_db

router = APIRouter(
    prefix="/api/v1/analysis",
    tags=["Analysis"],
)


class AnalysisRequest(BaseModel):
    source: str
    language: str = "english"


class ChatRequest(BaseModel):
    meeting_id: str
    question: str


class ChatResponse(BaseModel):
    answer: str


@router.post("/analyze", response_model=AnalysisResponse)
def analyze_meeting(
    request: AnalysisRequest,
    db: Session = Depends(get_db)
):
    if not request.source.strip():
        raise HTTPException(
            status_code=400,
            detail="Source cannot be empty."
        )

    if request.language not in ["english", "hinglish"]:
        raise HTTPException(
            status_code=400,
            detail="Language must be 'english' or 'hinglish'."
        )

    try:
        result = run_analysis(
        source=request.source,
        language=request.language,
        db=db
)

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post("/chat", response_model=ChatResponse)
def chat_with_meeting(request: ChatRequest):

    if not request.meeting_id.strip():
        raise HTTPException(
            status_code=400,
            detail="Meeting ID cannot be empty."
        )

    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    if request.meeting_id not in rag_sessions:
        raise HTTPException(
            status_code=404,
            detail="Meeting session not found."
        )

    try:
        rag_chain = rag_sessions[request.meeting_id]

        answer = rag_chain.invoke(request.question)

        return {
            "answer": answer
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )