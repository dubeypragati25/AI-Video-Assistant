import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, LoaderCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to login. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-brand">
                    <div className="brand-icon">
                        <Brain size={21} />
                    </div>

                    <span>AI Video Assistant</span>
                </div>

                <div className="auth-heading">
                    <h1>Welcome back</h1>
                    <p>Sign in to continue to your meetings.</p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <LoaderCircle className="spin" size={18} />
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </button>

                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Create one
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;