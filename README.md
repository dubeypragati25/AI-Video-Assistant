# AI Video Assistant

An AI-powered meeting intelligence platform that converts YouTube videos or uploaded audio/video files into searchable transcripts, summaries, decisions, action items, and AI-powered answers

## Features

- Process YouTube videos or uploaded files
- Speech transcription using Whisper
- AI-generated meeting summaries
- Extract action items
- Extract key decisions
- Extract open questions
- Ask questions about meetings using RAG
- Semantic search with ChromaDB
- HuggingFace embeddings
- Groq GPT-OSS 120B
- JWT authentication
- User-specific meeting data
- Meeting dashboard
- Markdown-rendered AI responses
- Responsive UI


## System Architecture


React Frontend
      │
      ▼
Node.js + Express
      │
      ├──────────────► MongoDB Atlas
      │
      ▼
Python FastAPI
      │
      ▼
AI Processing Pipeline
      │
      ├── Whisper → Transcription
      ├── Groq → Summarization & Extraction
      │
      └── RAG
           ├── HuggingFace Embeddings
           ├── ChromaDB
           ├── Retriever (Top 4)
           └── Groq GPT-OSS 120B

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

User Question
      ↓
ChromaDB Retriever
      ↓
Top 4 Relevant Transcript Chunks
      ↓
Context + Question
      ↓
Groq GPT-OSS 120B
      ↓
AI Answer

## Tech Stack

### Backend
- Node.js
Express.js
MongoDB
Mongoose
JWT
bcryptjs
Axios

### AI / NLP
- Python
FastAPI
Whisper
Groq GPT-OSS 120B
LangChain
HuggingFace Embeddings
ChromaDB

### Frontend
- React
Vite
React Router
Axios
Lucide React
Framer Motion
Recharts
React Markdown

## Project Structure

AI_video_assistant/
│
├── core/
│   ├── extractor.py
│   ├── rag_engine.py
│   ├── summarize.py
│   ├── transcriber.py
│   └── vector_stores.py
│
├── utils/
│   └── audio_processor.py
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── controllers/
│       ├── hooks/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── views/
│       ├── AskAI/
│       ├── App.jsx
│       └── index.css
│
├── api.py
├── main.py
├── Requirements.txt
└── README.md

Setup

Python AI Service:
python3 -m venv .venv
source .venv/bin/activate
pip install -r Requirements.txt
uvicorn api:app --reload --port 8000

Backend:
cd server
npm install
npm run dev

Frontend:
cd client
npm install
npm run dev

