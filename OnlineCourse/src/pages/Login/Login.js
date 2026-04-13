import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );

            const token = res.data.token;
            localStorage.setItem("token", token);

            const user = jwtDecode(token);
            localStorage.setItem("user", JSON.stringify(user));

            console.log("User data:", user);
            console.log("Roles:", user.roles);

            //redirect theo role
            if (user.roles.includes("admin")) {
                navigate("/admin");
            } else if (user.roles.includes("teacher")) {
                navigate("/teacher");
            } else {
                navigate("/courses");
            }

        } catch (err) {
            console.log(err);
            alert("Login failed");
        }
    };

    // GOOGLE LOGIN
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/api/auth/google";
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>

                    <div className="form-group">
                        <div className="input-wrapper">
                            <input
                                type="email"
                                required
                                onChange={e => setEmail(e.target.value)}
                            />
                            <label>Email Address</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-wrapper">
                            <input
                                type="password"
                                required
                                onChange={e => setPassword(e.target.value)}
                            />
                            <label>Password</label>
                        </div>
                    </div>

                    <button type="submit" className="login-btn btn btn-primary">
                        Sign In
                    </button>

                </form>

                <div className="divider">
                    <span>or continue with</span>
                </div>

                <div className="social-login">
                    <button
                        type="button"
                        className="social-btn google-btn"
                        onClick={handleGoogleLogin}
                    >
                        Google
                    </button>
                </div>

            </div>
        </div>
    );
}