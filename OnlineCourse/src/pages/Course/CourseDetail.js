import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
export default function CourseDetail() {
    const [course, setCourse] = useState(null);
    const { id } = useParams();
    const { addToCart } = useCart();
    const fetchCourse = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/courses/detail/${id}`);
            setCourse(res.data.data);
        } catch (error) {
            console.error("Fetch course error:", error);
        }
    };
    const handleAddCart = async (courseId, price, title, imgUrl) => {
        const result = await addToCart(courseId, price, title, imgUrl);
        if (result.success) {
            alert(result.message);
        } else {
            alert(result.message);
        }
    };
    useEffect(() => {
        if (id) fetchCourse();
    }, [id]);

    if (!course) return <div className="text-center mt-5">Đang tải...</div>;

    return (
        <div className="container py-5">
            <div className="row py-5">
                {/* Cột trái: Thông tin chính */}
                <div className="col-lg-8">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Khóa học</a></li>
                            <li className="breadcrumb-item active">{course.title}</li>
                        </ol>
                    </nav>

                    <h1 className="fw-bold mb-3">{course.title}</h1>
                    <p className="lead text-secondary mb-4">{course.description}</p>

                    <div className="mb-5">
                        <img
                            src={course.imgUrl || "https://via.placeholder.com/800x450"}
                            alt={course.title}
                            className="img-fluid rounded-4 shadow-sm w-100"
                        />
                    </div>

                    <div className="content-section">
                        <h3 className="fw-bold">Bạn sẽ học được gì?</h3>
                        <div className="row g-3 mt-2">
                            {["Kiến thức nền tảng vững chắc", "Tư duy lập trình OOP", "Thực hành dự án thực tế"].map((item, index) => (
                                <div key={index} className="col-md-6 text-muted">
                                    <i className="bi bi-check-circle-fill text-success me-2"></i> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cột phải: Thẻ thanh toán (Sticky Sidebar) */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-lg sticky-top" style={{ top: '2rem', zIndex: 10 }}>
                        <div className="card-body p-4 text-center">
                            <h2 className="text-primary fw-bold mb-3">{course.price}đ</h2>
                            {course.status === 'active' ? (
                                <>
                                    <button className="btn btn-primary btn-lg w-100 mb-3 fw-bold rounded-pill">
                                        ĐĂNG KÝ NGAY
                                    </button>
                                    <button className="btn btn-warning btn-lg w-100 fw-bold rounded-pill"
                                        type="button"
                                        data-testid="add-to-cart-button"
                                        onClick={() => handleAddCart(course.course_id, course.price, course.title, course.imgUrl)}>
                                        Add to Cart
                                    </button>
                                </>
                            ) : (
                                <button className="btn btn-secondary" type="button" disabled>
                                    Deactivated
                                </button>
                            )}
                            <p className="text-muted small">Cam kết hoàn tiền trong 7 ngày</p>
                            <hr />
                            <div className="text-start">
                                <p className="mb-2"><i className="bi bi-play-circle me-2 text-primary"></i> 15 bài giảng</p>
                                <p className="mb-2"><i className="bi bi-clock me-2 text-primary"></i> Thời lượng 10h 30p</p>
                                <p className="mb-2"><i className="bi bi-reception-4 me-2 text-primary"></i> Trình độ: Cơ bản</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}