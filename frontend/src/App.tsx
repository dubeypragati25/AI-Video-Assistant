import { useState } from "react";

interface AnalysisResult {
  meeting_id: string;
  title: string;
  transcript: string;
  summary: string;
  action_items: string;
  key_decisions: string;
  open_questions: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [source, setSource] = useState("");
  const [language, setLanguage] = useState("english");

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [question, setQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const analyzeMeeting = async () => {
    if (!source.trim()) {
      setError("Please enter a YouTube URL.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    setChatMessages([]);
    setQuestion("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/analysis/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: source,
            language: language,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed.");
      }

      setResult(data);
      console.log("ANALYSIS RESULT:", data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const askMeeting = async () => {
  if (!question.trim()) {
    return;
  }

  if (!result) {
    return;
  }

  const userQuestion = question.trim();

  setChatMessages((messages) => [
    ...messages,
    {
      role: "user",
      content: userQuestion,
    },
  ]);

  setQuestion("");
  setChatLoading(true);

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/analysis/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meeting_id: result.meeting_id,
          question: userQuestion,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to get answer.");
    }

    setChatMessages((messages) => [
      ...messages,
      {
        role: "assistant",
        content: data.answer,
      },
    ]);
  } catch (err) {
    setChatMessages((messages) => [
      ...messages,
      {
        role: "assistant",
        content:
          err instanceof Error
            ? err.message
            : "Something went wrong.",
      },
    ]);
  } finally {
    setChatLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                AI Video Assistant
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Turn meetings into actionable insights
              </p>
            </div>

            <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
              AI Meeting Assistant
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero */}
        <section className="text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Analyze Your Meetings
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400">
            Upload a meeting recording or provide a YouTube URL to generate
            transcripts, summaries, action items, decisions, and more.
          </p>
        </section>

        {/* Input Card */}
        <section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <div>
            <label className="mb-3 block text-sm font-medium text-slate-200">
              YouTube URL or File Path
            </label>

            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Paste a YouTube URL..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-slate-500"
            />
          </div>

          {/* Language */}
          <div className="mt-6">
            <label className="mb-3 block text-sm font-medium text-slate-200">
              Meeting Language
            </label>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-500"
            >
              <option value="english">English</option>
              <option value="hinglish">Hinglish</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Analyse Button */}
          <button
            type="button"
            onClick={analyzeMeeting}
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing Meeting..." : "Analyse Meeting"}
          </button>
        </section>

        {/* Loading */}
        {loading && (
          <section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-white"></div>

            <h3 className="mt-5 text-lg font-semibold">
              Analyzing your meeting
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Downloading audio, transcribing, generating insights, and
              building the meeting knowledge base.
            </p>

            <p className="mt-4 text-xs text-slate-500">
              This may take some time because Whisper and the AI models are
              running locally/API-based.
            </p>
          </section>
        )}

        {/* Results */}
        {result && !loading && (
          <section className="mt-12 space-y-6">
            {/* Meeting Title */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <p className="text-sm text-slate-500">Meeting Title</p>

              <h2 className="mt-2 text-3xl font-bold">
                {result.title}
              </h2>

              <p className="mt-3 text-xs text-slate-500">
                Meeting ID: {result.meeting_id}
              </p>
            </div>

            {/* Summary */}
            <ResultCard
              title="Summary"
              content={result.summary}
            />

            {/* Action Items */}
            <ResultCard
              title="Action Items"
              content={result.action_items}
            />

            {/* Key Decisions */}
            <ResultCard
              title="Key Decisions"
              content={result.key_decisions}
            />

            {/* Open Questions */}
            <ResultCard
              title="Open Questions"
              content={result.open_questions}
            />

            {/* Transcript */}
            <ResultCard
              title="Transcript"
              content={result.transcript}
            />
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
  <div>
    <h3 className="text-xl font-semibold">
      Chat with Meeting
    </h3>

    <p className="mt-2 text-sm text-slate-400">
      Ask questions about the meeting and get answers from the transcript.
    </p>
  </div>

  <div className="mt-6 space-y-4">
    {chatMessages.length === 0 && (
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-500">
        Try asking:
        <br />
        <span className="text-slate-400">
          "What were the main decisions?"
        </span>
      </div>
    )}

    {chatMessages.map((message, index) => (
      <div
        key={index}
        className={
          message.role === "user"
            ? "ml-auto max-w-3xl rounded-xl bg-white p-4 text-sm text-slate-950"
            : "max-w-3xl rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-slate-300"
        }
      >
        {message.content}
      </div>
    ))}

    {chatLoading && (
      <div className="max-w-3xl rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-500">
        Searching the meeting transcript...
      </div>
    )}
  </div>

  <div className="mt-6 flex gap-3">
    <input
      type="text"
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          askMeeting();
        }
      }}
      placeholder="Ask something about the meeting..."
      className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
    />

    <button
      type="button"
      onClick={askMeeting}
      disabled={chatLoading || !question.trim()}
      className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {chatLoading ? "Asking..." : "Ask"}
    </button>
  </div>
</div>
          </section>
        )}

        {/* Feature Cards */}
        {!result && !loading && (
          <section className="mt-12 grid gap-5 md:grid-cols-3">
            <FeatureCard
              title="Smart Transcription"
              description="Convert meeting audio into searchable text using Whisper."
            />

            <FeatureCard
              title="AI Insights"
              description="Generate meeting summaries, action items, decisions, and open questions."
            />

            <FeatureCard
              title="Ask Your Meeting"
              description="Use RAG to ask questions and retrieve information from the transcript."
            />
          </section>
        )}
      </main>
    </div>
  );
}

function ResultCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
      <h3 className="text-xl font-semibold">{title}</h3>

      <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">
        {content}
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default App;