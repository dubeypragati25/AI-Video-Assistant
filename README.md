# AI Video Assistant | Multimodal Meeting Intelligence

An end-to-end AI-powered meeting intelligence platform that transforms YouTube videos and uploaded audio/video files into searchable transcripts, structured meeting insights, and context-aware conversational answers.

Combining speech recognition, LLM-powered summarization, semantic search, and Retrieval-Augmented Generation (RAG), the application turns unstructured meeting content into an interactive knowledge base.

## Key Features

- **Media Processing:** Process YouTube videos and uploaded audio/video files.
- **Speech Recognition:** Transcribe audio using OpenAI Whisper.
- **Multilingual Support:** Hinglish transcription workflow using Sarvam AI.
- **AI Summarization:** Generate meeting summaries and structured insights.
- **Information Extraction:** Identify action items, key decisions, and open questions.
- **Conversational RAG:** Ask natural-language questions about processed meetings.
- **Semantic Search:** Retrieve relevant transcript segments using vector similarity.
- **Vector Database:** Store and retrieve embeddings using ChromaDB.
- **User Authentication:** JWT-based authentication and protected APIs.
- **Meeting Management:** Maintain user-specific meeting history and generated insights.

## System Architecture

The application uses a modular architecture with separate frontend, backend, and AI processing services.

```text
                React Frontend
                      |
                   REST APIs
                      |
               Node.js + Express
                      |
              +-------+--------+
              |                |
         MongoDB Atlas     Python FastAPI
              |                |
        Meeting Data       AI Processing
                               |
                    +----------+----------+
                    |          |          |
                 Whisper     LLM       RAG Engine
                    |          |          |
                Transcript  Summaries  Embeddings
                               |          |
                               |       ChromaDB
                               |          |
                               |      Retriever
                               |          |
                               +---- Context
                                      |
                                      v
                                   Groq LLM
                                      |
                                      v
                                  AI Answer
```

## How It Works

**1. Media Ingestion & Audio Processing**

Users provide a YouTube URL or upload a supported local media file. Audio is extracted, converted into the required format, and segmented for transcription.

*Tools: yt-dlp, FFmpeg, Pydub.*

**2. Speech Recognition**

OpenAI Whisper converts processed audio into text transcripts. The application also includes a Hinglish transcription workflow using Sarvam AI.

**3. Meeting Intelligence**

Transcripts are processed using LangChain and LLM integration to generate:

- Meeting title and summary
- Action items
- Key decisions
- Open questions

Long transcripts are divided into manageable chunks using LangChain's `RecursiveCharacterTextSplitter`.

**4. Retrieval-Augmented Generation (RAG)**

A RAG pipeline enables users to ask questions about their meeting transcripts.

*Document Indexing*

```text
Meeting Transcript
        |
        v
Text Chunking
        |
        v
HuggingFace Embeddings
        |
        v
Vector Representations
        |
        v
ChromaDB
```

*Query Processing*

```text
User Question
      |
      v
ChromaDB Retriever
      |
      v
Top 4 Relevant Chunks
      |
      v
Retrieved Context + Question
      |
      v
Groq GPT-OSS 120B
      |
      v
Context-Aware Answer
```

The retrieval pipeline uses semantic embeddings to identify relevant transcript segments and supplies the retrieved context to the LLM for meeting-specific answer generation.

## RAG Implementation Details

| Component | Implementation |
|---|---|
| Document Chunking | LangChain RecursiveCharacterTextSplitter |
| Embedding Generation | HuggingFace Embeddings |
| Vector Storage | ChromaDB |
| Retrieval Strategy | Semantic similarity search |
| Retrieval Configuration | Top 4 relevant chunks |
| Answer Generation | Groq GPT-OSS 120B |

This architecture allows users to retrieve information from lengthy transcripts without passing the entire meeting content to the LLM for every query.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcryptjs |
| AI Service | Python, FastAPI |
| Speech Recognition | OpenAI Whisper, Sarvam AI |
| LLM Inference | Groq, GPT-OSS 120B |
| AI Orchestration | LangChain |
| Embeddings | HuggingFace |
| Vector Database | ChromaDB |
| Audio Processing | yt-dlp, FFmpeg, Pydub |

## Project Structure

```text
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
│       ├── hooks/
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
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js and npm
- MongoDB Atlas or a MongoDB instance
- FFmpeg
- Required API credentials

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd AI_video_assistant
```

### 2. Set Up the AI Service

```bash
python -m venv .venv

# macOS / Linux
source .venv/bin/activate

# Windows
.venv\Scripts\activate

pip install -r Requirements.txt

uvicorn api:app --reload --port 8000
```

### 3. Set Up the Backend

```bash
cd server
npm install
npm run dev
```

### 4. Set Up the Frontend

```bash
cd client
npm install
npm run dev
```


**Built with Python, React, and modern AI technologies to explore multimodal processing, semantic retrieval, and Retrieval-Augmented Generation.**
