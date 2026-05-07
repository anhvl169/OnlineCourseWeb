import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { useChat, ChatProvider } from "../../context/ChatContext";
const UserProfile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { createHumanConversation } = useChat();
    const [activeTab, setActiveTab] = useState("account");
    const [message, setMessage] = useState("");
    const fetchProfile = async () => {
        try {

            const token = localStorage.getItem("token");

            const res = await fetch(
                `http://localhost:5000/api/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            setProfile(data);
            console.log("USER PROFILE:", data);
        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchProfile();
    }, [id]);


    if (loading) return <div>Loading...</div>;

    if (!profile) return <div>Không tìm thấy người dùng này</div>;

    return (
        <ChatProvider>
            <div className="container py-5 mt-4">
                {/* Header Profile */}
                <div className="row mb-5 align-items-center">
                    <div className="col-md-auto">
                        <div className="avatar-lg bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fs-1 shadow">
                            {profile.name?.charAt(0) || "U"}
                        </div>
                    </div>
                    <div className="col">
                        <h1 className="fw-bold mb-1">Hồ sơ cá nhân</h1>
                        <p className="text-muted mb-0">Người dùng: <span className="text-primary fw-medium">{profile.name}</span></p>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <ul className="nav nav-pills mb-4 bg-white p-2 rounded-4 shadow-sm border">
                    <li className="nav-item flex-fill text-center">
                        <button className={`nav-link w-100 rounded-3 ${activeTab === "account" ? "active" : ""}`} onClick={() => setActiveTab("account")}>
                            <i className="bi bi-person-lines-fill me-2"></i>Tài khoản
                        </button>
                    </li>
                    <li className="nav-item flex-fill text-center">
                        <button className={`nav-link w-100 rounded-3 ${activeTab === "courses" ? "active" : ""}`} onClick={() => setActiveTab("courses")}>
                            <i className="bi bi-mortarboard me-2"></i>Khóa học
                        </button>
                    </li>
                </ul>

                <div className="profile-content mt-4">
                    {/* Tab 1: Thông tin tài khoản & Chỉnh sửa */}
                    {activeTab === "account" && (
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold mb-0">Thông tin chi tiết</h4>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => createHumanConversation(profile.user_id)}
                                >
                                    Chat
                                </button>
                            </div>

                            {message && <div className="alert alert-success rounded-3">{message}</div>}

                            <div className="row g-4">
                                {[
                                    { label: "Họ và tên", name: "name", value: profile.name, type: "text", disabled: true  },
                                    { label: "Email Address", name: "email", value: profile.email, type: "email", disabled: true },
                                    { label: "Số điện thoại", name: "phone", value: profile.phone, type: "tel" , disabled: true },
                                    { label: "Địa chỉ", name: "address", value: profile.address, type: "text" , disabled: true }
                                ].map((field) => (
                                    <div className="col-md-6" key={field.name}>
                                        <label className="small text-muted fw-bold text-uppercase">{field.label}</label>
                                        <input className="form-control mt-1 bg-light border-0 shadow-none p-2"
                                            name={field.name} value={field.value} disabled={field.disabled} readOnly />
                                    </div>
                                ))}
                                <div className="col-12">
                                    <label className="small text-muted fw-bold text-uppercase">Tiểu sử</label>

                                    <textarea className="form-control mt-1 bg-light border-0 shadow-none p-2" rows="3"
                                        name="bio" value={profile.bio || 'Chưa có tiểu sử'} readOnly disabled />

                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </ChatProvider>
    );
};

export default UserProfile;
