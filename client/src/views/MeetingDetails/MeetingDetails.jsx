import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import {
    ArrowLeft,
    Brain,
    CheckCircle2,
    Clock3,
    FileText,
    ListChecks,
    MessageCircleQuestion,
    Sparkles,
    Trash2
} from "lucide-react";

import api from "../../services/api";

const MeetingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // =========================================
    // MEETING STATE
    // =========================================

    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================
    // FETCH MEETING
    // =========================================

    useEffect(() => {
        let interval;

        const fetchMeeting = async () => {
            try {
                const response =
                    await api.get(`/meetings/${id}`);

                const currentMeeting =
                    response.data.meeting;

                setMeeting(currentMeeting);

                // Stop polling once processing is finished
                if (
                    currentMeeting.status === "completed" ||
                    currentMeeting.status === "failed"
                ) {
                    clearInterval(interval);
                }

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load meeting."
                );

                clearInterval(interval);

            } finally {
                setLoading(false);
            }
        };

        fetchMeeting();

        interval = setInterval(
            fetchMeeting,
            3000
        );

        return () => {
            clearInterval(interval);
        };

    }, [id]);

    // =========================================
    // DELETE MEETING
    // =========================================

    const handleDelete = async () => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this meeting?"
            );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/meetings/${id}`);

            navigate("/dashboard");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to delete meeting."
            );
        }
    };

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div className="meeting-details-loading">

                <div className="loading-spinner"></div>

                <p>
                    Loading meeting...
                </p>

            </div>
        );
    }

    // =========================================
    // ERROR
    // =========================================

    if (error || !meeting) {
        return (
            <div className="meeting-details-loading">

                <div className="meeting-error-icon">
                    <FileText size={24} />
                </div>

                <h2>
                    Meeting not found
                </h2>

                <p>
                    {error ||
                        "This meeting could not be loaded."}
                </p>

                <Link
                    to="/dashboard"
                    className="primary-button"
                >
                    <ArrowLeft size={17} />
                    Back to dashboard
                </Link>

            </div>
        );
    }

    const isProcessing =
        meeting.status === "processing";

    const isCompleted =
        meeting.status === "completed";

    const isFailed =
        meeting.status === "failed";

    // =========================================
    // MAIN UI
    // =========================================

    return (
        <div className="meeting-details-page">

            {/* =====================================
                HEADER
            ====================================== */}

            <header className="meeting-details-header">

                <Link
                    to="/dashboard"
                    className="back-button"
                >
                    <ArrowLeft size={18} />
                    Dashboard
                </Link>

                <div className="new-meeting-brand">

                    <div className="brand-icon">
                        <Brain size={20} />
                    </div>

                    <span>
                        AI Video Assistant
                    </span>

                </div>

                <button
                    className="delete-meeting-button"
                    onClick={handleDelete}
                >
                    <Trash2 size={17} />
                    Delete
                </button>

            </header>

            <main className="meeting-details-content">

                {/* =================================
                    MEETING HEADING
                ================================== */}

                <section className="meeting-details-heading">

                    <div>

                        <div className="meeting-details-badge">

                            <Brain size={15} />

                            AI Meeting Analysis

                        </div>

                        <h1>
                            {meeting.title}
                        </h1>

                        <p className="meeting-source">
                            {meeting.source}
                        </p>

                    </div>

                    <div
                        className={
                            `meeting-status status-${meeting.status}`
                        }
                    >

                        {isProcessing && (
                            <Clock3 size={16} />
                        )}

                        {isCompleted && (
                            <CheckCircle2 size={16} />
                        )}

                        {isFailed && (
                            <FileText size={16} />
                        )}

                        <span>
                            {meeting.status}
                        </span>

                    </div>

                </section>

                {/* =================================
                    PROCESSING STATE
                ================================== */}

                {isProcessing && (

                    <section className="processing-card">

                        <div className="processing-icon">
                            <Brain size={28} />
                        </div>

                        <div className="processing-content">

                            <h2>
                                Your meeting is being analyzed
                            </h2>

                            <p>
                                AI Video Assistant is preparing the
                                transcript and extracting useful insights
                                from your meeting.
                            </p>

                            <div className="processing-steps">

                                <div className="processing-step active">

                                    <div className="step-dot"></div>

                                    <span>
                                        Meeting received
                                    </span>

                                </div>

                                <div className="processing-step">

                                    <div className="step-dot"></div>

                                    <span>
                                        Transcribing audio
                                    </span>

                                </div>

                                <div className="processing-step">

                                    <div className="step-dot"></div>

                                    <span>
                                        Generating AI insights
                                    </span>

                                </div>

                                <div className="processing-step">

                                    <div className="step-dot"></div>

                                    <span>
                                        Preparing results
                                    </span>

                                </div>

                            </div>

                        </div>

                    </section>

                )}

                {/* =================================
                    FAILED STATE
                ================================== */}

                {isFailed && (

                    <section className="processing-card failed-processing">

                        <div className="processing-icon">
                            <FileText size={28} />
                        </div>

                        <div className="processing-content">

                            <h2>
                                Analysis failed
                            </h2>

                            <p>
                                We couldn't complete the analysis for
                                this meeting. Please try again later.
                            </p>

                        </div>

                    </section>

                )}

                {/* =================================
                    COMPLETED RESULTS
                ================================== */}

                {isCompleted && (

                    <>

                        {/* =================================
                            ASK AI CTA
                        ================================== */}

                        <div className="ask-ai-cta">

                            <div className="ask-ai-cta-content">

                                <div className="ask-ai-cta-icon">
                                    <Sparkles size={20} />
                                </div>

                                <div>

                                    <h3>
                                        Have questions about this meeting?
                                    </h3>

                                    <p>
                                        Ask AI questions and get answers
                                        directly from the meeting transcript.
                                    </p>

                                </div>

                            </div>

                            <Link
                                to={`/meetings/${id}/ask`}
                                className="ask-ai-cta-button"
                            >
                                Ask AI
                                <Sparkles size={16} />
                            </Link>

                        </div>

                        {/* =================================
                            AI INSIGHTS
                        ================================== */}

                        <section className="meeting-insights">

                            {/* SUMMARY */}

                            <div className="summary-card">

                                <div className="insight-card-header">

                                    <div className="insight-icon">
                                        <FileText size={20} />
                                    </div>

                                    <span>
                                        Summary
                                    </span>

                                </div>

                                <div className="summary-content">
                                    {meeting.summary ? (
                                        <ReactMarkdown>
                                            {meeting.summary}
                                        </ReactMarkdown>
                                    ) : (
                                        <p>No summary available.</p>
                                    )}
                                </div>

                            </div>

                            {/* THREE INSIGHTS */}

                            <div className="insights-grid">

                                {/* ACTION ITEMS */}

                                <div className="insight-card">

                                    <div className="insight-card-header">

                                        <div className="insight-icon">
                                            <ListChecks size={20} />
                                        </div>

                                        <span>
                                            Action Items
                                        </span>

                                    </div>

                                    <p>
                                        {meeting.actionItems ||
                                            "No action items available."}
                                    </p>

                                </div>

                                {/* KEY DECISIONS */}

                                <div className="insight-card">

                                    <div className="insight-card-header">

                                        <div className="insight-icon">
                                            <CheckCircle2 size={20} />
                                        </div>

                                        <span>
                                            Key Decisions
                                        </span>

                                    </div>

                                    <p>
                                        {meeting.keyDecisions ||
                                            "No key decisions available."}
                                    </p>

                                </div>

                                {/* OPEN QUESTIONS */}

                                <div className="insight-card">

                                    <div className="insight-card-header">

                                        <div className="insight-icon">
                                            <MessageCircleQuestion size={20} />
                                        </div>

                                        <span>
                                            Open Questions
                                        </span>

                                    </div>

                                    <p>
                                        {meeting.openQuestions ||
                                            "No open questions available."}
                                    </p>

                                </div>

                            </div>

                        </section>

                        {/* =================================
                            TRANSCRIPT
                        ================================== */}

                        <section className="transcript-card">

                            <div className="transcript-header">

                                <div>

                                    <h2>
                                        Transcript
                                    </h2>

                                    <p>
                                        Full transcript generated from
                                        the meeting audio.
                                    </p>

                                </div>

                                <FileText size={21} />

                            </div>

                            <div className="transcript-content">

                                {meeting.transcript ||
                                    "No transcript available."}

                            </div>

                        </section>

                    </>

                )}

            </main>

        </div>
    );
};

export default MeetingDetails;