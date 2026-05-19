import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function NewPassword() {

    const { token } = useParams();

    const [password, setPassword] =
        useState("");
    const [message, setMessage] = useState("");
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(

                "http://localhost:5000/api/auth/new-password",

                {
                    token,
                    newPassword: password
                }
            );
            if (res.data.message) {
                setMessage(res.data.message);
                alert(message);
            } else {
                alert("Đổi mật khẩu thành công");
            }

        } catch (err) {

            alert(
                err.response && err.response.data && err.response.data.message
                    ? err.response.data.message
                    : "Error resetting password"
            );
        }
    };

    return (
        <div className="auth-wrapper d-flex align-items-center justify-content-center py-5">
            <form onSubmit={handleSubmit}>

                <input
                    type="password"
                    placeholder="New password"
                    onChange={e =>
                        setPassword(e.target.value)
                    }
                />

                <button type="submit">
                    Reset Password
                </button>

            </form>
        </div>
    );
}