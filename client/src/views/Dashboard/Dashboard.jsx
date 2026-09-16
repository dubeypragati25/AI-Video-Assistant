import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    Brain,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    LogOut,
    MessageCircleQuestion,
    Plus,
    Sparkles,
    Video
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

const Dashboard = () => {
    const { user, logout } = useAuth();

    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let intervalId;

        const fetchMeetings = async (showLoading = false) => {
            try {
                if (showLoading) {
                    setLoading(true);
                }

                const response = await api.get("/meetings");

                setMeetings(
                    response.data.meetings || []
                );

            } catch (error) {
                console.error(
                    "Failed to fetch meetings:",
                    error
                );
            } finally {
                if (showLoading) {
                    setLoading(false);
                }
            }
        };

        // Initial fetch
        fetchMeetings(true);

        // Refresh when user returns to this browser tab
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchMeetings();
            }
        };

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        // Refresh every 5 seconds while Dashboard is open
        intervalId = setInterval(() => {
            if (!document.hidden) {
                fetchMeetings();
            }
        }, 5000);

        return () => {
            clearInterval(intervalId);

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, []);

    const completedMeetings = meetings.filter(
        (meeting) =>
            meeting.status === "completed"
    ).length;

    const processingMeetings = meetings.filter(
        (meeting) =>
            meeting.status === "processing"
    ).length;

    const totalQuestions = meetings.filter(
        (meeting) => meeting.openQuestions
    ).length;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };

    return (
        <div className="dashboard-page">

            {/* Sidebar */}

            <aside className="dashboard-sidebar">

                <div className="sidebar-brand">

                    <div className="brand-icon">
                        <Brain size={20} />
                    </div>

                    <span>
                        AI Video Assistant
                    </span>

                </div>

                <nav className="sidebar-nav">

                    <Link
                        to="/dashboard"
                        className="sidebar-link active"
                    >
                        <Sparkles size={18} />
                        Overview
                    </Link>

                    <Link
                        to="/meetings"
                        className="sidebar-link"
                    >
                        <Video size={18} />
                        Meetings
                    </Link>

                    <Link
                        to="/analytics"
                        className="sidebar-link"
                    >
                        <CalendarDays size={18} />
                        Analytics
                    </Link>

                </nav>

                <div className="sidebar-bottom">

                    <Link
                        to="/settings"
                        className="sidebar-link"
                    >
                        <Clock3 size={18} />
                        Settings
                    </Link>

                    <button
                        className="sidebar-logout"
                        onClick={logout}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>

                </div>

            </aside>

            {/* Main Content */}

            <main className="dashboard-main">

                {/* Header */}

                <header className="dashboard-header">

                    <div>

                        <p className="dashboard-eyebrow">
                            Workspace overview
                        </p>

                        <h1>
                            Welcome back,{" "}
                            {user?.name?.split(" ")[0]} 👋
                        </h1>

                        <p className="dashboard-subtitle">
                            Turn your meetings into searchable
                            knowledge and actionable insights.
                        </p>

                    </div>

                    <Link
                        to="/meetings/new"
                        className="new-meeting-button"
                    >
                        <Plus size={18} />
                        New Meeting
                    </Link>

                </header>

                {/* Stats */}

                <section className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon purple">
                            <Video size={20} />
                        </div>

                        <div>
                            <p>Total Meetings</p>
                            <h2>{meetings.length}</h2>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon green">
                            <CheckCircle2 size={20} />
                        </div>

                        <div>
                            <p>Completed</p>
                            <h2>
                                {completedMeetings}
                            </h2>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon orange">
                            <Clock3 size={20} />
                        </div>

                        <div>
                            <p>Processing</p>
                            <h2>
                                {processingMeetings}
                            </h2>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon blue">
                            <MessageCircleQuestion
                                size={20}
                            />
                        </div>

                        <div>
                            <p>AI Insights</p>
                            <h2>
                                {totalQuestions}
                            </h2>
                        </div>

                    </div>

                </section>

                {/* Recent Meetings */}

                <section className="meetings-section">

                    <div className="section-header">

                        <div>

                            <h2>
                                Recent Meetings
                            </h2>

                            <p>
                                Your latest analyzed meetings
                            </p>

                        </div>

                        <Link
                            to="/meetings"
                            className="view-all"
                        >
                            View all
                        </Link>

                    </div>

                    <div className="meeting-list">

                        {loading ? (

                            <div className="empty-state">

                                <div className="loading-spinner" />

                                <p>
                                    Loading your meetings...
                                </p>

                            </div>

                        ) : meetings.length === 0 ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    <FileText size={24} />
                                </div>

                                <h3>
                                    No meetings yet
                                </h3>

                                <p>
                                    Analyze your first meeting
                                    to see transcripts, summaries
                                    and insights here.
                                </p>

                                <Link
                                    to="/meetings/new"
                                    className="empty-button"
                                >
                                    <Plus size={17} />
                                    Analyze your first meeting
                                </Link>

                            </div>

                        ) : (

                            meetings
                                .slice(0, 5)
                                .map((meeting) => (

                                    <Link
                                        to={`/meetings/${meeting._id}`}
                                        className="meeting-row"
                                        key={meeting._id}
                                    >

                                        <div className="meeting-main">

                                            <div className="meeting-icon">
                                                <Video size={19} />
                                            </div>

                                            <div>

                                                <h3>
                                                    {meeting.title}
                                                </h3>

                                                <div className="meeting-meta">

                                                    <span>
                                                        {meeting.sourceType ===
                                                        "youtube"
                                                            ? "YouTube"
                                                            : "Uploaded file"}
                                                    </span>

                                                    <span>
                                                        •
                                                    </span>

                                                    <span>
                                                        {formatDate(
                                                            meeting.createdAt
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="meeting-status">

                                            <span
                                                className={`status-badge ${meeting.status}`}
                                            >
                                                {meeting.status ===
                                                "completed"
                                                    ? "Completed"
                                                    : meeting.status ===
                                                      "processing"
                                                    ? "Processing"
                                                    : "Failed"}
                                            </span>

                                        </div>

                                    </Link>

                                ))

                        )}

                    </div>

                </section>

            </main>

        </div>
    );
};

export default Dashboard;