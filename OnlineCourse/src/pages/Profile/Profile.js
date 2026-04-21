import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("account");
    const [accountInfo, setAccountInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        bio: "",
    });
    const [editMode, setEditMode] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        if (user) {
            // Lấy thông tin tài khoản
            fetchAccountInfo();
            // Lấy khóa đã tham gia
            fetchEnrolledCourses();
            // Lấy thông tin hóa đơn
            fetchInvoices();
        }
    }, [user]);

    const fetchAccountInfo = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:5000/api/users/profile/${user.userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                setAccountInfo({
                    name: data.name || user.name || "",
                    email: data.email || user.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    bio: data.bio || "",
                });
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin tài khoản:", error);
        }
    };

    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:5000/api/users/enrolled-courses/${user.userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                setEnrolledCourses(data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy khóa học đã tham gia:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:5000/api/users/invoices/${user.userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                setInvoices(data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin hóa đơn:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAccount = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:5000/api/users/profile/${user.userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(accountInfo),
                }
            );

            if (response.ok) {
                setMessage("Cập nhật thông tin tài khoản thành công!");
                setMessageType("success");
                setEditMode(false);
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("Cập nhật thông tin thất bại. Vui lòng thử lại!");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật tài khoản:", error);
            setMessage("Lỗi khi cập nhật thông tin!");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccountInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (!user) {
        return <div className="profile-container"><p>Vui lòng đăng nhập để xem hồ sơ cá nhân</p></div>;
    }

    return (
        <div className="container py-5 mt-4">
            {/* Header Profile */}
            <div className="row mb-5 align-items-center">
                <div className="col-md-auto">
                    <div className="avatar-lg bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fs-1 shadow">
                        {accountInfo.name?.charAt(0) || "U"}
                    </div>
                </div>
                <div className="col">
                    <h1 className="fw-bold mb-1">Hồ sơ cá nhân</h1>
                    <p className="text-muted mb-0">Chào mừng trở lại, <span className="text-primary fw-medium">{accountInfo.name}</span></p>
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
                <li className="nav-item flex-fill text-center">
                    <button className={`nav-link w-100 rounded-3 ${activeTab === "invoices" ? "active" : ""}`} onClick={() => setActiveTab("invoices")}>
                        <i className="bi bi-receipt me-2"></i>Hóa đơn
                    </button>
                </li>
            </ul>

            <div className="profile-content mt-4">
                {/* Tab 1: Thông tin tài khoản & Chỉnh sửa */}
                {activeTab === "account" && (
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0">Thông tin chi tiết</h4>
                            {!editMode ? (
                                <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={() => setEditMode(true)}>
                                    <i className="bi bi-pencil-square me-2"></i>Chỉnh sửa
                                </button>
                            ) : (
                                <div>
                                    <button className="btn btn-success btn-sm rounded-pill px-3 me-2" onClick={handleUpdateAccount}>Lưu</button>
                                    <button className="btn btn-light btn-sm rounded-pill px-3 border" onClick={() => setEditMode(false)}>Hủy</button>
                                </div>
                            )}
                        </div>

                        {message && <div className="alert alert-success rounded-3">{message}</div>}

                        <div className="row g-4">
                            {[
                                { label: "Họ và tên", name: "name", value: accountInfo.name, type: "text" },
                                { label: "Email Address", name: "email", value: accountInfo.email, type: "email", disabled: true },
                                { label: "Số điện thoại", name: "phone", value: accountInfo.phone, type: "tel" },
                                { label: "Địa chỉ", name: "address", value: accountInfo.address, type: "text" }
                            ].map((field) => (
                                <div className="col-md-6" key={field.name}>
                                    <label className="small text-muted fw-bold text-uppercase">{field.label}</label>
                                    {editMode ? (
                                        <input className="form-control mt-1 bg-light border-0 shadow-none p-2"
                                            name={field.name} value={field.value} onChange={handleInputChange} disabled={field.disabled} />
                                    ) : (
                                        <p className="border-bottom py-2 mb-0">{field.value || "Chưa cập nhật"}</p>
                                    )}
                                </div>
                            ))}
                            <div className="col-12">
                                <label className="small text-muted fw-bold text-uppercase">Tiểu sử</label>
                                {editMode ? (
                                    <textarea className="form-control mt-1 bg-light border-0 shadow-none p-2" rows="3"
                                        name="bio" value={accountInfo.bio} onChange={handleInputChange} />
                                ) : (
                                    <p className="py-2">{accountInfo.bio || "Chưa cập nhật"}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Khóa học đã tham gia */}
                {activeTab === "courses" && (
                    <div className="row g-4">
                        {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
                            <div className="col-md-4" key={course.course_id}>
                                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden course-card-hover">
                                    <img src={course.imgUrl || "/placeholder.jpg"} className="card-img-top" style={{ height: "160px", objectFit: "cover" }} alt="..." />
                                    <div className="card-body">
                                        <h6 className="fw-bold text-truncate-2">{course.title}</h6>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="progress flex-grow-1" style={{ height: "8px" }}>
                                                <div className="progress-bar bg-success" style={{ width: `${course.progress || 0}%` }}></div>
                                            </div>
                                            <span className="ms-2 small fw-bold text-muted">{course.progress || 0}%</span>
                                        </div>
                                        <button className="btn btn-primary btn-sm w-100 rounded-pill py-2">Tiếp tục học</button>
                                    </div>
                                </div>
                            </div>
                        )) : <div className="text-center py-5 text-muted">Bạn chưa tham gia khóa học nào.</div>}
                    </div>
                )}

                {/* Tab 3: Hóa đơn */}
                {activeTab === "invoices" && (
                    <div className="card border-0 shadow-sm rounded-4 p-0 overflow-hidden">
                        <div className="table-responsive text-nowrap">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4">Mã HĐ</th>
                                        <th>Ngày</th>
                                        <th>Tiền cuối</th>
                                        <th>Phương thức</th>
                                        <th>Trạng thái</th>
                                        <th className="text-center">Tác vụ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((inv) => (
                                        <tr key={inv.invoice_id}>
                                            <td className="ps-4 fw-medium text-primary">#{inv.invoice_id}</td>
                                            <td>{new Date(inv.created_at).toLocaleDateString("vi-VN")}</td>
                                            <td className="fw-bold">{parseFloat(inv.final_amount).toLocaleString()}đ</td>
                                            <td>{inv.payment_method}</td>
                                            <td>
                                                <span className={`badge rounded-pill px-3 py-2 ${inv.payment_status === 'success' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                                                    {inv.payment_status === 'success' ? 'Hoàn tất' : 'Đang xử lý'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <button className="btn btn-light btn-sm border">Chi tiết</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
