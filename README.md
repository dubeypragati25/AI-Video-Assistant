# AI Video Assistant

An AI-powered meeting assistant that converts YouTube videos or local media into transcripts and actionable meeting insights. The system uses Whisper for transcription, LangChain with Mistral for meeting analysis, and Retrieval-Augmented Generation (RAG) for transcript-based question answering.

## Features

- Automatic meeting transcription using Whisper
- AI-generated meeting summaries
- Action item extraction with owners and deadlines
- Key decision extraction
- Open question and follow-up topic extraction
- RAG-based question answering over meeting transcripts
- Semantic retrieval using embeddings and ChromaDB
- REST APIs using FastAPI
- PostgreSQL persistence for meeting data and generated insights
- React and TypeScript frontend

## System Architecture

```text
YouTube URL / Local Media
          |
          v
   Audio Processing
          |
          v
      Whisper
   Transcription
          |
          v
 Meeting Transcript
          |
     +----+----+----------------+
     |         |                |
     v         v                v
  Summarize  Insights          RAG
             Extraction          |
                                v
                           Embeddings
                                |
                                v
                            ChromaDB
                                |
                                v
                         Transcript Q&A
          |
          v
      PostgreSQL
          |
          v
    React Frontend
```

## How It Works

### 1. Input

The user provides a YouTube URL or supported local media source.

### 2. Audio Processing

The input media is processed and converted into audio chunks suitable for transcription.

### 3. Transcription

Whisper converts the meeting audio into a text transcript.

The project also contains a Hinglish transcription path using Sarvam AI.

### 4. Meeting Analysis

The transcript is processed using LangChain and Mistral to generate:

- Meeting title
- Meeting summary
- Action items
- Key decisions
- Open questions

### 5. RAG-Based Question Answering

The transcript is divided into smaller chunks and converted into vector embeddings.

These embeddings are stored in ChromaDB and used for semantic retrieval.

When a user asks a question, relevant transcript chunks are retrieved and provided to the language model to generate a context-aware answer.

```text
User Question
      |
      v
Semantic Retrieval
      |
      v
Relevant Transcript Chunks
      |
      v
Language Model
      |
      v
Answer
```

### 6. PostgreSQL Persistence

Meeting information is stored in PostgreSQL, including:

- Meeting ID
- Source
- Language
- Title
- Transcript
- Summary
- Action items
- Key decisions
- Open questions
- Creation timestamp

## Tech Stack

### Backend
- Python
- FastAPI
- Pydantic
- SQLAlchemy

### AI / NLP
- OpenAI Whisper
- LangChain
- Mistral AI
- RAG
- Hugging Face Embeddings
- ChromaDB

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Database
- PostgreSQL
- ChromaDB

### Tools
- Git
- GitHub
- FFmpeg

## Project Structure

```text
AI_video_assistant/
|
├── backend/
│   └── app/
│       ├── api/
│       │   └── analysis.py
│       ├── database/
│       │   ├── connection.py
│       │   ├── dependencies.py
│       │   └── models.py
│       ├── schemas/
│       │   └── analysis.py
│       ├── services/
│       │   └── analysis_service.py
│       └── main.py
│
├── core/
│   ├── extractor.py
│   ├── rag_engine.py
│   ├── summarize.py
│   ├── transcriber.py
│   └── vector_stores.py
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
├── utils/
│   └── audio_processor.py
│
├── .gitignore
├── Requirements.txt
└── README.md
```

## API Endpoints

### Health Check

```http
GET /health
```

Returns:

```json
{
  "status": "healthy"
}
```

### Analyze Meeting

```http
POST /api/v1/analysis/analyze
```

Example request:

```json
{
  "source": "YOUTUBE_URL",
  "language": "english"
}
```

### Chat with Meeting

```http
POST /api/v1/analysis/chat
```

Example request:

```json
{
  "meeting_id": "MEETING_ID",
  "question": "What were the main decisions?"
}
```

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dubeypragati25/AI-Video-Assistant.git
cd AI-Video-Assistant
```

### 2. Create a Python Virtual Environment

```bash
python3.12 -m venv .venv
source .venv/bin/activate
```

### 3. Install Python Dependencies

```bash
pip install -r Requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
MISTRAL_API_KEY=your_mistral_api_key
SARVAM_API_KEY=your_sarvam_api_key
WHISPER_MODEL=small
SARVAM_STT_MODEL=saaras:v2.5
```

**Never commit your `.env` file to GitHub.**

### 5. Set Up PostgreSQL

Create a PostgreSQL database named:

```text
ai_video_assistant
```

Update the database configuration in:

```text
backend/app/database/connection.py
```

if your PostgreSQL username or configuration is different.

### 6. Start the FastAPI Backend

From the project root:

```bash
uvicorn backend.app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

### 7. Start the React Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local frontend URL in the terminal.

## Environment Variables

| Variable | Purpose |
|---|---|
| `MISTRAL_API_KEY` | Mistral API authentication |
| `SARVAM_API_KEY` | Sarvam AI authentication |
| `WHISPER_MODEL` | Whisper model selection |
| `SARVAM_STT_MODEL` | Sarvam speech-to-text model |

## Current Scope

The current implementation focuses on:

- Meeting transcription
- AI-generated meeting insights
- RAG-based transcript question answering
- FastAPI backend
- React frontend
- PostgreSQL persistence

Generated media, ChromaDB data, virtual environments, frontend dependencies, and environment secrets are excluded from version control through `.gitignore`.

## Use Cases

- Meeting summarization
- Lecture and interview analysis
- Action-item extraction
- Decision tracking
- Meeting transcript search
- Question answering over recorded meetings

