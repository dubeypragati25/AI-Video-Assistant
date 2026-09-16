import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, LoaderCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            await register(name, email, password);
            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create account. Please try again."
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
                    <h1>Create your account</h1>
                    <p>Start turning meetings into actionable insights.</p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Your name"
                            required
                        />
                    </div>

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
                            placeholder="Create a password"
                            minLength={6}
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
                                Creating account...
                            </>
                        ) : (
                            "Create account"
                        )}
                    </button>

                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/login">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Register;