import { Link } from "react-router-dom";
import {
    ArrowRight,
    Brain,
    FileText,
    MessageSquare,
    Sparkles
} from "lucide-react";

const Landing = () => {
    return (
        <div className="landing-page">

            <nav className="landing-nav">
                <div className="brand">
                    <div className="brand-icon">
                        <Brain size={20} />
                    </div>

                    <span>AI Video Assistant</span>
                </div>

                <div className="nav-actions">
                    <Link to="/login" className="nav-login">
                        Log in
                    </Link>

                    <Link to="/register" className="nav-register">
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="hero">

                <div className="hero-badge">
                    <Sparkles size={15} />
                    AI-powered meeting intelligence
                </div>

                <h1>
                    Turn long videos into
                    <span> useful insights.</span>
                </h1>

                <p className="hero-description">
                    Upload a meeting recording or paste a YouTube video.
                    Get an accurate transcript, concise summary,
                    action items, decisions and answers from your meeting.
                </p>

                <div className="hero-actions">
                    <Link to="/register" className="primary-button">
                        Start analyzing
                        <ArrowRight size={18} />
                    </Link>

                    <Link to="/login" className="secondary-button">
                        Sign in
                    </Link>
                </div>

                <div className="feature-grid">

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FileText size={22} />
                        </div>

                        <h3>Smart Transcripts</h3>

                        <p>
                            Convert meeting audio into searchable text.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Brain size={22} />
                        </div>

                        <h3>AI Summaries</h3>

                        <p>
                            Extract the most important information automatically.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <MessageSquare size={22} />
                        </div>

                        <h3>Ask Your Meeting</h3>

                        <p>
                            Ask questions and retrieve answers from the transcript.
                        </p>
                    </div>

                </div>

            </main>
        </div>
    );
};

export default Landing;