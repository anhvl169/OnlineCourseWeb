import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate, Link } from "react-router-dom";
import './register.css'; // Dùng chung file CSS với Login

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const validateInput = () => {
        const { name, email, password } = form;
        if (!name.trim() || !email.trim() || !password.trim()) {
            alert("Vui lòng điền đầy đủ thông tin");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Email không đúng định dạng");
            return false;
        }
        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInput()) return;

        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", form);
            localStorage.setItem("token", res.data.token);
            alert("Đăng ký thành công!");
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Đăng ký thất bại");
        }
    };

    const handleGoogleRegister = () => {
        window.location.href = "http://localhost:5000/api/auth/google";
    };

    return (
        <div className="auth-wrapper d-flex align-items-center justify-content-center">
            <div className="card auth-card shadow-lg border-0 p-4">
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Tạo tài khoản</h2>
                    <p className="text-muted">Bắt đầu hành trình học tập của bạn</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="mb-3">
                        <label className="form-label fw-medium">Họ và tên</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-person text-muted"></i>
                            </span>
                            <input
                                name="name"
                                type="text"
                                className="form-control bg-light border-start-0 shadow-none"
                                placeholder="Nguyễn Văn A"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="mb-3">
                        <label className="form-label fw-medium">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-envelope text-muted"></i>
                            </span>
                            <input
                                name="email"
                                type="email"
                                className="form-control bg-light border-start-0 shadow-none"
                                placeholder="name@example.com"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                        <label className="form-label fw-medium">Mật khẩu</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-lock text-muted"></i>
                            </span>
                            <input
                                name="password"
                                type="password"
                                className="form-control bg-light border-start-0 shadow-none"
                                placeholder="Tối thiểu 6 ký tự"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mb-3 rounded-pill shadow-sm">
                        ĐĂNG KÝ NGAY
                    </button>
                </form>

                <div className="divider d-flex align-items-center my-3">
                    <hr className="flex-grow-1" />
                    <span className="mx-3 text-muted small text-uppercase">Hoặc</span>
                    <hr className="flex-grow-1" />
                </div>

                {/* Google Register Button */}
                <button 
                    type="button"
                    className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center py-2 rounded-pill mb-4"
                    onClick={handleGoogleRegister}
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                         alt="Google" style={{width: '20px', marginRight: '10px'}} />
                    Đăng ký bằng Google
                </button>

                <div className="text-center">
                    <span className="text-muted">Đã có tài khoản? </span>
                    <Link to="/login" className="text-primary fw-bold text-decoration-none">Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
}