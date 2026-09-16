import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import {
    ArrowLeft,
    Brain,
    CheckCircle2,
    MessageCircleQuestion,
    Send,
    Sparkles,
    User
} from "lucide-react";

import api from "../../services/api";


const AskAI = () => {

    const { id } = useParams();


    // =========================================
    // STATE
    // =========================================

    const [meeting, setMeeting] = useState(null);

    const [loading, setLoading] = useState(true);

    const [question, setQuestion] = useState("");

    const [messages, setMessages] = useState([]);

    const [asking, setAsking] = useState(false);

    const [error, setError] = useState("");

    const messagesEndRef = useRef(null);


    // =========================================
    // FETCH MEETING
    // =========================================

    useEffect(() => {

        const fetchMeeting = async () => {

            try {

                const response =
                    await api.get(`/meetings/${id}`);


                setMeeting(
                    response.data.meeting
                );


            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load meeting."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchMeeting();

    }, [id]);


    // =========================================
    // AUTO SCROLL CHAT
    // =========================================

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages, asking]);


    // =========================================
    // ASK QUESTION
    // =========================================

    const handleSuggestion = (text) => {
        setQuestion(text);
    };

    const handleAskQuestion = async (event) => {

        event.preventDefault();


        const trimmedQuestion =
            question.trim();


        if (!trimmedQuestion || asking) {

            return;

        }


        setError("");

        setAsking(true);


        // Add user message immediately
        setMessages((previousMessages) => [

            ...previousMessages,

            {
                role: "user",
                content: trimmedQuestion
            }

        ]);


        setQuestion("");


        try {

            const response =
                await api.post(
                    `/meetings/${id}/ask`,
                    {
                        question: trimmedQuestion
                    }
                );


            const answer =
                response.data.answer;


            setMessages((previousMessages) => [

                ...previousMessages,

                {
                    role: "assistant",
                    content:
                        answer ||
                        "I couldn't generate an answer."
                }

            ]);


        } catch (error) {

            console.error(
                "Ask AI error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to get an answer. Please try again."
            );


        } finally {

            setAsking(false);

        }

    };


    // =========================================
    // SUGGESTED QUESTION
    // =========================================

    


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="ask-ai-loading">

                <div className="loading-spinner"></div>

                <p>
                    Loading meeting...
                </p>

            </div>

        );

    }


    // =========================================
    // ERROR / MEETING NOT FOUND
    // =========================================

    if (error && !meeting) {

        return (

            <div className="ask-ai-loading">

                <div className="meeting-error-icon">

                    <MessageCircleQuestion
                        size={24}
                    />

                </div>


                <h2>
                    Unable to open meeting
                </h2>


                <p>
                    {error}
                </p>


                <Link
                    to={`/meetings/${id}`}
                    className="primary-button"
                >

                    <ArrowLeft size={17} />

                    Back to meeting

                </Link>

            </div>

        );

    }


    // =========================================
    // MAIN UI
    // =========================================

    return (

        <div className="ask-ai-page">


            {/* =====================================
                HEADER
            ====================================== */}

            <header className="ask-ai-header">

                <Link
                    to={`/meetings/${id}`}
                    className="ask-ai-back"
                >

                    <ArrowLeft size={18} />

                    <span>
                        Back to meeting
                    </span>

                </Link>


                <div className="ask-ai-brand">

                    <div className="brand-icon">

                        <Brain size={20} />

                    </div>


                    <span>
                        AI Video Assistant
                    </span>

                </div>


                <div className="ask-ai-ready">

                    <span></span>

                    AI Ready

                </div>

            </header>



            {/* =====================================
                MAIN CONTENT
            ====================================== */}

            <main className="ask-ai-content">


                {/* =================================
                    PAGE INTRO
                ================================== */}

                <section className="ask-ai-intro">

                    <div className="ask-ai-badge">

                        <Sparkles size={15} />

                        RAG-powered meeting assistant

                    </div>


                    <h1>
                        Ask AI about this meeting
                    </h1>


                    <p>
                        Ask questions and get answers grounded
                        in the transcript of your meeting.
                    </p>


                    {meeting && (

                        <div className="ask-ai-meeting-info">

                            <div className="ask-ai-meeting-icon">

                                <CheckCircle2 size={17} />

                            </div>


                            <div>

                                <span>
                                    Meeting
                                </span>

                                <strong>
                                    {meeting.title}
                                </strong>

                            </div>

                        </div>

                    )}

                </section>



                {/* =================================
                    CHAT CONTAINER
                ================================== */}

                <section className="ask-ai-chat">


                    {/* CHAT HEADER */}

                    <div className="ask-ai-chat-header">

                        <div className="ask-ai-chat-agent">

                            <div className="chat-agent-icon">

                                <Sparkles size={20} />

                            </div>


                            <div>

                                <h2>
                                    AI Meeting Assistant
                                </h2>


                                <p>
                                    Answers are based on your
                                    meeting transcript.
                                </p>

                            </div>

                        </div>


                        <div className="chat-grounded">

                            <span></span>

                            Transcript grounded

                        </div>

                    </div>



                    {/* =================================
                        MESSAGES
                    ================================== */}

                    <div className="ask-ai-messages">


                        {messages.length === 0 && (

                            <div className="ask-ai-empty">

                                <div className="ask-ai-empty-icon">

                                    <MessageCircleQuestion
                                        size={27}
                                    />

                                </div>


                                <h3>
                                    What would you like to know?
                                </h3>


                                <p>
                                    Ask about topics, decisions,
                                    action items, or specific
                                    information discussed during
                                    the meeting.
                                </p>


                                <div className="ask-ai-suggestions">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSuggestion(
                                                "What were the main topics discussed?"
                                            )
                                        }
                                    >
                                        What were the main topics?
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSuggestion(
                                                "What were the key decisions made?"
                                            )
                                        }
                                    >
                                        What decisions were made?
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSuggestion(
                                                "What action items were discussed?"
                                            )
                                        }
                                    >
                                        What are the action items?
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSuggestion(
                                                "Were there any open questions?"
                                            )
                                        }
                                    >
                                        Any open questions?
                                    </button>

                                </div>

                            </div>

                        )}



                        {messages.map(
                            (message, index) => (

                                <div
                                    key={index}
                                    className={
                                        `ask-ai-message ${
                                            message.role === "user"
                                                ? "ask-ai-user"
                                                : "ask-ai-assistant"
                                        }`
                                    }
                                >

                                    <div className="ask-ai-message-icon">

                                        {message.role === "user"
                                            ? <User size={16} />
                                            : <Sparkles size={16} />
                                        }

                                    </div>


                                    <div className="ask-ai-message-body">

    <span className="ask-ai-message-role">
        {message.role === "user"
            ? "You"
            : "AI Assistant"
        }
    </span>

    <div className="ask-ai-markdown">
        <ReactMarkdown>
            {message.content}
        </ReactMarkdown>
    </div>

</div>

                                </div>

                            )
                        )}



                        {/* AI THINKING */}

                        {asking && (

                            <div className="ask-ai-message ask-ai-assistant">

                                <div className="ask-ai-message-icon">

                                    <Sparkles size={16} />

                                </div>


                                <div className="ask-ai-message-body">

                                    <span className="ask-ai-message-role">

                                        AI Assistant

                                    </span>


                                    <div className="ask-ai-thinking">

                                        <span></span>
                                        <span></span>
                                        <span></span>

                                    </div>

                                </div>

                            </div>

                        )}


                        <div ref={messagesEndRef} />

                    </div>



                    {/* =================================
                        ERROR
                    ================================== */}

                    {error && (

                        <div className="ask-ai-error">

                            {error}

                        </div>

                    )}



                    {/* =================================
                        INPUT
                    ================================== */}

                    <form
                        className="ask-ai-input"
                        onSubmit={handleAskQuestion}
                    >

                        <input
                            type="text"
                            value={question}
                            onChange={(event) =>
                                setQuestion(
                                    event.target.value
                                )
                            }
                            placeholder="Ask anything about this meeting..."
                            disabled={asking}
                        />


                        <button
                            type="submit"
                            disabled={
                                asking ||
                                !question.trim()
                            }
                        >

                            <Send size={18} />

                        </button>

                    </form>



                    {/* DISCLAIMER */}

                    <div className="ask-ai-disclaimer">

                        <Sparkles size={13} />

                        AI answers are generated using
                        the meeting transcript.

                    </div>

                </section>

            </main>

        </div>

    );

};


export default AskAI;