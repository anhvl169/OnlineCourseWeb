import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import './login.css';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            const token = res.data.token;
            localStorage.setItem("token", token);
            const user = jwtDecode(token);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.roles.includes("admin")) navigate("/admin");
            else if (user.roles.includes("teacher")) navigate("/teacher");
            else navigate("/");
        } catch (err) {
            alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
        }
    };

    return (
        <div className="auth-wrapper d-flex align-items-center justify-content-center">
            <div className="card auth-card shadow-lg border-0 p-4">
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Chào mừng trở lại</h2>
                    <p className="text-muted">Đăng nhập để tiếp tục học tập</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-muted"></i></span>
                            <input
                                type="email"
                                className="form-control bg-light border-start-0 shadow-none"
                                placeholder="name@example.com"
                                required
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-medium">Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock text-muted"></i></span>
                            <input
                                type="password"
                                className="form-control bg-light border-start-0 shadow-none"
                                placeholder="••••••••"
                                required
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mb-3 rounded-pill">
                        ĐĂNG NHẬP
                    </button>
                </form>

                <div className="divider d-flex align-items-center my-4">
                    <hr className="flex-grow-1" />
                    <span className="mx-3 text-muted small text-uppercase">Hoặc với</span>
                    <hr className="flex-grow-1" />
                </div>

                <button
                    className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center py-2 rounded-pill mb-4"
                    onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                        alt="Google" style={{ width: '20px', marginRight: '10px' }} />
                    Tiếp tục với Google
                </button>

                <div className="text-center">
                    <span className="text-muted">Chưa có tài khoản? </span>
                    <Link to="/register" className="text-primary fw-bold text-decoration-none">Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
}