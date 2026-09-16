import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Brain,
    Link as LinkIcon,
    LoaderCircle,
    Play
} from "lucide-react";

import api from "../../services/api";

const NewMeeting = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [source, setSource] = useState("");
    const [language, setLanguage] = useState("english");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            const response = await api.post("/meetings", {
                title,
                sourceType: "youtube",
                source,
                language
            });

            const meeting = response.data.meeting;

            navigate(`/meetings/${meeting._id}`);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create meeting. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="new-meeting-page">

            <header className="new-meeting-header">

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

                    <span>AI Video Assistant</span>
                </div>

            </header>

            <main className="new-meeting-content">

                <div className="new-meeting-intro">

                    <div className="new-meeting-badge">
                        <Play size={15} />
                        New AI Analysis
                    </div>

                    <h1>
                        Analyze a meeting
                    </h1>

                    <p>
                        Paste a YouTube meeting, lecture, interview or
                        discussion and let AI turn it into useful insights.
                    </p>

                </div>

                <form
                    className="meeting-form"
                    onSubmit={handleSubmit}
                >

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <div className="form-group">

                        <label>
                            Meeting title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            placeholder="e.g. MySQL Joins Discussion"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            YouTube URL
                        </label>

                        <div className="input-with-icon">

                            <LinkIcon size={18} />

                            <input
                                type="url"
                                value={source}
                                onChange={(event) =>
                                    setSource(event.target.value)
                                }
                                placeholder="https://www.youtube.com/watch?v=..."
                                required
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label>
                            Transcript language
                        </label>

                        <select
                            value={language}
                            onChange={(event) =>
                                setLanguage(event.target.value)
                            }
                        >
                            <option value="english">
                                English
                            </option>

                            <option value="hinglish">
                                Hinglish
                            </option>
                        </select>

                    </div>

                    <div className="meeting-form-info">

                        <div className="info-icon">
                            <Brain size={18} />
                        </div>

                        <div>
                            <strong>
                                What you'll get
                            </strong>

                            <p>
                                Transcript, AI summary, action items,
                                key decisions and open questions.
                            </p>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="analyze-button"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <LoaderCircle
                                    size={18}
                                    className="spin"
                                />
                                Creating meeting...
                            </>
                        ) : (
                            <>
                                Analyze meeting
                                <Play size={17} />
                            </>
                        )}
                    </button>

                </form>

            </main>

        </div>
    );
};

export default NewMeeting;