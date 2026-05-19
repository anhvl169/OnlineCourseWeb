import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function ResetPassword() {
    const email = useRef("");
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email: email.current });
            alert("Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu trong hộp thư đến của mình.");
            console.log(res);
            if (res.data.message) {
                setMessage(res.data.message);
                alert(message);
            }
        } catch (err) {
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    }
    return (
        <div className="auth-wrapper d-flex align-items-center justify-content-center">
            <div className="card auth-card shadow-lg border-0 p-4">
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Khôi phục mật khẩu</h2>
                    <p className="text-muted">Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu</p>
                </div>
                <form onSubmit={handleReset}>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-muted"></i></span>
                            <input
                                type="email"
                                className="form-control bg-light border-start-0 shadow-none"
                                placeholder="name@example.com"
                                required
                                onChange={e => email.current = e.target.value}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mb-3 rounded-pill">
                        Gửi yêu cầu
                    </button>
                </form>
            </div>
        </div>
    );
}