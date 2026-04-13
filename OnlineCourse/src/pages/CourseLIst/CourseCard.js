import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CourseCard({ course, instructors, categories }) {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAddCart = async (courseId, price, title, imgUrl) => {
        const result = await addToCart(courseId, price, title, imgUrl);
        if (result.success) {
            alert(result.message);
            // Tùy chọn: điều hướng đến giỏ hàng
            // navigate('/cart');
        } else {
            alert(result.message);
        }
    };
    return (
        <div className="card mt-4 mb-4 shadow-sm border-0"
            style={{ width: "18rem" }}
            key={course.course_id}>
            <img src={course.imgUrl} className="card-img-top" alt="..." />
            <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>

                <p className="card-text">
                    {
                        instructors.map(inst => {
                            if (inst.user_id === course.instructor_id) {
                                return <li className="list-group-item" key={inst.user_id}>Author: {inst.name}</li>
                            }
                        })
                    }
                </p>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">
                    <strong>Category :</strong>
                    {
                        categories.map(cate => {
                            if (cate.category_id === course.category_id) {
                                return (
                                    <span className="badge bg-secondary" key={cate.category_id}>{cate.name}</span>
                                )
                            }
                        })
                    }
                </li>

                <li className="list-group-item">
                    <strong>Status: </strong>
                    {course.status === 'active' ? (
                        <span className="badge bg-success">Active</span>
                    ) : (
                        <span className="badge bg-secondary">Inactive</span>
                    )}
                </li>
            </ul>
            <div className="card-body">
                <div className="d-grid gap-2 d-md-block">
                    {course.status === 'active' ? (
                        <>
                            <button className="btn btn-primary" type="button">View Details</button>
                            <button className="btn btn-warning" type="button" onClick={() => handleAddCart(course.course_id, course.price, course.title, course.imgUrl)}>Add to Cart</button>
                        </>
                    ) : (
                        <button className="btn btn-secondary" type="button" disabled>
                            Deactivated
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}