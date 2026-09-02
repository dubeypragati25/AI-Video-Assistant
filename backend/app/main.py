from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from backend.app.api.analysis import router as analysis_router
from backend.app.database.connection import Base, engine
from backend.app.database import models


load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Video Assistant API",
    description="Backend API for the AI Video Assistant",
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Routers
# --------------------------------------------------

app.include_router(analysis_router)


# --------------------------------------------------
# Basic Routes
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "AI Video Assistant API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }