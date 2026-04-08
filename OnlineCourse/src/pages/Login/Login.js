import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from "jwt-decode";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault(); // 🚀 chặn reload

        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );
            const token = res.data.token;
            localStorage.setItem("token", token);

            // Decode token để lấy user data
            const user = jwtDecode(token);
            localStorage.setItem("user", JSON.stringify(user));

            console.log("User data:", user);
            console.log("User role:", user.type);

            window.location.href = "/courses";

        } catch (err) {
            console.log(err);
            alert("Login failed");
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>

                    {/* EMAIL */}
                    <div className="form-group">
                        <div className="input-wrapper">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                autoComplete="email"
                                onChange={e => setEmail(e.target.value)}
                            />
                            <label htmlFor="email">Email Address</label>
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="form-group">
                        <div className="input-wrapper password-wrapper">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                autoComplete="current-password"
                                onChange={e => setPassword(e.target.value)}
                            />
                            <label htmlFor="password">Password</label>
                        </div>
                    </div>

                    {/* OPTIONS */}
                    <div className="form-options">
                        <label className="remember-wrapper">
                            <input type="checkbox" />
                            <span className="checkbox-label">
                                Remember me
                            </span>
                        </label>

                        <a href="#" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>

                    {/* LOGIN BUTTON */}
                    <button type="submit" className="login-btn btn btn-primary">
                        Sign In
                    </button>

                </form>

                <div className="divider">
                    <span>or continue with</span>
                </div>

                <div className="social-login">
                    <button type="button" className="social-btn google-btn">
                        Google
                    </button>
                    <button type="button" className="social-btn github-btn">
                        GitHub
                    </button>
                </div>

                <div className="signup-link">
                    <p>Don't have an account? <a href="#">Sign up</a></p>
                </div>

            </div>
        </div>
    );
}