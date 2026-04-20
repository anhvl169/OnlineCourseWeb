import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import './CourseCard.css'; // Xem file CSS bên dưới

export default function CourseCard({ course, instructors, categories }) {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const instructor = instructors.find(inst => inst.user_id === course.instructor_id);
    const category = categories.find(cate => cate.category_id === course.category_id);

    const handleAddCart = async (courseId, price, title, imgUrl) => {
        const result = await addToCart(courseId, price, title, imgUrl);
        if (result.success) {
            alert(result.message);
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="card h-100 course-card border-0 shadow-sm transition-hover">
            <div className="position-relative">
                <img
                    src={course.imgUrl || "https://via.placeholder.com/300x200"}
                    className="card-img-top course-image"
                    alt={course.title}
                />
                {category && (
                    <span className="badge bg-primary position-absolute top-0 start-0 m-3 shadow-sm">
                        {category.name}
                    </span>
                )}
            </div>

            <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-truncate-2 mb-2">{course.title}</h5>
                <p className="text-muted small mb-2">
                    <i className="bi bi-person-circle me-1"></i>
                    {instructor ? instructor.name : "Giảng viên ẩn danh"}
                </p>
                <p className="card-text text-secondary small flex-grow-1 text-truncate-3">
                    {course.description}
                </p>

                <div className="d-flex align-items-center justify-content-between mt-3">
                    <span className="fs-5 fw-bold text-dark">{course.price}đ</span>
                    <div className="btn-group shadow-sm">
                        <button
                            className="btn btn-outline-primary btn-sm px-3"
                            onClick={() => navigate(`/courses/detail/${course.course_id}`)}
                        >
                            Chi tiết
                        </button>
                        {course.status === 'active' && (
                            <button
                                className="btn btn-primary btn-sm px-3"
                                onClick={() => handleAddCart(course.course_id, course.price, course.title, course.imgUrl)}
                            >
                                <i className="bi bi-cart-plus"></i>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}